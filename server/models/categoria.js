const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values : ['ADMIN_ROLE','USER_ROLE'],
    message : '{VALUE} No es un role valido'
}

let categoriaSchema = new Schema({
    descripcion:{
        type:String,
        required:[true,'La descripción es requerida']
    },
    estado:{
        type:Boolean,
        default:true
    },
    usuario: { 
        type: Schema.Types.ObjectId,
        ref: 'Usuario' 
    }
});

categoriaSchema.methods.toJSON = function(){
    let category = this;
    let categoryObject = category.toObject();

    return categoryObject;
}


categoriaSchema.plugin(uniqueValidator,{message:'{PATH} debe ser unico'});

module.exports = mongoose.model('Categoria', categoriaSchema);