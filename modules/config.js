require("dotenv").config();


module.exports = {database: {
    host: process.env.DB_HOST,
    port : process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialect: process.env.DB_DIAL
},
port: process.env.PORT,
jwtSecret: process.env.SECRET};