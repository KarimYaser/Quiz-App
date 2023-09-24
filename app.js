// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets")
let bulletsSpanContainer = document.querySelector(".bullets .spans")
let quizArea = document.querySelector(".quiz-area")
let answersArea = document.querySelector(".answers-area")
let submitButton = document.querySelector(".submit-button")
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");

//set options
let currentIndex = 0
let rightAnswers = 0;
let countDownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText)
            let questionsCount = questionsObject.length;
            // console.log(questionsCount)
            //Create Bullets + set Questions Count
            createBullets(questionsCount)
            //Add Questions Data 
            addQuestionData(questionsObject[currentIndex], questionsCount);

            //Start CountDown
            countDown(3, questionsCount)

            //Click on Submit
            submitButton.onclick = () => {
                // Get Right answer
                let theRightAnswer = questionsObject[currentIndex].right_answer

                // increase Index
                currentIndex++;

                //Check the answer
                checkAnswer(theRightAnswer, questionsCount);

                // Remove previous question
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';
                //Add Questions Data 
                addQuestionData(questionsObject[currentIndex], questionsCount);

                //Handle bullets classes
                handleBullets()

                //Start CountDown
                clearInterval(countDownInterval)
                countDown(3, questionsCount)

                // Show Results
                showResults(questionsCount);

            }
        }
    }

    myRequest.open("GET", "html_questions .json", true);
    myRequest.send();
}
getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    // Create Spans
    for (let i = 0; i < num; i++) {
        //Create span
        let theBullet = document.createElement("span");

        // Check if it is first span
        if (i === 0) {
            theBullet.className = "on"
        }

        // Append Bullets To main Bullet Container  
        bulletsSpanContainer.appendChild(theBullet)
    }
}


function addQuestionData(obj, count) {
    if (currentIndex < count) {
        // console.log(obj)
        //Create H2 Questions Title
        let questionTitle = document.createElement("h2")
        //create questions text
        let questionText = document.createTextNode(obj.title)
        //Append text to h2 
        questionTitle.appendChild(questionText)
        //Append h2 to the quiz area
        quizArea.appendChild(questionTitle);


        //Create the answers
        for (let i = 1; i <= 4; i++) {
            //Create Main Div
            let mainDiv = document.createElement("div");

            //Add Class to Main div
            mainDiv.className = "answer";
            //Create Radio Input
            let radioInput = document.createElement("input")

            //Add Type + Name + Id + Data-attributes
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            //Make first Otion selected
            if (i === 1) {
                radioInput.checked = true
            }

            //Create Label
            let theLabel = document.createElement("label");

            //Add Attributes
            theLabel.htmlFor = `answer_${i}`;
            // Create the Label text 
            let theLabelText = document.createTextNode(obj[`answer_${i}`])
            //Add The text to label
            theLabel.appendChild(theLabelText)
            //Add Input + Label to the main div
            mainDiv.appendChild(radioInput)
            mainDiv.appendChild(theLabel)
            //Append All Divs To answer area
            answersArea.appendChild(mainDiv)
        }
    }
}
function checkAnswer(rAnswer, count) {

    let answers = document.getElementsByName("question")
    let theChosenAswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChosenAswer = answers[i].dataset.answer;
        }
    }
    // console.log(`Right Answer Is ${rAnswer}`);
    // console.log(`Chosen Answer Is ${theChosenAswer}`);
    if (rAnswer === theChosenAswer) {
        rightAnswers++;
        // console.log("Good answer");
        console.log(rightAnswers);
    }
}
function handleBullets() {
    let bulletSpans = document.querySelectorAll(".bullets .spans span")
    let arrayOfSpans = Array.from(bulletSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    });
}
function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        // console.log("Questions are finished")
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();

        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} from ${count}`
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Are Good`

        } else {
            theResults = `<span class="bad">Bad</span>,  ${rightAnswers} from ${count}`
        }

        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px"
        resultsContainer.style.backgroundColor = "#fff"
        resultsContainer.style.marginTop = "10px"
    }
}
function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(() => {
            minutes = parseInt(duration / 60)
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes
            seconds = seconds < 10 ? `0${seconds}` : seconds
            countDownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countDownInterval);
                // console.log("time finished");
                submitButton.click();
            }

        }, 1000)
    }
}