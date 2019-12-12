require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//habilitar carpeta public
app.use(express.static(path.resolve(__dirname , '../public')));


app.use(require('./routes/index'));

console.log(process.env.urlDB);
mongoose.connect(process.env.urlDB,
{useNewUrlParser:true,useCreateIndex:true},
(err,res)=> {
  if(err) throw err;
  console.log('Base de datos online');
});

 
app.listen(process.env.PORT, ()=> {
    console.log(`escuchando en puerto ${process.env.PORT}`);
})
