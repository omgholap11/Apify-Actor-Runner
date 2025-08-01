const axios = require('axios');

class ApifyClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.apify.com/v2';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 seconds timeout
    });
  }

  /**
   * Get all actors for the authenticated user
   * @returns {Promise<Array>} List of actors
   */
  async getActors() {
    try {
      const response = await this.client.get('/acts');
      return {
        success: true,
        data: response.data.data.items || [],
        total: response.data.data.total || 0
      };
    } catch (error) {
      console.error('Error fetching actors:', error.response?.data || error.message);
      return {
        success: false,
        error: this.handleApiError(error)
      };
    }
  }

  /**
   * Get specific actor details including input schema
   * @param {string} actorId - The actor ID
   * @returns {Promise<Object>} Actor details with schema
   */
  async getActorSchema(actorId) {
    try {
      const response = await this.client.get(`/acts/${actorId}`);
      const actor = response.data.data;
      
console.log('Raw actor data:', {
      id: actor.id,
      name: actor.name,
      inputSchema: actor.inputSchema,
      hasInputSchema: !!actor.inputSchema,
      inputSchemaType: typeof actor.inputSchema,
      inputSchemaKeys: actor.inputSchema ? Object.keys(actor.inputSchema) : 'N/A'
    });

    

     return {
  success: true,
  data: {
    id: actor.id,
    name: actor.name,
    title: actor.title || actor.name, // fallback to name if title is null
    username: actor.username,
    userId: actor.userId,
    createdAt: actor.createdAt,
    modifiedAt: actor.modifiedAt,
    lastRunStartedAt: actor.lastRunStartedAt,
    description: actor.description,
    readme: actor.readme,
    
    // Schema and Configuration
    inputSchema: actor.inputSchema || {},
    outputSchema: actor.outputSchema || {},
    examples: actor.exampleRunInput || {},
    
    // Runtime Configuration
    defaultRunOptions: {
      build: actor.defaultRunOptions?.build || 'latest',
      timeoutSecs: actor.defaultRunOptions?.timeoutSecs || 360,
      memoryMbytes: actor.defaultRunOptions?.memoryMbytes || 256
    },
    
    // Actor Status and Properties
    isPublic: actor.isPublic || false,
    isDeprecated: actor.isDeprecated || false,
    isAnonymouslyRunnable: actor.isAnonymouslyRunnable || false,
    
    // Version Information
    version: {
      versionNumber: actor.version?.versionNumber,
      buildTag: actor.version?.buildTag || 'latest',
      sourceType: actor.version?.sourceType
    },
    
    // Statistics
    stats: {
      totalBuilds: actor.stats?.totalBuilds || 0,
      totalRuns: actor.stats?.totalRuns || 0,
      totalUsers: actor.stats?.totalUsers || 0,
      totalUsers7Days: actor.stats?.totalUsers7Days || 0,
      totalUsers30Days: actor.stats?.totalUsers30Days || 0,
      totalUsers90Days: actor.stats?.totalUsers90Days || 0,
      lastRunStartedAt: actor.stats?.lastRunStartedAt
    },
    
    // Categories and Tags (if published)
    categories: actor.categories || [],
    
    // Additional useful fields
    taggedBuilds: actor.taggedBuilds || {},
    
    // Fetch timestamp for your app
    fetchedAt: new Date().toISOString()
  }
   };
    } catch (error) {
      console.error('Error fetching actor schema:', error.response?.data || error.message);
      return {
        success: false,
        error: this.handleApiError(error)
      };
    }
  }

  /**
   * Execute an actor with given input
   * @param {string} actorId - The actor ID
   * @param {Object} input - Input data for the actor
   * @param {Object} options - Additional options (timeout, memory, etc.)
   * @returns {Promise<Object>} Execution result
   */
  async executeActor(actorId, input = {}, options = {}) {
    try {
      // Start the actor run
      const runResponse = await this.client.post(`/acts/${actorId}/runs`, {
        ...input, // Spread the input directly at the top level
        timeout: options.timeout || 300, // 5 minutes default
        memory: options.memory || 512, // 512MB default
        build: options.build || 'latest'
      });

      const runId = runResponse.data.data.id;
      console.log(`Actor run started with ID: ${runId}`);

      // Wait for the run to complete
      const result = await this.waitForRunCompletion(runId, options.maxWaitTime || 300);
      
      return result;
    } catch (error) {
      console.error('Error executing actor:', error.response?.data || error.message);
      return {
        success: false,
        error: this.handleApiError(error)
      };
    }
  }

  /**
   * Wait for actor run completion and get results
   * @param {string} runId - The run ID
   * @param {number} maxWaitTime - Maximum wait time in seconds
   * @returns {Promise<Object>} Run result
   */
  async waitForRunCompletion(runId, maxWaitTime = 300) {
    const startTime = Date.now();
    const checkInterval = 2000; // Check every 2 seconds

    while (Date.now() - startTime < maxWaitTime * 1000) {
      try {
        const runResponse = await this.client.get(`/actor-runs/${runId}`);
        const run = runResponse.data.data;

        if (run.status === 'SUCCEEDED') {
          // Get the dataset items (results)
          const datasetResponse = await this.client.get(`/datasets/${run.defaultDatasetId}/items`);
          
          return {
            success: true,
            data: {
              runId: runId,
              status: run.status,
              startedAt: run.startedAt,
              finishedAt: run.finishedAt,
              stats: run.stats,
              results: datasetResponse.data || []
            }
          };
        } else if (run.status === 'FAILED' || run.status === 'ABORTED' || run.status === 'TIMED-OUT') {
          return {
            success: false,
            error: {
              type: 'EXECUTION_FAILED',
              message: `Actor run ${run.status.toLowerCase()}`,
              details: {
                runId: runId,
                status: run.status,
                statusMessage: run.statusMessage,
                stats: run.stats
              }
            }
          };
        }

        // Still running, wait before next check
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      } catch (error) {
        console.error('Error checking run status:', error.message);
        return {
          success: false,
          error: this.handleApiError(error)
        };
      }
    }

    // Timeout reached
    return {
      success: false,
      error: {
        type: 'TIMEOUT',
        message: `Actor run timed out after ${maxWaitTime} seconds`,
        details: { runId: runId }
      }
    };
  }

  /**
   * Handle API errors and return user-friendly messages
   * @param {Error} error - The error object
   * @returns {Object} Formatted error response
   */
  handleApiError(error) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 401:
          return {
            type: 'AUTHENTICATION_ERROR',
            message: 'Invalid API key or authentication failed',
            details: data
          };
        case 404:
          return {
            type: 'NOT_FOUND',
            message: 'Actor or resource not found',
            details: data
          };
        case 429:
          return {
            type: 'RATE_LIMIT',
            message: 'Rate limit exceeded, please try again later',
            details: data
          };
        case 400:
          return {
            type: 'BAD_REQUEST',
            message: 'Invalid request parameters',
            details: data
          };
        default:
          return {
            type: 'API_ERROR',
            message: data?.error?.message || 'Unknown API error occurred',
            details: data
          };
      }
    } else if (error.code === 'ECONNABORTED') {
      return {
        type: 'TIMEOUT',
        message: 'Request timed out',
        details: { timeout: true }
      };
    } else {
      return {
        type: 'NETWORK_ERROR',
        message: 'Network error occurred',
        details: { message: error.message }
      };
    }
  }

  /**
   * Validate API key format
   * @param {string} apiKey - The API key to validate
   * @returns {boolean} Whether the API key format is valid
   */
  static isValidApiKeyFormat(apiKey) {
    
    return typeof apiKey === 'string' && 
           apiKey.length > 10 && 
           /^apify_api_[a-zA-Z0-9]+$/.test(apiKey);
  }
}

module.exports = ApifyClient;
