# brain-ring
Brain ring game assistant. Chooses questions from question base, counts team points. Built with Node.js/Express.js

# Installation
## Windows
1. Download or clone the repository
2. Open the folder `install-windows` and launch `install.bat`
## Linux
1. Download or clone the repository
2. Install Node.js (if not done yet): `sudo apt-get install nodejs`
3. Install dependencies: `cd brain-ring; npm install`

# Running the server
## Windows
Open the folder `install-windows` and launch `start.bat`
Console will output the address where server had started, i.e `http://localhost:3000`
## Linux
Execute `npm start`
Console will output the address where server had started, i.e `http://localhost:3000`

# Configuration
## config.js
The `config.js` file contains game settings. At the moment you can specify only 3 parameters:
- `teamCount`: number of teams participating in the game
- `teamNames`: has structure like `number: "teamName"`. Should be separated by commas except the last one. If team name is not specified, the default name is Team [number], i.e Team 3.
- `maxQuestions`: maximum number of questions for the game. If not specified, the game will continue until all questions were answered.
The parameters should be separated by commas except the last one. `teamNames` should always contain curly braces `{}`.

## questions.js
The `questions.js` file is a question database. Question that can be included in the game should be there. Questions should be separated by commas except the last one. This is the basic question format:
```javascript
{
time: 40,
points: 1,
id: 7,
text: 'Name a synonym of diskette',
answer: 'Floppy disk'
}
```
It contains such fields as:
- `time`: time in seconds given to answer the question (number)
- `points`: point for the correct answer (number)
- `id`: order number of question (number)
- `text`: the question itself (text wrapped into single or double quotes)
- `answer`: question answer (text wrapped into single or double quotes)
Note: when text is wrapped into quotes it MAY NOT contain the same quotes, i.e:
WRONG: `'It's me, Mario'`
RIGHT: `"It's me, Mario"`.
