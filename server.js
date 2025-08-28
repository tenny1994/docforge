// server.js — full app (home, cases, document generator, save, export PDF on Render)
// Fixed for GPT-5 (no temperature) and Puppeteer executablePath on Render

const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const { config } = require('dotenv');
config(); // loads .env (DATABASE_URL, OPENAI_API_KEY)

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const docs = require('./docs');

const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
const prisma = new PrismaClient();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ---- Home ----
app.get('/', (req, res) => res.render('index'));

// ---- Documents index (grouped by category) ----
app.get('/documents', (req, res) => {
  const items = Object.entries(docs)
    .filter(([key]) => key !== '_meta')
    .map(([key, v]) => ({
      key,
      name: v.name,
      category: v.category || 'general',
      categoryLabel:
        (docs._meta && docs._meta.categories && docs._meta.categories[v.category]) ||
        'General'
    }));
  res.render('documents', { items });
});

// ---- Show dynamic form for a given doc type ----
app.get('/documents/:type/new', (req, res) => {
  const spec = docs[req.params.type];
  if (!spec) return res.status(404).send('Unknown document type');
  res.render('doc_form', { type: req.params.type, name: spec.name, fields: spec.fields, output: null });
});

// ---- Generate draft with OpenAI and show it ----
app.post('/documents/:type/generate', async (req, res) => {
  const { type } = req.params;
  const spec = docs[type];
  if (!spec) return res.status(404).send('Unknown document type');

  const filled = {};
  (spec.fields || []).forEach(f => {
    filled[f.key] = (req.body[f.key] || f.default || '').toString().trim();
  });

  const missing = (spec.fields || []).filter(f => f.required && !filled[f.key]);
  if (missing.length) {
    return res.render('doc_form', {
      type, name: spec.name, fields: spec.fields,
      output: `Missing: ${missing.map(m => m.label).join(', ')}`
    });
  }

  const system = spec.system;
  const user = spec.userTemplate({ fields: filled });

  let draft = '';
  try {
    const resp = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    });
    draft = resp.choices?.[0]?.message?.content?.trim() || '';
  } catch (e) {
    draft = `Generation error: ${e.message}`;
  }

  res.render('doc_form', { type, name: spec.name, fields: spec.fields, output: draft });
});

// ---- Save edited draft to Cases ----
app.post('/documents/:type/save', async (req, res) => {
  const { type } = req.params;
  const spec = docs[type];
  if (!spec) return res.status(404).send('Unknown document type');

  const draft = (req.body.draft || '').toString();
  const title = `${spec.name} – Edited ${new Date().toISOString().slice(0, 10)}`;
  await prisma.case.create({ data: { title, content: draft } });

  res.redirect('/cases');
});

// ---- Export draft as PDF (Render: use installed Chrome) ----
app.post('/documents/:type/export-pdf', async (req, res) => {
  const { type } = req.params;
  const spec = docs[type];
  if (!spec) return res.status(404).send('Unknown document type');

  try {
    const draft = (req.body.draft || '').toString();

    const tplPath = path.join(__dirname, 'templates', 'document.hbs');
    if (!fs.existsSync(tplPath)) {
      return res.status(500).send('Template not found. Make sure templates/document.hbs exists.');
    }
    const tplStr = fs.readFileSync(tplPath, 'utf8');
    const tpl = Handlebars.compile(tplStr);
    const html = tpl({ title: spec.name, draft, date: new Date().toLocaleString() });

    // Get Chrome path from Puppeteer
    const chromePath = await puppeteer.executablePath();

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: chromePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfsDir = path.join(__dirname, 'pdfs');
    if (!fs.existsSync(pdfsDir)) fs.mkdirSync(pdfsDir, { recursive: true });

    const baseName = (spec.name || 'document');
    const asciiBase = baseName
      .replace(/[^\x20-\x7E]/g, '')
      .replace(/[^A-Za-z0-9._-]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 80) || 'document';

    const fileName = `${asciiBase}.pdf`;
    const filePath = path.join(pdfsDir, fileName);

    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: { top: '18mm', right: '16mm', bottom: '18mm', left: '16mm' }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(asciiBase)}.pdf`
    );

    const stream = fs.createReadStream(filePath);
    stream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).send('Failed to read generated PDF.');
    });
    stream.pipe(res);
  } catch (e) {
    console.error('PDF export error:', e);
    res.status(500).send(`PDF error: ${e.message}`);
  }
});

// ---- Simple Case pages ----
app.get('/cases', async (req, res) => {
  const cases = await prisma.case.findMany({ orderBy: { createdAt: 'desc' } });
  res.render('cases', { cases });
});

app.get('/cases/new', (req, res) => res.render('new'));

app.post('/cases', async (req, res) => {
  const { title, content } = req.body;
  await prisma.case.create({ data: { title, content } });
  res.redirect('/cases');
});

// ---- Start server ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Web app running: http://localhost:${PORT}`);
});
