import type { CorsOptions } from "cors"

export const defaultCorsOptions: CorsOptions = {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
} 