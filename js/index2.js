addListener(window, 'resize', function () {
    $(".nav ul").removeAttr("style")
});


$(".nav img").click(function(){
    // $(".nav ul").css("opacity","1"); 
    // $(".nav ul").css("height","auto");
    $(".nav ul").slideToggle();   
});

var swiper = new Swiper('.swiper-container', {
    pagination: {
      el: '.swiper-pagination',
    },
});

let canvas = document.getElementById('canvas');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
firework.start(document.getElementById("canvas"),10)