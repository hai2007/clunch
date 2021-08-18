import Clunch from './clunch/instance/index';
import { isElement, isFunction, isNumber } from '@hai2007/tool/type';
import resize from './clunch/observe/resize';
import aopRender from './clunch/vnode/AOP-render';
import { bind } from '../tool/event';
import painter from './painter/index';

// 挂载一些静态方法
import initGlobalApi from './clunch/global-api/index';
initGlobalApi(Clunch);

// 挂载的意思是Clunch对象和页面关联起来
// 这样挂载了，才会真的绘制
Clunch.prototype.$mount = function (el) {

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

    this.$$lifecycle('beforeMount');

    // 如果我们没有在初始化对象的时候传递render（template也算传递了）
    // 那么我们在每次挂载的时候都会使用挂载地的内容进行组合
    if (!this.__renderFlag) {
        this.__renderOptions = this.$$templateCompiler(el.innerHTML);
        this.__renderAOP = aopRender(this.__renderOptions, this.__defineSerirs);
    }

    // 一切正确以后，记录新的挂载结点
    this.__el = el;

    // 默认是web平台
    if (this._platform == 'default') {

        this.__el.setAttribute('__clunch__devtool__', new Date().valueOf() + "" + (Math.random() * 100000).toFixed(0));

        // 初始化添加画布
        el.innerHTML = '<canvas>非常抱歉，您的浏览器不支持canvas!</canvas>';
        this.__canvas = el.getElementsByTagName('canvas')[0];

        // 挂载后以后，启动画布大小监听
        resize(this);

    }

    // 触发数据改变更新
    this.$$updateWithData();

    // 记录事件
    this.__events_platform = {
        "click": [],
        "dblclick": [],
        "mousemove": [],
        "mousedown": [],
        "mouseup": []
    };

    // 添加区域交互
    ['click', 'dblclick', 'mousemove', 'mousedown', 'mouseup'].forEach(eventName => {

        let eventHandler = event => {
            this.__regionManager.getRegion(event, region => {
                if (region[0] != null) {
                    let regionSplit = region[0].split('::');
                    let doback = this.__events[eventName][regionSplit[0]];
                    if (isFunction(doback)) {
                        let regionNameSplit = regionSplit[0].split('@');

                        let curSeires = this.__renderSeries[regionNameSplit[0]];

                        // 整理属性信息
                        let attr = {};
                        for (let attrKey in curSeires.attr) {
                            attr[attrKey] = curSeires.attr[attrKey].value;
                        }

                        // 调用回调
                        doback.call(this, {
                            id: curSeires.id,
                            series: curSeires.name,
                            region: regionNameSplit[1],
                            subRegion: regionSplit[1],
                            attr,
                            left: region[1],
                            top: region[2],
                            data: region[3]
                        });
                    }
                }
            });
        };

        if (this._platform == 'default') {
            bind(this.__canvas, eventName, eventHandler);
        } else {
            this.__events_platform[eventName].push(eventHandler);
        }
    });

    // 这里的回调函数doback和上面区域事件回调保持一致
    this.$bind = function (eventName, doback) {

        let eventHandler = event => {
            this.__regionManager.getRegion(event, region => {
                let callbackValue;
                if (region[0] != null) {
                    let regionSplit = region[0].split('::');
                    let regionNameSplit = regionSplit[0].split('@');
                    let curSeires = this.__renderSeries[regionNameSplit[0]];

                    // 整理属性信息
                    let attr = {};
                    for (let attrKey in curSeires.attr) {
                        attr[attrKey] = curSeires.attr[attrKey].value;
                    }

                    callbackValue = {
                        id: curSeires.id,
                        series: curSeires.name,
                        region: regionNameSplit[1],
                        subRegion: regionSplit[1],
                        attr,
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

                doback.call(this, callbackValue);
            });
        };

        if (this._platform == 'default') {
            bind(this.__canvas, eventName, eventHandler);
        } else {
            if (!(eventName in this.__events_platform)) this.__events_platform[eventName] = [];
            this.__events_platform[eventName].push(eventHandler);
        }

        return this;
    };

    // 挂载完毕以后，同步标志
    this._isMounted = true;

    this.$$lifecycle('mounted');

    // 非web平台，需要特殊处理
    if (this._platform != 'default') {

        this.__painter = painter(this._platform, el, el.width, el.height);
        this.__platform_painter = el.painter;

        this.$resize(el.width, el.height);

    }

    return this;
};

// 解挂的意思是Clunch对象和页面解除关联
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

    this.$$lifecycle('beforeUnmount');

    // 解除对画布大小改变的监听
    this.__observeResize.observer.disconnect();

    // 释放资源
    this.__painter = null;
    this.__canvas = null;
    this._isMounted = false;
    this.$$lifecycle('unmounted');

    this.__el.__clunch__devtool__target__ = null;

    return this;
};

// 彻底销毁资源，无法再重新挂载
// 主要是为了释放一些内置资源
Clunch.prototype.$destroy = function () {

    if (this._isDestroyed) {
        console.warn('The object has been destroyed!');
        return this;
    }

    // 先解除绑定
    if (this._isMounted) this.$unmount();

    this.$$lifecycle('beforeDestroy');

    // 释放资源
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
            this._min = width < height ? width : height;

            // 更新区域大小
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

export default Clunch;
