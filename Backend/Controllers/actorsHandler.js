const ApifyClient = require('../utils/apifyClient');



const handlerToGetListOfAllActors = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: {
          type: "MISSING_API_KEY",
          message: "API key is required in x-api-key header",
        },
      });
    }

    if (!ApifyClient.isValidApiKeyFormat(apiKey)) {
      return res.status(400).json({
        success: false,
        error: {
          type: "INVALID_API_KEY_FORMAT",
          message: "Invalid API key format. Expected format: apify_api_...",
        },
      });
    }

    // Creating new apify client
    const apifyClient = new ApifyClient(apiKey);

    // Fetch his created actors
    const result = await apifyClient.getActors();

    if (!result.success) {
      return res
        .status(result.error.type === "AUTHENTICATION_ERROR" ? 401 : 500)
        .json({
          success: false,
          error: result.error,
        });
    }

    const transformedActors = result.data.map((actor) => ({
      id: actor.id,
      name: actor.name,
      username: actor.username,
      title: actor.title,
      description: actor.description,
      stats: {
        totalRuns: actor.stats?.totalRuns || 0,
        totalUsers: actor.stats?.totalUsers || 0,
        totalMetamorphs: actor.stats?.totalMetamorphs || 0,
      },
      createdAt: actor.createdAt,
      modifiedAt: actor.modifiedAt,
      isPublic: actor.isPublic,
      taggedBuilds: actor.taggedBuilds,
    }));

    res.json({
      success: true,
      data: {
        actors: transformedActors,
        total: result.total,
        fetchedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in actors route:", error);
    res.status(500).json({
      success: false,
      error: {
        type: "SERVER_ERROR",
        message: "Internal server error occurred while fetching actors",
      },
    });
  }
};


module.exports = {handlerToGetListOfAllActors};