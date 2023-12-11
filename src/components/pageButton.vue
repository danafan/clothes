<template>
	<div class="button_container flex ac ml16 pointer">
		<img class="button_img" :src="img">
		<div class="f14 space-nowrap">{{text}}</div>
	</div>
</template>
<script>
	export default{
		props:{
			img:{
				type:String,
			default:''
			},
			text:{
				type:String,
			default:''
			}
		}
	}
</script>
<style lang="less" scoped>
	.button_container{
		border: 1px solid #609DFF;
		border-radius: 4px;
		height: 32px;
		padding: 0 16px;
		color:#609DFF;
		.button_img{
			margin-right: 4px;
			width: 14px;
			height: 14px;
		}
	}
</style>