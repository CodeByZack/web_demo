const base64ToFile = (base64, fileName) => {
  let arr = base64.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  const theBlob = new Blob([u8arr], { type: mime });
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
};

const fileToBase64 = file => {
  const isFile = file instanceof File;
  if (!isFile) return Promise.reject("参数不正确");
  if (typeof FileReader !== "function")
    return Promise.reject("浏览器不支持 FileReader！");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      resolve(e.target.result);
    };
    reader.onerror = e => {
      reject(e);
    };
  });
};
