import toPx from './toPx';
import Clunch from './clunch-template';

let clunchObject = null;
let dpr = wx.getSystemInfoSync().pixelRatio;

Component({
    properties: {
        width: {
            type: String,
            value: "",
        },
        height: {
            type: String,
            value: "",
        }
    },
    data: {
        innerWidth: "",
        innerHeight: ""
    },
    lifetimes: {
        ready() {
            this.setData({
                innerWidth: toPx(this.data.width || "100vw"),
                innerHeight: toPx(this.data.height || "100vh")
            });
        }
    },
    methods: {
        new(config, seriesList, callback) {
            // 添加自定义组件
            if (seriesList) Clunch.series(seriesList);

            let getCanvasContext = (idName, doback) => {
                const query = wx.createSelectorQuery().in(this);
                query.select('#' + idName)
                    .fields({ node: true, size: true })
                    .exec((res) => {
                        const canvas = res[0].node;
                        const ctx = canvas.getContext('2d');

                        canvas.width = res[0].width * dpr;
                        canvas.height = res[0].height * dpr;
                        ctx.scale(dpr, dpr);

                        doback(ctx);
                    });
            };

            getCanvasContext("painter", painter => {
                getCanvasContext("region", region => {

                    // 对参数进行补充
                    config.platform = "weixin";
                    config.el = {
                        painter,
                        region,
                        regionid: "region",
                        getRegionColor: (options) => {
                            options.success(region.getImageData(options.x * dpr, options.y * dpr, 1, 1));
                        },
                        width: +this.data.innerWidth,
                        height: +this.data.innerHeight
                    };

                    // 创建对象
                    clunchObject = new Clunch(config);
                    if (callback) callback(clunchObject);

                });
            });

        },
        doit(event) {
            // 如果没有创建就不需要处理
            if (!clunchObject) return;

            clunchObject.$$trigger("mousemove", {
                left: event.touches[0].x,
                top: event.touches[0].y,
            });
        }
    }

});
