





(() => {
  const noop = () => {};
  let container = null;
  let collapse = false;
  let state = {};
  let stateChangeCallBack = noop;

  const OptionBoxStyle = `
    .options-box {
      width: 300px;
      transition: all 0.3s linear;
      background-color: #333333;
      color: #ffffff;
      position: absolute;
      right: 0;
      top: 0;
      margin: 10px;
      border: 1px solid #333333;
      border-radius: 4px;
      padding: 10px;
    }
    .options-box > .float-btn {
      visibility: hidden;
      position: absolute;
      left: -40px;
      top: 50%;
      transform: translateY(-20px);
      width: 40px;
      height: 40px;
      background-color: #333333;
      color: #ffffff;
      border-radius: 50%;
      text-align: center;
      font-size: 12px;
      line-height: 40px;
      cursor: pointer;
    }
    .options-box p {
      display: flex;
      align-items: center;
    }
    .options-box .left {
      display: inline-block;
      flex: 1;
      font-size: 12px;
      text-align: right;
      padding-right: 10px;
    }
    .options-box .right {
      display: inline-block;
      text-align: center;
      flex: 2;
    }
    `;
  const injectStyle = (cssText) => {
    const style = document.createElement("style"); //创建一个style元素
    const head = document.head || document.getElementsByTagName("head")[0]; //获取head元素
    style.type = "text/css"; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用

    //w3c浏览器中只要创建文本节点插入到style元素中就行了
    const textNode = document.createTextNode(cssText);
    style.appendChild(textNode);
    head.appendChild(style); //把创建的style元素插入到head中
  };

  const mount = () => {
    destory();
    if (container) {
      document.body.appendChild(container);
    }
    return OptionBox;
  };

  const destory = () => {
    const old = document.querySelector(".option-box");
    if (old) {
      document.body.removeChild(old);
    }
  };

  const createInput = (key, type, options) => {
    if (type === "input") {
      const rightInput = document.createElement("input");
      rightInput.addEventListener("change", onItemChange(key));
      return rightInput;
    } else if (type === "select") {
      const rightInput = document.createElement("select");
      rightInput.addEventListener("change", onItemChange(key));
      options.forEach((o) => {
        const option = document.createElement("option");
        option.setAttribute("value", o);
        option.append(o);
        rightInput.appendChild(option);
      });
      return rightInput;
    }
  };

  const onItemChange = (key) => (e) => {
    console.log(key);
    console.log(e);
    state[key] = e.target.value;
    console.log(state);
    stateChangeCallBack(state);
  };

  const applyState = () => {
    console.log("=====apply======");
    stateChangeCallBack(state);
  };

  const toggoleCollapse = () => {
    const btn = container.querySelector(".float-btn");
    if (collapse) {
      container.style.transform = "";
      btn.style.visibility = "hidden";
    } else {
      container.style.transform = "translateX(103%)";
      btn.style.visibility = "visible";
    }

    collapse = !collapse;
  };

  const init = (optionArr = [], onChange = noop) => {
    injectStyle(OptionBoxStyle);
    container = document.createElement("div");
    container.classList.add("options-box");

    optionArr.forEach((option) => {
      const { key, values } = option;
      state[key] = values[0] || "";
      const p = document.createElement("p");
      const leftSpan = document.createElement("span");
      leftSpan.classList.add("left");
      leftSpan.append(key);
      const rightInput = createInput(key, "select", values);
      rightInput.classList.add("right");
      // rightInput.append("todo");
      p.appendChild(leftSpan);
      p.appendChild(rightInput);
      container.appendChild(p);
    });

    const p = document.createElement("p");
    const leftBtn = document.createElement("button");
    leftBtn.append("收起");
    leftBtn.style.textAlign = "center";
    leftBtn.classList.add("left");
    leftBtn.addEventListener("click", toggoleCollapse);
    const rightBtn = document.createElement("button");
    rightBtn.append("应用");
    rightBtn.addEventListener("click", applyState);
    rightBtn.style.margin = "0 10px";
    rightBtn.classList.add("right");
    p.appendChild(leftBtn);
    p.appendChild(rightBtn);
    container.appendChild(p);

    const div = document.createElement("div");
    div.classList.add("float-btn");
    div.append("展开");
    div.addEventListener("click", toggoleCollapse);
    container.appendChild(div);

    stateChangeCallBack = onChange;
    stateChangeCallBack(state);
    return OptionBox;
  };

  window.OptionBox = {
    init,
    destory,
    mount,
  };
})();
