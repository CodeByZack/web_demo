
let m3u8IndexMap = ''; 


const checkSourceType = (str) => {
  if (str.endsWith("m3u8")) {
    return "m3u8";
  } else if (str.endsWith("ts")) {
    return "ts";
  } else {
    return "";
  }
};

const handleFile = async (file,url)=>{
    const reg = /(.*\/).*\.m3u8$/;
    const [_,prefixUrl] = url.match(reg);
    console.log(prefixUrl);

    const res = file.split('\n').filter(i=>!i.startsWith('#'));

    if(res.length > 0){
        const type = checkSourceType(res[0]);
        if(type === 'm3u8'){
            m3u8IndexMap = res[0];
            let temp = [];
            for (const m3u8 of res) {
                const nowUrl = prefixUrl + m3u8;
                console.log(nowUrl);
                const da = await getAllTs(nowUrl);
                temp.push(...da);
            }
            return temp;
        }else if(type === 'ts'){
            m3u8IndexMap = url;
            return res.map(d=>({ name : d, path :  prefixUrl + d})).filter(d=>d.name);
        }else{
            throw new Error("解析m3u8文件出错!");
        }


    }else{
        return [];
    }

};


const getAllTs = async (url)=>{
    const res = await axios.get(url);
    const da = await handleFile(res.data,url);
    return da;
};