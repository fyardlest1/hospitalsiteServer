const express = require('express');

const hospitalControllers = require('../controllers/hospitals-controller');

const router = express.Router();



router.get('/:hid', hospitalControllers.getHospitalById);

router.get('/user/:uid', hospitalControllers.getHospitalByUserId);

router.post('/', hospitalControllers.createHospital);

module.exports = router;