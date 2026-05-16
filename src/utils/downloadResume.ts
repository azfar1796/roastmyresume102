// Zero-dependency resume downloader — works 100% in browser natively

interface ResumeSection {
  type: 'name' | 'contact' | 'heading' | 'bullet' | 'text';
  content: string;
}

const HEADING_KEYWORDS = [
  'EXPERIENCE', 'EDUCATION', 'SKILLS', 'SUMMARY', 'OBJECTIVE',
  'PROJECTS', 'CERTIFICATIONS', 'AWARDS', 'VOLUNTEER',
  'LANGUAGES', 'INTERESTS', 'WORK EXPERIENCE', 'TECHNICAL SKILLS',
  'PROFESSIONAL EXPERIENCE', 'PUBLICATIONS', 'REFERENCES',
];

function parseResume(resumeText: string): ResumeSection[] {
  const lines = resumeText.split('\n').filter(l => l.trim());
  return lines.map((line, index) => {
    const trimmed = line.trim();
    if (index === 0) return { type: 'name', content: trimmed };
    if (
      trimmed.includes('@') ||
      trimmed.includes('linkedin.com') ||
      trimmed.includes('github.com') ||
      /\+?[\d\s\-()]{7,}/.test(trimmed)
    ) return { type: 'contact', content: trimmed };
    if (
      HEADING_KEYWORDS.some(k => trimmed.toUpperCase().includes(k)) &&
      trimmed.length < 50
    ) return { type: 'heading', content: trimmed };
    if (/^[•\-*]/.test(trimmed))
      return { type: 'bullet', content: trimmed.replace(/^[•\-*]\s*/, '') };
    return { type: 'text', content: trimmed };
  });
}

function getFilename(resumeText: string, ext: string): string {
  const firstName = resumeText
    .split('\n')[0]
    .trim()
    .split(' ')[0]
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  return `${firstName || 'improved'}_resume.${ext}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function downloadAsPDF(resumeText: string): void {
  const sections = parseResume(resumeText);
  const filename = getFilename(resumeText, 'pdf');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 11pt;
      color: #1a1a1a;
      line-height: 1.5;
      padding: 0.8in 0.9in;
      max-width: 8.5in;
      background: white;
    }
    .name {
      font-family: 'Arial', sans-serif;
      font-size: 26pt;
      font-weight: 700;
      color: #0f0f0f;
      text-align: center;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }
    .contact {
      font-family: 'Arial', sans-serif;
      font-size: 9.5pt;
      color: #555;
      text-align: center;
      margin-bottom: 4px;
    }
    .heading {
      font-family: 'Arial', sans-serif;
      font-size: 10.5pt;
      font-weight: 700;
      color: #1a1a1a;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 16px;
      margin-bottom: 4px;
      padding-bottom: 3px;
      border-bottom: 1.5px solid #4f46e5;
    }
    .bullet {
      font-size: 10.5pt;
      color: #2a2a2a;
      margin: 3px 0 3px 14px;
      position: relative;
    }
    .bullet::before {
      content: '\\2022';
      position: absolute;
      left: -12px;
      color: #4f46e5;
    }
    .text {
      font-size: 10.5pt;
      color: #2a2a2a;
      margin: 2px 0;
    }
    @media print {
      body { padding: 0.6in 0.8in; }
      @page { margin: 0; size: A4; }
    }
  </style>
</head>
<body>
${sections.map(s => {
  switch (s.type) {
    case 'name': return `<div class="name">${escapeHtml(s.content)}</div>`;
    case 'contact': return `<div class="contact">${escapeHtml(s.content)}</div>`;
    case 'heading': return `<div class="heading">${escapeHtml(s.content)}</div>`;
    case 'bullet': return `<div class="bullet">${escapeHtml(s.content)}</div>`;
    case 'text': return `<div class="text">${escapeHtml(s.content)}</div>`;
    default: return '';
  }
}).join('\n')}
</body>
</html>`;

  const iframe = window.document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  iframe.style.width = '800px';
  iframe.style.height = '1000px';
  window.document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) return;

  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      window.document.body.removeChild(iframe);
    }, 2000);
  }, 500);
}

export function downloadAsWord(resumeText: string): void {
  const sections = parseResume(resumeText);
  const filename = getFilename(resumeText, 'doc');

  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='UTF-8'>
  <meta name=ProgId content=Word.Document>
  <meta name=Generator content='Microsoft Word 15'>
  <title>Resume</title>
  <style>
    body {
      font-family: Calibri, Arial, sans-serif;
      font-size: 11pt;
      color: #1a1a1a;
      margin: 1in;
      line-height: 1.4;
    }
    .name {
      font-size: 22pt;
      font-weight: bold;
      text-align: center;
      color: #0f0f0f;
      margin-bottom: 4pt;
      font-family: Calibri, Arial, sans-serif;
    }
    .contact {
      font-size: 10pt;
      text-align: center;
      color: #666;
      margin-bottom: 4pt;
    }
    .heading {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #1a1a1a;
      border-bottom: 1.5pt solid #4f46e5;
      margin-top: 14pt;
      margin-bottom: 4pt;
      padding-bottom: 2pt;
    }
    .bullet {
      font-size: 10.5pt;
      margin-left: 14pt;
      margin-top: 2pt;
      margin-bottom: 2pt;
      color: #2a2a2a;
    }
    .text {
      font-size: 10.5pt;
      color: #2a2a2a;
      margin-top: 2pt;
    }
  </style>
</head>
<body>
${sections.map(s => {
  switch (s.type) {
    case 'name': return `<div class="name">${escapeHtml(s.content)}</div>`;
    case 'contact': return `<div class="contact">${escapeHtml(s.content)}</div>`;
    case 'heading': return `<div class="heading">${escapeHtml(s.content)}</div>`;
    case 'bullet': return `<div class="bullet">\u2022 ${escapeHtml(s.content)}</div>`;
    case 'text': return `<div class="text">${escapeHtml(s.content)}</div>`;
    default: return '';
  }
}).join('\n')}
</body>
</html>`;

  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.href = url;
  a.download = filename;
  window.document.body.appendChild(a);
  a.click();
  window.document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAsText(resumeText: string): void {
  const filename = getFilename(resumeText, 'txt');
  const blob = new Blob([resumeText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.href = url;
  a.download = filename;
  window.document.body.appendChild(a);
  a.click();
  window.document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
