
// 监听画布大小改变

/**
 * 设计思路如下：
 * （这是监听对象ResizeObserver生效的情况，不生效的话，只初始化主动刷新一次）
 *
 * 遇到画布大小在改变
 * 1.如果有前置任务，就直接记录，说明当前画布在改变
 * 2.如果没有前置任务，就延迟执行，执行前判断当前画布是否在改变，如果在改变，延迟再判断，否则立刻更新
 */

export default function (that) {

    try {

        that.__observeResize.observer = new ResizeObserver(() => {

            // 如果前置任务都完成了
            if (!that.__observeResize.flag) {
                that.__observeResize.flag = true;

                // 既然前置任务已经没有了，那么就可以更新了？
                // 不是的，可能非常短的时间里，后续有改变
                // 因此延迟一点点来看看后续有没有改变
                // 如果改变了，就再延迟看看
                let interval = setInterval(() => {

                    // 判断当前是否可以立刻更新
                    if (that.__observeResize.help) {
                        clearInterval(interval);
                        that.__observeResize.flag = false;
                        that.$$updateWithSize();
                    }
                    that.__observeResize.help = true;

                }, 200);

            } else {
                that.__observeResize.help = false;
            }

        });

        // 监听
        that.__observeResize.observer.observe(that.__el);

    } catch (e) {

        that.$$updateWithSize();

        // 如果浏览器不支持此接口
        console.error('ResizeObserver undefined!');

    }

};
