const fs = require('fs');
const path = require('path');

const SRC = 'C:\\Users\\javie\\Desktop\\TRABAJO\\Instalaciones\\StrengthCoach\\docs\\legal';
const OUT = __dirname;

function mdToHtml(md) {
  const lines = md.split('\n');
  let html = '';
  let inList = false;
  let firstH1Done = false;

  function inline(text) {
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/`(.+?)`/g, '<code>$1</code>');
    return text;
  }

  for (const raw of lines) {
    const line = raw;
    if (line.trim() === '') {
      if (inList) { html += '</ul>\n'; inList = false; }
      continue;
    }
    if (line.startsWith('# ')) {
      // skip the top H1 title, we render it ourselves in the template
      firstH1Done = true;
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<h2>${inline(line.slice(3))}</h2>\n`;
      continue;
    }
    if (line.startsWith('> ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<blockquote>${inline(line.slice(2))}</blockquote>\n`;
      continue;
    }
    if (line.startsWith('- ')) {
      if (!inList) { html += '<ul>\n'; inList = true; }
      html += `<li>${inline(line.slice(2))}</li>\n`;
      continue;
    }
    if (line.startsWith('**Última actualización:**') || line.startsWith('**Last updated:**')) {
      html += `<p class="updated">${inline(line)}</p>\n`;
      continue;
    }
    html += `<p>${inline(line)}</p>\n`;
  }
  if (inList) html += '</ul>\n';
  return html;
}

const PAGE_TEMPLATE = ({ title, lang, body, switchHref, switchLabel, homeLabel }) => `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — Evolution Force</title>
<style>
  :root {
    --bg: #0B0D0F;
    --surface: #171A1D;
    --border: #262B2F;
    --text: #F5F7F8;
    --text-muted: #9AA3A8;
    --accent: #B7F23A;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
  }
  .page { max-width: 720px; margin: 0 auto; padding: 48px 20px 80px; }
  .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; font-size: 14px; }
  .topbar a { color: var(--accent); text-decoration: none; }
  .topbar a:hover { text-decoration: underline; }
  h1 { font-size: 28px; font-weight: 800; margin: 0 0 4px; letter-spacing: -0.01em; }
  h2 { font-size: 18px; font-weight: 700; margin: 32px 0 10px; color: var(--accent); }
  p { margin: 0 0 14px; color: var(--text); font-size: 15px; }
  p.updated { color: var(--text-muted); font-size: 13px; margin-bottom: 24px; }
  ul { margin: 0 0 14px; padding-left: 20px; }
  li { margin-bottom: 6px; font-size: 15px; }
  blockquote {
    margin: 0 0 24px;
    padding: 12px 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: 8px;
    color: var(--text-muted);
    font-size: 13.5px;
  }
  code {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1px 5px;
    font-size: 13px;
  }
  strong { color: var(--text); }
</style>
</head>
<body>
<div class="page">
  <div class="topbar">
    <a href="index.html">&larr; ${homeLabel}</a>
    <a href="${switchHref}">${switchLabel}</a>
  </div>
  <h1>${title}</h1>
  ${body}
</div>
</body>
</html>
`;

const docs = [
  { src: 'privacy-policy.es.md', out: 'privacidad.html', lang: 'es', title: 'Política de Privacidad', switchHref: 'privacy.html', switchLabel: 'English version', homeLabel: 'Inicio' },
  { src: 'privacy-policy.en.md', out: 'privacy.html', lang: 'en', title: 'Privacy Policy', switchHref: 'privacidad.html', switchLabel: 'Versión en español', homeLabel: 'Home' },
  { src: 'terms-of-service.es.md', out: 'terminos.html', lang: 'es', title: 'Términos de Servicio', switchHref: 'terms.html', switchLabel: 'English version', homeLabel: 'Inicio' },
  { src: 'terms-of-service.en.md', out: 'terms.html', lang: 'en', title: 'Terms of Service', switchHref: 'terminos.html', switchLabel: 'Versión en español', homeLabel: 'Home' },
];

for (const d of docs) {
  const md = fs.readFileSync(path.join(SRC, d.src), 'utf8');
  const body = mdToHtml(md);
  const html = PAGE_TEMPLATE({ title: d.title, lang: d.lang, body, switchHref: d.switchHref, switchLabel: d.switchLabel, homeLabel: d.homeLabel });
  fs.writeFileSync(path.join(OUT, d.out), html);
  console.log('Wrote', d.out);
}

const INDEX = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Evolution Force — Documentos y soporte</title>
<style>
  :root { --bg:#0B0D0F; --surface:#171A1D; --border:#262B2F; --text:#F5F7F8; --text-muted:#9AA3A8; --accent:#B7F23A; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font-family:-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
  .page { max-width:560px; margin:0 auto; padding:80px 20px; text-align:center; }
  h1 { font-size:26px; font-weight:800; margin:0 0 8px; }
  p.sub { color:var(--text-muted); margin:0 0 40px; font-size:15px; }
  .links { display:flex; flex-direction:column; gap:12px; }
  a.doc {
    display:block; padding:16px 20px; background:var(--surface); border:1px solid var(--border);
    border-radius:12px; color:var(--text); text-decoration:none; font-weight:600; font-size:15px;
    transition: border-color 0.15s;
  }
  a.doc:hover { border-color: var(--accent); }
  a.doc span { display:block; color:var(--text-muted); font-weight:400; font-size:13px; margin-top:2px; }
</style>
</head>
<body>
<div class="page">
  <h1>Evolution Force</h1>
  <p class="sub">Documentos y soporte / Documents and support</p>
  <div class="links">
    <a class="doc" href="soporte.html">Soporte<span>Support en español</span></a>
    <a class="doc" href="support.html">Support<span>English version</span></a>
    <a class="doc" href="privacidad.html">Política de Privacidad<span>Privacy Policy en español</span></a>
    <a class="doc" href="privacy.html">Privacy Policy<span>English version</span></a>
    <a class="doc" href="terminos.html">Términos de Servicio<span>Terms of Service en español</span></a>
    <a class="doc" href="terms.html">Terms of Service<span>English version</span></a>
  </div>
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, 'documentos.html'), INDEX);
console.log('Wrote documentos.html');
