const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Animal = require('../models/animal');

let ANIMALS = [
    {
        id: '1',
        name: 'Caramelo',
        city: 'Americana',
        species: 'dog',
        image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSwZrJUFAW-Bg-21tnCy9w3fiq8xTSqV5viqA&usqp=CAU',
        owner: '1',
        description: 'Animal super amigável',
        appearance: 'Cor caramelo',
    },
    {
        id: '2',
        name: 'Totó',
        city: 'SBO',
        species: 'dog',
        image:
            'https://portaldoscaesegatos.com.br/wp-content/uploads/2017/07/adotar-1.jpg',
        owner: '1',
        description: '',
        appearance: '',
    },
    {
        id: '3',
        name: 'Rex',
        city: 'Sumaré',
        species: 'dog',
        image:
            'https://fotos.amomeupet.org/uploads/fotos/1300x0_1568662224_5d7fe2d09bccd.jpeg',
        owner: '1',
        description: '',
        appearance: '',
    },
    {
        id: '4',
        name: 'Bob',
        city: 'Nova Odessa',
        species: 'dog',
        image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTGg2H4lrGBx6t_GEqmgW8Tb0Ps0_i772DAAg&usqp=CAU',
        owner: '1',
        description: '',
        appearance: '',
    },
    {
        id: '5',
        name: 'Thor',
        city: 'Americana',
        species: 'dog',
        image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTT_ZUQF9nNH-UIpuTaIt9SSK4SjIlKUmPCSA&usqp=CAU',
        owner: '1',
        description: '',
        appearance: '',
    },
    {
        id: '6',
        name: 'Pingo',
        city: 'SBO',
        species: 'dog',
        image:
            'https://img.jornalcruzeiro.com.br/img/2013/07/12/media/85269_CSL030212L004F26.jpg',
        owner: '1',
        description: '',
        appearance: '',
    },
    {
        id: '7',
        name: 'Chico',
        city: 'Sumaré',
        species: 'dog',
        image:
            'https://s2.glbimg.com/TdPTg4jg3ZqtmZtyFnuHehXLgmk=/0x314:720x1073/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2019/B/x/gU7r6UTvyFwLn5G5FlUg/whatsapp-image-2019-02-22-at-14.53.02.jpeg',
        owner: '1',
        description: '',
        appearance: '',
    },
    {
        id: '8',
        name: 'Paçoca',
        city: 'Nova Odessa',
        species: 'dog',
        image:
            'https://www.petz.com.br/cachorro/racas/vira-lata/img/vira-lata-saudavel.webp',
        owner: '2',
        description: '',
        appearance: '',
    },
    {
        id: '9',
        name: 'Pipoca',
        city: 'Americana',
        species: 'cat',
        image:
            'https://www.realh.com.br/drhomeopet/wp-content/uploads/2016/02/cat.jpg',
        owner: '2',
        description:
            'Gatinha super carinhosa, seu hobb favorita é caçar as pessoas',
        appearance: 'Tricolor',
    },
    {
        id: '10',
        name: 'Solar',
        city: 'SBO',
        species: 'cat',
        image:
            'https://www.significadodossonhos.inf.br/wp-content/uploads/2019/07/Sonhar-com-gato-amarelo3.jpg',
        owner: '1',
        description: '',
        appearance: '',
    },
    {
        id: '11',
        name: 'Artévius',
        city: 'SBO',
        species: 'cat',
        image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTMBAeVGLnqFW0bV86x8x4_kUbdZHOrZkR1DA&usqp=CAU',
        owner: '2',
        description: '',
        appearance: '',
    },
    {
        id: '12',
        name: 'Luna',
        city: 'SBO',
        species: 'cat',
        image:
            'https://www.petvale.com.br/imagens/62757-vira-lata-femea-perdido-cajuru-curitiba-pr_23962.jpg',
        owner: '1',
        description: '',
        appearance: '',
    },
];

const getAnimalsByUserId = async (req, res, next) => {
    console.log('GET Request in Animals by userID');
    const userID = req.params.userID;
    let animals;

    try {
        animals = await Animal.find({ owner: userID });
    } catch (err) {
        const error = new HttpError(
            'Algo deu errado, não foi possível encontrar animais para o usuário.',
            500
        );
        return next(error);
    }

    if (!animals || animals.length === 0) {
        const error = new HttpError(
            'Não foi possível encontar animais para o usuário.',
            404
        );
        return next(error);
    }

    res.json({
        animals: animals.map((animal) => animal.toObject({ getters: true })),
    });
};

const getAnimalById = async (req, res, next) => {
    console.log('GET Request in Animals by animalID');
    const animalID = req.params.animalID;
    let animal;
    try {
        animal = await Animal.findById(animalID);
    } catch (err) {
        const error = new HttpError(
            'Algo deu errado, não foi possível encontrar o animal.',
            500
        );
        return next(error);
    }

    if (!animal) {
        const error = new HttpError(
            'Não foi possível encontar um animal para o id ' + animalID,
            404
        );
        return next(error);
    }

    res.json({ animal: animal.toObject({ getters: true }) });
};

const createAnimal = async (req, res, next) => {
    console.log('POST Request creating Animal');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Dados inválidos.', 422);
    }

    const {
        name,
        city,
        species,
        image,
        owner,
        description,
        appearance,
    } = req.body;

    if (species !== 'dog' && species !== 'cat') {
        throw new HttpError('Campo species deve ser cat ou dog', 422);
    }
    const createdAnimal = new Animal({
        name,
        city,
        species,
        image,
        owner,
        description,
        appearance,
    });

    try {
        await createdAnimal.save();
    } catch (err) {
        const error = new HttpError(
            'Cadastro de animal falho, por favor tente novamente',
            500
        );
        return next(error);
    }

    res.status(201).json({ animal: createdAnimal });
};

const updateAnimal = (req, res, next) => {
    console.log('PATCH Request updating Animal');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Dados inválidos.', 422);
    }

    const { name, city, image, description, appearance } = req.body;
    const animalID = req.params.animalID;

    const updatedAnimal = { ...ANIMALS.find((a) => a.id === animalID) };

    if (!updatedAnimal) {
        return next(
            new HttpError(
                'Não foi possível encontar um animal para o id ' + animalID,
                404
            )
        );
    }

    const animalIndex = ANIMALS.findIndex((a) => a.id === animalID);
    updatedAnimal.name = name;
    updatedAnimal.city = city;
    updatedAnimal.image = image;
    updatedAnimal.description = description;
    updatedAnimal.appearance = appearance;

    ANIMALS[animalIndex] = updatedAnimal;

    res.status(200).json({ animal: updatedAnimal });
};

const deleteAnimal = (req, res, next) => {
    console.log('DELETE Request deleting Animal');
    const animalID = req.params.animalID;

    const animal = ANIMALS.find((a) => {
        return a.id === animalID;
    });

    if (!animal) {
        return next(
            new HttpError(
                'Não foi possível encontar um animal para o id ' + animalID,
                404
            )
        );
    }

    ANIMALS = ANIMALS.filter((a) => a.id !== animalID);
    res.status(200).json({
        message: 'Animal deleted succesfully! ',
        animal,
    });
};

exports.getAnimalById = getAnimalById;
exports.getAnimalsByUserId = getAnimalsByUserId;
exports.createAnimal = createAnimal;
exports.updateAnimal = updateAnimal;
exports.deleteAnimal = deleteAnimal;
