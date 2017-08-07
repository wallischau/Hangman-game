/*Hangman                      */    
/*Author: Wallis Chau          */    
/*Description: Hangman game    */    
/*Date: 8/1/17                 */

console.log('start');
const GUESS_COUNT = 12;
var targetWord = [];
var fruitwordList = ['apple', 'pear', 'banana', 'cherry', 'grapes','strawberry','watermelon','orange','pineapple','papaya', 'jackfruit', 'avocado', 'kiwi', 'grapefruit'];
var category = ['fruit'];
var compCharArray = [];
var compCharDisplay = [];
var compWordIndex;
var compCharArrayOrig;
var compCharObjects = [];
var guessRemaining = GUESS_COUNT;
var guessedLetters = [];
var winCount = 0;
const INTRO_MSG = "Press any key to start";
const IN_GAME_MSG = "Guess a letter";
const WIN_MSG = "You won";
const LOSE_MSG = "you lost";
var started = false;

/* random pick a index from the list and return it  */
/* parameter: list of words                         */
/*  return: index                                   */
function generateCompWord(wordList) {
	return (Math.floor(Math.random() * wordList.length));
}

/* split a word into char and store in an array */
/* parameter: word to split                     */
/* return: array of char                        */
function splitWordToChar(word) {
	return (word.split(""));
}


/* check if a char is in the array                     */
/* description: search the list for all matched char   */
/* parameter: key - key to be checked                  */
/*            list - array to be checked against       */
/* return: array of the slots that matches the char    */
/*         slot is empty if no match found             */
function checkUserKey(key, list) {
	var matchedSlot =[]; // to store indice of matched letter
	var index = -1;
	do {
		index = list.indexOf(key, index + 1);
//		console.log(index);
		if (index >= 0) {
			matchedSlot.push(index);	
		}
//		console.log(matchedSlot);
	} 
	while (index != -1);
	return(matchedSlot);
}

/* display the current word                      */
/* parameter: list of word to be displayed       */
/* return: none                                  */
function displayCurrentWord(compCharDisplay) {
	var wordLabel = document.getElementById("compword");
//	console.log(wordLabel);
	wordLabel.innerHTML = compCharDisplay.join('\t');
}
 
/* update word to display                         */
/* description: copy data from source to dest at indice in list*/
/* parameter: list - list of indice to be update  */
/*            sourcearray - source data           */
/*            destarray - destination array       */
/* return: none                                   */
function updateWordInDisplay(list, sourcearray, destarray) {
	for (var i=0; i<list.length; i++) {
		destarray[list[i]] = sourcearray[list[i]];
	}
}

/* display category                              */
function displayCategory(cat) {
	var categoryItem = document.getElementById("catcontent");
	categoryItem.innerHTML = category[cat];
}
/* update guess remaining count                  */
/* description: if new game, reset count         */
/* parameter: newgame - bool
/* return: none                                  */
function updateGuessRemaining(newgame, matched) {
	if (newgame) {
		guessRemaining = GUESS_COUNT;
	}
	else
		if (!matched) {
			guessRemaining--;
		}
	displayGuessRemaining();
}

/* display guess remaining tag                  */
/* return: none                                 */
function displayGuessRemaining() {
	var remainLabel = document.getElementById("remainlabel");
		var temp = guessRemaining;
	if (guessRemaining < 3) {
		temp = `<span class='red'> ${temp} </span>`;

	}
//	remainLabel.innerHTML = guessRemaining;
	remainLabel.innerHTML = temp;
}

/* display win count                            */
/* return: none                                 */
function displayWinCount() {
	var winCountLabel = document.getElementById("wincount");
	winCountLabel.innerHTML = winCount;
} 

/* display guessed letter list                  */
/* parameter: list - list to be displayed       */
/* return: none                                 */
function displayGuessedLetters(list) {
	var guessedLabel = document.getElementById("guessedlabel");
//	console.log(guessedLabel);
	guessedLabel.innerHTML = list.join("\t");	
}

/* update guessed letter list                      */
/* parameter : char - char to add                  */
/*             newgame - bool                      */
/*             list - list to be updated           */
/*             matched - char is a matched letter  */
/* description: push char if it is not in the list;*/
/*              update remaining, display guessed letters */
function updateGuessedLetters(newgame, char, list, matched) {
	if (newgame) {
		//empty the list
		list.splice(0, list.length);	
	}
	//add char if not in the list
	else {
		//if this char is a match
		if (matched) {
			char = `<span class='orange'> ${char} </span>`;
		}
		if (list.indexOf(char) === -1) {
			list.push(char);
			list.sort();
			updateGuessRemaining(false, matched);
		}
	}//else 
	displayGuessedLetters(list);
}

