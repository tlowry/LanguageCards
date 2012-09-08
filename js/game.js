var LanguageCards = {};
LanguageCards.stage = 0;
LanguageCards.wordPool = [
'Tree', 'House',
'Dog','Cat',
'Chair','Car',
'Boat','Bird',
'Bed','Error',
 ];
 
 LanguageCards.browser = "";
 LanguageCards.score = 0;
 LanguageCards.mistakes = 0;
 LanguageCards.timer = 0.0;
 LanguageCards.debug = true;
 
 var Stage = {};
 Stage.deck = [];
 Stage.mistakes = 0;
 Stage.cardsLeft = 3;
 Stage.timer = new Date().getTime();
 Stage.timerCode = 0;
 Stage.startTime = new Date().getTime();
 Stage.score = 0;
 Stage.drawCode = 0;
 
$(function()
{
	console.log("->Starting up");
	
	$("#aboutButton").unbind("click").click(
	function(event) 
	{
		event.stopPropagation();
		$("#aboutWindow").show();
	});
	
	$("#aboutCloseButton").unbind("click").click(
	function(event) 
	{
		event.stopPropagation();
		$("#aboutWindow").hide();
	});
	
	$("#instructionsButton").unbind("click").click(
	function(event) 
	{
		event.stopPropagation();
		$("#instructionsWindow").show();
	});
	
	$("#instructionsCloseButton").unbind("click").click(
	function(event) 
	{
		event.stopPropagation();
		$("#instructionsWindow").hide();
	});
	
	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1)
	{
		LanguageCards.browser = "Safari";
	}
	
	else if($.browser["webkit"])
	{
		LanguageCards.browser = "webkit";	
	}
	
	if($.browser["mozilla"])
	{
		LanguageCards.browser = "mozilla";	
	}
	
	if($.browser["opera"])
	{
		LanguageCards.browser = "opera";	
	}
	
	if($.browser["msie"])
	{
		LanguageCards.browser = "msie";	
	}
	
	newGame();
	
});

function newGame()
{
	if(LanguageCards.debug)
	{
		console.log("->Starting new game on " + LanguageCards.browser);
	}
	
	LanguageCards.score = 0;
 	LanguageCards.mistakes = 0;
 	LanguageCards.timer = 0.0;
 	LanguageCards.stage = 0;
 
	Stage.deck = [];
 	Stage.mistakes = 0;
 	Stage.cardsLeft = 3;
 	Stage.timer = new Date().getTime();
 	Stage.timerCode = 0;
 	Stage.startTime = new Date().getTime();
 	Stage.score = 0;
	newRound();
}

function draw()
{
	if(LanguageCards.debug)
	{
		console.log("->Rendering");
	}
	
	var clockText = formatTime(Stage.timer);
	$('#clockText').text(clockText);
}

function startDraw()
{
	Stage.drawCode = window.setInterval("draw()", 600);
}

function stopDraw()
{
	window.clearInterval(Stage.drawCode);
}

function RoundClear()
{
	if(LanguageCards.debug)
	{
		console.log("->Round Clear");
	}
	
	$("#roundSummary").show();
	$("#roundTimeText").text("You took " + Stage.timer + " seconds to complete");
	$("#roundMistakesText").text("You Made " + Stage.mistakes + " Mistakes");
	$("#roundScoreText").text("You Scored " + Stage.score + " points");
	
	$("#roundSummaryButton").unbind("click").click(
	function(event) 
	{
		event.stopPropagation();
		$("#roundSummary").hide();
		newRound();
	});

}

function newRound()
{
	if(LanguageCards.debug)
	{
		console.log("->Starting new round");
	}
	
	calculateStage();
	setStage();
	startDraw()
	startTimer();
}

function startTimer()
{
	Stage.startTime = new Date().getTime();
	Stage.timerCode = window.setInterval("updateTimer()", 100);	
}

function stopTimer()
{
	window.clearInterval(Stage.timerCode);
}

function updateTimer()  
{  
	var time = new Date().getTime() - Stage.startTime; 
	Stage.timer = Math.floor(time / 100) / 10;  
	
	if(Math.round(Stage.timer) == Stage.timer) 
	{ 
		Stage.timer += '.0';
	}
}

