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
				<el-form-item label="品牌：">
					<el-select style="width:234px" v-model="brand_ids" multiple filterable placeholder="请选择品牌">
						<el-option v-for="item in brand_list" :key="item.brand_id" :label="item.brand_name" :value="item.brand_id">
						</el-option>
					</el-select>
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
					<el-input style="width:198px" v-model="search" placeholder="款号/货号/物流信息"></el-input>
				</el-form-item>
				<el-form-item>
					<el-checkbox size="medium" :true-label="1" :false-label="0" v-model="not_uploaded">未上传物流信息</el-checkbox>
				</el-form-item>
				<el-form-item>
					<PageButton @callback="changePage(1)"/>
				</el-form-item>
			</el-form>
		</div>
		<!-- 表格内容 -->
		<div class="table_content" id="table_content">
			<div class="p16 flex ac jsb" id="table_setting">
				<div class="flex ac table_color f14 fw500">数据列表（已选：<div class="login_title">{{selected_num}}</div>）</div>
				<div class="flex">
					<SettingButton :img="require('@/static/send_icon.png')" text="寄出样衣" @callback="setFn(goods_id,'sendAllDialog')"/>
					<!-- <SettingButton :img="require('@/static/export_icon.png')" text="导出" @callback="$refs.exportDialog.show_dialog = true"/> -->
					<!-- <SettingButton :img="require('@/static/import_icon.png')" text="导入"/> -->
				</div>
			</div>
			<CustomTable tableName="sendSample" :tableHeight="table_height" :titleList="titleList" :tableData="tableData" :loading="loading" @selectionChange="selectionChange" @sendFn="setFn($event,'sendDialog')" @cancelFn="setFn($event,'cancelDialog')"/>
		</div>
		<Pagination :page="page" :pagesize="pagesize" :total="total" @changePage="changePage"/>
		<!-- 寄出 -->
		<custom-dialog dialogTitle="上传寄样信息" ref="sendDialog" @close="closeSend" @callback="sendGoods">
			<el-form class="dialog_form" label-width="180">
				<el-form-item label="品名：">
					<div class="default_color f14 fw400">{{send_goods_name}}</div>
				</el-form-item>
				<el-form-item label="物流信息：">
					<el-input style="width:240px" v-model="logistics_name"></el-input>
				</el-form-item>
			</el-form>
		</custom-dialog>
		<!-- 批量寄出 -->
		<custom-dialog dialogTitle="上传寄样信息" ref="sendAllDialog" @callback="sendGoods">
			<div class="default_color f14 fw400">确定寄出选中的{{goods_id.split(',').length}}件样衣吗？</div>
		</custom-dialog>
		<!-- 撤销 -->
		<custom-dialog dialogTitle="撤销" ref="cancelDialog" @callback="sendGoodsCancel">
			<div class="default_color f14 fw400">确定要撤销商品寄出吗？</div>
		</custom-dialog>
		<!-- 导出 -->
		<custom-dialog dialogTitle="导出" ref="exportDialog" @callback="exportFn">
			<div class="default_color f14 fw400">确定导出吗？</div>
		</custom-dialog>
	</div>
</template>
<script>
	import resource from '@/api/resource.js'
	import { exportExcel } from "@/utils/export.js";

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
					name:'未寄出',
					icon:require('@/static/not_send.png'),
					icon_active:require('@/static/not_send_active.png'),
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
				unfold:true,						//筛选条件是否展开
				date:[],							//时间选择
				brand_list:[],						//品牌列表
				brand_ids:[],						//选中的品牌
				cate_list:[],				  		//产品分类列表
				cate_ids:[],						//选中的产品分类
				goods_name:"",						//品名
				search:"",							//搜索内容
				not_uploaded:0,						//未上传物流信息
				page:1,
				pagesize:10,
				total:0,
				titleList:[
				{
					label:'品牌',
					prop:'brand_name',
				},{
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
					label:'物流信息',
					prop:'logistics_name',
				},{
					label:'上传时间',
					prop:'send_upload_time',
				},{
					label:'状态',
					prop:'send_name',
				},{
					label:'审核备注',
					prop:'send_audit_remark',
				}
				],
				selected_num:0,						//已勾选的数量
				tableData:[],
				table_height:0,
				loading:false,
				goods_id:"",						//点击的商品
				ref_name:"",						//弹窗名称
				send_goods_name:"",					//寄出品名
				logistics_name:"",					//物流信息
			}
		},
		watch:{
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
			//获取品牌列表
			this.ajaxBrands();
			//获取品类列表
			this.ajaxCates();
			//获取商品寄样列表
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
			//获取品牌列表
			ajaxBrands(){
				resource.ajaxBrands().then(res => {
					if (res.data.code == 1) {
						this.brand_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
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
			//获取商品寄样列表
			getData(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					category_id:this.cate_ids.join(','),
					brand_id:this.brand_ids.join(','),
					goods_name:this.goods_name,
					search:this.search,
					page:this.page,
					pagesize:this.pagesize
				}
				if(this.active_index > 0){
					arg['send_status'] = this.radio_list[this.active_index].id;
				}
				this.loading = true;
				resource.supplierSendGoodsList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.tableData = data.data;
						this.tableData.map(item => {
							if(item.send_status == 0){
								item['send_name'] = '未寄出';
							}else if(item.send_status == 1){
								item['send_name'] = '待审核';
							}else if(item.send_status == 2){
								item['send_name'] = '审核通过';
							}else if(item.send_status == 3){
								item['send_name'] = '审核拒绝';
							}else if(item.send_status == 4){
								item['send_name'] = '已撤销';
							}
						})
						this.total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			exportFn(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					category_id:this.cate_ids.join(','),
					brand_id:this.brand_ids.join(','),
					goods_name:this.goods_name,
					search:this.search,
				}
				if(this.active_index > 0){
					arg['send_status'] = this.radio_list[this.active_index].id;
				}
				exportExcel(arg,'api/supplier_goods/send_goods_export');
				this.$refs.exportDialog.show_dialog = false;
			},	
			//点击寄出/撤销
			setFn(arg,ref_name){
				this.ref_name = ref_name;
				if(ref_name == 'sendDialog'){
					this.send_goods_name = arg.goods_name;
					this.goods_id = arg.goods_id.toString();
				}else{
					if(ref_name == 'sendAllDialog' && arg == ''){
						this.$message.warning('请至少勾选一项！');
						return;
					}
					this.goods_id = arg;
				}
				this.$refs[this.ref_name].show_dialog = true;
			},
			//寄出弹窗关闭
			closeSend(){
				this.goods_id = "";
				this.logistics_name = "";
			},
			//寄出提交
			sendGoods(){
				let arg = {
					goods_id:this.goods_id,
					logistics_name:this.send_goods_name
				}
				resource.supplierSendGoods(arg).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
						this.$refs[this.ref_name].show_dialog = false;
						//获取商品寄样列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//寄出撤销
			sendGoodsCancel(){
				let arg = {
					goods_id:this.goods_id
				}
				resource.supplierSendCancel(arg).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
						this.$refs[this.ref_name].show_dialog = false;
						//获取商品寄样列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//切换单选
			checkRadio(index){
				this.active_index = index;
				//获取商品寄样列表
				this.getData();
			},
			//切换页码
			changePage(page){
				this.page = page;
				//获取商品寄样列表
				this.getData();
			},
			//监听多选
			selectionChange(selected_list){
				this.selected_num = selected_list.length;
				let goods_ids = selected_list.map(item => {
					return item.goods_id;
				})
				this.goods_id = goods_ids.join(',');
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