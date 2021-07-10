
// 结点

export default ['number', "string", function ($number, $string) {
    return {
        attrs: {
            type: $string(),
            title: $string(),
            x: $number(),
            y: $number()
        },
        region: {
            default: function (render, attr) {
                render().fillRect(attr.x - 50, attr.y - 15, 100, 30);
            }
        },
        link(painter, attr) {

            painter.config({
                "fillStyle": "#096ec8"
            });

            switch (attr.type) {

                case "begin-end": {
                    painter
                        .beginPath()
                        .moveTo(attr.x - 35, attr.y - 15)
                        .lineTo(attr.x + 35, attr.y - 15)
                        .arc(attr.x + 35, attr.y, 15, -Math.PI / 2, Math.PI)
                        .lineTo(attr.x - 35, attr.y + 15)
                        .arc(attr.x - 35, attr.y, 15, Math.PI / 2, Math.PI)
                        .fill();
                    break;
                }

                case "estimate": {
                    painter
                        .fillRect(attr.x - 50, attr.y - 15, 100, 30);
                    break;
                }

                case "calc": {
                    painter
                        .beginPath()
                        .moveTo(attr.x, attr.y - 15)
                        .lineTo(attr.x + 50, attr.y)
                        .lineTo(attr.x, attr.y + 15)
                        .lineTo(attr.x - 50, attr.y)
                        .fill();
                    break;
                }

                case "exec": {
                    painter
                        .beginPath()
                        .moveTo(attr.x - 35, attr.y - 15)
                        .lineTo(attr.x + 50, attr.y - 15)
                        .lineTo(attr.x + 35, attr.y + 15)
                        .lineTo(attr.x - 50, attr.y + 15)
                        .fill();
                    break;
                }

            }

            // 绘制提示文字
            painter.config({
                'textAlign': "center",
                "textBaseline": "middle",
                'font-size': 12,
                'fillStyle': "white"
            }).fillText(attr.title, attr.x, attr.y);

        }
    };
}];
