
// 监听数据改变

export default function (that) {

    for (let key in that.__data) {

        let value = that.__data[key];

        that[key] = value;

        // 针对data进行拦截，后续对data的数据添加不会自动监听了
        // this.__data的数据是初始化以后的，后续保持不变，方便组件被重新使用（可能的设计，当前预留一些余地）
        // 当前对象数据会和方法一样直接挂载在根节点
        Object.defineProperty(that, key, {
            get() {
                return value;
            },
            set(newValue) {
                value = newValue;

                if (!that.__observeWatcher.flag) {
                    setTimeout(() => {

                        // 数据改变，触发更新
                        that.$$updateWithData();
                        that.__observeWatcher.flag = false;

                    }, 0);
                }

                // 如果在一次数据改变中，已经有了前置的数据改变，当前的就可以忽略处理了
                // （延迟0秒可以推迟到本次修改全部执行完毕再进行）
                that.__observeWatcher.flag = true;
            }
        });

    }

};
