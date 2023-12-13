<template>
	<div class="upload_file relative flex ac">
		<div class="flex ac">
			<img class="file_icon" src="@/static/file_icon.png">
			<div class="upload_text default_color f14 fw400">选择上传文件</div>
		</div>
		<img class="delete_file pointer" src="@/static/delete_file.png" v-if="file_info">
		<input type="file" ref="csvUpload" class="upload_file_input" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadCsv">
		<div class="toast default_color f12 fw400">{{toast}}</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				upload_loading:false,			//上传中
				file_info:null,					//已上传的文件
			}
		},
		props:{
			//底部提示
			toast:{
				type:String,
			default:''
			}
		},
		methods:{
			//上传表格
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files;
					this.upload_loading = true;
					setTimeout(()=>{
						this.upload_loading = false;
						this.fileObj = '这是文件名称这是文件名称这是文件名称';
					},1000);
				}
			},
		}
	}
</script>
<style lang="less" scoped>
	.upload_file{
		padding-left: 16px;
		padding-right: 16px;
		width: 280px;
		height: 48px;
		background: #F7F8FA;
		border-radius: 12px;
		.file_icon{
			margin-right: 12px;
			width: 22px;
			height: 17px;
		}
		.upload_text{
			width: 190px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow:ellipsis;
		}
		.delete_file{
			width: 18px;
			height: 18px;
		}
		.upload_file_input{
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			width: 220px;
			height: 100%;
			opacity: 0;
		}
		.toast{
			position: absolute;
			left: 0;
			bottom: -18px;
			width: 100;
		}
	}
</style>