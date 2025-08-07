require('dotenv').config({quiet: true})
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const setupSwaggerDocs = require('./swagger')
const PORT = process.env.PORT
const connection = require('./src/config/databaseConnection')

const authRoutes = require('./src/routes/authRoutes')
const userRoutes = require('./src/routes/userRoutes')
const {authenticate, authorizeRoles} = require("./src/middlewares/authMiddleware");

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Cookie'
    ],
}));

connection()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

setupSwaggerDocs(app)

const path = '/3ird-space/v1/api'

app.use(`${path}/auth`, authRoutes)
app.use(`${path}/user`, authenticate, authorizeRoles('user'), userRoutes)

app.use('/', (req, res) =>{
    res.status(404).json({
        message: 'Whoops, This is a universal route'
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
