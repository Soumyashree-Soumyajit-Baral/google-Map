const express = require('express');
require("dotenv").config()
const axios = require('axios');
const app = express();
const cors = require("cors")
const port = 5000;


app.use(cors())
app.use(express.json({limit:"100mb"}))
app.use(express.urlencoded({extended:false}))

app.get('/api/distance', async (req, res) => {
    let kms, price, rate, baseFare, toCity;
    try {
        const { from, to, vehicletype } = req.query;
        const apiKey = process.env.API_KEY;
        const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${from}&destinations=${to}&units=imperial&key=${apiKey}`;

        const response = await axios.get(apiUrl);
        console.log(response.data.rows[0].elements[0].distance.text)
        kms = parseFloat(response.data.rows[0].elements[0].distance.text.split(" ")[0]) * 1.60934
        toCity = to.split(", ")
        if(vehicletype === "auto"){
            rate = 18
            baseFare = 450
            price = (rate * kms) + baseFare 
        } else if (vehicletype === "TataAce") {
            rate = 22
            baseFare = 600
            price = (rate * kms) + baseFare
        } else if (vehicletype === "Smallpickupk") {
            rate = 26
            baseFare = 800
            price = (rate * kms) + baseFare      
        } else if (vehicletype === "largepickup") {
            rate = 32
            baseFare = 950
            price = (rate * kms) + baseFare
        } else if (vehicletype === "Eicher05ton") {
            if( toCity.includes("Bhubaneswar")){
                rate = 128
                price = rate * kms
            } else if (toCity.includes("Cuttack")){
                rate = 185
                price = rate * kms
            } else if (toCity.includes("Puri")){
                rate = 285
                price = rate * kms
            }            
        } else if (vehicletype === "Eicher06ton") {
            if( toCity.includes("Bhubaneswar")){
                rate = 185
                price = rate * kms
            } else if (toCity.includes("Cuttack")){
                rate = 214
                price = rate * kms
            } else if (toCity.includes("Puri")){
                rate = 348
                price = rate * kms
            }
        } else if (vehicletype === "10ton") {
            if( toCity.includes("Bhubaneswar")){
                rate = 294
                price = rate * kms
            } else if (toCity.includes("Cuttack")){
                rate = 357
                price = rate * kms
            } else if (toCity.includes("Puri")){
                rate = 471
                price = rate * kms
            }
        } else if (vehicletype === "25ton") {
            if( toCity.includes("Bhubaneswar")){
                rate = 500
                price = rate * kms
            } else if (toCity.includes("Cuttack")){
                rate = 550
                price = rate * kms
            } else if (toCity.includes("Puri")){
                rate = 550
                price = rate * kms
            }
        }
        console.log("kms   : ", kms, "price : ", price)
        if (price == null || price == 0 || price == undefined) {
            // Here you can use any error handling method you prefer
            res.status(400).json({
                error: 'please enter correct data!'
              });
          } else {
            // Throw an error if price is not null or 0
            res.json({
                price: `${price.toFixed(2)} Rs`,
                distance: `${kms.toFixed(2)} Km`
              });
          }
        // res.json({price: `${price} Rs`, distance: `${kms} Km`});
        // res.json(response.data.rows[0].elements[0].distance.text);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
