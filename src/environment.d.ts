declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            MYSQL_HOST: string;
            MYSQL_PORT: number;
            MYSQL_USER: string;
            MYSQL_PASSWORD: string;
            MYSQL_DATABASE: string;
            JWT_SECRET: string;
        }
    }
}

export {};