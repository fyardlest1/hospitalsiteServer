const uuid = require("uuid");
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');

const DUMMY_HOSPITALS = [
    {
        id: "0",
        name: "Good Care Of Your Family",
        image: "/assets/images/baby-1150109.jpg",
        address: "298, Monseigneur Guilloux",
        coordinates: {
            lat: 40.85455662,
            lng: 78.51587887
        },
        elevation: 1233,
        featured: false,
        creator: "u1",
        description:
            "This is your favorite hospital. We are here to take care of you and all your family "
        
    },
    {
        id: "1",
        name: "Your Health Is Our Priority",
        image: "/assets/images/smiling_8930.jpg",
        address: "37, Rue Borno, PV",
        coordinates: {
            lat: 40.85455662,
            lng: 78.51587887
        },
        elevation: 877,
        featured: false,
        creator: "u2",
        description:
            "This is where you will find all the care you really need."
    }
];

const getHospitalById = (req, res, next) => {
    const hospitalId = req.params.hid;

    const hospital = DUMMY_HOSPITALS.find(hosp => {
        return hosp.id === hospitalId;
    });

    if (!hospital) {
        // return next(new HttpError('Could not find the hospital for the provided id', 404));
        return next(new HttpError('Could not find the hospital for the provided id', 404));
    }

    res.json({ hospital }); // { hospital } => { hospital: hospital }
};

// function getHospitalById() = {...}
// const getHospitalById = function() {...}

const getHospitalsByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const hospitals = DUMMY_HOSPITALS.filter(hosp => {
        return hosp.creator === userId;
    });

    if (!hospitals || hospitals.length === 0) {
        return next(new HttpError('Could not find hospital for the provided user id', 404));
    }

    res.json({ hospitals });
};

const createHospital = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input, please check your data.', 422));
    }

    const { name, image, address, elevation, featured, creator, description } = req.body;
    // const name = req.body.name

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    // What we need to have in the body?
    const createdHospital = {
        id: uuid.v4(),
        name,
        image,
        address,
        location: coordinates,
        elevation,
        featured,
        creator,
        description
    };

    DUMMY_HOSPITALS.push(createdHospital); // unshift(createdHospital);

    res.status(201).json({ hospital: createdHospital });
};

// Add hospital in the array list
const updateHospital = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid input, please check your data.', 422);
    }

     const { name, address, description } = req.body;
     const hospitalId = req.params.hid;

     const updatedHospital = { ...DUMMY_HOSPITALS.find(hosp => hosp.id === hospitalId) };
     const hospitalIndex = DUMMY_HOSPITALS.findIndex(hosp => hosp.id === hospitalId);
     
     updatedHospital.name = name;
     updatedHospital.address = address;
     updatedHospital.description = description;

     DUMMY_HOSPITALS[hospitalIndex] = updatedHospital;

     res.status(200).json({ hospital: updatedHospital });
};

const deleteHospital = (req, res, next) => {
    const hospitalId = req.params.hid;

    if (!DUMMY_HOSPITALS.find(h => h.id === hospitalId)) {
        throw new HttpError('Could not find the hospital you want to delete.', 404)
    }

    DUMMY_HOSPITALS = DUMMY_HOSPITALS.filter(hosp => hosp.id !== hospitalId);
    res.status(200).json({ message: "Deleted hospital." })
};

exports.getHospitalById = getHospitalById;
exports.getHospitalsByUserId = getHospitalsByUserId;
exports.createHospital = createHospital;
exports.updateHospital = updateHospital;
exports.deleteHospital = deleteHospital; 