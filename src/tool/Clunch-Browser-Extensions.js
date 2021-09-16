export default function (target) {

    let data = {};
    for (let key in target.__data) {
        data[key] = target[key];
    };

    return JSON.stringify({
        version: 'v1',// 新增数据版本，方便后期数据格式改变的时候，插件可以给出有益的提示
        render: {
            Series: target.__renderSeries,
            AOP: target.__renderAOP
        },
        data
    })

};
