import { isArray, isFunction } from '@hai2007/tool/type';
import serviceFactory from '../../service/index';
import { isValidKey } from '../../../tool/config';
import aopRender from '../vnode/AOP-render';
import region from '../region/index';

// 对象初始化相关

export function initMixin(Clunch) {

    // 对对象进行初始化
    Clunch.prototype.$$init = function (options) {

        this.__options = options;

        // 是否关闭调试
        this._debug = 'debug' in options ? options.debug : true;

        // 记录平台
        this._platform = "platform" in options ? options.platform : "default";

        // 需要双向绑定的数据
        this.__data = isArray(options.data) ? serviceFactory(options.data) : (isFunction(options.data) ? options.data() : options.data);

        // 数据改变是否需要过渡动画
        this.__animation = 'animation' in options ? options.animation : true;

        // 记录状态
        this._isMounted = false; this._isDestroyed = false;

        // 挂载方法-
        for (let key in options.methods) {

            // 由于key的特殊性，注册前需要进行校验
            isValidKey(key);

            this[key] = isArray(options.methods[key]) ? serviceFactory(options.methods[key]) : options.methods[key];

        }

        // 挂载数据
        for (let key in this.__data) {
            isValidKey(key);
            this[key] = this.__data[key];
        }

        // 记录是否传递了render或template
        // 这里的登记是为了后续重新挂载的时候判断是否需要重置render
        this.__renderFlag = !!options.render || !!options.template;

        // 如果render存在，结合当前信息获取真正的render
        // 为什么传递的render不是真正的？
        // 这是为了方便用户使用，用户写的render建立简单，后续初始化的时候，结合所有信息，再获取完整的
        if (!!options.render) {
            this.__renderAOP = aopRender(options.render, this.__defineSerirs);
        }

        // 如果没有render，再看看有没有传递template
        // 因此render优先级明显高于template
        else if (!!options.template) {
            this.__renderOptions = this.$$templateCompiler(options.template);
            this.__renderAOP = aopRender(this.__renderOptions, this.__defineSerirs);
        }

        // 数据改变需要的初始化辅助参数
        this.__observeWatcher = {
            // 是否有前置计算未完成
            flag: false,
            // 动画停止方法
            stop: null,
            time: 'time' in options ? options.time : 500
        };

        // 画布大小改变需要的初始化辅助参数
        this.__observeResize = {
            // 是否可以立刻更新画布
            help: true,
            // 前置是否有任务未完成
            flag: false,
            // 画布监听对象
            observer: null
        };

        // 画笔参数
        this.__painter = null;
        this._width = 0;
        this._height = 0;
        this._min = 0;
        this._max = 0;

        // 区域管理者
        if (this._platform == 'default') {
            this.__regionManager = region(this);
        } else {
            this.__regionManager = region(this, options.el);
        }

        // 事件处理兼容改造
        // 主要是用于无法直接通过DOM主动绑定的环境
        this.$$trigger = (eventName, eventParam) => {

            /**
            * eventParam={
            *      left:number,
            *      top:number
            * };
            */
            let events = this.__events_platform[eventName];
            for (let i = 0; i < events.length; i++) {
                events[i]({
                    type: 'result',
                    position: eventParam
                });
            }

        };

    };

}
