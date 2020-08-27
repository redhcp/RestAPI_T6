const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EdicionSchema = Schema({
  name: { type: String },   
  precio: { type: Number},   
  description: { type: String, required: false },
  status: {type: Boolean,default: true },
  date: { type: Date, default: Date.now }
  
});


module.exports = mongoose.model('ediciones', EdicionSchema);