const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controller');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
    '/signup',
    fileUpload.single('image'),
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 8 }),
    ],
    usersController.signup
);

router.post('/login', usersController.login);

router.delete('/:userID', usersController.deleteUser);

router.patch('/:userID', usersController.updateUser);

module.exports = router;
