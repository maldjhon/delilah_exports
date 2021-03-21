const {sequelize,Users, Postn, Products,Orders,OrderstoProducts} = require("../db/index");
const {Sequelize,Op} = require('sequelize');
const {executeQuery} = require("./executeQuery");
const jwt = require("jsonwebtoken");
const variables = require('./config');

function associationData (req,res,method){
    switch (method) {
        case "loginUser":
            loginUser(req,res,method);
            break; 
        case "getAllUsers":
            getAllUsers(req,res);
            break;  
        case "getAllProducts":
            getAllProducts(req,res);
            break;
        case "getOrders":
            getOrders(req,res,method);
            break;
        case "createUser":
            createUser(req,res,method);
            break;
        case "createProduct":
            createProduct(req,res,method);
            break;
        case "createOrder":
            createOrder(req,res,method);
            break;
        case "updateUser":
            updateUser(req,res);
            break;
        case "updateProduct":
            updateProduct(req,res);
            break;
        case "updateOrder":
            updateOrder(req,res);
            break;
        case "deleteProduct":
            deleteProduct(req,res);
            break;
        case "deleteOrder":
            deleteOrder(req,res);
            break;    
        default:
            break;
    }
}

function loginUser(req,res,method){
    let user = req.body.user;
    let password = req.body.password;
    let pass = Sequelize.fn('SHA1',password);
    Users.findAll({
        attributes: [["password","PWDB"],[pass,"PWAPP"]],
        where:{
            user: user
        }
    }).then((result)=>{
        executeQuery(result,req,res,method);
    }).catch((err)=>{
        let code = "500";
        let message = "Conexión Fallida a la base de datos: "+err;
        let newError = new errors(code,message);
        res.status(500).send(newError);
        return;
    })
}

function getAllUsers(req,res){
    let secret = variables.jwtSecret;
    let credential = req.headers.authorization;
    let token = credential.split(' ')[1];
    let decoded = jwt.verify(token,secret);
    let userDecoded = decoded.user;
    Users.findAll({
        attributes: ['id','postnId'],
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
            let id = result[0].dataValues.id;
            let profile = result[0].dataValues.postnId;
            if(profile == 1){
                Users.findAll({
                    attributes: ['id','createdAt','updatedAt','user','name','email','phone','direction'],
                    include:[{
                        model: Postn,
                        attributes:['id','createdAt','updatedAt','name','description']
                    }]
                }).then((result)=>{
                    if(result == null || result == "" || result == undefined){
                        let code = "404";
                        let message = "No se ha encontrado ningún resultado";
                        let newError = new errors(code,message);
                        res.status(404).send(newError)
                    }else{
                        let i = 0;
                        let array = new Array();
                        for(i; i < result.length; i++){
                            array.push(result[i].dataValues);
                        }
                        res.status(200).send(array)
                    }
                }).catch((err)=>{
                    let code = "500";
                    let message = "Conexión Fallida a la base de datos: "+err;
                    let newError = new errors(code,message);
                    res.status(500).send(newError);
                    return;
                })
            }else{
                Users.findAll({
                    attributes: ['id','createdAt','updatedAt','user','name','email','phone','direction'],
                    where:{
                        id: id
                    },
                    include:[{
                        model: Postn,
                        attributes:['id','createdAt','updatedAt','name','description']
                    }]
                }).then((result)=>{
                    if(result == null || result == "" || result == undefined){
                        let code = "404";
                        let message = "No se ha encontrado ningún resultado";
                        let newError = new errors(code,message);
                        res.status(404).send(newError)
                    }else{
                        let i = 0;
                        let array = new Array();
                        for(i; i < result.length; i++){
                            array.push(result[i].dataValues);
                        }
                        res.status(200).send(array)
                    }
                }).catch((err)=>{
                    let code = "500";
                    let message = "Conexión Fallida a la base de datos: "+err;
                    let newError = new errors(code,message);
                    res.status(500).send(newError);
                    return;
                })
            }
        }
    }).catch((err)=>{
        let code = "500";
        let message = "Conexión Fallida a la base de datos: "+err;
        let newError = new errors(code,message);
        res.status(500).send(newError);
        return;
    })
}

