#!/usr/bin/env node
//First need to declare the stream
const fs = require('fs');

//Set global variables
let wordFound = false;
let doneReading = false;
var challengeResult = '';
let foundIndex = 0;
let charactersRemaining = 100;
const PREAMBLE = 'CAPTIVATION';

if (process.stdin.isTTY) {
    let fileStream = fs.createReadStream(new Buffer(process.argv[2] || '', 'utf-8'));
    fileStream.on('data', data => {
        checkForPreamble(data);
    });
    fileStream.on('close', () => console.log(challengeResult));
}
else {
    process.stdin.on('data', data => {
        checkForPreamble(data);
    });
    process.stdin.on('close', error => console.log(challengeResult));
}

checkForPreamble = data => {
    data = data.toString();
    //Regex to find the instances of 8 characters with 1 and 0's
    //Loops through each character and either returns nothing or the desired characters
    //Added += incase the streamed chunk doesn't contain all of 100 preceding characters
    challengeResult += data.match(/[01]{8}/g).map(function (v, index) {
        //Loop through them and convert the binary to a character
        let character = getCharacter(v);
        //Check if they match the current index of the MAIN WORD
        if (character == PREAMBLE[foundIndex] && !wordFound) {
            wordFound = foundIndex == 10 ? true : false;
            foundIndex++;
            if (wordFound) {
                //If the entire word is a match then return the main word
                return PREAMBLE;
            }
        }
        else {
            //Reset the foundIndex if the characters weren't right next to each other
            foundIndex = 0;
        }
        if (wordFound) {
            //If the word has already been found then just return the character
            //until the 100 have been
            if (charactersRemaining > 0) {
                charactersRemaining--;
                return character;
            }
            else {
                doneReading = true;
            }
        }
    }).join('');
    if (doneReading) {
        process.stdin.pause();
    }
}

function getCharacter(val) {
    return String.fromCharCode(parseInt(val, 2));
}
