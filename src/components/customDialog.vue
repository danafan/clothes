<template>
	<div>
		<el-dialog custom-class="dialog_style" width="420px" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" @close="$emit('close')" :visible.sync="show_dialog">
			<div class="flex ac jsb" slot="title">
				<div class="dialog_title">{{dialogTitle}}</div>
				<img class="close_dialog pointer" src="@/static/close_dialog.png" @click="show_dialog = false">
			</div>
			<slot></slot>
			<span slot="footer" class="dialog-footer flex jc">
				<PageButton text="取消" type="plain" @callback="show_dialog = false"/>
				<PageButton class="ml32" text="确定" @callback="$emit('callback')" v-if="showConfirm"/>
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
			dialogTitle:{
				type:String,
			default:''
			},
			//是否展示确认按钮
			showConfirm:{
				type:Boolean,
			default:true
			}
		},
		components:{
			PageButton
		}
	}
</script>
<style lang="less" scoped>
	.dialog_content{

	}
</style>