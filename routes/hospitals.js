const express = require("express");
// destructuring check
const { check } = require("express-validator");

const hospitalControllers = require("../controllers/hospitals-controller");

const router = express.Router();

router.get("/:hid", hospitalControllers.getHospitalById);

router.get("/user/:uid", hospitalControllers.getHospitalsByUserId);

router.post(
  "/",
  [
    check("name").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  hospitalControllers.createHospital
);

router.patch("/:hid", hospitalControllers.updateHospital);

router.delete("/:hid", hospitalControllers.deleteHospital);

module.exports = router;
