const express = require('express')

const bcrypt = require('bcrypt'); // encriptar
const jwt = require('jsonwebtoken'); // para configurar el token 

const app = express();

const Usuario = require('../models/usuario');


app.post('/login',(req,res) => {
    let body = req.body;
    // findone --> selecciona solo 1 si cumple la condicion de que mail sea igual a body.email
    Usuario.findOne({email:body.email},(err,usuarioDB)=> {
        if(err){
            return res.status(400).json({
                ok:false,
                err:err
            })
        }

        if(!usuarioDB || !bcrypt.compareSync( body.password, usuarioDB.password) ){
            return res.status(400).json({
                ok:false,
                message:'Usuario o contraseña incorrecto'
            })
        }

        let token = jwt.sign({
            usuario:usuarioDB
        },process.env.SEED,{expiresIn: process.env.caducidad})

        return res.json({
            ok:true,
            usuario:usuarioDB,
            token
        })



    })

})

module.exports = app;