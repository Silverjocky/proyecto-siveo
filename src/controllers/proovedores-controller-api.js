//Requerimos la conexión a la base de datos
const { request } = require('express');
const { miConexion } = require('../database/db');

//Objeto para manejar el CRUD de categorias
const proovedoresAPI = {};

//El objeto categoriasAPI = C, R (Una o Todas), U, D
//C = POST
//R = Get
//U = Put
//D = Delete
//Aqui vamos a eliminar una categporia
proovedoresAPI.deleteProovedorById = async (req=request,res,next)=>{
    try{
        const { id } = req.params;
        const conexion = await miConexion();
        const resultado = await conexion.query('DELETE FROM proovedor WHERE id = ?',[id]);
        if(resultado[0].affectedRows>0){
            res.status(200).json({
                estado: 1,
                mensaje: "Proovedor eliminado"
            });
        }else{
            res.status(404).json({
                estado: 0,
                mensaje: "Proovedor no eliminado"
            });
        }
    }catch(error) {
        next(error);
    }
}
//Vamos a actualizar una categoria
proovedoresAPI.updateProovedor = async (req=request,res=request,next) =>{
    try {
        const { nombre,direccion,telefono} = req.body;
        const { id } = req.params;
        if(id==undefined || nombre==undefined || direccion == undefined || telefono ==undefined){
            res.status(400).json({
                estado: 0,
                mensaje: "Solicitud incorrecta: Faltan parametros"
            });
        }else{
            const conexion = await miConexion();
            const resultado = await conexion.query('UPDATE proovedor SET nombre = ?, direccion = ?, telefono = ? WHERE id = ?',[nombre,direccion,telefono,id]);
            if(resultado[0].affectedRows>0){
                res.status(200).json({
                    estado: 1,
                    mensaje: "Proovedor actualizado",
                    nombre: nombre,
                    direccion: direccion,
                    telefono: telefono
                });
            }else{
                res.status(404).json({
                    estado: 0,
                    mensaje: "Proovedor no actualizada"
                });
            }
        }
    } catch (error) {
        next(error);
    }
}


//Vamos a agregar una categoria
proovedoresAPI.agregarProovedor = async(req=request,res=request,next) =>{
    try {
        const { nombre,direccion,telefono} = req.body;
        //Verificar que la solicitud se realice correctamente
        //Que nos mande los dos campos
        if( nombre == undefined || direccion == undefined || telefono == undefined){
            res.status(400).json({
                estado: 0,
                mensaje: "Solicitud incorrecta: Faltan parametros"
            })
        }else{
            const conexion = await miConexion();
            const resultado = await conexion.query('INSERT INTO proovedor(nombre,direccion,telefono) values(?,?,?)',[nombre,direccion,telefono]);
            if(resultado[0].affectedRows>0){
                res.status(201).json({
                    estado: 1,
                    mensaje: "Proovedor creado",
                    proovedor:{
                        id              : resultado[0].insertId,
                        nombre: nombre,
                    direccion: direccion,
                    telefono: telefono
                              }
                });
            }
        }
    } catch (error) {
        next(error);
    }
}

//Aqui que nos regrese una categorias por su ID
proovedoresAPI.getProovedorById = async(req=request,res,next) =>{
    try{
        //Recuperar el id de la categoría
        const { id } = req.params;
        const conexion = await miConexion();
        const [rows] = await conexion.query('SELECT * FROM proovedor WHERE id = ?',[id]);
        if(rows.length > 0){
            res.status(200).json({
                estado:1,
                mensaje: "Proovedor encontradp",
                proovedor: rows[0]
            });
        }else{
            res.status(404).json({
                estado: 0,
                mensaje: "Proovedor no encontrado",
                proovedor: []
            });
        }
    }catch(error){
        next(error);
    }
}
//Aqui es para regresar Todas las categorias
proovedoresAPI.getTodasProovedores = async (req,res, next)=>{
    try{
        const conexion = await miConexion();
        const [rows] = await conexion.query('SELECT * FROM proovedor');
        if(rows.length==0){
            res.status(404).json({
                estado:0,
                mensaje: "Proovedores no encontrados",
                proovedores: rows
            });
        }else{
            res.status(200).json({
                estado: 1,
                mensaje: "Proovedores encontrados",
                proovedores: rows
            })
        }
    }catch(error){
        next(error);
    }
}

//Exportar para poder usarlo en otro modulo
module.exports = proovedoresAPI;