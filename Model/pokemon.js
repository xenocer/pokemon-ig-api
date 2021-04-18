const mongoose = require('mongoose')
const Schema = mongoose.Schema
const pokemonSchema = new Schema({
  picture: String,
  height: Number,
  id: Number,
  name: String,
  species: {
  name: String,
    url: String
  },
  stats: [Object],
  types: [Object],
  weight: Number
})
const PokemonModel = mongoose.model('pokemon', pokemonSchema)
export default PokemonModel;
