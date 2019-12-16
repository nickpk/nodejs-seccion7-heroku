const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

let Usuario = require('../models/usuario');
let Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


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

    console.log(type);
    archivo.mv(`uploads/${type}/${nombreArchivo}`,(err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        switch (type) {
            case 'usuarios':
                imagenUsuario(id,res,nombreArchivo)
                break;
            case 'productos':
                imagenProducto(id,res,nombreArchivo)
                break;
        }
    })
})

function imagenUsuario(id,res,nombreArchivo){
    Usuario.findById(id ,(err,usuarioDB) => {
        if(err){
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!usuarioDB){
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(400).json({
                ok:false,
                message:'Usuario no existe'
            })
        }

        borraArchivo(usuarioDB.img,'usuarios');
        usuarioDB.img = nombreArchivo;
        usuarioDB.save( (err,usuarioGuardado)=> {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            return res.json({
                ok:true,
                usuario:usuarioGuardado,
                img:nombreArchivo
            })
        })
    })
}

function imagenProducto(id,res,nombreArchivo){
    Producto.findById(id,(err,productoDB)=> {
        if(err){
            borraArchivo(nombreArchivo,'productos');
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            borraArchivo(nombreArchivo,'productos');
            return res.status(400).json({
                ok:false,
                message:'No existe el producto'
            })
        }
        borraArchivo(productoDB.img,'productos');
        productoDB.img = nombreArchivo;
        productoDB.save((err,productoGuardado) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            return res.json({
                ok:true,
                producto:productoGuardado,
                img:nombreArchivo
            })
        })

    })
}

function borraArchivo(nombreImagen,tipo){
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`);
    if(fs.existsSync(pathImagen)){ // regresa un true si existe y un false si no existe el path
        fs.unlinkSync(pathImagen);
        console.log('Se elimino imagen anterior');
    }
}

module.exports = app;