// Verificar token

const jwt = require('jsonwebtoken');


let verificaToken = (req,res,next) => {

    let token = req.get('token');
    jwt.verify(token,process.env.SEED,(err,decored)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err:'error de token'
            })
        }
        req.usuario = decored.usuario;
        next();
    })

    

};

// verifica si es ADMIN_ROLE

let verificaAdminRole = (req,res,next) => {
    let userType = req.usuario;
    if(userType.role !== 'ADMIN_ROLE'){
        return res.status(400).json({
            ok:false,
            message:'No cuenta con permisos para realizar esta tarea'
        })
    }
    next();
}

module.exports = {
    verificaToken,
    verificaAdminRole
};