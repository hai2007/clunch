
import { isString } from '@hai2007/tool/type';
import { toJSON } from '@hai2007/algorithm/json';

let calcValue = (type, express) => {

    switch (type) {

        // boolean
        case 'boolean': {
            return express == 'false' || express == false ? false : true;
        }

        // 数字
        case 'number': {

            // 角度
            if (/deg$/.test(express)) return (0 - -express.replace(/deg$/, '')) / 180 * Math.PI;

            // 弧度
            if (/pi$/.test(express)) return (0 - -express.replace(/pi$/, '')) * Math.PI;

            // 如果是字符串，类型强转
            if (isString(express)) return +express;

            return express;
        }

        // JSON
        case 'json': {
            if (isString(express)) {
                return toJSON(express.replace(/\&quot;/g,''));
            }
            return express;
        }
    }

    return express;

};

// 对来自标签字符串的分析结果进行进一步处理
// 包括一些校对等比较复杂的业务处理和错误提示
// （处理render参数或者最终的组件对象）

export default function (initRender, series) {

    // 由于下面的一些方法修改了原来的值
    // 而且AOP操作非常不频繁
    // 因此目前这里直接深度clone
    initRender = JSON.parse(JSON.stringify(initRender));

    // 唯一序列号
    let seriesNumber = 0;

    return (function doit(renders, pName) {

        let temp = [];
        for (let i = 0; i < renders.length; i++) {
            let render = renders[i];
            if (pName || render.name in series) {

                let aopRender = {
                    name: render.name,
                    attrs: {},
                    events: [],
                    scope: {},
                    index: seriesNumber++
                };

                let curSeries = pName ? {
                    // 组件子属性
                    attrs: series[pName].subAttrs[render.name]
                } :
                    // 如果是单一的组件
                    series[render.name];

                // 属性预处理
                // 主要是需要把类似c-bind:x='index'或c-for='(value,index) in datalist'和x='10'解除差异
                // 这样的好吃是或许判断起来容易
                // 而且数据改变的时候，一些计算可以在此次提前完成
                for (let attrKey in render.attrs) {

                    // 对c-bind:attrKey一类进行处理
                    if (/^c\-bind\:/.test(attrKey) || /^\:/.test(attrKey)) {
                        render.attrs[attrKey.replace(/^(?:c\-bind){0,1}\:/, '')] = {
                            isBind: true,
                            express: render.attrs[attrKey],
                        };

                        delete render.attrs[attrKey];
                    }

                    // c-on:eventName@regionName
                    else if (/^c\-on\:/.test(attrKey)) {
                        let eventsArray = (attrKey.replace(/^c\-on\:/, '') + "@default").split('@');
                        aopRender.events.push({
                            event: eventsArray[0],
                            region: eventsArray[1],
                            method: render.attrs[attrKey]
                        });
                    }

                    // c-for="(value,key) in dataList"
                    else if ('c-for' == attrKey) {
                        let flag = /^ {0,}\(/.test(render.attrs[attrKey]);
                        let temp = flag ?

                            // 格式：(value,key) in dataList
                            /^ {0,}\( {0,}([0-9a-zA-Z_$]+) {0,}, {0,}([0-9a-zA-Z_$]+) {0,}\) {1,}in {1,}([^ ]+) {0,}$/.exec(render.attrs[attrKey]) :

                            // 格式：value in dataList
                            /^ {0,}([0-9a-zA-Z_$]+) {1,}in {1,}([^ ]+) {0,}$/.exec(render.attrs[attrKey]);

                        aopRender['c-for'] = {
                            key: flag ? temp[2] : null,
                            value: temp[1],
                            data: flag ? temp[3] : temp[2]
                        };

                        // 如果是一个数字
                        if (/^\d{1,}$/.test(aopRender['c-for'].data)) {
                            let len = +aopRender['c-for'].data;
                            aopRender['c-for'].data = [];
                            for (let i = 0; i < len; i++) {
                                aopRender['c-for'].data.push(i);
                            }
                        }

                    }

                    // c-if='flag'
                    else if ('c-if' == attrKey) {
                        aopRender['c-if'] = render.attrs[attrKey]
                    }

                    // 默认就是普通属性
                    else {
                        render.attrs[attrKey] = {
                            isBind: false,
                            express: render.attrs[attrKey]
                        };
                    }

                }

                // 校对属性是否未定义
                // 同时对一些特殊属性进行处理
                for (let attrKey in render.attrs) {
                    if (/^c\-/.test(attrKey)) {
                        // todo
                    }
                    else if (attrKey == '_id') {
                        aopRender._id = render.attrs._id;
                    } else if (attrKey == '_animation') {
                        aopRender._animation = render.attrs._animation;
                    } else if (!(attrKey in curSeries.attrs)) {
                        console.warn("attrs." + attrKey + ' is not defined for ' + (pName ? pName + " > " + render.name : render.name) + '!');
                    }
                }

                // 校对预定义规则的属性
                for (let attrKey in curSeries.attrs) {

                    let curAttrs = curSeries.attrs[attrKey];

                    // 对于必输项，如果没有输入，应该直接报错
                    if (curAttrs.required && !(attrKey in render.attrs)) {
                        throw new Error('attrs.' + attrKey + ' is required for ' + (pName ? pName + " > " + render.name : render.name) + '!');
                    }

                    // 添加定义的属性
                    aopRender.attrs[attrKey] = {
                        animation: curAttrs.animation,
                        type: curAttrs.type,
                        value: attrKey in render.attrs ? render.attrs[attrKey] : {
                            isBind: false,
                            express: curAttrs.default
                        }
                    };

                    // 类型校对和特殊计算
                    if (!aopRender.attrs[attrKey].value.isBind) {
                        aopRender.attrs[attrKey].value.express = calcValue(aopRender.attrs[attrKey].type, aopRender.attrs[attrKey].value.express);
                    }

                }

                // 划分孩子结点和子组件

                let children_temp = [], subRender_temp = [], text_temp = [];

                // 因为render可能是人收到写的，孩子结点不一定有，需要判断一下
                if (render.children) {

                    // 开始区分是独立的子节点还是当前组件的子组件
                    // 文字比较特殊，提前初步记录在当前结点
                    for (let i = 0; i < render.children.length; i++) {

                        // 文字
                        if (isString(render.children[i])) {
                            text_temp.push(render.children[i]);
                        }

                        // 如果这个组件存在于当前组件的子属性中，就应该是子组件
                        else if (curSeries.subAttrs && render.children[i].name in curSeries.subAttrs) {
                            subRender_temp.push(render.children[i]);
                        }

                        // 独立的子组件
                        else {
                            children_temp.push(render.children[i]);
                        }
                    }
                }

                aopRender.children = doit(children_temp);
                aopRender.subAttrs = doit(subRender_temp, render.name);
                aopRender.text = text_temp;

                temp.push(aopRender);
            }

            // 如果组件没有被注册，给出提示并忽略，因为可能是写出了
            else {
                console.error('Series ' + render.name + ' is not defined!');
            }

        }

        return temp;

    })(initRender);

};
