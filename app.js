import {response} from "express";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyparser = require("body-parser");
const cors = require("cors");
var indexRouter = require('./routes/index');;
require('dotenv').config();
var app = express();
import * as _ from "lodash"
import models, { connectDb } from './Model';

//connect MongoDB

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyparser.json());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
const eraseDatabaseOnSync = true;
connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.Pokemon.deleteMany({}),
    ]);

    seedPokemon(50);
  }

  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
  );
});

const seedPokemon= async (number) => {
  const Pokedex = require('pokedex-promise-v2');
  var options = {
    cacheLimit: 60* 60 * 1000, // 1h
    timeout: 10 * 1000 // 10s
  }
  const P = new Pokedex(options);

  for (let i = 1; i<= number; i++) {
    const percent = ((i / number)).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2});
    await P.resource([`/api/v2/pokemon/${i}`]).then(async (response) => {
      const data = response[0]
      const mapping = {
        picture: `https://img.pokemondb.net/artwork/${data.name}.jpg`,
        height: data.height,
        weight: data.weight,
        id: data.id,
        name: data.name,
        species: {
          name: data.species.name,
          url: data.species.url
        },
        stats: data.stats,
        types: data.types
      }
      console.log("save pokemon :" , data.name , percent)
      const pokemon = new models.Pokemon(mapping);
      await pokemon.save();
    }).catch(err => {
      console.log("cant fetch from api", `/api/v2/pokemon/${i}`)
    })
  }

};
