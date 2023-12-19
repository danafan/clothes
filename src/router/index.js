import Vue from "vue";
import Router from "vue-router";

const login = (resolve) => require(["@/pages/login"], resolve);
const nav_menu = (resolve) => require(["@/pages/nav_menu"], resolve);
const home = (resolve) => require(["@/pages/home"], resolve);
const product_info = (resolve) => require(["@/pages/supplier/product_info"], resolve);
const send_sample = (resolve) => require(["@/pages/supplier/send_sample"], resolve);
const quality_inspection = (resolve) => require(["@/pages/supplier/quality_inspection"], resolve);
const product_audit = (resolve) => require(["@/pages/brand/product_audit"], resolve);
const sample_audit = (resolve) => require(["@/pages/brand/sample_audit"], resolve);
const report_audit = (resolve) => require(["@/pages/brand/report_audit"], resolve);

Vue.use(Router);

const router = new Router({
	routes: [
	{
		path: "/login",
		name: "登录",
		component: login
	},
	{
		path: "/nav_menu",
		component: nav_menu,
		name: "导航页",
		children: [
		{
			path: "/home",
			name: "首页",
			component: home
		},
		{
			path: "/product_info",
			name: "商品资料",
			component: product_info
		},
		{
			path: "/send_sample",
			name: "商品寄样",
			component: send_sample
		},
		{
			path: "/quality_inspection",
			name: "质检报告",
			component: quality_inspection
		},
		{
			path: "/product_audit",
			name: "商品资料审核",
			component: product_audit
		},
		{
			path: "/sample_audit",
			name: "样衣审核",
			component: sample_audit
		},
		{
			path: "/report_audit",
			name: "质检报告审核",
			component: report_audit
		}
		],
	},
	],
});

router.beforeEach((to, from, next) => {
	next();
});

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err);
};
export default router;
