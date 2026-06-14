const API = "http://localhost:3000";
const tbody = document.getElementById("tbl-body");
const feedbackForm = document.getElementById("sub-btn");
const guessBtn = document.getElementById("Gss-nmbr-btn");
const mathBtn = document.getElementById("mth-q-btn");
const numMatchBtn = document.getElementById("nmbr-match-btn");
const nameModal = document.getElementById("name-modal");
const startGameBtn = document.getElementById("start-game-btn");

let currentGame = "";

async function getLeaderboard() {
  const loadingMsg = document.getElementById("loading-msg");
  const errorMsg = document.getElementById("error-msg");
  loadingMsg.style.display = "block";
  try {
    const response = await fetch(`${API}/leaderboard`);
    if (!response.ok) {
      throw new Error("Server Data Not Found");
    }
    const data = await response.json();
    loadingMsg.style.display = "none";
    displayLeaderboard(data);
  } catch (error) {
    loadingMsg.style.display = "none";
    errorMsg.style.display = "block";
    errorMsg.textContent = "Server is unreachable. Please Try again!";
  }
}

function displayLeaderboard(data) {
  tbody.innerHTML = "";
  data.sort(function (a, b) {
    return b.score - a.score;
  });
  data = data.slice(0, 10);
  data.forEach(function (entry, index) {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.playerName}</td>
            <td>${entry.gameName}</td>
            <td>${entry.score}</td>
        `;
    tbody.appendChild(row);
  });
}

getLeaderboard();

feedbackForm.addEventListener("click", function (e) {
  e.preventDefault();
  const name = document.getElementById("inpt").value;
  const age = document.getElementById("inpt-2").value;
  const email = document.getElementById("inpt-3").value;
  const country = document.getElementById("inpt-4").value;
  const subject = document.getElementById("inpt-5").value;
  const message = document.getElementById("textarea").value;

  const nameError = document.getElementById("name-error");
  if (name === "") {
    nameError.textContent = "Name is Required";
    return;
  } else {
    nameError.textContent = "";
  }

  const ageError = document.getElementById("age-error");
  if (age === "") {
    ageError.textContent = "Age is Required";
    return;
  } else if (age < 5 || age > 100) {
    ageError.textContent = "Enter Valid Age";
    return;
  } else {
    ageError.textContent = "";
  }

  const emailError = document.getElementById("email-error");
  if (email === "") {
    emailError.textContent = "Email is Required";
    return;
  } else if (!email.includes("@")) {
    emailError.textContent = "Email is Not Valid";
    return;
  } else {
    emailError.textContent = "";
  }

  const countryError = document.getElementById("country-error");
  if (country === "") {
    countryError.textContent = "Select Valid Country";
    return;
  } else {
    countryError.textContent = "";
  }

  const subjectError = document.getElementById("subject-error");
  if (subject === "") {
    subjectError.textContent = "Subject Can't be Empty";
    return;
  } else {
    subjectError.textContent = "";
  }

  const messageError = document.getElementById("message-error");
  if (message === "") {
    messageError.textContent = "Message Can't be Empty";
    return;
  } else {
    messageError.textContent = "";
  }

  const feedbackData = {
    name: name,
    age: age,
    email: email,
    country: country,
    subject: subject,
    message: message,
    date: new Date().toLocaleDateString(),
  };

  postFeedback(feedbackData);
});

async function postFeedback(feedbackData) {
  try {
    const response = await fetch(`${API}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackData),
    });
    if (!response.ok) {
      throw new Error("Feedback Not Submitted");
    }
    const data = await response.json();
  } catch (error) {}
}
async function postScore(gameData) {
  try {
    const response = await fetch(`${API}/leaderboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    });
    if (!response.ok) {
      throw new Error("Score Not Saved");
    }
    const data = await response.json();
    getLeaderboard();
    document.getElementById("guess-game").style.display = "none";
    document
      .getElementById("leaderboard")
      .scrollIntoView({ behavior: "smooth" });
  } catch (error) {
  }
}

guessBtn.addEventListener("click", function () {
  currentGame = "guess";
  nameModal.style.display = "flex";
});

mathBtn.addEventListener("click", function () {
  currentGame = "math";
  nameModal.style.display = "flex";
});

numMatchBtn.addEventListener("click", function () {
  currentGame = "numMatch";
  nameModal.style.display = "flex";
});

startGameBtn.addEventListener("click", function () {
  const playerName = document.getElementById("player-name").value;
  if (playerName === "") {
    alert("Please enter your name!");
    return;
  }
  nameModal.style.display = "none";
  if (currentGame === "guess") {
    startGuessGame(playerName);
  } else if (currentGame === "math") {
    startMathGame(playerName);
  } else if (currentGame === "numMatch") {
    startNumMatchGame(playerName);
  }
});

function startGuessGame(playerName) {
  const oldGrid = document.getElementById("num-grid");
  if (oldGrid) {
    oldGrid.remove();
  }

  const guessInput = document.getElementById("guess-input");
  const guessBtn2 = document.getElementById("guess-btn");
  guessInput.style.display = "block";
  guessBtn2.style.display = "block";

  const secretNumber = Math.floor(Math.random() * 100) + 1;
  let tries = 0;

  document.getElementById("guess-game").style.display = "flex";
  document.getElementById("guess-player-name").textContent =
    "Player: " + playerName;
  document.getElementById("guess-hint").textContent =
    "Guess a number between 1 and 100";
  document.getElementById("guess-result").textContent = "";
  document.getElementById("guess-tries").textContent = "";
  guessBtn2.textContent = "Guess!";
  guessBtn2.disabled = false;

  guessBtn2.onclick = function () {
    const userGuess = parseInt(guessInput.value);
    tries++;

    if (userGuess === secretNumber) {
      document.getElementById("guess-result").textContent =
        "🎉 Correct! You got it!";
      document.getElementById("guess-tries").textContent = "Tries: " + tries;
      guessBtn2.disabled = true;

      let score;
      if (tries <= 3) {
        score = 100;
      } else if (tries <= 6) {
        score = 75;
      } else if (tries <= 10) {
        score = 50;
      } else {
        score = 25;
      }

      const gameData = {
        playerName: playerName,
        gameName: "Guess The Number",
        score: score,
        date: new Date().toLocaleDateString(),
      };
      postScore(gameData);
    } else if (userGuess < secretNumber) {
      document.getElementById("guess-result").textContent = "🔥 Too Low!";
    } else {
      document.getElementById("guess-result").textContent = "❄️ Too High!";
    }
    document.getElementById("guess-tries").textContent = "Tries: " + tries;
  };
}

function startMathGame(playerName) {
  const oldGrid = document.getElementById("num-grid");
  if (oldGrid) {
    oldGrid.remove();
  }

  const guessInput = document.getElementById("guess-input");
  const guessBtn2 = document.getElementById("guess-btn");
  guessInput.style.display = "block";
  guessBtn2.style.display = "block";

  let score = 0;
  let questionCount = 0;

  document.getElementById("guess-game").style.display = "flex";
  document.getElementById("guess-player-name").textContent =
    "Player: " + playerName;
  guessBtn2.textContent = "Submit";
  guessBtn2.disabled = false;
  document.getElementById("guess-result").textContent = "";
  document.getElementById("guess-tries").textContent = "Score: 0";

  function generateQuestion() {
    if (questionCount === 10) {
      document.getElementById("guess-hint").textContent = "Game Over!";
      document.getElementById("guess-result").textContent =
        "Your Final Score: " + score;
      guessBtn2.disabled = true;

      const gameData = {
        playerName: playerName,
        gameName: "Math Quiz",
        score: score,
        date: new Date().toLocaleDateString(),
      };
      postScore(gameData);
      return;
    }

    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 + num2;

    questionCount++;
    document.getElementById("guess-hint").textContent =
      `Question ${questionCount}/10: ${num1} + ${num2} = ?`;
    guessInput.value = "";
    document.getElementById("guess-result").textContent = "";

    guessBtn2.onclick = function () {
      const userAnswer = parseInt(guessInput.value);
      if (userAnswer === correctAnswer) {
        score += 10;
        document.getElementById("guess-result").textContent = "✅ Correct!";
      } else {
        document.getElementById("guess-result").textContent =
          "❌ Wrong! Answer was: " + correctAnswer;
      }
      document.getElementById("guess-tries").textContent = "Score: " + score;
      setTimeout(generateQuestion, 1000);
    };
  }

  generateQuestion();
}

function startNumMatchGame(playerName) {
  const oldGrid = document.getElementById("num-grid");
  if (oldGrid) {
    oldGrid.remove();
  }

  const guessInput = document.getElementById("guess-input");
  const guessBtn2 = document.getElementById("guess-btn");
  guessInput.style.display = "none";
  guessBtn2.style.display = "none";

  const target = 10;
  let selectedNums = [];
  let selectedBtns = [];
  let score = 0;

  const pairs = [
    [1, 9],
    [2, 8],
    [3, 7],
    [4, 6],
    [5, 5],
  ];
  let numbers = [];
  pairs.forEach(function (pair) {
    numbers.push(pair[0], pair[1]);
  });
  numbers.sort(function () {
    return Math.random() - 0.5;
  });

  document.getElementById("guess-game").style.display = "flex";
  document.getElementById("guess-player-name").textContent =
    "Player: " + playerName;
  document.getElementById("guess-hint").textContent =
    "Target: " + target + " — Click 2 numbers!";
  document.getElementById("guess-result").textContent = "";
  document.getElementById("guess-tries").textContent = "Score: 0";

  const gameBox = document.getElementById("guess-box");
  const numGrid = document.createElement("div");
  numGrid.id = "num-grid";
  gameBox.appendChild(numGrid);

  numbers.forEach(function (num) {
    const btn = document.createElement("button");
    btn.textContent = num;
    btn.className = "btns num-btn";

    btn.addEventListener("click", function () {
      if (btn.classList.contains("matched")) return;
      if (selectedNums.length === 2) return;

      selectedNums.push(num);
      selectedBtns.push(btn);
      btn.classList.add("selected");

      if (selectedNums.length === 2) {
        if (selectedNums[0] + selectedNums[1] === target) {
          score += 10;
          document.getElementById("guess-result").textContent = "✅ Match!";
          document.getElementById("guess-tries").textContent =
            "Score: " + score;

          selectedBtns.forEach(function (b) {
            b.classList.add("matched");
            b.classList.remove("selected");
          });

          const allMatched = Array.from(
            numGrid.querySelectorAll("button"),
          ).every(function (b) {
            return b.classList.contains("matched");
          });

          if (allMatched) {
            document.getElementById("guess-result").textContent = "🎉 You Win!";
            const gameData = {
              playerName: playerName,
              gameName: "Number Match",
              score: score,
              date: new Date().toLocaleDateString(),
            };
            postScore(gameData);
          }
        } else {
          document.getElementById("guess-result").textContent = "❌ Wrong!";
          setTimeout(function () {
            selectedBtns.forEach(function (b) {
              b.classList.remove("selected");
            });
            document.getElementById("guess-result").textContent = "";
          }, 800);
        }
        selectedNums = [];
        selectedBtns = [];
      }
    });
    numGrid.appendChild(btn);
  });
}

const wordPuzzleBtn = document.getElementById("wrd-p-btn");

wordPuzzleBtn.addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("modal-box").innerHTML = `
        <h2>🔧 Under Maintenance</h2>
        <p>Word Puzzle is coming soon!</p>
    `;
  nameModal.style.display = "flex";
  setTimeout(function () {
    nameModal.style.display = "none";
    document.getElementById("modal-box").innerHTML = `
            <h2>Enter Your Name</h2>
            <input type="text" id="player-name" placeholder="Your Name" />
            <button id="start-game-btn">Start Game</button>
        `;
    document
      .getElementById("start-game-btn")
      .addEventListener("click", function () {
        const playerName = document.getElementById("player-name").value;
        if (playerName === "") {
          alert("Please enter your name!");
          return;
        }
        nameModal.style.display = "none";
        if (currentGame === "guess") {
          startGuessGame(playerName);
        } else if (currentGame === "math") {
          startMathGame(playerName);
        } else if (currentGame === "numMatch") {
          startNumMatchGame(playerName);
        }
      });
  }, 1500);
});
