/**************************************************
Descripción: Llama las librerías express, bodyParse, 
mysql, JWT
****************************************************/
const express = require ("express");
var {validateData} = require("./modules/dataValidations");
const variables = require('./modules/config');
const {validateUser} = require("./modules/validateUsers");
const {associationData} = require("./modules/associationData");
const {paramsValidate} = require("./modules/paramsValidation")
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");
const app = express();
/*********************************
Descripción: Uso de middlewares
**********************************/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.urlencoded());
app.use(express.json())
app.use(middleware)
/****************************************
Descripción: Uso del método GET
*****************************************/
app.get("/api/users",validateUser,(req,res)=>{
    let method = "getAllUsers";
    associationData (req,res,method);
})
app.get("/api/products",validateUser,(req,res)=>{
    let method = "getAllProducts";
    associationData (req,res,method);
})
app.get("/api/orders",validateUser,(req,res)=>{
    let method = "getOrders";
    associationData (req,res,method);
})
/****************************************
Descripción: Uso del método POST
*****************************************/
app.post("/api/users/login",(req,res)=>{
    loginService(req,res);
})
app.post("/api/users/register",(req,res)=>{
    createUser(req,res);
})
app.post("/api/products/create",validateUser,(req,res)=>{
    createProducts(req,res);
})
app.post("/api/orders/create",validateUser,(req,res)=>{
    createOrders(req,res);
})
/****************************************
Descripción: Uso del método PUT
*****************************************/
app.put("/api/users/update/:id",validateUser, paramsValidate, (req,res)=>{
    updateUsers(req,res);
})
app.put("/api/products/update/:id",validateUser, paramsValidate, (req,res)=>{
    updateProducts(req,res);
})
app.put("/api/orders/update/:id",validateUser, paramsValidate, (req,res)=>{
    updateOrders(req,res);
})
/****************************************
Descripción: Uso del método DELETE
*****************************************/
app.delete("/api/products/delete/:id",validateUser, (req,res)=>{
    deleteProducts(req,res);
})
app.delete("/api/orders/delete/:id",validateUser, (req,res)=>{
    deleteOrders(req,res);
})
/****************************************
Descripción: Iniciar aplicación
*****************************************/
let port = variables.port;
app.listen(port,()=>{
    console.log("Aplicación Inicializando...");
})

function middleware(req,res,next){
    console.log("Middleware activo...");
    validateData(req,res,next);

}

function loginService(req,res){
    let method = "loginUser";
    associationData(req,res,method);
}

function createUser(req,res){
    let method = "createUser";
    associationData(req,res,method);
}

function createProducts(req,res){
    let method = "createProduct";  
    associationData(req,res,method);  
}

function createOrders(req,res){
    let method = "createOrder";  
    associationData(req,res,method);  
}

function updateUsers(req,res){
    let  method = "updateUser";
    associationData(req,res,method);
}

function updateProducts(req,res){
    let  method = "updateProduct";
    associationData(req,res,method);
}

function updateOrders(req,res){
    let  method = "updateOrder";
    associationData(req,res,method);
}

function deleteProducts(req,res){
    let  method = "deleteProduct";
    associationData(req,res,method);
}

function deleteOrders(req,res){
    let  method = "deleteOrder";
    associationData(req,res,method);
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