function calculateStage()
{
	LanguageCards.stage++;
	
	switch(LanguageCards.stage)
	{
		case 1:
		Stage.cardsLeft = 9;
		break;
		case 2:
		Stage.cardsLeft = 4;
		break;
		case 3:
		Stage.cardsLeft = 5;
		break;
		case 4:
		Stage.cardsLeft = 6;
		break;
		case 5:
		Stage.cardsLeft = 7;
		break;
		case 6:
		Stage.cardsLeft = 8;
		break;
		case 7:
		Stage.cardsLeft = 9;
		break;
	}
}
function setStage()
{
	Stage.deck = [];
	Stage.mistakes = 0;
	Stage.timer = new Date().getTime();
	Stage.startTime = new Date().getTime();
	Stage.score = 0;
	$("#stageHUD").text(LanguageCards.stage);
	
	//make an appropriate number of card divs for a stage
	
	for(var i = 0; i < Stage.cardsLeft ;i++)
	{
		$(".card:first").clone().appendTo("#cards");
		$(".FrenchCard:first").clone().appendTo("#FrenchCards");
	}
	
	//populate the deck with words from the pool
	for(var i =0; i < Stage.cardsLeft; i++)
	{
		Stage.deck[i] = LanguageCards.wordPool[i];
	}
	
	//shuffle the cards in the deck to make it random
	Stage.deck.sort(shuffle);
	
	//visually deal the cards
	dealCards();
	
}

function dealCards()
{
	if(LanguageCards.debug)
	{
		console.log("->Dealing cards");
	}

	var cardShuffleSound = getAudio("cardShuffle");
	cardShuffleSound.play();
	
	
	$("#cards").children().each(function(index) {	
		// align the cards
		$(this).css({
			
			"left" : ($(this).width()  + 20) * (index % 9),
			"top"  : ($(this).height() + 20) * Math.floor(index / 9)
		});
		
		// get a name from the wordPool
		var cardName = Stage.deck[index];
		
		//give the card an identifier to be picked up by css
		$(this).find(".back").addClass("card" + cardName);
		
		// add the name in English to the card to be translated later
		$(this).attr("cardName",cardName);
						
		// listen the click event on each card DIV element.
		$(this).click(selectCard);				
	});
	
	//Shuffle the deck again to place french cards in an unexpected order
	Stage.deck.sort(shuffle);
	
	$("#FrenchCards").children().each(function(index) {		
		$(this).css({
			
			"left" : ($(this).width()  + 20) * (index % 9),
			"top"  : ($(this).height() + 20) * Math.floor(index / 9)
		});
		
		// get a name from the shuffled wordPool
		var cardName = toFrench(Stage.deck[index]);

		$(this).find(".back").addClass(cardName);
		$(this).find(".titleBox").text(cardName);
		$(this).attr("cardName",cardName);
		$(this).click(selectCard);				
	});	
}


function shuffle()
 {
 	return 0.5 - Math.random();
 }
 
function selectCard() {
	if(LanguageCards.debug)
	{
		console.log("->Flipping card");
	}
	// we do nothing if there are already two cards flipped.
	if ($(".card-flipped").size() > 1)
	{
		return;
	}
	
	// add the class "card-flipped".
	// CSS rules will smoothly transition between the current cards appearance and the flipped state
	$(this).addClass("card-flipped");
	
	var cardFlipSound = getAudio("cardFlip");
	cardFlipSound.play();
	// allow 0.8 seconds for the animation to finish before checking if the cards match
	if ($(".card-flipped").size() == 2)
	{
		setTimeout(tryMatch,800);
	}
}
 function tryMatch() 
 {
	 	if(isMatchName())
	 	{
	 		if(LanguageCards.debug)
			{
				console.log("*Cards match");
			}
	 		Stage.cardsLeft--;
			var bingSound = getAudio("bing");
	 		bingSound.play();
	 		
	 		var cards = $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
	 		var prefix;
	 		var command;
	 		switch(LanguageCards.browser)
	 		{
	 			case "mozilla":
	 			command = "transitionend";
	 			break;
	 			
	 			case "opera":
	 			command = "oTransitionEnd"
	 			break;
	 			
	 			case "webkit":
	 			command = "webkitTransitionEnd";
	 			break;
	 			
	 			case "msie":
	 			prefix = "";
	 			break;
	 		}
	 		
	 		$(".card-removed").bind(command, removeTookCards);
	 		
	 		if(LanguageCards.debug)
			{
				console.log("*Cards don't match");
			}
			
	 		if(checkEndRound())
	 		{
	 			endRound();
	 		}
 	}
 	
 	else
 	{
 		$(".card-flipped").removeClass("card-flipped");
 		
		var errorSound = getAudio("error");
 		errorSound.play();
 		Stage.mistakes++;
 	}
 }
 
 function isMatchName()
{
	var cards = $(".card-flipped");
	var firstName = $(cards[0]).attr("cardname");
	var secondName = $(cards[1]).attr("cardname");
	//if the first card is in French - translate
	if($(cards[0]).parent().attr('id') == "FrenchCards")
	{
		firstName = toEnglish(firstName);
	}
	//otherwise the second one is french - translate
	else
	{
		secondName = toEnglish(secondName);
	}
	
	return (firstName == secondName);
}

