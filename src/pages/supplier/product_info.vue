<template>
	<div>
		<div class="flex jsb mb24">
			<PageRadio :radioList="radio_list" :activeIndex="active_index" @checkRadio="checkRadio"/>
			<div class="flex">
				<PageButton :img="require('@/static/refresh_icon.png')" text="刷新"/>
				<ScreenButton :unfold="unfold" @checkStatus="unfold = !unfold"/>
			</div>
		</div>
		<div class="screen_content">
			<el-form :inline="true">
				<el-form-item label="时间：">
					<el-date-picker
					v-model="date"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="系列：">
				<el-input v-model="xl" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="产品分类：">
				<el-select v-model="category_ids" multiple placeholder="请选择">
					<el-option
					v-for="item in category_list"
					:key="item.id"
					:label="item.name"
					:value="item.id">
				</el-option>
			</el-select>
		</el-form-item>
	</el-form>

</div>
</div>
</template>
<script>
	import PageRadio from '@/components/pageRadio'
	import PageButton from '@/components/pageButton'
	import ScreenButton from '@/components/screenButton'
	export default{
		data(){
			return{
				radio_list:[{
					id:1,
					name:'待审核',
					icon:require('@/static/await_audit.png'),
					icon_active:require('@/static/await_audit_active.png'),
				},{
					id:2,
					name:'已通过',
					icon:require('@/static/pass_icon.png'),
					icon_active:require('@/static/pass_icon_active.png'),
				},{
					id:3,
					name:'已拒绝',
					icon:require('@/static/turn_down.png'),
					icon_active:require('@/static/turn_down_active.png'),
				},{
					id:4,
					name:'全部',
					icon:require('@/static/all_icon.png'),
					icon_active:require('@/static/all_icon_active.png'),
				}],									//筛选条件
				active_index:0,						//当前选中的下标
				unfold:true,						//筛选条件是否展开
				date:[],							//时间选择
				xl:"",								//系列
				category_list:[{
					name:'分类1',
					id:1
				}],									//产品分类列表
				category_ids:[],					//选中的产品分类
			}
		},
		methods:{
			//切换单选
			checkRadio(index){
				this.active_index = index;
			},
			onChange(date, dateString) {
				console.log(date, dateString);
			},
		},
		components:{
			PageRadio,
			PageButton,
			ScreenButton
		}
	}
</script>
<style lang="less" scoped></style>