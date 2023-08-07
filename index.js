require('dotenv').config()
const sequelize = require('./db')
const express = require('express')
const models = require('./models/models')
const fileUpload = require('express-fileupload')
const path = require('path')
const cors = require('cors')
const router = require('./routes/router')
const route = require('express')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT
const app = express()


app.use(errorHandler)
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.get('/', (req, res) => {
  return res.json({message: "its okay"})
})

//errors

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(1500, () => {console.log(`server started on port 1500`)})
  } catch (e) {
    console.log(e);
  }
}

start()