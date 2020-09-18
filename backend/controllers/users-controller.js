const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const USERS = [
    {
        id: '1',
        name: 'Jean Test',
        email: 'test@test.com',
        password: 'test',
    },
    {
        id: '2',
        name: 'Rafa',
        email: 'rafa@test.com',
        password: 'test',
    },
];

const getUsers = (req, res, next) => {
    console.log('GET users Request');
    res.json({ users: USERS });
};

const signup = (req, res, next) => {
    console.log('POST signup request');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Dados inválidos.', 422);
    }

    const { name, email, password } = req.body;

    const hasUser = USERS.find((u) => u.email === email);

    if (hasUser) {
        throw new HttpError('Usuário já existe.', 422);
    }

    const createdUser = {
        id: uuidv4(),
        name,
        email,
        password,
    };

    USERS.push(createdUser);

    res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
    console.log('POST login Request');
    const { email, password } = req.body;

    const identifiedUser = USERS.find((u) => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError(
            'Usuário não pode ser identificado, usuário ou senha inválidos',
            401
        );
    }

    res.json({ message: 'Usuário autenticado!' });
};

const deleteUser = (req, res, next) => {
    console.log('DELETE user request');
    const userID = req.params.userID;

    const user = USERS.find((u) => {
        return u.id === userID;
    });

    if (!user) {
        return next(
            new HttpError(
                'Não foi possível encontar um usuário para o id ' + userID,
                404
            )
        );
    }

    USERS = USERS.filter((u) => u.id !== userID);
    res.status(200).json({
        message: 'User deleted succesfully! ',
        user,
    });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.deleteUser = deleteUser;
