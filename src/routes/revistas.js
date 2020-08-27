const express = require("express");
const router = express.Router();
const daoRevistda = require("../dao/dao_revistas");
const Revistas = require("../model/revistas");
const dao_contactos = require("../dao/dao_contactos");

router.get("/revistas", isAuthenticated, async (req, res) => {
  const revistas = await Revistas.find();
  res.render("v_revistas/v_revistas", {
    revistas,
  });
});

router.post("/addRevista", isAuthenticated, async (req, res, next) => {
  console.log(req.body);
  const revistas = new Revistas(req.body);
  await revistas.save();
  res.redirect("/revistas");
});

router.get("/turn2/:id", isAuthenticated, async (req, res, next) => {
  let { id } = req.params;
  const revista = await Revistas.findById(id);
  revista.status = !revistas.status;
  await revista.save();
  res.redirect("/revistas");
});

router.get("/revista_edit/:id", isAuthenticated, async (req, res, next) => {
  const revista = await Revistas.findById(req.params.id);
  console.log(revista);
  res.render("v_revistas/v_revista_edit", { revista });
});

router.post("/revista_edit/:id", isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  await Revistas.update({ _id: id }, req.body);
  res.redirect("/revistas");
});

router.get("/delete2/:id", isAuthenticated, async (req, res, next) => {
  let { id } = req.params;
  await Revistas.remove({ _id: id });
  res.redirect("/revistas");
});

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
  } else {
    res.redirect("/");
  }
}

module.exports = router;
