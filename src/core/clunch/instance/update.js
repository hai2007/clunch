import { evalExpress } from '@hai2007/algorithm/value';
import animation from '@hai2007/tool/animation';
import { isFunction, isArray, isNumber } from '@hai2007/tool/type';
import calcDeepSeries from '../../../tool/calcDeepSeries';
import painter from '../../painter/index';
import getStyle from '../../../tool/get-style';
import { initPainterConfig } from '../../painter/config';

import getClunchBrowserExtensionsData from '../../../tool/Clunch-Browser-Extensions';

// 数据更新或画布改变需要进行的更新处理方法

export function updateMixin(Clunch) {

    // 重新绘制画布
    Clunch.prototype.$$updateView = function () {

        // 如果没有挂载
        if (!this._isMounted || !this.__painter) return;

        this.$$lifecycle('beforeDraw');

        // 清空区域信息
        this.__regionManager.erase();

        // 清空画布
        this.__painter.clearRect();

        for (let i = 0; i < this.__renderSeries.length; i++) {
            let attr = {
                _subTexts: this.__renderSeries[i].subText,
                _subAttr: []
            };

            // 属性
            for (let attrKey in this.__renderSeries[i].attr) {
                attr[attrKey] = this.__renderSeries[i].attr[attrKey].value
            }

            // 子组件
            for (let j = 0; j < this.__renderSeries[i].subAttr.length; j++) {
                let subSeries = {
                    series: this.__renderSeries[i].subAttr[j].name,
                    attr: {}
                };

                // 子组件属性
                for (let subSeriesAttrKey in this.__renderSeries[i].subAttr[j].attr) {
                    subSeries.attr[subSeriesAttrKey] = this.__renderSeries[i].subAttr[j].attr[subSeriesAttrKey].value;
                }

                attr._subAttr.push(subSeries);
            }

            // 绘制
            this.__painter.config(initPainterConfig);
            this.__defineSerirs[this.__renderSeries[i].name].link.call(this, this.__painter, attr);

            // 记录区域
            let region = this.__defineSerirs[this.__renderSeries[i].name].region;
            if (region) {
                for (let regionName in region) {

                    let that = this;
                    region[regionName].call(that, function (subName, data) {

                        // 如果传递了子区域名称
                        if (arguments.length > 0) subName = subName + "";
                        // 如果没有传递
                        else subName = "default";

                        return that.__regionManager.painter(i + "@" + regionName + "::" + subName, data);
                    }, attr);

                }
            }
        }

        // 对于有的平台，最后特殊处理

        if (this._platform == 'uni-app') {
            setTimeout(() => {
                this.__platform_painter.draw();
                if (this.__regionManager != null) {
                    this.__regionManager.draw();
                }
            }, 200);
        }

        this.$$lifecycle('drawed');
    };

    // 画布大小改变的时候，更新
    Clunch.prototype.$$updateWithSize = function () {

        this.$$lifecycle('beforeResize');

        let width = this.__el.clientWidth - ((getStyle(this.__el, 'padding-left') + "").replace('px', '')) - ((getStyle(this.__el, 'padding-right') + "").replace('px', ''));
        let height = this.__el.clientHeight - ((getStyle(this.__el, 'padding-top') + "").replace('px', '')) - ((getStyle(this.__el, 'padding-bottom') + "").replace('px', ''));

        this._width = width;
        this._height = height;
        this._max = width > height ? width : height;
        this._min = width < height ? width : height;

        if (width == 0 || height == 0) {

            // 画布大小标记为0
            this.__canvas.style.width = "0px";
            this.__canvas.style.height = "0px";

            // 提前结束更新
            this.$$lifecycle('resized');

            return;
        }

        // 更新画布
        this.__painter = painter(this._platform, this.__canvas, width, height);

        // 重置区域
        this.__regionManager.updateSize(width, height);

        if (isFunction(this.__observeWatcher.stop)) {
            this.__observeWatcher.stop();
            this.__observeWatcher.stop = null;
        }

        setTimeout(() => {

            // 重新计算
            this.$$updateWithData(true);

            this.$$lifecycle('resized');

        }, 10);

    };

    // 数据改变的时候，需要重新计算需要绘制的具体图形
    Clunch.prototype.$$updateWithData = function (noAnimation) {

        // 准备计算前一些初始化判断
        if (isFunction(this.__observeWatcher.stop)) {
            this.__observeWatcher.stop();
            this.__observeWatcher.stop = null;
        }

        // 如果上次数据改变没有结束，这次不应该触发数据改变前钩子
        else {
            this.$$lifecycle('beforeUpdate');
        }

        // 记录事件
        // 这样监听到canvas画布上事件的时候就知道如何触发更具体的事件
        this.__events = {
            click: {},
            dblclick: {},
            mousemove: {},
            mousedown: {},
            mouseup: {}
        };

        let renderSeries = [], that = this;
        (function doit(renderAOP, pScope, isSubAttrs, pid, ignoreFor) {

            // 如果当前计算的是某个父组件的子属性组件，应该返回
            let subRenderSeries = [];

            for (let i = 0; i < renderAOP.length; i++) {

                // 继承scope
                for (let scopeKey in pScope) {
                    renderAOP[i].scope[scopeKey] = pScope[scopeKey];
                }

                // id可以采用默认的计算机制，也可以由用户自定义
                let id;
                if ('_id' in renderAOP[i]) {
                    id = renderAOP[i]._id.isBind ? evalExpress(that, renderAOP[i]._id.express, renderAOP[i].scope) : renderAOP[i]._id.express;
                } else {
                    id = pid + renderAOP[i].index;
                }

                // _animation用于设置组件参与动画的方式
                let animationHow;
                if ('_animation' in renderAOP[i]) {
                    animationHow = renderAOP[i]._animation.isBind ? evalExpress(that, renderAOP[i]._animation.express, renderAOP[i].scope) : renderAOP[i]._animation.express;
                } else {
                    animationHow = 'lazy';
                }

                // c-for指令
                // 由于此指令修改局部scope，因此优先级必须最高
                if (!ignoreFor && 'c-for' in renderAOP[i]) {

                    let cFor = renderAOP[i]['c-for'];

                    let data_for;
                    if (isArray(cFor.data)) {
                        data_for = cFor.data;
                    } else {
                        data_for = evalExpress(that, cFor.data, renderAOP[i].scope);

                        if (isNumber(data_for)) {
                            let len = data_for;
                            data_for = [];
                            for (let k = 0; k < len; k++) {
                                data_for.push(k);
                            }
                        }
                    }

                    for (let forKey in data_for) {
                        renderAOP[i].scope[cFor.value] = data_for[forKey];
                        if (cFor.key != null) renderAOP[i].scope[cFor.key] = isArray(data_for) ? (+forKey) : forKey;

                        let temp = doit([renderAOP[i]], {}, isSubAttrs, id + "for" + forKey + "-", true);
                        if (isSubAttrs) {
                            for (let j = 0; j < temp.length; j++) {
                                subRenderSeries.push(temp[j]);
                            }
                        }
                    }

                    continue;

                }

                // c-if
                if ('c-if' in renderAOP[i] && !evalExpress(that, renderAOP[i]['c-if'], renderAOP[i].scope)) {

                    // 如果c-if是false，就不用当前的就可以略过了

                } else {

                    // 计算子组件
                    doit(renderAOP[i].children, renderAOP[i].scope, false, id + "-", false);

                    // group只是包裹，因此，组件本身不需要被统计
                    if (renderAOP[i].name != 'group') {

                        let seriesItem = {
                            name: renderAOP[i].name,
                            attr: {},
                            subAttr: [],
                            subText: renderAOP[i].text,
                            id,
                            animation: animationHow
                        };

                        // 计算属性
                        for (let attrKey in renderAOP[i].attrs) {
                            let oralAttrValue = renderAOP[i].attrs[attrKey];
                            seriesItem.attr[attrKey] = {
                                animation: oralAttrValue.animation,
                                type: oralAttrValue.type,

                                // 这里是根据是通过双向绑定还是写死的来区分
                                value: oralAttrValue.value.isBind ? evalExpress(that, oralAttrValue.value.express, renderAOP[i].scope) : oralAttrValue.value.express
                            };
                        }

                        // 计算子属性组件
                        seriesItem.subAttr = doit(renderAOP[i].subAttrs, renderAOP[i].scope, true, id + "-", false);

                        // 登记事件
                        for (let j = 0; j < renderAOP[i].events.length; j++) {
                            let event = renderAOP[i].events[j];
                            that.__events[event.event][renderSeries.length + "@" + event.region] = that[event.method];
                        }

                        // 计算完毕以后，根据情况存放好
                        if (isSubAttrs) subRenderSeries.push(seriesItem);
                        else renderSeries.push(seriesItem);
                    }
                }

            }

            return subRenderSeries;
        })

            // 分别表示：当前需要计算的AOP数组、父scope、是否是每个组件的子组件、父ID
            (this.__renderAOP, {}, false, "", false);

        // 更新最新数据(目前只支持web端的调试)
        if (this._platform == 'default') {

            // 获取数据用于提供给浏览器调试插件使用
            this.__el.getElementsByTagName('canvas')[0].setAttribute('__clunch__devtool__target__', getClunchBrowserExtensionsData(this));

        }

        // 如果没有前置数据，根本不需要动画效果
        if (!this.__renderSeries || noAnimation || !this.__animation) {

            this.__renderSeries = renderSeries;
            this.$$updateView();
            this.$$lifecycle('updated');

            return;
        }

        let calcDeepSeriesFun = calcDeepSeries(this.__renderSeries, renderSeries);

        // 数据改变动画
        this.__observeWatcher.stop = animation(deep => {

            this.__renderSeries = calcDeepSeriesFun(deep);
            this.$$updateView();

        }, this.__observeWatcher.time, deep => {
            if (deep == 1) {

                // 说明动画进行完毕以后停止的，我们需要触发'更新完毕'钩子
                this.__observeWatcher.stop = null;
                this.$$lifecycle('updated');
            }
        });

    };

}
