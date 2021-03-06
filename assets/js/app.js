// calander display code
!(function () {
	var today = moment();

	function Calendar(selector, events) {
		this.el = document.querySelector(selector);
		this.events = events;
		this.current = moment().date(1);
		this.draw();
		var current = document.querySelector(".today");
		if (current) {
			var self = this;
			window.setTimeout(function () {
				self.openDay(current);
			}, 500);
		}
	}

	Calendar.prototype.draw = function () {
		//Create Header
		this.drawHeader();

		//Draw Month
		this.drawMonth();

		// this.drawLegend();
	};

	Calendar.prototype.drawHeader = function () {
		var self = this;
		if (!this.header) {
			//Create the header elements
			this.header = createElement("div", "header");
			this.header.className = "header";

			this.title = createElement("h1");

			var right = createElement("div", "right");
			right.addEventListener("click", function () {
				self.nextMonth();
			});

			var left = createElement("div", "left");
			left.addEventListener("click", function () {
				self.prevMonth();
			});

			//Append the Elements
			this.header.appendChild(this.title);
			this.header.appendChild(right);
			this.header.appendChild(left);
			this.el.appendChild(this.header);
		}

		this.title.innerHTML = this.current.format("MMMM YYYY");
		let month = this.current.format("MMMM").toLowerCase();
		accordionUpdate(month);
	};

	Calendar.prototype.drawMonth = function () {
		var self = this;

		this.events.forEach(function (ev) {
			ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);
		});

		if (this.month) {
			this.oldMonth = this.month;
			this.oldMonth.className = "month out " + (self.next ? "next" : "prev");
			this.oldMonth.addEventListener("webkitAnimationEnd", function () {
				self.oldMonth.parentNode.removeChild(self.oldMonth);
				self.month = createElement("div", "month");
				self.backFill();
				self.currentMonth();
				self.fowardFill();
				self.el.appendChild(self.month);
				window.setTimeout(function () {
					self.month.className = "month in " + (self.next ? "next" : "prev");
				}, 16);
			});
		} else {
			this.month = createElement("div", "month");
			this.el.appendChild(this.month);
			this.backFill();
			this.currentMonth();
			this.fowardFill();
			this.month.className = "month new";
		}
	};

	Calendar.prototype.backFill = function () {
		var clone = this.current.clone();
		var dayOfWeek = clone.day();

		if (!dayOfWeek) {
			return;
		}

		clone.subtract("days", dayOfWeek + 1);

		for (var i = dayOfWeek; i > 0; i--) {
			this.drawDay(clone.add("days", 1));
		}
	};

	Calendar.prototype.fowardFill = function () {
		var clone = this.current.clone().add("months", 1).subtract("days", 1);
		var dayOfWeek = clone.day();

		if (dayOfWeek === 6) {
			return;
		}

		for (var i = dayOfWeek; i < 6; i++) {
			this.drawDay(clone.add("days", 1));
		}
	};

	Calendar.prototype.currentMonth = function () {
		var clone = this.current.clone();

		while (clone.month() === this.current.month()) {
			this.drawDay(clone);
			clone.add("days", 1);
		}
	};

	Calendar.prototype.getWeek = function (day) {
		if (!this.week || day.day() === 0) {
			this.week = createElement("div", "week");
			this.month.appendChild(this.week);
		}
	};

	Calendar.prototype.drawDay = function (day) {
		var self = this;
		this.getWeek(day);

		//Outer Day
		var outer = createElement("div", this.getDayClass(day));
		// outer.addEventListener("click", function () {
		// 	self.openDay(this);
		// });

		//Day Name
		var name = createElement("div", "day-name", day.format("ddd"));

		//Day Number
		var number = createElement("div", "day-number", day.format("DD"));

		//Events
		// var events = createElement("div", "day-events");
		// this.drawEvents(day, events);

		outer.appendChild(name);
		outer.appendChild(number);
		// outer.appendChild(events);
		this.week.appendChild(outer);
	};

	// Calendar.prototype.drawEvents = function (day, element) {
	// 	if (day.month() === this.current.month()) {
	// 		var todaysEvents = this.events.reduce(function (memo, ev) {
	// 			if (ev.date.isSame(day, "day")) {
	// 				memo.push(ev);
	// 			}
	// 			return memo;
	// 		}, []);

	// 		todaysEvents.forEach(function (ev) {
	// 			var evSpan = createElement("span", ev.color);
	// 			element.appendChild(evSpan);
	// 		});
	// 	}
	// };

	Calendar.prototype.getDayClass = function (day) {
		classes = ["day"];
		if (day.month() !== this.current.month()) {
			classes.push("other");
		} else if (today.isSame(day, "day")) {
			classes.push("today");
		}
		return classes.join(" ");
	};

	Calendar.prototype.openDay = function (el) {
		var details, arrow;
		var dayNumber =
			+el.querySelectorAll(".day-number")[0].innerText ||
			+el.querySelectorAll(".day-number")[0].textContent;
		var day = this.current.clone().date(dayNumber);

		var currentOpened = document.querySelector(".details");

		//Check to see if there is an open detais box on the current row
		if (currentOpened && currentOpened.parentNode === el.parentNode) {
			details = currentOpened;
			arrow = document.querySelector(".arrow");
		} else {
			//Close the open events on differnt week row
			//currentOpened && currentOpened.parentNode.removeChild(currentOpened);
			if (currentOpened) {
				currentOpened.addEventListener("webkitAnimationEnd", function () {
					currentOpened.parentNode.removeChild(currentOpened);
				});
				currentOpened.addEventListener("oanimationend", function () {
					currentOpened.parentNode.removeChild(currentOpened);
				});
				currentOpened.addEventListener("msAnimationEnd", function () {
					currentOpened.parentNode.removeChild(currentOpened);
				});
				currentOpened.addEventListener("animationend", function () {
					currentOpened.parentNode.removeChild(currentOpened);
				});
				currentOpened.className = "details out";
			}

			//Create the Details Container
			details = createElement("div", "details in");

			//Create the arrow
			var arrow = createElement("div", "arrow");

			//Create the event wrapper

			details.appendChild(arrow);
			el.parentNode.appendChild(details);
		}

		var todaysEvents = this.events.reduce(function (memo, ev) {
			if (ev.date.isSame(day, "day")) {
				memo.push(ev);
			}
			return memo;
		}, []);

		// this.renderEvents(todaysEvents, details);

		arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + "px";
	};

	Calendar.prototype.nextMonth = function () {
		this.current.add("months", 1);
		this.next = true;
		this.draw();
	};

	Calendar.prototype.prevMonth = function () {
		this.current.subtract("months", 1);
		this.next = false;
		this.draw();
	};

	window.Calendar = Calendar;

	function createElement(tagName, className, innerText) {
		var ele = document.createElement(tagName);
		if (className) {
			ele.className = className;
		}
		if (innerText) {
			ele.innderText = ele.textContent = innerText;
		}
		return ele;
	}
})();

