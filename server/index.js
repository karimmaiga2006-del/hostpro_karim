require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const AdmZip = require('adm-zip');
const { nanoid } = require('nanoid');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Bouclier
require('./secure')(app);
app.use(require('./ai'));

const SITES_DIR = path.join(__dirname, '../hosted_sites');
if(!fs.existsSync(SITES_DIR)) fs.mkdirSync(SITES_DIR, {recursive:true});

let db = [];
const DB_FILE = path.join(__dirname, 'db.json');
if(fs.existsSync(DB_FILE)) db = JSON.parse(fs.readFileSync(DB_FILE,'utf8'));

const upload = multer({ dest: 'uploads/', limits: { fileSize: 20*1024*1024 } });

app.post('/api/deploy', upload.single('site'), (req,res)=>{
  try{
    const siteName = (req.body.siteName||'site').replace(/[^a-z0-9-]/gi,'-').toLowerCase();
    const id = nanoid(6);
    const subdomain = `${siteName}-${id}`;
    const sitePath = path.join(SITES_DIR, subdomain);
    fs.mkdirSync(sitePath, {recursive:true});
    new AdmZip(req.file.path).extractAllTo(sitePath, true);
    fs.unlinkSync(req.file.path);
    const site = { id, name: req.body.siteName, subdomain, url: `https://${subdomain}.karim.com`, localUrl: `/${subdomain}`, createdAt: new Date() };
    db.push(site);
    fs.writeFileSync(DB_FILE, JSON.stringify(db,null,2));
    res.json({success:true, site});
  } catch(e){ res.status(500).json({error:e.message}); }
});

app.get('/api/sites', (req,res)=> res.json(db.reverse()));
app.use('/:subdomain', (req,res,next)=>{
  const p = path.join(SITES_DIR, req.params.subdomain);
  if(fs.existsSync(p)) return express.static(p)(req,res,next);
  next();
});

app.get('/', (req,res)=> res.send('HostPro KARIM Engine Running ✅'));
const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Serveur sur port '+PORT));