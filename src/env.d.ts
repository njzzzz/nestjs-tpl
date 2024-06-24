declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    REDIS_HOST: string
    REDIS_PORT: string
    REDIS_PASSWORD: string
    SECRET: string
    TOKEN_TTL: string
    PORT: string
  }
}
