const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
for(const name of ['app.js','core.js','student-extras.js','student-profile.js','faculty-directory.js'])new vm.Script(fs.readFileSync(path.join(root,'dist',name),'utf8'),{filename:name});
for(const name of ['vercel.json','supabase/01-setup.sql','supabase/02-seed.sql','api/index.js','dist/assets/vendor/supabase.js','dist/assets/pdfjs/pdf.mjs'])if(!fs.existsSync(path.join(root,name)))throw Error('Missing deployment file: '+name);
const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const file=match[1];if(!/^(https?:|data:)/.test(file)&&!file.includes('?')&&!fs.existsSync(path.join(root,'dist',file)))throw Error('Missing asset: '+file);}
console.log('Deployment source, browser syntax and linked local assets verified.');
