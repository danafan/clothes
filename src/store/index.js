import Vue from "vue";
import Vuex from "vuex";

import router from '@/router'

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		menuList:[{
			name:'商品资料上传',
			icon:require('@/static/info_upload_menu.png'),
			icon_big:require('@/static/info_upload_menu_big.png'),
			icon_big_active:require('@/static/info_upload_menu_big_active.png'),
			active:false,
			children:[{
				icon:require('@/static/product_info.png'),
				icon_active:require('@/static/product_info_active.png'),
				name:'商品资料',
				path:'/product_info',
				hover:false,
				active:false
			},{
				icon:require('@/static/send_sample.png'),
				icon_active:require('@/static/send_sample_active.png'),
				name:'商品寄样',
				path:'/send_sample',
				hover:false,
				active:false
			},{
				icon:require('@/static/quality_inspection.png'),
				icon_active:require('@/static/quality_inspection_active.png'),
				name:'质检报告',
				path:'/quality_inspection',
				hover:false,
				active:false
			}]
		},{
			name:'商品资料审核',
			icon:require('@/static/product_info_audit.png'),
			icon_big:require('@/static/product_info_audit_big.png'),
			icon_big_active:require('@/static/product_info_audit_big_active.png'),
			active:false,
			children:[{
				icon:require('@/static/product_info_audit.png'),
				icon_active:require('@/static/product_info_audit_active.png'),
				name:'商品资料审核',
				path:'/product_audit',
				hover:false,
				active:false
			},{
				icon:require('@/static/report_audit.png'),
				icon_active:require('@/static/report_audit_active.png'),
				name:'质检报告审核',
				path:'/report_audit',
				hover:false,
				active:false
			},{
				icon:require('@/static/sample_audit.png'),
				icon_active:require('@/static/sample_audit_active.png'),
				name:'样衣审核',
				path:'/sample_audit',
				hover:false,
				active:false
			}]
		}],												//导航列表
		active_path:sessionStorage.getItem("activePath")?JSON.parse(sessionStorage.getItem("activePath")):'/home',								//当前选中的菜单
		tabsList:sessionStorage.getItem("tabsList")?JSON.parse(sessionStorage.getItem("tabsList")):[{
		default:true,
			name:'首页',
			path:'/home',
			hover:false,
			active:false
		}],												//当前已打开的菜单列表
		domain:"",										//文件前缀
	},
	mutations: {
		//切换一级菜单展开/收起状态
		checkMenuStatus(state, index){
			state.menuList.map((menu,menu_index) => {
				if(menu_index == index){
					menu.active = !menu.active;
				}else{
					menu.active = false;
				}
			})
		},
    	//鼠标移入/移出二级菜单
		mouseMenu(state, arg){
			state.menuList[arg.index].children[arg.child_index].hover = arg.bool;
		},
		//切换导航
		checkMenu(state, menu_item){
			state.active_path = menu_item.path;
			sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
			state.menuList.map(menu => {
				menu.children.map(child => {
					child.active = child.path == menu_item.path;
				})
			})
			// 处理标签页
			let index = state.tabsList.findIndex(item => {
				return item.path == menu_item.path;
			})
			if(index == -1){				//打开新标签
				let tab_item = {
					parent_index:menu_item.parent_index,
					name:menu_item.name,
					path:menu_item.path,
					hover:false,
					active:true
				}
				state.tabsList.map(item => {
					item.active = false;
				})
				state.tabsList.push(tab_item);
			}else{							//切换标签
				state.tabsList.map(item => {
					item.active = menu_item.path == item.path;
				})
			}
			sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
			router.push(state.active_path);
		},
		//鼠标移入/移出标签页
		mouseTab(state, arg){
			state.tabsList[arg.index].hover = arg.bool;
			sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
		},
		//切换标签页
		checkTab(state, tab){
			state.active_path = tab.path;
			sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
			state.menuList.map((menu,index) => {
				if(state.tabsList.length > 2){
					menu.active = tab.parent_index == index;
				}
				menu.children.map(child => {
					child.active = child.path == tab.path;
				})
			})
			// 处理标签页
			let index = state.tabsList.findIndex(item => {
				return item.path == tab.path;
			})
			state.tabsList.map(item => {
				item.active = tab.path == item.path;
			})
			sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
			router.push(state.active_path);
		},
		//删除标签页
		deleteTab(state,tab){
			let index = state.tabsList.findIndex(item => {
				return item.path == tab.path;
			})
			if(tab.active){		//删除的是当前展示的菜单
				state.active_path = state.tabsList[index - 1].path;
				sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
				let current_menu_index = state.tabsList[index - 1].parent_index;
				state.menuList.map((menu,menu_index) => {
					if(state.tabsList.length > 2){
						menu.active = current_menu_index == menu_index;
					}
					menu.children.map(child => {
						child.active = child.path == state.active_path;
					})
				})
				state.tabsList[index - 1].active = true;
				state.tabsList.splice(index,1);
			}else{
				state.tabsList.splice(index,1);
			}
			sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
			router.push(state.active_path);
		},
		//初始化导航样式
		initMenuStatus(state,path){
			state.menuList.map((menu,index) => {
				menu.children.map(child => {
					if(child.path == path){
						menu.active = true;
						child.active = true;
					}else{
						child.active = false;
					}
				})
			})
		},
		//设置用户信息
		setUserInfo(state,user_info){
			state.domain = user_info.img_domain;
		}

	},
	actions: {

	}
});
export default store;
