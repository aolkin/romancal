
function Labeler(section,textarea){
    this.root = $(section);
    this.textarea = textarea;

    this.text = "";
    this.s = [];
}

Labeler.prototype.update = function update(e) {
    this.text = $(this.textarea).val();
    this.s = this._parse(this.text);

    for (var i = 0; i < this.s.length; i++) {
	this.createRow(this.s[i]);
    }
}

Labeler.prototype.createRow = function createRow(sentence) {
    var el = $("<div>").addClass("sentence");
    this.root.append(el);

    for (var i = 0; i < sentence.length; i++) {
	var word = $("<span>").addClass("word").appendTo(el);
	var text = $("<span>").addClass("text").text(sentence[i]);
	if (sentence[i].length > 2) {
	    word.append($("<input>").addClass("wlabel form-control"));
	}
	text.appendTo(word).click(function(){
	    $(this).siblings().focus();
	});
    }
}

Labeler.prototype.reset = function reset(e) {
    
}

Labeler.prototype._parse = function parse(text) {
    var lines = text.split("\n");
    var sentences = [];
    for (var i = 0; i < lines.length; i++) {
	sentences.push(lines[i].split(" "));
    }
    return sentences;
}

$(function(){
    
    window.labeler = new Labeler("#sentences","textarea");

    $("#done").click(labeler.update.bind(labeler));
    $("#reset").click(labeler.reset.bind(labeler));

});
