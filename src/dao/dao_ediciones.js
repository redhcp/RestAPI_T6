const edicionesModel = require('../model/ediciones')



async function listarEdiciones(){

    return  await edicionesModel.find();
    
}
 function guardarEdicion(edicion){
    let idEdicion
    const ediciones = new edicionesModel(edicion)
    const hola =  ediciones.save(async function (err,idEdicion){
        idEdicion = await idEdicion._id
        console.log(idEdicion + "  LA VERDADERA")
        return   idEdicion
    });
    console.log(hola + "  ACA ESTA EL ID")
     return idEdicion

}

async function eliminarEdidcion (id){
    await  edicionesModel.remove({_id:id});


}


async function buscarEdicion(id){
    return await edicionesModel.findById(id);

}


module.exports = {
    eliminarEdidcion,
    guardarEdicion,
    listarEdiciones,
    buscarEdicion
};