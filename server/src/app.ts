import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const session = require('express-session')
import SeuqalizeStore from 'connect-session-sequelize'


import { corsOptions } from '#config/cors.config'
import router from '#router/index.routes'
import errorMiddleware from '#middlewares/error.middleware'
import loggerMiddleware from '#middlewares/logger/logger.middleware'
import { sequelize } from '#config/db'
import passport from '#config/passport'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

const seuqliazeStore = SeuqalizeStore(session.Store)
export const sessionMiddleware = session({
    store: new seuqliazeStore({
        db: sequelize,
        tableName: 'sessions'
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
})
app.use(sessionMiddleware)

app.use(passport.initialize())
app.use(passport.session())

app.use(loggerMiddleware)
app.use('/api', router)
// @ts-ignore
app.use(errorMiddleware)

export default app
