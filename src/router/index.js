import Vue from "vue";
import Router from "vue-router";

const login = (resolve) => require(["@/pages/login"], resolve);
const nav_menu = (resolve) => require(["@/pages/nav_menu"], resolve);
const home = (resolve) => require(["@/pages/home"], resolve);

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
