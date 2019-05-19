function init(){
    const birth = dayjs("1995-01-10");
    const worktime = dayjs("2017-05-01");

    let now = dayjs();

    let old = now.diff(birth,'year'); 
    let yearsOfWorking = now.diff(worktime,'day');

    let ageDom = document.querySelector(".age");
    let workDom = document.querySelector(".work");

    let obj = { old:0,yearsOfWorking:0 }
    let tween = new TWEEN.Tween(obj)
    .to({ old,yearsOfWorking }, 2000)
    .onUpdate(e=>{
        ageDom.innerText = `年龄：${ parseInt(obj.old) }岁`;
        workDom.innerText = `工作天数：${ parseInt(obj.yearsOfWorking) } 天`;
    })
	.start();

    ageDom.innerText = `年龄：${ obj.old }岁`;
    workDom.innerText = `工作天数：${ obj.yearsOfWorking } 天`;

    DANMU.start(document.querySelector(".skill_tags"));
}






// Setup the animation loop.
function animate(time) {
	requestAnimationFrame(animate);
    TWEEN.update(time);
    DANMU.update();
}

init();
animate();