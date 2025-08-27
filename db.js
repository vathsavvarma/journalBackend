const mongoose = require('mongoose');  
const Schema = mongoose.Schema;
require('dotenv').config();

const mongoURL = process.env.MONGODB_URL;
mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', (err) => {  
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', () => {  
  console.log('Mongoose disconnected');
});

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
})

const userData = mongoose.model('UserData', userSchema);
exports.userData = userData;