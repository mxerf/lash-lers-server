require('dotenv').config()
const sequelize = require('./db')
const express = require('express')
const models = require('./models/models')
const fileUpload = require('express-fileupload')
const path = require('path')
const cors = require('cors')
const router = require('./routes/router')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT
const app = express()


app.use(errorHandler)
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

//errors

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => {console.log(`server started on port ${PORT}`)})
  } catch (e) {
    console.log(e);
  }
}

start()