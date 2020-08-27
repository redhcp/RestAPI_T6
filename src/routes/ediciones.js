const express = require("express");
const router = express.Router();
const daoEdicion = require("../dao/dao_ediciones");
const daoRevista = require("../dao/dao_revistas");
const edicionesModel = require("../model/ediciones");
const path = require("path");
const fs = require("fs");
const dao_suscripciones = require("../dao/dao_suscripciones");
const dao_contactos = require("../dao/dao_contactos");

router.get("/crearEdicion/:_id", async (req, res) => {
  const revista = await daoRevista.buscarRevista(req.params);
  let ediciones = [];
  arrayEdiciones = revista.edicion;
  for (let index = 0; index < arrayEdiciones.length; index++) {
    ediciones.push(await daoEdicion.buscarEdicion(arrayEdiciones[index]));
  }

  res.render("v_ediciones/v_ediciones", {
    ediciones,
    revista
  });
});

router.post("/crearEdicion/:id", async (req, res) => {
  const revista = await daoRevista.buscarRevista(req.params.id);
  const revistaID = revista.id;
  let arrayEdiciones = revista.edicion;

  const ediciones = new edicionesModel(req.body);
  const edId = ediciones.save(ediciones, async function (err, id) {
    let edicionid = id._id;
    const nuevaedicacion = await daoEdicion.buscarEdicion(edicionid);
    console.log(nuevaedicacion);
    arrayEdiciones.push(nuevaedicacion);

    revista.edicion = arrayEdiciones;

    fs.appendFile(
      path.join(__dirname, "../download/" + edicionid + ".txt"),
      req.body.description,
      (error) => {
        if (err) throw err;
        console.log("Archivo Creado Satisfactoriamente");
      }
    );

    await daoRevista.actualizarRevista(revistaID, revista);
  });

  res.redirect("/crearEdicion/" + req.params.id);
});

router.get("/eliminarEdicion/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  await daoEdicion.eliminarEdidcion(id);
  res.redirect("/crearEdicion");
});

router.get(
  "/download/:idEdicion&:idSuscripcion",

  async (req, res) => {
    const idEdicion = req.params.idEdicion;
    const idSuscripcion = req.params.idSuscripcion;

    const suscripciones = await dao_suscripciones.buscarSuscripcion(
      idSuscripcion
    );
    console.log(suscripciones.descargas);

    suscripciones.descargas += 1;

    dao_suscripciones.actualizarSuscripcion(idSuscripcion, suscripciones);

    res.download(
      path.join(__dirname, "../download/" + idEdicion + ".txt"),
      function (err) {
        console.log(err);
      }
    );
  }
);

module.exports = router;

async function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    const contacto = await dao_contactos.buscarContacto(
      req.session.passport.user
    );
    console.log(contacto.status);
    if (!contacto.status) {
      return next();
    } else {
      res.redirect("/");
    }
  }
}
