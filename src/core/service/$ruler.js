import ruler from '@hai2007/tool/ruler';

// 刻度计算
export default function (maxValue, minValue, num = 5) {

    let rulerArray = ruler(maxValue, minValue, num);

    return {
        min: rulerArray[0],
        max: rulerArray[rulerArray.length - 1],
        distance: rulerArray.length <= 1 ? 0 : rulerArray[1] - rulerArray[0],
        num: rulerArray.length - 1,
        ruler: rulerArray
    };
}
