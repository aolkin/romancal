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

function SpecialDay(month,index) {
    this.index = (typeof index === "number")?index:SpecialDay.names.indexOf(index);
    this.moment = moment();
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
	for (i in RomanDay.months[this.month]) {
	    if (!RomanDay.months[this.month][i].passed(this.date)) {
		return RomanDay.months[this.month][i];
	    }
	}
	return RomanDay.months[this.month + 1][0];
    },
    toString: function(longform) {
	var dist = this.nextDay.distance(this.date);
	var name = this.nextDay.getName();
	var out = "";
	if (dist === 0) {
	    out = name;
	} else if (dist === 1) {
	    out = "Pridie " + name;
	} else {
	    out = (dist+1).toRoman() + " " + name;
	}
	out += " " + this.nextDay.monthName(longform);
	return out;
    },
    equals: function(day) {
	return this.date.isSame(moment.isMoment(day)?day:day.date,"day");
    },
    isSpecialDay: function() {
	return this.nextDay.distance(this.date) === 0;
    }
}

RomanDay.months = [];
for (i = 0; i < 13; i++) {
    var dayArray = [];

    for (j = 0; j < 3; j++) {
	dayArray.push(new SpecialDay(i,j));
    }

    RomanDay.months.push(dayArray);
}
