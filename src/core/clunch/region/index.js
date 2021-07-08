import _painter from '../../painter/index';
import getStyle from '../../../tool/get-style';
import { position } from '../../../tool/event';
import { initPainterConfig } from '../../painter/config';

// 区域对象，用于存储区域信息,解决canvas交互问题

export default function (that, el) {

    let _width = 1, _height = 1;

    let regions = {},//区域映射表
        regions_data = {},//记录区域数据
        rgb = [0, 0, 0],//区域标识色彩,rgb(0,0,0)表示空白区域
        p = 'r';//色彩增值位置

    // 用于计算包含关系的画板
    let canvas, painter;

    if (that._platform == 'default') {
        canvas = document.createElement('canvas');
        painter = _painter(that._platform, canvas, 1, 1);
    } else {
        canvas = el.region;
        painter = _painter(that._platform, {
            painter: el.region
        }, el.width, el.height);
        _width = el.width;
        _height = el.height;
    }

    return {

        // 非默认平台的draw方法
        "draw": function () {
            canvas.draw();
        },

        // 擦除
        "erase": function () {
            painter.config({
                fillStyle: 'rgb(255,255,255)'
            }).fillRect(0, 0, _width, _height);
        },

        // 更新大小
        "updateSize": function (width, height) {

            _width = width;
            _height = height;
            if (that._platform == 'default') {
                painter = _painter(that._platform, canvas, width, height);
            } else {
                painter = _painter(that._platform, {
                    painter: el.region
                }, width, height);
            }

        },

        // 绘制（添加）区域范围
        /**
         * region_id：区域唯一标识（一个标签上可以维护多个区域）
         */
        "painter": function (region_id, data) {

            if (regions[region_id] == undefined) {
                regions[region_id] = {
                    'r': function () {
                        rgb[0] += 1;
                        p = 'g';
                        return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                    },
                    'g': function () {
                        rgb[1] += 1;
                        p = 'b';
                        return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                    },
                    'b': function () {
                        rgb[2] += 1;
                        p = 'r';
                        return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                    }
                }[p]();
            }
            regions_data[region_id] = data;

            painter.config(initPainterConfig).config({
                fillStyle: regions[region_id],
                strokeStyle: regions[region_id]
            });

            return painter;

        },

        // 获取此刻鼠标所在区域
        "getRegion": function (event, doback) {

            let pos = position(that.__canvas, event), currentRGBA;

            let doSearch = () => {
                // 查找当前点击的区域
                for (let i in regions) {
                    if ("rgb(" + currentRGBA[0] + "," + currentRGBA[1] + "," + currentRGBA[2] + ")" == regions[i]) {
                        doback([i, pos.x, pos.y, regions_data[i]]);
                        return;
                    }
                }

                // 说明当前不在任何区域
                doback([null, pos.x, pos.y, undefined]);
            };

            if (that._platform == 'default') {

                pos.x -= getStyle(that.__canvas, 'border-left-width').replace('px', '');
                pos.y -= getStyle(that.__canvas, 'border-top-width').replace('px', '');

                currentRGBA = canvas.getContext("2d").getImageData(pos.x * 2 - 0.5, pos.y * 2 - 0.5, 1, 1).data;

                doSearch();

            } else {

                that.__options.el.getRegionColor({
                    x: pos.x - 0.5,
                    y: pos.y - 0.5,
                    width: 1,
                    height: 1,
                    canvasId: that.__options.el.regionid,
                    success: function success(res) {
                        currentRGBA = res.data;
                        doSearch();
                    },
                    fail: function fail(error) {
                        throw new Error(error);
                    }

                });
            }

        }

    };

};
