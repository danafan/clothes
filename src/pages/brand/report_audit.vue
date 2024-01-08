<template>
	<div class="w_100 h_100 flex fc">
		<div class="flex jsb mb16">
			<PageRadio :radioList="radio_list" :activeIndex="active_index" @checkRadio="checkRadio"/>
			<div class="flex">
				<SettingButton :img="require('@/static/refresh_icon.png')" text="刷新" @callback="getData"/>
				<ScreenButton :unfold="unfold" @checkStatus="unfold = !unfold"/>
			</div>
		</div>
		<!-- 筛选条件 -->
		<div v-show="unfold">
			<el-form :inline="true">
				<el-form-item label="时间：">
					<el-date-picker v-model="date" unlink-panels type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="品类：">
					<el-select style="width:234px" v-model="cate_ids" clearable multiple filterable placeholder="请选择">
						<el-option v-for="item in cate_list" :key="item.category_id" :label="item.category_name" :value="item.category_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="品名：">
					<el-input style="width:234px" v-model="goods_name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="搜索：">
					<el-input style="width:198px" v-model="search" placeholder="款号/货号"></el-input>
				</el-form-item>
				<el-form-item>
					<PageButton @callback="changePage(1)"/>
				</el-form-item>
			</el-form>
		</div>
		<!-- 表格内容 -->
		<div class="table_content" id="table_content">
			<div class="p16 flex ac jsb" id="table_setting">
				<div class="flex ac table_color f14 fw500">数据列表（已选：<div class="login_title">{{goods_ids.length}}</div>）</div>
				<div class="flex">
					<SettingButton :img="require('@/static/send_audit.png')" text="批量审核" @callback="setFn(goods_ids,'all')"/>
				</div>
			</div>
			<CustomTable tableName="reportAudit" :tableHeight="table_height" :titleList="titleList" :tableData="tableData" :loading="loading" @selectionChange="selectionChange" @auditFn="setFn($event,'only')"/>
		</div>
		<Pagination :page="page" :pagesize="pagesize" :total="total" @changePage="changePage"/>
		<!-- 审核/批量审核 -->
		<custom-dialog dialogTitle="审核" ref="auditDialog" @callback="auditConfirm">
			<el-form label-position="left">
				<el-form-item>
					<el-radio-group v-model="type">
						<el-radio :label="1">通过</el-radio>
						<el-radio :label="2">拒绝</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="audit_type == 'all'">
					<div>勾选{{goods_ids.length}}个资料，确定全部{{type == 1?'通过':'拒绝'}}吗？</div>
				</el-form-item>
				<el-form-item label="审核备注：">
					<el-input style="width:256px;" :rows="4" type="textarea" v-model="remark" clearable></el-input>
				</el-form-item>
			</el-form>
		</custom-dialog>
	</div>
