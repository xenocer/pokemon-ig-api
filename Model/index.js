import mongoose from 'mongoose';

import Pokemon from './pokemon';

const connectDb = () => {
  return mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/pokemon`);
};

const models = { Pokemon };

export { connectDb };

export default models;
