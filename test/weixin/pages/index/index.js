// index.js
// 获取应用实例
const app = getApp()

Page({
    doit() {
        this.selectComponent('#clunch').new({
            template: `<circle c-on:mousemove='doit' :cx='100' :cy='100' :radius='70'></circle>`,
            methods: {
                doit(target) {
                    console.log(target);
                }
            }
        }, clunch => {

            console.log(clunch);

        });

    }
});
