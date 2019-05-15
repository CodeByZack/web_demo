function init(){
    const birth = dayjs("1995-01-10");
    const worktime = dayjs("2017-06-01");

    let now = dayjs();

    let old = now.diff(birth,'year'); 
    let yearsOfWorking = now.diff(worktime,'day');

    console.log(old,yearsOfWorking);

    let ageDom = document.querySelector(".age");
    let workDom = document.querySelector(".work");

    ageDom.innerText = `年龄：${ old }`;
    workDom.innerText = `工作经验：${ yearsOfWorking } 天`;
}



init();