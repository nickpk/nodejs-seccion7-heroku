const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

let Usuario = require('../models/usuario');


app.use(fileUpload());


app.put('/upload/:type/:id',function(req,res) {
    let type = req.params.type;
    let id = req.params.id;

    if(!req.files){
        return res.status(400).json({
            ok:false,
            message:'No se a seleccionado ningun archivo'
        })
    }
    //validar type
    let typeValidos = ['productos','usuarios'];
    if(typeValidos.indexOf(type) < 0){
        return res.status(400).json({
            ok:false,
            type_recibido:type,
            message:'Tipos validos:' + typeValidos.join(', ')
        })
    }
    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extencion = nombreCortado[nombreCortado.length - 1]; // split -1 busca el primer '.' de atras para adelante

    //extenciones permitidas

    let extencionesValidas = ['png','jpg','gif','jpeg'];

    if(extencionesValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok:false,
            extencion_recibida: extencion,
            message:'Las extenciones validas son ' + extencionesValidas.join(', ')
        })
    }

    //cambiar nombre al archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`

    archivo.mv(`uploads/${type}/${nombreArchivo}`,(err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        imagenUsuario(id,res,nombreArchivo)
    })
})

function imagenUsuario(id,res,nombreArchivo){
    Usuario.findById(id ,(err,usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                message:'Usuario no existe'
            })
        }
        usuarioDB.img = nombreArchivo;
        usuarioDB.save( (err,usuarioGuardado)=> {
            res.json({
                ok:true,
                usuario:usuarioGuardado,
                img:nombreArchivo
            })
        })
    })
}

function imagenProducto(){

}


module.exports = app;