<template>
	<div class="container">
		<img class="container" src="@/static/login_bg.png">
		<div class="login_box flex fc ac pt40">
			<div class="f26 login_title fw500 mb48">服装综合管理系统</div>
			<div class="f28 login_title bold mb50">扫码登录</div>
			<div class="qrcode border flex ac jsa">
				<PageButton text="供应商" @callback="login('15523556114924406')"/>
				<PageButton text="品牌" @callback="login('15740402149096123')"/>
			</div>
		</div>
	</div>
</template>
<script>
	import resource from '@/api/resource'
	import PageButton from '@/components/pageButton'
	export default{
		methods:{
			//点击登录
			login(admin_id){
				sessionStorage.setItem("admin_id",admin_id);
				this.$router.replace('/');
			}
		},
		components:{
			PageButton
		}
	}
</script>
<style lang="less" scoped>
	.login_box{
		position: absolute;
		top:50%;
		left: 50%;
		transform: translate(-50%,-50%);
		width: 478px;
		height: 610px;
		background: #FFFFFF;
		border-radius: 10px;
		border: 1px solid #EBEBEB;
		.qrcode{
			width: 340px;
			height: 340px;
		}
	}
</style>