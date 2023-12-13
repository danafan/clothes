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
					<el-date-picker style="width:234px" v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="系列：">
					<el-select style="width:234px" v-model="xl_ids" multiple placeholder="请选择">
						<el-option v-for="item in xl_list" :key="item.id" :label="item.name" :value="item.id">
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
					<el-input style="width:198px" v-model="search" placeholder="款号/货号/商品编码"></el-input>
				</el-form-item>
				<el-form-item>
					<div class="flex">
						<el-select style="width:136px;margin-right: 8px;" v-model="price_type_id" placeholder="点击查看">
							<el-option v-for="item in price_type_list" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
						<el-input style="width:136px" type="number" v-model="bottom_price" placeholder="最低价"></el-input>
						&nbsp
						~
						&nbsp
						<el-input style="width:136px" type="number" v-model="top_price" placeholder="最高价"></el-input>
					</div>
				</el-form-item>
				<el-form-item label="使用人群：">
					<el-select style="width:234px" v-model="person_ids" multiple placeholder="请选择">
						<el-option v-for="item in person_list" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
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
					<SettingButton :img="require('@/static/jian_icon.png')" text="产品检验项目表"/>
					<SettingButton :img="require('@/static/send_audit.png')" text="发起审核"/>
					<SettingButton :img="require('@/static/export_icon.png')" text="导出"/>
					<SettingButton :img="require('@/static/import_icon.png')" text="导入"/>
					<SettingButton :img="require('@/static/create_icon.png')" text="新建" @callback="dialog = true"/>
				</div>
			</div>
			<CustomTable :tableHeight="table_height" :titleList="titleList" :tableData="tableData" @sortChange="sortChange" @selectionChange="selectionChange"/>
		</div>
		<Pagination :page="page" :total="total" @changePage="changePage"/>
		<!-- 新建/编辑 -->
		<el-dialog title="收货地址" custom-class="dialog_style" top="24px" width="1204px" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="dialog">
			<div class="flex ac jsb" slot="title">
				<div class="dialog_title">添加分类</div>
				<img class="close_dialog pointer" src="@/static/close_dialog.png" @click="dialog = false">
			</div>
			<div>
				<div class="flex jsb mb16">
					<div>
						<div class="flex ac mb24">
							<div class="custom_label">品牌：</div>
							<el-select style="width:280px" v-model="info.pp_ids" multiple placeholder="请选择">
								<el-option v-for="item in pp_list" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">系列：</div>
							<el-select style="width:280px" v-model="info.xl_ids" multiple placeholder="请选择">
								<el-option v-for="item in xl_list" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">季节：</div>
							<el-select style="width:280px" v-model="info.jj_ids" multiple placeholder="请选择">
								<el-option v-for="item in jj_list" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">SKU：</div>
							<el-input style="width:280px" v-model="info.sku"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">商品单位：</div>
							<el-input style="width:280px" v-model="info.goods_unit"></el-input>
						</div>
						<div class="flex mb24">
							<div class="custom_label">主图：</div>
							<UploadImage text="上传一张主图" :previewImages="info.main_image"/>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">日常价：</div>
							<el-input type="number" style="width:280px" v-model="info.daily_price"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">折扣：</div>
							<el-input type="number" style="width:280px" v-model="info.discount"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">产品卖点：</div>
							<el-input style="width:280px" v-model="info.selling_point"></el-input>
						</div>
						<div class="flex ac">
							<div class="custom_label">规划色：</div>
							<el-input style="width:280px" v-model="info.plan_color"></el-input>
						</div>
					</div>
					<div>
						<div class="flex ac mb24">
							<div class="custom_label">工艺资料包：</div>
							<UploadFile toast="只能上传.xls,.xlsx文件，且文件大小＜等于5MB"/>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">品类：</div>
							<el-select style="width:280px" v-model="info.category_ids" multiple placeholder="请选择">
								<el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">产品款号：</div>
							<el-input style="width:280px" v-model="info.ksbm"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">色号：</div>
							<el-input style="width:280px" v-model="info.color_num"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">吊牌价：</div>
							<el-input type="number" style="width:280px" v-model="info.tag_price"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">基本非基本：</div>
							<el-input style="width:280px" v-model="info.is_jb"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">活动价：</div>
							<el-input type="number" style="width:280px" v-model="info.active_price"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">规格（尺码）：</div>
							<el-input style="width:280px" v-model="info.size"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">使用人群：</div>
							<el-select style="width:280px" v-model="info.person_ids" multiple placeholder="请选择">
								<el-option v-for="item in person_list" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">字体：</div>
							<el-input style="width:280px" v-model="info.font"></el-input>
						</div>
						<div class="flex">
							<div class="custom_label">参考图案：</div>
							<el-input style="width:280px;" :rows="4" type="textarea" v-model="info.reference_pattern"></el-input>
						</div>
					</div>
					<div>
						<div class="flex ac mb24">
							<div class="custom_label">线性图稿：</div>
							<UploadFile toast="只能上传.xls,.xlsx文件，且文件大小＜等于5MB"/>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">品名：</div>
							<el-input style="width:280px" v-model="info.goods_name"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">SPU：</div>
							<el-input style="width:280px" v-model="info.spu"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">颜色名称：</div>
							<el-input style="width:280px" v-model="info.color_name"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">价位：</div>
							<el-input type="number" style="width:280px" v-model="info.price"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">品种细分：</div>
							<el-input style="width:280px" v-model="info.breed"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">大促价：</div>
							<el-input type="number" style="width:280px" v-model="info.promotional_price"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">材质：</div>
							<el-input style="width:280px" v-model="info.promotional_price"></el-input>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">预计上架时间：</div>
							<el-date-picker style="width:280px" v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
						</div>
						<div class="flex ac mb24">
							<div class="custom_label">工艺：</div>
							<el-input style="width:280px" v-model="info.technology"></el-input>
						</div>
						<div class="flex">
							<div class="custom_label">备注：</div>
							<el-input style="width:280px;" :rows="4" type="textarea" v-model="info.remark"></el-input>
						</div>
					</div>
				</div>
				<div class="xjt flex">
					<div class="custom_label">细节图：</div>
					<UploadImage text="上传多张细节图" :maxNum="9" :previewImages="info.xjt"/>
				</div>
			</div>
			<div class="flex jc">
				<PageButton type="primary_big" text="确定" @callback="dialog = false"/>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import PageRadio from '@/components/pageRadio'
	import SettingButton from '@/components/settingButton'
	import ScreenButton from '@/components/screenButton'
	import PageButton from '@/components/pageButton'
	import Pagination from '@/components/pagination'
	import CustomTable from '@/components/customTable'
	import UploadImage from '@/components/uploadImage'
	import UploadFile from '@/components/uploadFile'
	export default{
		data(){
			return{
				radio_list:[
				{
					id:1,
					name:'待审核',
					icon:require('@/static/await_audit.png'),
					icon_active:require('@/static/await_audit_active.png'),
					unread:false
				},{
					id:2,
					name:'已通过',
					icon:require('@/static/pass_icon.png'),
					icon_active:require('@/static/pass_icon_active.png'),
					unread:false
				},{
					id:3,
					name:'已拒绝',
					icon:require('@/static/turn_down.png'),
					icon_active:require('@/static/turn_down_active.png'),
					unread:true
				},{
					id:4,
					name:'全部',
					icon:require('@/static/all_icon.png'),
					icon_active:require('@/static/all_icon_active.png'),
					unread:false
				}
				],					  //筛选条件
				active_index:0,						//当前选中的下标
				unfold:true,						//筛选条件是否展开
				date:[],							//时间选择
				xl_list:[{
					name:'系列1',
					id:1
				}],					  //系列列表
				xl_ids:[],							//选中的系列
				category_list:[{
					name:'分类1',
					id:1
				}],				  //产品分类列表
				category_ids:[],					//选中的产品分类
				pp_list:[{
					name:'品牌1',
					id:1
				}],					  //品牌列表
				pm:"",								//品名
				search:"",							//搜索内容
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
				],				  //价格类型列表
				price_type_id:"",					//选中的价格类型
				bottom_price:"",					//最低价
				top_price:"",						//最高价
				person_list:[{
					id:1,
					name:'人1'
				}],				  //使用人群
				person_ids:[],						//选中的价格类型
				jj_list:[{
					id:1,
					name:'季节'
				}],
				page:1,
				total:100,
				titleList:[
				{
					label:'系列',
					prop:'xl',
					sort:true,
				},{
					label:'主图',
					prop:'zt',
				},{
					label:'细节图',
					prop:'xjt',
				},{
					label:'产品品类',
					prop:'pl',
				},{
					label:'品名',
					prop:'pm',
				},{
					label:'季节',
					prop:'jj',
				},{
					label:'产品款号',
					prop:'cpkh',
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
					prop:'sh',
				},{
					label:'颜色名称颜色',
					prop:'ysmc',
				}
				],
				tableData:[
				{
					xl:'无',
					zt:'http://select.img.92nu.com/test/20231115100508_dingd_id_5535.png',
					xjt:['http://select.img.92nu.com/test/20231115100508_dingd_id_5535.png','http://select.img.92nu.com/test/20231115100511_dingd_id_1042.png','http://select.img.92nu.com/test/20231115100511_dingd_id_8702.png'],
					pl:'羽绒服羽绒服',
					pm:'短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服',
					jj:'冬季',
					cpkh:'KOD9',
					cphh:'FEDFGBFFFGDFFEDFGBFFFGDF',
					spu:'12345678902435463761',
					sku:'135er4y45d53te64gft3',
					sh:'1E5ErGy45d53tE64gfE3',
					ysmc:'米白09'
				},{
					xl:'无',
					zt:'http://select.img.92nu.com/test/20231115100508_dingd_id_5535.png',
					xjt:['http://select.img.92nu.com/test/20231115100508_dingd_id_5535.png','http://select.img.92nu.com/test/20231115100511_dingd_id_1042.png','http://select.img.92nu.com/test/20231115100511_dingd_id_8702.png'],
					pl:'羽绒服羽绒服',
					pm:'短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服',
					jj:'冬季',
					cpkh:'KOD9',
					cphh:'FEDFGBFFFGDFFEDFGBFFFGDF',
					spu:'12345678902435463761',
					sku:'135er4y45d53te64gft3',
					sh:'1E5ErGy45d53tE64gfE3',
					ysmc:'米白09'
				},{
					xl:'无',
					zt:'http://select.img.92nu.com/test/20231115100508_dingd_id_5535.png',
					xjt:['http://select.img.92nu.com/test/20231115100508_dingd_id_5535.png','http://select.img.92nu.com/test/20231115100511_dingd_id_1042.png','http://select.img.92nu.com/test/20231115100511_dingd_id_8702.png'],
					pl:'羽绒服羽绒服',
					pm:'短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服',
					jj:'冬季',
					cpkh:'KOD9',
					cphh:'FEDFGBFFFGDFFEDFGBFFFGDF',
					spu:'12345678902435463761',
					sku:'135er4y45d53te64gft3',
					sh:'1E5ErGy45d53tE64gfE3',
					ysmc:'米白09'
				},{
					xl:'无',
					zt:'http://select.img.92nu.com/test/20231115100508_dingd_id_5535.png',
					xjt:['http://select.img.92nu.com/test/20231115100508_dingd_id_5535.png','http://select.img.92nu.com/test/20231115100511_dingd_id_1042.png','http://select.img.92nu.com/test/20231115100511_dingd_id_8702.png'],
					pl:'羽绒服羽绒服',
					pm:'短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服短款羽绒服',
					jj:'冬季',
					cpkh:'KOD9',
					cphh:'FEDFGBFFFGDFFEDFGBFFFGDF',
					spu:'12345678902435463761',
					sku:'135er4y45d53te64gft3',
					sh:'1E5ErGy45d53tE64gfE3',
					ysmc:'米白09'
				}
				],
				table_height:0,
				dialog:false,						//新建/编辑弹窗
				info:{
					pp_ids:[],			
					xl_ids:[],		
					jj_ids:[],		
					sku:"",
					goods_unit:"",
					main_image:['20231115100511_dingd_id_1042.png'],
					daily_price:"",
					discount:"",
					selling_point:"",
					plan_color:"",
					xjt:['20231115100508_dingd_id_5535.png',
						'20231115100511_dingd_id_1042.png',
						'20231115100511_dingd_id_8702.png'],
					category_ids:[],
					ksbm:"",
					color_num:"",
					tag_price:"",
					is_jb:"",
					active_price:"",
					size:"",
					person_ids:"",
					font:"",
					reference_pattern:"",
					goods_name:"",
					spu:"",
					color_name:"",
					price:"",
					breed:"",
					promotional_price:"",
					material:"",
					date:[],
					technology:"",
					remark:""
				},										//添加/编辑弹窗数据
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
		methods: {
    		//设置表格高度
			onResize() {
				this.$nextTick(() => {
					let table_content_height = document.getElementById("table_content").offsetHeight;
					let table_setting_height = document.getElementById("table_setting").offsetHeight;
					this.table_height = table_content_height - table_setting_height - 30;
				});
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
			CustomTable,
			UploadImage,
			UploadFile
		}
	}
</script>
<style lang="less" scoped>
	.xjt{
		width: 486px;
	}
</style>