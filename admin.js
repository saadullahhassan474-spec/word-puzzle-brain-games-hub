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

function login(){
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

document.addEventListener("keydown", function(event){
  if(event.key === "Enter"){
    login();
  }
});


  async function getAdminData() {
    try {
        const leaderboardRes = await fetch(`${API}/leaderboard`);
        if(!leaderboardRes.ok) throw new Error("Leaderboard fetch failed");
        const leaderboardData = await leaderboardRes.json();

        const feedbackRes = await fetch(`${API}/feedback`);
        if(!feedbackRes.ok) throw new Error("Feedback fetch failed");
        const feedbackData = await feedbackRes.json();

        displayStats(leaderboardData, feedbackData);
        displayLeaderboard(leaderboardData);
        displayFeedback(feedbackData);
    } catch(error) {
        console.log("Error:", error);
    }
}

function displayStats(leaderboardData, feedbackData) {
    const totalPlayers = leaderboardData.length;
    const highestScore = Math.max(...leaderboardData.map(function(e) {
        return e.score;
    }));
    const totalFeedback = feedbackData.length;

    document.querySelector("#admin-stats .admn-stats:nth-child(1)").textContent = "👥 Total Players: " + totalPlayers;
    document.querySelector("#admin-stats .admn-stats:nth-child(2)").textContent = "🏆 Highest Score: " + highestScore;
    document.querySelector("#admin-stats .admn-stats:nth-child(3)").textContent = "📬 Total Feedback: " + totalFeedback;
  }

  function displayLeaderboard(data) {
    const tbody = document.getElementById("admin-tbody");
    tbody.innerHTML = "";
    data.sort(function(a, b) { return b.score - a.score; });

    data.forEach(function(entry, index) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.playerName}</td>
            <td>${entry.gameName}</td>
            <td>${entry.score}</td>
            <td>${entry.date}</td>
            <td>
                <button class="edit-btn" onclick="showEdit('${entry.id}', '${entry.playerName}', ${entry.score})">✏️ Edit</button>
                <button class="del-btn" onclick="deleteLeaderboard('${entry.id}')">🗑️ Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
function showEdit(id, name, score) {
    editId = id;
    document.getElementById("edit-name").value = name;
    document.getElementById("edit-score").value = score;
    document.getElementById("edit").style.display = "flex";
    document.getElementById("edit").scrollIntoView({behavior: "smooth"});
}

document.getElementById("save-edit").addEventListener("click", async function(e) {
    e.preventDefault();
    const newName = document.getElementById("edit-name").value;
    const newScore = document.getElementById("edit-score").value;
    try {
        const response = await fetch(`${API}/leaderboard/${editId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                playerName: newName,
                score: parseInt(newScore)
            })
        });
        if(!response.ok) throw new Error("Edit failed");
        document.getElementById("edit").style.display = "none";
        getAdminData();
        e.preventDefault();
    } catch(error) {
        console.log("Error:", error);
    }
});

document.getElementById("cancel-edit").addEventListener("click", function() {
    document.getElementById("edit").style.display = "none";
});

async function deleteLeaderboard(id) {
    try {
        const response = await fetch(`${API}/leaderboard/${id}`, {
            method: "DELETE"
        });
        if(!response.ok) throw new Error("Delete failed");
        getAdminData();
    } catch(error) {
        console.log("Error:", error);
    }
}

function displayFeedback(data) {
    const tbody = document.getElementById("feedback-tbody");
    tbody.innerHTML = "";

    data.forEach(function(entry) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.name}</td>
            <td>${entry.email}</td>
            <td>${entry.subject}</td>
            <td>${entry.message}</td>
            <td>${entry.date}</td>
            <td>
                <button class="del-btn" onclick="deleteFeedback('${entry.id}')">🗑️ Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function deleteFeedback(id) {
    try {
        const response = await fetch(`${API}/feedback/${id}`, {
            method: "DELETE"
        });
        if(!response.ok) throw new Error("Delete failed");
        getAdminData();
    } catch(error) {
        console.log("Error:", error);
    }
}