const fs = require("fs");
const path = require("path");
var request = require("request");

let imgUrlTemplate =
  "https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/02-head-bob-turn/{NUM}.jpg";
function downloadFile(imgPath) {
  return new Promise((resolve, reject) => {
    let fileName = path.basename(imgPath);
    let fileDownloadPath = path.join(__dirname,"../images/" + fileName);
    console.log( fileDownloadPath );
    let exist = fs.existsSync(fileDownloadPath);
    if (!exist) {
      let writeStream = fs.createWriteStream(fileDownloadPath);
      let readStream = request(imgPath);
      readStream.pipe(writeStream);
      readStream.on("end", function() {
          console.log("end");
        readStream.end();
        resolve(fileDownloadPath);
      });
      readStream.on("error", function(error) {
        console.log(error);
        writeStream.end();
        fs.unlinkSync(fileDownloadPath);
        readStream.end();
        reject("error");
      });
      writeStream
        .on("finish", function() {
          readStream.end();
          writeStream.end();
        })
        .on("error", function(err) {
            console.log(err)
          readStream.end();
          writeStream.end();
          // console.log(`文件写入失败}`);
        });
    } else {
      reject("this file is existed");
    }
  });
}


let i = 0;



const works = async ()=>{
    while(i<=131){

        let imgUrl = imgUrlTemplate.replace("{NUM}",i.toString().padStart(4,"0"));
        i++;
        console.log(imgUrl);
        try {
           const res = await downloadFile(imgUrl);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }
}

works();

