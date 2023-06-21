//Requerimos la conexión a la base de datos
const { request } = require('express');
const { miConexion } = require('../database/db');

//Objeto para manejar el CRUD de categorias
const productosAPI = {};

//El objeto categoriasAPI = C, R (Una o Todas), U, D
//C = POST
//R = Get
//U = Put
//D = Delete
//Aqui vamos a eliminar una categporia
productosAPI.deleteProductoById = async (req=request,res,next)=>{
    try{
        const { id } = req.params;
        const conexion = await miConexion();
        const resultado = await conexion.query('DELETE FROM producto WHERE id = ?',[id]);
        if(resultado[0].affectedRows>0){
            res.status(200).json({
                estado: 1,
                mensaje: "Producto eliminado"
            });
        }else{
            res.status(404).json({
                estado: 0,
                mensaje: "Producto no encontrado"
            });
        }
    }catch(error) {
        next(error);
    }
}
//Vamos a actualizar una categoria
productosAPI.updateProducto = async (req=request,res=request,next) =>{
    try {
        const { descripcion,precio} = req.body;
        const { id } = req.params;
        if(id==undefined || descripcion==undefined || precio == undefined){
            res.status(400).json({
                estado: 0,
                mensaje: "Solicitud incorrecta: Faltan parametros"
            });
        }else{
            const conexion = await miConexion();
            const resultado = await conexion.query('UPDATE producto SET descripcion = ?, precio = ? WHERE id = ?',[descripcion,precio,id]);
            if(resultado[0].affectedRows>0){
                res.status(200).json({
                    estado: 1,
                    mensaje: "Producto actualizado",
                    descripcion: descripcion,
                    precio: precio
                });
            }else{
                res.status(404).json({
                    estado: 0,
                    mensaje: "Producto no actulizado"
                });
            }
        }
    } catch (error) {
        next(error);
    }
}


//Vamos a agregar una categoria
productosAPI.agregarProducto = async(req=request,res=request,next) =>{
    try {
        const { descripcion, precio } = req.body;
        //Verificar que la solicitud se realice correctamente
        //Que nos mande los dos campos
        if( descripcion == undefined || precio == undefined){
            res.status(400).json({
                estado: 0,
                mensaje: "Solicitud incorrecta: Faltan parametros"
            })
        }else{
            const conexion = await miConexion();
            const resultado = await conexion.query('INSERT INTO producto(descripcion,precio) values(?,?)',[descripcion,precio]);
            if(resultado[0].affectedRows>0){
                res.status(201).json({
                    estado: 1,
                    mensaje: "Producto creado",
                    producto:{
                        id              : resultado[0].insertId,
                        descripcion     : descripcion,
                        precio   : precio
                              }
                });
            }
        }
    } catch (error) {
        next(error);
    }
}

//Aqui que nos regrese una categorias por su ID
productosAPI.getProductoById = async(req=request,res,next) =>{
    try{
        //Recuperar el id de la categoría
        const { id } = req.params;
        const conexion = await miConexion();
        const [rows] = await conexion.query('SELECT * FROM producto WHERE id = ?',[id]);
        if(rows.length > 0){
            res.status(200).json({
                estado:1,
                mensaje: "Producto encontrado",
                categoria: rows[0]
            });
        }else{
            res.status(404).json({
                estado: 0,
                mensaje: "Producto no encontrado",
                categoria: []
            });
        }
    }catch(error){
        next(error);
    }
}
//Aqui es para regresar Todas las categorias
productosAPI.getTodasProductos = async (req,res, next)=>{
    try{
        const conexion = await miConexion();
        const [rows] = await conexion.query('SELECT * FROM producto');
        if(rows.length==0){
            res.status(404).json({
                estado:0,
                mensaje: "Registros no encontrados",
                productos: rows
            });
        }else{
            res.status(200).json({
                estado: 1,
                mensaje: "Registros encontrados",
                productos: rows
            })
        }
    }catch(error){
        next(error);
    }
}

//Exportar para poder usarlo en otro modulo
module.exports = productosAPI;