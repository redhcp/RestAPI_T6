const express = require("express");
const router = express.Router();
const daoContacto = require("../dao/dao_contactos");
const daoRevista = require("../dao/dao_revistas");
const daoSuscripciones = require("../dao/dao_suscripciones");
const daoEdiciones = require("../dao/dao_ediciones");
const passport = require("passport");
const dao_suscripciones = require("../dao/dao_suscripciones");

// ALTA BAJA Y MODIFICACION

router.get("/contactos", isAuthenticated,async (req, res) => {
  const contactos = await daoContacto.listarContactos();
  res.render("v_contactos/v_contactos", {
    contactos,
  });
});


router.post("/addContacto", isAuthenticated, async (req, res, next) => {
  await daoContacto.guardarContacto(req.body);
  res.redirect("/contactos");
});

router.get("/eliminar/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  await daoContacto.borrarContacto(id);
  res.redirect("/contactos");
});

router.get("/editar/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const contactos = await daoContacto.buscarContacto(id);
  res.render("v_contactos/v_contactos_edit", {
    contactos,
  });
});

router.post("/editar/:id", isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  daoContacto.actualizarContacto(id, req.body);
  res.redirect("/contactos");
});

// LOGIN Y REGISTRO

router.get("/registro", (req, res, next) => {
  res.render("registro");
});

router.get("/", (req, res, next) => {
  res.render("signin");
});

router.get("/signin", (req, res, next) => {
  res.render("signin");
});

router.post(
  "/signin",
  passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    failureFlash: true,
  })
);

// profile user
router.get("/profile", isAuthenticatedUser, async (req, res) => {
  const contactos = req.user;
  var revistas = [];
  var ediciones = [];
  var suscripciones = [];
  for (let i = 0; i < contactos.suscripciones.length; i++) {
    revistaID = contactos.suscripciones[i].revista;
    edicionID = contactos.suscripciones[i].edicion;
    suscripcionID = contactos.suscripciones[i].id;
    suscripciones.push(
      await dao_suscripciones.buscarSuscripcion(suscripcionID)
    );
    revistas.push(await daoRevista.buscarRevista(revistaID));
    ediciones.push(await daoEdiciones.buscarEdicion(edicionID));
  }
  res.render("profile", {
    revistas,
    contactos,
    ediciones,
    suscripciones,
  });
});

router.get("/profile/:id", async (req, res) => {
  const idContacto = req.params;
  const suscripcion = await daoSuscripciones.buscarContacto(idContacto);
  const contacto = daoContacto.buscarContacto(suscripcion.contacto);
  const revista = daoRevista.buscarRevista(suscripcion.revista);
  const edicion = daoEdiciones.buscarEdicion(suscripcion.edicion);
  res.render("profile", {
    contacto,
    revista,
    edicion,
  });
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post(
  "/signup",
  passport.authenticate("local-registro", {
    successRedirect: "/signin",
    failureRedirect: "/registro",
    failureFlash: true,
  })
);

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

//AGREGAR REVISTAS Y EDICIONES

router.get("/agregarRevista/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const contactos = await daoContacto.buscarContacto(id);
  const revistas = await daoRevista.listarRevistas();
  res.render("v_contactos/v_contactos_agregarRevista", {
    contactos,
    revistas,
  });
});

router.get("/verRevistas/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const contactos = await daoContacto.buscarContacto(id);
  const revistas = contactos.revistas;
  res.render("v_contactos/v_revistasPorContacto", {
    contactos,
    revistas,
  });
});

//Lista todas las  ediciones para la revista selecionada

router.get("/verEdiciones/:idRevista&:idContacto", async (req, res) => {
  const idContacto = req.params.idContacto;
  const idRevista = req.params.idRevista;
  contacto = await daoContacto.buscarContacto(idContacto);
  revista = await daoRevista.buscarRevista(idRevista);
  var arrayEdicionesNuevo = [];
  arrayEdiciones = revista.edicion;
  for (let index = 0; index < arrayEdiciones.length; index++) {
    var id = arrayEdiciones[index].id;
    let edicion = await daoEdiciones.buscarEdicion(id);
    arrayEdicionesNuevo.push(edicion);
  }
  ediciones = arrayEdicionesNuevo;

  res.render("v_contactos/v_verEdiciones", {
    contacto,
    revista,
    ediciones,
  });
});

router.get(
  "/agrearRevistaContacto/:idRevista&:idContacto",
  async (req, res) => {
    var existeRevista = false;
    const idContacto = req.params.idContacto;
    const idRevista = req.params.idRevista;
    const contactos = await daoContacto.buscarContacto(idContacto);
    const revista = await daoRevista.buscarRevista(idRevista);
    arrayRevistas = contactos.revistas;
    for (let i = 0; i < arrayRevistas.length; i++) {
      if (idRevista == arrayRevistas[i].id) {
        existeRevista = true;
        console.log(arrayRevistas[i].id);
      }
    }
    if (existeRevista) {
      const rta = { message: "El contacto ya tiene esa revista" };
      res.json(rta);
    } else {
      arrayRevistas = contactos.revistas;
      arrayRevistas.push(revista);
      contactos.revistas = arrayRevistas;
      await daoContacto.actualizarContacto(idContacto, contactos);
      res.redirect("/contactos");
    }
  }
);

router.get(
  "/comprarEdicion/:edicionID&:contactoID&:revistaID",
  async (req, res) => {
    var existeSuscripciopn = false;
    const revistaID = req.params.revistaID;
    const contactoID = req.params.contactoID;
    const edicionID = req.params.edicionID;
    contacto = await daoContacto.buscarContacto(contactoID);

    arraySuscripciones = contacto.suscripciones;

    for (let i = 0; i < arraySuscripciones.length; i++) {
      if (edicionID == arraySuscripciones[i].edicion) {
        existeSuscripciopn = true;
      }
    }
    if (existeSuscripciopn) {
      const rta = { message: "El contacto ya tiene esa edicion" };
      res.json(rta);
    } else {
      await daoSuscripciones.guardarSuscripcion(
        revistaID,
        contactoID,
        edicionID
      );
      res.redirect("/contactos");
    }
  }
);

async function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    const contacto = await daoContacto.buscarContacto(
      req.session.passport.user
    );
    if (!contacto.status) {
      return next();
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
}

async function isAuthenticatedUser(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}

module.exports = router;
