namespace NodeJS {
    interface ProccessEnv {
        // Application
        PORT: number;
        //DB
        DB_PORT: number;
        DB_NAME: string;
        DB_USERNAME: string;
        DB_PASSWORD: string;
        DB_HOST: string;
        // secrets
        COOKIE_SECRET: string;
        OTP_TOKEN_SECRET: string;
    }
}