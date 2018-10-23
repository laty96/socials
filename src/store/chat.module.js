import db from "../database/firestore";
import query from "../database/db.actions";
import Vue from "vue";
import {
	CREATE_CONVERSATION,
	GET_CONVERSATION,
	SEND_MESSAGE
} from "./actions.type";
import converModel from "../models/conversation.model";
import chatModel from "../models/chat.model";

var state = {
	conversations: [],
	unsub: []
};
var getters = {
	getConver() {
		return state.conversations;
	}
};
var mutations = {
	setChat(state, data) {
		if (state.conversations.length == 4) {
			state.conversations.shift(0, 1);
			state.unsub.shift(0, 1);
		}
		let a = false;
		state.conversations.forEach((c, i) => {
			if (c.id == data.doc.id) {
				state.conversations[i] = data.doc;
				state.unsub[i] = data.unsub;
				a = true;
				return;
			}
		});
		if (!a) {
			state.conversations.unshift(data.doc);
			state.unsub.unshift(data.unsub);
		}
		console.log(state.conversations);
	},
	// setThis(state, data) {
	// 	state.this = data;
	// },
	addChat(state, data) {
		state.conversations[data.index] = data.doc;
	},
	closeChat(state, k) {
		state.conversations.splice(k, 1);
	}
};
var actions = {
	[CREATE_CONVERSATION](c, i) {
		console.log(i);
		let data = {
			members: [i.u.id, i.userInfo.id]
		};
		// c.commit("setThis", i.nextTick);
		let conver = new converModel(data);
		query.createConversation(
			db,
			conver,
			doc => {
				console.log(doc);
			},
			err => console.log(err)
		);
	},
	[GET_CONVERSATION](c, i) {
		query.getConversation(
			db,
			i,
			(doc, unsub) => {
				console.log(doc);
				c.commit("setChat", { doc, unsub });
			},
			(doc, index) => {
				console.log(doc, index);
				c.commit("addChat", { doc, index });
			}
		);
	},
	[SEND_MESSAGE](c, mes) {
		console.log("mes", mes);
		let a = new chatModel(mes);
		query.sendMessage(db, mes._id, a, doc => {
			// console.log(a);
			c.state.this.$forceUpdate();
		});
	},
	CLOSE_CHAT(c, k) {
		c.commit("closeChat", k);
	}
};

var plugins = {};

export default {
	state,
	getters,
	mutations,
	actions,
	plugins
};
