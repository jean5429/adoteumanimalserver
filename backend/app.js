const express = require('express');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');

const animalsRoutes = require('./routes/animals-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const port = 5000;
const app = express();

app.use(bodyParse.json());

app.use((req, res, next) => {
    /*res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');*/
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Methods', 'PATCH, GET,PUT,POST,DELETE');
    res.append(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    next();
});

app.use('/api/animal', animalsRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Não foi possível encontrar esta rota', 404);
    throw Error(error);
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'Erro desconhecido!' });
});
/*
 * MongoDB Atlas Connection - Just in case:
 * Use MongoDB Atlas URL
 * LocalHost:
 * mongodb://localhost:27017/AdoteUmAnimal
 */
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose
    .connect('mongodb://localhost:27017/AdoteUmAnimal')
    .then(() => {
        console.log('DB connected succesfully!');
        app.listen(port);
    })
    .catch((err) => {
        console.log('error: ');
        console.log(err);
    });
