function validateData(req,res,next){
    let url = req.url;
    switch (url) {
        case "/api/users/register":
            validateDataRegister(req,res,next);
            break;
        case "/api/users/login":
            validateDataLogin(req,res,next);
            break;
        case "/api/products/create":
            validateDataProductsCreate(req,res,next);
            break;
        case "/api/orders/create":
            validateDataOrdersCreate(req,res,next);
            break;
        default:
            next();
            break;
    }
}

/**********************************************
Descripción: Uso de las funciones
***********************************************/
function validateDataRegister(req,res,next){
    let user = req.body.user;
    let name = req.body.name;
    let password = req.body.password;
    let profile = req.body.profile;
    let phone = req.body.phone;
    if(user == null || user == "" || user == undefined || name == null || name == "" || name == undefined || password == null || password == "" || password == undefined || profile == null || profile == "" || profile == undefined){
        let code = "400";
        let message = "El campo usuario, nombre, contraseña y perfil son requeridos por favor validar el request";
        let newError = new errors(code,message);
        res.status(400).send(newError);
        return;
    }else{
        if(phone == null || phone == "" || phone == undefined){
            next();
        }else{
            if(typeof phone != "number"){
                let code = "400";
                let message = "El campo telefono es incorrecto por favor validar el request";
                let newError = new errors(code,message);
                res.status(400).send(newError);
                return;
            }else{
                next();
            }
        }
    }
}

function validateDataLogin(req,res,next){
    let user = req.body.user;
    let password = req.body.password;
    if(user == null || user == "" || user == undefined || password == null || password == "" || password == undefined){
        let code = "400";
        let message = "El campo usuario y contraseña son requeridos por favor validar el request";
        let newError = new errors(code,message);
        res.status(400).send(newError);
        return;
    }else{
        next();
    }
}

function validateDataProductsCreate(req,res,next){
    let name = req.body.name;
    let price = req.body.price;
    let userCreated = req.body.user;
    if(name == null || name == "" || name == undefined || price == null || price == "" || price == undefined || userCreated == null || userCreated == "" || userCreated == undefined){
        let code = "400";
        let message = "El campo nombre, precio y datos del usuario son requeridos por favor validar el request";
        let newError = new errors(code,message);
        res.status(400).send(newError);
        return;
    }else{
        if(typeof price != "number"){
            let code = "400";
            let message = "El campo precio es incorrecto por favor validar el request";
            let newError = new errors(code,message);
            res.status(400).send(newError);
            return;
        }else{
            next();
        }
    }
}

function validateDataOrdersCreate(req,res,next){
    let payment = req.body.payment;
    let total = req.body.total;
    let user = req.body.user;
    let products = req.body.products;
    let i = 0;
    if(payment == null || payment == "" || payment == undefined || total == null || total == "" || total == undefined || user == null || user == "" || user == undefined || products == null || products == "" || products == undefined){
        let code = "400";
        let message = "El campo pago, total, datos del usuario y datos del producto son requeridos por favor validar el request";
        let newError = new errors(code,message);
        res.status(400).send(newError);
        return;
    }else{
        if(typeof total != "number"){
            let code = "400";
            let message = "El campo total es incorrecto por favor validar el request";
            let newError = new errors(code,message);
            res.status(400).send(newError);
            return;
        }else{
            for(i;i < products.length; i++){
                let id = products[i].id;
                if(id == null || id == "" || id == undefined){
                    let code = "400";
                    let message = "El campo pago, total, datos del usuario y datos del producto son requeridos por favor validar el request";
                    let newError = new errors(code,message);
                    res.status(400).send(newError);
                    return;
                }else{
                    if(typeof id != "number"){
                        let code = "400";
                        let message = "El campo id es incorrecto por favor validar el request";
                        let newError = new errors(code,message);
                        res.status(400).send(newError);
                        return;
                    }
                }
            }
            next();
        }
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

module.exports = {validateData}