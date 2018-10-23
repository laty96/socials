<template>
  <div class="chat-box" style="pointer-events:all" :style="{right: index * 25 + 'vw'}">
    <div class="">
      <div class="card shadow"> 
        <div class="card-header py-1 my-0 btn bg-primary" @click="minimizeChat(index)">
          <i class="fas fa-circle" :class="{'text-success': user.status}"></i> 
					<a class="text-white"> {{user.name}}</a>
          <button class="close float-right" @click.stop="onCLick(index)">&times;</button>
        </div>
        <div class="card-body" :class="{minimize: user.minimize}" style="height: 250px;overflow-y: scroll" :id="getConver[this.index][0].groupId">
					<div class="chat-wrapper" style="margin: 1px; width: 100%; height: 2.1em" 
					v-for="m in getConver[this.index][0].content" :key="m.createdTime">
						<span class="py-1 px-2" style="max-width: 70%" 
						data-toggle="tooltip" data-placement="top" :title="cvDate(m.createdTime)"
							:class="[m.owner != user.email ? 'my-chat bg-primary text-white float-right text-right' : 'other-chat bg-secondary text-white']">
							{{m.message}}
						</span>
     			</div>
        </div>
        <input type="text" class="form-control" :class="{minimize: user.minimize}" @keyup.enter="sendMessage($event)">
      </div>
    </div>
  </div>
</template>

<script>

import { GET_CONVERSATION, SEND_MESSAGE } from "../store/actions.type";
import { mapGetters, mapState } from "vuex";
import moment from 'moment'

export default {
	name: "ChatForm",
	props: {
		user: Object,
		index: Number
	},
	data() {
		return {
			chat: []
		}
	},
	computed: {
		...mapGetters({
			userInfo: "userInfo",
			// getConver: "getConver"
		}),
		...mapState({
			getConver: state => state.chat.conversations,
			unsub: state => state.chat.unsub
		})
	},
	watch: {
		getConver(n) {
			console.log(n)
			this.scrollChat(this.getConver[this.index][0].groupId);
			this.$forceUpdate();
			 $('[data-toggle="tooltip"]').tooltip();   
		}
	},
	methods: {
		cvDate(d) {
			return moment(d).calendar()
		},
		onCLick(k) {
			this.unsub[this.index][0]()
			this.$emit("closeChat", k);
			this.$store.dispatch('CLOSE_CHAT', k)
		},
		minimizeChat(k) {
			// this.users[k].minimize = !this.users[k].minimize;
			
			console.log(this.getConver)
			console.log(this.index)
		},
		sendMessage($event) {
			let m = {
				membersId: this.userInfo.id + this.user.id,
				message: $event.target.value,
				owner: this.userInfo.email,
				_id: this.getConver[this.index][0].id
			};
			this.$store.dispatch(SEND_MESSAGE, m);
			$event.target.value = '';
			this.scrollChat(this.getConver[this.index][0].groupId);
			setTimeout(this.$forceUpdate(), 500);
		},
		scrollChat(a) {
			window.setTimeout(() => {
				let el = document.getElementById(a)
				el.scrollTop = el.scrollHeight
				}, 10)
		}
	},
	created() {
		this.$store.dispatch(GET_CONVERSATION, this.userInfo.id + this.user.id)
	},
	mounted() {
		setTimeout(() =>{
			$('[data-toggle="tooltip"]').tooltip()
			this.$forceUpdate()
		}, 2000);   

	}
};

</script>

<style scoped>
.minimize {
	top: 18em;
}
.chat-wrapper:first-child .other-chat {
	border-top-left-radius: 16px;
}
.chat-wrapper:last-child .other-chat {
	border-bottom-left-radius: 16px;
}
.other-chat {
	border-radius: 4px 16px 16px 4px;
}
.my-chat {
	border-radius: 16px 4px 4px 16px;
}
.chat-wrapper:last-child .my-chat {
	border-bottom-right-radius: 16px;
}
.chat-wrapper:first-child .my-chat {
	border-top-right-radius: 16px;
}
.minimize {
	height: 0;
	padding: 0;
}
.chat-box {
	position: fixed !important;
	bottom: 0;
	z-index: 1000;
}
</style>
