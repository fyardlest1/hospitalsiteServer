const uuid = require("uuid");

const HttpError = require('../models/http-error');

const DUMMY_HOSPITALS = [
    {
        id: "0",
        name: "Good Care Of Your Family",
        image: "/assets/images/baby-1150109.jpg",
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
        throw new HttpError('Could not find the hospital for the provided id', 404);
    }

    res.json({ hospital }); // { hospital } => { hospital: hospital }
};

// function getHospitalById() = {...}
// const getHospitalById = function() {...}

const getHospitalByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const hospital = DUMMY_HOSPITALS.find(hosp => {
        return hosp.creator === userId;
    });

    if (!hospital) {
        return next(new HttpError('Could not find the hospital for the provided user id', 404));
    }

    res.json({ hospital });
};

const createHospital = (req, res, next) => {
    const { name, image, elevation, featured, creator, description } = req.body;
    // const name = req.body.name

    // What we need to have in the body?
    const createdHospital = {
        id: uuid.v4(),
        name,
        image,
        elevation,
        featured,
        creator,
        description
    };

    DUMMY_HOSPITALS.push(createdHospital); // unshift(createdHospital);

    res.status(201).json({ hospital: createdHospital });
};

exports.getHospitalById = getHospitalById;
exports.getHospitalByUserId = getHospitalByUserId;
exports.createHospital = createHospital;