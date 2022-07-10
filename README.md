# Wordle Backend

Backend para la aplicación Wordle, prueba técnica para DD3

## Tecnologías utilizadas
Para el desarro de esta API se utilizarón las siguientes tecnologías:
- NodeJS
- Express
- TypeScript
- TypeORM
- Postgres
- JWT
- BCryptjs
- Jest
- Supertest
- node-cron

## Documentación
Puedes consultar la documentación de esta API en la siguiente URL [https://documenter.getpostman.com/view/1511130/UzJQotTd](https://documenter.getpostman.com/view/1511130/UzJQotTd)

## Base de datos
Se incluyen 2 propuestas para la creación de la base de datos

1.- Se incluye el archivo "wordle-backup" el cual es un respaldo de base de datos de postgresql, por lo que se puede usar para montar la base de datos.

2.- Al ejecutar el proyecto por primera vez se crea la estructura de la base de datos, sin embargo hay que llenar la tabla words de forma manual, para lo que se incluye el archivo "insert-words.sql"
