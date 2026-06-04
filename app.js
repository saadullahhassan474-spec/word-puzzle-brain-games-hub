const API = "http://localhost:3000";
const tbody = document.getElementById("tbl-body");
const feedbackForm = document.getElementById("sub-btn");
async function getLeaderboard() {

    try{
        const response = await fetch(`${API}/leaderboard`);
        if(!response.ok) {
            throw new Error("Server Data Not Found");

        }

        const data = await response.json();
        displayLeaderboard(data);
    }
    catch (error) {
        console.log("Error:", error);
    }
    
}

getLeaderboard();
function displayLeaderboard(data) {
    tbody.innerHTML = "";
    data.forEach(function(entry, index) {
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

feedbackForm.addEventListener("click", function(e){
    e.preventDefault();
    const name = document.getElementById("inpt").value;
    const age = document.getElementById("inpt-2").value;
    const email = document.getElementById("inpt-3").value;
    const country = document.getElementById("inpt-4").value;
    const subject = document.getElementById("inpt-5").value;
    const message = document.getElementById("textarea").value;
    const nameError = document.getElementById("name-error");
    if(name === ""){
        nameError.textContent = "Name is Required";
        return;
    } else {
        nameError.textContent = "";
    }
    const ageError = document.getElementById("age-error");
    if(age === ""){
        ageError.textContent = "Age is Required";
        return;
    } else if(age < 5 || age > 100){
        ageError.textContent = "Enter Valid Age";
    }else{
        ageError.textContent = "";
    }

    const emailError = document.getElementById("email-error");
    if(email === ""){
        emailError.textContent = "Email is Required";
        return;
    } else if(!email.includes("@")){
        emailError.textContent = "Email is Not Valid";
    

    } else {
        emailError.textContent = "";
    }

    const countryError = document.getElementById("country-error");
    if(country === ""){
        countryError.textContent = "Select Valid Country";
        return;
    } else{
        countryError.textContent = "";
    }

    const subjectError = document.getElementById("subject-error");
    if(subject === ""){
        subjectError.textContent = "Subject Can`t be Empty";
        return;
    } else {
        subjectError.textContent = "";
    }

    const messageError = document.getElementById("message-error");
    if(message === ""){
        messageError.textContent = "Message Can`t be Empty";
        return;
    } else {
        messageError.textContent = "";
    }

    const feedbackData = {
        name : name, age : age, email : email, country : country, subject : subject, message : message,
        date : new Date().toLocaleDateString()
    };
    
    postFeedback(feedbackData);
});

async function postFeedback(feedbackData) {

    try{
        const response = await fetch(`${API}/feedback`, {
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(feedbackData)
        });

        if(!response.ok) {
            throw new Error("Feedback Not Submitted");
        }
        const data = await response.json();
        console.log("Feedback Submitted: ", data);

    } catch(error) {

        console.log("Error :", error);
    }
    
}