function getAllProducts(req,res){
    Products.findAll({
        attributes: ['id','createdAt','updatedAt','name','price','description'],
        include:[{
            model: Users,
            attributes:['id','createdAt','updatedAt','name']
        }]
    }).then((result)=>{
        if(result == null || result == "" || result == undefined){
            let code = "404";
            let message = "No se ha encontrado ningún resultado";
            let newError = new errors(code,message);
            res.status(404).send(newError)
        }else{
            let i = 0;
            let array = new Array();
            for(i; i < result.length; i++){
                array.push(result[i].dataValues);
            }
            res.status(200).send(array);
        }
    }).catch((err)=>{
        let code = "500";
        let message = "Conexión Fallida a la base de datos: "+err;
        let newError = new errors(code,message);
        res.status(500).send(newError);
        return;
    })
}

function  getOrders(req,res,method){
    let idOrder = "";
    let secret = variables.jwtSecret;
    let credential = req.headers.authorization;
    let token = credential.split(' ')[1];
    let decoded = jwt.verify(token,secret);
    let userDecoded = decoded.user;
    let sqlAdmin = `SELECT orders.id as orderId, orders.createdAt as createOrder, orders.updatedAt as updateOrder, orders.orderNum, orders.orderNum, orders.status, orders.payment, orders.total, orders.description as descOrder, users.id as userId, users.createdAt as createUser, users.updatedAt as updateUser, users.name as userName, users.direction, products.id as productId, products.createdAt as createProd, products.updatedAt as updateProd, products.name as prodName FROM orders as orders LEFT OUTER JOIN users as users ON orders.userId = users.id LEFT OUTER JOIN ordersToproducts as ordersToproducts ON orders.id = ordersToproducts.orderId LEFT OUTER JOIN products as products ON ordersToproducts.productId = products.id ORDER BY orders.id`;
    Users.findAll({
        attributes: ['id','postnId'],
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
            let idUser = result[0].dataValues.id;
            let profile = result[0].dataValues.postnId;
            let sqlUser = `SELECT orders.id as orderId, orders.createdAt as createOrder, orders.updatedAt as updateOrder, orders.orderNum, orders.orderNum, orders.status, orders.payment, orders.total, orders.description as descOrder, users.id as userId, users.createdAt as createUser, users.updatedAt as updateUser, users.name as userName, users.direction, products.id as productId, products.createdAt as createProd, products.updatedAt as updateProd, products.name as prodName FROM orders as orders LEFT OUTER JOIN users as users ON orders.userId = users.id LEFT OUTER JOIN ordersToproducts as ordersToproducts ON orders.id = ordersToproducts.orderId LEFT OUTER JOIN products as products ON ordersToproducts.productId = products.id WHERE orders.userId = '${idUser}' ORDER BY orders.id`;
            if(profile == 1){
                sequelize.query(sqlAdmin,{
                    type: sequelize.QueryTypes.SELECT
                }).then((result)=>{
                    if(result == null || result == "" || result == undefined){
                        let code = "404";
                        let message = "No se ha encontrado ningún resultado";
                        let newError = new errors(code,message);
                        res.status(404).send(newError)
                    }else{
                        returnDataOrders(result,res);
                    }
                }).catch((err)=>{
                    let code = "500";
                    let message = "Conexión Fallida a la base de datos: "+err;
                    let newError = new errors(code,message);
                    res.status(500).send(newError);
                    return;
                })
            }else{
                sequelize.query(sqlUser,{
                    type: sequelize.QueryTypes.SELECT
                }).then((result)=>{
                    if(result == null || result == "" || result == undefined){
                        let code = "404";
                        let message = "No se ha encontrado ningún resultado";
                        let newError = new errors(code,message);
                        res.status(404).send(newError)
                    }else{
                        returnDataOrders(result,res);
                    }
                }).catch((err)=>{
                    let code = "500";
                    let message = "Conexión Fallida a la base de datos: "+err;
                    let newError = new errors(code,message);
                    res.status(500).send(newError);
                    return;
                })
            }
        }
    }).catch((err)=>{
        let code = "500";
        let message = "Conexión Fallida a la base de datos: "+err;
        let newError = new errors(code,message);
        res.status(500).send(newError);
        return;
    })    
}

