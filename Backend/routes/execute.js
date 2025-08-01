const express = require('express');
const { handlerToExecuteTheActor, handlerToGetStatusOfTheActor } = require('../Controllers/executeHandlers.js');

const router = express.Router();


router.post('/:actorId', handlerToExecuteTheActor);

router.get('/status/:runId', handlerToGetStatusOfTheActor);


module.exports = router;
