const express = require('express');
let {verificaToken,verificaAdminRole} = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


// obtener todos los productos

app.get('/producto',verificaToken,(req,res)=> {
    let body = req.body;
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Producto.find({disponible:true},'nombre precioUni descripcion categoria')
    .sort('nombre')
    .limit(limite)
    .skip(desde)
    .exec( (err, productos) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        Producto.count({disponible:true},(err,conteo)=> {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err,
                    message:'error en el conteo de productos'
                })
            }else{
                return res.json({
                    ok:true,
                    productos,
                    conteo,
                })
            }
        })
    })

});

app.get('/producto/:id',verificaToken,(req,res)=> {
    //traer todos los productos
    //con la categoria
    let id = req.params.id;

    Producto.findById(id,(err,productoId) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoId){
            return res.status(403).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            productoId,
        })
    })
});

app.get('/producto/buscar/:termino',(req,res)=> {

    let termino = req.params.termino;

    let regex = new RegExp(termino,'i');


    Producto.find({nombre:regex})
    .populate('categoria','nombre')
    .exec( (err,productosDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productosDB){
            return res.status(403).json({
                ok:false,
                message:'No hay resultados de busqueda'
            })
        }
        res.json({
            ok:true,
            message:'Busqueda exitosa',
            productosDB
        })
    })
})

app.post('/producto',verificaToken,(req,res)=> {
    //grabar usuario
    //grabar una categoria
    let body = req.body;
    let producto = new Producto({
        nombre:body.nombre,
        precioUni:body.precioUni,
        descripcion:body.descripcion,
        disponible:body.disponible,
        categoria:body.categoria,
        usuario:req.usuario._id
    })
    producto.save((err,productoBD)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoBD){
            return res.status(403).json({
                ok:false,
                message:'El producto no existe'
            })
        }
        return res.json({
            ok:true,
            message:'Producto creado',
            producto:productoBD
        })

    });
});

app.put('/producto/:id',verificaToken,(req,res)=> {
    //grabar usuario
    //grabar una categoria
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id,body,{new:true},(err,updateProduct)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!updateProduct){
            return res.status(403).json({
                ok:false,
                message:'El producto no existe'
            })
        }
        res.json({
            ok:true,
            producto:updateProduct,
            message:'El producto se actualizo correctamente'
        })
    });
    
});

app.delete('/producto/:id',[verificaToken,verificaAdminRole],(req,res)=> {
    //borrar un producto
    //cambiar el estado del producto
    let id = req.params.id;
    let cambioEstado = {
        disponible: false
    }
    
    Producto.findByIdAndUpdate(id,cambioEstado,{new:true},(err,productRemove) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productRemove){
            return res.status(403).json({
                ok:false,
                err,
                message:'El producto no existe'
            })
        }

        res.json({
            ok:true,
            message:'Se elimina el producto ( estado false )'
        })

    });
});



module.exports = app;