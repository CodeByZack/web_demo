const { createFFmpeg,fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });
ffmpeg.setLogging(false);
let instance = null;




const cropVideo = async (fileName, blobURL, start, end )=>{
  const instance = await getFFmpegToolInstance();
  instance.FS('writeFile',fileName,await fetchFile(blobURL));
  
  // ffmpeg -ss 00:01:00 -i video.mp4 -to 00:02:00 -c copy -copyts cut.mp4
  await instance.run('-ss',start, '-i', fileName, '-to', end,'-c','copy' ,'-copyts','output.mp4');
  const data = instance.FS('readFile', 'output.mp4');
  const newBlobUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
  return newBlobUrl;
};

const setFFmpegLogger = (logger = console.log)=>{
  ffmpeg.setLogger(({ type, message })=>{
    logger(`${type}:${message}`);
  });
  ffmpeg.setProgress(({ratio})=>{
    logger(`处理进度:${ratio}`);
  });
};

setFFmpegLogger();


const getFFmpegToolInstance = async ()=>{
  if(!instance){
    await ffmpeg.load();
    instance = ffmpeg;
    return instance;
  }
  return instance;
};

