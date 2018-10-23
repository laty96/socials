export default class Conversation {
	constructor(a) {
		this.owner = a.owner;
		// this.ownerId = a.ownerId;
		this.createdTime = Date.now();
		this.message = a.message;
		this.img = [];
	}
}
