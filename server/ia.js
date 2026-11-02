const express = require('express');
const router = express.Router();
router.post('/api/ai-help', (req,res)=>{
  const q = (req.body.question||'').toLowerCase();
  let a = "Prépare ton site en zip avec index.html et upload le.";
  if(q.includes("portfolio")) a = "Pour portfolio: dossier avec index.html + style.css, zip et upload.";
  if(q.includes("boutique")) a = "Pour boutique: ton site avec bouton WhatsApp, zip et upload.";
  if(q.includes("react")) a = "Pour React/Next: npm run build, zip le dossier out/dist et upload.";
  res.json({answer:a});
});
module.exports = router;