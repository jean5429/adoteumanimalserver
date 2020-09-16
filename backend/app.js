const express = require('express');
const bodyParse = require('body-parser');

const animalsRoutes = require('./routes/animals-routes');
const HttpError = require('./models/http-error');

const port = 5000;
const app = express();

app.use(bodyParse.json());

app.use('/api/animal', animalsRoutes);

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

app.listen(port);
