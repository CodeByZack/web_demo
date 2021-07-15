const mockJsonStr = `{
	"dataAuthVO": {
		"authDetailVOList": [
			{
				"authCode": "",
				"dataAuthItemCode": "",
				"dataAuthItemName": ""
			}
		],
		"authMap": {}
	},
	"deptAreaId": 0,
	"deptAreaName": "",
	"employId": 0,
	"encounterType": "",
	"funAuthList": [
		{
			"authCode": "",
			"authFlag": 0,
			"authName": ""
		}
	],
	"jobNo": "",
	"locationId": 0,
	"locationName": "",
	"name": "",
	"orgType": ""
}`

class GenInterface{
    isProcess=false;
    resStr='';
    start(name){
        this.resStr+=`interface ${name} { \n`;
        this.isProcess = true;
    }
    end(){
        this.resStr+=`}`;
        return this.resStr;
    }
    reset(){
        this.resStr = '';
        this.isProcess = false;
    }
    append(key,type){
        this.resStr+=`  ${key} : ${type}; \n`;
    }
}

const isObject = (v)=>typeof v === 'object';
const isArray = (v)=>Array.isArray(v);

/**
 * 
 * @param {*} jsonObj 
 * @param {*} interfaceName 
 * @param {*} resStr 
 * @returns 
 */
const covert = (jsonObj,interfaceName,resStr = '')=>{

    const restTask = [];

    if(!isObject(jsonObj)){
        console.error(`covert must accept a obj!!!`);
        return;
    }

    const genInterface = new GenInterface();
    genInterface.start(interfaceName);

    if(isArray(jsonObj)){
        console.log("todo");
        const arrInterfaceKeyArr =  `I${interfaceName}Arr`
        const arrInterfaceKeyItem =  `I${interfaceName}Item`
        genInterface.append(arrInterfaceKeyArr,`${arrInterfaceKeyItem}[]`);
        const str = genInterface.end();
        console.log(str);
        genInterface.reset();
        return str;
    }

    Object.keys(jsonObj).forEach(k=>{
        const value = jsonObj[k];
        if(isArray(value)){
            const arrInterfaceKeyArr =  `I${k}Arr`
            const arrInterfaceKeyItem =  `I${k}Item`
            genInterface.append(arrInterfaceKeyArr,`${arrInterfaceKeyItem}[]`);
            return;
        }
        if(isObject(value)){
            const objInterfaceKey =  `I${k}`
            genInterface.append(k,objInterfaceKey);
            return;
        }
        const type = typeof value;
        genInterface.append(k,type);
    });
    const str = genInterface.end();
    console.log(str);
    genInterface.reset();
    return str;
};

const convertArray = (jsonArr,interfaceName)=>{
    const keys = [...new Set(jsonArr.reduce((c, v) => c.concat(Object.keys(v)), []))] // every key been used
    const genInterface = new GenInterface();
    genInterface.start(interfaceName);
    keys.forEach(k=>{
        genInterface.append(k,'any');
    });
    const str = genInterface.end();
    console.log(str);
    genInterface.reset();
    return str;
};

const covertObj = (jsonObj,interfaceName)=>{
    const genInterface = new GenInterface();
    genInterface.start(interfaceName);

    Object.keys(jsonObj).forEach(k=>{
        const value = jsonObj[k];
        if(isArray(value)){
            const arrInterfaceKeyArr =  `I${k}Arr`
            const arrInterfaceKeyItem =  `I${k}Item`
            genInterface.append(arrInterfaceKeyArr,`${arrInterfaceKeyItem}[]`);
            return;
        }
        if(isObject(value)){
            const objInterfaceKey =  `I${k}`
            genInterface.append(k,objInterfaceKey);
            return;
        }
        const type = typeof value;
        genInterface.append(k,type);
    });
    const str = genInterface.end();
    console.log(str);
    genInterface.reset();
    return str;
};

const getAllTasks = (jsonObj,tasks = [], topName = "tsModule")=>{

    if(!isObject(jsonObj)){
        console.error(`covert must accept a obj!!!`);
        return null;
    }

    if(isArray(jsonObj)){
        tasks.push({ data : jsonObj, type : 'array', name : topName });
        return tasks;
    }

    tasks.push({ data : jsonObj, type : 'object', name : topName });

    Object.keys(jsonObj).forEach((k)=>{
        if(isArray(jsonObj[k])){
            tasks.push({ data : jsonObj, type : 'array', name : `I${k}Item` });
            return;
        }
        if(isObject(jsonObj[k])){
            // tasks.push({ data : jsonObj, type : 'object', name : `I${k}` });
            getAllTasks(jsonObj[k],tasks,k);     
        }
    });
    return tasks;
};

const jsonsss = `[
    {
        "a": 1
    },
    {
        "a": 2
    }
]`

const json2ts = (jsonStr = mockJsonStr)=>{
    
    try {
        const jsonObj = JSON.parse(jsonStr);
        // covert(jsonObj,'tsModule');
        const tasks = getAllTasks(jsonObj);
        console.log(tasks);
        // tasks.map(({ data , type , name  })=>{
        //     if(type === 'array'){
        //         return convertArray(data,name);
        //     }else {
        //         return covertObj(data,name);
        //     }
        // });

        // console.log(tasks.join('\n\n'));

    } catch (error) {
        console.log(error);
    }
};

json2ts();