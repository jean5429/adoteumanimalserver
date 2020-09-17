const { v4: uuidv4 } = require('uuid');

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
    res.json({ users: USERS });
};

const signup = (req, res, next) => {
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

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
