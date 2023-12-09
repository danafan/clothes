import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		menuList:[{
			name:'商品资料上传',
			icon:require('@/static/info_upload_menu.png'),
			icon_big:require('@/static/info_upload_menu_big.png'),
			icon_big_active:require('@/static/info_upload_menu_big_active.png'),
			active:true,
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
				path:'/product_info_audit',
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
		}],										//导航列表
		active_path:'/home',							//当前选中的菜单
	},
	mutations: {
		//切换主菜单展开/收起状态
		checkMenuStatus(state, index){
			state.menuList.map((menu,menu_index) => {
				if(menu_index == index){
					menu.active = !menu.active;
				}else{
					menu.active = false;
				}
			})
		},
    	//鼠标移入/移出导航
		mouseMenu(state, arg){
			state.menuList[arg.index].children[arg.child_index].hover = arg.bool;
		},
		//切换导航
		checkMenu(state, path){
			state.active_path = path;
			state.menuList.map(menu => {
				menu.children.map(child => {
					child.active = child.path == path;
				})
			})
		}
	},
	actions: {

	}
});
export default store;
