const express = require('express');
const bodyParse = require('body-parser');

const animalsRoutes = require('./routes/animals-routes');

const port = 5000;
const app = express();

app.use('/api/animals', animalsRoutes);


app.listen(port);