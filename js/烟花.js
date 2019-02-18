(function(){

    function getRandom(min,max){
        min = parseInt(min);
        max = parseInt(max);
        if(min>max ) return console.log("getRandom error!");
        if(min == max) return Math.floor(min);
        return min+Math.floor(Math.random()*(max-min));
    }
    //生成随机颜色
    //方法一 rgb
    function color1(){
        var r = Math.ceil(Math.random()*255);
        var g = Math.ceil(Math.random()*255);
        var b = Math.ceil(Math.random()*255);
        return "rgb("+r+","+g+","+b+")"
    }
    //十六进制 0-9 a-f
    function color2(){
        var num = [0,1,2,3,4,5,6,7,8,9,"a","b","c","d","e","f"];
        var n = Math.ceil(Math.random()*15);
        var color = "";
        for(var i=0;i<6;i++){
            var n = Math.ceil(Math.random()*15);
            color += num[n];
        }
        return "#" + color
    }
    function clean(canvas){
        let canW = canvas.width;
        let canH = canvas.height;
        let ctx  = canvas.getContext("2d");
        ctx.fillStyle="rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0,0,canW,canH);
    }

    let firework = {};

    firework.canvas = null;
    firework.ctx = null;
    firework.w = 0;
    firework.h = 0;
    firework.num = -1;
    firework.count = 0;
    firework.fire = [];

    firework.init = function(canvas,num){
        firework.canvas = canvas;
        firework.ctx = canvas.getContext("2d");
        firework.w = canvas.width;
        firework.h = canvas.height;
        firework.num = num;
    }

    firework.createFire = function(){
        let fire = {};
        fire.x = getRandom(30,firework.w);
        fire.y = getRandom(firework.h-20,firework.h);
        fire.targetH = getRandom(0,firework.h/2);
        fire.speed = -5;
        fire.children = [];
        fire.isBow = false;
        fire.color = Math.floor(Math.random() * 360 / 10) * 10;
        fire.Bow = function(){
            let num = Math.ceil(Math.random()*50) +50;
            for (let index = 0; index < num; index++) {
                let item = {};
                item.x = fire.x;
                item.y = fire.y;

                // item.speedX = Math.random()*10 - 5;
                // item.speedY = Math.random()*10 - 5;//生成-10-10之间的数 

                let angle = Math.random() * Math.PI * 2;

                // emulate 3D effect by using cosine and put more particles in the middle
                let speed = Math.cos(Math.random() * Math.PI / 2) * 10;

                item.speedX = Math.cos(angle) * speed;
                item.speedY = Math.sin(angle) * speed;

                item.fade = 1;

                item.resistance = 0.98;

                item.gravity = 0.5;

                
                item.shrink = 0.99;
                item.size = 4;

                item.color = Math.floor(Math.random() * 360 / 10) * 10;

                fire.children.push(item);  
                fire.isBow = true; 
            }
        }
        return fire;
    }

    firework.initFires = function(){
        for (let i = 0; i < firework.num; i++) {
            firework.fire.push(firework.createFire());
        }
    }

    firework.update = function(){
        for (let i = 0; i < firework.fire.length; i++) {
            const fire = firework.fire[i];
            if(!fire.isBow){
                fire.y += fire.speed;
                if(fire.y < fire.targetH){
                    fire.Bow();
                }
                break;
            }else{
                for (let i = 0; i < fire.children.length; i++) {
                    const item = fire.children[i];

                    item.speedX *= item.resistance;
                    item.speedY *= item.resistance;

                    item.x = item.x + item.speedX;
                    item.y = item.y + item.speedY;

                    item.speedY += item.gravity;

                    item.fade -= 0.02;

                    item.size *= item.shrink;

                    if(item.size <= 0 || item.fade <= 0 || item.x < 0 || item.x > firework.w || item.y > firework.h){
                        fire.children.splice(i,1);
                    }

                    if(fire.children.length == 0){
                        console.log(fire);
                        firework.fire.splice(firework.fire.indexOf(fire),1);
                    }

                }
            }
        }
    }

    firework.draw = function(){

        clean(firework.canvas);

        for (let i = 0; i < firework.fire.length; i++) {
            const fire = firework.fire[i];
            if(!fire.isBow){
                firework.ctx.beginPath();
                firework.ctx.fillStyle = "hsl(" + fire.color + ", 100%, 50%)";
                firework.ctx.arc(fire.x,fire.y, 3, 0, 360 * Math.PI/180);
                firework.ctx.closePath();
                firework.ctx.fill();
                break;                
            }else{
                for (let i = 0; i < fire.children.length; i++) {
                    const item = fire.children[i];
                    firework.ctx.beginPath();

                    let gradient = firework.ctx.createRadialGradient(item.x,item.y, 0.1,item.x,item.y, item.size);
                    gradient.addColorStop(0.1, "rgba(255,255,255,"+item.fade+")");
                    gradient.addColorStop(0.8, "hsla(" + item.color + ", 100%, 50% , "+item.fade+")");
                    gradient.addColorStop(1, "hsla(" + item.color + ", 100%, 50% , 0.1)");
                    
                    firework.ctx.fillStyle = gradient;
                    firework.ctx.arc(item.x,item.y, item.size , 0, 360 * Math.PI/180);
                    firework.ctx.closePath();
                    firework.ctx.fill();
                }
            }
        }
    }

    firework.loop = function(){
        firework.update();
        firework.draw();
        if(firework.fire.length == 0){
            firework.initFires();
        }
        window.requestAnimationFrame(firework.loop);
    }



    firework.start = function(canvas,num){
        firework.init(canvas,num);
        firework.initFires();
        firework.loop();
    }

    window.firework = firework;

})();