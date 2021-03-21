function paramsValidate(req,res,next){
    let id = req.params.id;
    let url = req.url;
    switch (url) {
        case `/api/users/update/${id}`:
            validateDataUsersUpdate(req,res,next);
            break;
        case `/api/products/update/${id}`:
            validateDataProductsUpdate(req,res,next);
            break;
        case `/api/orders/update/${id}`:
            validateDataOrdersUpdate(req,res,next);
            break;
        default:
            next();
            break;
    }
}

/**********************************************
Descripción: Uso de las funciones
***********************************************/
function validateDataUsersUpdate(req,res,next){
    let direction = req.body.direction;
    let user = req.body.user;
    let phone = req.body.phone;
    if(direction == null || direction == "" || direction == undefined || user == null || user == "" || user == undefined){
        let code = "400";
        let message = "El campo dirección y usuario son requeridos por favor validar el request";
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

function validateDataProductsUpdate(req,res,next){
    let nameUser = req.body.user;
    let price = req.body.price;
    if(nameUser == null || nameUser == "" || nameUser == undefined){
        let code = "400";
        let message = "El campo usuario es requerido por favor validar el request";
        let newError = new errors(code,message);
        res.status(400).send(newError);
        return;
    }else{
        if(price == null || price == "" || price == undefined){
            next();
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
}

function validateDataOrdersUpdate(req,res,next){
    let status = req.body.status;
    let total = req.body.total;
    let products = req.body.products;
    if(status == null || status == "" || status == undefined){
        let code = "400";
        let message = "El campo estado es requerido por favor validar el request";
        let newError = new errors(code,message);
        res.status(400).send(newError);
        return;
    }else{
        if(total == null || total == "" || total == undefined){
            next();
        }else{
            if(typeof total != "number"){
                let code = "400";
                let message = "El campo total es incorrecto por favor validar el request";
                let newError = new errors(code,message);
                res.status(400).send(newError);
                return;
            }else{
                if(products == null || products == "" || products == undefined){
                    next();
                }else{
                    let i = 0;
                    for(i;i < products.length; i++){
                        let id = products[i].id;
                        if(typeof id != "number"){
                            let code = "400";
                            let message = "El campo id es incorrecto por favor validar el request";
                            let newError = new errors(code,message);
                            res.status(400).send(newError);
                            return;
                        }
                    }
                    next();
                }
            }
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

module.exports = {paramsValidate}