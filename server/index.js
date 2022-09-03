const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')
const {Client} = require("@googlemaps/google-maps-services-js");

app.use(express.json())
app.use(cors())

let googleApiKey = 'AIzaSyAypU-YlcxOnjjKku11CCYpTiOoDBg1qaM'
let searchField = "restaurant";
let current_latitude = 51.4554803;
let current_longitude = -2.0843058;
const {initMap, conLog} = require('./controller')


app.get(`/api/nearby`, )

// const client = new Client({});

// client
//   .elevation({
//     params: {
//       locations: [{ lat: 45, lng: -110 }],
//       key: googleApiKey
//     },
//     timeout: 1000, // milliseconds
//   })
//   .then((r) => {
//     console.log(r.data.results[0].elevation);
//   })
//   .catch((e) => {
//     console.log(e.response.data.error_message);
//   });
// const conLog2 = () => {
//     console.log("controller received")
// }
const port = process.env.PORT || 8888;
app.get("/api/quotes", initMap)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})