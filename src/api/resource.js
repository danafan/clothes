import http from './request.js'
let path = {	
	getUserInfo:'api/scancodes/getuserinfo',			//获取用户信息
	menuList:'api/access/mymenu',						//获取菜单列表
	ajaxSeries:'api/common/ajax_series',				//获取系列列表
	ajaxCates:'api/common/ajax_cates',					//获取品类列表
	ajaxUsers:'api/common/ajax_users',					//获取用户列表
	ajaxBrands:'api/common/ajax_brands',				//获取品牌列表
	uploadFile:'api/common/upload',						//上传文件
	deleteFile:'api/common/del_file',					//删除文件
	//供应商
	supplierGoodsList:'api/supplier_goods/list',		//商品资料列表
	supplierGoodsAdd:'api/supplier_goods/add',			//上传商品资料
}					
export default{
	//获取用户信息
	getUserInfo(params){
		return http.get(path.getUserInfo, params)
	},
	//获取消息列表
	menuList(params){
		return http.get(path.menuList, params)
	},
	//获取系列列表
	ajaxSeries(params){
		return http.get(path.ajaxSeries, params)
	},
	//获取品类列表
	ajaxCates(params){
		return http.get(path.ajaxCates, params)
	},
	//获取用户列表
	ajaxUsers(params){
		return http.get(path.ajaxUsers, params)
	},
	//获取品牌列表
	ajaxBrands(params){
		return http.get(path.ajaxBrands, params)
	},
	//上传文件
	uploadFile(params){
		return http.post(path.uploadFile, params)
	},
	//删除文件
	deleteFile(params){
		return http.post(path.deleteFile, params)
	},
	//商品资料列表
	supplierGoodsList(params){
		return http.get(path.supplierGoodsList, params)
	},
	//上传商品资料
	supplierGoodsAdd(params){
		return http.post(path.supplierGoodsAdd, params)
	},
}









