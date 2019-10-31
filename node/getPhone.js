const temme = require('temme').default;
const puppeteer = require('puppeteer');
const rules = require('./rules.js');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const  getHtml =  async (browser,url,rule) =>{
    const page = await browser.newPage();
    await page.goto(url);
    const html = await page.content();
    const res = temme(html,rule);
    return res;
}

async function main(){
    //创建一个浏览器
    const browser = await puppeteer.launch();

    let final = [];

    for (const key of Object.keys(rules)) {
        const r = rules[key];
        const res = await getHtml(browser,r.url,r.rule);
        console.log( res.list )
        final.push(...res.list);
    }

    //等待浏览器关闭
    await browser.close();
    return final;
}

main().then(data=>{
    ejs.renderFile(path.resolve(__dirname,'phone.ejs'), {data}, null, function(err, str){
        if(err){console.log(err)}
        else{
            fs.writeFile(path.resolve(__dirname,'index.html'),str,function(err){
                console.log( err );
            }) 
        }
    });
    // let str = JSON.stringify(res,null,"\t");
    // fs.writeFile(path.resolve(__dirname,'data.json'),str,function(err){
    //     console.log( err );
    // })
});