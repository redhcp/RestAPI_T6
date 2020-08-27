const mongoose = require('mongoose');
const revista = require('../model/revistas')
const suscripciones = require('../model/suscripciones')
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

revistaSchema = revista.schema
suscripcionSchema =suscripciones.schema;
//const { Schema } = mongoose;

const ContactoSchema = Schema({
  // email: String,
  //  password: String,
  name: { type: String, required: false },  
  last_name: { type: String, required: false },
  doc: { type: Number, required: true},
  email: { type: String},
  email2: { type: String, required: false },
  password: { type: String },
  tel1: { type: String, required: true },
  tel2: { type: String, required: false },
  description: { type: String, required: false},
  status: {type: Boolean,default: true },
  revistas : [revistaSchema],
  suscripciones : [suscripcionSchema],
  date: { type: Date, default: Date.now }
});

ContactoSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

ContactoSchema.methods.comparePassword= function (password) {
  return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('contacto', ContactoSchema);

