<template>
  <div class="col-md-3 py-3" v-if="userInfo.email">
    <div>
      <div class="card shadow-sm" style="{position: fixed;width: 20vw}">
        <div class="card-header btn" data-toggle="collapse" data-target="#collapsibleSideMenu">
            <i class="fas fa-chevron-down"></i>
        </div>
        <div class="card-content collapse show" id="collapsibleSideMenu">
          <ul class="list-group list-group-flush">
            <li class="list-group-item dropdown dropleft" v-for="user in getUserList" :key="user.email">
              <div data-toggle="dropdown" class="dropdown-toggle">
								<i class="fas fa-circle" :class="{'text-success': user.status}"></i>
								<a href="#" class="card-link">
									{{user.name}}
								</a>
								<small>{{cvDate(user.lastLogedIn)}}</small>
							</div>
							<div class="dropdown-menu">
								<a class="dropdown-item" href="#" @click="openChat(user)">Chat</a>
								<a class="dropdown-item" href="#" @click="addFriend(user)" v-if="userInfo.friends.indexOf(user.email) < 0">Add friend</a>
								<a class="dropdown-item" href="#" @click="unFriend(user)" v-else>Unfriend</a>
							 	<router-link :to="'/friends-posts/'+userInfo.name" class="dropdown-item">View posts</router-link>
							</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
		<div v-for="(user,k) in userList" :key="user.email">
			<ChatForm :user="user" :index="k" v-on:closeChat="removeChat"/>
		</div>
    
  </div>
</template>

<script>
import moment from "moment";

import { mapGetters } from "vuex";
import ChatForm from "./ChatForm";
import { CREATE_CONVERSATION, ADD_FRIEND, UN_FRIEND } from "../store/actions.type";
export default {
	name: "SideMenu",
	components: {
		ChatForm
	},
	data() {
		return {
			userList: []
		};
	},
	computed: {
		...mapGetters(["getUserList", "userInfo"])
	},
	methods: {
		cvDate(d) {
			return moment(d).fromNow();
		},
		openChat(u) {
			this.$store.dispatch(CREATE_CONVERSATION, { u, userInfo: this.userInfo, nextTick: this});
			if (this.userList.indexOf(u) < 0) this.userList.push(u);
			if (this.userList.length > 4) {
				this.userList.unshift();
			}
			this.$forceUpdate();
		console.log(this.userInfo)

		},
		addFriend(u) {
			this.$store.dispatch(ADD_FRIEND, {u, userInfo: this.userInfo})
		},
		unFriend(u) {
			this.$store.dispatch(UN_FRIEND, {u, userInfo: this.userInfo})
		},
		removeChat(e) {
			this.userList.splice(e, 1);
		}
	}
};
</script>

<style scoped>

</style>
