# Dyte Backend Task
Dyte's take home task for backend development.

[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/10485826-a44b3838-fe37-4b59-9245-d00f7a279c52?action=collection%2Ffork&collection-url=entityId%3D10485826-a44b3838-fe37-4b59-9245-d00f7a279c52%26entityType%3Dcollection%26workspaceId%3D58ecc89f-c186-4756-8d21-30d9578e47a6#?env%5Bdyte%5D=W3sia2V5IjoidG9rZW4iLCJ2YWx1ZSI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkNJNklqSTJPR1V6TVdNMkxUQTROV0V0TkRVeU9TMWlOalkzTFRWbU9USTNaVEprT1RSaE55SXNJbWxoZENJNk1UWXlOalV4TnpZNE0zMC5wSU1IT3hldWRDQ0JobGtZX3QtUGZZel8yMXQwMGh2c250SXQ5N1IzclprIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJhZG1pbi1rZXkiLCJ2YWx1ZSI6ImFkbWluIiwiZW5hYmxlZCI6dHJ1ZX1d)

## Info
* Uses Express as backend. 
* Runs Moleculer API Gateway in middleware mode on express. [[Link](https://moleculer.services/docs/0.12/moleculer-web.html#ExpressJS-middleware-usage)]
* Uses [Prisma](https://www.prisma.io/) as the Database ORM with Postgres as the database.
* Has two Moleculer services: API Gateway and Webhooks.
* Batch size for concurrent requests [trigger route] can be configured by [env variables](./.env.example)
* In addition to JWTs, admins have to send `admin-id` as a header, which is cross-checked with the enviroment variable (can be a set of rotating uuids which is shared internally)
* Written in TypeScript. (obv)
* [Postman Collection(JSON) here](https://www.getpostman.com/collections/d6e6df0a246d12f7f4b5)

## Instructions To Run
* Install dependencies
```
npm install
```
* Run Postgres (remember to set env vars!)
* Perform DB migrations with prisma
```
npx prisma migrate dev
npx prisma generate
```
* Start the server (also transpiles TS to dist/)
```
npm start
```

## NPM scripts
- `npm run build`: Transpiles TS to JS
- `npm run start`: starts the moleculer and express servers
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose

## TODOs:
- [ ] test retry logic properly (I'm sure interceptor method is wrong)
- [ ] dockerize

<div align="center">
Made with :heart: by <a href="https://sidv.dev">Siddhartha Varma</a>
</div>