<template>
  <div class="post-view" id="post-view">
		<div class="btn-group btn-group-sm my-2">
			<button class="btn btn-light" @click="prev"><i class="fas fa-arrow-left"></i></button>
			<button class="btn btn-light" @click="next"><i class="fas fa-arrow-right"></i></button>
		</div>
    <div class="card shadow post-view mb-2" v-for="(i, k) in post" :key="i[k]" @click="show(i)">
      <div class="card-body">
        <small>Posted by </small><small class="text-primary">{{i.owner}}</small><span class="badge badge-light"><small>{{cvDate(i.createdDate)}}</small></span>
        <h5 class="card-title">{{k}}  {{i.title}}
        </h5>
        <p class="card-text">{{i.content}}</p>
				<div class="btn-group btn-group-sm">
					<button type="button" class="btn btn-light shadow-sm" @click="viewComments(i)">
            <i class="fas fa-comment"></i> {{i.comment.length > 0 ? i.comment.length : '' }} {{i.comment.length > 1 ? 'Comments' : 'Comment'}}</button>
					<button type="button" class="btn btn-light shadow-sm" @click.stop="likePost(i, k)">
            <i class="fas fa-thumbs-up" v-bind:class="{'text-primary' : checkLiked(i) }"></i>  {{i.like.length > 0 ? i.like.length : ''}} Like</button>
					<button type="button" class="btn btn-light shadow-sm"><i class="fas fa-share"></i> Share</button>
				</div>
      </div>
    </div>
		<modal name="view-post">
    
		</modal>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { convertDate, isMobile } from "../utilities";

import { FETCH_POST_LIST, LIKE_POST } from "../store/actions.type";
import modal from "./Modal";

export default {
	name: "PostView",
	computed: mapState({
		post: state => state.postView.postList,
		userInfo: state => state.auth.userInfo,
		unsub: state => state.postView.unsub,
		limit: state => state.postView.limit
	}),
	watch: {
		post(n) {
			console.log(111111111);
			// console.log(n)
			this.$forceUpdate();
		}
	},
	beforeCreate() {
		this.$store.dispatch(FETCH_POST_LIST, {
			date: Date.now(),
			operator: "<",
			limit: 10
		});
	},
	methods: {
		likePost(i, k) {
			if (this.userInfo.email) {
				this.$store.dispatch(LIKE_POST, {
					id: i.id,
					user: this.userInfo.email
				});
			} else {
				this.$router.push("/login");
			}
			console.log(this.post);
		},
		show(i) {
			this.$modal.show(
				modal,
				{ i, isMobile: isMobile.any() },
				{
					height: "auto",
					width: isMobile.any() ? "100%" : "80%",
					style: { "z-index": 9000 },
					scrollable: true
				},
				{
					closed: this.hide
				}
			);
		},
		hide() {
			this.$modal.hide("view-post");
		},
		cvDate: convertDate,
		checkLiked(i) {
			// console.log(i.like.indexOf(this.userInfo.email))
			return i.like.indexOf(this.userInfo.email) >= 0;
			// let a = false
			// i.like.forEach(e => {
			//   if (e == this.userInfo.email) {
			//     a = true;
			//     return
			//   }
			// })
			// return a
		},
		prev() {
			this.unsub();
			this.limit - 10 < 0 ? (this.limit = 10) : (this.limit = this.limit - 10);
			this.$store.dispatch(FETCH_POST_LIST, {
				date: this.post[0].createdDate,
				operator: ">",
				limit: this.limit
			});
		},
		next() {
			this.unsub();
			this.$store.dispatch(FETCH_POST_LIST, {
				date: this.post[this.post.length - 1].createdDate,
				operator: "<",
				limit: this.limit + 10
			});
		}
	}
};
</script>

<style scoped>
.post-view {
	cursor: pointer;
}
</style>
