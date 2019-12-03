// puerto

process.env.PORT = process.env.PORT || 3000;


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

/*if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb:http://localhost:27017/cafe';
}else{*/
    urlDB = 'mongodb+srv://admin:2gKOLd8IWOULLU5H@clouster-nodejs-curso-1nt4w.mongodb.net/cafe';
//}

process.env.urlDB = urlDB;