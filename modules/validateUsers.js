const {sequelize,Users, Postn, Products,Orders,OrderstoProducts} = require("../db/index");
const variables = require('./config');
const jwt = require("jsonwebtoken");

function validateUser(req,res,next){
    let url = req.url;
    let id = req.params.id;
    switch (url) {
        case "/api/users":
            validateAuthorization(req,res,next);
            break;
        case "/api/products/create":
            validateUserAuthorization(req,res,next);
            break;
        case "/api/orders/create":
            validateAuthorization(req,res,next);
            break;
        case "/api/products":
            validateAuthorization(req,res,next);
            break;
        case "/api/orders":
            validateAuthorization(req,res,next);
            break;
        case `/api/users/update/${id}`:
            validateAuthorization(req,res,next);
            break;
        case `/api/products/update/${id}`:
            validateUserAuthorization(req,res,next);
            break;
        case `/api/orders/update/${id}`:
            validateUserAuthorization(req,res,next);
            break;
        case `/api/products/delete/${id}`:
            validateUserAuthorization(req,res,next);
            break;
        case `/api/orders/delete/${id}`:
            validateUserAuthorization(req,res,next);
            break;
        default:
            next();
            break;
    }
}

function validateUserAuthorization(req,res,next){
    let secret = variables.jwtSecret;
    let credential = req.headers.authorization;
    try{
        let token = credential.split(' ')[1];
        let decoded = jwt.verify(token,secret);
        let userDecoded = decoded.user;
        Users.findAll({
            attributes: ['postnId'],
            where:{
                user: userDecoded
            }
        }).then((result)=>{
            if(result == null || result == "" || result == undefined){
                let code = "401";
                let message = "No fue posible autenticar el usuario";
                let newError = new errors(code,message);
                res.status(401).send(newError);
                return;
            }else{
                let profile = result[0].dataValues.postnId;
                if(profile == 1){
                    next();
                }else{
                    let code = "401";
                    let message = "El usuario no cuenta con perfil administrador para esta petición";
                    let newError = new errors(code,message);
                    res.status(401).send(newError);
                    return;
                }
            }
        }).catch((err)=>{
            let code = "500";
            let message = "Conexión Fallida a la base de datos: "+err.original;
            let newError = new errors(code,message);
            res.status(500).send(newError);
            return;
        })
    }catch(err){
        let code = "401";
        let message = "No fue posible autenticar el usuario";
        let newError = new errors(code,message);
        res.status(401).send(newError);
        return;
    }
}

function validateAuthorization(req,res,next){
    let secret = variables.jwtSecret;
    let credential = req.headers.authorization;
    let token = credential.split(' ')[1];
    try{
        jwt.verify(token,secret);
        next();
    }catch(err){
        let code = "401";
        let message = "No fue posible autenticar el usuario";
        let newError = new errors(code,message);
        res.status(401).send(newError);
        return;
    }
}
/**********************************************
Descripción: Uso de las clases
***********************************************/
class errors {
    constructor (code,message){
        this.code = code;
        this.message = message;
    }
}

module.exports = {validateUser}