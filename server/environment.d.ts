declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'local' | 'development' | 'production',
      PORT: number,
      CLIENT_URL: string,
      DB_HOST: string,
      DB_PORT: number,
      DB_USER: string,
      DB_PASSWORD: string,
      DB_NAME: string,
      REDIS_HOST: string,
      REDIS_PORT: number,
      SECRET_KEY: string,
      JWT_REFRESH_SECRET: string
      CORS_URL: string
    }
  }
}

export {}