<template>
	<div class="container nav_menu flex">
		<div class="menu_box h_100 flex fc ac" :class="{'menu_box_down':!menu_status}">
			<div class="title f20 bold flex">
				<div>服装</div>
				<div v-if="menu_status">综合服务系统</div>
			</div>
			<div class="w_100 flex mt24" :class="[{'jse':menu_status},{'pr16':menu_status},{'mb24':menu_status},{'jc':!menu_status}]">
				<img class="menu_status_icon pointer" src="@/static/menu_down_icon.png" v-if="menu_status" @click="menu_status = false">
				<img class="menu_status_icon pointer" src="@/static/menu_up_icon.png" @click="menu_status = true" v-else>
			</div>
			<!-- 收起显示一级菜单图标 -->
			<div v-if="!menu_status">
				<div class="menu_item flex ac jc pointer" v-for="(menu,index) in menuList">
					<img class="menu_icon_big" :src="menu.icon_big">
				</div>
			</div>
			<!-- 展开状态显示菜单列表 -->
			<div class="w_100" v-if="menu_status">
				<div class="w_100" v-for="(menu,index) in menuList">
					<div class="menu_item pl24 pr24 flex ac jsb pointer" @click="checkMenuStatus(index)">
						<div class="flex ac">
							<img class="menu_icon" :src="menu.icon">
							<div class="f16 fw400">{{menu.name}}</div>
						</div>
						<img class="arrow_icon" :class="{'arrow_icon_up':menu.active}" src="@/static/arrow_up_icon.png">
					</div>
					<div class="supplier_menu_children" v-if="menu.active">
						<div class="menu_item pl16 pr16 flex ac jsb pointer" @mouseenter="mouseMenu(index,child_index,true)" @mouseleave="mouseMenu(index,child_index,false)" @click="checkMenu(child.path)" v-for="(child,child_index) in menu.children">
							<div class="menu_item_content w_100 h_100 flex ac jsb pl24 pr24" :class="{'menu_item_content_active':child.hover || child.active}">
								<div class="flex ac">
									<img class="menu_icon" :src="child.icon_active" v-if="child.active">
									<img class="menu_icon" :src="child.icon" v-else>
									<div class="f16 fw400" :class="{'active_color':child.active}">{{child.name}}</div>
								</div>
								<div class="dot"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex-1 ml24 border"></div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				menu_status:false,
			}
		},
		computed:{
			//菜单列表
			menuList(){
				return this.$store.state.menuList;
			}
		},
		methods:{
			//切换主菜单展开/收起状态
			checkMenuStatus(index){
				this.$store.commit('checkMenuStatus',index);
			},
			//鼠标移入/移出导航
			mouseMenu(index,child_index,bool){
				let arg = {
					index:index,
					child_index:child_index,
					bool:bool
				}
				this.$store.commit('mouseMenu',arg);
			},
			//切换导航
			checkMenu(path){
				this.$store.commit('checkMenu',path);
			}
		}
	}
</script>
<style lang="less" scoped>
	.nav_menu{
		padding: 24px 24px 16px;
		background-color:#F2F8FC;
		.menu_box{
			width: 260px;
			padding-top: 24px;
			background: #FFFFFF;
			border-radius: 24px;
			.title{
				color: #515A68;
				font-family: Ma;
			}
			.menu_status_icon{
				width: 12px;
				height: 10px;
			}
			.menu_item{
				height: 56px;
				color:#718096;
				.menu_item_content{
					border-radius: 14px;
				}
				.menu_item_content_active{
					background-color: rgba(63,140,255, 0.1);
				}
				.active_color{
					color: #3F8CFF;
				}
				.menu_icon{
					margin-right: 8px;
					width: 16px;
					height: 16px;
				}
				.menu_icon_big{
					width: 24px;
					height: 24px;
				}
				.arrow_icon{
					transform-origin: 50% 50%;
					transition: all 0.3s;
					width: 14px;
					height: 14px;
				}
				.arrow_icon_up{
					transform: rotate(-180deg);
				}
				.dot{
					border-radius: 50%;
					width: 8px;
					height: 8px;
					background: #DB0000;
				}
			}
			.supplier_menu_children{
				overflow: hidden;
				animation: animate 0.15s linear;
			}
			@keyframes animate{
				from {
					height: 0px;
				}
				to {
					height: 168px;
				}
			}
		}
		.menu_box_down{
			width: 64px;
			overflow: hidden;
		}
	}
</style>