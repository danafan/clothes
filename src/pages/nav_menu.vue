<template>
	<div class="container nav_menu flex">
		<!-- 左侧导航 -->
		<div class="menu_box h_100 flex fc ac" :class="{'menu_box_down':!menu_status}">
			<!-- 标题 -->
			<div class="title f20 bold flex">
				<div>服装</div>
				<div v-if="menu_status">综合服务系统</div>
			</div>
			<!-- 收起/展开按钮 -->
			<div class="w_100 flex mt24" :class="[{'jse':menu_status},{'pr16':menu_status},{'mb24':menu_status},{'jc':!menu_status}]">
				<img class="menu_status_icon pointer" src="@/static/menu_down_icon.png" v-if="menu_status" @click="menu_status = false">
				<img class="menu_status_icon pointer" src="@/static/menu_up_icon.png" @click="menu_status = true" v-else>
			</div>
			<!-- 收起-显示菜单图标 -->
			<div v-if="!menu_status">
				<div class="menu_item flex ac jc pointer relative" @mouseenter="menu_active_index = index" @mouseleave="menu_active_index = -1" v-for="(menu,index) in menuList">
					<a-popover overlayClassName="a_popover" placement="rightTop" trigger="hover">
						<template slot="content">
							<div class="popover_menu_item flex ac jsb pointer pl24 pr24" :class="{'menu_item_content_active':child.hover || child.active}" @mouseenter="child_active_index = child_index" @mouseleave="child_active_index = -1" @click="checkChildMenu(index,child_index)" v-for="(child,child_index) in menu.children">
								<div class="flex ac">
									<img class="menu_icon" :src="child.icon_active" v-if="menu.active">
									<img class="menu_icon" :src="child.icon" v-else>
									<div class="f16 fw400" :class="{'active_color':child.active}">{{child.name}}</div>
								</div>
								<div class="dot"></div>
							</div>
						</template>
						<img class="menu_icon_big" :src="menu.icon_big_active" v-if="menu.active">
						<img class="menu_icon_big" :src="menu.icon_big" v-else>
					</a-popover>
				</div>
			</div>
			<!-- 展开-显示菜单列表 -->
			<div class="w_100" v-if="menu_status">
				<div class="w_100" v-for="(menu,index) in menuList">
					<div class="menu_item pl24 pr24 flex ac jsb pointer" @mouseenter="menu_active_index = index" @mouseleave="menu_active_index = -1" :class="{'menu_item_content_active':menu_active_index == index}" @click="$store.commit('checkMenu',index)">
						<div class="flex ac">
							<img class="menu_icon" :src="menu.icon">
							<div class="f16 fw400 space-nowrap">{{menu.name}}</div>
						</div>
						<img class="arrow_icon" :class="{'arrow_icon_up':menu.active}" src="@/static/arrow_up_icon.png">
					</div>
					<div class="supplier_menu_children" v-if="menu.open">
						<div class="menu_item pl16 pr16 flex ac jsb pointer" @mouseenter="child_active_index = child_index" @mouseleave="child_active_index = -1" @click="checkChildMenu(index,child_index)" v-for="(child,child_index) in menu.children">
							<div class="menu_item_content w_100 h_100 flex ac jsb pl24 pr24" :class="{'menu_item_content_active':child_active_index == child_index || child.active}">
								<div class="flex ac">
									<img class="menu_icon" :src="child.icon_active" v-if="child.active">
									<img class="menu_icon" :src="child.icon" v-else>
									<div class="f16 fw400 space-nowrap" :class="{'active_color':child.active}">{{child.name}}</div>
								</div>
								<div class="dot"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 右侧页面 -->
		<div class="flex-1 ml24 flex fc">
			<div class="flex jse mb24">
				<div class="admin_setting flex ac jc f14 fw400">{{userInfo.wx_user_name}} ｜ 退出</div>
			</div>
			<div class="tab_pane flex flex-warp mb16">
				<div class="tab_item flex ac f14 mr32 mb16 pointer" :class="{'active_tab_item_bg':tab_active_index == index || item.active}" @mouseenter="tab_active_index = index" @mouseleave="tab_active_index = -1" @click="$store.commit('checkTab',item)" v-for="(item,index) in tabsList">
					<div class="space-nowrap">{{item.name}}</div>
					<img class="tab_close" src="@/static/tab_close_active.png" @click.stop="$store.commit('deleteTab',item)" v-if="(tab_active_index == index || item.active) && !item.default">
					<img class="tab_close" src="@/static/tab_close.png" @click.stop="$store.commit('deleteTab',item)" v-if="tab_active_index != index && !item.active && !item.default">
				</div>
			</div>
			<div class="page_container flex-1">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>
<script>
	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				menu_status:true,
				menu_active_index:-1,			//当前鼠标移入的一级菜单下标
				child_active_index:-1,			//当前鼠标移入的二级菜单下标
				tab_active_index:-1,			//当前鼠标移入标签页的下标
			}
		},
		created(){
			//获取用户信息
			this.$store.dispatch('getUserInfo',this.$route.path);
		},
		computed:{
			//用户信息
			userInfo(){
				return this.$store.state.userInfo;
			},
			//菜单列表
			menuList(){
				return this.$store.state.menuList;
			},
			//当前已打开的标签页列表
			tabsList(){
				return this.$store.state.tabsList;
			}
		},
		methods:{
			//切换二级导航
			checkChildMenu(index,child_index){
				let arg = {
					index:index,
					child_index:child_index
				}
				this.$store.commit('checkChildMenu',arg)
			}
		}
	}
</script>
<style type="text/css">
	.a_popover .popover_menu_item{
		height: 56px;
		width: 228px;
		color:#718096;
		border-radius: 14px;
	}
	/*.a_popover .menu_item_content_active{
		background-color: rgba(63,140,255, 0.1);
	}*/
	.a_popover .active_color{
		color: #3F8CFF;
	}
	.a_popover .menu_icon{
		margin-right: 8px;
		width: 16px;
		height: 16px;
	}
	.a_popover .menu_icon_big{
		width: 24px;
		height: 24px;
	}
	.a_popover .arrow_icon{
		transform-origin: 50% 50%;
		transition: all 0.3s;
		width: 14px;
		height: 14px;
	}
	.a_popover .arrow_icon_up{
		transform: rotate(-180deg);
	}
	.a_popover .dot{
		border-radius: 50%;
		width: 8px;
		height: 8px;
		background: #DB0000;
	}
</style>
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
		.admin_setting{
			width: 133px;
			height: 36px;
			background: #FFFFFF;
			border-radius: 8px;
			color: #718096;
		}	
		.tab_pane{
			padding: 16px 24px 0;
			background: #FFFFFF;
			border-radius: 24px;
			.tab_item{
				border: 1px solid #E3E3E3;
				background: #FFFFFF;
				color: #999999;
				padding-left: 16px;
				padding-right: 16px;
				height: 32px;
				border-radius: 4px;
				.tab_close{
					margin-left: 8px;
					width: 7px;
					height: 7px;
				}
			}
			.active_tab_item_bg{
				border:1px solid #609DFF;
				background: #EBF3FF;
				color: #609DFF;
			}
		}
		.page_container{
			padding: 16px 24px;
			background: #FFFFFF;
			border-radius: 24px;
		}
	}
</style>