function createUser(req,res,method){
    let user = req.body.user;
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let direction = req.body.direction;
    let password = req.body.password;
    let profile = req.body.profile;    
    if(profile == "administrador"){
        let date = new Date();
        let pass = Sequelize.fn('SHA1',password)
        Users.create({
            createdAt: date,
            updatedAt: date,
            user: user,
            name: name,
            email: email,
            phone: phone,
            direction: direction,
            password: pass,
            postnId: 1
        },{fields:['createdAt','updatedAt','user','name','email','phone','direction','password','postnId']}).then((result)=>{
            executeQuery(result,req,res,method);
        }).catch((err)=>{
            let code = "500";
            let message = "Conexión Fallida a la base de datos: "+err;
            let newError = new errors(code,message);
            res.status(500).send(newError);
            return;
        })
    }else{
        let date = new Date();
        let pass = Sequelize.fn('SHA1',password)
        Users.create({
            createdAt: date,
            updatedAt: date,
            user: user,
            name: name,
            email: email,
            phone: phone,
            direction: direction,
            password: pass
        },{fields:['createdAt','updatedAt','user','name','email','phone','direction','password']}).then((result)=>{
            executeQuery(result,req,res,method);
        }).catch((err)=>{
            console.log(err);
            let code = "500";
            let message = "Conexión Fallida a la base de datos: "+err;
            let newError = new errors(code,message);
            res.status(500).send(newError);
            return;
        })
    }
}

function createProduct(req,res,method){
    let date = new Date();
    let name = req.body.name;
    let price = req.body.price;
    let description = req.body.description;
    let nameUser = req.body.user;
    Users.findAll({
        attributes:["id"],
        where:{
            user:nameUser,
            postnId: 1
        }
    }).then((result)=>{
        if(result == null || result == "" || result == undefined){
            let code = "400";
            let message = "El campo usuario no es valido";
            let newError = new errors(code,message);
            res.status(400).send(newError);
            return;
        }else{
            let idUser = result[0].dataValues.id;
            Products.create({
                createdAt: date,
                updatedAt: date,
                name: name,
                price: price,
                description: description,
                userId: idUser
            },{
                fields: ["createdAt","updatedAt","name","price","description","userId"]
            }).then((result)=>{
                executeQuery(result,req,res,method);
            }).catch((err)=>{
                let code = "500";
                let message = "Conexión Fallida a la base de datos: "+err;
                let newError = new errors(code,message);
                res.status(500).send(newError);
                return;
            })            
        }
    }).catch((err)=>{
        let code = "500";
        let message = "Conexión Fallida a la base de datos: "+err;
        let newError = new errors(code,message);
        res.status(500).send(newError);
        return;
    })
}

function createOrder(req,res,method){
    let date = new Date();
    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let payment = req.body.payment;
    let total = req.body.total;
    let description = req.body.description;
    let userId = req.body.user;
    let products = req.body.products;
    Users.findAll({
        attributes:["id","name"],
        where:{
            user:userId
        }
    }).then((result)=>{
        if(result == null || result == "" || result == undefined){
            let code = "400";
            let message = "El campo usuario no es valido";
            let newError = new errors(code,message);
            res.status(400).send(newError);
            return;
        }let idUser = result[0].dataValues.id;
        let nameUser = result[0].dataValues.name;
        orderNum = nameUser+" "+day+month+year+hour+minutes+seconds;
        Orders.create({
            createdAt: date,
            updatedAt: date,
            orderNum: orderNum,
            status: "Nuevo",
            payment: payment,
            total: total,
            userId: idUser,
            description: description
        },{
            fields: ["createdAt","updatedAt","orderNum","status","payment","total","userId","description"]
        }).then((result)=>{
            createRelationOrdersProdutc(products,result,req,res,method);
        }).catch((err)=>{
            let code = "500";
            let message = "Conexión Fallida a la base de datos: "+err;
            let newError = new errors(code,message);
            res.status(500).send(newError);
            return;
        })
    }).catch((err)=>{
        let code = "500";
        let message = "Conexión Fallida a la base de datos: "+err;
        let newError = new errors(code,message);
        res.status(500).send(newError);
        return;
    })
}

