/*Hangman                      */    
/*Author: Wallis Chau          */    
/*Description: Hangman game    */    
/*Date: 8/1/17                 */

console.log('start');

var targetWord = [];
var wordList = ['apple', 'pear', 'banana', 'cherry', 'grapes'];
var compCharArray = [];
var compWordIndex;
var compCharArrayOrig;
var compCharObjects = [];
/* random pick a index from the list and return it  */
/*  return: index                                   */
function generateCompWord(wordlist) {
	return (Math.floor(Math.random() * wordlist.length));
}

/* split a word into char and store in an array */
/* return: array of char                         */
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

/* check if a char is in the array                 */
/* return: array of the slots that matches the char*/
function checkUserKey(key, list) {
	var matchedSlot =[]; // to store indice of matched letter
	var index = -1;
	do {
		index = list.indexOf(key, index + 1);
		console.log(index);
		if (index >= 0) {
			matchedSlot.push(index);	
		}
		console.log(matchedSlot);
	} 
	while (index != -1);
	return(matchedSlot);
}

/* ------- word setup ------------------- */
//generate a random word
compWordIndex = generateCompWord(wordList);
//console.log(wordList[compWordIndex]);
//store each letter in array
compCharArray = splitWordToChar(wordList[compWordIndex]);
console.log(compCharArray);
//save a copy of the array
compCharArrayOrig = compCharArray.slice();
//console.log(compCharArrayOrig);

//fill array with '_'
var compCharDisplay = [];
compCharDisplay.length = compCharArray.length;
compCharDisplay.fill('_');
console.log(compCharDisplay);

//make array of objects. each object includes a letter and a '_'
//addCharsToList(compCharArray, compCharObjects);

//display the current word
function displayCurrentWord(compCharDisplay) {
	var wordLabel = document.getElementById("compword");
	console.log(wordLabel);
	wordLabel.innerHTML = compCharDisplay.join('\t');

}
 
//update word to display
function updateWordInDisplay(list, sourcearray, destarray) {
	for (var i=0; i<list.length; i++) {
		destarray[list[i]] = sourcearray[list[i]];
	}
	console.log('list'+list);
	console.log('dest' + destarray);
}


//display the word being guess
displayCurrentWord(compCharDisplay);


/* ------- take user input------------------- */
//take user input a char
var userKey;
var matchedList;  //list of indice that match
document.onkeyup = function(event) {
	userKey = event.key;
	console.log(userKey);

	//check if user input is in comp word
	matchedList = checkUserKey(userKey, compCharArray, compCharDisplay);
	//update word display
	updateWordInDisplay(matchedList, compCharArray, compCharDisplay);
	displayCurrentWord(compCharDisplay);
}


//update guess remain
//var guessCount = 10;
var guessRemain = document.getElementById("remainlabel");
//console.log(guessRemain);
//guessRemain.innerHTML = guessCount;


//update current word


//update guessed letters
//check winning