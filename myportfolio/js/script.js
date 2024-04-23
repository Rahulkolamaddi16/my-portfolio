document.addEventListener("DOMContentLoaded", function () {
    // Fetch questions from the Open Trivia Database API
    fetch('https://opentdb.com/api.php?amount=5&category=18&type=multiple')
        .then(response => response.json())
        .then(data => {
            // Process the fetched questions
            const questions = data.results.map(question => ({
                question: question.question,
                options: [...question.incorrect_answers, question.correct_answer],
                answer: question.correct_answer
            }));
            // Initialize the game with fetched questions
            initGame(questions);
        })
        .catch(error => console.error('Error fetching questions:', error));
});

// Function to initialize the game with fetched questions
function initGame(questions) {
    // Other global variables
    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 20; // Time limit for each question (in seconds)

    // DOM elements
    const welcomeScreen = document.getElementById("welcome-screen");
    const questionScreen = document.getElementById("question-screen");
    const feedbackScreen = document.getElementById("feedback-screen");
    const completionScreen = document.getElementById("completion-screen");
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const feedbackElement = document.getElementById("feedback");
    const correctAnswerElement = document.getElementById("correct-answer");
    const currentQuestionNumberElement = document.getElementById("current-question");
    const totalQuestionsElement = document.getElementById("total-questions");
    const timeLeftElement = document.getElementById("time-left");
    const nextButton = document.getElementById("next-btn");
    const submitButton = document.getElementById("submit-btn");

    // Function to show the welcome screen
    function showWelcomeScreen() {
        welcomeScreen.classList.remove("hidden");
        questionScreen.classList.add("hidden");
        feedbackScreen.classList.add("hidden");
        completionScreen.classList.add("hidden");
    }

    // Function to start the game
    function startGame() {
        welcomeScreen.classList.add("hidden");
        questionScreen.classList.remove("hidden");
        showQuestion();
    }

    // Function to show a question
    function showQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        optionsElement.innerHTML = "";
        feedbackElement.textContent = ""; // Clear previous feedback
        correctAnswerElement.textContent = ""; // Clear previous correct answer

        currentQuestion.options.forEach((option, index) => {
            const optionButton = document.createElement("button");
            optionButton.textContent = option;
            optionButton.classList.add("option");
            optionButton.addEventListener("click", () => selectOption(option));
            optionsElement.appendChild(optionButton);
        });

        currentQuestionNumberElement.textContent = currentQuestionIndex + 1;
        totalQuestionsElement.textContent = questions.length;
        startTimer();
    }


    // Function to select an option
    function selectOption(selectedOption) {
        stopTimer();

        const currentQuestion = questions[currentQuestionIndex];
        if (selectedOption === currentQuestion.answer) {
            score++;
            feedbackElement.textContent = "Correct!";
        } else {
            feedbackElement.textContent = "Incorrect!";
            correctAnswerElement.textContent = `Correct Answer: ${currentQuestion.answer}`;
        }

        questionScreen.classList.add("hidden");
        feedbackScreen.classList.remove("hidden");
    }

    // Function to show the next question or submit button
    function nextQuestion() {
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            feedbackScreen.classList.add("hidden");
            questionScreen.classList.remove("hidden");
            showQuestion();
        } else {
            // Show submit button instead of next question button
            nextButton.classList.add("hidden");
            submitButton.classList.remove("hidden");
        }
    }

    // Function to show the completion screen
    function showCompletionScreen() {
        document.getElementById("final-score").textContent = score;
        questionScreen.classList.add("hidden");
        completionScreen.classList.remove("hidden");

        // Add event listener for the "Visit Portfolio" button
        document.getElementById("portfolio-btn").addEventListener("click", () => {
            // Redirect to the portfolio page
            window.location.href = "index.html#about";
        });
    }

    // Function to start the timer
    function startTimer() {
        timeLeft = 20; // Reset time left for each question
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Function to stop the timer
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Function to update the timer display
    function updateTimer() {
        timeLeftElement.textContent = timeLeft;
        timeLeft--;

        if (timeLeft < 0) {
            stopTimer();
            selectOption(null); // Automatically select incorrect option when time runs out
        }
    }

    // Add event listeners
    document.getElementById("start-btn").addEventListener("click", startGame);
    nextButton.addEventListener("click", nextQuestion);
    submitButton.addEventListener("click", showCompletionScreen);

    // Initialize the game
    showWelcomeScreen();
}
