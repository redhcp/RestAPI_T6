const mongoose = require('mongoose');
const revista = require('../model/revistas')
const contactos = require('../model/contactos')
const ediciones = require('../model/ediciones')

const Schema = mongoose.Schema;
const revistaSchema = new Schema;
const contactoSchema = new Schema
const edicionSchema  = new Schema


const SuscripcionesSchema = Schema({

  contacto: String,
  revista: String,
  edicion: String,
  descargas: {type:Number},
  status: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('suscripciones', SuscripcionesSchema);

