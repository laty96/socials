import { f } from "../database/firestore";
import userModel from "../models/user.model";

function deletePost(document, field, operator, value, db, errorCallback) {
	db.collection(document)
		.where(field, operator, value)
		.get()
		.then(querySnapshot => {
			querySnapshot.forEach(doc => {
				doc.ref.delete();
			});
		})
		.catch(err => errorCallback(err));
}

function fetchPosts(
	document,
	field,
	db,
	callbackNew,
	callbackMod,
	callbackDel,
	errorCallback,
	order,
	time,
	operator,
	limit,
	name
) {
	if (!order) order = "desc";
	if (name) {
	} else {
		let a = [];
		var unsubscribe = db
			.collection(document)
			// .where("")
			.orderBy(field, "desc")
			.limit(limit)
			.onSnapshot(function(snapshot) {
				snapshot.docChanges().forEach(function(change) {
					if (change.type === "modified") {
						let m = change.doc.data();
						m.id = change.doc.id;
						callbackMod(m, change.oldIndex);
					}
					if (change.type === "removed") {
						callbackDel(change.oldIndex);
					}
				});
				let b = [];
				snapshot.forEach(doc => {
					let d = doc.data();
					d.id = doc.id;
					b.push(d);
				});
				callbackNew(b, unsubscribe, limit);
			});
	}

	//set all documents
	// db.collection("POSTS")
	// 	.get()
	// 	.then(doc => {
	// 		doc.forEach(d => {
	// 			db.collection("POSTS")
	// 				.doc(d.id)
	// 				.set(
	// 					{
	// 						reply: [""]
	// 					},
	// 					{
	// 						merge: true
	// 					}
	// 				);
	// 		});
	// 	});
}

function getPost(db, document, id, callback) {
	let unsubscribe = db
		.collection(document)
		.doc(id)
		.onSnapshot(snapshot => {
			let a = snapshot.data();
			a.id = snapshot.id;
			callback(a, unsubscribe);
		});
}

function searchQuery(
	document,
	field,
	operator,
	value,
	db,
	callback,
	errorCallback,
	orderField = "id",
	order = "asc"
) {
	let a = [];
	db.collection(document)
		.where(field, operator, value)
		.orderBy(orderField, order)
		// .get()
		.onSnapshot(function(querySnapshot) {
			let a = [];
			querySnapshot.forEach(function(doc) {
				let b = doc.data();
				b._id = doc.data().id;
				b.id = doc.id;
				a.push(b);
			});
			callback(a, querySnapshot);
		});
	// .catch(err => errorCallback(err));
}

function createPost(document, payload, db, callback, errorCallback) {
	db.collection(document)
		.add(Object.assign({}, payload))
		.then(function(doc) {
			callback(doc);
		})
		.catch(err => errorCallback(err));
}

function addUser(db, userInfo, callback, errorCallback) {
	let u = new userModel(userInfo);
	db.collection("users")
		.add(Object.assign({}, u))
		.then(function(doc) {
			callback(doc);
			createNotifyDoc(db, u.id);
		})
		.catch(err => errorCallback(err));
}

function postComment(document, db, id, c, callback, errorCallback) {
	let cmt = Object.assign({}, c);
	db.collection(document)
		.doc(id)
		.update({
			comment: f.FieldValue.arrayUnion(cmt),
			time: f.FieldValue.serverTimestamp()
		})
		.then(doc => callback(doc))
		.catch(err => errorCallback(err));
}

function likePost(document, db, id, user, callback, errorCallback) {
	let isLiked = false;
	db.collection(document)
		.doc(id)
		.get()
		.then(doc => {
			let a = doc.data();
			a.like.forEach(u => {
				if (u == user) {
					isLiked = true;
				}
			});
			if (isLiked) {
				db.collection(document)
					.doc(id)
					.update({
						like: f.FieldValue.arrayRemove(user)
					})
					.then(doc => {
						callback(doc);
					})
					.catch(err => errorCallback(err));
			} else {
				db.collection(document)
					.doc(id)
					.update({
						like: f.FieldValue.arrayUnion(user)
					})
					.then(doc => {
						callback(doc);
					})
					.catch(err => errorCallback(err));
			}
		});
}

function getPostComment(document, db, id, callback, errorCallback) {
	db.collection(document)
		.doc(id)
		// .get()
		// .then(doc => {
		// 	let a = doc.data();
		// 	callback(a.comment);
		// })
		// .catch(err => errorCallback(err));
		.onSnapshot(snapshot => {
			let a = snapshot.data();
			if (a.comment.length) callback(a);
			else {
				callback("");
			}
			// snapshot.docChanges().forEach(change => {
			// 	callback(change.doc.data());
			// });
		});
}

function userOffline(db, email, callback) {
	db.collection("users")
		// .doc(id)
		.where("email", "==", email)
		.get()
		.then(querySnapshot => {
			let a = querySnapshot.docs[0].id;
			db.collection("users")
				.doc(a)
				.update({ status: false });
			callback();
		});
}

