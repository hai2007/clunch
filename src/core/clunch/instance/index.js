import { initMixin } from './init';
import { lifecycleMixin } from './lifecycle';
import { updateMixin } from './update';
import { isArray } from '@hai2007/tool/type';
import serviceFactory from '../../service/index';
import watcher from '../observe/watcher';

// Clunch对象

function Clunch(options) {

    if (!(this instanceof Clunch)) {

        // 必须使用 ```new Clunch()``` 的方式创建对象
        console.error('Clunch is a constructor and should be called with the `new` keyword');
        return;
    }

    // 对生命周期钩子进行预处理

    [
        'beforeCreate', 'created',
        'beforeMount', 'mounted',
        'beforeUnmount', 'unmounted',
        'beforeUpdate', 'updated',
        'beforeResize', 'resized',
        'beforeDestroy', 'destroyed'
    ].forEach(item => {
        if (isArray(options[item])) {
            options[item] = serviceFactory(options[item]);
        }
    });

    this.$$lifecycle(options.beforeCreate);

    // 创建对象
    this.$$init(options);

    // 对象创建好了以后，启动监听
    /**
     * 由于wactch监听的源头来自options
     * 如果监听在钩子created之后进行
     * 会导致此钩子设置的数据可能被监听函数忽略
     * 因此，我们这里就提前了此操作
     * 避免出现意料之外的错误
     */
    watcher(this);

    this.$$lifecycle('created');

    // 挂载
    this.$mount(options.el);

}

// 在对象上挂载最基础的一些功能

initMixin(Clunch);
lifecycleMixin(Clunch);
updateMixin(Clunch);

// 初始化方法
// （主要是内部使用，和创建的对象无关的初始化）
// 需要特别注意的是，原型上的东西会在所有对象上面共享

// 记录挂载的组件
Clunch.prototype.__defineSerirs = {};

export default Clunch;
