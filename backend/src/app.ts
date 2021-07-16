import express from 'express'
import db from './database/models'

db.sequelize.sync()

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send({ Hello: 'World' })
})

export default app
