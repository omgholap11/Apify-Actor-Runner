const express = require('express');
const { handlerToGetListOfAllActors } = require('../Controllers/actorsHandler.js');

const router = express.Router();

router.get('/', handlerToGetListOfAllActors );


module.exports = router;
