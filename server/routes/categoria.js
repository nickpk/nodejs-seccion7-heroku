const express = require('express');
let {verificaToken,verificaAdminRole} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

app.get('/categoria',verificaToken,(req,res)=>{
 //muestra todas las categorias

    let desde = Number(req.query.desde) || 0;
    let cantidad = Number(req.query.cantidad) || 5;
    Categoria.find({'estado':true},'descripcion estado')  // condicion / que parametros mostrar
    .skip(desde)
    .limit(cantidad)
    .populate('usuario','nombre email') // me trae el usuario que creo esa categoria / que parametros mostrar
    .sort('descripcion') // ordena la lista por el parametro
    .exec((err,categorias) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        Categoria.count((err,conteo) => {
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensagge:'Error en el conteo de la categoria'
                })
            }
            res.json({
                ok:true,
                categorias,
                conteo
            })
        })

    });
});

app.get('/categoria/:id',verificaToken,(req,res)=>{
 //muestra una sola categoria  
    let id = req.params.id;
    let body = req.body;
    Categoria.findById( id,body,{new:true,runValidators:true},(err,categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err:err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'categoria no encontrada'
                }
            })
        }
        res.json({
            ok:true,
            categoria:categoriaDB
        })
    })
});

app.post('/categoria',verificaToken,(req,res)=>{
//crear nueva categoria
    let body = req.body;
    let categoria = new Categoria({
        descripcion:body.descripcion,
        usuario:req.usuario._id
    })
    categoria.save((err,categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            categoria:categoriaDB
        })
    })
});

app.put('/categoria/:id',verificaToken,(req,res)=>{
//actualizar categoria
    let body = req.body;
    let id = req.params.id;
    Categoria.findByIdAndUpdate(id,body,{new:true},(err,updateUser) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err:err
            })
        }
        if(!updateUser){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'categoria no encontrado'
                }
            })
        }
        res.json({
            ok:true,
            usuario:updateUser
        })
    })
});

app.delete('/categoria/:id',[verificaToken,verificaAdminRole],(req,res)=>{
    // solo un administrador puede borrarla
    let id = req.params.id;
    let body = req.body;
    let cambiaEstado = {
        estado:false
    }
    Categoria.findByIdAndUpdate( id,cambiaEstado,{new:true,runValidators:true},(err,categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err:err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'categoria no encontrada'
                }
            })
        }
        res.json({
            ok:true,
            categoria:categoriaDB
        })
    })
});

module.exports = app;