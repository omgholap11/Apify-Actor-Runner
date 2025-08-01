const ApifyClient = require('../utils/apifyClient');


const handleToGetInputSchemaOfActor = async (req, res) => {
  try {
    const { actorId } = req.params;
    const apiKey = req.headers['x-api-key'];


    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'MISSING_API_KEY',
          message: 'API key is required in x-api-key header'
        }
      });
    }

    if (!actorId) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'MISSING_ACTOR_ID',
          message: 'Actor ID is required in the URL path'
        }
      });
    }


    if (!ApifyClient.isValidApiKeyFormat(apiKey)) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'INVALID_API_KEY_FORMAT',
          message: 'Invalid API key format. Expected format: apify_api_...'
        }
      });
    }

    // Create Apify client
    const apifyClient = new ApifyClient(apiKey);

    // Fetch actor schema
    const result = await apifyClient.getActorSchema(actorId);

    if (!result.success) {
      const statusCode = result.error.type === 'AUTHENTICATION_ERROR' ? 401 : 
                        result.error.type === 'NOT_FOUND' ? 404 : 500;
      
      return res.status(statusCode).json({
        success: false,
        error: result.error
      });
    }

    // Extract the complete actor data from ApifyClient
    const completeActorData = result.data;

    console.log('Complete actor data from ApifyClient:', completeActorData);

    res.json({
      success: true,
      data: completeActorData // Return the complete response from ApifyClient
    });

  } catch (error) {
    console.error('Error in schema route:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'SERVER_ERROR',
        message: 'Internal server error occurred while fetching schema'
      }
    });
  }
}

/**
 * Process the input schema to make it more frontend-friendly
 * @param {Object} schema - The JSON schema from Apify
 * @param {Object} examples - Example input data
 * @returns {Object} Processed schema with UI hints
 */
function processInputSchema(schema, examples = {}) {
  if (!schema || typeof schema !== 'object') {
    return {
      type: 'object',
      properties: {},
      ui_hints: {
        message: 'No input schema available for this actor',
        allow_free_form: true
      }
    };
  }

  const processed = {
    ...schema,
    ui_hints: {
      form_fields: [],
      field_order: [],
      categories: {}
    }
  };

  // Process properties to add UI hints
  if (schema.properties) {
    Object.keys(schema.properties).forEach(fieldName => {
      const field = schema.properties[fieldName];
      const uiHint = processFieldForUI(fieldName, field, examples[fieldName]);
      processed.ui_hints.form_fields.push(uiHint);
      processed.ui_hints.field_order.push(fieldName);
    });
  }

  // Add required fields information
  if (schema.required && Array.isArray(schema.required)) {
    processed.ui_hints.required_fields = schema.required;
  }

  return processed;
}

/**
 * Process individual field for UI rendering
 * @param {string} fieldName - Name of the field
 * @param {Object} field - Field schema definition
 * @param {*} exampleValue - Example value for this field
 * @returns {Object} UI hint object for the field
 */
function processFieldForUI(fieldName, field, exampleValue) {
  const uiHint = {
    name: fieldName,
    type: field.type || 'string',
    title: field.title || fieldName,
    description: field.description || '',
    required: false, // Will be set by parent function
    default: field.default,
    example: exampleValue
  };

  // Handle different field types
  switch (field.type) {
    case 'string':
      if (field.enum) {
        uiHint.widget = 'select';
        uiHint.options = field.enum.map(value => ({ value, label: value }));
      } else if (field.format === 'uri') {
        uiHint.widget = 'url';
        uiHint.placeholder = 'https://example.com';
      } else if (fieldName.toLowerCase().includes('password') || fieldName.toLowerCase().includes('secret')) {
        uiHint.widget = 'password';
      } else if (field.description && field.description.length > 100) {
        uiHint.widget = 'textarea';
      } else {
        uiHint.widget = 'input';
        uiHint.placeholder = field.example || exampleValue || `Enter ${fieldName}`;
      }
      break;

    case 'number':
    case 'integer':
      uiHint.widget = 'number';
      uiHint.min = field.minimum;
      uiHint.max = field.maximum;
      uiHint.step = field.type === 'integer' ? 1 : 0.1;
      break;

    case 'boolean':
      uiHint.widget = 'checkbox';
      break;

    case 'array':
      uiHint.widget = 'array';
      uiHint.items = field.items;
      if (field.items && field.items.type === 'string') {
        uiHint.arrayType = 'string_list';
        uiHint.placeholder = 'Enter items separated by commas';
      }
      break;

    case 'object':
      uiHint.widget = 'object';
      uiHint.properties = field.properties;
      break;

    default:
      uiHint.widget = 'input';
      uiHint.placeholder = `Enter ${fieldName}`;
  }

  return uiHint;
}


module.exports = {handleToGetInputSchemaOfActor};