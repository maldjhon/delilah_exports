# Delilah Exports
## Tabla de contenido
1. [Informacion General](#información-general)
2. [Requisitos para instalacion](#requisitos-para-instalacion)
3. [Guia de instalacion](#guia-de-instalacion)
4. [Conclusion](#conclusion)

### Información General
***
API para pedidos de comida deliciosa. Como cliente, podrás registrarte ver el listado de productos y realizar una orden.
Los adminstradores tienen la posibilidad de consultar usuarios, productos y pedidos; crear, actualizar y eliminar productos y pedidos.

### Requisitos para instalación
***
* Tener descargado e intalado git. En caso de no tener instalado el programa, puede seguir el siguiente paso a paso:\
https://git-scm.com/book/es/v2/Inicio---Sobre-el-Control-de-Versiones-Instalaci%C3%B3n-de-Git
* Tener descargado e intalado node.js. En caso de no tener instalado el programa, puede seguir el siguiente paso a paso:\
https://blog.nubecolectiva.com/que-es-y-como-instalar-node-js/
* Crear una cuenta en https://remotemysql.com/ y crear una base de datos. En caso de no tener una cuenta, puede seguir el siguiente paso a paso:\
https://remotemysql.com/tutor1.html

### Guia de instalación
***
1. Crear una carpeta en tu directorio local.
2. Desde la terminal o un cmd ubicarse en el directorio creado.
3. Ejecutar el siguiente comando:\
$ git clone https://github.com/maldjhon/delilah_exports.git
4. Luego de finalizar ejecutar el siguiente comando:\
$ npm install
5. Validar que se haya generado el directorio node_modules
6. Ubicar el archivo .env dar clic derecho y abrir con un editor (block de notas, notepad++, etc)
7. Editar los siguientes parámetros teniendo en cuenta los datos de la base de datos creada en remotemysql.com:\
DB_USER: Usuario de base de datos\
DB_PASS: Contraseña de base de datos\
DB_NAME: Nombre de la base de datos que es igual al usuario de base de datos.
8. Una vez realizado los ajustes al archivo .env, ingresar a la cuenta creada en remotemysql.com:\
https://remotemysql.com/phpmyadmin/
9. Dar clic a la pestaña "SQL"
10. Ejecutar el archivo "create_database.sql" en phpmyadmin. Este archivo se encuentra en el directorio clonado:\
$ \path_directorio_clonado\sql\create_database.sql
12. Una vez ejecutadas todas las sentencias de sql, desde la terminal o cmd ubicado en el directorio ejecutar el comando:\
$ node app.js
13. Luego de ejecutar el comando, validar las siguientes entradas en la consola que confirman la correcta conexión con la base de datos y la aplicación:\
$ Conexión exitosa...\
$ Aplicación Inicializando...
14. En un navegador (Chrome, Edge, Explorer, etc) ingresar la siguiente URL:\
http://localhost:3000/api-docs

### Conclusión
***
> Una vez finalizado los pasos anterior se tendrá funcionando la aplicación y se mostrará la documentación de cada API para su consumo.