function userOnline(db, email) {
	db.collection("users")
		.where("email", "==", email)
		.get()
		.then(querySnapshot => {
			if (querySnapshot.docs) {
				let a = querySnapshot.docs[0].id;
				db.collection("users")
					.doc(a)
					.update({
						status: true,
						lastLogedIn: Date.now()
					});
			}
		});
}

function getUserList(db, u, callback, errorCallback) {
	db.collection("users").onSnapshot(function(querySnapshot) {
		let a = [];
		querySnapshot.forEach(doc => {
			let b = doc.data();
			b.id = doc.id;
			if (u.email != b.email) a.push(b);
		});
		callback(a);
	});
}

function createConversation(db, data, callback, errorCallback) {
	db.collection("chat")
		.where("membersId", "array-contains", data.membersId[0])
		.get()
		.then(querySnapshot => {
			if (querySnapshot.empty) {
				db.collection("chat")
					.add(Object.assign({}, data))
					.then(doc => {
						callback(doc);
					})
					.catch(err => errorCallback(err));
			}
		});
}

function sendMessage(db, membersId, mes, callback, errorCallback) {
	db.collection("chat")
		.doc(membersId)
		.update({
			content: f.FieldValue.arrayUnion(Object.assign({}, mes))
		})
		.then(doc => callback(doc))
		.catch(err => errorCallback);
}

function getConversation(db, membersId, callbackNew, callbackMod) {
	// console.log(membersId);
	var unsubscribe = db
		.collection("chat")
		.where("membersId", "array-contains", membersId)
		.limit(1)
		.onSnapshot(function(snapshot) {
			snapshot.docChanges().forEach(function(change) {
				if (change.type === "modified") {
					let m = change.doc.data();
					m.id = change.doc.id;
					callbackMod(m, change.oldIndex);
				}
			});
			let b = [];
			snapshot.forEach(doc => {
				let d = doc.data();
				d.id = doc.id;
				b.push(d);
			});
			callbackNew(b, unsubscribe);
		});
}

function replyComment(db, document, id, order, reply) {
	let rep = Object.assign({}, reply);
	let field = `reply.${order}`;
	console.log(rep);
	db.collection(document)
		.doc(id)
		.update({
			[field]: f.FieldValue.arrayUnion(rep)
		});
}

function likeComment(db, document, id, commentID, email, parentCmtID, index) {
	let a = {};
	a[`reply.${parentCmtID}.${index}.like`] = email;
	let path = `reply.${parentCmtID}.${index}.commentID`;
	console.log(a);
	db.collection(document)
		.doc(id)
		// .where(path, "==", commentID)
		// .get()
		// .then(doc => {
		// 	doc.forEach(d => {
		// 		console.log(d.data());
		// 	});
		// });
		// .update(a);
		.set(a, { merge: true });
}

function addFriend(db, document, user) {
	console.log(user);
	db.collection(document)
		.doc(user.userInfo.id)
		.update({
			friends: f.FieldValue.arrayUnion(user.u.email)
		});
}

function unFriend(db, document, user) {
	console.log(user);
	db.collection(document)
		.doc(user.userInfo.id)
		.update({
			friends: f.FieldValue.arrayRemove(user.u.email)
		});
}

function notifyUser(db, noti) {
	db.collection("notify")
		.add(Object.assign({}, noti))
		.then(doc => console.log(doc))
		.catch(err => console.log(err));
}

function createNotifyDoc(db, id) {
	db.collection("notify")
		.doc(id)
		.set(
			{
				notify: []
			},
			{ merge: true }
		);
}
function getActiveNoti(db, id, callback, errorCallback) {
	db.collection("notify")
		.where("ownerId", "==", id)
		.where("isActive", "==", true)
		.orderBy("createdTime", "desc")
		.onSnapshot(snapshot => {
			let a = [];
			snapshot.forEach(doc => {
				a.push(doc.data());
			});
			callback(a);
		});
}

function getInactiveNoti(db, id, callback, limit) {
	db.collection("notify")
		.where("ownerId", "==", id)
		.where("isActive", "==", false)
		.orderBy("createdTime", "desc")
		.limit(limit)
		.onSnapshot(snapshot => {
			let a = [];
			snapshot.forEach(doc => {
				a.push(doc.data());
			});
			callback(a);
		});
}

function notifyRead(db, id) {
	db.collection("notify")
		.where("ownerId", "==", id)
		.where("isActive", "==", true)
		.get()
		.then(doc => {
			doc.forEach(d => {
				db.collection("notify")
					.doc(d.id)
					.update({
						isActive: false
					});
			});
		});
}

const dataQuery = {
	searchQuery,
	fetchPosts,
	deletePost,
	createPost,
	addUser,
	postComment,
	likePost,
	getPostComment,
	userOffline,
	userOnline,
	getUserList,
	createConversation,
	sendMessage,
	getConversation,
	replyComment,
	likeComment,
	addFriend,
	unFriend,
	notifyUser,
	getActiveNoti,
	getInactiveNoti,
	notifyRead,
	getPost
};
export default dataQuery;
