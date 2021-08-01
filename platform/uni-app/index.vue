<template>
  <view>
    <!-- #ifdef MP-ALIPAY -->
    <canvas
      :id="'painter-' + uniqueid"
      @touchstart="doit"
      @touchmove="doit"
      :style="{ width: innerWidth + 'px', height: innerHeight + 'px' }"
    ></canvas>
    <canvas
      class="region"
      :id="'region-' + uniqueid"
      :style="{ width: innerWidth + 'px', height: innerHeight + 'px' }"
    ></canvas>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <canvas
      canvas-id="painter"
      @touchstart="doit"
      @touchmove="doit"
      :style="{ width: innerWidth + 'px', height: innerHeight + 'px' }"
    ></canvas>
    <canvas
      class="region"
      canvas-id="region"
      :style="{ width: innerWidth + 'px', height: innerHeight + 'px' }"
    ></canvas>
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN||MP-ALIPAY -->
    <canvas
      :canvas-id="'painter-' + uniqueid"
      @touchstart="doit"
      @touchmove="doit"
      :style="{ width: innerWidth + 'px', height: innerHeight + 'px' }"
    ></canvas>
    <canvas
      class="region"
      :canvas-id="'region-' + uniqueid"
      :style="{ width: innerWidth + 'px', height: innerHeight + 'px' }"
    ></canvas>
    <!-- #endif -->
  </view>
</template>
<script>
import Clunch from "../../dist/clunch-template";
import toPx from "./toPx";

let clunchObject = null;

/**
 * 图形框架clunch在uni-app中的兼容组件
 * @description clunch相关文档地址 https://hai2007.gitee.io/clunch/
 * @property {String,Number} width 画布的宽
 * @property {String,Number} height 画布的高
 */
export default {
  data() {
    return {
      innerWidth: "0",
      innerHeight: "0",
      uniqueid: (Math.random() * 10000).toFixed(0),
    };
  },
  props: {
    width: {
      type: [String, Number],
      default: "100vw",
    },
    height: {
      type: [String, Number],
      default: "100vh",
    },
  },
  mounted() {
    //   设置画布大小
    this.innerWidth = toPx(this.width);
    this.innerHeight = toPx(this.height);
  },
  watch: {
    width() {
      this.innerWidth = toPx(this.width);
    },
    height() {
      this.innerHeight = toPx(this.height);
    },
  },
  methods: {
    new(config, seriesList) {
      // 添加自定义组件
      if (seriesList) Clunch.series(seriesList);

      // 对参数进行补充
      config.platform = "uni-app";
      config.el = {
        // #ifdef MP-WEIXIN
        painter: uni.createCanvasContext("painter", this),
        region: uni.createCanvasContext("region", this),
        regionid: "region",
        // #endif
        // #ifndef MP-WEIXIN
        painter: uni.createCanvasContext("painter-" + this.uniqueid, this),
        region: uni.createCanvasContext("region-" + this.uniqueid, this),
        regionid: "region-" + this.uniqueid,
        // #endif
        getRegionColor: (options) => {
          // #ifdef MP-ALIPAY
          uni
            .createCanvasContext("region-" + this.uniqueid, this)
            .getImageData(options, this);
          // #endif
          // #ifndef MP-ALIPAY
          uni.canvasGetImageData(options, this);
          // #endif
        },
        width: this.innerWidth,
        height: this.innerHeight,
      };

      // 创建对象
      clunchObject = new Clunch(config);
      return clunchObject;
    },
    doit(event) {
      // 如果没有创建就不需要处理
      if (!clunchObject) return;

      // #ifndef MP-ALIPAY
      clunchObject.$$trigger("mousemove", {
        left: event.touches[0].x,
        top: event.touches[0].y,
      });
      // #endif
      // #ifdef MP-ALIPAY
      uni
        .createSelectorQuery()
        .selectViewport()
        .scrollOffset()
        .exec((ret) => {
          clunchObject.$$trigger("mousemove", {
            left: event.touches[0].x + ret[0].scrollLeft,
            top: event.touches[0].y + ret[0].scrollTop,
          });
        });
      // #endif
    },
  },
};
</script>

<style>
/* 辅助的区域不应该可以看见 */
.region {
  position: fixed;
  left: 50000px;
}
</style>
