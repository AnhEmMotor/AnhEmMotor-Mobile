import process from 'process';
import fs from 'fs';
import path from 'path';
import decomment from 'decomment';
import stripComments from 'strip-comments';

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (
      file === 'node_modules' ||
      file === '.git' ||
      file === '.nuxt' ||
      file === '.output' ||
      file === '.expo' ||
      file === 'android' ||
      file === 'ios' ||
      file === 'dist' ||
      file === 'dist-web' ||
      file === 'build'
    ) {
      continue;
    }

    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (
      filePath.endsWith('.js') ||
      filePath.endsWith('.jsx') ||
      filePath.endsWith('.ts') ||
      filePath.endsWith('.tsx') ||
      filePath.endsWith('.vue') ||
      filePath.endsWith('.html') ||
      filePath.endsWith('.css') ||
      filePath.endsWith('.scss') ||
      filePath.endsWith('.less')
    ) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const args = process.argv.slice(2);
let files = [];
if (args.length > 0) {
  files = args.filter(
    (f) =>
      f.endsWith('.js') ||
      f.endsWith('.jsx') ||
      f.endsWith('.ts') ||
      f.endsWith('.tsx') ||
      f.endsWith('.vue') ||
      f.endsWith('.html') ||
      f.endsWith('.css') ||
      f.endsWith('.scss') ||
      f.endsWith('.less')
  );
} else {
  files = getAllFiles(process.cwd());
}

files.forEach((file) => {
  if (file.includes('config') || file.includes('.eslintrc') || file.includes('scripts')) {
    return;
  }

  try {
    const content = fs.readFileSync(file, 'utf8');

    const directives = [];
    let temp = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*|<!--[\s\S]*?-->/g, (match) => {
        if (/eslint|stylelint|prettier|@ts-/.test(match)) {
            const id = `__DIRECTIVE_${directives.length}__`;
            directives.push(match);
            return id;
        }
        return match;
    });

    let stripped = temp;
    if (file.endsWith('.vue')) {
      try {
        stripped = decomment.html(stripped);
      } catch (e) {
        stripped = stripComments(stripped);
      }
      stripped = stripped.replace(/<script([^>]*)>([\s\S]*?)<\/script>/g, (match, attrs, scriptContent) => {
        try { 
            return `<script${attrs}>${decomment(scriptContent)}<\/script>`; 
        } catch(e) { 
            try { return `<script${attrs}>${stripComments(scriptContent)}<\/script>`; } catch (e2) { return match; }
        }
      });
      stripped = stripped.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (match, attrs, styleContent) => {
        try { return `<style${attrs}>${decomment.text(styleContent)}<\/style>`; } catch(e) { return match; }
      });
    } else if (file.endsWith('.html')) {
      try { stripped = decomment.html(stripped); } catch (e) { stripped = stripComments(stripped); }
    } else if (file.endsWith('.css') || file.endsWith('.scss') || file.endsWith('.less')) {
      try { stripped = decomment.text(stripped); } catch (e) { stripped = stripComments(stripped); }
    } else {
      try { stripped = decomment(stripped); } catch (e) { stripped = stripComments(stripped); }
    }

    directives.forEach((directive, index) => {
        stripped = stripped.replace(`__DIRECTIVE_${index}__`, directive);
    });

    if (content !== stripped) {
      fs.writeFileSync(file, stripped, 'utf8');
    }
  } catch (e) {
    console.error('Failed to strip comments from ' + file + ':', e.message);
  }
});
console.log('Comments stripped successfully.');