/* check result                                          */
/* description: check if all '_' are replaced by letters */        
/*              check remaining                          */
/* parameter: list of '_' char                           */
/* return: -1 (lose), 0 (progress), 1(win)               */
function checkWinLose(list) {
	//check if all slots are revealed
	if (list.indexOf('_') === -1) {
		//win
		return 1;
	} else if (guessRemaining <= 0) {
		//lose
		return -1;
	}
	return 0;
}

/* update and display heading message                          */
/* description: display message depending on state of the game */
function updateHeadingMsg(isStarted) {
	var msg = document.getElementById("HeadMsg");
	if (isStarted) {
		msg.innerHTML = IN_GAME_MSG;
	}
	else {
		msg.innerHTML = INTRO_MSG;
	}
}

/* dislay winning message                     */
/* description: hide or show winning message  */
/* parameter: win- bool                       */
/*            vis - bool, visible             */
function displayWinMsg(vis, win) {
	var msg = document.getElementById("winmsg");
	if (win) {

		msg.innerHTML = WIN_MSG;
	}
	else
	{
		msg.innerHTML = LOSE_MSG;
	}
	if (vis) {
		msg.setAttribute("class", "visible");
	}
	else
	{
		msg.setAttribute("class", "invisible");

	}
}

function updateLogo(win) {
	var logo = document.getElementById("hangmanlogo");
	if (win) {
		logo.setAttribute("src", "assets/images/hangman2.jpg");
	}
	else
	{
		logo.setAttribute("src", "assets/images/hangman.jpg");
	}
}

/* reset status, count, list and heading        */
/* return: none                                 */
function resetGame() {
	started = true;
	updateHeadingMsg(started);
	compCharArray = compWordSetup( compWordIndex,  fruitwordList,compCharDisplay, guessedLetters);
}

/* validate user key                            */
/* description: check for alphabet only,        */
/*              excludes ctrl, shift, alt keys  */
/* return: bool                                 */
function validateUserKey(char) {
	//excludes control, alt or shift keys that have > 1 char 
	if (char.length != 1) {
		return false;
	}
	return(/^[a-zA-Z]/.test(char));
}

/* get user input key                            */
/* check key in word                             */
/* update displays, remaining, guessed words     */
/* return: none                                  */
function getUserKey() {
	var userKey;
	var matchedList;  //list of indice that match
	document.onkeyup = function(event) {
		userKey = event.key;
//		console.log(userKey);
	
		//if this is the first key, start the round
		if (!started) {
			resetGame();
		}
		else {
			userKey = userKey.toLowerCase();
			//validate user input: char only
			if(!validateUserKey(userKey)) {
				return;
			}
			//check if user input is in comp word
			matchedList = checkUserKey(userKey, compCharArray );
			//update word to display
			updateWordInDisplay(matchedList, compCharArray, compCharDisplay);
			displayCurrentWord(compCharDisplay);
			var matched = matchedList.length;
			updateGuessedLetters(false, userKey, guessedLetters, matched);
			switch (checkWinLose(compCharDisplay)) {
				case 1: {
					winCount++;
//					alert("you won");
					displayWinCount();
					displayWinMsg(true, true);
					started = false;
					updateHeadingMsg(started);
					updateLogo(true);
					break;  
				}
				case -1: {
//					alert("you lost");
					displayWinMsg(true, false);
					started = false;
					updateHeadingMsg(started);
					break;
				}
				//other case, continue the game
			}//switch
		}
	} //function(event)
}

/* comp word setup                                   */
/* description: initialize all fields                */
function compWordSetup(indexList, fruitwordList, charDisplay, guessedArray) {

var tempArray;

//generate a random word
indexList = generateCompWord(fruitwordList);

//store each letter in array
tempArray = splitWordToChar(fruitwordList[indexList]); 
//clear array
//charArray.splice(0, charArray.length);

//console.log(charArray);
console.log(tempArray);

//display category
displayCategory(0);


//fill array with '_'
//charDisplay.length = charArray.length;
charDisplay.length = tempArray.length;
charDisplay.fill('_');
//console.log(charDisplay);

//display the word being guess
displayCurrentWord(charDisplay);
//display guess count
//displayGuessRemaining();
updateGuessRemaining(true, 1);
displayWinMsg(false);
updateLogo(false);
updateGuessedLetters(true, 0, guessedArray);

return(tempArray);
}

/* ------- word setup ------------------- */
compCharArray = compWordSetup(compWordIndex, fruitwordList, compCharDisplay, guessedLetters);
//console.log("here" + compCharArray);
/* ------- take user input------------------- */
getUserKey();
