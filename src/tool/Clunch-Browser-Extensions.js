export default function (target) {

    let data = {};
    for (let key in target.__data) {
        data[key] = target[key];
    };

    return JSON.stringify({
        render: {
            Options: target.__renderOptions,
            Series: target.__renderSeries,
            AOP: target.__renderAOP
        },
        data,
        animation: target.__animation,
        width: target._width,
        height: target._height
    })

};
