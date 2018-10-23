<template>
  <div class="container pt-3">
    <div class="row">
      <PageContent />
      <SideMenu />
    </div>
  </div>
</template>

<script>
import PageContent from "./PageContent";
import SideMenu from "./SideMenu";

// import { GET_USER_LIST } from "../store/actions.type";

export default {
	name: "MainPage",
	components: {
		PageContent,
		SideMenu
	},
	// computed: {
	// 	user() {
	// 		return this.$store.getters.userInfo
	// 	}
	// },
	// mounted() {
	// 	// if (this.user.email)
	// 		this.$store.dispatch(GET_USER_LIST, this.user);
	// }
};
</script>

<style>
</style>
