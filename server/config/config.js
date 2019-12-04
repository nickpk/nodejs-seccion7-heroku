// puerto

process.env.PORT = process.env.PORT || 3000;


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb:http://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URL;
//}

process.env.urlDB = urlDB;