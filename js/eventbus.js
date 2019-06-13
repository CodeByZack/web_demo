(function(name,definition){
  // 检测上下文环境是否为AMD或CMD
  let hasDefine = typeof define === 'function';
    // 检查上下文环境是否为Node
  let hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    // AMD环境或CMD环境
    define(definition);
  } else if (hasExports) {
    // 定义为普通Node模块
    module.exports = definition();
  } else {
    // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
    this[name] = definition();
  }
}("EventBus",function(){
    let Listenrs = {};
    let EVENTBUS = {
        addEvent : (type,cb)=>{
            Listenrs[type] 
            ? Listenrs[type].push({type, cb}) 
            : Listenrs[type] = [{type, cb}];
        },
        removeEvent : (type,cb)=>{
            if( !Listenrs[type] ) return null;
            let res = Listenrs[type].filter(obj=>(obj.cb === cb));
            res.forEach(e =>removeItem( Listenrs[type], e ));
            return res;
        },
        dispatch : (type,args)=>{
            if( !Listenrs[type] ) return;
            Listenrs[type].forEach(item=>item.cb(args));
        },
        getAllEvents : ()=>Listenrs
    }
    function removeItem(arr,item){
        arr.splice(arr.indexOf(item),1);
    }
    return EVENTBUS;
}))