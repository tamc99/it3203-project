/**
 * Quiz JavaScript for Web Server Technology Quiz
 * Created for IT 3203 Milestone 2
 * Author: Tamaria Cobb
 * 
 * This file handles all quiz functionality including:
 * - Answer validation
 * - Score calculation
 * - Results display
 * - Quiz reset
 */

// ============================================
// CORRECT ANSWERS - Store the right answers
// ============================================
const correctAnswers = {
    q1: 'cern httpd',  // Fill-in-blank (case insensitive)
    q2: 'b',           // Multiple choice - NCSA HTTPd
    q3: 'b',           // Multiple choice - Event-driven architecture
    q4: 'a',           // Multiple choice - LAMP definition
    q5: ['a', 'b', 'd'] // Multi-select - Apache features (modular, .htaccess, virtual hosting)
};

// ============================================
// ANSWER EXPLANATIONS - Display correct answers to users
// ============================================
const answerExplanations = {
    q1: 'CERN httpd',
    q2: 'NCSA HTTPd',
    q3: 'Event-driven, asynchronous architecture',
    q4: 'Linux, Apache, MySQL, PHP/Perl/Python',
    q5: 'Modular architecture, .htaccess configuration files, and Virtual hosting support'
};

// ============================================
// WAIT FOR PAGE TO LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Get form and buttons
    const quizForm = document.getElementById('quizForm');
    const resetBtn = document.getElementById('resetBtn');
    
    // Add event listeners
    quizForm.addEventListener('submit', handleSubmit);
    resetBtn.addEventListener('click', resetQuiz);
});

// ============================================
// HANDLE QUIZ SUBMISSION
// ============================================
function handleSubmit(event) {
    // Prevent form from submitting normally (no page reload)
    event.preventDefault();
    
    // Check if all questions are answered
    if (!validateForm()) {
        alert('Please answer all questions before submitting!');
        return;
    }
    
    // Get user's answers
    const userAnswers = getUserAnswers();
    
    // Check answers and calculate score
    const results = checkAnswers(userAnswers);
    
    // Display results
    displayResults(results);
    
    // Scroll to results section smoothly
    document.getElementById('resultsSection').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// ============================================
// VALIDATE FORM - Check all questions answered
// ============================================
function validateForm() {
    // Check fill-in-blank
    const q1 = document.getElementById('q1').value.trim();
    if (q1 === '') return false;
    
    // Check multiple choice questions (q2, q3, q4)
    const q2 = document.querySelector('input[name="q2"]:checked');
    const q3 = document.querySelector('input[name="q3"]:checked');
    const q4 = document.querySelector('input[name="q4"]:checked');
    if (!q2 || !q3 || !q4) return false;
    
    // Check multi-select (at least one checkbox selected)
    const q5 = document.querySelectorAll('input[name="q5"]:checked');
    if (q5.length === 0) return false;
    
    return true;
}

// ============================================
// GET USER'S ANSWERS from the form
// ============================================
function getUserAnswers() {
    const answers = {};
    
    // Question 1: Fill-in-blank (convert to lowercase for comparison)
    answers.q1 = document.getElementById('q1').value.trim().toLowerCase();
    
    // Question 2: Multiple choice
    const q2Selected = document.querySelector('input[name="q2"]:checked');
    answers.q2 = q2Selected ? q2Selected.value : null;
    
    // Question 3: Multiple choice
    const q3Selected = document.querySelector('input[name="q3"]:checked');
    answers.q3 = q3Selected ? q3Selected.value : null;
    
    // Question 4: Multiple choice
    const q4Selected = document.querySelector('input[name="q4"]:checked');
    answers.q4 = q4Selected ? q4Selected.value : null;
    
    // Question 5: Multi-select (get all checked boxes)
    const q5Selected = document.querySelectorAll('input[name="q5"]:checked');
    answers.q5 = Array.from(q5Selected).map(checkbox => checkbox.value).sort();
    
    return answers;
}

// ============================================
// CHECK ANSWERS and calculate score
// ============================================
function checkAnswers(userAnswers) {
    const results = {
        questions: [],
        totalScore: 0,
        maxScore: 5,
        percentage: 0,
        passed: false
    };
    
    // Question 1: Fill-in-blank (accept variations)
    const q1Correct = userAnswers.q1 === correctAnswers.q1 || 
                      userAnswers.q1 === 'cern' ||
                      userAnswers.q1 === 'httpd';
    results.questions.push({
        number: 1,
        correct: q1Correct,
        userAnswer: document.getElementById('q1').value.trim(),
        correctAnswer: answerExplanations.q1
    });
    if (q1Correct) results.totalScore++;
    
    // Question 2: Multiple choice
    const q2Correct = userAnswers.q2 === correctAnswers.q2;
    results.questions.push({
        number: 2,
        correct: q2Correct,
        userAnswer: getAnswerText('q2', userAnswers.q2),
        correctAnswer: answerExplanations.q2
    });
    if (q2Correct) results.totalScore++;
    
    // Question 3: Multiple choice
    const q3Correct = userAnswers.q3 === correctAnswers.q3;
    results.questions.push({
        number: 3,
        correct: q3Correct,
        userAnswer: getAnswerText('q3', userAnswers.q3),
        correctAnswer: answerExplanations.q3
    });
    if (q3Correct) results.totalScore++;
    
    // Question 4: Multiple choice
    const q4Correct = userAnswers.q4 === correctAnswers.q4;
    results.questions.push({
        number: 4,
        correct: q4Correct,
        userAnswer: getAnswerText('q4', userAnswers.q4),
        correctAnswer: answerExplanations.q4
    });
    if (q4Correct) results.totalScore++;
    
    // Question 5: Multi-select (must match ALL correct answers)
    const q5Correct = arraysEqual(userAnswers.q5, correctAnswers.q5);
    results.questions.push({
        number: 5,
        correct: q5Correct,
        userAnswer: getMultiSelectText(userAnswers.q5),
        correctAnswer: answerExplanations.q5
    });
    if (q5Correct) results.totalScore++;
    
    // Calculate percentage and pass/fail (60% = pass)
    results.percentage = Math.round((results.totalScore / results.maxScore) * 100);
    results.passed = results.percentage >= 60;
    
    return results;
}

// ============================================
// HELPER: Get answer text for display
// ============================================
function getAnswerText(questionName, value) {
    if (!value) return 'Not answered';
    
    const answerTexts = {
        q2: {
            a: 'CERN httpd',
            b: 'NCSA HTTPd',
            c: 'Apache HTTP Server',
            d: 'Nginx'
        },
        q3: {
            a: 'Better static file serving',
            b: 'Event-driven, asynchronous architecture',
            c: 'Open source licensing',
            d: 'Modular plugin system'
        },
        q4: {
            a: 'Linux, Apache, MySQL, PHP/Perl/Python',
            b: 'Local, Application, Memory, Protocol',
            c: 'Load, Apache, Modular, Performance',
            d: 'Linux, Authentication, Messaging, Processing'
        }
    };
    
    return answerTexts[questionName][value] || value;
}

// ============================================
// HELPER: Get multi-select answer text
// ============================================
function getMultiSelectText(values) {
    if (values.length === 0) return 'None selected';
    
    const options = {
        a: 'Modular architecture',
        b: '.htaccess configuration files',
        c: 'Event-driven architecture',
        d: 'Virtual hosting support',
        e: 'Built-in load balancing'
    };
    
    return values.map(v => options[v]).join(', ');
}

// ============================================
// HELPER: Compare arrays for equality
// ============================================
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((value, index) => value === sorted2[index]);
}

