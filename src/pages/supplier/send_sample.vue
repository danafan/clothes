<template>
	<div class="w_100 h_100 flex fc">
		<div class="flex jsb mb16">
			<PageRadio :radioList="radio_list" :activeIndex="active_index" @checkRadio="checkRadio"/>
			<div class="flex">
				<SettingButton :img="require('@/static/refresh_icon.png')" text="刷新"/>
				<ScreenButton :unfold="unfold" @checkStatus="unfold = !unfold"/>
			</div>
		</div>
		<!-- 筛选条件 -->
		<div v-show="unfold">
			<el-form :inline="true">
				<el-form-item label="时间：">
					<el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="品牌：">
					<el-select style="width:234px" v-model="pp_ids" multiple placeholder="请选择">
						<el-option v-for="item in pp_list" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="品类：">
					<el-select style="width:234px" v-model="category_ids" multiple placeholder="请选择">
						<el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="品名：">
					<el-input style="width:234px" v-model="pm" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="搜索：">
					<el-input style="width:198px" v-model="search" placeholder="款号/货号/物流信息"></el-input>
				</el-form-item>
				<el-form-item>
					<PageButton/>
				</el-form-item>
			</el-form>
		</div>
		<!-- 表格内容 -->
		<div class="table_content" id="table_content">
			<div class="p16 flex ac jsb" id="table_setting">
				<div class="table_color f14 fw500">数据列表</div>
				<div class="flex">
					<SettingButton :img="require('@/static/send_icon.png')" text="寄出样衣"/>
					<SettingButton :img="require('@/static/export_icon.png')" text="导出"/>
					<SettingButton :img="require('@/static/import_icon.png')" text="导入"/>
				</div>
			</div>
			<CustomTable tableName="sendSample" :tableHeight="table_height" :titleList="titleList" :tableData="tableData" :loading="loading"/>
			<!-- <CustomTable :tableHeight="table_height" :titleList="titleList" :tableData="tableData" @sortChange="sortChange" @selectionChange="selectionChange"/> -->
		</div>
		<Pagination :page="page" :total="total" @changePage="changePage"/>
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
	export default{
		data(){
			return{
				radio_list:[{
					id:1,
					name:'未上传物流信息',
					icon:require('@/static/uploaded_icon.png'),
					icon_active:require('@/static/uploaded_icon_active.png'),
					unread:false
				},{
					id:2,
					name:'样衣审核通过',
					icon:require('@/static/pass_icon.png'),
					icon_active:require('@/static/pass_icon_active.png'),
					unread:false
				},{
					id:3,
					name:'样衣审核拒绝',
					icon:require('@/static/turn_down.png'),
					icon_active:require('@/static/turn_down_active.png'),
					unread:true
				},{
					id:4,
					name:'全部',
					icon:require('@/static/all_icon.png'),
					icon_active:require('@/static/all_icon_active.png'),
					unread:false
				}],									//筛选条件
				active_index:0,						//当前选中的下标
				unfold:true,						//筛选条件是否展开
				date:[],							//时间选择
				pp_list:[{
					name:'品牌1',
					id:1
				}],									//品牌列表
				pp_ids:[],							//选中的品牌
				category_list:[{
					name:'分类1',
					id:1
				}],									//产品分类列表
				category_ids:[],					//选中的产品分类
				pm:"",								//品名
				search:"",							//搜索内容
				page:1,
				total:100,
				titleList:[{
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
				}],
				tableData:[],
				table_height:0,
				loading:false
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
			//获取商品寄样列表
			getData(){
				this.loading = true;
				resource.supplierSendGoodsList().then(res => {
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
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换单选
			checkRadio(index){
				this.active_index = index;
			},
			//切换页码
			changePage(page){
				console.log(page)
			},
			//监听排序
			sortChange(v){
				console.log(v)
			},
			//监听多选
			selectionChange(selected_list){
				console.log(selected_list)
			}
		},
		components:{
			PageRadio,
			SettingButton,
			ScreenButton,
			PageButton,
			Pagination,
			CustomTable
		}
	}
</script>
<style lang="less" scoped>

</style>