# Next.js Teslo Shop
Para correr localmente, se necesita la base de datos
```
docker-compose up -d
```
## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__

* MongoDB URL local
```
mongodb://localhost:27017/teslodb
```
* Reconstruir los modulos de node y levantar Next
```
yarn install
yarn dev
```

## Llenar la base de datos con la información de pruebas
Llamar
```
http://localhost:3000/api/seed
```