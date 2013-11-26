

function RomanCalendar(date) {
    this.date = arguments[0] || moment();
    this.month = this.date.clone();
    this._update();
}

RomanCalendar.prototype = {
    _update: function() {
	this.month = this.date.clone();
	this.month.startOf("month");
	this.nextmonth = this.month.clone();
	this.nextmonth.month(this.month.month()+1);
    },
    set: function(name,val) {
	this.date[name](val);
	this._update();
    },
    getNextNamedDay: function() {
	var day = this.date.date();
	var array = this.getDayArray();
	var specialDay = 0;
	for (i in array) {
	    if (array[i] >= day) {
		var specialDay = i;
	    }
	}
	return specialDay;
    },
    getDayArray: function() {
	return ((this.specialMonths.indexOf(this.date.month()) > -1)?
		this.specialDays15:this.specialDays13);
    },
    specialMonths: [2,4,6,9],
    specialDays13: [13,5,1],
    specialDays15: [15,7,1],
    specialDays: ["Ides","Nones","Kalends"]
}
