(function() {
  require.config({
    baseUrl: '/js', //基本路径 出发点在根目录下
    paths: {
      //映射: 模块标识名: 路径
      alerter: './amd/module_a', 
      dataService: './amd/module_b'
    }
  })
  require(['alerter'], function(alerter) {
    alerter.showMsg()
  })
})()