function updateUser(req,res){
    let id = req.params.id;
    let user = req.body.user;
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let direction = req.body.direction;
    let password = req.body.password;
    let pass = "";
    Users.findAll({
        attributes:["user"],
        where:{
            id: id
        }
    }).then((result)=>{
        let userRes = result[0].dataValues.user;
        if(user == userRes){
            let newObject = new Object;
            newObject.direction = direction;
            if(name != null && name != "" && name != undefined){
                newObject.name = name;
                if(email != null && email != "" && email != undefined){
                    newObject.email = email;
                    if(phone != null && phone != "" && phone != undefined){
                        newObject.phone = phone;
                        if(password != null && password != "" && password != undefined){
                            pass = Sequelize.fn('SHA1',password);
                            newObject.password = pass;
                        }
                    }
                }else{
                    if(phone != null && phone != "" && phone != undefined){
                        newObject.phone = phone;
                        if(password != null && password != "" && password != undefined){
                            pass = Sequelize.fn('SHA1',password);
                            newObject.password = pass;
                        }
                    }
                }
            }else{
                if(email != null && email != "" && email != undefined){
                    newObject.email = email;
                    if(phone != null && phone != "" && phone != undefined){
                        newObject.phone = phone;
                        if(password != null && password != "" && password != undefined){
                            pass = Sequelize.fn('SHA1',password);
                            newObject.password = pass;
                        }
                    }
                }else{
                    if(phone != null && phone != "" && phone != undefined){
                        newObject.phone = phone;
                        if(password != null && password != "" && password != undefined){
                            pass = Sequelize.fn('SHA1',password);
                            newObject.password = pass;
                        }
                    }else{
                        if(password != null && password != "" && password != undefined){
                            pass = Sequelize.fn('SHA1',password);
                            newObject.password = pass;
                        }
                    }
                }
            }
            Users.update(newObject,{
                where:{
                    id:id
                }
            }).then((result)=>{
                let value = result[0];
                if(value == 1){
                    res.status(200).send();
                }else{
                    let code = "404";
                    let message = "El producto que se esta actualizando no se encuentra o no existe";
                    let newError = new errors(code,message);
                    res.status(404).send(newError);
                    return;
                }
            }).catch((err)=>{
                let code = "500";
                let message = "Conexión Fallida a la base de datos: "+err;
                let newError = new errors(code,message);
                res.status(500).send(newError);
                return;
            })
        }else{
            let code = "400";
            let message = "El campo usuario no es valido";
            let newError = new errors(code,message);
            res.status(400).send(newError);
            return;
        }
    }).catch((err)=>{
        let code = "500";
        let message = "Conexión Fallida a la base de datos: "+err;
        let newError = new errors(code,message);
        res.status(500).send(newError);
        return;
    })
}

function updateProduct(req,res){
    let id = req.params.id;
    let name = req.body.name;
    let price = req.body.price;
    let description = req.body.description;
    let nameUser = req.body.user;
    Users.findAll({
        attributes:["id"],
        where:{
            user:nameUser,
            postnId: 1
        }
    }).then((result)=>{
        if(result == null || result == "" || result == undefined){
            let code = "400";
            let message = "El campo usuario no es valido";
            let newError = new errors(code,message);
            res.status(400).send(newError);
            return;
        }else{
            let idUser = result[0].dataValues.id;
            let newObject = new Object;
            if (name != null && name != "" && name != undefined){
                newObject.name = name;
                if(price != null && price != "" && price != undefined){
                    newObject.price = price;
                    if(description != null && description != "" && description != undefined) {
                        newObject.description = description;
                    }
                }else{
                    if(description != null && description != "" && description != undefined) {
                        newObject.description = description;
                    }
                }
            }else{
                if(price != null && price != "" && price != undefined){
                    newObject.price = price;
                    if(description != null && description != "" && description != undefined) {
                        newObject.description = description;
                    }
                }else{
                    if(description != null && description != "" && description != undefined) {
                        newObject.description = description;
                    }
                }   
            }
            newObject.userId = idUser;
            Products.update(newObject,{
                where: {
                    id: id
                }
            }).then((result)=>{
                let value = result[0];
                if(value == 1){
                    res.status(200).send();
                }else{
                    let code = "404";
                    let message = "El producto que se esta actualizando no se encuentra o no existe";
                    let newError = new errors(code,message);
                    res.status(404).send(newError);
                    return;
                }
            }).catch((err)=>{
                let code = "500";
                let message = "Conexión Fallida a la base de datos: "+err;
                let newError = new errors(code,message);
                res.status(500).send(newError);
                return;
            })       
        }
    }).catch((err)=>{
        let code = "500";
        let message = "Conexión Fallida a la base de datos: "+err;
        let newError = new errors(code,message);
        res.status(500).send(newError);
        return;
    })
}

