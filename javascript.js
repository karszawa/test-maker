"use strict";

function readFile(fileName, actionAfterReadingName) {
	var actionAfterReading
		= new Function("arg", "return " + actionAfterReadingName + "(arg)");
  var httpObj = new XMLHttpRequest();
  httpObj.open("GET", fileName, false);
  httpObj.onreadystatechange = function() {
    	if (httpObj.readyState == 4) {
        	var sentence = httpObj.responseText;
        	actionAfterReading(sentence);
    	}
  }
  httpObj.send(null);
}

var question = new Array();
var japanese = new Array();
var answer = new Array();

function generateQuestion(sentences)
{
	var lines = sentences.split(/\n|\r\n/);

	var lineNum = lines.length;
	for (var i = 0; i < lineNum - 1; i++){
		(i % 2 == 0 ? question : japanese)[Math.floor(i / 2)] = lines[i];
	}
}

function generateAnswer(sentences)
{
	var lines = sentences.split(/\n|\r\n/);

	var lineNum = lines.length;
	for (var i = 0; i < lineNum - 1; i++){
		answer[i] = new Array();
		var column = lines[i].split(",");
		var colNum = column.length;
		for (var j = 0; j < colNum; j++){
			answer[i][j] = column[j];
		}
	}
}

var problemIndex;
var prep = function()
{
	readFile("midterm_q.txt", generateQuestion);
	readFile("midterm_a.txt", generateAnswer);
	makeArray();
	makeBody();
}

var makeArray = function()
{
	var qNum = 0;
	while (qNum != 100){
		var perm = new Array(question.length);
		problemIndex = [];

		for (var i = 0; i < perm.length; i++){
			perm[i] = [i, Math.random()];
		}

		perm.sort(function (a, b) {
			return b[1] - a[1];
		});

		for (var i = 0; i < perm.length; i++){
			perm[i] = perm[i][0];
			if (qNum + answer[perm[i]].length <= 100){
				qNum += answer[perm[i]].length;
				problemIndex.push(perm[i]);
				while (question[perm[i]].indexOf("_____", 0) != -1){
					question[perm[i]] = question[perm[i]].replace(/_____/, '<input type = "text" name = "q' + String(perm[i] + 1) + '" onkeypress = "enter();">');
				}
			}
		}
	}
}

var makeBody = function ()
{
    var form_element = document.createElement("form");
    form_element.innerHTML = '<p>次の文中の空欄を埋めてください。1 つの空欄には 1 つの単語が入ります。(1 点 × 100 = 100 点)<br/><u>質問対象が「あなた」の疑問文は基本的にTuが文頭にあるものとしています。そうでない場合は文頭にLeiを明示しています。</u></p>';
		form_element.innerHTML += '<p>【アクセント記号付き文字一覧】回答に必要なときにコピーして使ってください。→ à è é ì ò</p>';
		for (var i = 0; i < problemIndex.length; i++){
    	form_element.innerHTML += '<p>' + '(' + String(i + 1) + ')' + ' ' + question[problemIndex[i]] + '<br/>' + japanese[problemIndex[i]] + '</p>';
    }

    form_element.innerHTML += '<input type = "button" value = "送信" name = "submit" onclick = "grade();">';
    var parent_object = document.getElementById("show");
    parent_object.appendChild(form_element);
}

var grade = function()
{
	var score = 0;

	for (var i = 0; i < problemIndex.length; i++){
		var str = "q" + String(problemIndex[i] + 1);
		var obj = document.getElementsByName(str);
		for (var j = 0; j < obj.length; j++){
			if (obj[j].value != answer[problemIndex[i]][j]){
				obj[j].setAttribute("style", "border : medium #ff0000 solid;");
				obj[j].value = "(回答)" + (obj[j].value != "" ? obj[j].value : "無回答") + " (正答)" + answer[problemIndex[i]][j];
			}
			else {
				obj[j].setAttribute("style", "border : medium #00ff00 solid;");
				score++;
			}
		}
	}
	alert("あなたの得点は, " + String(score) + " 点です!");
}
