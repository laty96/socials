<template>
  <div class="modal-wrapper">
    <div class="card">
      <div class="card-header">
        <h5 class="card-title">{{i.title}} 
				<button class="close float-right" @click="$emit('close')">
					<i class="fas fa-times"></i>
				</button>
				</h5>
        <small>Posted by </small><small class="text-primary">{{i.owner}}</small><span class="badge badge-light text-secondary">{{cvDate(i.createdDate)}}</span>
      </div>
      <div class="card-body" :class="{'p-1': isMobile}">
        <div class="card-text" :class="{'p-2': isMobile}">{{i.content}} 
        </div>
        <hr>
        <div class="form-group" v-if="userInfo.name">
					<label for="comment-input">Comment as <small>{{userInfo.name}}</small></label>
					<textarea class="form-control" id="comment-input" rows="4" v-model="newComment.content"></textarea>
					<button class="form-control btn btn-secondary my-2" v-bind:class="{'disabled': !newComment.content}" @click="postComment">Comment</button>
        </div>
        <div class="">
          <div class="d-flex dropdown custom-control-inline">
						<button type="button" class="btn  btn-sm btn-light dropdown-toggle mr-auto" data-toggle="dropdown">
							<code>Sort by:</code> <span class="badge badge-secondary p-1"> {{sortTypeValue}}</span>
						</button>
						<div class="dropdown-menu">
							<a @click="sortComment(1)" class="dropdown-item" v-bind:class="{active: sortType == 1}" href="#">Best</a>
							<a @click="sortComment(2)" class="dropdown-item" v-bind:class="{active: sortType == 2}" href="#">New</a>
							<a @click="sortComment(3)" class="dropdown-item" v-bind:class="{active: sortType == 3}" href="#">Old</a>
						</div>
						<div class="btn-group btn-group-sm">
							<button type="button" class="btn btn-secondary shadow-sm" @click.stop="likePost(i)" :class="{'text-primary': i.like.indexOf(userInfo.email) > 0}">
							<i class="fas fa-thumbs-up"></i> Like</button>
						</div>
					</div>
				</div>
				<hr>
				<div v-for="(c, k) in commentList.comment" :key="c.commentID" >
					<!--<div v-if="loading" class="align-content-center" style="text-align: center">
						<div id="loader-7">
							<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
						</div>
					</div> -->
          <dl class="border-secondary border-left pl-1 ml-2">
						<dt>
						<i class="fas fa-caret-down" style="cursor:pointer" data-toggle="collapse" v-bind:data-target="'#'+c.commentID" v-if="commentList.reply ? commentList.reply[c.commentID] : false"></i>
						<small class="text-primary"> {{c.owner}}</small></dt>
            <dd>{{c.content}}<small class="text-secondary"> &nbsp; - &nbsp;{{cvDate(c.createdTime)}}</small></dd>
						<Reply :parentCmt="c" :commentID="c.commentID" :user="userInfo" :postId="i.id" :index="k"/>
						<dl class="border-secondary border-left pl-1 ml-2 collapse show" v-for="(q, k) in commentList.reply ? commentList.reply[c.commentID] : []" v-bind:id="''+c.commentID" :key="q.commentID" v-if="!commentList.reply.length"> 
							<dt>
							<i class="fas fa-caret-down" style="cursor:pointer" data-toggle="collapse" v-bind:data-target="'#'+q.commentID" v-if="commentList.reply[q.commentID] ? commentList.reply[q.commentID] : false" ></i>
							<small class="text-primary"> {{q.owner}}</small></dt>
							<dd>{{q.content}}<small class="text-secondary"> &nbsp; - &nbsp;{{cvDate(q.createdTime)}}</small></dd>
					    <Reply :parent2CmtID="c.commentID" :parentCmt="q" :commentID="q.commentID" :user="userInfo" :postId="i.id" :index="k"/>
							<dl class="border-secondary border-left pl-1 ml-2  collapse show" v-bind:id="''+q.commentID" v-for="(w, k) in commentList.reply[q.commentID]" :key="w.commentID"> 
								<dt>
								<i class="fas fa-caret-down" style="cursor:pointer" data-toggle="collapse" v-bind:data-target="'#'+w.commentID" v-if="commentList.reply[w.commentID] ? commentList.reply[w.commentID] : false" ></i>
								<small class="text-primary"> {{w.owner}}</small></dt>
								<dd>{{w.content}}<small class="text-secondary"> &nbsp; - &nbsp;{{cvDate(w.createdTime)}}</small></dd>
								<Reply :parent2CmtID="q.commentID" :parentCmt="w" :commentID="w.commentID" :user="userInfo" :postId="i.id" :index="k"/>
								<dl class="border-secondary border-left pl-1 ml-2  collapse show" v-bind:id="''+w.commentID" v-for="(e, k) in commentList.reply[w.commentID]" :key="e.commentID"> 
									<dt>
									<i class="fas fa-caret-down" style="cursor:pointer" data-toggle="collapse" v-bind:data-target="'#'+e.commentID" v-if="commentList.reply[e.commentID] ? commentList.reply[e.commentID] : false" ></i>
									<small class="text-primary"> {{e.owner}}</small></dt>
									<dd>{{e.content}}<small class="text-secondary"> &nbsp; - &nbsp;{{cvDate(e.createdTime)}}</small></dd>
									<Reply :parent2CmtID="w.commentID" :parentCmt="e" :commentID="e.commentID" :user="userInfo" :postId="i.id" :index="k"/>
									<dl class="border-secondary border-left pl-1 ml-2  collapse show" v-bind:id="''+e.commentID" v-for="(r, k) in commentList.reply[e.commentID]" :key="r.commentID"> 
										<dt>
										<i class="fas fa-caret-down" style="cursor:pointer" data-toggle="collapse" v-bind:data-target="'#'+r.commentID" v-if="commentList.reply[r.commentID] ? commentList.reply[r.commentID] : false" ></i>
										<small class="text-primary"> {{r.owner}}</small></dt>
										<dd>{{r.content}}<small class="text-secondary"> &nbsp; - &nbsp;{{cvDate(r.createdTime)}}</small></dd>
										<Reply :parent2CmtID="e.commentID" :parentCmt="r" :commentID="r.commentID" :user="userInfo" :postId="i.id" :index="k"/>
										<dl class="border-secondary border-left pl-1 ml-2  collapse show" v-bind:id="''+r.commentID" v-for="(t, k) in commentList.reply[r.commentID]" :key="t.commentID"> 
											<dt>
											<small class="text-primary"> {{t.owner}}</small></dt>
											<dd><div v-if="t.mentioned" v-html="t.mentioned"></div> &nbsp; {{t.content}}<small class="text-secondary"> &nbsp; - &nbsp;{{cvDate(r.createdTime)}}</small></dd>
											<Reply :parent2CmtID="r.commentID" :parentCmt="t" :commentID="t.commentID" :user="userInfo" :postId="i.id" :index="k"/>
										</dl>
									</dl>
								</dl>
							</dl>
						</dl>
            <hr>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Reply from "./Reply";

