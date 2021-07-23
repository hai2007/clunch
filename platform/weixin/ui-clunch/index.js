import toPx from './toPx';
import Clunch from './clunch-template';

let clunchObject = null;
let getCanvasContext = (idName, width, height, doback) => {
    wx.createSelectorQuery()
        .select('#' + idName)
        .fields({ node: true, size: true })
        .exec((res) => {
            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');

            const dpr = wx.getSystemInfoSync().pixelRatio;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            doback(ctx);
        });
};

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
        innerWidth: 400,
        innerHeight: 300
    },
    lifetimes: {
        ready() {
            this.setData({
                innerWidth: toPx(this.width || "100vw"),
                innerHeight: toPx(this.height || "100vh")
            });
        }
    },
    methods: {
        new(config, seriesList, doback) {
            // 添加自定义组件
            if (seriesList) Clunch.series(seriesList);

            getCanvasContext("painter", this.innerWidth, this.innerHeight, painter => {
                getCanvasContext("region", this.innerWidth, this.innerHeight, region => {

                    // 对参数进行补充
                    config.platform = "weixin";
                    config.el = {
                        painter,
                        region,
                        regionid: "region",
                        getRegionColor: (options) => {
                            region.getImageData(options, this);
                        },
                        width: +this.data.innerWidth,
                        height: +this.data.innerHeight,
                    };

                    // 创建对象
                    clunchObject = new Clunch(config);
                    if (doback) doback(clunchObject);

                });
            });

        }
    }
});
