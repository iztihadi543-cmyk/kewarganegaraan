// Data Quiz (5 soal pilihan ganda)
const questions = [
    {
        question: "Berapa sila dalam Pancasila?",
        options: ["4", "5", "6", "3"],
        correct: 1
    },
    {
        question: "Tanggal disahkannya UUD 1945?",
        options: ["17 Agustus 1945", "18 Agustus 1945", "1 Oktober 1945", "28 Oktober 1945"],
        correct: 1
    },
    {
        question: "Dasar negara Indonesia adalah?",
        options: ["Piagam Jakarta", "Pancasila", "UUD 1945", "Rukun Negara"],
        correct: 1
    },
    {
        question: "Prinsip gotong royong termasuk dalam nilai?",
        options: ["Pancasila", "Budaya", "Peraturan", "Wawasan Nusantara"],
        correct: 1
    },
    {
        question: "Wawasan Nusantara mencakup aspek?",
        options: ["Politik saja", "Ekonomi saja", "Kesatuan politik, ekonomi, sosial, budaya, hankam", "Budaya saja"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;
let answers = [];

// Navigasi sections
document.addEventListener('DOMContentLoaded', function() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.section;
            
            // Update active button
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Switch sections
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            
            // Reset quiz if switching away/ to quiz
            if (sectionId === 'quiz') {
                resetQuiz();
            } else if (document.getElementById('quiz').classList.contains('active')) {
                // Save score to localStorage when leaving quiz
                localStorage.setItem('civistepScore', score);
            }
            
            // Load refleksi
            if (sectionId === 'refleksi') {
                loadRefleksi();
            }
        });
    });
    
    // BAB expand/collapse
    document.querySelectorAll('.bab-title').forEach(title => {
        title.addEventListener('click', () => {
            const content = title.nextElementSibling;
            content.classList.toggle('active');
        });
    });
    
    // Quiz logic
    setupQuiz();
    
    // Refleksi form
    setupRefleksi();
    
    // Load saved score on home
    loadSavedScore();
});

function setupQuiz() {
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('restart-btn').addEventListener('click', resetQuiz);
    
    showQuestion();
}

function showQuestion() {
    const qData = questions[currentQuestion];
    document.getElementById('question-text').textContent = qData.question;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    qData.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = option;
        div.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(div);
    });
    
    document.getElementById('next-btn').disabled = true;
}

function selectOption(selectedIndex) {
    document.querySelectorAll('.option').forEach((opt, index) => {
        opt.classList.remove('selected');
        if (index === selectedIndex) {
            opt.classList.add('selected');
        }
    });
    
    answers[currentQuestion] = selectedIndex;
    document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
    if (answers[currentQuestion] === questions[currentQuestion].correct) {
        score++;
    }
    
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.querySelector('.question-container').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('score').textContent = score;
    localStorage.setItem('civistepScore', score);
}

function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    answers = [];
    document.querySelector('.question-container').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('next-btn').disabled = true;
    showQuestion();
}

function setupRefleksi() {
    document.getElementById('refleksi-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const text = document.getElementById('refleksi-text').value;
        if (text.trim()) {
            const refleksi = JSON.parse(localStorage.getItem('civistepRefleksi') || '[]');
            refleksi.push({
                date: new Date().toLocaleDateString('id-ID'),
                text: text
            });
            localStorage.setItem('civistepRefleksi', JSON.stringify(refleksi));
            document.getElementById('refleksi-text').value = '';
            loadRefleksi();
            alert('Refleksi berhasil disimpan!');
        }
    });
}

function loadRefleksi() {
    const refleksi = JSON.parse(localStorage.getItem('civistepRefleksi') || '[]');
    const container = document.getElementById('saved-refleksi');
    
    if (refleksi.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">Belum ada refleksi yang disimpan.</p>';
        return;
    }
    
    container.innerHTML = refleksi.map(r => `
        <div style="border-left: 4px solid #007BFF; padding: 1rem; margin-bottom: 1rem; background: #f8f9fa;">
            <strong>${r.date}</strong>
            <p>${r.text}</p>
        </div>
    `).join('');
}

function loadSavedScore() {
    const savedScore = localStorage.getItem('civistepScore');
    if (savedScore && document.getElementById('home').classList.contains('active')) {
        // Could display on home if wanted, but keeping simple
    }
}