import {
	POST_COMMENT,
	FETCH_COMMENT,
	FETCH_POST_LIST,
	LIKE_POST,
	REPLY_COMMENT
} from "../store/actions.type";

import { sortCmt, convertDate } from "../utilities/index";

export default {
	name: "modal",
	components: {
		Reply
	},
	props: {
		i: Object,
		isMobile: null
	},
	data() {
		return {
			newComment: {
				content: ""
			},
			sortType: 2,
			commentList: [],
			// loading: true,
			isReplied: true
		};
	},
	computed: {
		// ...mapGetters(["comment", "userInfo"]),
		...mapState({
			comment: state => state.postComment.comment,
			userInfo: state => state.auth.userInfo
		}),
		sortTypeValue() {
			if (this.sortType == 1) return "Best";
			else if (this.sortType == 2) return "New";
			else if (this.sortType == 3) return "Old";
		}
	},
	watch: {
		comment(n) {
			// this.commentList = this.comment.comment;
			this.commentList = Object.assign({}, this.commentList, this.comment);
			if (this.commentList.comment) {
				if (this.sortType == 1) {
					let a = sortCmt(this.commentList.comment, "like", false);
					this.commentList.comment = a;
				} else if (this.sortType == 2) {
					let a = sortCmt(this.commentList.comment, "createdTime", true);
					this.commentList.comment = a;
				} else if (this.sortType == 3) {
					let a = sortCmt(this.commentList.comment, "createdTime", false);
					this.commentList.comment = a;
				}
			}
			// this.loading = false;
			this.$forceUpdate();
		}
	},
	methods: {
		cvDate: convertDate,
		force() {
			this.$forceUpdate();
			console.log(this.comment);
			console.log(this.commentList);
		},
		next() {
			this.$nextTick();
		},
		postComment() {
			if (this.newComment.content) {
				let a = {
					id: this.i.id,
					content: this.newComment.content,
					createdTime: Date.now(),
					owner: this.userInfo.name,
					ownerId: this.userInfo._id
				};
				this.$store.dispatch(POST_COMMENT, a);
				this.newComment.content = "";
				// this.$store.dispatch(FETCH_COMMENT, this.i.id);
				window.setTimeout(() => {
					this.commentList = this.comment;
				}, 1000);
			}
		},
		sortComment(type) {
			this.sortType = type;
			if (type == 1) {
				let a = sortCmt(this.commentList.comment, "like", false);
				this.commentList.comment = a;
			} else if (type == 2) {
				let a = sortCmt(this.commentList.comment, "createdTime", true);
				this.commentList.comment = a;
			} else if (type == 3) {
				let a = sortCmt(this.commentList.comment, "createdTime", false);
				this.commentList.comment = a;
			}
		},
		// replyComment(k) {
		// 	if (!this.userInfo.email) {
		// 		this.$emit('close')
		// 		this.$router.push('/login')
		// 	}
		// 	this.commentList[k].isReplied = !this.commentList[k].isReplied;
		// 	this.$forceUpdate();
		// },
		// onReply(c) {
		// 	if (!this.userInfo.email) {
		// 		this.$emit('close')
		// 		this.$router.push('/login')
		// 	}	else {
		// 		let a = {
		// 			commentID: c.commentID,
		// 			postId: this.i.id,
		// 			reply: c.reply,
		// 			floor: c.floor,
		// 			user: this.userInfo.email,
		// 			owner: c.owner
		// 		}
		// 		console.log(a)
		// 		if (c.reply.length) this.$store.dispatch(REPLY_COMMENT, a)
		// 	}
		// },
		likePost(i) {
			if (!this.userInfo.email) this.$router.push("/login");
			else {
				i.isLiked = !i.isLiked;
				this.$store.dispatch(LIKE_POST, {
					id: i.id,
					user: this.userInfo.email
				});
				this.$forceUpdate();
			}
			// this.$store.dispatch(FETCH_POST_LIST)
		},
		likeComment(c) {}
	},
	created() {
		this.$store.dispatch(FETCH_COMMENT, this.i.id);
	},
	mounted() {
		// this.$store.dispatch(GET_POST, this.i.id)
		document.getElementsByTagName("body")[0].style.overflow = "hidden";
	},
	destroyed() {
		document.getElementsByTagName("body")[0].style.overflow = "";
	}
};
</script>

