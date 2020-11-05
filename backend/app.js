const express = require('express');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');

const animalsRoutes = require('./routes/animals-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const port = 5000;
const app = express();

app.use(bodyParse.json());

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
 * mongodb+srv://admin:YjWXySawV7g38uw@cluster0.lkuio.mongodb.net/AdoteUmAnimal?retryWrites=true&w=majority
 * LocalHost:
 * mongodb://localhost:27017/AdoteUmAnimal
 */
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose
    .connect('mongodb://localhost:27017/AdoteUmAnimal')
    /*.connect(
        'mongodb://DESKTOP-3CTTGH1:27017,DESKTOP-3CTTGH1:27018,DESKTOP-3CTTGH1:27019?replicaSet=rs'
    )*/
    .then(() => {
        console.log('DB connected succesfully!');
        app.listen(port);
    })
    .catch((err) => {
        console.log('error');
        console.log(err);
    });
