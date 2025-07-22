require('dotenv').config({quiet: true})
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const PORT = process.env.PORT
const connection = require('./src/config/databaseConnection')

const authRoutes = require('./src/routes/authRoutes')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
connection()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const path = '/3ird-space/v1/api'

app.use(`${path}/auth`, authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
