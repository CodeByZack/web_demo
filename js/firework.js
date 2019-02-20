(function(){
    //全局变量
    let width,height,context;
    let rockets = [],fires = [];

    function getRandom(min,max){
        min = parseInt(min);
        max = parseInt(max);
        if(min>max ) return console.log("getRandom error!");
        if(min == max) return Math.floor(min);
        return min+Math.floor(Math.random()*(max-min));
    }


    function Fire(pos){
        this.pos = {
            x : pos ? pos.x :0,
            y : pos ? pos.y :0
        };

        this.vel = {
            x : 0,
            y : 0
        }

        this.resistance = 1;
        this.gravity = 0;

        this.size = 2;
        this.shrink = 0.97;

        this.color = 0;
        this.alpha = 1;
        this.fade = 0;
    }

    Fire.prototype.update = function(){

        this.vel.x *= this.resistance;
        this.vel.y *= this.resistance;
    
        this.vel.y += this.gravity;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.size *= this.shrink;

        this.alpha -= this.fade;

        // console.log(this.vel);
        // console.log(this.pos);
    }

    Fire.prototype.render = function(ctx){
        if(this.isAlive()){

        }else{
            return;
        }
        ctx.save();

        let x = this.pos.x,
            y = this.pos.y,
            r = this.size/2;

        let gradient = ctx.createRadialGradient(x,y,0.1,x,y,r);
        gradient.addColorStop(0.1,"rgba(255,255,255," + this.alpha +")");
        gradient.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
        gradient.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");

        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    Fire.prototype.isAlive =function(){
        return this.alpha >= 0.1 && this.size >= 1;
    }

    function Rocket(pos){
        Fire.call(this,pos);

        this.isBow = false;
        this.bowColor = Math.floor(Math.random() * 360 / 10) * 10;
        this.targetH = getRandom(0,height/2);

    }

    Rocket.prototype = new Fire();
    Rocket.prototype.constructor = Rocket;

    Rocket.prototype.Bow = function(){
        let num = Math.ceil(Math.random()*50) + 50;
        for(let i = 0 ; i < num ; i++){
            
            let fire = new Fire(this.pos);
            let angle = Math.random() * Math.PI * 2;

            let speed = Math.cos(Math.random() * Math.PI / 2) * 10;

            fire.vel.x = Math.cos(angle) * speed;
            fire.vel.y = Math.sin(angle) * speed;

            fire.fade = 0.02;

            fire.resistance = 0.98;
            fire.gravity = 0.5;
            fire.shrink = 0.99;
            fire.size = 4;
            fire.color = this.bowColor;

            fires.push(fire);
        }
    }

    Rocket.prototype.render = function(ctx){
        if(this.isAlive()){

        }else{
            return;
        }

        ctx.save();

        let x = this.pos.x,
            y = this.pos.y,
            r = this.size/2;

        let gradient = ctx.createRadialGradient(x,y,0.1,x,y,r);
        gradient.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
        gradient.addColorStop(1, "rgba(0, 0, 0, " + this.alpha + ")");

        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore(); 
    }

    let LOOP = function(){

        //清屏幕
        context.fillStyle = "rgba(0,0,0,0.05)";
        context.fillRect(0,0,width,height);

        let existingRockets = [];

        for (let i = 0; i < rockets.length; i++) {
            const rocket = rockets[i];
            rocket.update();
            rocket.render(context);

            if(rocket.pos.y < rocket.targetH){
                rocket.Bow();
            }else{
                existingRockets.push(rocket);
            }
        }

        rockets = existingRockets;

        let existingFires = [];

        for (let i = 0; i < fires.length; i++) {
            const fire = fires[i];
            fire.update();
            fire.render(context);

            if(fire.isAlive){
                fire.render(context);
                existingFires.push(fire);
            }
        }

        fires = existingFires;

        if(rockets.length < 3){

            let rocket = new Rocket({
                x:width/2,
                y:height
            });
            rocket.bowColor = Math.floor(Math.random() * 360 / 10) * 10;
            rocket.vel.y = Math.random() * -3 - 4;
            rocket.vel.x = Math.random() * 6 - 3;
            rocket.size = 8;
            rocket.shrink = 0.999;
            rocket.gravity = 0.01;

            rockets.push(rocket);
        }

        window.requestAnimationFrame(LOOP);
    }

    function lanuch(canvas){
        width = canvas.width;
        height = canvas.height;
        context = canvas.getContext("2d");

        console.log("width:"+width);
        console.log("height:"+height);
        console.log("context:"+context);

        if(rockets.length < 10){

            let rocket = new Rocket({
                x:width/2,
                y:height
            });
            rocket.bowColor = Math.floor(Math.random() * 360 / 10) * 10;
            rocket.vel.y = Math.random() * -3 - 4;
            rocket.vel.x = Math.random() * 6 - 3;
            rocket.size = 8;
            rocket.shrink = 0.999;
            rocket.gravity = 0.01;

            rockets.push(rocket);
        }


        window.requestAnimationFrame(LOOP);
    }

    window.firework = {
        start : lanuch
    }
}());