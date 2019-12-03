const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values : ['ADMIN_ROLE','USER_ROLE'],
    message : '{VALUE} No es un role valido'
}

let usuarioSchema = new Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es requerido']
    },
    email:{
        type:String,
        required:[true,'El correo es requerido'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'El password es requerido']
    },
    img:{
        type:String,
        required:false
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum:rolesValidos
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
});

// sirve para que el usuario no le llegue la información del password
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


usuarioSchema.plugin(uniqueValidator,{message:'{PATH} debe ser unico'});



module.exports = mongoose.model('Usuario', usuarioSchema);