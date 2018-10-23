import Vue from "vue";
import router from "vue-router";
import { store } from "../store/index";
Vue.use(router);

export default new router({
	routes: [
		{
			name: "home",
			path: "/",
			component: () => import("@/components/MainPage")
		},
		{
			name: "login",
			path: "/login",
			component: () => import("@/components/Login"),
			beforeEnter: (to, from, next) => {
				let user = store.getters.userInfo.name;
				console.log(user);
				if (user) {
					next("/");
				} else {
					next();
				}
			}
		},
		{
			name: "friends-post",
			path: "/friends-posts/:name",
			component: () => import("@/components/FriendPost"),
			props: true
		}
		// {
		//   name: 'home',
		//   path: '/',
		//   component: () => import("@/components/Login")
		// }
	]
});
