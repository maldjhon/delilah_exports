/**************************************************
Descripción: Llama las librerías WT
****************************************************/
const jwt = require("jsonwebtoken");
const variables = require("./config")
// const {validateError,data,arrayMessage} = require("./validateError");
/**********************************************
Descripción: Uso de las funciones
***********************************************/
function executeQuery(result,req,res,method){
    let newObject = new Object;
    let id;
    let newId;
    let code;
    let message;
    let newError;
    let user;
    let secret;
    let passwordDataBase;
    let passwordApplication;
    let newToken;
    let orderNum;
    switch (method) {
        case "createUser":
            id = result.dataValues.id;
            newId = new ids(id); 
            res.status(201).send(newId);
            break;
        case "loginUser":
            if (result == null || result == "" || result == undefined){
                code = "404";
                message = "El usuario que esta consultando no existe o no se encuentra";
                newError = new errors(code,message);
                res.status(404).send(newError);
            }else{
                user = req.body.user;
                secret = variables.jwtSecret;
                passwordDataBase = result[0].dataValues.PWDB;
                passwordApplication = result[0].dataValues.PWAPP;
                if(passwordDataBase == passwordApplication){
                    const token = jwt.sign({user},secret);
                    newToken = new tokens(token); 
                    res.status(200).send(newToken);
                }else{
                    code = "401";
                    message = "La contraseña es incorrecta";
                    newError = new errors(code,message);
                    res.status(401).send(newError);
                }   
            }  
            break;
        case "createProduct":
            id = result.dataValues.id;
            newId = new ids(id); 
            res.status(201).send(newId);
            break;
        case "createOrder":
            id = result.dataValues.id;
            orderNum = result.orderNum;
            newObject.id = id;
            newObject.orderNum = orderNum;
            res.status(201).send(newObject);
            break;
        default:
            break;
    }
}
/**********************************************
Descripción: Uso de las clases
***********************************************/
class ids {
    constructor (id){
        this.id = id;
    }
}

class tokens {
    constructor (token){
        this.token = token;
    }
}

class errors {
    constructor (code,message){
        this.code = code;
        this.message = message;
    }
}

module.exports = {executeQuery}