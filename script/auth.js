document.addEventListener('DOMContentLoaded', () => {
  // redirects to sign in page
  const signupButton = document.getElementById('submitRegister');
  if (signupButton) {
    signupButton.onclick = () => {
      window.location.href="signin.html";
      console.log("Congratulations, your account has been registered.");
    };
  }

  const signinButton = document.getElementById('login');
  if (signinButton) {
    signinButton.onclick = () => {
      window.location.href="index.html";
      alert("Welcome to the page");
    }
  }
});

//quiz
const questions = [
  { q: "Do you know the one who brought you here?", correct: "yes", wrong: ["No", "Not sure"] },
  { q: "Isn't he the smartest?", correct: "Absolutely", wrong: ["No", "Not really"] },
  { q: "You like Him?", correct: "Obviously", wrong: ["Not really", "No"] },
  { q: "Good now will you send him money?", correct: "Yes", wrong: ["No"] },
  { q: "Number: 0741269839 Have you sent?", correct: "Yes", wrong: ["Later", "No"] }
];

let index = 0;
let attempts = 0;
let totalClicks = 0;

const questionText = document.getElementById('question');
const answersDiv = document.getElementById('answers');

//send to postgresDB
function recordAttempt(question, attemptNumber, answer, correct) {
  fetch("http://localhost:3000/record", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, attemptNumber, answer, correct })
  })
  .then(res => res.json())
  .then(data => console.log("Recorded:", data))
  .catch(err => console.error(err));
}


function loadQuestion() {
  answersDiv.innerHTML = "";
  attempts = 0; //resets attempt per question
  const current = questions[index];
  questionText.textContent = current.q;

  //correct button
  const correctBtn = document.createElement('button');
  correctBtn.textContent = current.correct;
  correctBtn.className = 'answer-btn correct-btn';
  correctBtn.onclick = () => {
    totalClicks++
    recordAttempt(current.q, attempts, current.correct, true);

    if (index < questions.length - 1) {
      index++;
      loadQuestion();
    } else {
      alert("Quiz completed. Now i know😂😂🫵. You better send me the money.")
    }
  };
  answersDiv.appendChild(correctBtn);

  //wrong button
  current.wrong.forEach(w => {
    const wrongBtn = document.createElement('button');
    wrongBtn.textContent = w;
    wrongBtn.className = 'answer-btn dodge';
    wrongBtn.style.position = "absolute";
    wrongBtn.style.left = "0px";
    wrongBtn.style.top = "0px";

    function move()  {
      attempts++;
      recordAttempt(current.q, attempts, wrongBtn.textContent, false);
    
      const rect = answersDiv.getBoundingClientRect();
      const x = Math.random() * (rect.width - wrongBtn.offsetWidth);
      const y = Math.random() * (rect.height - wrongBtn.offsetHeight);
      wrongBtn.style.left = `${x}px`;
      wrongBtn.style.top = `${y}px`;
    }

    wrongBtn.addEventListener('mouseover', move);
    wrongBtn.addEventListener('touchstart', move);

    answersDiv.appendChild(wrongBtn);
  });
}

loadQuestion();

