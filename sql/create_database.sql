/******************************************
Descripción: Crea la tabla usuarios
para la base de datos delilah
*******************************************/
CREATE TABLE users (id int PRIMARY KEY NOT NULL AUTO_INCREMENT UNIQUE,
user varchar(50) NOT NULL UNIQUE,
createdAt datetime NOT NULL,
updatedAt datetime NOT NULL,
name varchar(250) NOT NULL,
email varchar(50) NULL,
phone bigint NULL,
direction varchar(100) NULL,
password varchar(250) NOT NULL
);
/******************************************
Descripción: Crea la tabla para roles
para la base de datos delilah
*******************************************/
CREATE TABLE postn (id int PRIMARY KEY NOT NULL AUTO_INCREMENT UNIQUE,
createdAt datetime NOT NULL,
updatedAt datetime NOT NULL,
name varchar(100) NULL,
description varchar(250) NULL);
/******************************************
Descripción: Crea la tabla productos
para la base de datos delilah
*******************************************/
CREATE TABLE products (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT UNIQUE,
createdAt datetime NOT NULL,
updatedAt datetime NOT NULL,
name varchar(50) NOT NULL,
price BIGINT NOT NULL,
description varchar(250) NULL
);
/******************************************
Descripción: Crea la tabla pedidos
para la base de datos delilah
*******************************************/
CREATE TABLE orders (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT UNIQUE,
createdAt datetime NOT NULL,
updatedAt datetime NOT NULL,
orderNum varchar(250) NOT NULL UNIQUE,
status varchar(50) NOT NULL,
payment varchar(50) NOT NULL,
total INT NOT NULL,
description varchar(250) NULL);
/******************************************
Descripción: Crea la tabla pedidos
para la base de datos delilah
*******************************************/
CREATE TABLE ordersToproducts(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE,
createdAt datetime NOT NULL,
updatedAt datetime NOT NULL);
/******************************************
Descripción: Inserta dos roles en la tabla 
para roles para la base de datos delilah
*******************************************/
INSERT INTO postn (id, createdAt, updatedAt,name,description) VALUES(1,sysdate(),sysdate(),'Administrador','Puede realizar acciones CRUD');
INSERT INTO postn (id, createdAt, updatedAt,name,description) VALUES(2,sysdate(),sysdate(),'Cliente','No puede realizar acciones CRUD');
/**************************************************************************
Descripción: Crea la columna postnId la llave foranea de la tabla postn 
en la tabla users para la base de datos delilah
**************************************************************************/
ALTER TABLE users
    ADD COLUMN postnId INT NULL default 2,
    ADD CONSTRAINT `fk_postnuser` FOREIGN KEY (postnId)
        REFERENCES postn (id);
/*************************************************************************
Descripción: Crea la columna userId la llave foranea de la tabla products
en la tabla products para la base de datos delilah
**************************************************************************/
ALTER TABLE products
    ADD COLUMN userId INT NULL,
    ADD CONSTRAINT `fk_userproducts` FOREIGN KEY (userId)
        REFERENCES users (id);
/*************************************************************************
Descripción: Crea la columna createdBy la llave foranea de la tabla users
en la tabla products para la base de datos delilah
**************************************************************************/
ALTER TABLE orders
    ADD COLUMN userId INT NULL,
    ADD CONSTRAINT `fk_userorders` FOREIGN KEY (userId)
        REFERENCES users (id);
/*************************************************************************
Descripción: Crea la columna orderId la llave foranea de la tabla orders
en la tabla ordersToproducts para la base de datos delilah
**************************************************************************/
ALTER TABLE ordersToproducts
    ADD COLUMN orderId INT NULL,
    ADD CONSTRAINT `fk_orderproducts` FOREIGN KEY (orderId)
        REFERENCES orders (id);
/*************************************************************************
Descripción: Crea la columna orderId la llave foranea de la tabla orders
en la tabla ordersToproducts para la base de datos delilah
**************************************************************************/
ALTER TABLE ordersToproducts
    ADD COLUMN productId INT NULL,
    ADD CONSTRAINT `fk_productorders` FOREIGN KEY (productId)
        REFERENCES products (id);