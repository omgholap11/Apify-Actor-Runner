const express = require('express');
const { handleToGetInputSchemaOfActor } = require('../Controllers/schemaHandlers.js');


const router = express.Router();

router.get('/:actorId', handleToGetInputSchemaOfActor);


module.exports = router;
