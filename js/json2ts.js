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
}`;

class GenInterface {
  isProcess = false;
  resStr = "";
  start(name) {
    this.resStr += `interface ${name} { \n`;
    this.isProcess = true;
  }
  end() {
    this.resStr += `}`;
    return this.resStr;
  }
  reset() {
    this.resStr = "";
    this.isProcess = false;
  }
  append(key, type) {
    this.resStr += `  ${key} : ${type}; \n`;
  }
}
// type name = 1 | 2;
class GenType {
  isProcess = false;
  resStr = "";
  start(name) {
    this.resStr += `type ${name} = `;
    this.isProcess = true;
  }
  end() {
    this.resStr = this.resStr.slice(0, -1);
    this.resStr += `;`;
    return this.resStr;
  }
  reset() {
    this.resStr = "";
    this.isProcess = false;
  }
  append(type) {
    this.resStr += ` ${type} |`;
  }
}

const isObject = (v) => typeof v === "object";
const isArray = (v) => Array.isArray(v);

const convertArray = (jsonArr, interfaceName) => {

  return "";
};

const covertObj = (jsonObj, interfaceName) => {
  const genInterface = new GenInterface();
  genInterface.start(interfaceName);

  Object.keys(jsonObj).forEach((k) => {
    const value = jsonObj[k];
    if (isArray(value)) {
      const first = value[0];
      if (isObject(first)) {
        const arrInterfaceKeyItem = getInterfaceName(k, "objectItem");
        genInterface.append(k, `${arrInterfaceKeyItem}[]`);
      } else {
        genInterface.append(k, `${typeof first}[]`);
      }
      return;
    }
    if (isObject(value)) {
      const objInterfaceKey = getInterfaceName(k, "objectItem");
      genInterface.append(k, objInterfaceKey);
      return;
    }
    const type = typeof value;
    genInterface.append(k, type);
  });
  const str = genInterface.end();
  genInterface.reset();
  return str;
};

const getAllTasks = (jsonObj, topName = "tsModule", tasks = []) => {
  if (!isObject(jsonObj)) {
    console.error(`请传入对象！！！`);
    return null;
  }

  if (isArray(jsonObj)) {
    console.error(`不支持顶层传数组！！！`);
    return null;
  }

  tasks.push({
    data: jsonObj,
    type: "object",
    name: getInterfaceName(topName, "objectItem"),
  });

  Object.keys(jsonObj).forEach((k) => {
    const value = jsonObj[k];
    if (isArray(value)) {
      const first = value[0];
      if (isObject(first)) {
        getAllTasks(first,k,tasks);
      }
      return;
    }
    if (isObject(value)) {
      getAllTasks(value, k, tasks);
    }
  });
  return tasks;
};

const getInterfaceName = (k, type) => {
  if (type === "objectItem") {
    return `I${k}`;
  }
  return k;
};
const json2ts = (jsonStr,interfaceName = 'tsModule') => {
  try {
    const jsonObj = JSON.parse(jsonStr);
    // covert(jsonObj,'tsModule');
    const tasks = getAllTasks(jsonObj,interfaceName);
    const resultStr = tasks
      .map(({ data, type, name }) => {
        if (type === "array") {
          return convertArray(data, name);
        } else {
          return covertObj(data, name);
        }
      })
      .join("\n\n");
    return resultStr;
  } catch (error) {
    console.log(error);
  }
};

// json2ts();