function updateOrder(req,res){
    let id = req.params.id;
    let status = req.body.status;
    let payment = req.body.payment;
    let total = req.body.total;
    let description = req.body.description;
    let products = req.body.products;
    let newObject = new Object;
    if(status != null && status != "" && status != undefined){
        newObject.status = status;
        if(payment != null && payment != "" && payment != undefined){
            newObject.payment = payment;
            if(total != null && total != "" && total != undefined){
                newObject.total = total;
                if(description != null && description != "" && description != undefined){
                    newObject.description = description;
                }
            }else{
                if(description != null && description != "" && description != undefined){
                    newObject.description = description;
                }
            }
        }else{
            if(total != null && total != "" && total != undefined){
                newObject.total = total;
                if(description != null && description != "" && description != undefined){
                    newObject.description = description;
                }
            }else{
                if(description != null && description != "" && description != undefined){
                    newObject.description = description;
                }
            }
        }
    }else{
        if(payment != null && payment != "" && payment != undefined){
            newObject.payment = payment;
            if(total != null && total != "" && total != undefined){
                newObject.total = total;
                if(description != null && description != "" && description != undefined){
                    newObject.description = description;
                }
            }else{
                if(description != null && description != "" && description != undefined){
                    newObject.description = description;
                }
            }
        }else{
            if(total != null && total != "" && total != undefined){
                newObject.total = total;
                if(description != null && description != "" && description != undefined){
                    newObject.description = description;
                }
            }else{
                if(description != null && description != "" && description != undefined){
                    newObject.description = description;
                }
            }
        }
    }
    Orders.update(newObject,{
        where:{
            id:id
        }
    }).then((result)=>{
        let value = result[0];
        if(value == 1){
            setOrdersProducts(id,products,res);
        }else{
            let code = "404";
            let message = "El pedido que se esta actualizando no se encuentra o no existe";
            let newError = new errors(code,message);
            res.status(404).send(newError);
            return;
        }
    }).catch((err)=>{
        let code = "500";
        let message = "Conexión Fallida a la base de datos: "+err.original;
        let newError = new errors(code,message);
        res.status(500).send(newError);
        return;
    })
}

function deleteProduct(req,res){
    let id = req.params.id;
    Products.destroy({
        where: {
            id: id
        }
    }).then((result)=>{
        if(result > 0){
            res.status(200).send();
        }else{
            let code = "404";
            let message = "El producto que se esta eliminando no se encuentra o no existe";
            let newError = new errors(code,message);
            res.status(404).send(newError);
            return;
        }
    }).catch((err)=>{
        let code = "500";
        let message = "Conexión Fallida a la base de datos: "+err;
        let newError = new errors(code,message);
        res.status(500).send(newError);
        return;
    })
}

function deleteOrder(req,res){
    let id = req.params.id;
    OrderstoProducts.destroy({
        where: {
            orderId: id
        }
    }).then((result)=>{
        if(result > 0){
            Orders.destroy({
                where: {
                    id: id
                }
            }).then((result)=>{
                if(result > 0){
                    res.status(200).send();
                }else{
                    let code = "404";
                    let message = "El pedido que se esta eliminando no se encuentra o no existe";
                    let newError = new errors(code,message);
                    res.status(404).send(newError);
                    return;
                }
            }).catch((err)=>{
                let code = "500";
                let message = "Conexión Fallida a la base de datos: "+err;
                let newError = new errors(code,message);
                res.status(500).send(newError);
                return;
            })
        }else{
            let code = "404";
            let message = "El pedido que se esta eliminando no se encuentra o no existe";
            let newError = new errors(code,message);
            res.status(404).send(newError);
            return;
        }
    }).catch((err)=>{
        let code = "500";
        let message = "Conexión Fallida a la base de datos: "+err;
        let newError = new errors(code,message);
        res.status(500).send(newError);
        return;
    })
}

/**********************************************
Descripción: Uso de las funciones secundarias
***********************************************/
function createRelationOrdersProdutc(products,result,req,res,method){
    let arrayOrdersToProducts = new Array;
    let orderId = result.dataValues.id;
    let i = 0;
    for(i;i < products.length; i++){
        let newObject = new Object;
        let id = products[i].id;
        newObject.orderId = orderId;
        newObject.productId = id;
        arrayOrdersToProducts.push(newObject);
    }
    OrderstoProducts.bulkCreate(arrayOrdersToProducts,{
        fields:["orderId","productId"]
    }).then((resp)=>{
        console.log("Se crea el registro exitosamente");
        executeQuery(result,req,res,method);
    }).catch((err)=>{
        let code = "500";
        let message = "Conexión Fallida a la base de datos: "+err;
        let newError = new errors(code,message);
        res.status(500).send(newError);
        return;
    })
}

