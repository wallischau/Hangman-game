/*Hangman                      */    
/*Author: Wallis Chau          */    
/*Description: Hangman game    */    
/*Date: 8/1/17                 */

console.log('start');
const GUESS_COUNT = 12;
var targetWord = [];
var wordList = ['apple', 'pear', 'banana', 'cherry', 'grapes'];
var compCharArray = [];
var compCharDisplay = [];
var compWordIndex;
var compCharArrayOrig;
var compCharObjects = [];
var guessRemaining = GUESS_COUNT;
var guessedLetters = [];
var winCount = 0;
var introMsg = "Press any key to start";
var ingameMsg = "Guess a letter";
var started = false;

/* random pick a index from the list and return it  */
/* parameter: list of words                         */
/*  return: index                                   */
function generateCompWord(wordlist) {
	return (Math.floor(Math.random() * wordlist.length));
}

/* split a word into char and store in an array */
/* parameter: word to split                     */
/* return: array of char                        */
function splitWordToChar(word) {
	return (word.split(""));
}

/* add object to array list.  Object includes a letter and a '_' */
/* return: update object list                                    */
function addCharsToList(charArray, objList) {
//	console.log(charArray.length);
	for (var i=0; i<charArray.length; i++) {
		var temp = [' ', '_'];
		temp[0] = charArray[i];
		objList.push(temp);
//		console.log(objList);
	}
}

/* check if a char is in the array                     */
/* description: search the list for all matched char   */
/* parameter: key - key to be checked                  */
/*            list - array to be checked against       */
/* return: array of the slots that matches the char    */
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
//	console.log('list'+list);
//	console.log('dest' + destarray);
}

/* update guess remaining count                  */
/* description: if new game, reset count         */
/* parameter: newgame - bool
/* return: none                                  */
function updateGuessRemaining(newgame) {
	if (newgame) {
		guessRemaining = GUESS_COUNT;
	}
	else
		guessRemaining--;
	displayGuessRemaining();
}

/* display guess remaining tag                  */
/* return: none                                 */
function displayGuessRemaining() {
	var remainLabel = document.getElementById("remainlabel");
	remainLabel.innerHTML = guessRemaining;
}

/* display win count                            */
/* return: none                                 */
function displayWinCount() {
	var winCountLabel = document.getElementById("wincount");
	winCountLabel.innerHTML = winCount;
} 

/* display guessed letter list                  */
/* return: none                                 */
function displayGuessedLetters() {
	var guessedLabel = document.getElementById("guessedlabel");
	console.log(guessedLabel);
	guessedLabel.innerHTML = guessedLetters.join("\t");	
}

/* update guessed letter list                      */
/* parameter : char - char to add                  */
/*             list - list to be updated           */
/* description: push char if it is not in the list;*/
/*              update remaining, display guessed letters */
/* TODO: bold matched letter */
function updateGuessedLetters(newgame, char, list) {
	if (newgame) {
		list.splice(0, list.length);	
	}
	//add char if not in the list
	else if (list.indexOf(char) === -1) {
		list.push(char);
		list.sort();
		updateGuessRemaining(false);
	}
	displayGuessedLetters();
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
		msg.innerHTML = ingameMsg;
	}
	else {
		msg.innerHTML = introMsg;
	}
}

/* reset status, count, list and heading        */
/* return: none                                 */
function resetGame() {
	started = true;
	updateHeadingMsg(started);
	compWordSetup(wordList, compWordIndex, compCharArray, compCharDisplay, guessedLetters);
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
		console.log(userKey);
	
		//if this is the first key, start the round
		if (!started) {
			resetGame();
		}
		else {
			//check if user input is in comp word
			matchedList = checkUserKey(userKey, compCharArray, compCharDisplay);
			//update word to display
			updateWordInDisplay(matchedList, compCharArray, compCharDisplay);
			displayCurrentWord(compCharDisplay);
			updateGuessedLetters(false, userKey, guessedLetters);
			switch (checkWinLose(compCharDisplay)) {
				case 1: {
					winCount++;
//					alert("you won");
					displayWinCount();
//					//break;  //no break so it could run the next block
				}
				case -1: {
//					alert("you lost");
					started = false;
					updateHeadingMsg(started);
					break;
				}
			}//switch
		}
	} //function(event)
}

/* comp word setup */
function compWordSetup(wordList, indexList, charArray, charDisplay, guessedArray) {

//generate a random word
indexList = generateCompWord(wordList);
//store each letter in array
var tempArray = splitWordToChar(wordList[indexList]); 
//clear array
charArray.splice(0, charArray.length);
//copy data into charArray.  Cannot do charArray = tempArray
//because it just moves reference to other memory, not changing
//original
for (var i=0; i<tempArray.length; i++) {
	charArray.push(tempArray[i]);	
}

console.log(charArray);

//fill array with '_'
charDisplay.length = charArray.length;
charDisplay.fill('_');
console.log(charDisplay);

//display the word being guess
displayCurrentWord(charDisplay);
//display guess count
//displayGuessRemaining();
updateGuessRemaining(true);
updateGuessedLetters(true, 0, guessedArray);

}

/* ------- word setup ------------------- */
compWordSetup(wordList, compWordIndex, compCharArray, compCharDisplay, guessedLetters);

/* ------- take user input------------------- */
getUserKey();



