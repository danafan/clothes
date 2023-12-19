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
	supplierGoodsDel:'api/supplier_goods/del',			//删除商品资料
	supplierGoodsEdit:'api/supplier_goods/edit',		//编辑/获取详情
	supplierGoodsAudit:'api/supplier_goods/apply_check',//发起审核
	supplierGoodsCancel:'api/supplier_goods/revoke',	//撤销审核
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
	//删除商品资料
	supplierGoodsDel(params){
		return http.post(path.supplierGoodsDel, params)
	},
	//获取商品详情
	supplierGoodsEditGet(params){
		return http.get(path.supplierGoodsEdit, params)
	},
	//编辑商品提交
	supplierGoodsEditPost(params){
		return http.post(path.supplierGoodsEdit, params)
	},
	//发起审核
	supplierGoodsAudit(params){
		return http.post(path.supplierGoodsAudit, params)
	},
	//撤销审核
	supplierGoodsCancel(params){
		return http.post(path.supplierGoodsCancel, params)
	},
}









