let drawPolygon = (map, painter, data, cx, cy, type) => {
    painter.beginPath();
    for (let i = 0; i < data.length; i++) {
        let dxy = map(data[i][0], data[i][1]);
        painter.lineTo(cx + dxy[0], cy + dxy[1]);
    }
    painter.closePath()[type]();
};

let drawMultiPolygon = (map, painter, data, cx, cy, type) => {
    if (data.type == 'Polygon') {
        for (let i = 0; i < data.coordinates.length; i++) {
            drawPolygon(map, painter, data.coordinates[i], cx, cy, type);
        }
    } else {
        for (let i = 0; i < data.coordinates.length; i++) {
            for (let j = 0; j < data.coordinates[i].length; j++) {
                drawPolygon(map, painter, data.coordinates[i][j], cx, cy, type);
            }
        }
    }
};

import { isFunction } from '@hai2007/tool';

// 地理区域

export default ['number', "json", 'string', 'any', '$map', function ($number, $json, $string, $any, $map) {
    return {
        attrs: {

            'fill-color': $string('while'),
            'stroke-color': $string('black'),
            'line-width': $number(1),
            dash: $json([]),
            type: $string('fill'),
            cx: $number(),
            cy: $number(),

            // 地图缩放比例
            scale: $number(7)(true),

            // 地图中心
            center: $json([107, 36]),

            // 映射函数
            map: $any(null),

            // 区域地图数据
            "geo-json": $json()

        },
        region: {
            default: function (render, attr) {

                // 如果用户传递了自己的地图映射函数，就应该采用用户的
                let map = attr.map != null ? attr.map : $map({
                    scale: attr.scale,
                    center: attr.center,
                    type: "eoap"
                });

                // 绘制
                drawMultiPolygon(map, render().config({
                    "lineWidth": attr['line-width'],
                    "lineDash": attr.dash
                }), attr['geo-json'].geometry, attr.cx, attr.cy, attr.type);

            }
        },
        link(painter, attr) {

            // 如果用户传递了自己的地图映射函数，就应该采用用户的
            let map = attr.map != null ? attr.map : $map({
                scale: attr.scale,
                center: attr.center,
                type: "eoap"
            });

            if (attr['geo-json'].type == 'FeatureCollection') {
                // todo
                // 非合法的数据格式
            } else if (attr['geo-json'].type == 'Feature') {

                // 绘制前，设置画笔
                painter.config({
                    "fillStyle": attr['fill-color'],
                    "strokeStyle": attr['stroke-color'],
                    "lineWidth": attr['line-width'],
                    "lineDash": attr.dash
                });

                let type = attr.type;

                if (isFunction(painter[type])) {

                    // 绘制
                    drawMultiPolygon(map, painter, attr['geo-json'].geometry, attr.cx, attr.cy, type);
                } else {
                    throw new Error('Type error!' + JSON.stringify({ series: "region", type }));
                }

            } else {
                throw new Error('geo-json.type error!' + JSON.stringify({ series: "region", type: attr['geo-json'].type }));
            }

        }
    };
}];
