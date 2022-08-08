// alert("Welcome to Game!");

//list of button colors.
var buttonColours = ["red", "blue", "green", "yellow"];
var userClickedPattern = [];
var gamePattern = [];

//functionchoosing random num b/w 0 to 3 and Adding color corresponding to number and sound + anime.
function nextSequence(){

  userClickedPattern = [];

  score += 10;
  level++;
  $("#level-title").text("Level " + level);
  $('#hscore').text('Score - ' + score);

  var randomNumber = Math.floor(Math.random() * 4);

  var randomChosenColour  = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);

  playSound(randomChosenColour);
}

$(".btn").click(function(){
  var userChosenColour = (this.id);    //$(this).attr("id");
  userClickedPattern.push(userChosenColour);
  // $("#" + userChosenColour).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
  animatePress(userChosenColour);
  playSound(userChosenColour);
  checkAnswer(userClickedPattern.length-1);

});



function playSound(name) {

  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}



function animatePress(currentColour){
  $("#" + currentColour).addClass( "pressed" );
  setTimeout(function(){
      $("#" + currentColour).removeClass("pressed");
  }, 100);

}
//Levelof game
var level = 0;
var started = false;
var score = 0;


//Detecting key pressed
$(document).keypress(function(event){
  if( !started){
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }


});


function checkAnswer(currentLevel){
  if(gamePattern[currentLevel] === userClickedPattern[currentLevel]){
    //console.log("Success");
    if(userClickedPattern.length === gamePattern.length){
      setTimeout(function () {
          nextSequence();
        }, 1000);
    }
  }else{
    playSound('wrong');
    $("body").addClass( "game-over" );
    setTimeout(function(){
        $("body").removeClass("game-over");
    }, 200);
    $("#level-title").text("Game Over: Press any key to restart!");

    startOver();

    }
}


function startOver(){

  //setting score
  let scores = JSON.parse(localStorage.getItem("scores"));
  let currScore = {
    'todayScore': score,
    'date': new Date().toLocaleString()
  }

  let scoresArr;
  if(scores) {
    scoresArr = scores;
    scoresArr.push(currScore);
  }else {
    scoresArr = [currScore];
  }

  localStorage.setItem("scores", JSON.stringify(scoresArr));




  score = 0;
  level = 0;
  started = false;
  gamePattern = [];
}


//Adding score
if(localStorage.getItem("scores")) {
  let scores = JSON.parse(localStorage.getItem("scores"));
  //finding max Score
  let maxScore = scores[0].todayScore;
  for(let i = 1; i < scores.length; i++) {
    if(scores[i].todayScore > maxScore) {
      maxScore = scores[i].todayScore;
    }
  }

  setHighScore(maxScore);
}else {
  setHighScore(0);
}

function setHighScore(currentScore) {
  $('#hscore').text('High Score - ' + currentScore);
}


let modalDataCont = document.querySelector('.modal-data');
let modalTitle = $('.modal-title');
let closeModalBtn = $('#close-modal');

$('#rules').click(() => {
  playSound('flip');
  document.querySelector('.modal').style.visibility = 'visible';
  modalDataCont.innerHTML = '';
  let ul = document.createElement('ul');
  ul.innerHTML = `<li>Simon game is a game of memory skill.</li>
  <li>Press any key to start the game.</li>
  <li>After starting the game, see the tiles.</li>
  <li>Remember the sequence of tiles in which order they glow.</li>
  <li>If your order is correct you will get 10 points.</li>`;
  
 modalDataCont.append(ul);
 modalTitle.text('Rules');
 makeCloseModalActive();
});


$('#hscore').click(() => {
  playSound('flip');
  document.querySelector('.modal').style.visibility = 'visible';
  modalDataCont.innerHTML = '';
  let table = document.createElement('table');
  let scores = JSON.parse(localStorage.getItem("scores"));

  if(scores) {
    table.innerHTML = `<tr>
    <th>Score</th>
    <th>Date/Time</th>
  </tr>`;
    for(let i = 0; i < scores.length; i++) {
      table.innerHTML += `<tr>
      <td>${scores[i].todayScore}</td>
      <td>${scores[i].date}</td>
    </tr>`
    }
  }else {
    table.innerHTML = 'No Scores To Show';
  }
  
 modalDataCont.append(table);
 modalTitle.text('Scores');
 makeCloseModalActive();
});


function makeCloseModalActive() {
  closeModalBtn.click(() => {
    document.querySelector('.modal').style.visibility = 'hidden';
    playSound('flip');
  });
}