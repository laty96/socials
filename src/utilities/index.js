import moment from "moment";
import m from "moment-shortformat";

export function createNotify(d) {
	if (!("Notification" in window)) {
		alert("This browser does not support desktop notification");
	} else if (Notification.permission === "granted") {
		var notification = new Notification("Notice", {
			body: d.body,
			icon: d.icon
		});
		setTimeout(notification.close.bind(notification), 4000);
		notification.onclick = function() {
			window.focus("https://4x2939pp80.codesandbox.io/#/");
		};
	} else if (Notification.permission !== "denied") {
		Notification.requestPermission();
	}
}

export function convertDate(d) {
	return isMobile.any() ? moment(d).short() : moment(d).fromNow();
}

export function convertShortDate(d) {
	return moment(d).short();
}

export function randomID() {
	return "_" + (Math.random() * Date.now()).toString(36).replace(".", "");
}

export function sortCmt(arr, field, order = true) {
	return arr.sort(function(a, b) {
		if (field == "like") return b.like.length - a.like.length;
		if (order) {
			return new Date(b[field]) - new Date(a[field]);
		} else {
			return new Date(a[field]) - new Date(b[field]);
		}
	});
}

export const isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows()
		);
	}
};