<style>
.modal-wrapper {
	top: 80px;
}

textarea {
	resize: none;
}
#loader-7 span {
	display: inline-block;
	height: 15px;
	width: 15px;
	background: #808080;
	border-radius: 0px;
}
#loader-7 span:nth-child(1) {
	-webkit-animation: temp 1s 0.05s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.05s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(2) {
	-webkit-animation: temp 1s 0.1s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.1s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(3) {
	-webkit-animation: temp 1s 0.15s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.15s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(4) {
	-webkit-animation: temp 1s 0.2s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.2s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(5) {
	-webkit-animation: temp 1s 0.25s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.25s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(6) {
	-webkit-animation: temp 1s 0.3s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.3s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(7) {
	-webkit-animation: temp 1s 0.35s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.35s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(8) {
	-webkit-animation: temp 1s 0.4s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.4s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(9) {
	-webkit-animation: temp 1s 0.45s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.45s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(10) {
	-webkit-animation: temp 1s 0.5s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.5s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(11) {
	-webkit-animation: temp 1s 0.55s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.55s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(12) {
	-webkit-animation: temp 1s 0.6s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.6s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(13) {
	-webkit-animation: temp 1s 0.65s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.65s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(14) {
	-webkit-animation: temp 1s 0.7s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.7s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(15) {
	-webkit-animation: temp 1s 0.75s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.75s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(16) {
	-webkit-animation: temp 1s 0.8s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.8s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(17) {
	-webkit-animation: temp 1s 0.85s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.85s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(18) {
	-webkit-animation: temp 1s 0.9s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.9s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(19) {
	-webkit-animation: temp 1s 0.95s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.95s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(20) {
	-webkit-animation: temp 1s 1s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 1s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
@keyframes temp {
	50% {
		-webkit-transform: scale(1, 5);
		transform: scale(1, 5);
		background: #195c53;
	}
}
</style>
