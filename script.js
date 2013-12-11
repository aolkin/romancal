
function CalendarMonth(month,year) {
    this.monthStart = moment({month: month, year: year, day: 1});
}

CalendarMonth.prototype = {
    outputTo: function(el,header) {
	$(header).text("Loading...");
	this.currentRoot = $(el);
	this.currentRoot.empty().addClass("calendar");
	this.workingDay = this.monthStart.clone();
	this.makeRow(true);
	while (this.workingDay.month() == this.monthStart.month()) {
	    this.makeRow();
	}
	$(header).text(this.monthStart.format("MMMM YYYY"));
    },
    makeRow: function(initial) {
	var row = $("<tr>");
	if (initial) {
	    for (i = 0; i < this.monthStart.day(); i++) {
		$("<td>").addClass("empty-day").appendTo(row);
	    }
	}
	while (row.children().length < 7) {
	    var romanDay = new RomanDay(this.workingDay);
	    if ((romanDay.isSpecialDay() && romanDay.nextDay.getName() == "Kalends"
		 && !initial) || romanDay.nextDay.distance(romanDay.date) < 0) {
		$("<td>").addClass("empty-day").appendTo(row);
	    } else {
		var day = $("<td>").addClass("normal-day")
		    .text(romanDay);
		if (today.equals(this.workingDay)) {
		    day.addClass("today").attr("title","Today");
		}
		day.addClass(romanDay.nextDay.getName().toLowerCase());
		if (romanDay.isSpecialDay()) {
		    day.addClass("special-day");
		}
		$("<span>").text(this.workingDay.date()).addClass("num").appendTo(day);
		day.appendTo(row)
		this.workingDay.add("days",1);
	    }
	}
	this.currentRoot.append(row);
    },
    _adjacentMonth: function(multiplier) {
	var year = this.monthStart.year();
	var month = this.monthStart.month() + multiplier;
	if (month == 12) {
	    return new CalendarMonth(0, year + 1);
	}
	else if (month == -1) {
	    return new CalendarMonth(11, year - 1);
	}
	else {
	    return new CalendarMonth(month, year);
	}
    },
    nextMonth: function() {
	return this._adjacentMonth(1);
    },
    prevMonth: function() {
	return this._adjacentMonth(-1);
    },
    getMonth: function() {
	return this.monthStart.month();
    },
    getYear: function() {
	return this.monthStart.year();
    }
}

var today = new RomanDay();
var thisMonth = new CalendarMonth();
var currentMonth;

function reloadCalendar(calendar) {
    currentMonth = calendar;
    currentMonth.outputTo("#calendar tbody","#calendar-header h3");
}

$(function(){

    $("#text-info .lead strong").text(today.toString(true));
    reloadCalendar(thisMonth);

    // Add button handlers

    $("#toggle-colors").click(function(){
	$("#calendar table").toggleClass("table-striped");
	$("body").toggleClass("colorize-calendar");
    }).click();

    $("#prev-month").click(function(){
	reloadCalendar(currentMonth.prevMonth());
    });
    $("#next-month").click(function(){
	reloadCalendar(currentMonth.nextMonth());
    });

});
