declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
    PORT: string
    MAL_CLIENT_ID: string
    MONGO_DB_URI: string
  }
}
