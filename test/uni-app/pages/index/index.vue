<template>
	<view>
		<ui-clunch ref='clunch1' height='400px'></ui-clunch>
        <ui-clunch ref='clunch2' height='200px'></ui-clunch>
	</view>
</template>

<script>
	import uiClunch from 'clunch/platform/uni-app/index.vue';
	export default {
		mounted() {

			let clunch1 = this.$refs.clunch1.new({
				animation: false,
				template: `<circle c-on:mousemove='doit' :cx='_width*0.5' :cy='_height*0.5' :radius='_min*0.4'></circle>`,
				methods: {
					doit(target) {
						console.log(target);
					}
				}
			});
			console.log(clunch1);

            let clunch2 = this.$refs.clunch2.new({
				animation: false,
				template: `<rect c-on:mousemove='doit' :width='_width*0.5' :height='_height*0.5' x='10' y='10'></rect>`,
				methods: {
					doit(target) {
						console.log(target);
					}
				}
			});
			console.log(clunch2);

		},
		components: {
			uiClunch
		}
	}
</script>

<style>

</style>
