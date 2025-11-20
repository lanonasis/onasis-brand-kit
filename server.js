import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5000;
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
};

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  filePath = path.join(__dirname, filePath);
  
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end('<h1>404 Not Found</h1><p>The requested file was not found.</p>');
      } else {
        res.writeHead(500, { 
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end('<h1>500 Internal Server Error</h1>');
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(data);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Brand Kit server running at http://${HOST}:${PORT}/`);
  console.log('Serving LAN Onasis Brand Kit assets...');
});