!(function () {
	var data = [
		{ eventName: "Lunch Meeting w/ Mark", calendar: "Work", color: "orange" },
		{
			eventName: "Interview - Jr. Web Developer",
			calendar: "Work",
			color: "orange",
		},
		{
			eventName: "Demo New App to the Board",
			calendar: "Work",
			color: "orange",
		},
		{ eventName: "Dinner w/ Marketing", calendar: "Work", color: "orange" },

		{ eventName: "Game vs Portalnd", calendar: "Sports", color: "blue" },
		{ eventName: "Game vs Houston", calendar: "Sports", color: "blue" },
		{ eventName: "Game vs Denver", calendar: "Sports", color: "blue" },
		{ eventName: "Game vs San Degio", calendar: "Sports", color: "blue" },

		{ eventName: "School Play", calendar: "Kids", color: "yellow" },
		{
			eventName: "Parent/Teacher Conference",
			calendar: "Kids",
			color: "yellow",
		},
		{
			eventName: "Pick up from Soccer Practice",
			calendar: "Kids",
			color: "yellow",
		},
		{ eventName: "Ice Cream Night", calendar: "Kids", color: "yellow" },

		{ eventName: "Free Tamale Night", calendar: "Other", color: "green" },
		{ eventName: "Bowling Team", calendar: "Other", color: "green" },
		{ eventName: "Teach Kids to Code", calendar: "Other", color: "green" },
		{ eventName: "Startup Weekend", calendar: "Other", color: "green" },
	];

	function addDate(ev) {}

	var calendar = new Calendar("#calendar", data);
})();

// update accordion information

function accordionUpdate(month) {
	let months = [
		"january",
		"february",
		"march",
		"april",
		"may",
		"june",
		"july",
		"august",
		"september",
		"october",
		"november",
		"december",
	];

	let week1 = [
		"This is the first item's accordion body. It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.",
		"appropriate classes that we use to style each element These classes control the overall appearance as well as the showing and hiding via CSS transitions You can modify any of this",
		"masdarch",
		"aprqweqewil",
		"mttay",
		"juetretne",
		"juhkhjly",
		"augvbvnrtyryust",
		"seruryuptember",
		"oct12314ober",
		"novtryember",
		"dece68575mber",
	];
	let week2 = [
		"This is the first item's accordion body. It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.",
		"appropriate classes that we use to style each element These classes control the overall appearance as well as the showing and hiding via CSS transitions You can modify any of this",
		"masdarch",
		"aprqweqewil",
		"mttay",
		"juetretne",
		"juhkhjly",
		"augvbvnrtyryust",
		"seruryuptember",
		"oct12314ober",
		"novtryember",
		"dece68575mber",
	];
	let week3 = [
		"This is the first item's accordion body. It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.",
		"appropriate classes that we use to style each element These classes control the overall appearance as well as the showing and hiding via CSS transitions You can modify any of this",
		"masdarch",
		"aprqweqewil",
		"mttay",
		"juetretne",
		"juhkhjly",
		"augvbvnrtyryust",
		"seruryuptember",
		"oct12314ober",
		"novtryember",
		"dece68575mber",
	];
	let week4 = [
		"This is the first item's accordion body. It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.",
		"appropriate classes that we use to style each element These classes control the overall appearance as well as the showing and hiding via CSS transitions You can modify any of this",
		"masdarch",
		"aprqweqewil",
		"mttay",
		"juetretne",
		"juhkhjly",
		"augvbvnrtyryust",
		"seruryuptember",
		"oct12314ober",
		"novtryember",
		"dece68575mber",
	];
	let month1 = months.indexOf(month);
	let week1Internal = week1[month1];
	let week2Internal = week2[month1];
	let week3Internal = week3[month1];
	let week4Internal = week4[month1];
	document.getElementById("updateText1").innerHTML = week1Internal;
	document.getElementById("updateText2").innerHTML = week2Internal;
	document.getElementById("updateText3").innerHTML = week3Internal;
	document.getElementById("updateText4").innerHTML = week4Internal;
	console.log(
		month1 + " " + week1Internal + week2Internal + week3Internal + week4Internal
	);
}
