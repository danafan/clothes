<template>
	<div class="relative">
		<el-table class="custom_table" :height="tableHeight" :data="tableData" :header-cell-style="{'background':'#E2EAFF','height':'88px','color':'#4E5969','font-size':'14px'}" :fit="false" @sort-change="sortChange" @selection-change="selectionChange" border>
			<el-table-column fixed align="center" type="selection" width="48">
			</el-table-column>
			<el-table-column fixed label="序号" align="center" type="index" width="60">
			</el-table-column>
			<el-table-column :label="item.label" :prop="item.prop" :width="flexColumnWidth(item.prop,item.label,tableData,item.sort)" :sortable="item.sort?item.sort:false" align="center" v-for="item in titleList">
				<template slot-scope="scope">
					<!-- 普通图片 -->
					<el-image class="relative" style="top: 3px;" :z-index="2006" :src="scope.row.zt" fit="scale-down" :preview-src-list="[scope.row.zt]" v-if="item.prop == 'zt'"></el-image>
					<!-- 轮播图片 -->
					<el-carousel ref="carouselRef" arrow="never" indicator-position="none" :autoplay="false" height="110px" v-else-if="item.prop == 'xjt'">
						<el-carousel-item v-for="(img_url,index) in scope.row.xjt" :key="index">
							<el-image :z-index="2006" :src="img_url" fit="scale-down" :preview-src-list="scope.row.xjt"></el-image>
						</el-carousel-item>
						<div class="carousel_arrow_row flex ac jsb">
							<img class="carousel_arrow pointer" src="@/static/carousel_left_arrow.png" @click="$refs.carouselRef[1].prev()">
							<img class="carousel_arrow pointer" src="@/static/carousel_right_arrow.png" @click="$refs.carouselRef[1].next()">
						</div>
					</el-carousel>
					<!-- 普通文字 -->
					<div class="table_cell table_color f14 fw500" v-else>{{scope.row[item.prop]}}</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
	export default{
		props:{
			//表格数据
			tableData:{
				type:Array,
			default:() => []
			},
			//表头列表
			titleList:{
				type:Array,
			default:() => []
			},
			//表格高度
			tableHeight:{
				type:Number,
			default:0
			}
		},
		methods:{
			//监听排序
			sortChange({ column, prop, order }){
				let sort = "";
				if(order){
					sort = prop + '-' + (order == 'ascending'?'1':'0');
				} else{
					sort = "";
				}   
				this.$emit('sortChange',sort);
			},
			//监听多选
			selectionChange(v){
				this.$emit('selectionChange',v);
			},
			// 自适应表格列宽
			flexColumnWidth(prop,label, tableData,sort) {
				prop = prop + ''
				let columnContent = ''
				if (!tableData || !tableData.length || tableData.length === 0 || tableData === undefined) {
					return
				}
				if (!prop || !prop.length || prop.length === 0 || prop === undefined) {
					return
				}
				// 获取该列中最长的数据(内容)
				let index = 0
				for (let i = 0; i < tableData.length; i++) {
					if (tableData[i][prop] === null) {
						return
					}
					const now_temp = tableData[i][prop] + ''
					const max_temp = tableData[index][prop] + ''
					if (now_temp.length > max_temp.length) {
						index = i
					}
				}
				columnContent = tableData[index][prop].length > label.length?tableData[index][prop]:label
			    // console.log('该列数据[i]:', columnContent)
			    // 以下分配的单位长度可根据实际需求进行调整
				let flexWidth = 0
				var regPos = /^[0-9]+.?[0-9]*/; //判断是否是数字。
				for (const char of columnContent) {
					if (char >= 'A' && char <= 'Z') { //大写英文
						flexWidth += 8
					}else if (char >= 'a' && char <= 'z') { //小写英文
						flexWidth += 8
					} else if (char >= '\u4e00' && char <= '\u9fa5') {	//中文
						flexWidth += 14
					}else if (regPos.test(char)) {	//数字
						flexWidth += 8.5
					} else {	// 其他
						flexWidth += 12
					}
				}
				if (flexWidth >= 275) {
        			// 设置最小宽度
					flexWidth = 275
				}
				if (flexWidth < 95) {
        			// 设置最小宽度
					flexWidth = flexWidth + 32
				}
				//处理排序
				if(tableData[index][prop].length <= label.length && sort){
					flexWidth += 14
				}
				//处理图片展示
				if(prop == 'zt'){
					flexWidth = 148
				}
				//处理走马灯展示
				if(prop == 'xjt'){
					flexWidth = 176
				}
				return flexWidth + 'px'
			}

		}
	}
</script>
<style type="text/css">
	.table_cell{
		white-space:normal;
		overflow:hidden;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-line-clamp:2;
		-webkit-box-orient:vertical;
	}
	.custom_table{
		position: absolute;
		width: 100%;
	}
	.custom_table .carousel_arrow_row{
		position: absolute;
		top: 50%;
		left: 0;
		transform: translate(0,-50%);
		width: 100%;
		z-index: 3;
	}
	.custom_table .carousel_arrow_row .carousel_arrow{
		width: 14px;
		height: 14px;
	}
	.custom_table .el-image{
		width: 115px;
		height: 110px;
	}
	.custom_table .el-image img{
		display: block;
	}
</style>
