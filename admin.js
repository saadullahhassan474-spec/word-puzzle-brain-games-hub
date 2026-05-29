const API = "http://localhost:3000";
const userName = "admin";
const userPassword = "12345";

const loginBtn = document.getElementById("log-in");
const userInput = document.querySelector('input[type="text"]');
const passInput = document.querySelector('input[type="password"]');
const errMsg = document.getElementById("err-msg");
const loginBox = document.getElementById("password");
const adminPanel = document.getElementById("admin-Panel");
const settings = document.getElementById("settings");
const gameConfig = document.getElementById("game-config");
const saveBtn = document.getElementById("save-time");
const saveAlert = document.getElementById("saved-msg");
const welcomeAlert = document.getElementById("wlcm");
const timeInput = document.getElementById("timer-input");
const quizGame = document.getElementById("quiz-box");
const easyDel = document.getElementById("easy-del");
const medDel = document.getElementById("medium-del");


errMsg.style.display = "none";
adminPanel.style.display = "none";
settings.style.display = "none";
gameConfig.style.display = "none";
welcomeAlert.style.display = "none";
saveAlert.style.display = "none";
quizGame.style.display = "none";

function login(){
  const enterUser = userInput.value;
  const enterPass = passInput.value;
  if (enterUser === userName && enterPass === userPassword) {
    loginBox.style.display = "none";
    welcomeAlert.style.display = "flex";
    adminPanel.style.display = "block";
    settings.style.display = "block";
    gameConfig.style.display = "block";
    quizGame.style.display = "block";
  } else {
    errMsg.style.display = "block";
    setTimeout(function () {
      errMsg.style.display = "none";
    }, 2500);
  }
}

loginBtn.addEventListener("click", login);

document.addEventListener("keydown", function(event){
  if(event.key === "Enter"){
    login();
  }
});

saveBtn.addEventListener("click", async function () {
  saveAlert.style.display = "block";

  setTimeout(function () {
    saveAlert.style.display = "none";
  }, 2500);

});

  