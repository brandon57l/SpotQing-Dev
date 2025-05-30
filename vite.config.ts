import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', ''); // Charge les variables d'environnement depuis .env

    return {
        define: {
            'process.env.API_KEY': JSON.stringify(env.API_KEY || ''), // Utilise la variable d'environnement ou une chaîne vide si elle n'est pas définie
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '') // Pareil pour GEMINI_API_KEY
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        },
        server: {
            allowedHosts:  ['588b-95-173-217-70.ngrok-free.app'] // Gardez ça si vous en avez besoin
        }
    };
});