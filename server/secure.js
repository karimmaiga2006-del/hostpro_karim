const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
module.exports = (app)=>{
  app.use(helmet({ contentSecurityPolicy:false, crossOriginEmbedderPolicy:false }));
  const limiter = rateLimit({ windowMs:15*60*1000, max:100, message:{error:"Trop de requêtes"} });
  app.use('/api/', limiter);
  app.disable('x-powered-by');
  console.log("✅ Bouclier Anti-Hack activé");
};