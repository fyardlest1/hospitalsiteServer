const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = "AIzaSyCIx0oMB4Pwr8KuGYxwW0QT937Th7uRgGs";

async function getCoordsForAddress(address) {
  return {
      lat: 40.7484474,
      lng: -73.9871516
  };

  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address)}&key=${API_KEY}
`);

  // const data = response.data;
  // console.log(response);
  // console.log(data);
  // console.log(response.data);
  // console.log(data.results[0].geometry.location);


  // if (!data || data.status === "ZERO_RESULTS") {
  //   const error = new HttpError(
  //     "Could not find location for the specified address.",
  //     422
  //   );
  //   throw error;
  // }

  // const lat = data.results[0].geometry.location;
  // console.log(data.results[0].geometry.location);

  // const coordinates = data.results[0].geometry.location;
  // return coordinates;  
  
}


module.exports = getCoordsForAddress;