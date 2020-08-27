const modelRevistas = require('../model/revistas')

function buscarRevista(id){
    return modelRevistas.findById(id);

}

function listarRevistas(){
    return modelRevistas.find();
}

async function actualizarRevista(id,dato){
    await modelRevistas.update({_id:id},dato)
}

function guardarRevista(dato){
    var contacto= new modelRevistas(dato) 
    contacto.save();
}

async function  borrarRevista(id){
  await  modelRevistas.remove({_id:id});

}

async function buscarRevistaPorId(id){

await modelRevistas.aggregate([

        {
         $match:
                {
                    "_id": ObjectId(id)
                }
        },
	{
	   $lookup:
			{
				from: "ediciones",
				localField: "ediciones",
				foreignField: "id",
				as: "listado_final_de_ediciones"
			}
	}
])
    
}



module.exports = {
    buscarRevista,
    listarRevistas,
    actualizarRevista,
    guardarRevista,
    borrarRevista
};
