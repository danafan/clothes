import http from './request.js'
let path = {	
	menuList:'api/access/mymenu',						//获取菜单列表
	//供应商
	supplierGoodsList:'api/supplier_goods/list',		//商品资料列表
}					
export default{
	//获取消息列表
	menuList(params){
		return http.get(path.menuList, params)
	},
	//商品资料列表
	supplierGoodsList(params){
		return http.get(path.supplierGoodsList, params)
	},
}









