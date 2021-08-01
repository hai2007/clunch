/*!
 * clunch.js <@template> - 🎨 The Progressive JavaScript Interactive Picture Framework.
 * git+https://github.com/hai2007/clunch.git
 *
 * author 你好2007 < https://hai2007.gitee.io/sweethome >
 *
 * version 1.8.2
 *
 * Copyright (c) 2018-2021 hai2007 走一步，再走一步。
 * Released under the MIT license
 *
 * Date:Sun Aug 01 2021 10:55:19 GMT+0800 (GMT+08:00)
 */
(function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /**
   * 判断一个值是不是Object。
   *
   * @param {*} value 需要判断类型的值
   * @returns {boolean} 如果是Object返回true，否则返回false
   */
  function _isObject (value) {
    var type = _typeof(value);

    return value != null && (type === 'object' || type === 'function');
  }

  var toString = Object.prototype.toString;
  /**
   * 获取一个值的类型字符串[object type]
   *
   * @param {*} value 需要返回类型的值
   * @returns {string} 返回类型字符串
   */

  function getType (value) {
    if (value == null) {
      return value === undefined ? '[object Undefined]' : '[object Null]';
    }

    return toString.call(value);
  }

  /**
   * 判断一个值是不是number。
   *
   * @param {*} value 需要判断类型的值
   * @returns {boolean} 如果是number返回true，否则返回false
   */

  function _isNumber (value) {
    return typeof value === 'number' || value !== null && _typeof(value) === 'object' && getType(value) === '[object Number]';
  }

  /**
   * 判断一个值是不是String。
   *
   * @param {*} value 需要判断类型的值
   * @returns {boolean} 如果是String返回true，否则返回false
   */

  function _isString (value) {
    var type = _typeof(value);

    return type === 'string' || type === 'object' && value != null && !Array.isArray(value) && getType(value) === '[object String]';
  }

  /**
   * 判断一个值是不是Function。
   *
   * @param {*} value 需要判断类型的值
   * @returns {boolean} 如果是Function返回true，否则返回false
   */

  function _isFunction (value) {
    if (!_isObject(value)) {
      return false;
    }

    var type = getType(value);
    return type === '[object Function]' || type === '[object AsyncFunction]' || type === '[object GeneratorFunction]' || type === '[object Proxy]';
  }

  /**
   * 判断一个值是不是一个朴素的'对象'
   * 所谓"纯粹的对象"，就是该对象是通过"{}"或"new Object"创建的
   *
   * @param {*} value 需要判断类型的值
   * @returns {boolean} 如果是朴素的'对象'返回true，否则返回false
   */

  function _isPlainObject (value) {
    if (value === null || _typeof(value) !== 'object' || getType(value) != '[object Object]') {
      return false;
    } // 如果原型为null


    if (Object.getPrototypeOf(value) === null) {
      return true;
    }

    var proto = value;

    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(value) === proto;
  }

  var domTypeHelp = function domTypeHelp(types, value) {
    return value !== null && _typeof(value) === 'object' && types.indexOf(value.nodeType) > -1 && !_isPlainObject(value);
  };
  var isNumber = _isNumber;
  var isString = _isString;

  var isFunction = _isFunction;
  var isArray = function isArray(input) {
    return Array.isArray(input);
  };

  var isElement = function isElement(input) {
    return domTypeHelp([1, 9, 11], input);
  };

  //当前正在运动的动画的tick函数堆栈
  var $timers = []; //唯一定时器的定时间隔

  var $interval = 13; //指定了动画时长duration默认值

  var $speeds = 400; //定时器ID

  var $timerId = null;
  /*!
   * 💡 - 动画轮播
   * https://github.com/hai2007/tool.js/blob/master/animation.js
   *
   * author hai2007 < https://hai2007.gitee.io/sweethome >
   *
   * Copyright (c) 2020-present hai2007 走一步，再走一步。
   * Released under the MIT license
   */

  /**
   * @param {function} doback 轮询函数，有一个形参deep，0-1，表示执行进度
   * @param {number} duration 动画时长，可选
   * @param {function} callback 动画结束回调，可选，有一个形参deep，0-1，表示执行进度
   *
   * @returns {function} 返回一个函数，调用该函数，可以提前结束动画
   */

  function animation (doback, duration, callback) {
    // 如果没有传递时间，使用内置默认值
    if (arguments.length < 2) duration = $speeds;
    var clock = {
      //把tick函数推入堆栈
      "timer": function timer(tick, duration, callback) {
        if (!tick) {
          throw new Error('Tick is required!');
        }

        var id = new Date().valueOf() + "_" + (Math.random() * 1000).toFixed(0);
        $timers.push({
          "id": id,
          "createTime": new Date(),
          "tick": tick,
          "duration": duration,
          "callback": callback
        });
        clock.start();
        return id;
      },
      //开启唯一的定时器timerId
      "start": function start() {
        if (!$timerId) {
          $timerId = setInterval(clock.tick, $interval);
        }
      },
      //被定时器调用，遍历timers堆栈
      "tick": function tick() {
        var createTime,
            flag,
            tick,
            callback,
            timer,
            duration,
            passTime,
            timers = $timers;
        $timers = [];
        $timers.length = 0;

        for (flag = 0; flag < timers.length; flag++) {
          //初始化数据
          timer = timers[flag];
          createTime = timer.createTime;
          tick = timer.tick;
          duration = timer.duration;
          callback = timer.callback;

          passTime = (+new Date() - createTime) / duration;

          passTime = passTime > 1 ? 1 : passTime;
          tick(passTime);

          if (passTime < 1 && timer.id) {
            //动画没有结束再添加
            $timers.push(timer);
          } else if (callback) {
            callback(passTime);
          }
        }

        if ($timers.length <= 0) {
          clock.stop();
        }
      },
      //停止定时器，重置timerId=null
      "stop": function stop() {
        if ($timerId) {
          clearInterval($timerId);
          $timerId = null;
        }
      }
    };
    var id = clock.timer(function (deep) {
      //其中deep为0-1，表示改变的程度
      doback(deep);
    }, duration, callback); // 返回一个函数
    // 用于在动画结束前结束动画

    return function () {
      var i;

      for (i in $timers) {
        if ($timers[i].id == id) {
          $timers[i].id = undefined;
          return;
        }
      }
    };
  }

  // 初始化配置文件
  var initConfig = function initConfig(init, data) {
    for (var key in data) {
      try {
        init[key] = data[key];
      } catch (e) {
        throw new Error("Illegal property value！");
      }
    }

    return init;
  }; // 正则表达式

  var REGEXP = {
    // 空白字符:http://www.w3.org/TR/css3-selectors/#whitespace
    "whitespace": "[\\x20\\t\\r\\n\\f]"
  }; // 判断是否是一个合法的方法名或变量名

  var isValidKey = function isValidKey(key) {
    // 判断是不是_或者$开头的
    // 这两个内部预留了
    if (/^[_$]/.test(key)) {
      console.warn('The beginning of _ or $ is not allowed：' + key);
    }
  };

  /**
   * 初始化配置文件
   *
   * @param {Json} init 默认值
   * @param {Json} data
   * @return {Json}
   */
  function initConfig$1 (init, data) {
    for (var key in data) {
      try {
        init[key] = data[key];
      } catch (e) {
        throw new Error("Illegal property value！");
      }
    }

    return init;
  }

  /*!
   * 💡 - Hermite三次插值
   * https://github.com/hai2007/tool.js/blob/master/Hermite.js
   *
   * author hai2007 < https://hai2007.gitee.io/sweethome >
   *
   * Copyright (c) 2020-present hai2007 走一步，再走一步。
   * Released under the MIT license
   */

  function hermite (config) {
    config = initConfig$1({
      // 张弛系数
      "u": 0.5
    }, config);
    var MR, a, b;
    /**
     * 根据x值返回y值
     * @param {Number} x
     */

    var hermite = function hermite(x) {
      if (MR) {
        var sx = (x - a) / (b - a),
            sx2 = sx * sx,
            sx3 = sx * sx2;
        var sResult = sx3 * MR[0] + sx2 * MR[1] + sx * MR[2] + MR[3];
        return sResult * (b - a);
      } else throw new Error('You shoud first set the position!');
    };
    /**
     * 设置点的位置
     * @param {Number} x1 左边点的位置
     * @param {Number} y1
     * @param {Number} x2 右边点的位置
     * @param {Number} y2
     * @param {Number} s1 二个点的斜率
     * @param {Number} s2
     */


    hermite.setP = function (x1, y1, x2, y2, s1, s2) {
      if (x1 < x2) {
        // 记录原始尺寸
        a = x1;
        b = x2;
        var p3 = config.u * s1,
            p4 = config.u * s2; // 缩放到[0,1]定义域

        y1 /= x2 - x1;
        y2 /= x2 - x1; // MR是提前计算好的多项式通解矩阵
        // 为了加速计算
        // 如上面说的
        // 统一在[0,1]上计算后再通过缩放和移动恢复
        // 避免了动态求解矩阵的麻烦

        MR = [2 * y1 - 2 * y2 + p3 + p4, 3 * y2 - 3 * y1 - 2 * p3 - p4, p3, y1];
      } else throw new Error('The point x-position should be increamented!');

      return hermite;
    };

    return hermite;
  }

  /**
   * Cardinal三次插值
   * ----------------------------
   * Hermite拟合的计算是，确定二个点和二个点的斜率
   * 用一个y=ax(3)+bx(2)+cx+d的三次多项式来求解
   * 而Cardinal是建立在此基础上
   * 给定需要拟合的二个点和第一个点的前一个点+最后一个点的后一个点
   * 第一个点的斜率由第一个点的前一个点和第二个点的斜率确定
   * 第二个点的斜率由第一个点和第二个点的后一个点的斜率确定
   */
  function cardinal (config) {
    config = initConfig({
      // 该参数用于调整曲线走势，默认数值t=0，分水岭t=-1，|t-(-1)|的值越大，曲线走势调整的越严重
      "t": 0
    }, config);
    var HS, i; // 根据x值返回y值

    var cardinal = function cardinal(x) {
      if (HS) {
        i = -1; // 寻找记录x实在位置的区间
        // 这里就是寻找对应的拟合函数

        while (i + 1 < HS.x.length && (x > HS.x[i + 1] || i == -1 && x >= HS.x[i + 1])) {
          i += 1;
        }

        if (i == -1 || i >= HS.h.length) throw new Error('Coordinate crossing!');
        return HS.h[i](x);
      } else {
        throw new Error('You shoud first set the position!');
      }
    }; // 设置张弛系数【应该在点的位置设置前设置】


    cardinal.setT = function (t) {
      if (typeof t === 'number') {
        config.t = t;
      } else {
        throw new Error('Expecting a figure!');
      }

      return cardinal;
    }; // 设置点的位置
    // 参数格式：[[x,y],[x,y],...]
    // 至少二个点


    cardinal.setP = function (points) {
      HS = {
        "x": [],
        "h": []
      };
      var flag,
          slope = (points[1][1] - points[0][1]) / (points[1][0] - points[0][0]),
          temp;
      HS.x[0] = points[0][0];

      for (flag = 1; flag < points.length; flag++) {
        if (points[flag][0] <= points[flag - 1][0]) throw new Error('The point position should be increamented!');
        HS.x[flag] = points[flag][0]; // 求点斜率

        temp = flag < points.length - 1 ? (points[flag + 1][1] - points[flag - 1][1]) / (points[flag + 1][0] - points[flag - 1][0]) : (points[flag][1] - points[flag - 1][1]) / (points[flag][0] - points[flag - 1][0]); // 求解二个点直接的拟合方程
        // 第一个点的前一个点直接取第一个点
        // 最后一个点的后一个点直接取最后一个点

        HS.h[flag - 1] = hermite({
          "u": (1 - config.t) * 0.5
        }).setP(points[flag - 1][0], points[flag - 1][1], points[flag][0], points[flag][1], slope, temp);
        slope = temp;
      }

      return cardinal;
    };

    return cardinal;
  }

  function getStyle (dom, name) {
    // 获取结点的全部样式
    var allStyle = document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(dom, null) : dom.currentStyle; // 如果没有指定属性名称，返回全部样式

    return isString(name) ? allStyle.getPropertyValue(name) : allStyle;
  }

  // 返回数字数组[r,g,b,a]

  var formatColor = function formatColor(color) {
    var colorNode = document.getElementsByTagName('head')[0];
    colorNode.style['color'] = color;
    var rgba = getStyle(colorNode, 'color');
    var rgbaArray = rgba.replace(/^rgba?\(([^)]+)\)$/, '$1').split(new RegExp('\\,' + REGEXP.whitespace));
    return [+rgbaArray[0], +rgbaArray[1], +rgbaArray[2], rgbaArray[3] == undefined ? 1 : +rgbaArray[3]];
  }; // 获取一组随机色彩

  var getRandomColors = function getRandomColors(num, alpha) {
    if (!(alpha && alpha >= 0 && alpha <= 1)) alpha = 1;
    var temp = [];

    for (var flag = 1; flag <= num; flag++) {
      temp.push('rgba(' + (Math.random() * 230 + 20).toFixed(0) + ',' + (Math.random() * 230 + 20).toFixed(0) + ',' + (Math.random() * 230 + 20).toFixed(0) + ',' + alpha + ')');
    }

    return temp;
  }; // 获取一组循环色彩

  var getLoopColors = function getLoopColors(num, alpha) {
    if (!(alpha && alpha >= 0 && alpha <= 1)) alpha = 1; // 颜色集合

    var colorList = ['rgba(84,112,198,' + alpha + ")", 'rgba(145,204,117,' + alpha + ")", 'rgba(250,200,88,' + alpha + ")", 'rgba(238,102,102,' + alpha + ")", 'rgba(115,192,222,' + alpha + ")", 'rgba(59,162,114,' + alpha + ")", 'rgba(252,132,82,' + alpha + ")", 'rgba(154,96,180,' + alpha + ")", 'rgba(234,124,204,' + alpha + ")"];
    var colors = []; // 根据情况返回颜色数组

    if (num <= colorList.length) {
      // 这种情况就不需要任何处理
      return colorList;
    } else {
      // 如果正好是集合长度的倍数
      if (num % colorList.length == 0) {
        // 将颜色数组循环加入后再返回
        for (var i = 0; i < num / colorList.length; i++) {
          colors = colors.concat(colorList);
        }
      } else {
        for (var j = 1; j < num / colorList.length; j++) {
          colors = colors.concat(colorList);
        } // 防止最后一个颜色和第一个颜色重复


        if (num % colorList.length == 1) {
          colors = colors.concat(colorList[4]);
        } else {
          for (var k = 0; k < num % colorList.length; k++) {
            colors = colors.concat(colorList[k]);
          }
        }
      }
    } // 返回结果


    return colors;
  };

  /*!
   * 🔪 - 基本的树结构位置生成算法
   * https://github.com/hai2007/algorithm.js/blob/master/tree.js
   *
   * author hai2007 < https://hai2007.gitee.io/sweethome >
   *
   * Copyright (c) 2020-present hai2007 走一步，再走一步。
   * Released under the MIT license
   */
  function treeLayout (_config) {
    /**
     * 无论绘制的树结构是什么样子的
     * 计算时都假想目标树的样子如下：
     *  1.根结点在最左边，且上下居中
     *  2.树是从左往右生长的结构
     *  3.每个结点都是一块1*1的正方形，top和left分别表示正方形中心的位置
     */
    var config = _config || {},
        // 维护的树
    alltreedata,
        // 根结点ID
    rootid;
    /**
     * 把内部保存的树结点数据
     * 计算结束后会调用配置的绘图方法
     */

    var update = function update() {
      var beforeDis = [],
          size = 0,
          maxDeep = 0;

      (function positionCalc(pNode, deep) {
        if (deep > maxDeep) maxDeep = deep;
        var flag;

        for (flag = 0; flag < pNode.children.length; flag++) {
          // 因为全部的子结点的位置确定了，父结点的y位置就是子结点的中间位置
          // 因此有子结点的，先计算子结点
          positionCalc(alltreedata[pNode.children[flag]], deep + 1);
        } // left的位置比较简单，deep从0开始编号
        // 比如deep=0，第一层，left=0+0.5=0.5，也就是根结点


        alltreedata[pNode.id].left = deep + 0.5;

        if (flag == 0) {
          // beforeDis是一个数组，用以记录每一层此刻top下边缘（每一层是从上到下）
          // 比如一层的第一个，top值最小可以取top=0.5
          // 为了方便计算，beforeDis[deep] == undefined的时候表示现在准备计算的是这层的第一个结点
          // 因此设置最低上边缘为-0.5
          if (beforeDis[deep] == undefined) beforeDis[deep] = -0.5; // 父边缘同意的进行初始化

          if (beforeDis[deep - 1] == undefined) beforeDis[deep - 1] = -0.5; // 添加的新结点top值第一种求法：本层上边缘+1（比如上边缘是-0.5，那么top最小是top=-0.5+1=0.5）

          alltreedata[pNode.id].top = beforeDis[deep] + 1;
          var pTop = beforeDis[deep] + 1 + (alltreedata[pNode.pid].children.length - 1) * 0.5; // 计算的原则是：如果第一种可行，选择第一种，否则必须选择第二种
          // 判断第一种是否可行的方法就是：如果第一种计算后确定的孩子上边缘不对导致孩子和孩子的前兄弟重合就是可行的

          if (pTop - 1 < beforeDis[deep - 1]) // 必须保证父亲结点和父亲的前一个兄弟保存1的距离，至少
            // 添加的新结点top值的第二种求法：根据孩子取孩子结点的中心top
            alltreedata[pNode.id].top = beforeDis[deep - 1] + 1 - (alltreedata[pNode.pid].children.length - 1) * 0.5;
        } else {
          // 此刻flag!=0
          // 意味着结点有孩子，那么问题就解决了，直接取孩子的中间即可
          // 其实，flag==0的分支计算的就是孩子，是没有孩子的叶结点，那是关键
          alltreedata[pNode.id].top = (alltreedata[pNode.children[0]].top + alltreedata[pNode.children[flag - 1]].top) * 0.5;
        } // 因为计算孩子的时候
        // 无法掌握父辈兄弟的情况
        // 可能会出现父亲和兄弟重叠问题


        if (alltreedata[pNode.id].top <= beforeDis[deep]) {
          var needUp = beforeDis[deep] + 1 - alltreedata[pNode.id].top;

          (function doUp(_pid, _deep) {
            alltreedata[_pid].top += needUp;
            if (beforeDis[_deep] < alltreedata[_pid].top) beforeDis[_deep] = alltreedata[_pid].top;

            var _flag;

            for (_flag = 0; _flag < alltreedata[_pid].children.length; _flag++) {
              doUp(alltreedata[_pid].children[_flag], _deep + 1);
            }
          })(pNode.id, deep);
        } // 计算好一个结点后，需要更新此刻该层的上边缘


        beforeDis[deep] = alltreedata[pNode.id].top; // size在每次计算一个结点后更新，是为了最终绘图的时候知道树有多宽（此处应该叫高）

        if (alltreedata[pNode.id].top + 0.5 > size) size = alltreedata[pNode.id].top + 0.5;
      })(alltreedata[rootid], 0); // 传递的参数分别表示：记录了位置信息的树结点集合、根结点ID和树的宽


      return {
        "node": alltreedata,
        "root": rootid,
        "size": size,
        "deep": maxDeep + 1
      };
    };
    /**
     * 根据配置的层次关系（配置的id,child,root）把原始数据变成内部结构，方便后期位置计算
     * @param {any} initTree
     *
     * tempTree[id]={
     *  "data":原始数据,
     *  "pid":父亲ID,
     *  "id":唯一标识ID,
     *  "children":[cid1、cid2、...]
     * }
     */


    var toInnerTree = function toInnerTree(initTree) {
      var tempTree = {}; // 根结点

      var temp = config.root(initTree),
          id,
          rid;
      id = rid = config.id(temp);
      tempTree[id] = {
        "data": temp,
        "pid": null,
        "id": id,
        "children": []
      };
      var num = 1; // 根据传递的原始数据，生成内部统一结构

      (function createTree(pdata, pid) {
        var children = config.child(pdata, initTree),
            flag;
        num += children ? children.length : 0;

        for (flag = 0; children && flag < children.length; flag++) {
          id = config.id(children[flag]);
          tempTree[pid].children.push(id);
          tempTree[id] = {
            "data": children[flag],
            "pid": pid,
            "id": id,
            "children": []
          };
          createTree(children[flag], id);
        }
      })(temp, id);

      return {
        value: [rid, tempTree],
        num: num
      };
    }; // 可以传递任意格式的树原始数据
    // 只要配置对应的解析方法即可


    var tree = function tree(initTree) {
      var treeData = toInnerTree(initTree);
      alltreedata = treeData.value[1];
      rootid = treeData.value[0];

      if (treeData.num == 1) {
        alltreedata[rootid].left = 0.5;
        alltreedata[rootid].top = 0.5;
        return {
          deep: 1,
          node: alltreedata,
          root: rootid,
          size: 1
        };
      }

      return update();
    }; // 获取根结点的方法:root(initTree)


    tree.root = function (rootback) {
      config.root = rootback;
      return tree;
    }; // 获取子结点的方法:child(parentTree,initTree)


    tree.child = function (childback) {
      config.child = childback;
      return tree;
    }; // 获取结点ID方法:id(treedata)


    tree.id = function (idback) {
      config.id = idback;
      return tree;
    };

    return tree;
  }

  // 点（x,y）围绕中心（cx,cy）旋转deg度
  var _rotate = function rotate(cx, cy, deg, x, y) {
    var cos = Math.cos(deg),
        sin = Math.sin(deg);
    return [+((x - cx) * cos - (y - cy) * sin + cx).toFixed(7), +((x - cx) * sin + (y - cy) * cos + cy).toFixed(7)];
  }; // 点（x,y）沿着向量（ax,ay）方向移动距离d

  var _move = function move(ax, ay, d, x, y) {
    var sqrt = Math.sqrt(ax * ax + ay * ay);
    return [+(ax * d / sqrt + x).toFixed(7), +(ay * d / sqrt + y).toFixed(7)];
  }; // 点（x,y）围绕中心（cx,cy）缩放times倍

  var _scale = function scale(cx, cy, times, x, y) {
    return [+(times * (x - cx) + cx).toFixed(7), +(times * (y - cy) + cy).toFixed(7)];
  };
  var dot = function dot(config) {
    config = initConfig({
      // 前进方向
      d: [1, 1],
      // 中心坐标
      c: [0, 0],
      // 当前位置
      p: [0, 0]
    }, config);
    var dotObj = {
      // 前进方向以当前位置为中心，旋转deg度
      "rotate": function rotate(deg) {
        var dPx = config.d[0] + config.p[0],
            dPy = config.d[1] + config.p[1];

        var dP = _rotate(config.p[0], config.p[1], deg, dPx, dPy);

        config.d = [dP[0] - config.p[0], dP[1] - config.p[1]];
        return dotObj;
      },
      // 沿着当前前进方向前进d
      "move": function move(d) {
        config.p = _move(config.d[0], config.d[1], d, config.p[0], config.p[1]);
        return dotObj;
      },
      // 围绕中心坐标缩放
      "scale": function scale(times) {
        config.p = _scale(config.c[0], config.c[1], times, config.p[0], config.p[1]);
        return dotObj;
      },
      // 当前位置
      "value": function value() {
        return config.p;
      }
    };
    return dotObj;
  };

  function tree (config) {
    config = initConfig({
      // 类型：如果不是下面五种之一，就认为是原始类型
      // type:LR|RL|BT|TB|circle
      // 如果类型是LR|RL|BT|TB需要设置如下参数
      // width,height:宽和高
      // 如果类型是circle需要设置如下参数
      // 1.cx,cy：圆心；2.radius:半径；3.begin-deg,deg：开始和跨越弧度（可选）
      "begin-deg": 0,
      "deg": Math.PI * 2
    }, config);
    var treeCalc = treeLayout() // 配置数据格式
    .root(config.root).child(config.child).id(config.id);

    var treeObj = function treeObj(initData) {
      // 计算初始坐标
      var orgData = treeCalc(initData); // 计算deep

      for (var key in orgData.node) {
        orgData.node[key].deep = orgData.node[key].left - 0.5;
      }

      if (config.type === 'LR' || config.type === 'RL') {
        // 每层间隔
        var dis1 = config.width / orgData.deep;
        if ("RL" === config.type) dis1 *= -1; // 兄弟间隔

        var dis2 = config.height / (orgData.size - -0.5);

        for (var i in orgData.node) {
          var node = orgData.node[i];
          orgData.node[i].left = +(("RL" == config.type ? config.width : 0) - -node.left * dis1).toFixed(7);
          orgData.node[i].top = +(node.top * dis2).toFixed(7);
        }
      } else if (config.type === 'TB' || config.type === 'BT') {
        // 每层间隔
        var _dis = config.height / orgData.deep;

        if ("BT" == config.type) _dis *= -1; // 兄弟间隔

        var _dis2 = config.width / (orgData.size - -0.5);

        var _left, _top;

        for (var _i in orgData.node) {
          var _node = orgData.node[_i];
          _left = _node.left;
          _top = _node.top;
          orgData.node[_i].top = +(("BT" == config.type ? config.height : 0) - -_left * _dis).toFixed(7);
          orgData.node[_i].left = +(_top * _dis2).toFixed(7);
        }
      } else if (config.type === 'circle') {
        // 如果只有一个结点
        if (orgData.deep == 1 && orgData.size == 1) {
          orgData.node[orgData.root].left = config.cx;
          orgData.node[orgData.root].top = config.cy;
        } // 如果有多个结点
        else {
            // 每层间距
            var _dis3 = config.radius / (orgData.deep - 1); // 兄弟间隔弧度


            var _dis4 = config.deg / (orgData.size - -0.5);

            for (var _i2 in orgData.node) {
              var _node2 = orgData.node[_i2];
              orgData.node[_i2].deg = (config['begin-deg'] - -_dis4 * _node2.top) % (Math.PI * 2);
              var pos = _rotate(config.cx, config.cy, orgData.node[_i2].deg, config.cx - -_dis3 * (_node2.left - 0.5), config.cy);
              orgData.node[_i2].left = +pos[0];
              orgData.node[_i2].top = +pos[1];
            }
          }
      } // 启动绘图


      if (isFunction(config.drawer)) {
        // 如果配置了绘图方法，就调用绘图方法
        config.drawer(orgData);
        return treeObj;
      } else {
        // 否则返回数据
        return orgData;
      }
    }; // 配置


    treeObj.config = function (_config) {
      config = initConfig(config, _config);
      return treeObj;
    }; // 设置绘图方法


    treeObj.drawer = function (drawerback) {
      config.drawer = drawerback;
      return treeObj;
    };

    return treeObj;
  }

  /* 等角斜方位投影 */
  var // 围绕X轴旋转
  _rotateX = function _rotateX(deg, x, y, z) {
    var cos = Math.cos(deg),
        sin = Math.sin(deg);
    return [x, y * cos - z * sin, y * sin + z * cos];
  },
      // 围绕Y轴旋转
  _rotateY = function _rotateY(deg, x, y, z) {
    var cos = Math.cos(deg),
        sin = Math.sin(deg);
    return [z * sin + x * cos, y, z * cos - x * sin];
  },
      // 围绕Z轴旋转
  _rotateZ = function _rotateZ(deg, x, y, z) {
    var cos = Math.cos(deg),
        sin = Math.sin(deg);
    return [x * cos - y * sin, x * sin + y * cos, z];
  };

  var p = [];
  function eoap (config, longitude, latitude) {
    /**
     * 通过旋转的方法
     * 先旋转出点的位置
     * 然后根据把地心到旋转中心的这条射线变成OZ这条射线的变换应用到初始化点上
     * 这样求的的点的x,y就是最终结果
     *
     *  计算过程：
     *  1.初始化点的位置是p（x,0,0）,其中x的值是地球半径除以缩放倍速
     *  2.根据点的纬度对p进行旋转，旋转后得到的p的坐标纬度就是目标纬度
     *  3.同样的对此刻的p进行经度的旋转，这样就获取了极点作为中心点的坐标
     *  4.接着想象一下为了让旋转中心移动到极点需要进行旋转的经纬度是多少，记为lo和la
     *  5.然后再对p进行经度度旋转lo获得新的p
     *  6.然后再对p进行纬度旋转la获得新的p
     *  7.旋转结束
     *
     * 特别注意：第5和第6步顺序一定不可以调换，原因来自经纬度定义上
     * 【除了经度为0的位置，不然纬度的旋转会改变原来的经度值，反过来不会】
     *
     */
    p = _rotateY((360 - latitude) / 180 * Math.PI, 100 * config.scale, 0, 0);
    p = _rotateZ(longitude / 180 * Math.PI, p[0], p[1], p[2]);
    p = _rotateZ((90 - config.center[0]) / 180 * Math.PI, p[0], p[1], p[2]);
    p = _rotateX((90 - config.center[1]) / 180 * Math.PI, p[0], p[1], p[2]);
    return [-p[0], //加-号是因为浏览器坐标和地图不一样
    p[1], p[2]];
  }

  function map (_config) {
    var config = initConfig({
      // 默认使用「等角斜方位投影」
      type: 'eoap',
      // 缩放比例
      scale: 1,
      // 投影中心经纬度
      center: [107, 36]
    }, _config);

    var map = function map(longitude, latitude) {
      if (config.type == 'eoap') {
        return eoap(config, longitude, latitude);
      } else {
        throw new Error('Map type configuration error!');
      }
    }; // 修改配置


    map.config = function (_config) {
      config = initConfig(config, _config);
      return map;
    };

    return map;
  }

  /*!
   * 💡 - 刻度尺刻度求解
   * https://github.com/hai2007/tool.js/blob/master/ruler.js
   *
   * author hai2007 < https://hai2007.gitee.io/sweethome >
   *
   * Copyright (c) 2021-present hai2007 走一步，再走一步。
   * Released under the MIT license
   */
  // 需要注意的是，实际的间距个数可能是 num-1 或 num 或 num+1 或 1
  function ruler (maxValue, minValue, num) {
    // 如果最大值最小值反了
    if (maxValue < minValue) {
      var temp = minValue;
      minValue = maxValue;
      maxValue = temp;
    } // 如果相等
    else if (maxValue == minValue) {
        return [maxValue];
      } // 计算最终小数点应该保留的位数


    var dotMaxNum = (maxValue + ".").split('.')[1].length;
    var dotMinNum = (minValue + ".").split('.')[1].length;
    var dotNum = dotMaxNum > dotMinNum ? dotMaxNum : dotMinNum; // 为了变成 -100 ~ 100 需要放大或者缩小的倍数

    var times100 = function (_value) {
      // 先确定基调，是放大还是缩小
      var _times100_base = _value < 100 && _value > -100 ? 10 : 0.1; // 记录当前缩放倍数


      var _times100 = 1,
          _tiemsValue = _value;

      while (_times100_base == 10 ? // 如果是放大，超过 -100 ~ 100 就应该停止
      _tiemsValue >= -100 && _tiemsValue <= 100 : // 如果是缩小，进入 -100 ~ 100 就应该停止
      _tiemsValue <= -100 || _tiemsValue >= 100) {
        _times100 *= _times100_base;
        _tiemsValue *= _times100_base;
      }

      return _times100;
    }( // 根据差值来缩放
    maxValue - minValue); // 求解出 -100 ~ 100 的最佳间距值 后直接转换原来的倍数


    var distance = Math.ceil((maxValue - minValue) * times100 / num) / times100; // 最小值，也就是起点

    var begin = Math.floor(minValue / distance) * distance;
    var rulerArray = [],
        index; // 获取最终的刻度尺数组

    rulerArray.push(begin);

    for (index = 1; rulerArray[rulerArray.length - 1] < maxValue; index++) {
      rulerArray.push(+(begin + distance * index).toFixed(dotNum));
    }

    rulerArray[0] = +begin.toFixed(dotNum); // 最后，进行校对

    var _rulerArray = [rulerArray[0]];

    for (var i = 1; i < rulerArray.length; i++) {
      if (_rulerArray[_rulerArray.length - 1] != rulerArray[i]) {
        _rulerArray.push(rulerArray[i]);
      }
    }

    return _rulerArray;
  }

  function ruler$1 (maxValue, minValue) {
    var num = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
    var rulerArray = ruler(maxValue, minValue, num);
    return {
      min: rulerArray[0],
      max: rulerArray[rulerArray.length - 1],
      distance: rulerArray.length <= 1 ? 0 : rulerArray[1] - rulerArray[0],
      num: rulerArray.length - 1,
      ruler: rulerArray
    };
  }

  // 引入第三方提供的服务
  /**
   * 把类似
   * ['server1',...,function(server1,...){
   *      return function(){
   *          // todo
   *      }
   * }]
   * 解析成函数返回。
   */

  function serviceFactory (inputArray) {
    var methodServers = [];

    var _loop = function _loop(i) {
      // 如果是特殊的类型服务
      if (['boolean', 'number', 'json', 'string', 'color', 'any'].indexOf(inputArray[i]) > -1) {
        // type(默认值)(true)
        methodServers.unshift(function (value) {
          // 如果没有默认值就是必输的
          var required = arguments.length > 0 ? false : true;
          return function (needAnimation) {
            // 最后返回属性分析结果
            return {
              type: inputArray[i],
              required: required,
              animation: needAnimation,
              "default": value
            };
          };
        });
      } //  否则就是普通服务
      else {
          methodServers.unshift({
            "$animation": animation,
            "$cardinal": cardinal,
            "$formatColor": formatColor,
            "$getRandomColors": getRandomColors,
            "$tree": tree,
            "$dot": dot,
            "$rotate": _rotate,
            "$move": _move,
            "$scale": _scale,
            "$map": map,
            "$getLoopColors": getLoopColors,
            "$ruler": ruler$1
          }[inputArray[i]]);
        }
    };

    for (var i = inputArray.length - 2; i >= 0; i--) {
      _loop(i);
    }

    return inputArray[inputArray.length - 1].apply(this, methodServers);
  }

  var calcValue = function calcValue(type, express) {
    switch (type) {
      // boolean
      case 'boolean':
        {
          return express == 'false' || express == false ? false : true;
        }
      // 数字

      case 'number':
        {
          // 角度
          if (/deg$/.test(express)) return (0 - -express.replace(/deg$/, '')) / 180 * Math.PI; // 弧度

          if (/pi$/.test(express)) return (0 - -express.replace(/pi$/, '')) * Math.PI; // 如果是字符串，类型强转

          if (isString(express)) return +express;
          return express;
        }
      // JSON

      case 'json':
        {
          if (isString(express)) {
            return JSON.parse(express);
          }

          return express;
        }
    }

    return express;
  }; // 对来自标签字符串的分析结果进行进一步处理
  // 包括一些校对等比较复杂的业务处理和错误提示
  // （处理render参数或者最终的组件对象）


  function aopRender (initRender, series) {
    // 由于下面的一些方法修改了原来的值
    // 而且AOP操作非常不频繁
    // 因此目前这里直接深度clone
    initRender = JSON.parse(JSON.stringify(initRender)); // 唯一序列号

    var seriesNumber = 0;
    return function doit(renders, pName) {
      var temp = [];

      for (var i = 0; i < renders.length; i++) {
        var render = renders[i];

        if (pName || render.name in series) {
          var aopRender = {
            name: render.name,
            attrs: {},
            events: [],
            scope: {},
            index: seriesNumber++
          };
          var curSeries = pName ? {
            // 组件子属性
            attrs: series[pName].subAttrs[render.name]
          } : // 如果是单一的组件
          series[render.name]; // 属性预处理
          // 主要是需要把类似c-bind:x='index'或c-for='(value,index) in datalist'和x='10'解除差异
          // 这样的好吃是或许判断起来容易
          // 而且数据改变的时候，一些计算可以在此次提前完成

          for (var attrKey in render.attrs) {
            // 对c-bind:attrKey一类进行处理
            if (/^c\-bind\:/.test(attrKey) || /^\:/.test(attrKey)) {
              render.attrs[attrKey.replace(/^(?:c\-bind){0,1}\:/, '')] = {
                isBind: true,
                express: render.attrs[attrKey]
              };
              delete render.attrs[attrKey];
            } // c-on:eventName@regionName
            else if (/^c\-on\:/.test(attrKey)) {
                var eventsArray = (attrKey.replace(/^c\-on\:/, '') + "@default").split('@');
                aopRender.events.push({
                  event: eventsArray[0],
                  region: eventsArray[1],
                  method: render.attrs[attrKey]
                });
              } // c-for="(value,key) in dataList"
              else if ('c-for' == attrKey) {
                  var flag = /^ {0,}\(/.test(render.attrs[attrKey]);

                  var _temp = flag ? // 格式：(value,key) in dataList
                  /^ {0,}\( {0,}([0-9a-zA-Z_$]+) {0,}, {0,}([0-9a-zA-Z_$]+) {0,}\) {1,}in {1,}([^ ]+) {0,}$/.exec(render.attrs[attrKey]) : // 格式：value in dataList
                  /^ {0,}([0-9a-zA-Z_$]+) {1,}in {1,}([^ ]+) {0,}$/.exec(render.attrs[attrKey]);

                  aopRender['c-for'] = {
                    key: flag ? _temp[2] : null,
                    value: _temp[1],
                    data: flag ? _temp[3] : _temp[2]
                  }; // 如果是一个数字

                  if (/^\d{1,}$/.test(aopRender['c-for'].data)) {
                    var len = +aopRender['c-for'].data;
                    aopRender['c-for'].data = [];

                    for (var _i = 0; _i < len; _i++) {
                      aopRender['c-for'].data.push(_i);
                    }
                  }
                } // c-if='flag'
                else if ('c-if' == attrKey) {
                    aopRender['c-if'] = render.attrs[attrKey];
                  } // 默认就是普通属性
                  else {
                      render.attrs[attrKey] = {
                        isBind: false,
                        express: render.attrs[attrKey]
                      };
                    }
          } // 校对属性是否未定义
          // 同时对一些特殊属性进行处理


          for (var _attrKey in render.attrs) {
            if (/^c\-/.test(_attrKey)) ; else if (_attrKey == '_id') {
              aopRender._id = render.attrs._id;
            } else if (_attrKey == '_animation') {
              aopRender._animation = render.attrs._animation;
            } else if (!(_attrKey in curSeries.attrs)) {
              console.warn("attrs." + _attrKey + ' is not defined for ' + (pName ? pName + " > " + render.name : render.name) + '!');
            }
          } // 校对预定义规则的属性


          for (var _attrKey2 in curSeries.attrs) {
            var curAttrs = curSeries.attrs[_attrKey2]; // 对于必输项，如果没有输入，应该直接报错

            if (curAttrs.required && !(_attrKey2 in render.attrs)) {
              throw new Error('attrs.' + _attrKey2 + ' is required for ' + (pName ? pName + " > " + render.name : render.name) + '!');
            } // 添加定义的属性


            aopRender.attrs[_attrKey2] = {
              animation: curAttrs.animation,
              type: curAttrs.type,
              value: _attrKey2 in render.attrs ? render.attrs[_attrKey2] : {
                isBind: false,
                express: curAttrs["default"]
              }
            }; // 类型校对和特殊计算

            if (!aopRender.attrs[_attrKey2].value.isBind) {
              aopRender.attrs[_attrKey2].value.express = calcValue(aopRender.attrs[_attrKey2].type, aopRender.attrs[_attrKey2].value.express);
            }
          } // 划分孩子结点和子组件


          var children_temp = [],
              subRender_temp = [],
              text_temp = []; // 因为render可能是人收到写的，孩子结点不一定有，需要判断一下

          if (render.children) {
            // 开始区分是独立的子节点还是当前组件的子组件
            // 文字比较特殊，提前初步记录在当前结点
            for (var _i2 = 0; _i2 < render.children.length; _i2++) {
              // 文字
              if (isString(render.children[_i2])) {
                text_temp.push(render.children[_i2]);
              } // 如果这个组件存在于当前组件的子属性中，就应该是子组件
              else if (curSeries.subAttrs && render.children[_i2].name in curSeries.subAttrs) {
                  subRender_temp.push(render.children[_i2]);
                } // 独立的子组件
                else {
                    children_temp.push(render.children[_i2]);
                  }
            }
          }

          aopRender.children = doit(children_temp);
          aopRender.subAttrs = doit(subRender_temp, render.name);
          aopRender.text = text_temp;
          temp.push(aopRender);
        } // 如果组件没有被注册，给出提示并忽略，因为可能是写出了
        else {
            console.error('Series ' + render.name + ' is not defined!');
          }
      }

      return temp;
    }(initRender);
  }

  // 点（x,y）围绕中心（cx,cy）旋转deg度
  var rotate = function rotate(cx, cy, deg, x, y) {
    var cos = Math.cos(deg),
        sin = Math.sin(deg);
    return [+((x - cx) * cos - (y - cy) * sin + cx).toFixed(7), +((x - cx) * sin + (y - cy) * cos + cy).toFixed(7)];
  }; // r1和r2，内半径和外半径
  // beginA起点弧度，rotateA旋转弧度式


  function arc (beginA, rotateA, cx, cy, r1, r2, doback) {
    // 保证逆时针也是可以的
    if (rotateA < 0) {
      beginA += rotateA;
      rotateA *= -1;
    }

    var temp = [],
        p; // 内部

    p = rotate(0, 0, beginA, r1, 0);
    temp[0] = p[0];
    temp[1] = p[1];
    p = rotate(0, 0, rotateA, p[0], p[1]);
    temp[2] = p[0];
    temp[3] = p[1]; // 外部

    p = rotate(0, 0, beginA, r2, 0);
    temp[4] = p[0];
    temp[5] = p[1];
    p = rotate(0, 0, rotateA, p[0], p[1]);
    temp[6] = p[0];
    temp[7] = p[1];
    doback(beginA, beginA + rotateA, temp[0] + cx, temp[1] + cy, temp[4] + cx, temp[5] + cy, temp[2] + cx, temp[3] + cy, temp[6] + cx, temp[7] + cy, (r2 - r1) * 0.5);
  }

  var initPainterConfig = {
    // 填充色或图案
    "fillStyle": 'black',
    // 轮廓色或图案
    "strokeStyle": 'black',
    // 线条宽度(单位px，下同)
    "lineWidth": 1,
    // 文字水平对齐方式（"left"左对齐、"center"居中和"right"右对齐）
    "textAlign": 'left',
    // 文字垂直对齐方式（"middle"垂直居中、"top"上对齐和"bottom"下对齐）
    "textBaseline": 'middle',
    // 文字大小
    "font-size": 16,
    // 字体，默认"sans-serif"
    "font-family": "sans-serif",
    // 圆弧开始端闭合方式（"butt"直线闭合、"round"圆帽闭合）
    "arc-start-cap": 'butt',
    // 圆弧结束端闭合方式，和上一个类似
    "arc-end-cap": 'butt',
    // 设置线条虚线，应该是一个数组[number,...]
    "lineDash": [],
    // 阴影的模糊系数，默认0，也就是无阴影
    "shadowBlur": 0,
    // 阴影的颜色
    "shadowColor": "black"
  }; // 文字统一设置方法

  var initText = function initText(painter, config, x, y, deg, platform) {
    painter.beginPath();
    painter.translate(x, y);
    painter.rotate(deg);

    if (platform != 'default') {
      painter.setFontSize(config['font-size']); // font-family目前无视了
    } else {
      painter.font = config['font-size'] + "px " + config['font-family'];
    }

    return painter;
  }; // 画弧统一设置方法

  var initArc = function initArc(painter, config, cx, cy, r1, r2, beginDeg, deg) {
    if (r1 > r2) {
      var temp = r1;
      r1 = r2;
      r2 = temp;
    }

    beginDeg = beginDeg % (Math.PI * 2); // 当|deg|>=2π的时候都认为是一个圆环
    // 为什么不取2π比较，是怕部分浏览器浮点不精确

    if (deg >= Math.PI * 1.999999 || deg <= -Math.PI * 1.999999) {
      deg = Math.PI * 2;
    } else {
      deg = deg % (Math.PI * 2);
    }

    arc(beginDeg, deg, cx, cy, r1, r2, function (beginA, endA, begInnerX, begInnerY, begOuterX, begOuterY, endInnerX, endInnerY, endOuterX, endOuterY, r) {
      if (r < 0) r = -r;
      painter.beginPath();
      painter.moveTo(begInnerX, begInnerY);
      painter.arc( // (圆心x，圆心y，半径，开始角度，结束角度，true逆时针/false顺时针)
      cx, cy, r1, beginA, endA, false); // 结尾

      if (config["arc-end-cap"] != 'round') painter.lineTo(endOuterX, endOuterY);else painter.arc((endInnerX + endOuterX) * 0.5, (endInnerY + endOuterY) * 0.5, r, endA - Math.PI, endA, true);
      painter.arc(cx, cy, r2, endA, beginA, true); // 开头

      if (config["arc-start-cap"] != 'round') painter.lineTo(begInnerX, begInnerY);else painter.arc((begInnerX + begOuterX) * 0.5, (begInnerY + begOuterY) * 0.5, r, beginA, beginA - Math.PI, true);
    });
    if (config["arc-start-cap"] == 'butt') painter.closePath();
    return painter;
  }; // 画圆统一设置方法

  var initCircle = function initCircle(painter, cx, cy, r) {
    painter.beginPath();
    painter.moveTo(cx + r, cy);
    painter.arc(cx, cy, r, 0, Math.PI * 2);
    return painter;
  }; // 画矩形统一设置方法

  var initRect = function initRect(painter, x, y, width, height) {
    painter.beginPath();
    painter.rect(x, y, width, height);
    return painter;
  };

  // 线性渐变
  var linearGradient = function linearGradient(painter, x0, y0, x1, y1) {
    var gradient = painter.createLinearGradient(x0, y0, x1, y1);
    var enhanceGradient = {
      "value": function value() {
        return gradient;
      },
      "addColorStop": function addColorStop(stop, color) {
        gradient.addColorStop(stop, color);
        return enhanceGradient;
      }
    };
    return enhanceGradient;
  }; // 环形渐变

  var radialGradient = function radialGradient(painter, cx, cy, r) {
    var gradient = painter.createRadialGradient(cx, cy, 0, cx, cy, r);
    var enhanceGradient = {
      "value": function value() {
        return gradient;
      },
      "addColorStop": function addColorStop(stop, color) {
        gradient.addColorStop(stop, color);
        return enhanceGradient;
      }
    };
    return enhanceGradient;
  };

  var unSupportAttr = {};
  function painter (platform, canvas, width, height) {
    var painter;

    if (platform != 'default') {
      // 非默认环境的画笔由外界提供
      painter = canvas.painter;
    } else {
      // 获取canvas2D画笔
      painter = canvas.getContext("2d"); //  如果画布隐藏或大小为0
      // 对于这种情况，修改为直接在前置拦截
      // by 你好2007 (2021年4月29日)
      // if (width == 0 || height == 0) throw new Error('Canvas is hidden or size is zero!');
      // 设置显示大小

      canvas.style.width = width + "px";
      canvas.style.height = height + "px"; // 设置画布大小（画布大小设置为显示的二倍，使得显示的时候更加清晰）

      canvas.setAttribute('width', width * 2);
      canvas.setAttribute('height', height * 2); // 通过缩放实现模糊问题

      painter.scale(2, 2);
    } // 用于记录配置
    // 因为部分配置的设置比较特殊，只先记录意图


    var config = {}; // 配置生效方法

    var useConfig = platform == 'uni-app' ? // uni-app
    function (key, value) {
      // 如果已经存在默认配置中，说明只需要缓存起来即可
      if (["font-size", "font-family", "arc-start-cap", "arc-end-cap"].indexOf(key) > -1) {
        config[key] = value;
      } else {
        try {
          painter['set' + key[0].toUpperCase() + key.substr(1)](value);
        } catch (e) {
          if (!unSupportAttr[platform]) {
            unSupportAttr[platform] = {};
          } // 为了友好，我们只对第一次进行提示


          if (!unSupportAttr[platform][key]) {
            // 部分属性可能一些平台设置方法不兼容，这里进行调试提示
            unSupportAttr[platform][key] = true;
            console.warn("Clunch内置画笔的" + key + "属性在" + platform + "平台上不支持！");
          }
        }
      }
    } : // 默认环境
    // 微信小程序
    function (key, value) {
      /**
       * -----------------------------
       * 特殊的设置开始
       * -----------------------------
       */
      if (key == 'lineDash') {
        painter.setLineDash(value);
      }
      /**
       * -----------------------------
       * 常规的配置开始
       * -----------------------------
       */
      // 如果已经存在默认配置中，说明只需要缓存起来即可
      else if (["font-size", "font-family", "arc-start-cap", "arc-end-cap"].indexOf(key) > -1) {
          config[key] = value;
        } // 其它情况直接生效即可
        else if (key in initPainterConfig) {
            painter[key] = value;
          } // 如果属性未被定义
          else {
              throw new Error('Illegal configuration item of painter : ' + key + " !");
            }
    }; // 画笔

    var enhancePainter = {
      // 属性设置或获取
      "config": function config() {
        if (arguments.length === 1) {
          if (_typeof(arguments[0]) !== 'object') return painter[arguments[0]];

          for (var key in arguments[0]) {
            useConfig(key, arguments[0][key]);
          }
        } else if (arguments.length === 2) {
          useConfig(arguments[0], arguments[1]);
        }

        return enhancePainter;
      },
      // 文字
      "fillText": function fillText(text, x, y, deg) {
        painter.save();
        initText(painter, config, x, y, deg || 0, platform).fillText(text, 0, 0);
        painter.restore();
        return enhancePainter;
      },
      "strokeText": function strokeText(text, x, y, deg) {
        painter.save();
        initText(painter, config, x, y, deg || 0, platform).strokeText(text, 0, 0);
        painter.restore();
        return enhancePainter;
      },
      "fullText": function fullText(text, x, y, deg) {
        painter.save();
        initText(painter, config, x, y, deg || 0, platform);
        painter.fillText(text, 0, 0);
        painter.strokeText(text, 0, 0);
        painter.restore();
        return enhancePainter;
      },
      // 路径
      "beginPath": function beginPath() {
        painter.beginPath();
        return enhancePainter;
      },
      "closePath": function closePath() {
        painter.closePath();
        return enhancePainter;
      },
      "moveTo": function moveTo(x, y) {
        painter.moveTo(x, y);
        return enhancePainter;
      },
      "lineTo": function lineTo(x, y) {
        painter.lineTo(x, y);
        return enhancePainter;
      },
      "arc": function arc(x, y, r, beginDeg, deg) {
        painter.arc(x, y, r, beginDeg, beginDeg + deg, deg < 0);
        return enhancePainter;
      },
      "fill": function fill() {
        painter.fill();
        return enhancePainter;
      },
      "stroke": function stroke() {
        painter.stroke();
        return enhancePainter;
      },
      "full": function full() {
        painter.fill();
        painter.stroke();
        return enhancePainter;
      },
      "save": function save() {
        painter.save();
        return enhancePainter;
      },
      "restore": function restore() {
        painter.restore();
        return enhancePainter;
      },
      // 路径 - 贝塞尔曲线
      "quadraticCurveTo": function quadraticCurveTo(cpx, cpy, x, y) {
        painter.quadraticCurveTo(cpx, cpy, x, y);
        return enhancePainter;
      },
      "bezierCurveTo": function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
        painter.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        return enhancePainter;
      },
      // 擦除画面
      "clearRect": function clearRect(x, y, w, h) {
        painter.clearRect(x || 0, y || 0, w || width, h || height);
        return enhancePainter;
      },
      // 地址图片
      "toDataURL": function toDataURL() {
        return canvas.toDataURL();
      },
      // 绘制图片
      "drawImage": function drawImage(img, sx, sy, sw, sh, x, y, w, h) {
        sx = sx || 0;
        sy = sy || 0;
        x = x || 0;
        y = y || 0;
        w = w ? w * 2 : width * 2;
        h = h ? h * 2 : height * 2;

        if (img.nodeName == 'CANVAS') {
          // 我们不考虑别的canvas，我们认为我们面对的canvas都是自己控制的
          // 如果有必要，未来可以对任意canvas进行向下兼容
          w = w / 2;
          h = h / 2;
          sw = sw ? sw * 2 : width * 2;
          sh = sh ? sh * 2 : height * 2;
        } else {
          // 默认类型是图片
          sw = (sw || img.width) * 2;
          sh = (sh || img.height) * 2;
        }

        painter.drawImage(img, sx, sy, sw, sh, x, y, w, h);
        return enhancePainter;
      },
      // 弧
      "fillArc": function fillArc(cx, cy, r1, r2, beginDeg, deg) {
        initArc(painter, config, cx, cy, r1, r2, beginDeg, deg).fill();
        return enhancePainter;
      },
      "strokeArc": function strokeArc(cx, cy, r1, r2, beginDeg, deg) {
        initArc(painter, config, cx, cy, r1, r2, beginDeg, deg).stroke();
        return enhancePainter;
      },
      "fullArc": function fullArc(cx, cy, r1, r2, beginDeg, deg) {
        initArc(painter, config, cx, cy, r1, r2, beginDeg, deg);
        painter.fill();
        painter.stroke();
        return enhancePainter;
      },
      // 圆形
      "fillCircle": function fillCircle(cx, cy, r) {
        initCircle(painter, cx, cy, r).fill();
        return enhancePainter;
      },
      "strokeCircle": function strokeCircle(cx, cy, r) {
        initCircle(painter, cx, cy, r).stroke();
        return enhancePainter;
      },
      "fullCircle": function fullCircle(cx, cy, r) {
        initCircle(painter, cx, cy, r);
        painter.fill();
        painter.stroke();
        return enhancePainter;
      },
      // 矩形
      "fillRect": function fillRect(x, y, width, height) {
        initRect(painter, x, y, width, height).fill();
        return enhancePainter;
      },
      "strokeRect": function strokeRect(x, y, width, height) {
        initRect(painter, x, y, width, height).stroke();
        return enhancePainter;
      },
      "fullRect": function fullRect(x, y, width, height) {
        initRect(painter, x, y, width, height);
        painter.fill();
        painter.stroke();
        return enhancePainter;
      },

      /**
      * 渐变
      * -------------
      */
      //  线性渐变
      "createLinearGradient": function createLinearGradient(x0, y0, x1, y1) {
        return linearGradient(painter, x0, y0, x1, y1);
      },
      // 环形渐变
      "createRadialGradient": function createRadialGradient(cx, cy, r) {
        return radialGradient(painter, cx, cy, r);
      }
    };
    return enhancePainter;
  }

  // 绑定事件
  function bind(target, eventType, callback) {
    if (window.attachEvent) {
      target.attachEvent("on" + eventType, callback); // 后绑定的先执行
    } else {
      target.addEventListener(eventType, callback, false); // 捕获
    }
  } // 获取鼠标相对特定元素左上角位置

  var position = function position(target, event) {
    // 如果给的直接是数据，返回即可
    if (event.type == 'result') return {
      x: event.position.left,
      y: event.position.top
    }; // 返回元素的大小及其相对于视口的位置

    var bounding = target.getBoundingClientRect();
    return {
      // 鼠标相对元素位置 = 鼠标相对窗口坐标 - 元素相对窗口坐标
      "x": event.clientX - bounding.left,
      "y": event.clientY - bounding.top
    };
  };

  function region (that, el) {
    var _width = 1,
        _height = 1;
    var regions = {},
        //区域映射表
    regions_data = {},
        //记录区域数据
    rgb = [0, 0, 0],
        //区域标识色彩,rgb(0,0,0)表示空白区域
    p = 'r'; //色彩增值位置
    // 用于计算包含关系的画板

    var canvas, _painter2;

    if (that._platform == 'default') {
      canvas = document.createElement('canvas');
      _painter2 = painter(that._platform, canvas, 1, 1);
    } else {
      canvas = el.region;
      _painter2 = painter(that._platform, {
        painter: el.region
      }, el.width, el.height);
      _width = el.width;
      _height = el.height;
    }

    return {
      // 非默认平台的draw方法
      "draw": function draw() {
        canvas.draw();
      },
      // 擦除
      "erase": function erase() {
        _painter2.config({
          fillStyle: 'rgb(255,255,255)'
        }).fillRect(0, 0, _width, _height);
      },
      // 更新大小
      "updateSize": function updateSize(width, height) {
        _width = width;
        _height = height;

        if (that._platform == 'default') {
          _painter2 = painter(that._platform, canvas, width, height);
        } else {
          _painter2 = painter(that._platform, {
            painter: el.region
          }, width, height);
        }
      },
      // 绘制（添加）区域范围

      /**
       * region_id：区域唯一标识（一个标签上可以维护多个区域）
       */
      "painter": function painter(region_id, data) {
        if (regions[region_id] == undefined) {
          regions[region_id] = {
            'r': function r() {
              rgb[0] += 1;
              p = 'g';
              return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
            },
            'g': function g() {
              rgb[1] += 1;
              p = 'b';
              return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
            },
            'b': function b() {
              rgb[2] += 1;
              p = 'r';
              return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
            }
          }[p]();
        }

        regions_data[region_id] = data;

        _painter2.config(initPainterConfig).config({
          fillStyle: regions[region_id],
          strokeStyle: regions[region_id]
        });

        return _painter2;
      },
      // 获取此刻鼠标所在区域
      "getRegion": function getRegion(event, doback) {
        var pos = position(that.__canvas, event),
            currentRGBA;

        var doSearch = function doSearch() {
          // 查找当前点击的区域
          for (var i in regions) {
            if ("rgb(" + currentRGBA[0] + "," + currentRGBA[1] + "," + currentRGBA[2] + ")" == regions[i]) {
              doback([i, pos.x, pos.y, regions_data[i]]);
              return;
            }
          } // 说明当前不在任何区域


          doback([null, pos.x, pos.y, undefined]);
        };

        if (that._platform == 'default') {
          pos.x -= getStyle(that.__canvas, 'border-left-width').replace('px', '');
          pos.y -= getStyle(that.__canvas, 'border-top-width').replace('px', '');
          currentRGBA = canvas.getContext("2d").getImageData(pos.x * 2 - 0.5, pos.y * 2 - 0.5, 1, 1).data;
          doSearch();
        } else {
          that.__options.el.getRegionColor({
            x: pos.x - 0.5,
            y: pos.y - 0.5,
            width: 1,
            height: 1,
            canvasId: that.__options.el.regionid,
            success: function success(res) {
              currentRGBA = res.data;
              doSearch();
            },
            fail: function fail(error) {
              throw new Error(error);
            }
          });
        }
      }
    };
  }

  function initMixin(Clunch) {
    // 对对象进行初始化
    Clunch.prototype.$$init = function (options) {
      var _this = this;

      this.__options = options; // 记录平台

      this._platform = "platform" in options ? options.platform : "default"; // 需要双向绑定的数据

      this.__data = isArray(options.data) ? serviceFactory(options.data) : isFunction(options.data) ? options.data() : options.data; // 数据改变是否需要过渡动画

      this.__animation = 'animation' in options ? options.animation : true; // 记录状态

      this._isMounted = false;
      this._isDestroyed = false; // 挂载方法-

      for (var key in options.methods) {
        // 由于key的特殊性，注册前需要进行校验
        isValidKey(key);
        this[key] = isArray(options.methods[key]) ? serviceFactory(options.methods[key]) : options.methods[key];
      } // 挂载数据


      for (var _key in this.__data) {
        isValidKey(_key);
        this[_key] = this.__data[_key];
      } // 记录是否传递了render或template
      // 这里的登记是为了后续重新挂载的时候判断是否需要重置render


      this.__renderFlag = !!options.render || !!options.template; // 如果render存在，结合当前信息获取真正的render
      // 为什么传递的render不是真正的？
      // 这是为了方便用户使用，用户写的render建立简单，后续初始化的时候，结合所有信息，再获取完整的

      if (!!options.render) {
        this.__renderAOP = aopRender(options.render, this.__defineSerirs);
      } // 如果没有render，再看看有没有传递template
      // 因此render优先级明显高于template
      else if (!!options.template) {
          this.__renderOptions = this.$$templateCompiler(options.template);
          this.__renderAOP = aopRender(this.__renderOptions, this.__defineSerirs);
        } // 数据改变需要的初始化辅助参数


      this.__observeWatcher = {
        // 是否有前置计算未完成
        flag: false,
        // 动画停止方法
        stop: null,
        time: 'time' in options ? options.time : 500
      }; // 画布大小改变需要的初始化辅助参数

      this.__observeResize = {
        // 是否可以立刻更新画布
        help: true,
        // 前置是否有任务未完成
        flag: false,
        // 画布监听对象
        observer: null
      }; // 画笔参数

      this.__painter = null;
      this._width = 0;
      this._height = 0;
      this._min = 0;
      this._max = 0; // 区域管理者

      if (this._platform == 'default') {
        this.__regionManager = region(this);
      } else {
        this.__regionManager = region(this, options.el);
      } // 事件处理兼容改造
      // 主要是用于无法直接通过DOM主动绑定的环境


      this.$$trigger = function (eventName, eventParam) {
        /**
        * eventParam={
        *      left:number,
        *      top:number
        * };
        */
        var events = _this.__events_platform[eventName];

        for (var i = 0; i < events.length; i++) {
          events[i]({
            type: 'result',
            position: eventParam
          });
        }
      };
    };
  }

  function lifecycleMixin(Clunch) {
    // 生命周期调用钩子
    // 整个过程，进行到对应时期，都需要调用一下这里对应的钩子
    // 整合在一起的目的是方便维护
    Clunch.prototype.$$lifecycle = function (callbackName) {
      // beforeCreate，对象创建前
      if (isFunction(callbackName)) {
        callbackName();
      } else {
        if ([// 对象创建完毕
        'created', // 对象和页面关联前、后
        'beforeMount', 'mounted', // 对象和页面解关联前、后
        'beforeUnmount', 'unmounted', // 数据改动前、后
        'beforeUpdate', 'updated', // 画布大小改变前、后
        'beforeResize', 'resized', // 画布重新绘制前、后
        'beforeDraw', 'drawed', // 销毁组件
        'beforeDestroy', 'destroyed'].indexOf(callbackName) > -1 && isFunction(this.__options[callbackName])) {
          this.__options[callbackName].call(this);
        }
      }

      return this;
    };
  }

  var toString$1 = Object.prototype.toString;
  /**
   * 获取一个值的类型字符串[object type]
   *
   * @param {*} value 需要返回类型的值
   * @returns {string} 返回类型字符串
   */

  function getType$1 (value) {
    if (value == null) {
      return value === undefined ? '[object Undefined]' : '[object Null]';
    }

    return toString$1.call(value);
  }

  /**
   * 判断一个值是不是String。
   *
   * @param {*} value 需要判断类型的值
   * @returns {boolean} 如果是String返回true，否则返回false
   */

  function _isString$1 (value) {
    var type = _typeof(value);

    return type === 'string' || type === 'object' && value != null && !Array.isArray(value) && getType$1(value) === '[object String]';
  }

  var isString$1 = _isString$1;

  var $RegExp = {
    // 空白字符:http://www.w3.org/TR/css3-selectors/#whitespace
    blankReg: new RegExp("[\\x20\\t\\r\\n\\f]"),
    blanksReg: /^[\x20\t\r\n\f]{0,}$/,
    // 标志符
    identifier: /^[a-zA-Z_$][0-9a-zA-Z_$]{0,}$/
  };

  // 后续我们的任务就是对这个数组进行归约即可(归约交付给别的地方，这里不继续处理)

  /**
   * 例如：
   *  target={
   *      a:{
   *              value:9
   *         },
   *      b:7,
   *      flag:'no'
   *  }
   *  express= "a.value>10 && b< 11 ||flag=='yes'"
   * 变成数组以后应该是：
   *
   * // 比如最后的yes@value表示这是一个最终的值，不需要再计算了
   * ['a','[@value','value@value',']@value','>@value','10@value','&&@value','b','<@value','||@value','flag','==@value','yes@value']
   *
   * 然后，进一步解析得到：
   * [{value:9},'[','value',']','>',10,'&&',7,'<','||','no','==','yes']
   *
   * (当然，我们实际运算的时候，可能和这里不完全一致，这里只是为了方便解释我们的主体思想)
   *
   * 然后我们返回上面的结果即可！
   */
  // 除了上述原因，统一前置处理还有一个好处就是：
  // 可以提前对部分语法错误进行报错，方便定位调试
  // 因为后续的操作越来越复杂，错误越提前越容易定位

  var specialCode1 = ['+', '-', '*', '/', '%', '&', '|', '!', '?', ':', '[', ']', '(', ")", '>', '<', '='];
  var specialCode2 = ['+', '-', '*', '/', '%', '&', '|', '!', '?', ':', '>', '<', '=', '<=', '>=', '==', '===', '!=', '!=='];
  function analyseExpress (target, express, scope) {
    // 剔除开头和结尾的空白
    express = express.trim();
    var i = -1,
        // 当前面对的字符
    currentChar = null; // 获取下一个字符

    var next = function next() {
      currentChar = i++ < express.length - 1 ? express[i] : null;
      return currentChar;
    }; // 获取往后n个值


    var nextNValue = function nextNValue(n) {
      return express.substring(i, n + i > express.length ? express.length : n + i);
    };

    next();
    var expressArray = [];

    while (true) {
      if (i >= express.length) break; // 先匹配普通的符号
      // + - * / %
      // && || !
      // ? :
      // [ ] ( )
      // > < >= <= == === != !==
      // 如果是&或者|比较特殊

      if (specialCode1.indexOf(currentChar) > -1) {
        // 对于特殊的符号
        if (['&', '|', '='].indexOf(currentChar) > -1) {
          if (['==='].indexOf(nextNValue(3)) > -1) {
            expressArray.push(nextNValue(3));
            i += 2;
            next();
          } else if (['&&', '||', '=='].indexOf(nextNValue(2)) > -1) {
            expressArray.push(nextNValue(2));
            i += 1;
            next();
          } else {
            throw new Error("Illegal expression : " + express + "\nstep='analyseExpress',index=" + i);
          }
        } else {
          // 拦截部分比较特殊的
          if (['!=='].indexOf(nextNValue(3)) > -1) {
            expressArray.push(nextNValue(3));
            i += 2;
            next();
          } else if (['>=', '<=', '!='].indexOf(nextNValue(2)) > -1) {
            expressArray.push(nextNValue(2));
            i += 1;
            next();
          } // 普通的单一的
          else {
              expressArray.push(currentChar);
              next();
            }
        }
      } // 如果是字符串
      else if (['"', "'"].indexOf(currentChar) > -1) {
          var temp = "",
              beginTag = currentChar;
          next(); // 如果没有遇到结束标签
          // 目前没有考虑 '\'' 这种带转义字符的情况，当然，'\"'这种是支持的
          // 后续如果希望支持，优化这里即可

          while (currentChar != beginTag) {
            if (i >= express.length) {
              // 如果还没有遇到结束标识就结束了，属于字符串未闭合错误
              throw new Error("String unclosed error : " + express + "\nstep='analyseExpress',index=" + i);
            } // 继续拼接


            temp += currentChar;
            next();
          }

          expressArray.push(temp + "@string");
          next();
        } // 如果是数字
        else if (/\d/.test(currentChar)) {
            var dotFlag = 'no'; // no表示还没有匹配到.，如果已经匹配到了，标识为yes，如果匹配到了.，可是后面还没有遇到数组，标识为error

            var temp = currentChar;
            next();

            while (i < express.length) {
              if (/\d/.test(currentChar)) {
                temp += currentChar;
                if (dotFlag == 'error') dotFlag = 'yes';
              } else if ('.' == currentChar && dotFlag == 'no') {
                temp += currentChar;
                dotFlag = 'error';
              } else {
                break;
              }

              next();
            } // 如果小数点后面没有数字，辅助添加一个0


            if (dotFlag == 'error') temp += "0";
            expressArray.push(+temp);
          } // 如果是特殊符号
          // 也就是类似null、undefined等
          else if (['null', 'true'].indexOf(nextNValue(4)) > -1) {
              expressArray.push({
                "null": null,
                "true": true
              }[nextNValue(4)]);
              i += 3;
              next();
            } else if (['false'].indexOf(nextNValue(5)) > -1) {
              expressArray.push({
                'false': false
              }[nextNValue(5)]);
              i += 4;
              next();
            } else if (['undefined'].indexOf(nextNValue(9)) > -1) {
              expressArray.push({
                "undefined": undefined
              }[nextNValue(9)]);
              i += 8;
              next();
            } // 如果是空格
            else if ($RegExp.blankReg.test(currentChar)) {
                do {
                  next();
                } while ($RegExp.blankReg.test(currentChar) && i < express.length);
              } else {
                var dot = false; // 对于开头有.进行特殊捕获，因为有.意味着这个值应该可以变成['key']的形式
                // 这是为了和[key]进行区分，例如：
                // .key 等价于 ['key'] 翻译成这里就是 ['[','key',']']
                // 可是[key]就不一样了，翻译成这里以后应该是 ['[','这个值取决当前对象和scope',']']
                // 如果这里不进行特殊处理，后续区分需要额外的标记，浪费资源

                if (currentChar == '.') {
                  dot = true;
                  next();
                } // 如果是标志符

                /**
                 *  命名一个标识符时需要遵守如下的规则：
                 *  1.标识符中可以含有字母 、数字 、下划线_ 、$符号
                 *  2.标识符不能以数字开头
                 */
                // 当然，是不是关键字等我们就不校对了，因为没有太大的实际意义
                // 也就是类似flag等局部变量


                if ($RegExp.identifier.test(currentChar)) {
                  var len = 1;

                  while (i + len <= express.length && $RegExp.identifier.test(nextNValue(len))) {
                    len += 1;
                  }

                  if (dot) {
                    expressArray.push('[');
                    expressArray.push(nextNValue(len - 1) + '@string');
                    expressArray.push(']');
                  } else {
                    var tempKey = nextNValue(len - 1); // 如果不是有前置.，那就是需要求解了

                    var tempValue = tempKey in scope ? scope[tempKey] : target[tempKey];
                    expressArray.push(isString$1(tempValue) ? tempValue + "@string" : tempValue);
                  }

                  i += len - 2;
                  next();
                } // 都不是，那就是错误
                else {
                    throw new Error("Illegal express : " + express + "\nstep='analyseExpress',index=" + i);
                  }
              }
    } // 实际情况是，对于-1等特殊数字，可能存在误把1前面的-号作为运算符的错误，这里拦截校对一下


    var length = 0;

    for (var j = 0; j < expressArray.length; j++) {
      if (["+", "-"].indexOf(expressArray[j]) > -1 && ( // 如果前面的也是运算符或开头，这个应该就不应该是运算符了
      j == 0 || specialCode2.indexOf(expressArray[length - 1]) > -1)) {
        expressArray[length++] = +(expressArray[j] + expressArray[j + 1]);
        j += 1;
      } else {
        expressArray[length++] = expressArray[j];
      }
    }

    expressArray.length = length;
    return expressArray;
  }

  var getExpressValue = function getExpressValue(value) {
    // 这里是计算的内部，不需要考虑那么复杂的类型
    if (typeof value == 'string') return value.replace(/@string$/, '');
    return value;
  };

  var setExpressValue = function setExpressValue(value) {
    if (typeof value == 'string') return value + "@string";
    return value;
  };

  function evalValue (expressArray) {
    // 采用按照优先级顺序归约的思想进行
    // 需要明白，这里不会出现括号
    // （小括号或者中括号，当然，也不会有函数，这里只会有最简单的表达式）
    // 这也是我们可以如此归约的前提
    // + - * / %
    // && || !
    // ? :
    // > < >= <= == === != !==
    // !
    // 因为合并以后数组长度一定越来越短，我们直接复用以前的数组即可
    var length = 0,
        i = 0;

    for (; i < expressArray.length; i++) {
      if (expressArray[i] == '!') {
        // 由于是逻辑运算符，如果是字符串，最后的@string是否去掉已经没有意义了
        expressArray[length] = !expressArray[++i];
      } else expressArray[length] = expressArray[i];

      length += 1;
    }

    if (length == 1) return getExpressValue(expressArray[0]);
    expressArray.length = length; // * / %

    length = 0;

    for (i = 0; i < expressArray.length; i++) {
      if (expressArray[i] == '*') {
        // 假设不知道一定正确，主要是为了节约效率，是否提供错误提示，再议
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) * getExpressValue(expressArray[++i]);
      } else if (expressArray[i] == '/') {
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) / getExpressValue(expressArray[++i]);
      } else if (expressArray[i] == '%') {
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) % getExpressValue(expressArray[++i]);
      } else {
        // 上面不会导致数组增长
        expressArray[length++] = expressArray[i];
      }
    }

    if (length == 1) return getExpressValue(expressArray[0]);
    expressArray.length = length; // + -

    length = 0;

    for (i = 0; i < expressArray.length; i++) {
      if (expressArray[i] == '+') {
        expressArray[length - 1] = setExpressValue(getExpressValue(expressArray[length - 1]) + getExpressValue(expressArray[++i]));
      } else if (expressArray[i] == '-') {
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) - getExpressValue(expressArray[++i]);
      } else expressArray[length++] = expressArray[i];
    }

    if (length == 1) return getExpressValue(expressArray[0]);
    expressArray.length = length; // > < >= <=

    length = 0;

    for (i = 0; i < expressArray.length; i++) {
      if (expressArray[i] == '>') {
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) > getExpressValue(expressArray[++i]);
      } else if (expressArray[i] == '<') {
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) < getExpressValue(expressArray[++i]);
      } else if (expressArray[i] == '<=') {
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) <= getExpressValue(expressArray[++i]);
      } else if (expressArray[i] == '>=') {
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) >= getExpressValue(expressArray[++i]);
      } else expressArray[length++] = expressArray[i];
    }

    if (length == 1) return getExpressValue(expressArray[0]);
    expressArray.length = length; // == === != !==

    length = 0;

    for (i = 0; i < expressArray.length; i++) {
      if (expressArray[i] == '==') {
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) == getExpressValue(expressArray[++i]);
      } else if (expressArray[i] == '===') {
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) === getExpressValue(expressArray[++i]);
      } else if (expressArray[i] == '!=') {
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) != getExpressValue(expressArray[++i]);
      } else if (expressArray[i] == '!==') {
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) !== getExpressValue(expressArray[++i]);
      } else expressArray[length++] = expressArray[i];
    }

    if (length == 1) return getExpressValue(expressArray[0]);
    expressArray.length = length; // && ||

    length = 0;

    for (i = 0; i < expressArray.length; i++) {
      if (expressArray[i] == '&&') {
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) && getExpressValue(expressArray[1 + i]);
        i += 1;
      } else if (expressArray[i] == '||') {
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) || getExpressValue(expressArray[1 + i]);
        i += 1;
      } else expressArray[length++] = expressArray[i];
    }

    if (length == 1) return getExpressValue(expressArray[0]);
    expressArray.length = length; // ?:

    length = 0;

    for (i = 0; i < expressArray.length; i++) {
      if (expressArray[i] == '?') {
        expressArray[length - 1] = getExpressValue(expressArray[length - 1]) ? getExpressValue(expressArray[i + 1]) : getExpressValue(expressArray[i + 3]);
        i += 3;
      } else expressArray[length++] = expressArray[i];
    }

    if (length == 1) return getExpressValue(expressArray[0]);
    expressArray.length = length;
    throw new Error('Unrecognized expression : [' + expressArray.toString() + "]");
  }

  function calcValue$1 (target, expressArray, scope) {
    var value = expressArray[0] in scope ? scope[expressArray[0]] : target[expressArray[0]];

    for (var i = 1; i < expressArray.length; i++) {
      try {
        value = value[expressArray[i]];
      } catch (e) {
        console.error({
          target: target,
          scope: scope,
          expressArray: expressArray,
          index: i
        });
        throw e;
      }
    }

    return value;
  }

  var doit1 = function doit1(target, expressArray, scope) {
    // 先消小括号
    // 其实也就是归约小括号
    if (expressArray.indexOf('(') > -1) {
      var newExpressArray = [],
          temp = [],
          // 0表示还没有遇到左边的小括号
      // 1表示遇到了一个，以此类推，遇到一个右边的会减1
      flag = 0;

      for (var i = 0; i < expressArray.length; i++) {
        if (expressArray[i] == '(') {
          if (flag > 0) {
            // 说明这个应该是需要计算的括号里面的括号
            temp.push('(');
          }

          flag += 1;
        } else if (expressArray[i] == ')') {
          if (flag > 1) temp.push(')');
          flag -= 1; // 为0说明主的小括号归约结束了

          if (flag == 0) {
            var _value = evalValue(doit1(target, temp));

            newExpressArray.push(isString$1(_value) ? _value + '@string' : _value);
            temp = [];
          }
        } else {
          if (flag > 0) temp.push(expressArray[i]);else newExpressArray.push(expressArray[i]);
        }
      }

      expressArray = newExpressArray;
    } // 去掉小括号以后，调用中括号去掉方法


    return doit2(expressArray);
  }; // 中括号嵌套去掉方法


  var doit2 = function doit2(expressArray) {
    var hadMore = true;

    while (hadMore) {
      hadMore = false;
      var newExpressArray = [],
          temp = [],
          // 如果为true表示当前在试探寻找归约最小单元的结束
      flag = false; // 开始寻找里面需要归约的最小单元（也就是可以立刻获取值的）

      for (var i = 0; i < expressArray.length; i++) {
        // 这说明这是一个需要归约的
        // 不过不一定是最小单元
        // 遇到了，先记下了
        if (expressArray[i] == '[' && i != 0 && expressArray[i - 1] != ']') {
          if (flag) {
            // 如果之前已经遇到了，说明之前保存的是错误的，需要同步会主数组
            newExpressArray.push('[');

            for (var j = 0; j < temp.length; j++) {
              newExpressArray.push(temp[j]);
            }
          } else {
            // 如果之前没有遇到，修改标记即可
            flag = true;
          }

          temp = [];
        } // 如果遇到了结束，这说明当前暂存的就是最小归结单元
        // 计算后放回主数组
        else if (expressArray[i] == ']' && flag) {
            hadMore = true; // 计算

            var tempValue = evalValue(temp);
            var _value = newExpressArray[newExpressArray.length - 1][tempValue];
            newExpressArray[newExpressArray.length - 1] = isString$1(_value) ? _value + "@string" : _value; // 状态恢复

            flag = false;
          } else {
            if (flag) {
              temp.push(expressArray[i]);
            } else {
              newExpressArray.push(expressArray[i]);
            }
          }
      }

      expressArray = newExpressArray;
    }

    return expressArray;
  }; // 路径
  // ["[",express,"]","[",express"]","[",express,"]"]
  // 变成
  // [express][express][express]


  var doit3 = function doit3(expressArray) {
    var newExpressArray = [],
        temp = [];

    for (var i = 0; i < expressArray.length; i++) {
      if (expressArray[i] == '[') {
        temp = [];
      } else if (expressArray[i] == ']') {
        newExpressArray.push(evalValue(temp));
      } else {
        temp.push(expressArray[i]);
      }
    }

    return newExpressArray;
  }; // 获取路径数组(核心是归约的思想)


  function toPath(target, expressArray, scope) {
    var newExpressArray = doit1(target, expressArray); // 其实无法就三类
    // 第一类：[express][express][express]express
    // 第二类：express
    // 第三类：[express][express][express]

    var path; // 第二类

    if (newExpressArray[0] != '[') {
      path = [evalValue(newExpressArray)];
    } // 第三类
    else if (newExpressArray[newExpressArray.length - 1] == ']') {
        path = doit3(newExpressArray);
      } // 第一类
      else {
          var lastIndex = newExpressArray.lastIndexOf(']');
          var tempPath = doit3(newExpressArray.slice(0, lastIndex + 1));
          var tempArray = newExpressArray.slice(lastIndex + 1);
          tempArray.unshift(calcValue$1(target, tempPath, scope));
          path = [evalValue(tempArray)];
        }

    return path;
  }

  /*!
   * 🔪 - 设置或获取指定对象上字符串表达式对应的值
   * https://github.com/hai2007/algorithm.js/blob/master/value.js
   *
   * author hai2007 < https://hai2007.gitee.io/sweethome >
   *
   * Copyright (c) 2020-present hai2007 走一步，再走一步。
   * Released under the MIT license
   */
  /**
   * express举例子：
   *
   * [00]  ["a"].b[c]
   * [01]  a
   * [02]  [0]['value-index'][index+1]
   *
   * 如果是getValue,express还可以包含运算符：
   *  + - * / %  数值运算符
   *  && || !    逻辑运算符
   *
   * [03]  flag+10
   * [04]  a.b[index+1]-10
   * [05]  (a+b)/10-c[d]
   * [06]  [((a+b)-c)*f]+d
   *
   * [07]  !flag
   * [08]  (a>0 && b<=1) || !flag
   * [09]  '(flag)' == "("+temp+")"
   * [10]  a>10?"flag1":"flag2"
   *
   */
  // 解析一段表达式

  var evalExpress = function evalExpress(target, express, scope) {
    if (arguments.length < 3) scope = {};
    var expressArray = analyseExpress(target, express, scope);
    var path = toPath(target, expressArray, scope); // 如果不是表达式

    if (path.length > 1) throw new Error("Illegal expression : " + express + "\nstep='evalExpress',path=" + path + ",expressArray=" + expressArray);
    return path[0];
  }; // 获取

  var calcDeepValue = function calcDeepValue(oldValue, newValue, deep) {
    // 首先，参与动画,而且值不一样
    if (newValue.animation && oldValue.value != newValue.value) {
      // 1.先判断是否在组件中自定义了计算方法
      if (isFunction(newValue.animation)) {
        return {
          type: newValue.type,
          animation: true,
          value: newValue.animation(newValue.value, oldValue.value, deep)
        };
      } // 2.内置计算
      // 数字类型


      if (newValue.type == 'number') {
        return {
          type: newValue.type,
          animation: true,
          value: (newValue.value - oldValue.value) * deep + oldValue.value
        };
      }
    } // 其它情况原样返回


    return newValue;
  }; // 获取数据改变后deep对应的实时数据计算方法


  function calcDeepSeries (oldRenderSeries, newRenderSeries) {
    var linkIdToIndex = {}; // 收集组件id和index的映射

    for (var index = 0; index < oldRenderSeries.length; index++) {
      var subLinkIdToIndex = {}; // 收集子属性组件的id和index的映射

      for (var subIndex = 0; subIndex < oldRenderSeries[index].subAttr.length; subIndex++) {
        subLinkIdToIndex[oldRenderSeries[index].subAttr[subIndex].id] = subIndex;
      } // 收集完毕后，保存起来


      linkIdToIndex[oldRenderSeries[index].id] = {
        index: index,
        subLinkIdToIndex: subLinkIdToIndex
      };
    } // 返回一个可以根据当前deep获取当前实际组件的方法


    return function (deep) {
      // 如果deep=1直接返回新组件即可
      if (deep == 1) return newRenderSeries;
      var renderSeries = [];

      for (var i = 0; i < newRenderSeries.length; i++) {
        // 如果在旧的存在对照的
        if (newRenderSeries[i].id in linkIdToIndex) {
          // 对应的旧组件
          var oldSeries = oldRenderSeries[linkIdToIndex[newRenderSeries[i].id].index];
          var attr = {}; // 先计算属性

          for (var attrKey in oldSeries.attr) {
            attr[attrKey] = calcDeepValue(oldSeries.attr[attrKey], newRenderSeries[i].attr[attrKey], deep);
          }

          var subAttr = []; // 计算是子组件

          for (var j = 0; j < newRenderSeries[i].subAttr.length; j++) {
            if (newRenderSeries[i].subAttr[j].id in linkIdToIndex[newRenderSeries[i].id].subLinkIdToIndex) {
              // 对于的旧子属性组件
              var oldSubSeries = oldSeries.subAttr[linkIdToIndex[newRenderSeries[i].id].subLinkIdToIndex[newRenderSeries[i].subAttr[j].id]];
              var subSeriesAttr = {}; // 计算子组件属性

              for (var subSeriesAttrKey in oldSubSeries.attr) {
                subSeriesAttr[subSeriesAttrKey] = calcDeepValue(oldSubSeries.attr[subSeriesAttrKey], newRenderSeries[i].subAttr[j].attr[subSeriesAttrKey], deep);
              }

              subAttr.push({
                id: oldSubSeries.id,
                name: oldSubSeries.name,
                subText: oldSubSeries.subText,
                subAttr: [],
                attr: subSeriesAttr
              });
            } else {
              subAttr.push(newRenderSeries[i].subAttr[j]);
            }
          }

          renderSeries.push({
            id: newRenderSeries[i].id,
            name: newRenderSeries[i].name,
            subText: newRenderSeries[i].subText,
            subAttr: subAttr,
            attr: attr
          });
        } // 如果在旧的组件列表里面不存在对照
        else {
            if (newRenderSeries[i].animation == 'quick') {
              renderSeries.push(newRenderSeries[i]);
            }
          }
      }

      return renderSeries;
    };
  }

  function updateMixin(Clunch) {
    // 重新绘制画布
    Clunch.prototype.$$updateView = function () {
      var _this = this;

      // 如果没有挂载
      if (!this._isMounted || !this.__painter) return;
      this.$$lifecycle('beforeDraw'); // 清空区域信息

      this.__regionManager.erase(); // 清空画布


      this.__painter.clearRect();

      var _loop = function _loop(i) {
        var attr = {
          _subTexts: _this.__renderSeries[i].subText,
          _subAttr: []
        }; // 属性

        for (var attrKey in _this.__renderSeries[i].attr) {
          attr[attrKey] = _this.__renderSeries[i].attr[attrKey].value;
        } // 子组件


        for (var j = 0; j < _this.__renderSeries[i].subAttr.length; j++) {
          var subSeries = {
            series: _this.__renderSeries[i].subAttr[j].name,
            attr: {}
          }; // 子组件属性

          for (var subSeriesAttrKey in _this.__renderSeries[i].subAttr[j].attr) {
            subSeries.attr[subSeriesAttrKey] = _this.__renderSeries[i].subAttr[j].attr[subSeriesAttrKey].value;
          }

          attr._subAttr.push(subSeries);
        } // 绘制


        _this.__painter.config(initPainterConfig);

        _this.__defineSerirs[_this.__renderSeries[i].name].link.call(_this, _this.__painter, attr); // 记录区域


        var region = _this.__defineSerirs[_this.__renderSeries[i].name].region;

        if (region) {
          var _loop2 = function _loop2(regionName) {
            var that = _this;
            region[regionName].call(that, function (subName, data) {
              // 如果传递了子区域名称
              if (arguments.length > 0) subName = subName + ""; // 如果没有传递
              else subName = "default";
              return that.__regionManager.painter(i + "@" + regionName + "::" + subName, data);
            }, attr);
          };

          for (var regionName in region) {
            _loop2(regionName);
          }
        }
      };

      for (var i = 0; i < this.__renderSeries.length; i++) {
        _loop(i);
      } // 对于有的平台，最后特殊处理


      if (this._platform == 'uni-app') {
        this.__platform_painter.draw();

        if (this.__regionManager != null) {
          this.__regionManager.draw();
        }
      }

      this.$$lifecycle('drawed');
    }; // 画布大小改变的时候，更新


    Clunch.prototype.$$updateWithSize = function () {
      var _this2 = this;

      this.$$lifecycle('beforeResize');
      var width = this.__el.clientWidth - (getStyle(this.__el, 'padding-left') + "").replace('px', '') - (getStyle(this.__el, 'padding-right') + "").replace('px', '');
      var height = this.__el.clientHeight - (getStyle(this.__el, 'padding-top') + "").replace('px', '') - (getStyle(this.__el, 'padding-bottom') + "").replace('px', '');
      this._width = width;
      this._height = height;
      this._max = width > height ? width : height;
      this._min = width < height ? width : height;

      if (width == 0 || height == 0) {
        // 画布大小标记为0
        this.__canvas.style.width = "0px";
        this.__canvas.style.height = "0px"; // 提前结束更新

        this.$$lifecycle('resized');
        return;
      } // 更新画布


      this.__painter = painter(this._platform, this.__canvas, width, height); // 重置区域

      this.__regionManager.updateSize(width, height);

      if (isFunction(this.__observeWatcher.stop)) {
        this.__observeWatcher.stop();

        this.__observeWatcher.stop = null;
      }

      setTimeout(function () {
        // 重新计算
        _this2.$$updateWithData(true);

        _this2.$$lifecycle('resized');
      }, 10);
    }; // 数据改变的时候，需要重新计算需要绘制的具体图形


    Clunch.prototype.$$updateWithData = function (noAnimation) {
      var _this3 = this;

      // 准备计算前一些初始化判断
      if (isFunction(this.__observeWatcher.stop)) {
        this.__observeWatcher.stop();

        this.__observeWatcher.stop = null;
      } // 如果上次数据改变没有结束，这次不应该触发数据改变前钩子
      else {
          this.$$lifecycle('beforeUpdate');
        } // 记录事件
      // 这样监听到canvas画布上事件的时候就知道如何触发更具体的事件


      this.__events = {
        click: {},
        dblclick: {},
        mousemove: {},
        mousedown: {},
        mouseup: {}
      };
      var renderSeries = [],
          that = this;

      (function doit(renderAOP, pScope, isSubAttrs, pid, ignoreFor) {
        // 如果当前计算的是某个父组件的子属性组件，应该返回
        var subRenderSeries = [];

        for (var i = 0; i < renderAOP.length; i++) {
          // 继承scope
          for (var scopeKey in pScope) {
            renderAOP[i].scope[scopeKey] = pScope[scopeKey];
          } // id可以采用默认的计算机制，也可以由用户自定义


          var id = void 0;

          if ('_id' in renderAOP[i]) {
            id = renderAOP[i]._id.isBind ? evalExpress(that, renderAOP[i]._id.express, renderAOP[i].scope) : renderAOP[i]._id.express;
          } else {
            id = pid + renderAOP[i].index;
          } // _animation用于设置组件参与动画的方式


          var animationHow = void 0;

          if ('_animation' in renderAOP[i]) {
            animationHow = renderAOP[i]._animation.isBind ? evalExpress(that, renderAOP[i]._animation.express, renderAOP[i].scope) : renderAOP[i]._animation.express;
          } else {
            animationHow = 'lazy';
          } // c-for指令
          // 由于此指令修改局部scope，因此优先级必须最高


          if (!ignoreFor && 'c-for' in renderAOP[i]) {
            var cFor = renderAOP[i]['c-for'];
            var data_for = void 0;

            if (isArray(cFor.data)) {
              data_for = cFor.data;
            } else {
              data_for = evalExpress(that, cFor.data, renderAOP[i].scope);

              if (isNumber(data_for)) {
                var len = data_for;
                data_for = [];

                for (var k = 0; k < len; k++) {
                  data_for.push(k);
                }
              }
            }

            for (var forKey in data_for) {
              renderAOP[i].scope[cFor.value] = data_for[forKey];
              if (cFor.key != null) renderAOP[i].scope[cFor.key] = isArray(data_for) ? +forKey : forKey;
              var temp = doit([renderAOP[i]], {}, isSubAttrs, id + "for" + forKey + "-", true);

              if (isSubAttrs) {
                for (var j = 0; j < temp.length; j++) {
                  subRenderSeries.push(temp[j]);
                }
              }
            }

            continue;
          } // c-if


          if ('c-if' in renderAOP[i] && !evalExpress(that, renderAOP[i]['c-if'], renderAOP[i].scope)) ; else {
            // 计算子组件
            doit(renderAOP[i].children, renderAOP[i].scope, false, id + "-", false); // group只是包裹，因此，组件本身不需要被统计

            if (renderAOP[i].name != 'group') {
              var seriesItem = {
                name: renderAOP[i].name,
                attr: {},
                subAttr: [],
                subText: renderAOP[i].text,
                id: id,
                animation: animationHow
              }; // 计算属性

              for (var attrKey in renderAOP[i].attrs) {
                var oralAttrValue = renderAOP[i].attrs[attrKey];
                seriesItem.attr[attrKey] = {
                  animation: oralAttrValue.animation,
                  type: oralAttrValue.type,
                  // 这里是根据是通过双向绑定还是写死的来区分
                  value: oralAttrValue.value.isBind ? evalExpress(that, oralAttrValue.value.express, renderAOP[i].scope) : oralAttrValue.value.express
                };
              } // 计算子属性组件


              seriesItem.subAttr = doit(renderAOP[i].subAttrs, renderAOP[i].scope, true, id + "-", false); // 登记事件

              for (var _j = 0; _j < renderAOP[i].events.length; _j++) {
                var event = renderAOP[i].events[_j];
                that.__events[event.event][renderSeries.length + "@" + event.region] = that[event.method];
              } // 计算完毕以后，根据情况存放好


              if (isSubAttrs) subRenderSeries.push(seriesItem);else renderSeries.push(seriesItem);
            }
          }
        }

        return subRenderSeries;
      })( // 分别表示：当前需要计算的AOP数组、父scope、是否是每个组件的子组件、父ID
      this.__renderAOP, {}, false, "", false); // 如果没有前置数据，根本不需要动画效果


      if (!this.__renderSeries || noAnimation || !this.__animation) {
        this.__renderSeries = renderSeries;
        this.$$updateView();
        this.$$lifecycle('updated');
        return;
      }

      var calcDeepSeriesFun = calcDeepSeries(this.__renderSeries, renderSeries); // 数据改变动画

      this.__observeWatcher.stop = animation(function (deep) {
        _this3.__renderSeries = calcDeepSeriesFun(deep);

        _this3.$$updateView();
      }, this.__observeWatcher.time, function (deep) {
        if (deep == 1) {
          // 说明动画进行完毕以后停止的，我们需要触发'更新完毕'钩子
          _this3.__observeWatcher.stop = null;

          _this3.$$lifecycle('updated');
        }
      });
    };
  }

  // 监听数据改变
  function watcher (that) {
    var _loop = function _loop(key) {
      var value = that.__data[key];
      that[key] = value; // 针对data进行拦截，后续对data的数据添加不会自动监听了
      // this.__data的数据是初始化以后的，后续保持不变，方便组件被重新使用（可能的设计，当前预留一些余地）
      // 当前对象数据会和方法一样直接挂载在根节点

      Object.defineProperty(that, key, {
        get: function get() {
          return value;
        },
        set: function set(newValue) {
          value = newValue;

          if (!that.__observeWatcher.flag) {
            setTimeout(function () {
              // 数据改变，触发更新
              that.$$updateWithData();
              that.__observeWatcher.flag = false;
            }, 0);
          } // 如果在一次数据改变中，已经有了前置的数据改变，当前的就可以忽略处理了
          // （延迟0秒可以推迟到本次修改全部执行完毕再进行）


          that.__observeWatcher.flag = true;
        }
      });
    };

    for (var key in that.__data) {
      _loop(key);
    }
  }

  function Clunch(options) {
    if (!(this instanceof Clunch)) {
      // 必须使用 ```new Clunch()``` 的方式创建对象
      console.error('Clunch is a constructor and should be called with the `new` keyword');
      return;
    } // 对生命周期钩子进行预处理


    ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUnmount', 'unmounted', 'beforeUpdate', 'updated', 'beforeResize', 'resized', 'beforeDestroy', 'destroyed'].forEach(function (item) {
      if (isArray(options[item])) {
        options[item] = serviceFactory(options[item]);
      }
    });
    this.$$lifecycle(options.beforeCreate); // 创建对象

    this.$$init(options); // 对象创建好了以后，启动监听

    /**
     * 由于wactch监听的源头来自options
     * 如果监听在钩子created之后进行
     * 会导致此钩子设置的数据可能被监听函数忽略
     * 因此，我们这里就提前了此操作
     * 避免出现意料之外的错误
     */

    watcher(this);
    this.$$lifecycle('created'); // 挂载

    this.$mount(options.el);
  } // 在对象上挂载最基础的一些功能


  initMixin(Clunch);
  lifecycleMixin(Clunch);
  updateMixin(Clunch); // 初始化方法
  // （主要是内部使用，和创建的对象无关的初始化）
  // 需要特别注意的是，原型上的东西会在所有对象上面共享
  // 记录挂载的组件

  Clunch.prototype.__defineSerirs = {};

  // 监听画布大小改变

  /**
   * 设计思路如下：
   * （这是监听对象ResizeObserver生效的情况，不生效的话，只初始化主动刷新一次）
   *
   * 遇到画布大小在改变
   * 1.如果有前置任务，就直接记录，说明当前画布在改变
   * 2.如果没有前置任务，就延迟执行，执行前判断当前画布是否在改变，如果在改变，延迟再判断，否则立刻更新
   */
  function resize (that) {
    try {
      that.__observeResize.observer = new ResizeObserver(function () {
        // 如果前置任务都完成了
        if (!that.__observeResize.flag) {
          that.__observeResize.flag = true; // 既然前置任务已经没有了，那么就可以更新了？
          // 不是的，可能非常短的时间里，后续有改变
          // 因此延迟一点点来看看后续有没有改变
          // 如果改变了，就再延迟看看

          var interval = setInterval(function () {
            // 判断当前是否可以立刻更新
            if (that.__observeResize.help) {
              clearInterval(interval);
              that.__observeResize.flag = false;
              that.$$updateWithSize();
            }

            that.__observeResize.help = true;
          }, 200);
        } else {
          that.__observeResize.help = false;
        }
      }); // 监听

      that.__observeResize.observer.observe(that.__el);
    } catch (e) {
      that.$$updateWithSize(); // 如果浏览器不支持此接口

      console.error('ResizeObserver undefined!');
    }
  }

  function compileSeries (series) {
    var temp = serviceFactory(series); // 校对属性

    for (var key in temp.attrs) {
      if (isFunction(temp.attrs[key])) {
        // 默认数据改变不启用动画
        temp.attrs[key] = temp.attrs[key](false);
      }
    } // 校对子属性


    for (var subSeriesName in temp.subAttrs) {
      for (var _key in temp.subAttrs[subSeriesName]) {
        if (isFunction(temp.subAttrs[subSeriesName][_key])) {
          temp.subAttrs[subSeriesName][_key] = temp.subAttrs[subSeriesName][_key](false);
        }
      }
    }

    return temp;
  }

  function initGlobal(Clunch) {
    // 组件图形复用
    Clunch.prototype.$reuseSeriesLink = function (seriesName, _attrs) {
      // 画笔配置重置，防止副作用
      this.__painter.config(initPainterConfig); // 获取需要复用的组件实体


      var reuseSeries = this.__defineSerirs[seriesName];
      var attrs = {
        _subAttr: [],
        _subTexts: "texts" in _attrs ? _attrs.texts : []
      }; // 先是属性

      for (var attrKey in reuseSeries.attrs) {
        if (attrKey in _attrs.attr) {
          attrs[attrKey] = _attrs.attr[attrKey];
        } else {
          attrs[attrKey] = reuseSeries.attrs[attrKey]["default"];
        }
      }

      if ("subSeries" in _attrs) {
        for (var i = 0; i < _attrs.subSeries.length; i++) {
          var _subSeries = _attrs.subSeries[i];
          var _subReuesSeriesAttr = reuseSeries.subAttrs[_subSeries.name];
          var subSeries = {
            series: _subSeries.name,
            attr: {}
          }; // 然后是子属性

          for (var subAttrKey in _subSeries.attr) {
            if (subAttrKey in _subSeries.attr) {
              subSeries.attr[subAttrKey] = _subSeries.attr[subAttrKey];
            } else {
              subSeries.attr[subAttrKey] = _subReuesSeriesAttr[subAttrKey]["default"];
            }
          }

          attrs._subAttr.push(subSeries);
        }
      }

      reuseSeries.link.call(this, this.__painter, attrs);
    };
  }

  function initGlobalApi (Clunch) {
    initGlobal(Clunch); // 挂载小组件

    Clunch.series = function (name, series) {
      // 如果传递的是json的方式
      if (arguments.length == 1) {
        for (var key in name) {
          Clunch.series(key, name[key]);
        }
      } // 挂载
      else {
          // 如果已经挂载了，需要警告提供
          if (isFunction(Clunch.prototype.__defineSerirs[name])) {
            console.warn('The series[' + name + '] has been registered!');
          } // 编译后挂载


          Clunch.prototype.__defineSerirs[name] = compileSeries(series);
        }

      return Clunch;
    };
  }

  initGlobalApi(Clunch); // 挂载的意思是Clunch对象和页面关联起来
  // 这样挂载了，才会真的绘制

  Clunch.prototype.$mount = function (el) {
    var _this = this;

    if (this._isDestroyed) {
      // 已经销毁的组件不能重新挂载
      console.warn('The clunch has been destroyed!');
      return this;
    }

    if (this._isMounted) {
      // 已经挂载的组件需要主动解挂后才能再次进行挂载
      console.warn('The clunch is already mounted!');
      return;
    }

    if (this._platform == 'default' && !isElement(el)) {
      // 如果挂载结点不正确，自然不能挂载
      console.warn('Mount node does not exist!');
      return this;
    }

    this.$$lifecycle('beforeMount'); // 如果我们没有在初始化对象的时候传递render（template也算传递了）
    // 那么我们在每次挂载的时候都会使用挂载地的内容进行组合

    if (!this.__renderFlag) {
      this.__renderOptions = this.$$templateCompiler(el.innerHTML);
      this.__renderAOP = aopRender(this.__renderOptions, this.__defineSerirs);
    } // 一切正确以后，记录新的挂载结点


    this.__el = el; // 默认是web平台

    if (this._platform == 'default') {
      // 初始化添加画布
      el.innerHTML = '<canvas>非常抱歉，您的浏览器不支持canvas!</canvas>';
      this.__canvas = el.getElementsByTagName('canvas')[0]; // 挂载后以后，启动画布大小监听

      resize(this);
    } // 触发数据改变更新


    this.$$updateWithData(); // 记录事件

    this.__events_platform = {
      "click": [],
      "dblclick": [],
      "mousemove": [],
      "mousedown": [],
      "mouseup": []
    }; // 添加区域交互

    ['click', 'dblclick', 'mousemove', 'mousedown', 'mouseup'].forEach(function (eventName) {
      var eventHandler = function eventHandler(event) {
        _this.__regionManager.getRegion(event, function (region) {
          if (region[0] != null) {
            var regionSplit = region[0].split('::');
            var doback = _this.__events[eventName][regionSplit[0]];

            if (isFunction(doback)) {
              var regionNameSplit = regionSplit[0].split('@');
              var curSeires = _this.__renderSeries[regionNameSplit[0]]; // 整理属性信息

              var attr = {};

              for (var attrKey in curSeires.attr) {
                attr[attrKey] = curSeires.attr[attrKey].value;
              } // 调用回调


              doback.call(_this, {
                id: curSeires.id,
                series: curSeires.name,
                region: regionNameSplit[1],
                subRegion: regionSplit[1],
                attr: attr,
                left: region[1],
                top: region[2],
                data: region[3]
              });
            }
          }
        });
      };

      if (_this._platform == 'default') {
        bind(_this.__canvas, eventName, eventHandler);
      } else {
        _this.__events_platform[eventName].push(eventHandler);
      }
    }); // 这里的回调函数doback和上面区域事件回调保持一致

    this.$bind = function (eventName, doback) {
      var _this2 = this;

      var eventHandler = function eventHandler(event) {
        _this2.__regionManager.getRegion(event, function (region) {
          var callbackValue;

          if (region[0] != null) {
            var regionSplit = region[0].split('::');
            var regionNameSplit = regionSplit[0].split('@');
            var curSeires = _this2.__renderSeries[regionNameSplit[0]]; // 整理属性信息

            var attr = {};

            for (var attrKey in curSeires.attr) {
              attr[attrKey] = curSeires.attr[attrKey].value;
            }

            callbackValue = {
              id: curSeires.id,
              series: curSeires.name,
              region: regionNameSplit[1],
              subRegion: regionSplit[1],
              attr: attr,
              left: region[1],
              top: region[2],
              data: region[3]
            };
          } else {
            callbackValue = {
              series: null,
              region: null,
              subRegion: null,
              attr: {},
              left: -1,
              top: -1,
              data: null
            };
          }

          callbackValue.left = region[1];
          callbackValue.top = region[2];
          doback.call(_this2, callbackValue);
        });
      };

      if (this._platform == 'default') {
        bind(this.__canvas, eventName, eventHandler);
      } else {
        if (!(eventName in this.__events_platform)) this.__events_platform[eventName] = [];

        this.__events_platform[eventName].push(eventHandler);
      }

      return this;
    }; // 挂载完毕以后，同步标志


    this._isMounted = true;
    this.$$lifecycle('mounted'); // 非web平台，需要特殊处理

    if (this._platform != 'default') {
      this.__painter = painter(this._platform, el, el.width, el.height);
      this.__platform_painter = el.painter;
      this.$resize(el.width, el.height);
    }

    return this;
  }; // 解挂的意思是Clunch对象和页面解除关联
  // 后续绘制会停止，不过计算不会
  // 你可以重新挂载


  Clunch.prototype.$unmount = function () {
    if (this._isDestroyed) {
      console.warn('The object has been destroyed!');
      return this;
    }

    if (!this._isMounted) {
      console.warn('Object not mounted!');
      return this;
    }

    this.$$lifecycle('beforeUnmount'); // 解除对画布大小改变的监听

    this.__observeResize.observer.disconnect(); // 释放资源


    this.__painter = null;
    this.__canvas = null;
    this._isMounted = false;
    this.$$lifecycle('unmounted');
    return this;
  }; // 彻底销毁资源，无法再重新挂载
  // 主要是为了释放一些内置资源


  Clunch.prototype.$destroy = function () {
    if (this._isDestroyed) {
      console.warn('The object has been destroyed!');
      return this;
    } // 先解除绑定


    if (this._isMounted) this.$unmount();
    this.$$lifecycle('beforeDestroy'); // 释放资源

    delete this.__regionManager;
    this.__observeResize = {};
    this.__observeWatcher = {};
    this._isDestroyed = true;
    this.$$lifecycle('destroyed');
    return this;
  };

  Clunch.prototype.$resize = function (width, height) {
    if (this._isMounted || this._platform != 'default') {
      if (this._platform != 'default') {
        if (!isNumber(width)) {
          console.warn('The width undefined!');
          return this;
        }

        if (!isNumber(height)) {
          console.warn('The height undefined!');
          return this;
        }

        this.$$lifecycle('beforeResize');
        this._width = width;
        this._height = height;
        this._max = width > height ? width : height;
        this._min = width < height ? width : height; // 更新区域大小

        if (this.__regionManager != null) {
          this.__regionManager.updateSize(width, height);
        }

        this.$$updateWithData(true);
        this.$$lifecycle('resized');
      } else {
        this.$$updateWithSize();
      }
    } else {
      // 如果组件未挂载，无法更新大小
      console.warn('The clunch not mounted!');
    }

    return this;
  };
  /**
   *
   * >>> 总入口 <<<
   *
   * -------------------------------
   *
   * 【特别说明】
   *
   * 对于this.XXX的属性或方法，有如下规定：
   *  _ 和 __ 开头的表示资源，前者表示外界可以查看作为判断依据的（但不可以修改），后者为完全内部使用
   *  $ 和 $$ 开头的表示函数，前者表示外界可以调用的，后者表示内部使用
   *
   * 此外，对外暴露的方法的参数，如果是 __ 开头的，表示外部调用的时候应该忽略此参数
   *
   * -------------------------------
   *
   */
  // 添加特殊的分组组件


  Clunch.series('group', [function () {
    return {
      attrs: {}
    };
  }]);

  function analyseTag (attrString) {
    var attr = {},
        index = 0;
    attrString = attrString.trim();

    var getOneAttr = function getOneAttr() {
      // 属性名和属性值
      var attrName = "",
          attrValue = ""; // 先寻找属性名

      for (; index < attrString.length; index++) {
        // 寻找属性名的时候遇到空白或结尾的时候，肯定没有属性值
        if ($RegExp.blanksReg.test(attrString[index]) || index == attrString.length - 1) {
          attrName += attrString[index]; // 如果属性名是空白，就不需要记录了

          if (!$RegExp.blanksReg.test(attrName)) {
            attr[attrName.trim()] = "";
          }

          index += 1;
          break;
        } // 如果遇到等号，说明属性名寻找结束了
        else if (attrString[index] == '=') {
            // 接着寻找属性值
            index += 1; // 由于属性可能由引号包裹或直接暴露

            var preCode = null,
                preLeng = -1; // 如果是由'或者"包裹

            if (attrString.substr(index, 1) == '"' || attrString.substr(index, 1) == "'") {
              preCode = attrString.substr(index, 1);
              preLeng = 1;
              index += 1;
            } // 如果是由\'或\"包裹
            else if (attrString.substr(index, 2) == '\"' || attrString.substr(index, 2) == "\'") {
                preCode = attrString.substr(index, 2);
                preLeng = 2;
                index += 2;
              } // 开始正式寻找属性值
            // 如果没有包裹，是直接暴露在外面的
            // 我们寻找到空格或结尾即可


            if (preCode !== null) {
              for (; index < attrString.length; index++) {
                if (attrString.substr(index, preLeng) == preCode) {
                  attr[attrName.trim()] = attrValue.trim();
                  index += 2;
                  break;
                } else {
                  attrValue += attrString[index];
                }
              }
            } // 如果是包裹的
            // 我们确定寻找到对应的包裹闭合即可
            else {
                for (; index < attrString.length; index++) {
                  if ($RegExp.blanksReg.test(attrString[index])) {
                    attr[attrName.trim()] = attrValue.trim();
                    index += 1;
                    break;
                  } else {
                    attrValue += attrString[index];
                  }
                }
              }

            break;
          } else {
            attrName += attrString[index];
          }
      } // 如果还有字符串，继续解析


      if (index < attrString.length) {
        getOneAttr();
      }
    };

    getOneAttr();
    return attr;
  }

  function nextTagFun (template) {
    var i = -1,
        // 当前面对的字符
    currentChar = null; // 如果前面是获取的js或css，还有pre等开始标签，比较特殊，直接寻址闭合的

    var preIsSpecial = false,
        specialCode = "";
    var specialTag = ['script', 'pre', 'style', 'code']; // 获取下一个字符

    var next = function next() {
      currentChar = i++ < template.length - 1 ? template[i] : null;
      return currentChar;
    }; // 获取往后n个值


    var nextNValue = function nextNValue(n) {
      return template.substring(i, n + i > template.length ? template.length : n + i);
    };

    next(); // 剔除开头的空白

    while ($RegExp.blankReg.test(currentChar) && i < template.length - 1) {
      next();
    }
    /**
     * 一个Tag存在哪些类型？如下：
     * 1.<tag-name>       { tagName:'tag-name', type:'beginTag', attrs:{} }      开始标签
     * 2.</tag-name>      { tagName:'tag-name', type:'endTag'   }                结束标签
     * 3.<tag-name />     { tagName:'tag-name', type:'fullTag',  attrs:{} }      自闭合标签
     * 4.text             { tagName:'text',     type:'textcode' }                文本结点
     * 5.<!-- text -->    { tagName:'text',     type:'comment'  }                注释
     * 6.<!DOCTYPE text>  { tagName:'text',     type:'DOCTYPE'  }                声明
     *
     *
     */


    return function () {
      var tag = currentChar,
          tagObj = {};
      if (tag == null) return null;
      /**
       * 特殊标签内容获取
       * ========================================
       */
      // 如果是获取特殊标签里面的内容
      // 先不考虑里面包含'</XXX>'

      if (preIsSpecial) {
        tagObj.type = 'textcode';
        tagObj.tagName = tag;

        while (nextNValue(specialCode.length + 3) != '</' + specialCode + '>' && i < template.length) {
          tagObj.tagName += next();
        }

        tagObj.tagName = tagObj.tagName.replace(/<$/, '');
        preIsSpecial = false;
        return tagObj;
      }
      /**
       * 特殊标签获取
       * ========================================
       */
      // 针对特殊的comment


      if (nextNValue(4) == '<!--') {
        tagObj.type = 'comment';
        tagObj.tagName = tag;

        while (nextNValue(3) != '-->' && i < template.length) {
          tagObj.tagName += next();
        }

        next();
        next();
        next();
        tagObj.tagName = tagObj.tagName.replace(/^<!--/, '').replace(/-$/, '');
        return tagObj;
      } // 针对特殊的doctype


      if (nextNValue(9) == '<!DOCTYPE') {
        tagObj.type = 'DOCTYPE';
        tagObj.tagName = tag;

        while (nextNValue(1) != '>' && i < template.length) {
          tagObj.tagName += next();
        }

        next();
        tagObj.tagName = tagObj.tagName.replace(/^<!DOCTYPE/, '').replace(/>$/, '');
        return tagObj;
      }
      /**
       * 普通的
       * ========================================
       */
      // 如果是期望归结非文本结点
      else if (tag == '<') {
          // 标记是否处于属性值是字符串包裹中
          var isAttrString = false,
              attrLeftValue = null,
              attrLeftLen = null; // 如果在包裹中或者没有遇到‘>’说明没有结束

          while ((isAttrString || currentChar != '>') && i < template.length) {
            tag += next(); // 如果是包裹里面，试探是否即将遇到了结束

            if (isAttrString) {
              var next23Value = nextNValue(attrLeftLen + 1).substring(1);

              if (next23Value == attrLeftValue) {
                isAttrString = false;
              }
            } // 如果在包裹外面，试探是否即将进入包裹
            else {
                var next23Value = nextNValue(2);

                if (next23Value == '="' || next23Value == "='") {
                  attrLeftValue = next23Value.replace('=', '');
                  attrLeftLen = 1;
                  isAttrString = true;
                }

                next23Value = nextNValue(3);

                if (next23Value == '=\"' || next23Value == "=\'") {
                  attrLeftValue = next23Value.replace('=', '');
                  attrLeftLen = 2;
                  isAttrString = true;
                }
              }
          } // 针对特殊的结束标签


          if (/^<\//.test(tag)) {
            tagObj.tagName = tag.replace(/^<\//, '').replace(/>$/, '');
            tagObj.type = 'endTag';
          } else {
            if (/\/>$/.test(tag)) {
              tagObj.type = 'fullTag';
              tag = tag.replace(/\/>$/, '');
            } else {
              tagObj.type = 'beginTag';
              tag = tag.replace(/>$/, '');
            }

            tag = tag.replace(/^</, '');
            tagObj.tagName = "";
            var j = 0;

            for (; j < tag.length; j++) {
              if (tag[j] == ' ') break;
              tagObj.tagName += tag[j];
            }

            var attrString = tag.substring(j);

            if ($RegExp.blanksReg.test(attrString)) {
              tagObj.attrs = {};
            } else {
              tagObj.attrs = analyseTag(attrString);
            }
          }
        } // 如果是归结文本结点
        // 如果文本中包含<的先忽略考虑
        else {
            tagObj.type = 'textcode';
            tagObj.tagName = currentChar;

            while (nextNValue(1) != '<' && i < template.length) {
              tagObj.tagName += next();
            }

            tagObj.tagName = tagObj.tagName.replace(/<$/, '');
            i -= 1;
          } // 如果遇到开始script或者style、pre等特殊标签，标记开始获取特殊文本


      if (tagObj.type == 'beginTag') {
        if (specialTag.indexOf(tagObj.tagName.toLowerCase()) > -1) {
          preIsSpecial = true;
          specialCode = tagObj.tagName;
        }
      } // 如果遇到结束script或者style、pre等特殊标签，标记结束获取特殊文本
      else if (tagObj.type == 'endTag') {
          if (specialTag.indexOf(tagObj.tagName.toLowerCase()) > -1) {
            preIsSpecial = false;
          }
        }

      next();
      return tagObj;
    };
  }

  // 分析deep
  // 我们会在这里校对那些没有结束标签的开始标签
  // 这步结束以后，每个都是一个单独的标签
  // 也就是不用再区分开始或闭合了
  function analyseDeep (tagArray) {
    // 闭合标签
    tagArray = closeTag(tagArray);
    var deep = 0,
        tagDeepArray = [];
    tagArray.forEach(function (tag) {
      if (tag.type == 'beginTag') {
        tagDeepArray.push({
          type: "tag",
          name: tag.tagName,
          attrs: tag.attrs,
          __deep__: ++deep,
          __tagType__: "double"
        });
      } else if (tag.type == 'endTag') {
        deep -= 1;
      } else if (tag.type == 'textcode') {
        // 如果是文本
        tagDeepArray.push({
          type: "text",
          content: tag.tagName,
          __deep__: deep + 1
        });
      } else if (tag.type == 'comment') {
        // 如果是注释
        tagDeepArray.push({
          type: "comment",
          content: tag.tagName,
          __deep__: deep + 1
        });
      } else {
        // 如果是自闭合结点
        tagDeepArray.push({
          type: "tag",
          name: tag.tagName,
          attrs: tag.attrs,
          __deep__: deep + 1,
          __tagType__: "single"
        });
      }
    });
    return tagDeepArray;
  }

  var closeTag = function closeTag(tagArray) {
    var needClose = [];
    tagArray.forEach(function (tag, i) {
      if (tag.type == 'beginTag') {
        needClose.push([i, tag.tagName]);
      } else if (tag.type == 'endTag') {
        while (needClose.length > 0) {
          var needCloseTag = needClose.pop();

          if (needCloseTag[1] == tag.tagName) {
            break;
          } else {
            tagArray[needCloseTag[0]].type = 'fullTag';
          }
        }
      }
    });
    return tagArray;
  };

  /*!
   * 🔪 - 解析xhtml为json对象返回
   * https://github.com/hai2007/algorithm.js/blob/master/xhtmlToJson.js
   *
   * author hai2007 < https://hai2007.gitee.io/sweethome >
   *
   * Copyright (c) 2020-present hai2007 走一步，再走一步。
   * Released under the MIT license
   */
  // noIgnore为true表示不忽略任何标签

  function xhtmlToJson (template, noIgnore) {
    if (!isString$1(template)) throw new Error("Template must be a String!"); // 获取读取下一个标签对象

    var nextTag = nextTagFun(template.trim());
    var tag = nextTag(),
        DomTree = [];

    while (tag != null) {
      if (tag.type == 'textcode' && $RegExp.blanksReg.test(tag.tagName)) ; else if (tag.type == 'DOCTYPE') ; else if (tag.type == 'comment') {
        // 注释目前也默认过滤掉，除非显示声明不忽略
        if (noIgnore) {
          DomTree.push(tag);
        }
      } else {
        DomTree.push(tag);
      }

      tag = nextTag();
    } // 分析层次


    DomTree = analyseDeep(DomTree);
    /**
     * 模仿浏览器构建的一棵树,每个结点有如下属性：
     *
     * 1.parentNode index  父结点
     * 2.childNodes []     孩子结点
     * 3.preNode    index  前一个兄弟结点
     * 4.nextNode   index  后一个兄弟结点
     *
     * 5.attrs:{}          当前结点的属性
     * 6.name              节点名称
     * 7.type              节点类型（tag和text）
     * 8.content           文本结点内容
     *
     * 需要注意的是：如果一个文本结点内容只包含回车，tab，空格等空白字符，会直接被忽视
     */

    var presNode = [null],
        preDeep = 0;

    for (var i = 0; i < DomTree.length; i++) {
      // 当前结点
      var currentIndex = i,
          currentDeep = DomTree[i].__deep__;
      DomTree[i].childNodes = [];
      DomTree[i].preNode = null;
      DomTree[i].nextNode = null; // 前置三个结点

      var lastPre = presNode[presNode.length - 1];
      var last2Pre = presNode.length > 1 ? presNode[presNode.length - 2] : null; // 如果遇到的是兄弟结点

      if (currentDeep == preDeep) {
        // 修改兄弟关系
        DomTree[currentIndex].preNode = lastPre;
        DomTree[lastPre].nextNode = currentIndex; // 修改父子关系

        DomTree[currentIndex].parentNode = last2Pre;
        DomTree[last2Pre].childNodes.push(currentIndex); // 校对presNode

        presNode[presNode.length - 1] = currentIndex;
      } // 如果是遇到了孩子
      else if (currentDeep > preDeep) {
          // 修改兄弟关系
          // todo
          // 修改父子关系
          DomTree[currentIndex].parentNode = lastPre;
          if (lastPre != null) DomTree[lastPre].childNodes.push(currentIndex); // 校对presNode

          presNode.push(currentIndex);
        } // 如果是遇到了祖先
        else {
            var preTempIndex = presNode[presNode.length - 1 - (preDeep - currentDeep)];
            var preTemp2Index = presNode[presNode.length - 2 - (preDeep - currentDeep)]; // 修改兄弟关系

            DomTree[currentIndex].preNode = preTempIndex;
            if (preTempIndex != null) DomTree[preTempIndex].nextNode = currentIndex; // 修改父子关系

            DomTree[currentIndex].parentNode = preTemp2Index;
            if (preTemp2Index != null) DomTree[preTemp2Index].childNodes.push(currentIndex); // 校对presNode

            for (var j = 0; j < preDeep - currentDeep; j++) {
              presNode.pop();
            }

            presNode[presNode.length - 1] = currentIndex;
          }

      preDeep = currentDeep;
    }

    return DomTree;
  }

  // (render生成器)

  function compileTemplate (template) {
    var xhtmlJson = xhtmlToJson("<clunch>" + template + "</clunch>");
    return function doit(pNode) {
      var temp = [];

      for (var i = 0; i < pNode.childNodes.length; i++) {
        var node = xhtmlJson[pNode.childNodes[i]];

        if (node.type == 'tag') {
          temp.push({
            name: node.name,
            attrs: node.attrs,
            children: doit(node)
          });
        } else {
          temp.push(node.content.trim());
        }
      }

      return temp;
    }(xhtmlJson[0]);
  }

  var arc$1 = ['number', "json", "string", "color", function ($number, $json, $string, $color) {
    return {
      attrs: {
        'fill-color': $color('black'),
        'stroke-color': $color('black'),
        'line-width': $number(1)(true),
        dash: $json([]),
        type: $string('fill'),
        cx: $number()(true),
        cy: $number()(true),
        radius1: $number()(true),
        radius2: $number()(true),
        begin: $number(0)(true),
        deg: $number()(true)
      },
      region: {
        "default": function _default(render, attr) {
          render().config({
            "lineWidth": attr['line-width'],
            "lineDash": attr.dash
          })[attr.type + "Arc"](attr.cx, attr.cy, attr.radius1, attr.radius2, attr.begin, attr.deg);
        }
      },
      link: function link(painter, attr) {
        // 配置画笔
        painter.config({
          "fillStyle": attr['fill-color'],
          "strokeStyle": attr['stroke-color'],
          "lineWidth": attr['line-width'],
          "lineDash": attr.dash
        });
        var type = attr.type;

        if (isFunction(painter[type + "Arc"])) {
          // 绘制
          painter[type + "Arc"](attr.cx, attr.cy, attr.radius1, attr.radius2, attr.begin, attr.deg);
        } else {
          // 错误提示
          throw new Error('Type error!' + JSON.stringify({
            series: "arc",
            type: type
          }));
        }
      }
    };
  }];

  var circle = ['number', "json", "string", 'color', function ($number, $json, $string, $color) {
    return {
      attrs: {
        'fill-color': $color('black'),
        'stroke-color': $color('black'),
        'line-width': $number(1),
        dash: $json([]),
        type: $string('fill'),
        cx: $number()(true),
        cy: $number()(true),
        radius: $number()(true)
      },
      region: {
        "default": function _default(render, attr) {
          render().config({
            "lineWidth": attr['line-width'],
            "lineDash": attr.dash
          })[attr.type + "Circle"](attr.cx, attr.cy, attr.radius);
        }
      },
      link: function link(painter, attr) {
        painter.config({
          "fillStyle": attr["fill-color"],
          "strokeStyle": attr["stroke-color"],
          "lineWidth": attr["line-width"],
          "lineDash": attr.dash
        });
        var type = attr.type;

        if (isFunction(painter[type + "Circle"])) {
          painter[type + "Circle"](attr.cx, attr.cy, attr.radius);
        } else {
          throw new Error('Type error!' + JSON.stringify({
            series: "circle",
            type: type
          }));
        }
      }
    };
  }];

  var path = ["number", "string", "boolean", "json", "color", function ($number, $string, $boolean, $json, $color) {
    return {
      attrs: {
        'fill-color': $color('black'),
        'stroke-color': $color('black'),
        'line-width': $number(1)(true),
        dash: $json([]),
        type: $string('stroke'),
        close: $boolean(false)
      },
      subAttrs: {
        "move-to": {
          'x': $number()(true),
          'y': $number()(true)
        },
        "line-to": {
          'x': $number()(true),
          'y': $number()(true)
        },
        "bezier-to": {
          'x': $number()(true),
          'y': $number()(true),
          'cp1x': $number()(true),
          'cp1y': $number()(true),
          'cp2x': $number(null)(true),
          'cp2y': $number(null)(true)
        }
      },
      link: function link(painter, attr) {
        painter.config({
          "fillStyle": attr['fill-color'],
          "strokeStyle": attr['stroke-color'],
          "lineWidth": attr['line-width'],
          "lineDash": attr.dash
        });
        painter.beginPath(); // 获取子标签的数量并循环画出线条

        for (var i = 0; i < attr._subAttr.length; i++) {
          // 判断子标签所表示要画的线
          if (attr._subAttr[i].series == 'move-to') {
            painter.moveTo(attr._subAttr[i].attr.x, attr._subAttr[i].attr.y);
          } else if (attr._subAttr[i].series == 'line-to') {
            painter.lineTo(attr._subAttr[i].attr.x, attr._subAttr[i].attr.y);
          } else if (attr._subAttr[i].series == 'bezier-to') {
            // 二次
            if (attr._subAttr[i].attr.cp2x == null && attr._subAttr[i].attr.cp2y == null) {
              painter.quadraticCurveTo(attr._subAttr[i].attr.cp1x, attr._subAttr[i].attr.cp1y, attr._subAttr[i].attr.x, attr._subAttr[i].attr.y);
            } // 三次
            else {
                painter.bezierCurveTo(attr._subAttr[i].attr.cp1x, attr._subAttr[i].attr.cp1y, attr._subAttr[i].attr.cp2x, attr._subAttr[i].attr.cp2y, attr._subAttr[i].attr.x, attr._subAttr[i].attr.y);
              }
          }
        } // 是否需要闭合


        if (attr.close) painter.closePath();
        var type = attr.type;

        if (isFunction(painter[type])) {
          // 画出图形
          painter[type]();
        } else {
          throw new Error('Type error!' + JSON.stringify({
            series: "path",
            type: type
          }));
        }
      }
    };
  }];

  // 弧形刻度尺
  var polarRuler = ['number', "json", 'string', 'color', '$rotate', function ($number, $json, $string, $color, $rotate) {
    return {
      attrs: {
        // 刻度尺开始角度和总度数
        begin: $number(0),
        deg: $number(Math.PI * 2),
        // 刻度尺颜色
        color: $color('black'),
        // 刻度尺圆心
        cx: $number(),
        cy: $number(),
        // 刻度尺半径
        radius: $number(),
        // 刻度尺小刻度位置：outer|inner
        "mark-direction": $string("outer"),
        // 刻度尺刻度文字的位置：mark|between
        "value-position": $string("mark"),
        // 值
        value: $json()
      },
      link: function link(painter, attr) {
        var value = attr.value;
        painter.config({
          'lineWidth': 1,
          'fillStyle': attr.color,
          'strokeStyle': attr.color,
          'font-size': '12',
          'textAlign': 'center',
          'textBaseline': 'middle',
          "lineDash": []
        }); // 先绘制弧度

        painter.beginPath().arc(attr.cx, attr.cy, attr.radius, attr.begin, attr.deg).stroke();
        var markNumber = attr["value-position"] == "mark" ? value.length : value.length + 1; // 绘制刻度

        var distanceDeg = attr.deg / (markNumber - 1); // 绘制刻度

        for (var i = 0; i < markNumber; i++) {
          var _painter$beginPath$mo, _painter$beginPath;

          (_painter$beginPath$mo = (_painter$beginPath = painter.beginPath()).moveTo.apply(_painter$beginPath, _toConsumableArray($rotate(attr.cx, attr.cy, attr.begin + i * distanceDeg, attr.cx + attr.radius, attr.cy)))).lineTo.apply(_painter$beginPath$mo, _toConsumableArray($rotate(attr.cx, attr.cy, attr.begin + i * distanceDeg, attr.cx + attr.radius + 5 * (attr["mark-direction"] == 'inner' ? -1 : 1), attr.cy))).stroke();
        } // 绘制刻度上的读数


        for (var _i = 0; _i < value.length; _i++) {
          var curDeg = attr.begin + distanceDeg * (_i + (attr["value-position"] == 'mark' ? 0 : 0.5));
          var textHelpDeg = curDeg % (Math.PI * 2);
          painter.fillText.apply(painter, [value[_i]].concat(_toConsumableArray($rotate(attr.cx, attr.cy, curDeg, attr.cx + attr.radius + 15 * (attr["mark-direction"] == 'inner' ? -1 : 1), attr.cy)), [curDeg + (textHelpDeg > 0 && textHelpDeg < Math.PI || textHelpDeg > -2 * Math.PI && textHelpDeg < -Math.PI ? -Math.PI * 0.5 : Math.PI * 0.5)]));
        }
      }
    };
  }];

  var rect = ['number', "json", "string", "color", function ($number, $json, $string, $color) {
    return {
      attrs: {
        'fill-color': $color('black'),
        'stroke-color': $color('black'),
        'line-width': $number(1),
        dash: $json([]),
        type: $string('fill'),
        'align': $string('left'),
        'baseline': $string("top"),
        x: $number()(true),
        y: $number()(true),
        width: $number()(true),
        height: $number()(true)
      },
      region: {
        "default": function _default(render, attr) {
          render().config({
            "lineWidth": attr['line-width'],
            "lineDash": attr.dash
          })[attr.type + "Rect"](attr.x, attr.y, attr.width, attr.height);
        }
      },
      link: function link(painter, attr) {
        // 针对对齐方式进行校对
        if (attr.align == 'center') attr.x -= attr.width * 0.5;else if (attr.align == 'right') attr.x -= attr.width;
        if (attr.baseline == 'middle') attr.y -= attr.height * 0.5;else if (attr.baseline == 'bottom') attr.y -= attr.height; // 配置画笔

        painter.config({
          "fillStyle": attr['fill-color'],
          "strokeStyle": attr['stroke-color'],
          "lineWidth": attr['line-width'],
          "lineDash": attr.dash
        });
        var type = attr.type;

        if (isFunction(painter[type + "Rect"])) {
          // 画出图形
          painter[type + "Rect"](attr.x, attr.y, attr.width, attr.height);
        } else {
          throw new Error('Type error!' + JSON.stringify({
            series: "rect",
            type: type
          }));
        }
      }
    };
  }];

  // 直线刻度尺
  var ruler$2 = ['number', "json", 'string', 'color', '$dot', function ($number, $json, $string, $color, $dot) {
    return {
      attrs: {
        // 刻度尺的起点位置
        x: $number(),
        y: $number(),
        // 刻度尺的方向：LR|RL|TB|BT
        direction: $string("LR"),
        // 刻度尺的长度
        length: $number(),
        // 刻度尺小刻度在前进方向的位置：right|left
        "mark-direction": $string("right"),
        // 刻度尺刻度文字的位置：mark|between
        "value-position": $string("mark"),
        // 刻度尺颜色
        color: $color('black'),
        // 值
        value: $json()
      },
      link: function link(painter, attr) {
        var value = attr.value;
        painter.config({
          'lineWidth': 1,
          'fillStyle': attr.color,
          'strokeStyle': attr.color,
          'font-size': '12',
          'textAlign': attr.direction == 'LR' || attr.direction == 'RL' ? 'center' : attr.direction == 'BT' && attr["mark-direction"] == 'right' || attr.direction == 'TB' && attr["mark-direction"] == 'left' ? 'left' : 'right',
          "lineDash": [],
          'textBaseline': 'middle'
        }); // 刻度尺终点坐标

        var endPosition; // 记录小刻度如何计算

        var dxy;

        if (attr.direction == 'LR') {
          endPosition = {
            x: attr.x + attr.length,
            y: attr.y
          };
          dxy = attr["mark-direction"] == 'right' ? [0, 1] : [0, -1];
        } else if (attr.direction == 'RL') {
          endPosition = {
            x: attr.x - attr.length,
            y: attr.y
          };
          dxy = attr["mark-direction"] == 'right' ? [0, -1] : [0, 1];
        } else if (attr.direction == 'TB') {
          endPosition = {
            x: attr.x,
            y: attr.y + attr.length
          };
          dxy = attr["mark-direction"] == 'right' ? [-1, 0] : [1, 0];
        } else if (attr.direction == 'BT') {
          endPosition = {
            x: attr.x,
            y: attr.y - attr.length
          };
          dxy = attr["mark-direction"] == 'right' ? [1, 0] : [-1, 0];
        } else {
          // 错误提示
          throw new Error('Type error!' + JSON.stringify({
            series: "ruler",
            type: type
          }));
        } // 绘制主轴


        painter.beginPath().moveTo(attr.x, attr.y).lineTo(endPosition.x, endPosition.y).stroke();
        var markNumber = attr["value-position"] == "mark" ? value.length : value.length + 1; // 绘制刻度

        var distanceLength = attr.length / (markNumber - 1);
        var dot = $dot({
          d: [endPosition.x - attr.x, endPosition.y - attr.y],
          p: [attr.x, attr.y]
        });

        for (var i = 0; i < markNumber; i++) {
          var _painter$beginPath;

          // 刻度
          var markPosition = dot.value();

          (_painter$beginPath = painter.beginPath()).moveTo.apply(_painter$beginPath, _toConsumableArray(markPosition)).lineTo(markPosition[0] + dxy[0] * 5, markPosition[1] + dxy[1] * 5).stroke();

          dot.move(distanceLength);
        } // 绘制刻度上的读数


        dot = $dot({
          d: [endPosition.x - attr.x, endPosition.y - attr.y],
          p: [attr.x, attr.y]
        });
        if (attr["value-position"] == "between") dot.move(distanceLength * 0.5);

        for (var _i = 0; _i < value.length; _i++) {
          var _markPosition = dot.value();

          painter.fillText(value[_i], _markPosition[0] + dxy[0] * 15, _markPosition[1] + dxy[1] * 15);
          dot.move(distanceLength);
        }
      }
    };
  }];

  var text = ['number', "string", "json", "color", function ($number, $string, $json, $color) {
    return {
      attrs: {
        'fill-color': $color('black'),
        'stroke-color': $color('black'),
        'font-size': $number(16)(true),
        'font-family': $string("sans-serif"),
        'line-width': $number(1),
        'align': $string('left'),
        'baseline': $string("middle"),
        type: $string('fill'),
        content: $string(null),
        x: $number()(true),
        y: $number()(true),
        deg: $number(0)(true),
        dash: $json([])
      },
      region: {
        "default": function _default(render, attr) {
          render().config({
            "font-size": attr['font-size'],
            "font-family": attr['font-family'],
            "lineWidth": attr['line-width'],
            "textAlign": attr['align'],
            "textBaseline": attr['baseline'],
            "lineDash": attr.dash
          })[attr.type + "Text"]((attr.content + "").trim(), attr.x, attr.y, attr.deg);
        }
      },
      link: function link(painter, attr) {
        if (attr.content == null) {
          attr.content = attr._subTexts.join('\n');
        }

        painter.config({
          "fillStyle": attr['fill-color'],
          "strokeStyle": attr['stroke-color'],
          "font-size": attr['font-size'],
          "font-family": attr['font-family'],
          "lineWidth": attr['line-width'],
          "textAlign": attr['align'],
          "textBaseline": attr['baseline'],
          "lineDash": attr.dash
        });
        var type = attr.type;

        if (isFunction(painter[type + "Text"])) {
          painter[type + "Text"]((attr.content + "").trim(), attr.x, attr.y, attr.deg);
        } else {
          // 错误提示
          throw new Error('Type error!' + JSON.stringify({
            series: "text",
            type: type
          }));
        }
      }
    };
  }];

  Clunch.prototype.$$templateCompiler = compileTemplate; // 挂载内置组件
  Clunch.series({
    arc: arc$1,
    circle: circle,
    path: path,
    "polar-ruler": polarRuler,
    rect: rect,
    ruler: ruler$2,
    text: text
  }); // 对外暴露调用接口

  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
    module.exports = Clunch;
  } else {
    window.Clunch = Clunch;
  }

}());
