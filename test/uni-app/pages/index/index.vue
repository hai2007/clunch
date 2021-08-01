<template>
	<view>
		<ui-clunch ref='clunch'></ui-clunch>
	</view>
</template>

<script>
	import uiClunch from 'clunch/platform/uni-app/index.vue';
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		mounted() {
			let clunch = this.$refs.clunch.new({
				animation: false,
				template: `<circle c-on:mousemove='doit' :cx='_width*0.5' :cy='_height*0.5' :radius='_min*0.4'></circle>`,
				methods: {
					doit(target) {
						console.log(target);
					}
				}
			});
			console.log(clunch);
		},
		methods: {

		},
		components: {
			uiClunch
		}
	}
</script>

<style>

</style>
