const slider = document.querySelector('#controlslider');
const videoUpload = document.querySelector('.video-upload');
const fileUpload = document.getElementById('file-upload');
const videoPlayerWrapper = document.querySelector('.video-player-wrapper');
const videoPlay = document.getElementById('video-play');
const startBtn = document.getElementById('start-btn');
const endBtn = document.getElementById('end-btn');
const cutBtn = document.getElementById('cut-btn');
const downLoadBtn = document.getElementById('download-btn');
const recoverBtn = document.getElementById('recover-btn');
const loginfoBox = document.querySelector('.loginfo-box');

videoPlay.addEventListener('loadedmetadata', (event) => {
  showDataCollection.videoDuration = videoPlay.duration;
  render();
});
videoUpload.addEventListener('click',()=>{
  fileUpload.click();
});
videoUpload.addEventListener('dragover',(e)=>{
  e.preventDefault();
  videoUpload.classList.add("active");
});
videoUpload.addEventListener('dragleave',()=>{
  videoUpload.classList.remove("active");
});
videoUpload.addEventListener('drop',(e)=>{
  e.preventDefault();
  videoUpload.classList.remove("active");
  var imageTypes = ['video/mp4'];
    var file = e.dataTransfer.files[0];
    if (imageTypes.includes(file.type)) {
      handleFileChoose(file);
    }
});
fileUpload.addEventListener('change', async (e)=>{
  if(fileUpload.files.length === 0) return;
  let file = fileUpload.files[0];
  handleFileChoose(file);
});

downLoadBtn.addEventListener('click',()=>{
  if(showDataCollection.videoSrc){
    downLoadUrl(showDataCollection.videoSrc);
  }
});
recoverBtn.addEventListener('click',()=>{
  videoPlay.src = showDataCollection.orignVideoSrc;
  showDataCollection.videoSrc = showDataCollection.orignVideoSrc;
});


cutBtn.addEventListener('click',()=>{
  if(!showDataCollection.orignVideoSrc)return;
  if(!uislider)return;

  const [start,end] = uislider.get();
  if( ~~start === uislider.options.range.min && ~~end === uislider.options.range.max ) return;

  doCrop(showDataCollection.videoSrc,formatSecondToString(start),formatSecondToString(end));
});

let uislider = null;

const showDataCollection = {
  videoDuration : 0,
  orignVideoSrc : '',
  videoSrc : '',
  cropVideoSrc : '',
};


const formatSecondToString = (value)=>{
  var sec_num = ~~value;
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+':'+minutes+':'+seconds;
};

const handleSliderChange = (values)=>{
  startBtn.innerText = formatSecondToString(values[0]);
  endBtn.innerText = formatSecondToString(values[1]);
};


const render = ()=>{
  if( showDataCollection.videoDuration ){
    const duration = ~~showDataCollection.videoDuration;
    console.log("duration:",duration);
    if(uislider){
      uislider.updateOptions({start: [0, duration],range: {'min': 0,'max': duration}});
    }else{
      uislider = noUiSlider.create(slider, {start: [0, duration],step:1,connect: true,range: {'min': 0,'max': duration}});
      uislider.on('slide',handleSliderChange);
    }
    startBtn.innerText = formatSecondToString(0);
    endBtn.innerText = formatSecondToString(duration);
  }else{

  }
};


const doCrop = async (blobURL,start,end)=>{
  console.log(start,end);
  const url = await cropVideo("input.mp4",blobURL,start,end);
  // downLoadUrl(newBlobUrl);
  videoPlay.src = url;
  showDataCollection.videoSrc = url;
};


const handleFileChoose = (file)=>{

  let blobURL = URL.createObjectURL(file);
  videoPlay.src = blobURL;
  showDataCollection.videoSrc = blobURL;
  showDataCollection.orignVideoSrc = blobURL;
  videoPlayerWrapper.classList.remove("hide");
  videoUpload.classList.add("hide");
};

setFFmpegLogger(msg=>loginfoBox.innerText = msg);