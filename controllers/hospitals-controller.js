// const uuid = require("uuid");
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Hospital = require('../models/hospital');
const hospital = require('../models/hospital');

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

const getHospitalById = async (req, res, next) => {
    const hospitalId = req.params.hid;
    
    let hospital;
    try {
      hospital = await Hospital.findById(hospitalId);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find an hospital.",
        500
      );
      return next(error);
    }

    if (!hospital) {
        // return next(new HttpError('Could not find the hospital for the provided id', 404));
        const error = new HttpError('Could not find the hospital for the provided id', 404);
        return next(error);
    }

    res.json({ hospital: hospital.toObject( { getters: true } ) }); // { hospital } => { hospital: hospital }
};

// function getHospitalById() = {...}
// const getHospitalById = function() {...}

const getHospitalsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let hospitals;
  try {
    hospitals = await hospital.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching hospitals failed, please try again later",
      500
    );
    return next(error);
  }

  if (!hospitals || hospitals.length === 0) {
    return next(
      new HttpError("Could not find hospitals for the provided user id.", 404)
    );
  }

  res.json({
    hospitals: hospitals.map((hospital) => hospital.toObject({ getters: true })),
  });
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
    const createdHospital = new Hospital({
      name,
      image:
        "https://static.toiimg.com/thumb/72975551.cms?width=680&height=512&imgsize=881753",
      address,
      elevation,
      featured,
      location: coordinates,
      creator,
      description,
    });

    try {
        await createdHospital.save();
    } catch (e) {
        const err = new HttpError("Creating Hospital failed, please try again.", 500);
        return next(err);
    }

    res.status(201).json({ hospital: createdHospital });
};

// Add hospital in the array list
const updateHospital = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid input, please check your data.', 422);
    }

     const { name, address, description } = req.body;
     const hospitalId = req.params.hid;

    let hospital;
    try {
        hospital = await Hospital.findById(hospitalId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update hospital', 500);
        return next(error);
    }
     
     hospital.name = name;
     hospital.address = address;
     hospital.description = description;

     try {
        await hospital.save();
     } catch (err) {
        const error = new HttpError(
          "Something went wrong, could not update hospital",
          500
        );
        return next(error);
     }

    //  DUMMY_HOSPITALS[hospitalIndex] = updatedHospital;

     res.status(200).json({ hospital: hospital.toObject( { getters: true } ) });
};

const deleteHospital = async (req, res, next) => {
    const hospitalId = req.params.hid;

    let hospital;
    try {
        hospital = await Hospital.findById(hospitalId);
    } catch (err) {
        const error = new HttpError('There is an error, we could not delete the hospital.', 500);
        return next(error);
    }
    res.status(200).json({ message: "Deleted hospital." });

    try {
      await hospital.remove();
    } catch (err) {
      const error = new HttpError(
        "There is an error, we could not delete the hospital.",
        500
      );
      return next(error);
    }
    

    // if (!DUMMY_HOSPITALS.find(h => h.id === hospitalId)) {
    //     throw new HttpError('Could not find the hospital you want to delete.', 404)
    // }

    // DUMMY_HOSPITALS = DUMMY_HOSPITALS.filter(hosp => hosp.id !== hospitalId);
    // res.status(200).json({ message: "Deleted hospital." })
};

exports.getHospitalById = getHospitalById;
exports.getHospitalsByUserId = getHospitalsByUserId;
exports.createHospital = createHospital;
exports.updateHospital = updateHospital;
exports.deleteHospital = deleteHospital; 