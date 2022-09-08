require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')
// const {Client} = require("@googlemaps/google-maps-services-js");

app.use(express.json())
app.use(cors())

const {addFavourite,
    login,
    register,
    showFitFave,
    showFullFave,
    showFineFave,
    getUser,
    removeFavourite,
    editUser,
    deleteUser

} = require('./controller')



const port = process.env.PORT || 8888;
app.get("/api/showfitfavourite/:username", showFitFave);
app.get("/api/showfullfavourite/:username", showFullFave);
app.get("/api/showfinefavourite/:username", showFineFave);
app.get("/api/userinfo/:username", getUser);
app.post(`/api/login`, login)
app.post(`/api/register`, register)
app.post("/api/addfavourite", addFavourite);

// app.post("/api/fitfavourite", addFave);


app.put(`/api/removefavourite/`, removeFavourite)
app.put(`/api/edituser/`, editUser)

app.delete("/api/deleteuser/:username", deleteUser)



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})