const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/remixed-0d6392aa.html';

  const fp = path.join(ROOT, url);

  if (!fp.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Acceso denegado');
    return;
  }

  fs.readFile(fp, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('No encontrado');
      return;
    }
    const ext = path.extname(fp).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  const urls = [
    `http://127.0.0.1:${PORT}`,
    ...getLocalAddresses().map(a => `http://${a}:${PORT}`)
  ];
  console.log('Servidor activo en:');
  urls.forEach(u => console.log('- ' + u));
});

function getLocalAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal)
        addresses.push(iface.address);
    }
  }
  return addresses;
}

process.on('SIGINT', () => server.close(() => process.exit(0)));
