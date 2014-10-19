
function Labeler(section,textarea,mode){
    this.root = $(section);
    this.textarea = $(textarea);
    this.modesel = $(mode);

    this.text = "";
    this.s = [];
    this.mode = "text";
}

Labeler.prototype.update = function update() {
    this.text = this.textarea.val();
    this.s = this._parse(this.text);
    this.mode = this.modesel.val();

    this.textarea.parent().slideUp();
    this._toggleEnable();

    for (var i = 0; i < this.s.length; i++) {
	this.createRow(this.s[i]);
    }
}

Labeler.prototype.createRow = function createRow(sentence) {
    var el = $("<div>").addClass("sentence");
    this.root.append(el);

    for (var i = 0; i < sentence.length; i++) {
	var word = $("<span>").addClass("word").appendTo(el);
	var label = this._createLabel(word,sentence[i]);
	var text = $("<span>").addClass("text").text(sentence[i]).appendTo(word)
	    .click(function() {
		$(this).siblings("input").focus();
		setTimeout($(this).siblings("div").children("button").click.bind(
		    $(this).siblings("div").children("button")),50);
	    });
    }

    el.slideDown();
}

Labeler.prototype._createLabel = function createLabel(word,text) {
    var el = $(this.mode==="text"?"<input>":"<select>");
    el.addClass("wlabel form-control").appendTo(word);

    if (this.mode !== "text") {
	el.append('<option> </option>');
    }
    if (this.mode === "pos") {
	el.append("<option>N</option>");
	el.append("<option>V</option>");
	el.append("<option>Adj</option>");
	el.append("<option>Adv</option>");
	el.append("<option>Pro</option>");
	el.append("<option>Prep</option>");
	el.append("<option>Conj</option>");
	el.append("<option>Int</option>");
    }
    else if (this.mode === "role") {
	el.append("<option>S</option>");
	el.append("<option>V</option>");
	el.append("<option>DO</option>");
	el.append("<option>IO</option>");
	el.append("<option>PP</option>");
	el.append("<option>Poss</option>");
    }
    else if (this.mode === "case") {
	el.append("<option>Nom</option>");
	el.append("<option>Gen</option>");
	el.append("<option>Dat</option>");
	el.append("<option>Acc</option>");
	el.append("<option>Abl</option>");
	el.append("<option>Voc</option>");
    }
    if (this.mode !== "text") {
	el.selectpicker();
    }

    return el;
}

Labeler.prototype.reset = function reset() {
    if (!confirm("Are you sure you want to clear your labels?")) { return false; }

    this._toggleEnable();
    this.root.empty();
    this.textarea.parent().slideDown();
}

Labeler.prototype._toggleEnable = function toggleEnable() {
    this.modesel.parent().parent().find("button").add(this.modesel).each(function(index,el){
	$(el).prop("disabled",$(el).prop("disabled")?"":"disabled");
    });
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
    
    window.labeler = new Labeler("#sentences","textarea","#mode");

    $("#done").click(function(){
	labeler.update();
	$(".instructions").text(
	    "Click words to enter labels, or reset to change mode or sentences.");
    });
    $("#reset").click(function(){
	labeler.reset();
	$(".instructions").text(
	    "Enter sentences below, one per line.");
    });
    $("#link").click(function(){
	prompt("Copy and save the link below:\n\n(Using a shortlink service is reccomended before posting a link.)", location.origin + location.pathname +
	       "?" + labeler.modesel.val() + "#" +
	       encodeURIComponent(labeler.textarea.val()));
    });

    if (location.hash && location.search) {
	$(".pull-right, #mode").hide();
	$(".instructions").text("Click on words to label them.");
	labeler.textarea.val(decodeURIComponent(location.hash.substr(1)));
	labeler.modesel.val(location.search.substring(1));
	labeler.update();
    }

});
