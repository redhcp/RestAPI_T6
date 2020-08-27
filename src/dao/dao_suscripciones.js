const suscripcionModel = require('../model/suscripciones');
const dao_contactos = require('./dao_contactos');


async function guardarSuscripcion(revistaID, contactoID, edicionID) {
  const suscripcion = new suscripcionModel();

  suscripcion.contacto = contactoID;
  suscripcion.revista = revistaID;
  suscripcion.edicion = edicionID;
  suscripcion.descargas = 0;

  await suscripcion.save(suscripcion, async (err, idSuscripciones) => {
    const contacto = await dao_contactos.buscarContacto(contactoID);

    arraySuscripcion = contacto.suscripciones;
    arraySuscripcion.push(idSuscripciones);
    contacto.suscripciones = arraySuscripcion;

    await dao_contactos.actualizarContacto(contactoID, contacto);
  });
}



async function buscarSuscripcion (id){
     return  await suscripcionModel.findById(id)
}


async function actualizarSuscripcion(id,dato){
  await suscripcionModel.update({_id:id},dato)
}




module.exports = {
    guardarSuscripcion,
    buscarSuscripcion,
    actualizarSuscripcion
};


