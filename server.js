'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const data = require('./data/weather.json');

const PORT = process.env.PORT || 3553;

class Forecast {
  constructor(cityDataArray) {
    this.date = cityDataArray.valid_date;
    this.description = cityDataArray.weather.description;
  }
}

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('Good response');
});

app.get('/weather', (req, res, next) => {
  try {
    const { lat, lon, searchQuery } = req.query;
    const result = data.find(city => city.city_name === searchQuery);
    if (!result) {
      throw new Error(`City ${searchQuery} not found.`);
    }
    const resArray = result.data.map(date => new Forecast(date));
    res.status(200).send(resArray);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

