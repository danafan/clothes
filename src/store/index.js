import Vue from "vue";
import Vuex from "vuex";
import { Message } from "element-ui";

import router from '@/router'
import resource from '@/api/resource.js'

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		menuList:[],								//导航列表
		active_path:sessionStorage.getItem("activePath")?JSON.parse(sessionStorage.getItem("activePath")):'/login',								//当前选中的菜单
		tabsList:sessionStorage.getItem("tabsList")?JSON.parse(sessionStorage.getItem("tabsList")):[{
		default:true,
			name:'首页',
			path:'/home',
			active:true
		}],												//当前已打开的菜单列表
		domain:"",										//文件前缀
		userInfo:sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{},									//用户信息
	},
	mutations: {
		//点击一级导航
		checkMenu(state,index){
			if(state.menuList[index].children){			//包含子菜单
				state.menuList.map((menu_item,menu_index) => {
					if(menu_item.children){
						if(menu_index == index){
							menu_item.open = !menu_item.open;
						}else{
							menu_item.open = false;
						}
					}
				})
			}else{								//不包含子菜单
				state.menuList.map((menu_item,menu_index) => {
					if(!menu_item.children){
						menu_item.active = menu_index == index;
					}else{
						menu_item.open = false;
					}
				})
				let path = state.menuList[index].path;
				// 处理标签页
				let tab_index = state.tabsList.findIndex(item => {
					return item.path == path;
				})
				if(tab_index == -1){				//打开新标签
					state.tabsList.push(state.menuList[index]);
				}
				state.tabsList.map(tab => {
					tab.active = tab.path == path;
				})
				state.active_path = path;
				sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
				sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
				router.push(state.active_path);
			}
		},
		//点击切换二级导航
		checkChildMenu(state, arg){
			state.menuList.map((menu_item,menu_index) => {
				if(menu_index == arg.index){
					menu_item.open = true;
					menu_item.children.map((item,child_index) => {
						item.active = child_index == arg.child_index;
					})
				}else{
					if(menu_item.children){
						menu_item.open = false;
						menu_item.children.map(item => {
							item.active = false;
						})
					}else{
						menu_item.active = false;
					}
				}
			})

			// 处理标签页
			let path = state.menuList[arg.index].children[arg.child_index].path;
			let tab_index = state.tabsList.findIndex(item => {
				return item.path == path;
			})
			if(tab_index == -1){				//打开新标签
				state.tabsList.map(item => {
					item.active = false;
				})
				state.tabsList.push(state.menuList[arg.index].children[arg.child_index]);
			}else{							//切换标签
				state.tabsList.map((item,item_index) => {
					item.active = item_index == tab_index;
				})
			}
			state.active_path = path;
			sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
			sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
			router.push(state.active_path);
		},
		//切换标签页
		checkTab(state,tab){
			state.menuList.map((item,index) => {
				if(tab.path == item.path){
					item.active = true;
				}else{
					item.active = false;
					if(item.children){
						item.children.map(child => {
							child.active = tab.path == child.path;
						})
						let child_index = item.children.findIndex(child => {
							return child.path == tab.path;
						})
						item.open = child_index > -1;
					}
					
				}
			})
			state.tabsList.map(item => {
				item.active = item.path == tab.path;
			})
			state.active_path = tab.path;
			sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
			sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
			router.push(state.active_path);
		},
		//删除标签页
		deleteTab(state,tab){
			var index = state.tabsList.findIndex(item => {
				return item.path == tab.path;
			})
			var active_menu = state.tabsList[index - 1];
			if(tab.active){		//删除的是当前展示的菜单
				// 处理标签页
				state.tabsList.map((tab,tab_index) => {
					tab.active = tab_index == index - 1;
				})
				//处理菜单
				state.menuList.map(item => {
					if(!item.children){
						item.active = active_menu.path == item.path;
					}else{
						item.children.map(child => {
							child.active = active_menu.path == child.path;
						})
						let child_index = item.children.findIndex(child => {
							return active_menu.path == child.path;
						})
						item.open = child_index > -1;
					}
				})
				
				state.active_path = active_menu.path;
				sessionStorage.setItem("activePath",JSON.stringify(state.active_path));
				state.tabsList.splice(index,1);
				sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
				router.push(state.active_path);
			}else{
				state.tabsList.splice(index,1);
				sessionStorage.setItem("tabsList", JSON.stringify(state.tabsList));
			}
		},
		//设置菜单列表
		setMenuList(state, menu_list){
			state.menuList = menu_list;
		},
		//设置用户信息
		setUserInfo(state,user_info){
			state.domain = user_info.img_domain;
			sessionStorage.setItem("userInfo", JSON.stringify(user_info));
			state.userInfo = user_info;
		}
	},
	actions: {
		// 获取用户信息
		getUserInfo (context,path) {
			resource.getUserInfo().then(res => {
				if (res.data.code == 1) {
					let data = res.data.data;
					context.commit('setUserInfo', data);
					resource.menuList().then(res => {
						if(res.data.code == 1){
							let supplier_menu = [{
								name:'商品资料上传',
								icon:require('@/static/info_upload_menu.png'),
								icon_big:require('@/static/info_upload_menu_big.png'),
								icon_big_active:require('@/static/info_upload_menu_big_active.png'),
								open:false,
								children:[{
									icon:require('@/static/product_info.png'),
									icon_active:require('@/static/product_info_active.png'),
									name:'商品资料',
									path:'/product_info',
									active:false
								},{
									icon:require('@/static/send_sample.png'),
									icon_active:require('@/static/send_sample_active.png'),
									name:'商品寄样',
									path:'/send_sample',
									active:false
								},{
									icon:require('@/static/quality_inspection.png'),
									icon_active:require('@/static/quality_inspection_active.png'),
									name:'质检报告',
									path:'/quality_inspection',
									active:false
								}]
							}];				//供应商菜单
							let brand_menu = [{
								name:'商品资料审核',
								icon:require('@/static/product_info_audit.png'),
								icon_big:require('@/static/product_info_audit_big.png'),
								icon_big_active:require('@/static/product_info_audit_big_active.png'),
								open:false,
								children:[{
									icon:require('@/static/product_info_audit.png'),
									icon_active:require('@/static/product_info_audit_active.png'),
									name:'商品资料审核',
									path:'/product_audit',
									active:false
								},{
									icon:require('@/static/report_audit.png'),
									icon_active:require('@/static/report_audit_active.png'),
									name:'质检报告审核',
									path:'/report_audit',
									active:false
								},{
									icon:require('@/static/sample_audit.png'),
									icon_active:require('@/static/sample_audit_active.png'),
									name:'样衣审核',
									path:'/sample_audit',
									active:false
								}]
							}];					//品牌菜单
							let menu_list = null;
							if(data.wx_user_id == "15523556114924406"){	  		//供应商
								menu_list = supplier_menu;
							}else if(data.wx_user_id == '15740402149096123'){		//品牌
								menu_list = brand_menu;
							}
							let current_index = menu_list.findIndex(item => {
								return item.path == path;
							})
							if(current_index == -1){		//是子菜单
								menu_list.map((menu,index) => {
									if(menu.children){
										let child_index = menu.children.findIndex(child => {
											child.active = child.path == path;
											return child.path == path;
										})
										menu.open = child_index > -1;
									}
								})
							}else{							//不是子菜单
								menu_list.map((menu,index) => {
									menu.active = index == current_index;
								})
							}
							context.commit('setMenuList', menu_list);
						}else{
							Message.warning(res.data.msg);
						}
					})
				}else{
					this.$message.warning(res.data.msg);
				}
			})
		},
		// 获取所有菜单
		getMenuList (context,path) {
			resource.menuList().then(res => {
				if(res.data.code == 1){
					let supplier_menu = [{
						name:'商品资料上传',
						icon:require('@/static/info_upload_menu.png'),
						icon_big:require('@/static/info_upload_menu_big.png'),
						icon_big_active:require('@/static/info_upload_menu_big_active.png'),
						open:false,
						children:[{
							icon:require('@/static/product_info.png'),
							icon_active:require('@/static/product_info_active.png'),
							name:'商品资料',
							path:'/product_info',
							active:false
						},{
							icon:require('@/static/send_sample.png'),
							icon_active:require('@/static/send_sample_active.png'),
							name:'商品寄样',
							path:'/send_sample',
							active:false
						},{
							icon:require('@/static/quality_inspection.png'),
							icon_active:require('@/static/quality_inspection_active.png'),
							name:'质检报告',
							path:'/quality_inspection',
							active:false
						}]
					}];				//供应商菜单
					let brand_menu = [{
						name:'商品资料审核',
						icon:require('@/static/product_info_audit.png'),
						icon_big:require('@/static/product_info_audit_big.png'),
						icon_big_active:require('@/static/product_info_audit_big_active.png'),
						open:false,
						children:[{
							icon:require('@/static/product_info_audit.png'),
							icon_active:require('@/static/product_info_audit_active.png'),
							name:'商品资料审核',
							path:'/product_audit',
							active:false
						},{
							icon:require('@/static/report_audit.png'),
							icon_active:require('@/static/report_audit_active.png'),
							name:'质检报告审核',
							path:'/report_audit',
							active:false
						},{
							icon:require('@/static/sample_audit.png'),
							icon_active:require('@/static/sample_audit_active.png'),
							name:'样衣审核',
							path:'/sample_audit',
							active:false
						}]
					}];					//品牌菜单
					let menu_list = null;
					console.log(context.state.userInfo)
					if(context.state.userInfo.wx_user_id == "15523556114924406"){	  		//供应商
						menu_list = supplier_menu;
					}else if(context.state.userInfo.wx_user_id == '15740402149096123'){		//品牌
						menu_list = brand_menu;
					}
					let current_index = menu_list.findIndex(item => {
						return item.path == path;
					})
					if(current_index == -1){		//是子菜单
						menu_list.map((menu,index) => {
							if(menu.children){
								let child_index = menu.children.findIndex(child => {
									child.active = child.path == path;
									return child.path == path;
								})
								menu.open = child_index > -1;
							}
						})
					}else{							//不是子菜单
						menu_list.map((menu,index) => {
							menu.active = index == current_index;
						})
					}
					console.log(menu_list)
					context.commit('setMenuList', menu_list);
					// router.replace(path)
				}else{
					Message.warning(res.data.msg);
				}
			})
		},
	}
});
export default store;
