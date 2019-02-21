(function(){

    let width,height,context;

    let particles = [];

    let colors = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
        '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
        '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
        '#FF5722'
        ];
    function getRandom(min,max){
        min = parseInt(min);
        max = parseInt(max);
        if(min>max ) return console.log("getRandom error!");
        if(min == max) return Math.floor(min);
        return min+Math.floor(Math.random()*(max-min));
    }
    function Particle(pos){

        this.size = 4;
        this.small_size = 4;
        this.big_size = 5;
        this.step = 0.05;

        this.pos = {
            x : pos ? pos.x : 0,
            y : pos ? pos.y : 0 
        }

        this.vel = {
            x : 0 ,
            y : 0
        }

        this.gravity = 0;

        this.color = colors[getRandom(0,colors.length)];

        this.isShowing = true;

    }

    Particle.prototype.update = function(){

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.vel.y += this.gravity;

        this.size += this.step;

        if(this.size > this.big_size || this.size < this.small_size){
            this.step = -this.step;
        }

        if(this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height){
            this.isShowing = false;
        }


    }


    Particle.prototype.render = function(ctx){

        ctx.save();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y,this.size,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();


        ctx.restore();
    }

    function ShapeText(x,y,msg){
        this.x = x;
        this.y = y;
        this.msg = msg;
        this.size = 200;
        //决定采样率
        this.grid = 8;
    }

    ShapeText.prototype.init = function(ctx){

        //清除画布
        ctx.clearRect(0,0,width,height);

        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = "red";
        ctx.font = this.size +"px arial";
        ctx.textBaseline = "middle";
        ctx.fillText(this.msg,this.x,this.y);
        ctx.restore();

        let idata = ctx.getImageData(0,0,width,height);
        let buffer32 = new Uint32Array(idata.data.buffer);

        for(var j=0; j < height; j += this.grid){
            for(var i=0 ; i < width; i += this.grid){
                if(buffer32[j * width + i]){
                    var particle = new Particle({x:i,y:j});
                    particles.push(particle);
                }
            }
        }     
        
        ctx.clearRect(0,0,width,height);
    }

    let LOOP = function(){

        //清除画布
        context.fillStyle = "#000";
        context.fillRect(0,0,width,height);

        //画粒子
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            particle.update();
            if(particle.isShowing){
                particle.render(context);
            }else{
                particles.splice(i,1);
            }
        }

        window.requestAnimationFrame(LOOP);
    }

    let EText = {
        init : function(canvas){
            width = canvas.width;
            height = canvas.height;
            context = canvas.getContext("2d");
            // EText.showMsg("没有文字哦！");
            window.requestAnimationFrame(LOOP);
        },
        showMsg : function(msg){
            if(particles.length > 0){
                particles.forEach((item)=>{
                    item.vel.x = getRandom(-10,10);
                    item.vel.y = getRandom(-10,10);

                    item.size = item.small_size - 1;
                    item.step = -0.1;
                })
            }
            let t = new ShapeText(width/2,height/2,msg);
            t.init(context);
        }
    };

    window.EText = EText;
})();