// ============================================
// DISPLAY RESULTS on the page
// ============================================
function displayResults(results) {
    // Show results section
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';
    
    // Display overall result (pass/fail and score)
    const overallResult = document.getElementById('overallResult');
    const passFailClass = results.passed ? 'pass-message' : 'fail-message';
    const passFailText = results.passed ? 'PASSED! 🎉' : 'FAILED ❌';
    
    overallResult.className = `overall-result ${passFailClass}`;
    overallResult.innerHTML = `
        <p class="result-text">${passFailText}</p>
        <p class="score-display">${results.totalScore} / ${results.maxScore}</p>
        <p style="font-size: 1.2rem; color: #e0e0e0;">Score: ${results.percentage}%</p>
        <p style="color: #b0b0b0; margin-top: 1rem;">
            ${results.passed ? 'Great job! You have a solid understanding of web server evolution.' : 'Keep studying! Review the content and try again.'}
        </p>
    `;
    
    // Display individual question results
    const questionResults = document.getElementById('questionResults');
    questionResults.innerHTML = '<h3 style="color: #ffffff; margin-bottom: 1.5rem;">Question Details:</h3>';
    
    results.questions.forEach(q => {
        const resultClass = q.correct ? 'result-correct' : 'result-incorrect';
        const statusIcon = q.correct ? '✓' : '✗';
        const statusText = q.correct ? 'Correct' : 'Incorrect';
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-result';
        questionDiv.innerHTML = `
            <h4>Question ${q.number}</h4>
            <p class="result-status ${resultClass}">${statusIcon} ${statusText}</p>
            <p class="user-answer"><strong>Your answer:</strong> ${q.userAnswer}</p>
            ${!q.correct ? `<p class="correct-answer"><strong>Correct answer:</strong> ${q.correctAnswer}</p>` : ''}
        `;
        
        questionResults.appendChild(questionDiv);
    });
}

// ============================================
// RESET QUIZ - Clear all inputs and results
// ============================================
function resetQuiz() {
    // Clear fill-in-blank
    document.getElementById('q1').value = '';
    
    // Clear all radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Clear all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Hide results section
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'none';
    
    // Clear results content
    document.getElementById('overallResult').innerHTML = '';
    document.getElementById('questionResults').innerHTML = '';
    
    // Scroll back to top of quiz
    document.querySelector('.quiz-container').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}
