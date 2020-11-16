const axios = require('axios');
const fs = require('fs');

const url = 'http://goodmorning.acsite.org/api/morning_request.php';

const detailUrl = 'http://goodmorning.acsite.org/api/morning_detail_v5.php';

const ossUrl = 'https://molingzhaohuan.oss-cn-beijing.aliyuncs.com/'; 

const detailPostData = (id)=>({m_id: id});

const postData = {
    btype: "0",
    lsnum: "0",
    m_category: "",
    m_quality: "",
    m_star: "",
    m_type: "",
    nsnum: ""
};

const M_TYPE_MAP = {
    1 : "攻击型",
    2 : "辅助型",
    3 : "防御型",
    4 : "体力型",
    5 : "材料型"
};

const M_CATEGORY_MAP = {
    1 : "水",
    2 : "火",
    3 : "风",
    4 : "光",
    5 : "暗"
};

const delay = (ms)=>new Promise(resolve=>setTimeout(resolve,ms));


const writeJson2File = (name,json)=>{
    const writeRes = fs.writeFileSync(name,JSON.stringify(json, null, 2))
    return writeRes;
};

const writeImg2File = (name,data)=>{
    const res = fs.writeFileSync(name,data);
    return res;
};

const mat_level = (par) => {
  switch (par) {
    case "1":
      tmptype = "下級";
      break;
    case "2":
      tmptype = "中級";
      break;
    case "3":
      tmptype = "上級";
      break;
    case "4":
      tmptype = "下級";
      break;
    case "5":
      tmptype = "中級";
      break;
    case "6":
      tmptype = "上級";
      break;
  }
  return tmptype;
};




// 获取魔灵资料并写入文件
const getMolingData = async (path = "molingziliaozhan.json")=>{

    const res = await axios.post(url,postData);
    const { monster_list } = res.data;

    const detailArr = [];

    try {
        for (const item of monster_list) {
            const res = await axios.post(detailUrl,detailPostData(item.m_id));
            await delay(1000);
            const name = (res.data.monster_detail && res.data.monster_detail[0]) ? res.data.monster_detail[0].m_name : '未知';
            console.log(detailArr.length,name);
            detailArr.push(res.data);
        }        
        const res3 = writeJson2File(path,detailArr);
    } catch (error) {
        console.log(error);
        const res3 = writeJson2File(path,detailArr);
    }

};


// 格式化魔灵资料
const formatMolingData = (path = "formatMolingData.json")=>{

    //这个路径视上一步写入文件的位置
    const data = require('../testDetail.json');
    const getWakeNeed = (arr,category)=>{
        const strArr = arr.map((item)=>{
            const { mat_type,mat_number } = item;
            if(mat_type>3){
                return `${mat_level(mat_type)}${M_CATEGORY_MAP[category]}之精髓 * ${mat_number}`;
            }else{
                return `${mat_level(mat_type)}魔力精髓 * ${mat_number}`;
            }
        });
        return strArr;
    };
    const formatData = data.map((item)=>{
        if(!item.monster_detail){
            console.log(item);
            return
        }
        const detail = item.monster_detail[0];
        return {
            name : detail.m_name,
            star : detail.m_star,
            hp : detail.m_hp,
            atk : detail.m_atk,
            def : detail.m_def,
            spd : detail.m_spd,
            category : detail.m_category,
            type : detail.m_type,
            wake : detail.m_wake,
            m_quality : detail.m_quality,
            m_raiders : detail.m_raiders,
            image : detail.m_pic.replace('//goodmorning.acsite.org/images/monster/',ossUrl),
            wakeNeedMaterial : getWakeNeed(item.monster_mat,detail.m_category),
            skills : item.monster_skill,
            growing : item.monster_growing.map(d=>{
                return {
                    star : d.m_star,
                    hp : d.m_hp,
                    atk : d.m_atk,
                    def : d.m_def,
                    spd : d.m_spd,
                    check : d.m_check,
                }
            })
        };
    });

    writeJson2File(path,formatData);

}

// 格式化成导入小程序云开发的数据

const formatWeXcx = ()=>{
 
    // 读取 json 数据
    let jsons = fs.readFileSync('./formatMolingData.json', 'utf-8');
    jsons = JSON.parse(jsons);
    
    // 将 json 数组转换成字符串
    let str = '';
    for (const item of jsons) {
        // 必须使用 \n 换行区别每个记录
        str += JSON.stringify(item) + "\n";
    }
    
    // 保存到本地
    fs.writeFileSync('./test2.json', str);

}


const downloadPic = async ()=>{
    const json = require('../formatMolingData.json');

    const download = async (url,name)=>{
        
        let _url = url.replace('//','http://');
        let fileName = url.replace('//goodmorning.acsite.org/images/monster/','');
        try {
            const res = await axios.get(_url,{responseType:'arraybuffer'});
            fileName = './moling_image/' + fileName;
            
            writeImg2File(fileName,res.data);
            console.log('success:',name);

        } catch (error) {
            console.log(error);
            console.log('fail:',name);
        }
        
    };

    let flag = false;

    for (const item of json) {

        if(item === null){
            flag = true;
            continue;
        }
        if(!flag)continue;
        await download(item.image,item.name);
    }


}

// formatMolingData();

formatWeXcx()