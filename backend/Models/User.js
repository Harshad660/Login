const mongoose = require('mongoose');//import mongoose
const Schema = mongoose.Schema;
//schema created
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//model name 
const UserModel = mongoose.model('User', UserSchema); 

module.exports = UserModel;
