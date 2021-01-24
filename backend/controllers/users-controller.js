const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

//Examples
/*const USERS = [
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
];*/

const getUsers = async (req, res, next) => {
    /*
     ** This function below is using -password to not get the password
     **  when getting the users from the database. We could also be doing
     ** it the opposite, getting only what we want: 'email password'
     */
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Carregamento dos usuários falhou, por favor tente novamente mais tarde.',
            500
        );
        return next(error);
    }
    res.json({
        users: users.map((user) => user.toObject({ getters: true })),
    });
};

const signup = async (req, res, next) => {
    console.log('POST signup request');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Dados inválidos.', 422));
    }

    const { name, email, password, type } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Falha no cadastro, por favor tente novamente mais tarde.',
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            'O usuário já existe, por favor faço o login',
            422
        );
    }
    const imgAddress = req.file.path
        ? req.file.path
        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSwZrJUFAW-Bg-21tnCy9w3fiq8xTSqV5viqA&usqp=CAU';

    const createdUser = new User({
        name,
        email,
        password,
        type,
        image: imgAddress,
        animals: [],
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Cadastro de usuário falhou, por favor tente novamente',
            500
        );
        return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
    console.log('POST login Request');
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Falha no login, por favor tente novamente mais tarde.',
            500
        );
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            'Usuário não pode ser identificado, usuário ou senha inválidos',
            401
        );
        return next(error);
    }

    res.json({
        message: 'Usuário autenticado!',
        user: existingUser.toObject({ getters: true }),
    });
};

const deleteUser = async (req, res, next) => {
    console.log('DELETE user request');
    const userID = req.params.userID;

    let user;

    try {
        user = await User.findById(userID);
    } catch (err) {
        const error = new HttpError(
            'Algo deu errado, não foi possível remover o usuário.',
            500
        );
        return next(error);
    }

    if (!user) {
        return next(
            new HttpError(
                'Não foi possível encontar um usuário para o id ' + userID,
                404
            )
        );
    }

    try {
        await user.remove();
    } catch (err) {
        const error = new HttpError(
            'Algo deu errado, não foi possível remover o usuário.',
            500
        );
        return next(error);
    }
    res.status(200).json({
        message: 'User deleted succesfully! ',
        user,
    });
};

const updateUser = async (req, res, next) => {
    console.log('UPDATE user request');
    const userID = req.params.userID;
    const { password, type } = req.body;

    let updatedUser;

    try {
        updatedUser = await User.findById(userID);
    } catch (err) {
        const error = new HttpError(
            'Algo deu errado, não foi possível atualizar o usuário.',
            500
        );
        return next(error);
    }

    if (!updatedUser) {
        return next(
            new HttpError(
                'Não foi possível encontar um usuário para o id ' + userID,
                404
            )
        );
    }

    let imgAddress;
    if (req.hasOwnProperty('file')) {
        imgAddress = req.file.path;
    } else {
        imgAddress =
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSwZrJUFAW-Bg-21tnCy9w3fiq8xTSqV5viqA&usqp=CAU';
    }

    updatedUser.password = password;
    updatedUser.type = type;
    updatedUser.image = imgAddress;

    try {
        await updatedUser.save();
    } catch (err) {
        const error = new HttpError(
            'Atualização de usuário falhou, por favor tente novamente',
            500
        );
        return next(error);
    }

    res.status(201).json({ user: updatedUser.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
