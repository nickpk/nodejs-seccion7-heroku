const express = require('express')

const bcrypt = require('bcrypt'); // encriptar
const jwt = require('jsonwebtoken'); // para configurar el token 

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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



//configuraciones de google 

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return {   
        nombre:payload.name,
        email : payload.email,
        img : payload.picture,
        google: true     
    }
}
 

app.post('/google',async (req,res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token).catch((err) => {
        res.status(403).json({
            ok:false,
            err
        })
    });

    Usuario.findOne({email:googleUser.email}, (err,usuarioDB) =>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(usuarioDB){
            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok:false,
                    message:'Debe de usar su autenticación normal'
                })
            }else{
                let token = jwt.sign({
                    usuario:usuarioDB
                },process.env.SEED,{expiresIn: process.env.caducidad})
                res.json({
                    ok : true,
                    usuario: usuarioDB,
                    token
                })
            }
        }else{
            //si usuario no existe en base de datos
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            
            usuario.save( (err,usuarioDB) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }
                let token = jwt.sign({
                    usuario:usuarioDB
                },process.env.SEED,{expiresIn: process.env.caducidad})
                res.json({
                    ok : true,
                    usuario: usuarioDB,
                    token
                })
            })
        }
    });


   
})


module.exports = app;