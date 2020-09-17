const express = require('express');

const animalsController = require('../controllers/animals-controller');

const router = express.Router();

router.get('/user/:userID', animalsController.getAnimalsByUserId);

router.get('/:animalID', animalsController.getAnimalById);

router.post('/', animalsController.createAnimal);

router.patch('/:animalID', animalsController.updateAnimal);

router.delete('/:animalID', animalsController.deleteAnimal);

module.exports = router;
