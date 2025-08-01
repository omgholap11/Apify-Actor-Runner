const ApifyClient = require('../utils/apifyClient');

const handlerToExecuteTheActor =  async (req, res) => {

        console.log("Request arrived to execute the actor at executeHandler!!");
  try {
    const { actorId } = req.params;
    const { input = {}, options = {} } = req.body;
    const apiKey = req.headers['x-api-key'];

    // Validate inputs
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

    // Validate API key format
    if (!ApifyClient.isValidApiKeyFormat(apiKey)) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'INVALID_API_KEY_FORMAT',
          message: 'Invalid API key format. Expected format: apify_api_...'
        }
      });
    }

    // Validate input is an object
    if (typeof input !== 'object' || input === null) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'INVALID_INPUT',
          message: 'Input must be a valid JSON object'
        }
      });
    }

    // Set default options with safe limits
    const executionOptions = {
      timeout: Math.min(options.timeout || 300, 900), // Max 15 minutes
      memory: Math.min(options.memory || 512, 2048), // Max 2GB
      maxWaitTime: Math.min(options.maxWaitTime || 300, 900), // Max 15 minutes wait
      build: options.build || 'latest'
    };

    console.log(`Executing actor ${actorId} with input:`, JSON.stringify(input, null, 2));

    // Create Apify client
    const apifyClient = new ApifyClient(apiKey);

    // First, validate that the actor exists and get its schema for validation
    const schemaResult = await apifyClient.getActorSchema(actorId);
    if (!schemaResult.success) {
      const statusCode = schemaResult.error.type === 'AUTHENTICATION_ERROR' ? 401 : 
                        schemaResult.error.type === 'NOT_FOUND' ? 404 : 500;
      
      return res.status(statusCode).json({
        success: false,
        error: schemaResult.error
      });
    }

    // Only validate input if the actor has a proper schema with properties
    const hasValidSchema = schemaResult.data.inputSchema && 
                          Object.keys(schemaResult.data.inputSchema).length > 0 &&
                          schemaResult.data.inputSchema.properties;
    
    if (hasValidSchema) {
      const validationResult = validateInputAgainstSchema(input, schemaResult.data.inputSchema);
      if (!validationResult.valid) {
        return res.status(400).json({
          success: false,
          error: {
            type: 'INPUT_VALIDATION_ERROR',
            message: 'Input validation failed',
            details: validationResult.errors
          }
        });
      }
    } else {
      console.log('No valid schema found for actor, skipping input validation');
    }


    const executionResult = await apifyClient.executeActor(actorId, input, executionOptions);

    if (!executionResult.success) {
      const statusCode = executionResult.error.type === 'AUTHENTICATION_ERROR' ? 401 :
                        executionResult.error.type === 'NOT_FOUND' ? 404 :
                        executionResult.error.type === 'TIMEOUT' ? 408 :
                        executionResult.error.type === 'EXECUTION_FAILED' ? 422 : 500;

      return res.status(statusCode).json({
        success: false,
        error: executionResult.error
      });
    }


    res.json({
      success: true,
      data: {
        ...executionResult.data,
        input: input, // Include the input that was used
        options: executionOptions, // Include the options that were used
        actor: {
          id: schemaResult.data.id,
          name: schemaResult.data.name
        }
      }
    });

  } catch (error) {
    console.error('Error in execute route:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'SERVER_ERROR',
        message: 'Internal server error occurred during actor execution'
      }
    });
  }
}

const handlerToGetStatusOfTheActor = async (req, res) => {
  try {
    const { runId } = req.params;
    const apiKey = req.headers['x-api-key'];

    // Validate inputs
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'MISSING_API_KEY',
          message: 'API key is required in x-api-key header'
        }
      });
    }

    if (!runId) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'MISSING_RUN_ID',
          message: 'Run ID is required in the URL path'
        }
      });
    }

    // Validate API key format
    if (!ApifyClient.isValidApiKeyFormat(apiKey)) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'INVALID_API_KEY_FORMAT',
          message: 'Invalid API key format'
        }
      });
    }

    // Create Apify client
    const apifyClient = new ApifyClient(apiKey);

    // Get run status without waiting
    const result = await apifyClient.waitForRunCompletion(runId, 0); // Don't wait, just check status

    res.json(result);

  } catch (error) {
    console.error('Error in run status route:', error);
    res.status(500).json({
      success: false,
      error: {
        type: 'SERVER_ERROR',
        message: 'Internal server error occurred while checking run status'
      }
    });
  }
}

/**
 * Validate input against JSON schema (basic validation)
 * @param {Object} input - The input to validate
 * @param {Object} schema - The JSON schema
 * @returns {Object} Validation result
 */
function validateInputAgainstSchema(input, schema) {
  const errors = [];

  if (!schema || typeof schema !== 'object') {
    return { valid: true, errors: [] }; // No schema means no validation
  }

  // Check required fields
  if (schema.required && Array.isArray(schema.required)) {
    schema.required.forEach(requiredField => {
      if (!(requiredField in input) || input[requiredField] === null || input[requiredField] === undefined) {
        errors.push({
          field: requiredField,
          message: `Required field '${requiredField}' is missing or null`
        });
      }
    });
  }

  // Basic type checking for properties
  if (schema.properties) {
    Object.keys(input).forEach(fieldName => {
      const fieldSchema = schema.properties[fieldName];
      const fieldValue = input[fieldName];

      if (fieldSchema && fieldValue !== null && fieldValue !== undefined) {
        const typeError = validateFieldType(fieldName, fieldValue, fieldSchema);
        if (typeError) {
          errors.push(typeError);
        }
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validate a single field against its schema
 * @param {string} fieldName - Name of the field
 * @param {*} value - Value to validate
 * @param {Object} fieldSchema - Schema for the field
 * @returns {Object|null} Error object or null if valid
 */
function validateFieldType(fieldName, value, fieldSchema) {
  const expectedType = fieldSchema.type;

  switch (expectedType) {
    case 'string':
      if (typeof value !== 'string') {
        return {
          field: fieldName,
          message: `Expected string for field '${fieldName}', got ${typeof value}`
        };
      }
      // Check enum values
      if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
        return {
          field: fieldName,
          message: `Value '${value}' is not allowed for field '${fieldName}'. Allowed values: ${fieldSchema.enum.join(', ')}`
        };
      }
      break;

    case 'number':
      if (typeof value !== 'number' || isNaN(value)) {
        return {
          field: fieldName,
          message: `Expected number for field '${fieldName}', got ${typeof value}`
        };
      }
      break;

    case 'integer':
      if (!Number.isInteger(value)) {
        return {
          field: fieldName,
          message: `Expected integer for field '${fieldName}', got ${typeof value}`
        };
      }
      break;

    case 'boolean':
      if (typeof value !== 'boolean') {
        return {
          field: fieldName,
          message: `Expected boolean for field '${fieldName}', got ${typeof value}`
        };
      }
      break;

    case 'array':
      if (!Array.isArray(value)) {
        return {
          field: fieldName,
          message: `Expected array for field '${fieldName}', got ${typeof value}`
        };
      }
      break;

    case 'object':
      if (typeof value !== 'object' || Array.isArray(value)) {
        return {
          field: fieldName,
          message: `Expected object for field '${fieldName}', got ${typeof value}`
        };
      }
      break;
  }

  return null; // Valid
}



module.exports = {handlerToExecuteTheActor , handlerToGetStatusOfTheActor};