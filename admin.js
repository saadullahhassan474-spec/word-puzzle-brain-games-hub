const API = "http://localhost:3000";
const userName = "admin";
const userPassword = "12345";

const loginBtn = document.getElementById("log-in");
const userInput = document.querySelector('input[type="text"]');
const passInput = document.querySelector('input[type="password"]');
const errMsg = document.getElementById("err-msg");
const loginBox = document.getElementById("password");
const adminPanel = document.getElementById("admin-Panel");
const welcomeAlert = document.getElementById("wlcm");
const stats = document.getElementById("statics");
const management = document.getElementById("management");
const adminEdit = document.getElementById("admn-settings");
const adminLeaderboard = document.getElementById("admin-fdb");

errMsg.style.display = "none";
adminPanel.style.display = "none";
welcomeAlert.style.display = "none";
stats.style.display = "none";
management.style.display = "none";
adminEdit.style.display = "none";
adminLeaderboard.style.display = "none";

function login() {
  const enterUser = userInput.value;
  const enterPass = passInput.value;
  if (enterUser === userName && enterPass === userPassword) {
    loginBox.style.display = "none";
    welcomeAlert.style.display = "flex";
    adminPanel.style.display = "block";
    stats.style.display = "block";
    management.style.display = "block";
    adminEdit.style.display = "block";
    adminLeaderboard.style.display = "block";
    getAdminData();
  } else {
    errMsg.style.display = "block";
    setTimeout(function () {
      errMsg.style.display = "none";
    }, 3000);
  }
}

loginBtn.addEventListener("click", login);

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    login();
  }
});
