// index.js
// 获取应用实例
const app = getApp()

Page({
    doit() {
        this.selectComponent('#clunch').new({
            template: `<circle c-on:mousemove='doit' fill-color='red' :cx='_width*0.5' :cy='_height*0.5' :radius='_min*0.5'></circle>`,
            methods: {
                doit(target) {
                    console.log(target);
                }
            }
        }, {

        }, clunch => {

            console.log(clunch);

        });

    }
});
