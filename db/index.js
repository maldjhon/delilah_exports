const {Sequelize} = require('sequelize');
const variables = require('../modules/config');

let host = variables.database.host;
let port = variables.database.port;
let dbName = variables.database.dbName;
let user = variables.database.user;
let password = variables.database.password;
let dialect = variables.database.dialect;

const sequelize = new Sequelize (dbName,user,password,{
    host:host,
    port: port,
    dialect:dialect
})

try{
    sequelize.authenticate();
    console.log("Conexión exitosa...");
}catch(err){
    console.log(err);
}

const Users = sequelize.define("users",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    createdAt:{
        type:Sequelize.DATE,
        unique: false,
        allowNull: false
    },
    updatedAt:{
        type:Sequelize.DATE,
        unique: false,
        allowNull: false
    },
    user:{
        type:Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    name:{
        type:Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    email:{
        type:Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    phone:{
        type:Sequelize.BIGINT,
        unique: false,
        allowNull: true
    },
    direction:{
        type:Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    password:{
        type:Sequelize.STRING,
        unique: false,
        allowNull: false
    }
},{
    freezeTableName: true
})

const Postn = sequelize.define("postn",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    createdAt:{
        type:Sequelize.DATE,
        unique: false,
        allowNull: false
    },
    updatedAt:{
        type:Sequelize.DATE,
        unique: false,
        allowNull: false
    },
    name:{
        type:Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    description:{
        type:Sequelize.STRING,
        unique: false,
        allowNull: true
    }
},{
    freezeTableName: true
})

const Products = sequelize.define("products",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    createdAt:{
        type:Sequelize.DATE,
        unique: false,
        allowNull: false
    },
    updatedAt:{
        type:Sequelize.DATE,
        unique: false,
        allowNull: false
    },
    name:{
        type:Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    price:{
        type:Sequelize.BIGINT,
        unique: false,
        allowNull: false
    },
    description:{
        type:Sequelize.STRING,
        unique: false,
        allowNull: true
    }
},{
    freezeTableName: true
})

const Orders = sequelize.define("orders",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    createdAt:{
        type:Sequelize.DATE,
        unique: false,
        allowNull: false
    },
    updatedAt:{
        type:Sequelize.DATE,
        unique: false,
        allowNull: false
    },
    orderNum:{
        type:Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    status:{
        type:Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    payment:{
        type:Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    total:{
        type:Sequelize.INTEGER,
        unique: false,
        allowNull: false
    },
    description:{
        type:Sequelize.STRING,
        unique: false,
        allowNull: true
    }
},{
    freezeTableName: true
})

const OrderstoProducts = sequelize.define("ordersToproducts",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    createdAt:{
        type:Sequelize.DATE,
        unique: false,
        allowNull: false
    },
    updatedAt:{
        type:Sequelize.DATE,
        unique: false,
        allowNull: false
    },
    orderId:{
        type:Sequelize.INTEGER,
        references:{
            model:Orders,
            key: 'id',
            
        }
    },
    productId:{
        type:Sequelize.INTEGER,
        references:{
            model:Products,
            key: 'id'
        }
    }
},{
    freezeTableName: true
})

Users.belongsTo(Postn,{
    foreignKey:{
        name: "postnId",
        type:Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 2
    }
});

Products.belongsTo(Users,{
    foreignKey:{
        name: "userId",
        type:Sequelize.INTEGER,
        allowNull: true
    }
});

Orders.belongsTo(Users,{
    foreignKey:{
        name: "userId",
        type:Sequelize.INTEGER,
        allowNull: true
    }
});

Orders.belongsToMany(Products,{
    through: OrderstoProducts,
    foreignKey: {
        name: "orderId",
        type:Sequelize.INTEGER,
        allowNull: true
    }
})

Products.belongsToMany(Orders,{
    through: OrderstoProducts,
    foreignKey: {
        name: "productId",
        type:Sequelize.INTEGER,
        allowNull: true
    }
})

sequelize.sync()

module.exports ={sequelize,Users,Postn,Products,Orders,OrderstoProducts}