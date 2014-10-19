Number.prototype.toRoman= function(){
    var n= Math.abs(Math.floor(this)),val,s= '',limit= 3999,i= 0;
    v= [1000,900,500,400,100,90,50,40,10,9,5,4,1],
    r= ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
    if(n< 1 || n> limit) return '';
    while(i<13){
        val= v[i];
        while(n>= val){
            n-= val;
            s+= r[i];
        }
        if(n== 0) return s;
        ++i;
    }
    return '';
}

function SpecialDay(month,index,year) {
    this.index = (typeof index === "number")?index:SpecialDay.names.indexOf(index);
    this.moment = moment({hour: 0, minute: 0, second: 0});
    if (year) { this.moment.year(year); }
    this.moment.month(month);
    this.moment.date(SpecialDay["days"+(this.isSpecialMonth()?15:13)][this.index]);
}

SpecialDay.prototype = {
    isSpecialMonth: function() {
	return (SpecialDay.months.indexOf(this.moment.month()) > -1);
    },
    getName: function() {
	return SpecialDay.names[this.index];
    },
    monthName: function(fullname) {
	return this.moment.format("MMM"+(fullname?"M":""));
    },
    passed: function(moment) {
	return this.moment.isBefore(moment,'day');
    },
    distance: function(moment) {
	return this.moment.diff(moment,"days");
    },
    toString: function() {
	return this.moment.toString();
    }
}

SpecialDay.names = ["Kalends","Nones","Ides"];
SpecialDay.months = [2,4,6,9];
SpecialDay.days13 = [1,5,13];
SpecialDay.days15 = [1,7,15];


function RomanDay(date) {
    this.date = (moment.isMoment(arguments[0]) && arguments[0]) ||
	(arguments[0] && moment(arguments[0])) || moment();
    this.date.hour(0).minute(0).second(0).millisecond(0);
    this._update();
}

RomanDay.prototype = {
    _update: function() {
	this.month = this.date.month();
	this.nextDay = this.nextSpecialDay();
    },
    set: function(name,val) {
	this.date[name](val);
	this._update();
    },
    get: function(name) {
	this.date[name]();
    },
    nextSpecialDay: function() {
	var months = RomanDay.getYear(this.date.year());
	for (i in months[this.month]) {
	    if (!months[this.month][i].passed(this.date)) {
		return months[this.month][i];
	    }
	}
	return months[this.month + 1][0];
    },
    romanNumber: function() {
	var dist = this.nextDay.distance(this.date);
	if (dist === 0) {
	    return "";
	} else if (dist === 1) {
	    return "Pridie";
	} else {
	    return (dist+1).toRoman();
	}
    },
    toString: function(longform) {
	var name = this.nextDay.getName();
	return (this.romanNumber() + " " + name + " " +
		this.nextDay.monthName(longform)).trim();
    },
    equals: function(day) {
	return this.date.isSame(moment.isMoment(day)?day:day.date,"day");
    },
    isSpecialDay: function() {
	return this.nextDay.distance(this.date) === 0;
    }
}

RomanDay.years = {};
RomanDay.getYear = function(year) {
    if (!RomanDay.years[year]) {
	var months = RomanDay.years[year] = [];
	for (i = 0; i < 13; i++) {
	    var dayArray = [];
	    
	    for (j = 0; j < 3; j++) {
		dayArray.push(new SpecialDay(i,j,year));
	    }
	    months.push(dayArray);
	}
    }
    return RomanDay.years[year];
}