</template>
<script>
	import resource from '@/api/resource.js'

	import PageRadio from '@/components/pageRadio'
	import SettingButton from '@/components/settingButton'
	import ScreenButton from '@/components/screenButton'
	import PageButton from '@/components/pageButton'
	import Pagination from '@/components/pagination'
	import CustomTable from '@/components/customTable'
	import CustomDialog from '@/components/customDialog'
	export default{
		data(){
			return{
				radio_list:[
				{
					id:-1,
					name:'全部',
					icon:require('@/static/all_icon.png'),
					icon_active:require('@/static/all_icon_active.png'),
					unread:false
				},{
					id:0,
					name:'未上传',
					icon:require('@/static/uploaded_icon.png'),
					icon_active:require('@/static/uploaded_icon_active.png'),
					unread:false
				},{
					id:1,
					name:'待审核',
					icon:require('@/static/await_audit.png'),
					icon_active:require('@/static/await_audit_active.png'),
					unread:false
				},{
					id:2,
					name:'审核通过',
					icon:require('@/static/pass_icon.png'),
					icon_active:require('@/static/pass_icon_active.png'),
					unread:false
				},{
					id:3,
					name:'审核拒绝',
					icon:require('@/static/turn_down.png'),
					icon_active:require('@/static/turn_down_active.png'),
					unread:true
				},{
					id:4,
					name:'已撤销',
					icon:require('@/static/cancel_icon.png'),
					icon_active:require('@/static/cancel_icon_active.png'),
					unread:true
				}],					  //筛选条件
				active_index:0,						//当前选中的下标
				unfold:false,						//筛选条件是否展开
				date:[],							//时间选择
				cate_list:[],				  		//产品分类列表
				cate_ids:[],						//选中的产品分类
				goods_name:"",						//品名
				search:"",							//搜索内容
				page:1,
				pagesize:10,
				total:0,
				titleList:[
				{
					label:'品类',
					prop:'category_name',
				},{
					label:'品名',
					prop:'goods_name',
				},{
					label:'款号',
					prop:'style_name',
				},{
					label:'货号',
					prop:'cphh',
				},{
					label:'质检报告',
					prop:'quality_inspection_file_url',
					type:3
				},{
					label:'上传时间',
					prop:'quality_inspection_upload_time',
				},{
					label:'状态',
					prop:'status_name'
				},{
					label:'审核备注',
					prop:'quality_inspection_audit_remark'
				}
				],
				tableData:[],
				table_height:0,
				loading:false,
				goods_ids:[],						//当前勾选的商品ID
				goods_id:"",						//当前点击的商品ID
				type:1,								//审核默认选中类型
				audit_type:"",						//审核类型（单个、批量）
				remark:"",							//审核备注
			}
		},
		watch:{
			//展开/收起筛选条件
			unfold:function(n,o){
				//设置表格高度
				this.onResize();
			}
		},
		destroyed() {
			window.removeEventListener("resize", () => {});
		},
		mounted() {
    		//设置表格高度
			this.onResize();
			window.addEventListener("resize", this.onResize());
		},
		created(){
			//获取品类列表
			this.ajaxCates();
			//获取列表
			this.getData();
		},
		methods: {
    		//设置表格高度
			onResize() {
				this.$nextTick(() => {
					let table_content_height = document.getElementById("table_content").offsetHeight;
					let table_setting_height = document.getElementById("table_setting").offsetHeight;
					this.table_height = table_content_height - table_setting_height - 30;
				});
			},
			//获取品类列表
			ajaxCates(){
				resource.ajaxCates().then(res => {
					if (res.data.code == 1) {
						this.cate_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//获取列表
			getData(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					category_id:this.cate_ids.join(','),
					goods_name:this.goods_name,
					search:this.search,
					page:this.page,
					pagesize:this.pagesize
				}
				if(this.active_index > 0){
					arg['quality_inspection_status'] = this.radio_list[this.active_index].id;
				}
				this.loading = true;
				resource.qualityInspectionList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.tableData = data.data;
						this.tableData.map(item => {
							if(item.quality_inspection_status == 0){
								item['status_name'] = '未上传';
							}else if(item.quality_inspection_status == 1){
								item['status_name'] = '待审核';
							}else if(item.quality_inspection_status == 2){
								item['status_name'] = '审核通过';
							}else if(item.quality_inspection_status == 3){
								item['status_name'] = '审核拒绝';
							}else if(item.quality_inspection_status == 4){
								item['status_name'] = '已撤销';
							}
						})
						this.total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换单选
			checkRadio(index){
				this.active_index = index;
				//获取列表
				this.getData();
			},
			//切换页码
			changePage(page){
				this.page = page;
				//获取列表
				this.getData();
			},
			//列表监听多选
			selectionChange(selected_list){
				let goods_ids = selected_list.map(item => {
					return item.goods_id;
				})
				this.goods_ids = goods_ids;
			},
			//点击审核
			setFn(goods_id,type){
				this.audit_type = type;
				if(type == 'all' && goods_id.length == 0){
					this.$message.warning('请至少勾选一项！');
					return;
				}
				this.goods_id = type == 'all'?goods_id.join(','):goods_id;
				this.$refs.auditDialog.show_dialog = true;
			},
			//审核提交
			auditConfirm(){
				let arg = {
					goods_id:this.goods_id,
					type:this.type,
					remark:this.remark
				}
				resource.qualityInspectionAudit(arg).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
						//获取列表
						this.getData();
						this.$refs.auditDialog.show_dialog = false;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//监听排序
			sortChange(v){
				console.log(v)
			},
		},
		components:{
			PageRadio,
			SettingButton,
			ScreenButton,
			PageButton,
			Pagination,
			CustomTable,
			CustomDialog
		}
	}
</script>
<style lang="less" scoped>

</style>