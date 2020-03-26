/**
 * 汉诺塔问题
 * 三个柱子
 * 盘子从小到大依次叠放
 *
 * 目的：从a柱 挪到 c柱
 *
 * 规则：
 * 一次只能挪一个
 * 小盘不能放在大盘下面
 *
 */

/**
 * 
 * @param {*} n 多少个盘子 
 * @param {*} a A柱 初始柱子
 * @param {*} b B柱 辅助柱子
 * @param {*} c C柱 目标柱子
 */
function hanoi(n, a, b, c) {
    if(n===1){
        //只有一个盘子，直接移动过去就完事了。
        console.log(`${n} from ${a} to ${c}`);
        return;
    }else{
        //移动n-1个盘子 a -> b
        hanoi(n-1,a,c,b);
        //移动n a -> b
        console.log(`${n} from ${a} to ${c}`);
        //移动n-1个盘子 b -> c
        hanoi(n-1,b,a,c);
    }
}






const GAME = (n,a,b,c)=>{
    const MOVE_STEPS = [];
    const Plate = (size)=>({size});
    const Pin = (name)=>({name,paltes:[]});
    const createHanoi = (n,a,b,c)=>{
        const HANOI = {
            [a] : Pin(a),
            [b] : Pin(b),
            [c] : Pin(c),
            initPalteCount : n
        }
        for(let i=0;i<n;i++){
            HANOI[a].paltes.push(Plate(i+1));
        }
        MOVE_STEPS.push(JSON.parse(JSON.stringify(HANOI)));
        return HANOI;
    }
    const move = (a,c,n)=>{
        c.paltes.push(a.paltes.shift());
        c.paltes.sort((a,b)=>a.size-b.size);
        a.paltes.sort((a,b)=>a.size-b.size);
        hanoiObj.stepDesc = `${n} from ${a.name} to ${c.name}`;
        //储存步骤
        MOVE_STEPS.push(JSON.parse(JSON.stringify(hanoiObj)));
    };
    const hanoi = (n, a, b, c) => {
        if(n===1){
            //只有一个盘子，直接移动过去就完事了。
            move(a,c,n);
            return;
        }else{
            //移动n-1个盘子 a -> b
            hanoi(n-1,a,c,b);
            //移动n a -> b
            move(a,c,n);
            //移动n-1个盘子 b -> c
            hanoi(n-1,b,a,c);
        }
    }
    const hanoiObj = createHanoi(n,a,b,c);
    hanoi(hanoiObj.initPalteCount,hanoiObj[a],hanoiObj[b],hanoiObj[c]);
    return MOVE_STEPS;
}


