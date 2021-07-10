
// 连线

export default ['json', "string", "$dot", "$move", function ($json, $string, $dot, $move) {
    return {
        attrs: {
            begin: $json(),
            end: $json(),
            info: $string(undefined)
        },
        region: {
            default: function (render, attr) {
                render().beginPath().config({
                    "lineWidth": 20
                }).moveTo(attr.begin.x, attr.begin.y).lineTo(attr.end.x, attr.end.y).stroke();
            }
        },
        link(painter, attr) {

            painter.config({
                "strokeStyle": "#3a88cb",
                "fillStyle": "#3a88cb"
            });

            // 先连接线条
            painter.beginPath().moveTo(attr.begin.x, attr.begin.y).lineTo(attr.end.x, attr.end.y).stroke();

            // 绘制箭头

            let dot = $dot({
                d: [attr.end.x - attr.begin.x, attr.end.y - attr.begin.y],
                c: [(attr.begin.x + attr.end.x) * 0.5, (attr.begin.y + attr.end.y) * 0.5],
                p: [(attr.begin.x + attr.end.x) * 0.5, (attr.begin.y + attr.end.y) * 0.5]
            });

            let p1 = dot.move(6).value();
            let p2 = dot.move(-6).rotate(Math.PI / 3 * 2).move(6).value();
            let p3 = dot.move(-6).rotate(Math.PI / 3 * 2).move(6).value();

            painter.beginPath().moveTo(p1[0], p1[1]).lineTo(p2[0], p2[1]).lineTo(p3[0], p3[1]).fill();

            // 绘制判断文字
            if (attr.info != undefined) {
                let p = $move(
                    attr.end.x - attr.begin.x, attr.end.y - attr.begin.y,
                    50,
                    attr.begin.x, attr.begin.y
                );

                painter.config({
                    "font-size": 12,
                    'textAlign': "left",
                    "textBaseline": "middle",
                    "fillStyle": '#07566c'
                }).fillText(attr.info, p[0], p[1]);
            }

        }
    };
}];
