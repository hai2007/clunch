import toPx from './toPx';
import Clunch from './clunch-template';

let clunchObject = null;

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
        innerWidth: "400",
        innerHeight: "300"
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
        new(config, seriesList) {
            // 添加自定义组件
            if (seriesList) Clunch.series(seriesList);

            // 对参数进行补充
            config.platform = "weixin";
            config.el = {
                painter: wx.createCanvasContext("painter",this),
                region: wx.createCanvasContext("region",this),
                regionid: "region",
                getRegionColor: (options) => {
                    debugger
                    wx.createCanvasContext("region",this).getImageData(options, this);
                },
                width: +this.data.innerWidth,
                height: +this.data.innerHeight,
            };

            // 创建对象
            clunchObject = new Clunch(config);
            return clunchObject;
        }
    }
});
