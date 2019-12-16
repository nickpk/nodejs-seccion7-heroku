const express = require('express')

const bcrypt = require('bcrypt');
const _ = require('underscore');
const {verificaToken,verificaAdminRole} = require('../middlewares/autenticacion');

const app = express()

const Usuario = require('../models/usuario');


app.get('/usuario', verificaToken ,(req, res) => {

    let desde = Number(req.query.desde) || 0;
    let cantidad = Number(req.query.cantidad) || 5;

    Usuario.find({'estado':true},'nombre email role estado google')  // condicion / que parametros mostrar
    .skip(desde)
    .limit(cantidad)
    .exec((err,usuarios) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        Usuario.count({'estado':true},(err,conteo) => {
            res.json({
                ok:true,
                usuarios,
                conteo
            })
        })

    });
});
  
  app.post('/usuario',[verificaToken,verificaAdminRole], (req, res) => {
      let body = req.body;
      let usuario = new Usuario({
          nombre:body.nombre,
          email:body.email,
          password: bcrypt.hashSync(body.password,10),
          role:body.role
      })

      usuario.save((err,usuarioDB)=> {
            if(err){
                return res.status(400).json({
                    ok:false,
                    err:err
                })
            }
            res.json({
                ok:true,
                usuario:usuarioDB
            })
      });

  });
  
  app.put('/usuario/:id',[verificaToken,verificaAdminRole], (req, res) => {
      let id = req.params.id;
      // mediante libreria underscore selecciono solo los que me interesa poder updatear en la base
      let body = _.pick(req.body,['nombre','email','role','estado','google']);

      // param1 : id / param2: objeto a para updatear / param3 opciones(new = mostrar nuevo registro) / param4 callback
      Usuario.findByIdAndUpdate( id,body,{new:true,runValidators:true},(err,usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err:err
            })
        }
        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'usuario no encontrado'
                }
            })
        }
        res.json({
            ok:true,
            usuario:usuarioDB
        })
      })


  });
  
  app.delete('/usuario/:id',[verificaToken,verificaAdminRole], (req, res) => {
      let id = req.params.id;
      let cambiaEstado = {
          estado:false
      }
      Usuario.findByIdAndUpdate(id,cambiaEstado,{new:true},(err,removeUser) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err:err
            })
        }
        if(!removeUser){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'usuario no encontrado'
                }
            })
        }
        res.json({
            ok:true,
            usuario:removeUser
        })
      })
  });

  module.exports = app;