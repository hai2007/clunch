const { evalExpress } = require('@hai2007/algorithm');

export default function (valExpress) {
    if (typeof (valExpress) == 'number') return valExpress;
    let systemInfo = wx.getSystemInfoSync();
    let _valExpress = valExpress
        .replace(/vw/g, '*vw')
        .replace(/vh/g, '*vh')
        .replace(/rpx/g, '*rpx')
        .replace(/([^r])px/g, '$1*px');
    return +(evalExpress({
        vw: systemInfo.windowWidth * 0.01,
        vh: systemInfo.windowHeight * 0.01,
        // 1/750 = 0.0013333
        rpx: systemInfo.windowWidth * 0.0013333,
        px: 1
    }, _valExpress).toFixed(0));
};
