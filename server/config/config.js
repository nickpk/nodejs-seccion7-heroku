// puerto
process.env.PORT = process.env.PORT || 3000;

// entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// vencimiento tokens
process.env.caducidad = 60*60*24*30;
process.env.SEED = process.env.SEED || '123'; // process.env.SEED = 123456789

// base de datos
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URL;
}
process.env.urlDB = urlDB;