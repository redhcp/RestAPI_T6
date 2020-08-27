const modelContactos = require("../model/contactos");
const passport = require("passport");
const { query } = require("express");

function buscarContacto(id) {
  return modelContactos.findById(id);
}

async function listarContactos() {
  return await modelContactos.find();
}

async function actualizarContacto(id, dato) {
  await modelContactos.update({ _id: id }, dato);
}

async function guardarContacto(dato) {
  var contacto = await new modelContactos(dato);
  contacto.password = contacto.encryptPassword(dato.password);
  console.log(contacto);
  contacto.save();
}

async function borrarContacto(id) {
  await modelContactos.remove({ _id: id });
}

module.exports = {
  buscarContacto,
  listarContactos,
  actualizarContacto,
  guardarContacto,
  borrarContacto,
};
