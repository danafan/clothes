<template>
	<div class="goods_item_container">
		<div class="main_image mb16 border">
			<img class="container" :src="img">
		</div>
		<div class="pl16 pr16 pb16">
			<div class="flex ac jsb mb16">
				<div class="flex ac">
					<div class="label">系列：</div>
					<div class="value">保暖</div>
				</div>
				<div class="flex ac">
					<div class="label">品类：</div>
					<div class="value">卫衣</div>
				</div>
			</div>
			<div class="table_color f16 fw500 table_header_text">老国标90含量连帽长款羽绒服老国标90含量连帽长款羽绒服</div>
			<div class="line"></div>
			<div class="hidden_content" v-if="!hidden">
				<div class="flex ac jsb mb16">
					<div class="flex ac">
						<div class="label">款号：</div>
						<div class="value">123123</div>
					</div>
					<div class="flex ac">
						<div class="label">货号：</div>
						<div class="value">12313</div>
					</div>
				</div>
				<div class="flex ac jsb mb16">
					<div class="flex ac">
						<div class="label">spu：</div>
						<div class="value">123123</div>
					</div>
					<div class="flex ac">
						<div class="label">sku：</div>
						<div class="value">12313</div>
					</div>
				</div>
				<div class="flex ac jsb mb16">
					<div class="flex ac">
						<div class="label">色号：</div>
						<div class="value">01</div>
					</div>
					<div class="flex ac">
						<div class="label">颜色名称：</div>
						<div class="value">米白103</div>
					</div>
				</div>
				<div class="flex ac">
					<div class="label">商品单位：</div>
					<div class="value">件</div>
				</div>
				<div class="line"></div>
				<div class="flex ac jsb mb16">
					<div class="flex ac">
						<div class="label">吊牌价：</div>
						<div class="value">¥15</div>
					</div>
					<div class="flex ac">
						<div class="label">日常价：</div>
						<div class="value">¥15</div>
					</div>
				</div>
				<div class="flex ac jsb mb16">
					<div class="flex ac">
						<div class="label">活动价：</div>
						<div class="value">¥15</div>
					</div>
					<div class="flex ac">
						<div class="label">大促价：</div>
						<div class="value">¥15</div>
					</div>
				</div>
				<div class="flex ac jsb">
					<div class="flex ac">
						<div class="label">折扣：</div>
						<div class="value">15%</div>
					</div>
					<div class="flex ac">
						<div class="label">规格：</div>
						<div class="value">M-160</div>
					</div>
				</div>
				<div class="line"></div>
				<div class="flex ac mb16">
					<div class="label">材质：</div>
					<div class="value">97%聚酯纤维3%氨纶（配料除外）%</div>
				</div>
				<div class="flex ac mb16">
					<div class="label">卖点：</div>
					<div class="value">印花立领立领 新国标90%绒羽绒服</div>
				</div>
				<div class="flex ac mb16">
					<div class="label">使用人群：</div>
					<div class="value">青年</div>
				</div>
				<div class="flex ac">
					<div class="label">预计上架时间：</div>
					<div class="value">2023-10-23</div>
				</div>
				<div class="line"></div>
				<div class="flex ac jsb mb16">
					<div class="flex ac">
						<div class="label">规划色：</div>
						<div class="value">黑色 杏色</div>
					</div>
					<div class="flex ac">
						<div class="label">字体：</div>
						<div class="value">黑鲸品牌字体</div>
					</div>
				</div>
				<div class="flex ac mb16">
					<div class="label">工艺：</div>
					<div class="value">烫画超轻</div>
				</div>
				<div class="flex ac mb16">
					<div class="label">参考图案：</div>
					<div class="value">规划色-图案颜色黑色卫衣-银灰</div>
				</div>
				<div class="flex ac">
					<div class="label">备注：</div>
					<div class="value">规划色-图案颜色黑色卫衣</div>
				</div>
				<div class="line"></div>
			</div>
			<div class="flex ac mb16">
				<span class="text_style mr16">工艺资料包</span>
				<span class="text_style">线性图稿</span>
			</div>
			<div class="flex jc">
				<div class="button_style scpph">上传品牌款号</div>
			</div>
			<div class="line"></div>
			<div class="flex fc ac">
				<div class="flex fc ac pointer" @click="checkStatus">
					<div class="text_style mb8">{{hidden?'展开':'收起'}}</div>
					<img class="status_icon" src="@/static/create_icon.png">
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				img:'https://p.qqan.com/up/2023-12/17030525349866759.jpg',
				hidden:false
			}
		},
		methods:{
			//切换展开收起
			checkStatus(){
				this.hidden = !this.hidden;
			}
		}
	}
</script>
<style lang="less" scoped>
	.goods_item_container{
		margin-bottom: 16px;
		margin-right: 16px;
		border: 1px solid #E6EDFF;
		width: 288px;
		border-radius: 16px;
		.main_image{
			position: relative;
			width: 215px;
			height: 215px;
		}
		.label{
			color: #858B9E;
			font-size: 14px;
			font-weight: 400;
			white-space: nowrap;
		}
		.value{
			color: #4E5969;
			font-size: 14px;
			font-weight: 400;
			overflow: hidden;
			white-space: nowrap;
			text-overflow:ellipsis;
		}
		.line{
			margin-top: 16px;
			margin-bottom: 16px;
			width: 100%;
			height: 1px;
			background: #E6EDFF;
		}
		.text_style{
			cursor: pointer;
			font-size: 14px;
			font-weight: 400;
			color: #3F8CFF;
		}
		.button_style{
			text-align: center;
			height: 28px;
			line-height: 28px;
			background: #609DFF;
			border-radius: 8px;
			font-size: 14px;
			color: #ffffff;
			font-weight: 400;
		}
		.scpph{
			width: 116px;
		}
		.status_icon{
			width: 13px;
			height: 11px;
		}
	}
</style>