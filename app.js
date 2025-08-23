require('dotenv').config({quiet: true})
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const setupSwaggerDocs = require('./swagger')
const authRoutes = require('./src/routes/authRoutes')
const userRoutes = require('./src/routes/userRoutes')
const channelRoutes = require('./src/routes/channelRoutes')
const workspaceRoutes = require('./src/routes/workspaceRoutes')
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

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

setupSwaggerDocs(app);
const path = '/3ird-space/v1/api';

app.use(`${path}/auth`, authRoutes);
app.use(`${path}/user`, authenticate, authorizeRoles('user'), userRoutes);
app.use(`${path}/workspaces`, authenticate, workspaceRoutes);
app.use(`${path}/channels`, authenticate, channelRoutes);

app.use('/', (req, res) => {
    res.status(404).json({
        message: 'Whoops, This is a universal route'
    });
});

module.exports = app;
