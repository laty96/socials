<template>
  <div class="login-form container">
    <div class="row">
      <form class="form-group col-md-4 offset-md-4  my-5">
        <div id="my-signin2" class="m-2 d-flex justify-content-center"></div>
      </form>
    </div>
  </div>
</template>

<script>
import { REMOVE_USER, LOGIN_WITH_G} from '../store/actions.type'

export default {
	name: "Login",
	// created() {
	// 	window.addEventListener('beforeunload', this.removeUser)
		
	// },
	// methods: {
	// 	removeUser(e) {
	// 		this.$store.dispatch(REMOVE_USER, this.userInfo)
	// 	}
	// },
	mounted() {
		this.$store.dispatch(LOGIN_WITH_G)
		// gapi.signin2.render("my-signin2", {
		// 	scope: "profile email",
		// 	width: 240,
		// 	height: 50,
		// 	longtitle: true,
		// 	theme: "dark",
		// 	onsuccess: this.onSignIn,
		// 	onfailure: this.onFailure
		// });
		// googleLoginButton('my-signun2', gapi.signin2, this.onSignIn, this.onFailure)
	},
	computed: {
		userInfo() {
			return this.$store.getters.userInfo;
		}
	}
};
</script>

<style>
</style>
