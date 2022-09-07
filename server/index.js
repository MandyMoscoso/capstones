require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')
// const {Client} = require("@googlemaps/google-maps-services-js");

app.use(express.json())
app.use(cors())

const {addFitFavourite,
    login,
    register,
    showFave,
    removeFavourite

} = require('./controller')



const port = process.env.PORT || 8888;
app.get("/api/showfavourite/:username", showFave);
app.post(`/api/login`, login)
app.post(`/api/register`, register)
app.post("/api/fitfavourite", addFitFavourite);
// app.post("/api/fitfavourite", addFave);


app.put(`/api/fitfavourite/`, removeFavourite)



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})