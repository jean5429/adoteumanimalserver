const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const animalSchema = new Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    species: { type: String, required: true },
    image: { type: String, required: true },
    owner: { type: Number, required: true },
    description: String,
    appearance: String,
});

module.exports = mongoose.model('Animal', animalSchema);