function returnDataOrders(result,res){
    let i = 0;
    let arrayOrders = new Array;
    let arrayProd = new Array;
    let idOld = "";
    let indexNext = 0;
    for(i; i < result.length; i++){
        let newOrder = new Object;
        let newUser = new Object;
        let newProd = new Object;
        let id = result[i].orderId;
        if(i < result.length-1){
            indexNext = i + 1;
        }
        let idNext = result[indexNext].orderId;
        if(id != idOld){
            arrayProd = [];
            newProd.id = result[i].productId;
            newProd.createdAt = result[i].createProd;
            newProd.updatedAt = result[i].updateProd;
            newProd.name = result[i].prodName;
            arrayProd.push(newProd);
            idOld = id;
        }else{
            newProd.id = result[i].productId;
            newProd.createdAt = result[i].createProd;
            newProd.updatedAt = result[i].updateProd;
            newProd.name = result[i].prodName;
            arrayProd.push(newProd);
            if(idNext != id || i == result.length-1){
                newOrder.id = id;
                newOrder.createdAt = result[i].createOrder;
                newOrder.updatedAt = result[i].updateOrder;
                newOrder.orderNum = result[i].orderNum;
                newOrder.status = result[i].status;
                newOrder.payment = result[i].payment;
                newOrder.total = result[i].total;
                newOrder.description = result[i].descOrder;
                newUser.id = result[i].userId;
                newUser.createdAt = result[i].createUser;
                newUser.updatedAt = result[i].updateUser;
                newUser.name = result[i].userName;
                newUser.direction = result[i].direction;
                newOrder.user = newUser;
                newOrder.products = arrayProd;
                arrayOrders.push(newOrder);
            }
        }
    }
    res.status(200).send(arrayOrders);
}

function setOrdersProducts(id,products,res){
    let arrayProdAdd = new Array;
    let arrayProdDelete = new Array;
    let action = "";
    let productId = "";
    let i = 0;
    if(products == null || products == "" || products == undefined){
        res.status(200).send();
    }else{
        for(i; i < products.length; i++){
            let newProdAdd = new Object;
            let newProdDelete = new Object;
            action = products[i].action;
            productId = products[i].id;
            if(action == "Agregar"){
                newProdAdd.orderId = id;
                newProdAdd.productId = productId
                arrayProdAdd.push(newProdAdd);
            }else if(action == "Eliminar"){
                newProdDelete.orderId = id;
                newProdDelete.productId = productId
                arrayProdDelete.push(newProdDelete);
            }
        }
        if(arrayProdAdd != null && arrayProdAdd != "" && arrayProdAdd != undefined){
            OrderstoProducts.bulkCreate(arrayProdAdd,{
                fields:["orderId","productId"]
            }).then((resp)=>{
                console.log("Se crea el registro exitosamente");
                if(arrayProdDelete == null || arrayProdDelete == "" || arrayProdDelete == undefined){
                    res.status(200).send();
                }else{
                    OrderstoProducts.destroy({
                        where: {
                            [Op.or]: arrayProdDelete
                        }
                    }).then((result)=>{
                        if(result > 0){
                            console.log("Se elimina el registro exitosamente");
                            res.status(200).send();
                        }else{
                            let code = "404";
                            let message = "El producto que se esta eliminando no se encuentra o no existe";
                            let newError = new errors(code,message);
                            res.status(404).send(newError);
                            return;
                        }
                    }).catch((err)=>{
                        let code = "500";
                        let message = "Conexión Fallida a la base de datos: "+err;
                        let newError = new errors(code,message);
                        res.status(500).send(newError);
                        return;
                    })
                }
            }).catch((err)=>{
                let code = "500";
                let message = "Conexión Fallida a la base de datos: "+err;
                let newError = new errors(code,message);
                res.status(500).send(newError);
                return;
            })
        }else{
            OrderstoProducts.destroy({
                where: {
                    [Op.or]: arrayProdDelete
                }
            }).then((result)=>{
                if(result > 0){
                    console.log("Se elimina el registro exitosamente");
                    res.status(200).send();
                }else{
                    let code = "404";
                    let message = "El producto que se esta eliminando no se encuentra o no existe";
                    let newError = new errors(code,message);
                    res.status(404).send(newError);
                    return;
                }
            }).catch((err)=>{
                let code = "500";
                let message = "Conexión Fallida a la base de datos: "+err;
                let newError = new errors(code,message);
                res.status(500).send(newError);
                return;
            })
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

module.exports ={associationData}