const development=process.env.NODE_ENV==='development';
const policy=["default-src 'self'", "script-src 'self' 'unsafe-inline'"+(development?" 'unsafe-eval'":""), "style-src 'self' 'unsafe-inline'", "img-src 'self' blob:", "font-src 'self'", "worker-src 'self'", "connect-src "+(development?"'self' ws://127.0.0.1:3240 ws://localhost:3240":"'none'"), "object-src 'none'", "base-uri 'self'", "form-action 'none'", "frame-ancestors 'none'"].join('; ');
const config = { poweredByHeader: false, async headers(){return [{source:'/:path*',headers:[{key:'Content-Security-Policy',value:policy},{key:'Referrer-Policy',value:'no-referrer'},{key:'X-Content-Type-Options',value:'nosniff'}]}];} };
export default config;
