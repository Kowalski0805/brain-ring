const express = require('express');
const app = express();
let questions = require('./questions');
let config = require('./config');
let points = [];
let teamNames = [];
let questionCount = 0;
let css = '<style>h1, h2, p, button, input { font-family: sans-serif; margin: 50px; text-align: center;}\n\
          h1 { font-size: 100px; }\n\
          h2 { font-size: 50px; }\n\
          p { font-size: 36px; }\n\
          button, input {margin: 0 auto; display: inline; padding: 15px; font-size: 30px; border-radius: 10px; color: white; background: #009688;}\
          div { margin: 0 auto; text-align: center; }</style>';

function init() {
  for (let i = 0; i <= config.teamCount; i++) {
    points.push(0);
    if (config.teamNames && config.teamNames[i]) teamNames.push(config.teamNames[i]);
    else teamNames.push('Team '+i);
  }
}

function addTeam(req, res) {
  let submitted = req.params;
  points[submitted.team] += +submitted.points;
  questionCount++;
  let html = '';
  for (let i = 1; i <= config.teamCount; i++) {
    html += `<p>${teamNames[i]}: ${points[i]} points</p>`;
  }
  html += `<p><strong>Total questions answered: ${questionCount}</strong></p>`;
  html += '<div><form method="get" action="/getquestion">\
          <input type="submit" value="Get next question"/>\
          </form></div>';
  res.send(html+css);
}

function getQuestion(req, res) {
  if (questionCount >= +config.maxQuestions || questions.length === 0) {
    let html = '<p>Questions have ended! Hooray!</p>';
    let maxPoints = points[1];
    for (let i = 2; i <= config.teamCount; i++) {
      if (points[i] > points[i-1]) maxPoints = points[i];
    }
    if (points.indexOf(maxPoints) === points.lastIndexOf(maxPoints)) {
      let winner = teamNames[points.indexOf(maxPoints)];
      if (winner[winner.length-1] === 's' || winner[winner.length-1] ===   'z') {
        html += `<p>${winner} win!</p>`;
      } else {
        html += `<p>${winner} wins!</p>`;
      }
    } else {
      html += `<p>It's a tie!</p>`;
    }
    res.send(html+css);
    return;
  }
  const num = Math.floor(Math.random() * questions.length);
  const question = questions[num];
  res.send('\
  <h2>Choosing question</h2>\
  <h1 id="num"></h1>\
  <form method="get" action="/question/'+num+'">\
  <input id="proceed" style="display: none;" type="submit" value="Proceed to question"/>\
  </form>\
  <script>\
  stop = false;\
  function matrix() {\
    if (stop) return;\
    n = Math.floor(Math.random() * 30);\
    window["num"].innerText = n;\
    setTimeout(matrix, 100);\
  }\
  matrix();\
  setTimeout(() => {stop = true; window["num"].innerText = '+question.id+'; window["proceed"].style.display = "block"}, 3000);\
  </script>\
  '+css);
}

function main(req, res) {
  res.send('<h1 style="font-family: sans-serif; font-size: 200px; text-align: center; margin-top: 150px">Welcome</h1>\
            <div><form action="/getquestion"><input type="submit" value="Start game"/></form></div>'+css)
}

function start(req, res) {
  const question = questions[req.params.qId];
  questions[req.params.qId] = undefined;
  questions = questions.filter(x => !!x);
  let html = '<h2>Question #'+question.id+' ('+question.points+' points)</h2>\
    <p>'+question.text+'</p>\
    <div>\
    <button onclick="timer();">Timer</button>\
    <button onclick="showAnswer()">Show answer</button><br>\
    </div>\
    <h1 id="time">'+question.time+'</h1><hr>\
    <h1 id="answer"></h1><div>';
  for (let i = 1; i <= config.teamCount; i++) {
    html += `<form style="display: inline-block;" method="get" action="/add/${i}/${question.points}">\
      <input type="submit" value="${question.points} points to ${teamNames[i]}"/>\
      </form>`;
  }
  html += '<form style="display: inline-block;" method="get" action="/add/0/'+question.points+'">\
    <input type="submit" value="Nobody guessed"/>\
    </form></div>\
    <script type="text/javascript">\
      var i = '+question.time+';function timer() { if (i < 0) return; console.log(i); window["time"].innerText = i--; setTimeout(timer, 1000); }\
      var a = "answer";function showAnswer(){ window["answer"].innerText = "Answer:\\n'+question.answer+'"; }\
    </script>';
  res.send(html+css);
}
app.get('/', main)
app.get('/question/:qId', start)
app.get('/getquestion', getQuestion)
app.get('/add/:team/:points', addTeam)

init();

let port = 3000;
process.on('uncaughtException', (e) => {
  console.log('hi'+e)
  run(++port)
})

function run(port) {
  app.listen(port, () => console.log('Example app listening on port '+port+'!'))
}
run(port)
