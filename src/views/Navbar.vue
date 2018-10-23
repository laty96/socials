<template>
  <div>
    <nav class="shadow-sm navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <a class="navbar-brand" href="#">Blabla</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav d-flex justify-content-between">
          <li class="nav-item active">
            <router-link to="/" class="nav-link">{{getUsername || 'Home'}} </router-link>
          </li>
          <li class="nav-item" v-if="getUsername">
            <router-link to="/friends-posts" class="nav-link">Friends</router-link>
          </li>
          <!-- <li class="nav-item">
            <form class="form-inline my-2 my-lg-0">
              <input class="form-control mr-sm-2" type="search" placeholder="W.I.P" aria-label="Search" v-model="searchText" >
              <button class="btn btn-outline-success my-2 my-sm-0" type="submit" @click.prevent="searchPost">Search</button>
            </form>
          </li> -->
          <li class="nav-item" v-if="!getUserStatus">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item notify-dropdown" v-if="getUserStatus">
            <div class="dropdown" @click="notiRead()">
              <a href="#" class="nav-link" :class="{'text-primary': notify.length}" data-toggle="dropdown">
                <i class="fas fa-bell"></i><small class="notify-count bg-danger text-white" v-if="notify.length > 0">{{notify.length}}</small>
              </a>
              <div class="dropdown-menu p-0" style="width: 95%">
                <ul class="list-group list-group-flush" id="notify">
                  <h5 class="dropdown-header" v-if="notify.length > 0">New</h5>
                  <li class="dropdown-item list-group-item" v-for="noti in notify" :key="noti.id" @click="show(noti.postId)">
                    <a class="text-primary">{{noti.user}} </a> {{getType(noti.type)}} <small class="bg-light"> {{cvDate(noti.createdTime)}}</small>
                  </li>
                  <h5 class="dropdown-header">Old</h5>
                  <li class="dropdown-item list-group-item" v-for="noti in inactiveNotify" :key="noti.id"  @click="show(noti.postId)">
                    <a class="text-primary">{{noti.user}} </a> {{getType(noti.type)}} <small class="bg-light"> {{cvDate(noti.createdTime)}}</small>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li class="nav-item">
            <a href="" class="nav-link" v-on:click.prevent="signOut" v-if="getUserStatus">Sign out</a>
          </li>
          <li class="nav-item" v-if="isMobile">
            <SideMenu />
          </li>
        </ul>
      </div>
    </nav>

    <modal name="view-post">
    
		</modal>
  </div>
</template>

<script>
import {
	GET_NOTIFICATION,
	REMOVE_USER,
	NOTIFY_READ,
	GET_POST,
  GET_INACTIVE_NOTIFICATION
} from "../store/actions.type";
import { convertShortDate, isMobile } from "../utilities/index";
import { mapState } from "vuex";
import modal from "../components/Modal";
import SideMenu from "../components/SideMenu";


export default {
	name: "Navbar",
  components: {
    SideMenu
  },
	data() {
		return {
			isMobile: isMobile.any() ? true : false
		};
	},
	computed: {
		...mapState({
			unsub: state => state.postView.unsubPost,
			post: state => state.postView.post,
			userInfo: state => state.auth.userInfo,
			getUserStatus: state => state.auth.userInfo.status,
			getUsername: state => state.auth.userInfo.name,
			notify: state => (state.auth.notify ? state.auth.notify : []),
			inactiveNotify: state =>
				state.auth.inactiveNoti ? state.auth.inactiveNoti : []
		})
	},
	methods: {
		cvDate(d) {
			return convertShortDate(d);
		},
		signOut() {
			this.$store.dispatch(REMOVE_USER, this.userInfo);
		},
		getType(type) {
			if (type == 1) {
				return "mentioned you.";
			}
			if (type == 2) {
				return "replied your comment.";
			}
			if (type == 3) {
				return "comment in your post.";
			}
		},
		notiRead() {
		  document.getElementById('notify').addEventListener("scroll", this.scrollA);
			let a = this;
			setTimeout(function() {
				a.$store.dispatch(NOTIFY_READ, a.userInfo._id);
			}, 10000);
		},
		show(i) {
			this.$store.dispatch(GET_POST, i);
			setTimeout(
				this.$modal.show(
					modal,
					{ i: this.post, isMobile: isMobile.any() },
					{
						height: "auto",
						width: isMobile.any() ? "100%" : "80%",
						style: { "z-index": 9000 },
						scrollable: true
					},
					{
						closed: this.hide
					},
					{
						"before-open": this.$store.dispatch(GET_POST, i),
						"before-close": this.unsub()
					}
				),
				50
			);
		},
		beforeOpen(event) {},
		hide() {
			this.$modal.hide("view-post");
		},
    scrollA() {
      let ul = document.getElementById('notify');
      if (Math.floor(ul.offsetHeight + ul.scrollTop) == ul.scrollHeight) {
        let u = this.userInfo;
        u.limit = this.inactiveNotify.length + 10
        this.$store.dispatch(GET_INACTIVE_NOTIFICATION, u)
      }
    }
	},
  created() {
	},
	destroyed() {
		document.getElementById('notify').removeEventListener("scroll", this.scrollA);
	}
};
</script>

<style scoped>
.notify-count {
	text-align: center;
	box-sizing: border-box;
	border: 1.5px solid white;
	left: 16px;
	border-radius: 50%;
	height: 14px;
	width: 14px;
	position: absolute;
	line-height: 12px;
	font-size: 0.7em !important;
}

.notify-dropdown .dropdown-menu.show ul{
  max-height: 50vh;
  overflow-y: scroll;
}
.list-group::-webkit-scrollbar {
  width: 10px;
}
 
.list-group::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 20px;
}

.list-group::-webkit-scrollbar-track {
  background: #ddd;
  border-radius: 20px;
}
</style>
