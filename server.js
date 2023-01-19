'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const data = require('./data/weather.json');

class Forecast {
  constructor(cityDataArray) {
    this.date = cityDataArray.valid_date;
    this.description = cityDataArray.weather.description;
  }
}

const staticData = {
  city_name: "Seattle",
  lon: "-122.33207",
  lat: "47.60621",
};


app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('Good response');
});

app.get('/weather', async (req, res, next) => {
  try {
    // const { lat, lon, searchQuery } = req.query;
    const weatherbitUrl = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${staticData.lat}&lon=${staticData.lon}&days=5&units=I`;
    const forecastResults = await axios.get(weatherbitUrl);
    if (!forecastResults) {
      throw new Error(`City ${searchQuery} not found.`);
    }
    const resArray = forecastResults.data.data.map(date => new Forecast(date));
    res.status(200).send(resArray);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

const PORT = process.env.PORT || 3553;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

