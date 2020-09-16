const express = require('express');

const animalsControllers = require('../controllers/animals-controller');

const router = express.Router();

router.get('/user/:userID', animalsControllers.getAnimalsByUserId);

router.get('/:animalID', animalsControllers.getAnimalById);

router.post('/', animalsControllers.createAnimal);

module.exports = router;
