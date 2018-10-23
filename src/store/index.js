import Vue from "vue";
import Vuex from "vuex";

import postView from "./postView.module";
import newPost from "./newPost.module";
import postComment from "./postComment.module";
import auth from "./auth.module";
import chat from "./chat.module";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    postView,
    newPost,
    postComment,
    auth,
    chat
  }
});
