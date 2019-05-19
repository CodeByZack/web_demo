(function(){
    function getRandom(min,max){
        min = parseInt(min);
        max = parseInt(max);
        if(min>max ) return console.log("getRandom error!");
        if(min == max) return Math.floor(min);
        return min+Math.floor(Math.random()*(max-min));
    }
    function colorHEX(){
        var num = [0,1,2,3,4,5,6,7,8,9,"a","b","c","d","e","f"];
        var n = Math.ceil(Math.random()*15);
        var color = "";
        for(var i=0;i<6;i++){
            var n = Math.ceil(Math.random()*15);
            color += num[n];
        }
        return "#" + color
    }
    let messages = [];
    let width,height,context;
    let someText = [
        "Vue","React","Redux",
        "Vuex","Vue-Router","React-Router",
        "JavaScript","ES6",
        "HTML5","CSS3","Axios"
    ];
    
    function Message(msg,pos){
        this.pos = {
            x : pos ? pos.x : 0,
            y : pos ? pos.y : 0
        },

        this.speed = 0;

        this.color = 0;

        this.size = 10;

        this.message = msg;

    }

    Message.prototype.update = function(){
        
        this.pos.x += this.speed;
    }

    Message.prototype.render = function(ctx){
        
        if(!this.isShowing()){
            console.log("消失于屏幕外。。。")
            return;
        }

        ctx.save();

        ctx.fillStyle = this.color;
        ctx.font = ""+this.size+"px bold 黑体";
        ctx.fillText(this.message, this.pos.x, this.pos.y);


        ctx.restore();

    }

    Message.prototype.isShowing = function(){
        return this.pos.x >= -100 && this.pos.x < width && this.pos.y > 0 && this.pos.y < height;
    }

    let LOOP = function(){

        //清画布
        context.fillStyle = "#000";
        context.fillRect(0,0,width,height);

        let showingMsg = [];
        for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            msg.update();

            if(msg.isShowing()){
                msg.render(context);
                showingMsg.push(msg);
            }
        }

        messages = showingMsg;

        if(messages.length < 10){
            DANMU.addMsg(someText[getRandom(0,someText.length)]);
        }
    }

    let DANMU = {};

    DANMU.addMsg = function(msg){

        let pos = {
            x : -90,
            y : getRandom(10,height-10)
        }

        let m = new Message(msg,pos);
        m.color = colorHEX();
        m.speed = getRandom(3,8);
        m.size = getRandom(15,20);

        messages.push(m);

        
    }

    DANMU.start = function(container){
        width = container.clientWidth;
        height = container.clientHeight;
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        container.appendChild(canvas);
        context = canvas.getContext("2d");
    }

    DANMU.update = LOOP

    window.DANMU = DANMU;
})();