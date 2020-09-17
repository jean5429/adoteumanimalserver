const express = require('express');
const { check } = require('express-validator');

const animalsController = require('../controllers/animals-controller');

const router = express.Router();

router.get('/user/:userID', animalsController.getAnimalsByUserId);

router.get('/:animalID', animalsController.getAnimalById);

router.post(
    '/',
    [
        check('name').not().isEmpty(),
        check('city').not().isEmpty(),
        check('species').not().isEmpty(),
        check('owner').not().isEmpty(),
        check('name').isLength({ min: 2 }),
    ],
    animalsController.createAnimal
);

router.patch(
    '/:animalID',
    [
        check('name').not().isEmpty(),
        check('city').not().isEmpty(),
        check('name').isLength({ min: 2 }),
    ],
    animalsController.updateAnimal
);

router.delete('/:animalID', animalsController.deleteAnimal);

module.exports = router;
