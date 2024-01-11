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
				<el-form-item label="系列：">
					<el-select style="width:234px" v-model="series_ids" clearable multiple filterable placeholder="请选择">
						<el-option v-for="item in series_list" :key="item.series_id" :label="item.series_name" :value="item.series_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="品类：">
					<el-select style="width:234px" v-model="cate_ids" clearable multiple filterable placeholder="请选择">
						<el-option v-for="item in cate_list" :key="item.category_id" :label="item.category_name" :value="item.category_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="产品名称：">
					<el-input style="width:234px" v-model="goods_name" clearable placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="搜索：">
					<el-input style="width:198px" v-model="search" clearable placeholder="款号/货号/商品编码"></el-input>
				</el-form-item>
				<el-form-item>
					<div class="flex">
						<el-select style="width:136px;margin-right: 8px;" v-model="price_type" placeholder="点击查看">
							<el-option v-for="item in price_type_list" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
						<el-input style="width:136px" type="number" clearable v-model="start_price" placeholder="最低价"></el-input>
						&nbsp
						~
						&nbsp
						<el-input style="width:136px" type="number" clearable v-model="end_price" placeholder="最高价"></el-input>
					</div>
				</el-form-item>
				<el-form-item label="使用人群：">
					<el-select style="width:234px" v-model="user_group" clearable multiple filterable placeholder="请选择">
						<el-option v-for="item in user_list" :key="item.wx_user_id" :label="item.wx_user_name" :value="item.wx_user_id">
						</el-option>
					</el-select>
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
					<SettingButton :img="require('@/static/jian_icon.png')" text="产品检验项目表"/>
					<SettingButton :img="require('@/static/send_audit.png')" text="发起审核" @callback="setFn(goods_id,'auditDialog')"/>
					<SettingButton :img="require('@/static/export_icon.png')" text="导出" @callback="$refs.exportDialog.show_dialog = true"/>
					<SettingButton :img="require('@/static/import_icon.png')" text="导入" @callback="$refs.importDialog.show_dialog = true"/>
					<SettingButton :img="require('@/static/create_icon.png')" text="新建" @callback="addEditFn('','add')"/>
				</div>
			</div>
			<CustomTable tableName="productInfo" :tableHeight="table_height" :titleList="titleList" :tableData="tableData" :loading="loading" @sortChange="sortChange" @selectionChange="selectionChange" @copyFn="addEditFn($event,'copy')" @editFn="addEditFn($event,'edit')" @deleteFn="setFn($event,'deleteDialog')" @auditFn="setFn($event,'auditDialog')" @cancelFn="setFn($event,'cancelDialog')"/>
		</div>
		<Pagination :page="page" :pagesize="pagesize" :total="total" @changePage="changePage"/>
		<!-- 新建/编辑 -->
		<el-dialog custom-class="dialog_style" top="24px" width="1204px" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" @close="resetInfo" :visible.sync="dialog">
			<div class="flex ac jsb" slot="title">
				<div class="dialog_title">{{dialog_type == 'add'?'新建':dialog_type == 'copy'?'复用新建':'编辑'}}商品</div>
				<img class="close_dialog pointer" src="@/static/close_dialog.png" @click="dialog = false">
			</div>
			<div>
				<div class="flex jsb mb16">
					<div>
						<div class="flex ac mb24">
							<div class="custom_label">品牌：</div>
							<el-select style="width:280px" v-model="info.brand_id" clearable @change="changeBrand">
								<el-option v-for="item in brand_list" :key="item.brand_id" :label="item.brand_name" :value="item.brand_id">
								</el-option>
							</el-select>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">系列：</div>
							<el-select style="width:280px" v-model="info.series_id" clearable>
								<el-option v-for="item in series_list" :key="item.series_id" :label="item.series_name" :value="item.series_id">
								</el-option>
							</el-select>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">季节：</div>
							<el-input style="width:280px" v-model="info.season" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">SKU：</div>
							<el-input style="width:280px" v-model="info.sku" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">商品单位：</div>
							<el-input style="width:280px" v-model="info.unit" clearable></el-input>
						</div>
						<div class="flex mb24">
							<div class="custom_label">主图：</div>
							<UploadImage text="上传一张主图" :imgStr="info.main_img" :request="dialog_type == 'add'" @callback="uploadImage($event,'main_img')"/>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">日常价：</div>
							<el-input type="number" style="width:280px" v-model="info.rcj" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">折扣：</div>
							<el-input type="number" style="width:280px" v-model="info.discount" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">产品卖点：</div>
							<el-input style="width:280px" v-model="info.selling_point" clearable></el-input>
						</div>
						<div class="flex ac">
							<div class="custom_label">规划色：</div>
							<el-input style="width:280px" v-model="info.plan_color" clearable></el-input>
						</div>
					</div>
					<div>
						<div class="flex ac mb24">
							<div class="custom_label">工艺资料包：</div>
							<UploadFile :fileName="info.technology_url" toast="只能上传.xls,.xlsx文件，且文件大小＜等于5MB" :request="dialog_type == 'add'" @callback="uploadFile($event,'technology_url')"/>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">品类：</div>
							<el-select style="width:280px" v-model="info.category_id" clearable>
								<el-option v-for="item in cate_list" :key="item.category_id" :label="item.category_name" :value="item.category_id">
								</el-option>
							</el-select>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">产品款号：</div>
							<el-input style="width:280px" v-model="info.style_name" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">产品货号：</div>
							<el-input style="width:280px" v-model="info.cphh" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">色号：</div>
							<el-input style="width:280px" v-model="info.color_number" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">吊牌价：</div>
							<el-input type="number" style="width:280px" v-model="info.dpj" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">活动价：</div>
							<el-input type="number" style="width:280px" v-model="info.hdj" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">规格（尺码）：</div>
							<el-input style="width:280px" v-model="info.spec" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">使用人群：</div>
							<el-select style="width:280px" v-model="info.user_group" clearable filterable allow-create default-first-option>
								<el-option v-for="item in user_group_list" :key="item" :label="item" :value="item">
								</el-option>
							</el-select>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">字体：</div>
							<el-input style="width:280px" v-model="info.typeface" clearable></el-input>
						</div>
						<div class="flex">
							<div class="custom_label">参考图案：</div>
							<el-input style="width:280px" v-model="info.reference_img" clearable></el-input>
						</div>
					</div>
					<div>
						<div class="flex ac mb24">
							<div class="custom_label">线性图稿：</div>
							<UploadFile :fileName="info.linear_draft_url" toast="只能上传.xls,.xlsx文件，且文件大小＜等于5MB" :request="dialog_type == 'add'" @callback="uploadFile($event,'linear_draft_url')"/>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">品名：</div>
							<el-input style="width:280px" v-model="info.goods_name" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">SPU：</div>
							<el-input style="width:280px" v-model="info.spu" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">颜色名称：</div>
							<el-input style="width:280px" v-model="info.color" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">大促价：</div>
							<el-input type="number" style="width:280px" v-model="info.dcj" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">材质：</div>
							<el-input style="width:280px" v-model="info.material_quality" clearable></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">预计上架时间：</div>
							<el-date-picker v-model="info.up_time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
							</el-date-picker>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">工艺：</div>
							<el-input style="width:280px" v-model="info.technology" clearable></el-input>
						</div>
						<div class="flex">
							<div class="custom_label">备注：</div>
							<el-input style="width:280px;" :rows="4" type="textarea" v-model="info.remark" clearable></el-input>
						</div>
					</div>
				</div>
				<div class="xjt flex">
					<div class="custom_label">细节图：</div>
					<UploadImage text="上传多张细节图" :maxNum="9" :imgStr="info.detail_imgs" :request="dialog_type == 'add'" @callback="uploadImage($event,'detail_imgs')"/>
				</div>
			</div>
			<div class="flex jc">
				<PageButton type="primary_big" text="确定" @callback="commitFn"/>
			</div>
		</el-dialog>
		<!-- 删除 -->
		<custom-dialog dialogTitle="删除" ref="deleteDialog" @callback="supplierGoodsDel">
			<div class="default_color f14 fw400">确定到删除该条资料内容吗？</div>
		</custom-dialog>
		<!-- 发起审核 -->
		<custom-dialog dialogTitle="发起审核" ref="auditDialog" @callback="supplierGoodsAudit">
			<div class="default_color f14 fw400">确定要发起选择的资料内容审核吗？</div>
		</custom-dialog>
		<!-- 撤销 -->
		<custom-dialog dialogTitle="撤销" ref="cancelDialog" @callback="supplierGoodsCancel">
			<div class="default_color f14 fw400">确定要撤销该条资料内容吗？</div>
		</custom-dialog>
		<!-- 导出 -->
		<custom-dialog dialogTitle="导出" ref="exportDialog" @callback="exportFn">
			<div class="default_color f14 fw400">确定导出吗？</div>
		</custom-dialog>
		<!-- 导入 -->
		<custom-dialog dialogTitle="导入商品资料" ref="importDialog" :showConfirm="false">
			<el-form class="dialog_form">
				<el-form-item>
					<div class="flex">
						<SettingButton margin="right" :img="require('@/static/download_icon.png')" text="下载模版" @callback="downTemplate"/>
						<SettingButton :isImport="true" :img="require('@/static/import_icon.png')" text="导入" @callback="importProductInfo"/>
					</div>
				</el-form-item>
				<el-form-item>
					<div class="flex">
						<div class="default_color f12 mr24">1.下载模板</div>
						<div class="default_color f12 mr24">2.填写商品资料</div>
						<div class="default_color f12">3.导入填写完的模板</div>
					</div>
				</el-form-item>
			</el-form>
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
	import UploadImage from '@/components/uploadImage'
	import UploadFile from '@/components/uploadFile'
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
				},
				{
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
					id:0,
					name:'已撤销',
					icon:require('@/static/cancel_icon.png'),
					icon_active:require('@/static/cancel_icon_active.png'),
					unread:true
				}
				],					  	  //筛选条件
				active_index:0,							//当前选中的下标
				date:[],								//时间选择
				series_list:[],					  		//系列列表
				series_ids:[],							//选中的系列
				cate_list:[],				  			//产品分类列表
				cate_ids:[],							//选中的产品分类
				brand_list:[],					  		//品牌列表
				user_group_list:[],						//使用人群列表
				goods_name:"",							//产品名称
				search:"",								//搜索内容
				price_type_list:[
				{
					id:1,
					name:'吊牌价'
				},{
					id:2,
					name:'日常价'
				},{
					id:3,
					name:'活动价'
				},{
					id:4,
					name:'大促价'
				}
				],				  	  //价格类型列表
				price_type:1,							//选中的价格类型
				start_price:"",							//最低价
				end_price:"",							//最高价
				user_list:[],				  			//使用人群
				user_group:[],							//选中的使用人群
				unfold:true,							//筛选条件是否展开
				page:1,
				pagesize:10,
				total:0,
				loading:false,
				titleList:[
				{
					label:'系列',
					prop:'series_name',
				},{
					label:'产品品类',
					prop:'category_name',
				},{
					label:'品名',
					prop:'goods_name',
				},{
					label:'季节',
					prop:'season',
				},{
					label:'产品款号',
					prop:'style_name',
				},{
					label:'产品货号',
					prop:'cphh',
				},{
					label:'SPU',
					prop:'spu',
				},{
					label:'SKU',
					prop:'sku',
				},{
					label:'色号',
					prop:'color_number',
				},{
					label:'颜色名称',
					prop:'color',
				},{
					label:'商品单位',
					prop:'unit',
				},{
					label:'主图',
					prop:'main_img',
					type:1
				},{
					label:'吊牌价',
					prop:'dpj',
				},{
					label:'日常价',
					prop:'rcj',
				},{
					label:'活动价',
					prop:'hdj',
				},{
					label:'大促价',
					prop:'dcj',
				},{
					label:'折扣',
					prop:'discount',
				},{
					label:'规格尺码',
					prop:'spec',
				},{
					label:'材质',
					prop:'material_quality',
				},{
					label:'产品卖点',
					prop:'selling_point',
				},{
					label:'使用人群',
					prop:'user_group',
				},{
					label:'细节图',
					prop:'detail_imgs',
					type:2
				},{
					label:'预计上架时间',
					prop:'up_time',
				},{
					label:'规划色',
					prop:'plan_color',
				},{
					label:'字体',
					prop:'typeface',
				},{
					label:'工艺',
					prop:'technology',
				},{
					label:'参考图案',
					prop:'reference_img'
				},{
					label:'备注补充内容',
					prop:'remark',
				},{
					label:'审核意见',
					prop:'brand_audit_remark',
				},{
					label:'知核意见',
					prop:'brand_zhyj',
				},{
					label:'工艺资料包',
					prop:'technology_url',
					type:3
				},{
					label:'线性图稿',
					prop:'linear_draft_url',
					type:3
				},{
					label:'新建时间',
					prop:'add_time',
				},{
					label:'状态',
					prop:'status_name',
				},{
					label:'品牌款号',
					prop:'brand_ksbm',
				},{
					label:'寄样物流信息',
					prop:'logistics_name',
				},{
					label:'质检报告',
					prop:'quality_inspection_file_url',
					type:3
				}
				],						  //表头信息
				selected_num:0,							//已选数量
				tableData:[],							//表格数据
				table_height:0,
				dialog:false,							//新建/编辑弹窗
				dialog_type:'',							//弹窗类型
				info:{
					brand_id:"",			
					series_id:"",		
					season:"",		
					sku:"",
					unit:"",
					main_img:"",
					rcj:"",
					discount:"",
					selling_point:"",
					plan_color:"",
					category_id:"",
					style_name:"",
					cphh:"",
					color_number:"",
					dpj:"",
					hdj:"",
					spec:"",
					user_group:"",
					typeface:"",
					reference_img:"",
					goods_name:"",
					spu:"",
					color:"",
					dcj:"",
					material_quality:"",
					up_time:"",
					technology:"",
					remark:"",
					detail_imgs:'',
					technology_url:'',
					linear_draft_url:'',
				},							  //添加/编辑弹窗数据
				goods_id:"",							//点击的商品ID
				ref_name:"",							//删除/发起审核/撤销弹窗名称
			}
		},
		watch:{
			//监听筛选条件是否展开
			unfold:function(n,o){
				//设置表格高度
				this.onResize();
			}
		},
		destroyed() {
			window.removeEventListener("resize", () => {});
		},
		created(){
			//获取系列列表
			this.ajaxSeries();
			//获取品类列表
			this.ajaxCates();
			//获取用户列表
			this.ajaxUsers();
			//获取品牌列表
			this.ajaxBrands();
			//使用人群列表
			this.ajaxUserGroup();
			//获取商品资料列表
			this.getData();
		},
		mounted() {
    		//设置表格高度
			this.onResize();
			window.addEventListener("resize", this.onResize());
		},
		computed:{
			//用户信息
			userInfo(){
				return this.$store.state.userInfo;
			}
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
			//切换品牌
			changeBrand(brand_id){
				this.info.series_id = "";
				this.info.category_id = "";
				//获取系列列表
				this.ajaxSeries(brand_id);
				//获取品类列表
				this.ajaxCates(brand_id);
			},
			//获取系列列表
			ajaxSeries(brand_id){
				let arg = {};
				if(brand_id){
					arg['brand_id'] = brand_id;
				}
				resource.ajaxSeries(arg).then(res => {
					if (res.data.code == 1) {
						this.series_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//获取品类列表
			ajaxCates(brand_id){
				let arg = {};
				if(brand_id){
					arg['brand_id'] = brand_id;
				}
				resource.ajaxCates(arg).then(res => {
					if (res.data.code == 1) {
						this.cate_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//获取用户列表
			ajaxUsers(){
				resource.ajaxUsers({type:2}).then(res => {
					if (res.data.code == 1) {
						this.user_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//获取品牌列表
			ajaxBrands(){
				resource.ajaxBrands({supplier_id:this.userInfo.supplier_id}).then(res => {
					if (res.data.code == 1) {
						this.brand_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//使用人群列表
			ajaxUserGroup(){
				resource.ajaxUserGroup().then(res => {
					if (res.data.code == 1) {
						this.user_group_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//获取商品资料列表
			getData(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					series_id:this.series_ids.join(','),
					category_id:this.cate_ids.join(','),
					goods_name:this.goods_name,
					search:this.search,
					price_type:this.price_type,
					start_price:this.start_price,
					end_price:this.end_price,
					user_group:this.user_group.join(','),
					page:this.page,
					pagesize:this.pagesize
				}
				if(this.active_index > 0){
					arg['supplier_status'] = this.radio_list[this.active_index].id;
				}
				this.loading = true;
				resource.supplierGoodsList(arg).then(res => {
					if (res.data.code == 1) {
						let data = res.data.data;
						this.tableData = data.data;
						this.tableData.map(item => {
							if(item.supplier_status == 0){
								item['status_name'] = '待发起';
							}else if(item.supplier_status == 1){
								item['status_name'] = '待审核';
							}else if(item.supplier_status == 2){
								item['status_name'] = '审核通过';
							}else if(item.supplier_status == 3){
								item['status_name'] = '审核拒绝';
							}
						})
						this.total = data.total;
						this.loading = false;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//切换单选
			checkRadio(index){
				this.active_index = index;
				//点击查询
				this.getData();
			},
			//切换页码
			changePage(page){
				this.page = page;
				//获取商品资料列表
				this.getData();
			},
			//导出
			exportFn(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					series_id:this.series_ids.join(','),
					category_id:this.cate_ids.join(','),
					goods_name:this.goods_name,
					search:this.search,
					price_type:this.price_type,
					start_price:this.start_price,
					end_price:this.end_price,
					user_group:this.user_group.join(',')
				}
				if(this.active_index > 0){
					arg['supplier_status'] = this.radio_list[this.active_index].id;
				}
				exportExcel(arg,'api/supplier_goods/export');
				this.$refs.exportDialog.show_dialog = false;
			},	
			//点击下载模版
			downTemplate(){
				window.open(`${this.downLoadUrl}/商品资料导入模板.xlsx`);
			},
			//导入提交
			importProductInfo(file){
				resource.importGoods({file:file}).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
						//获取列表
						this.getData();
						this.$refs.importDialog.show_dialog = false;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//上传图片回调
			uploadImage(img_arr,prop){
				this.info[prop] = img_arr.join(',');
			},
			//上传文件回调
			uploadFile(file_url,prop){
				this.info[prop] = file_url;
			},
			//弹窗确定
			commitFn(){
				if(this.info.brand_id == ''){
					this.$message.warning('请选择品牌！');
				}else if(this.info.series_id == ''){
					this.$message.warning('请选择系列！');
				}else if(this.info.season == ''){
					this.$message.warning('请输入季节！');
				}else if(this.info.sku == ''){
					this.$message.warning('请输入SKU！');
				}else if(this.info.unit == ''){
					this.$message.warning('请输入商品单位！');
				}else if(this.info.main_img == ''){
					this.$message.warning('请上传主图！');
				}else if(this.info.rcj == ''){
					this.$message.warning('请输入日常价！');
				}else if(this.info.discount == ''){
					this.$message.warning('请输入折扣！');
				}else if(this.info.selling_point == ''){
					this.$message.warning('请输入产品卖点！');
				}else if(this.info.plan_color == ''){
					this.$message.warning('请输入规划色！');
				}else if(this.info.detail_imgs == ''){
					this.$message.warning('至少上传一张细节图！');
				}else if(this.info.technology_url == ''){
					this.$message.warning('请上传工艺资料包！');
				}else if(this.info.category_id == ''){
					this.$message.warning('请选择品类！');
				}else if(this.info.style_name == ''){
					this.$message.warning('请输入产品款号！');
				}else if(this.info.cphh == ''){
					this.$message.warning('请输入产品货号！');
				}else if(this.info.color_number == ''){
					this.$message.warning('请输入色号！');
				}else if(this.info.dpj == ''){
					this.$message.warning('请输入吊牌价！');
				}else if(this.info.hdj == ''){
					this.$message.warning('请输入活动价！');
				}else if(this.info.spec == ''){
					this.$message.warning('请输入规格尺码！');
				}else if(this.info.user_group == ''){
					this.$message.warning('请选择使用人群！');
				}else if(this.info.typeface == ''){
					this.$message.warning('请输入字体！');
				}else if(this.info.reference_img == ''){
					this.$message.warning('请输入参考图案！');
				}else if(this.info.linear_draft_url == ''){
					this.$message.warning('请上传线性图稿！');
				}else if(this.info.goods_name == ''){
					this.$message.warning('请输入品名！');
				}else if(this.info.spu == ''){
					this.$message.warning('请输入SPU！');
				}else if(this.info.color == ''){
					this.$message.warning('请输入颜色名称！');
				}else if(this.info.dcj == ''){
					this.$message.warning('请输入大促价！');
				}else if(this.info.material_quality == ''){
					this.$message.warning('请输入材质！');
				}else if(!this.info.up_time){
					this.$message.warning('请选择预计上架时间！');
				}else if(this.info.technology == ''){
					this.$message.warning('请选择工艺！');
				}else{
					if(this.dialog_type == 'add' || this.dialog_type == 'copy'){//新建/复用新建
						resource.supplierGoodsAdd(this.info).then(res => {
							if (res.data.code == 1) {
								//获取商品资料列表
								this.getData();
								this.dialog = false;
								this.$message.success(res.data.msg)
							}else{
								this.$message.warning(res.data.msg)
							}
						})
					}else{								//编辑
						let arg = JSON.parse(JSON.stringify(this.info));
						arg['goods_id'] = this.goods_id;
						resource.supplierGoodsEditPost(arg).then(res => {
							if (res.data.code == 1) {
								//获取商品资料列表
								this.getData();
								this.dialog = false;
								this.$message.success(res.data.msg)
							}else{
								this.$message.warning(res.data.msg)
							}
						})
					}
				}
			},
			//弹窗关闭
			resetInfo(){
				for(let k in this.info){
					this.info[k] = "";
				}
			},
			//点击删除/发起审核/撤销审核
			setFn(goods_id,ref_name){
				this.ref_name = ref_name;
				if(goods_id == ''){
					this.$message.warning('请至少勾选一项！');
					return;
				}
				this.goods_id = goods_id;
				this.$refs[this.ref_name].show_dialog = true;
			},
			//删除提交
			supplierGoodsDel(){
				resource.supplierGoodsDel({goods_id:this.goods_id}).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
						this.$refs[this.ref_name].show_dialog = false;
						//获取商品资料列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//发起审核提交
			supplierGoodsAudit(){
				resource.supplierGoodsAudit({goods_id:this.goods_id}).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
						this.$refs[this.ref_name].show_dialog = false;
						//获取商品资料列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//撤销审核提交
			supplierGoodsCancel(){
				resource.supplierGoodsCancel({goods_id:this.goods_id}).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
						this.$refs[this.ref_name].show_dialog = false;
						//获取商品资料列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//点击新建/编辑
			addEditFn(goods_id,type){
				this.dialog_type = type;
				if(this.dialog_type == 'add'){
					this.dialog = true;
				}else if(this.dialog_type == 'copy'){
					resource.supplierGoodsEditGet({goods_id:goods_id}).then(res => {
						if (res.data.code == 1) {
							let data = res.data.data;
							data['detail_imgs'] = data.detail_imgs.join(',');
							for(let k in this.info){
								this.info[k] = data[k]
							}
							this.dialog = true;
						}else{
							this.$message.warning(res.data.msg)
						}
					})
				}else{
					this.goods_id = goods_id;
					resource.supplierGoodsEditGet({goods_id:this.goods_id}).then(res => {
						if (res.data.code == 1) {
							let data = res.data.data;
							data['detail_imgs'] = data.detail_imgs.join(',');
							for(let k in this.info){
								this.info[k] = data[k]
							}
							this.dialog = true;
						}else{
							this.$message.warning(res.data.msg)
						}
					})
				}
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
			UploadImage,
			UploadFile,
			CustomDialog
		}
	}
</script>
<style lang="less" scoped>
	.xjt{
		width: 486px;
	}
</style>