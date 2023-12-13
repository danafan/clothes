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
					<SettingButton :img="require('@/static/create_icon.png')" text="新建"/>
				</div>
			</div>
			<CustomTable :tableHeight="table_height" :titleList="titleList" :tableData="tableData" @sortChange="sortChange" @selectionChange="selectionChange"/>
		</div>
		<Pagination :page="page" :total="total" @changePage="changePage"/>
	</div>
</template>
<script>
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
				}],									//筛选条件
				active_index:0,						//当前选中的下标
				unfold:true,						//筛选条件是否展开
				date:[],							//时间选择
				xl_list:[{
					name:'系列1',
					id:1
				}],									//系列列表
				xl_ids:[],							//选中的系列
				category_list:[{
					name:'分类1',
					id:1
				}],									//产品分类列表
				category_ids:[],					//选中的产品分类
				pm:"",								//品名
				search:"",							//搜索内容
				price_type_list:[{
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
				}],									//价格类型列表
				price_type_id:"",					//选中的价格类型
				bottom_price:"",					//最低价
				top_price:"",						//最高价
				person_list:[{
					id:1,
					name:'人1'
				},{
					id:2,
					name:'人2'
				}],									//使用列表
				person_ids:[],						//选中的价格类型
				page:1,
				total:100,
				titleList:[{
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
				}],
				tableData:[{
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
				}],
				table_height:0
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
			CustomTable
		}
	}
</script>
<style lang="less" scoped>

</style>