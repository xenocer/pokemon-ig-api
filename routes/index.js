var express = require('express');
var router = express.Router();
import models from '../Model';
import _ from "lodash"
/* GET home page. */
router.get('/pokemon/listall', async function(req, res, next) {
  const data = await models.Pokemon.find({});
  res.send(data);
});
router.get('/pokemon/list', async function(req, res, next) {
  const limit = _.toNumber(req.query.limit);
  const data = await models.Pokemon.find({}).limit(limit);
  res.send(data);
});
router.get('/pokemon/searchList', async function(req, res, next) {
  const name = req.query.name;
  const data = await models.Pokemon.find({name: { $regex: `${name}` }});
  res.send(data);
});
router.get('/pokemon/search', async function(req, res, next) {
  const name = req.query.name;
  const data = await models.Pokemon.findOne({name});
  res.send(data);
});
router.get('/pokedex/number', async function(req, res, next) {
  const data = await models.Pokemon.find({})
  const number = data.length
  res.send({number})
});

module.exports = router;
