const fs = require('fs');
const path = require('path');
const isWin = /^win/.test(process.platform);

const prefix = "https://codebyzack.github.io/web_demo/";


//demo路径
const demoDirPath = path.resolve('demo');
const templatePath = path.resolve(__dirname,'template.md');
const targetReadme = path.resolve('README.md');

const allPaths = fs.readdirSync(demoDirPath);
const allHtmls = allPaths.filter(p=>path.parse(p).ext === '.html');

const htmlLinks = allHtmls.map((l,i)=>{
    const name = path.parse(l).name;
    let mdLink =  `${i+1}、[${name}](${prefix}${path.join('demo',name)})`;
    if(isWin){
        mdLink = mdLink.replace(/\\/g, "/");
    }
    return mdLink;
}).join('\n\n');

console.log(htmlLinks)


const templateContent = fs.readFileSync(templatePath, 'utf8');
const resContent = templateContent.replace('{{demo-liniks}}', htmlLinks);
fs.writeFileSync(targetReadme, resContent, 'utf8');

console.log('目录生成成功~')
// //demo
// let articles = fs.readdirSync(article).filter(sysFolderFilter).map((p, i) => {
//   let art = path.relative(path.resolve('.'), p)
//   return `${i+1}、[${art}](${path.join('article',art)})`
// }).join('\n\n')

// //目录模板
// let template = path.resolve(__dirname, 'template.md')
// let content = fs.readFileSync(template, 'utf8')
// //处理结果
// let resContent = content.replace('{{article}}', articles)
// //写入Readme
// let readme = path.resolve('README.md')
// fs.writeFileSync(readme, resContent, 'utf8')
