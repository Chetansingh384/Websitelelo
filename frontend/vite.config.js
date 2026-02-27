import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Custom plugin to serve ../images/ at /images/ URL
const serveRootImages = () => ({
    name: 'serve-root-images',
    configureServer(server) {
        server.middlewares.use('/images', (req, res, next) => {
            const filePath = path.resolve(__dirname, '../images', req.url.replace(/^\//, ''));
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath).toLowerCase();
                const mimeTypes = {
                    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
                    '.png': 'image/png', '.gif': 'image/gif',
                    '.webp': 'image/webp', '.svg': 'image/svg+xml'
                };
                res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
                fs.createReadStream(filePath).pipe(res);
            } else {
                next();
            }
        });
    }
});

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), serveRootImages()],
    server: {
        fs: {
            allow: ['..']
        }
    }
})
