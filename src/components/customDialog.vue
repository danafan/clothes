<template>
	<div>
		<el-dialog custom-class="dialog_style" width="420px" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="show_dialog">
			<div class="flex ac jsb" slot="title">
				<div class="dialog_title">{{dialog_title}}</div>
				<img class="close_dialog pointer" src="@/static/close_dialog.png" @click="show_dialog = false">
			</div>
			<div class="carousel_container relative" v-if="show_dialog">
				
			</div>
			<span slot="footer" class="dialog-footer">
				<PageButton/>
				<PageButton/>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import PageButton from '@/components/pageButton'
	export default{
		data(){
			return{
				show_dialog:false
			}
		},
		props:{
			//弹窗标题
			dialog_title:{
				type:String,
			default:''
			}
		},
		components:{
			PageButton
		}
	}
</script>
<style lang="less" scoped>
	
</style>