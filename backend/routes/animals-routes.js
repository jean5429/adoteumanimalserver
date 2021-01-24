const express = require('express');
const { check } = require('express-validator');

const animalsController = require('../controllers/animals-controller');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/user/:userID', animalsController.getAnimalsByUserId);

router.get('/:animalID', animalsController.getAnimalById);

router.get('/', animalsController.getAnimals);

router.post(
    '/',
    fileUpload.single('image'),
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
        check('description').not().isEmpty(),
        check('appearance').not().isEmpty(),
        check('city').not().isEmpty(),
        check('description').isLength({ min: 2 }),
        check('city').isLength({ min: 2 }),
        check('appearance').isLength({ min: 2 }),
    ],
    animalsController.updateAnimal
);

router.delete('/:animalID', animalsController.deleteAnimal);

module.exports = router;
