
var Quiz = function(english,latin,info) {
    var startDate = new Date(0);
    startDate.setYear(this.START_YEAR);
    startDate.setMonth(0);
    startDate.setDate(1);
    var endDate = new Date(0);
    endDate.setYear(this.END_YEAR);

    this.datepicker = english;
    this.datepicker.datepicker("setStartDate",startDate);
    this.datepicker.datepicker("setEndDate",endDate);

    this.roman = latin;
    this.message = info;
};

Quiz.prototype.START_YEAR = moment().year()-2;
Quiz.prototype.END_YEAR = moment().year()+2;

Quiz.prototype.randomDate = function randomDate() {
    var year = chance.year({min: this.START_YEAR, max: this.END_YEAR});
    var date = chance.date({year: year, hour: 0, minutes: 0, seconds: 0});
    return date;
}

Quiz.prototype.displayEnglish = function displayEnglish() {
    this.datepicker.datepicker("setDate",this.englishDate).datepicker("update");
}

Quiz.prototype.displayRoman = function displayRoman() {
    this.roman.eq(0).val(this.romanDate.romanNumber());
    this.roman.eq(1).val(this.romanDate.nextDay.getName());
    this.roman.eq(2).val(this.romanDate.nextDay.monthName(true));
}

Quiz.prototype.newQuestion = function newQuestion(givenEnglish) {
    var date = this.randomDate();
    this.englishDate = date;
    this.romanDate = new RomanDay(date);
    this.toEnglish = !givenEnglish;
    this.answerShown = false;

    this.datepicker.prop("disabled",givenEnglish?"disabled":"").val("");
    this.roman.each(function(index,el){
	$(el).prop("disabled",givenEnglish?"":"disabled").val("-");
    });
    if (givenEnglish) {
	this.displayEnglish();
	this.message.html("Choose the corresponding <em>Roman</em> date.");
    } else {
	this.displayRoman();
	this.message.html("Choose the corresponding <em>English</em> date.");
    }
}

Quiz.prototype.checkAnswer = function checkAnswer() {
    if (!this.englishDate) { return false; }
    if (this.answerShown) {
	this.message.html("You have already viewed the answer!");
	return false;
    }

    var correct;
    if (this.toEnglish) {
	var userDate = moment(this.datepicker.datepicker("getDate"));
	userDate.year(moment(this.englishDate).year());
	correct = userDate.isSame(this.englishDate,"day");
    }
    else {
	correct = ( this.roman.eq(0).val() == this.romanDate.romanNumber() &&
		    this.roman.eq(1).val() == this.romanDate.nextDay.getName() &&
		    this.roman.eq(2).val() == this.romanDate.nextDay.monthName(true)
		  );
    }
    this.message.html(correct?"<em>CORRECT!</em>":"<strong>Incorrect!</strong>");
}

Quiz.prototype.showAnswer = function showAnswer() {
    if (!this.englishDate) { return false; }
    this.answerShown = true;
    if (this.toEnglish) {
	this.datepicker.prop("disabled","disabled");
	this.displayEnglish();
    } else {
	this.roman.prop("disabled","disabled");
	this.displayRoman();
    }
}

$(function(){

    $("#datepicker").datepicker({
	autoclose: true,
	format: "MM d"
    });

    var quiz = new Quiz($("#datepicker"),$("#selects select"),
			$(".instructions .lead"));
    window["quiz"] = quiz;

    // New English-to-Roman
    $("#new-etr").click(quiz.newQuestion.bind(quiz,true));

    // New Roman-to-English
    $("#new-rte").click(quiz.newQuestion.bind(quiz,false));

    $("#check").click(quiz.checkAnswer.bind(quiz));
    $("#show-answer").click(quiz.showAnswer.bind(quiz));

});
