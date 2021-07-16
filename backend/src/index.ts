import app from './app'
import http from 'http'

const PORT: number = Number(process.env.PORT) || 8080

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log('server started')
})