function toFrench(word)
{
	var answerWord = word;
	switch(word)
	{
		case "Tree":
		answerWord = "Une Arbre";
		break;
		case "House":
		answerWord = "Une Maison";
		break;
		case "Dog":
		answerWord = "Un Chien";
		break;
		case "Cat":
		answerWord = "Un Chat";
		break;
		case "Chair":
		answerWord = "Une Chaise";
		break;
		case "Car":
		answerWord = "Une Voiture";
		break;
		case "Boat":
		answerWord = "Une Bateau";
		break;
		case "Bird":
		answerWord = "Un Oiseau";
		break;
		case "Bed":
		answerWord = "Un Lit";
		break;
		
		default:
		answerWord = "Error";
		break;
	}
	return answerWord;
}

function toEnglish(word)
{
	var answerWord = word;
	switch(word)
	{
		case "Une Arbre":
		answerWord = "Tree";
		break;
		case "Une Maison":
		answerWord = "House";
		break;
		case "Un Chien":
		answerWord = "Dog";
		break;
		case "Un Chat":
		answerWord = "Cat";
		break;
		case "Une Chaise":
		answerWord = "Chair";
		break;
		case "Une Voiture":
		answerWord = "Car";
		break;
		case "Une Bateau":
		answerWord = "Boat";
		break;
		case "Un Oiseau":
		answerWord = "Bird";
		break;
		case "Un Lit":
		answerWord = "Bed";
		break;
		
		default:
		answerWord = "Error";
		break;
	}
	return answerWord;
}
 
function removeTookCards()
{
	if(LanguageCards.debug)
	{
		console.log("->Pruning removed cards");
	}
	$(".card-removed").remove();
}

function checkEndRound()
{
	if(LanguageCards.debug)
	{
		console.log("->Checking for end of round");
		console.log("*Cards in DOM " + $("#cards").children().size());
		console.log("*Cards in JS " + Stage.cardsLeft);
	}
	
	if(Stage.cardsLeft < 1)
	{
		return true;
	}
	return false;
}

function endRound()
{
	if(LanguageCards.debug)
	{
		console.log("->Ending round");
	}
	stopTimer();
	stopDraw();
	//Clear card divs from each play area
	
	$("#FrenchCards").children().remove();
	$("#cards").children().remove();
	Stage.score = 100 - ((Stage.timer) * Stage.mistakes + 1);
	if(Stage.score < 0)
	{
		Stage.score = 0;
	}
	Stage.score = roundNumber(Stage.score,1);
	Stage.timer = roundNumber(Stage.timer,1);
	
	LanguageCards.mistakes += Stage.mistakes;
	LanguageCards.timer -= Stage.timer;
	LanguageCards.score += Number(Stage.score);
	
	var victorySound = getAudio("victory");
	victorySound.play();
	
	$("#roundSummary").show();
	$("#roundTimeText").text("You took " + formatTime(Stage.timer) + " to complete");
	$("#roundMistakesText").text("You Made " + Stage.mistakes + " Mistakes");
	$("#roundScoreText").text("You Scored " + Stage.score + "/100 points");
	
	$("#roundSummaryButton").unbind("click").click(
	function(event) 
	{
		event.stopPropagation();
		$("#roundSummary").hide();
		if(LanguageCards.stage < 7)
		{
			newRound();
		}
		else
		{
			clearGame();
		}
			
	});	
}

function clearGame()
{
	if(LanguageCards.debug)
	{
		console.log("->Game clear");
	}
	
	LanguageCards.score = roundNumber(LanguageCards.score,1);
	LanguageCards.timer = roundNumber(LanguageCards.timer,1);
	
	var clearGameSound = getAudio("victory");
	clearGameSound.play();
	
	if(LanguageCards.timer < 0)
	{
		LanguageCards.timer = -LanguageCards.timer;
	}
	$("#gameSummary").show();
	$("#gameTimeText").text("You took " + formatTime(LanguageCards.timer) + "to complete");
	$("#gameMistakesText").text("You Made " + LanguageCards.mistakes + " Mistakes");
	$("#gameScoreText").text("You Scored " + LanguageCards.score + " points");
	
	$("#gameSummaryButton").unbind("click").click(
	function(event) 
	{
		event.stopPropagation();
		$("#gameSummary").hide();
		newGame();
	});
}

function getAudio(name)
{
	var aud;
	if(LanguageCards.browser == "Safari" || LanguageCards.browser == "msie")
	{
		if(LanguageCards.debug)
		{
			console.log("*Safari or IE - Mp3");
		}
		aud = new Audio("audio/mp3/" + name + ".mp3");
	}
	
	else
	{
		if(LanguageCards.debug)
		{
			console.log("*Not Safari or IE - Ogg");
		}
		
		aud = new Audio("audio/" + name + ".ogg");
	}
	return aud;
}

function roundNumber(number, places)
{
	var rounded = parseFloat(number).toFixed(1);
	return rounded;
}

function formatTime(time)
{
	var timeInSecs = parseFloat(time);
	if(timeInSecs > 60)
	{
		time = Math.round(timeInSecs / 60) + ":" + Math.round(timeInSecs % 60);
	}
	else
	{
		time = "0:" + Math.round(timeInSecs);
	}
	return time;
}