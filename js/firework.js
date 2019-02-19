(function(){
    //全局变量
    let width,height,context;
    let rockets = [],fires = [];

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
        this.aplha = 1;
        this.fade = 0;
    }

    Fire.prototype.update = function(){

        this.vel.x *= this.resistance;
        this.vel.y *= this.resistance;
    
        this.vel.y += this.resistance;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.size *= this.shrink;

        this.aplha -= this.fade;
    }

    Fire.prototype.render = function(ctx){
        if(!this.isExits())return;

        ctx.save();

        let x = this.pos.x,
            y = this.pos.y,
            r = this.size/2;

        let gradient = ctx.createRadialGradient(x,y,0.1,x,y,r);
        gradient.addColorStop(0.1,"rgba(255,255,255," + this.aplha +")");

        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    Fire.prototype.isExits =function(){
        return this.alpha >= 0.1 && this.size >= 1;
    }

    function Rocket(pos){
        Fire.call(this,pos);

        this.isBow = false;
        this.bowColor = 0;
        this.targetH = 0;

    }

    Rocket.prototype = new Fire();
    Rocket.prototype.constructor = Rocket;

    Rocket.prototype.render = function(ctx){

    }

}());