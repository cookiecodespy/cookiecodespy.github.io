import { copyFile, mkdir } from 'node:fs/promises';
await mkdir('public/assets',{recursive:true});
for (const [family,name] of [['bodoni-moda','headline'],['newsreader','editorial']]) {
  await copyFile(`node_modules/@fontsource-variable/${family}/files/${family}-latin-wght-normal.woff2`,`public/assets/${name}.woff2`);
  await copyFile(`node_modules/@fontsource-variable/${family}/LICENSE`,`public/assets/${name}-OFL.txt`);
}
console.log('Self-hosted fonts prepared');
