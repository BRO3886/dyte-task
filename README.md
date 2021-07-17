[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# Dyte Backend Task
Dyte's take home task for backend.
## Info
* Uses Express as backend. 
* Runs Moleculer API Gateway in middleware mode on express. [[Link](https://moleculer.services/docs/0.12/moleculer-web.html#ExpressJS-middleware-usage)]
* Uses [Prisma](https://www.prisma.io/) as the Database ORM
* Has two Moleculer services: API Gateway and Webhooks
* Written in TypeScript (obv)



## NPM scripts

- `npm run dev`: Start development mode (load all services locally)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose
