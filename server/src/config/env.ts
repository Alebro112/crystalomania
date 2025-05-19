import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT || 5000
export const CORS_ORIGIN = (process.env.CORS_URL || '').split(',')
export const SECRET_KEY = process.env.SECRET_KEY || 'default_secret'