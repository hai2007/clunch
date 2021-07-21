import toPx from './toPx';
Component({
    properties: {
        width: {
            type: [String, Number],
            default: "100vw",
        },
        height: {
            type: [String, Number],
            default: "100vh",
        }
    },
    data: {
        innerWidth: "400",
        innerHeight: "300"
    },
    mounted() {
        this.innerWidth = toPx(this.width);
        this.innerHeight = toPx(this.height);
    },
    methods: {

    }
})
