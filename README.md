[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/10485826-a44b3838-fe37-4b59-9245-d00f7a279c52?action=collection%2Ffork&collection-url=entityId%3D10485826-a44b3838-fe37-4b59-9245-d00f7a279c52%26entityType%3Dcollection%26workspaceId%3D58ecc89f-c186-4756-8d21-30d9578e47a6#?env%5Bdyte%5D=W3sia2V5IjoidG9rZW4iLCJ2YWx1ZSI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkNJNklqSTJPR1V6TVdNMkxUQTROV0V0TkRVeU9TMWlOalkzTFRWbU9USTNaVEprT1RSaE55SXNJbWxoZENJNk1UWXlOalV4TnpZNE0zMC5wSU1IT3hldWRDQ0JobGtZX3QtUGZZel8yMXQwMGh2c250SXQ5N1IzclprIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJhZG1pbi1rZXkiLCJ2YWx1ZSI6ImFkbWluIiwiZW5hYmxlZCI6dHJ1ZX1d)

# Dyte Backend Task
Dyte's take home task for backend development.
## Info
* Uses Express as backend. 
* Runs Moleculer API Gateway in middleware mode on express. [[Link](https://moleculer.services/docs/0.12/moleculer-web.html#ExpressJS-middleware-usage)]
* Uses [Prisma](https://www.prisma.io/) as the Database ORM
* Has two Moleculer services: API Gateway and Webhooks
* Written in TypeScript (obv)


## TODOs:
- [ ] test retry logic properly (I'm sure interceptor method is wrong)
- [ ] dockerize
- [x] [Postman Docs(JSON)](https://www.getpostman.com/collections/d6e6df0a246d12f7f4b5)


## NPM scripts
- `npm run build`: Transpiles TS to JS
- `npm run start`: starts the moleculer and express servers
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose
