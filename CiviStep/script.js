document.addEventListener('DOMContentLoaded', function () {
  document.body.classList.add('page-loaded');

  const navButtons = document.querySelectorAll('[data-link]');
  navButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const nextPage = this.dataset.link;
      if (nextPage) {
        window.location.href = nextPage;
      }
    });
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
  }

  const quizForm = document.getElementById('quizForm');
  if (quizForm) {
    initQuiz();
  }

  const refleksiForm = document.getElementById('refleksiForm');
  if (refleksiForm) {
    setupRefleksi();
  }

  const materiContent = document.querySelector('.materi-content');
  if (materiContent) {
    initMateri();
  }
});

function initQuiz() {
  const questions = [
    {
      question: 'Apa fungsi utama Pancasila sebagai dasar negara?',
      answers: ['Menjadi pedoman hidup bangsa', 'Hanya simbol negara', 'Aturan olahraga', 'Peraturan lalu lintas'],
      correct: 0
    },
    {
      question: 'Siapa yang menyusun UUD 1945 pada masa kemerdekaan?',
      answers: ['BPUPK dan PPKI', 'Majelis Ulama', 'Badan Perdagangan', 'Komite Olahraga'],
      correct: 0
    },
    {
      question: 'Hierarki perundang-undangan tertinggi di Indonesia adalah:',
      answers: ['UUD 1945', 'Peraturan Daerah', 'Undang-undang', 'Peraturan Presiden'],
      correct: 0
    },
    {
      question: 'Kearifan lokal penting untuk:',
      answers: ['Menjaga budaya dan lingkungan', 'Menolak perubahan', 'Meningkatkan konflik', 'Mengurangi pendidikan'],
      correct: 0
    },
    {
      question: 'Wawasan Nusantara membantu bangsa menjaga:',
      answers: ['Persatuan dan kedaulatan', 'Hanya ekonomi', 'Hanya pariwisata', 'Hukum internasional'],
      correct: 0
    }
  ];

  const questionContainer = document.getElementById('quizQuestions');
  const quizResult = document.getElementById('quizResult');
  const resultText = document.getElementById('resultText');
  const resultScore = document.getElementById('resultScore');

  questions.forEach((item, index) => {
    const block = document.createElement('div');
    block.className = 'question-block';
    const questionTitle = document.createElement('h3');
    questionTitle.textContent = `Soal ${index + 1}: ${item.question}`;
    block.appendChild(questionTitle);

    const optionList = document.createElement('div');
    optionList.className = 'quiz-options';

    item.answers.forEach((answer, answerIndex) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `question-${index}`;
      input.value = answerIndex;
      label.appendChild(input);
      label.appendChild(document.createTextNode(answer));
      optionList.appendChild(label);
    });

    block.appendChild(optionList);
    questionContainer.appendChild(block);
  });

  document.getElementById('quizForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let score = 0;
    questions.forEach((item, index) => {
      const selected = document.querySelector(`input[name='question-${index}']:checked`);
      if (selected && Number(selected.value) === item.correct) {
        score += 1;
      }
    });

    const percent = Math.round((score / questions.length) * 100);
    if (percent >= 80) {
      resultText.textContent = 'Sangat Baik!';
      resultScore.textContent = `Nilai: ${percent}%`;
    } else {
      resultText.textContent = 'Perlu belajar lagi';
      resultScore.textContent = `Nilai: ${percent}%`;
    }
    quizResult.classList.remove('hidden');
    quizResult.scrollIntoView({ behavior: 'smooth' });
  });
}

function initMateri() {
  const babHeaders = document.querySelectorAll('.materi-card h3');
  babHeaders.forEach(header => {
    header.style.userSelect = 'none';
    header.addEventListener('click', () => {
      const card = header.closest('.materi-card');
      card.classList.toggle('expanded');
    });
  });
}

function setupRefleksi() {
  const form = document.getElementById('refleksiForm');
  const inputPahami = document.getElementById('pahami');
  const inputKesulitan = document.getElementById('kesulitan');
  const inputPengalaman = document.getElementById('pengalaman');
  const savedList = document.getElementById('savedRefleksi');

  loadRefleksi();

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = {
      tanggal: new Date().toLocaleDateString('id-ID'),
      pahami: inputPahami.value.trim(),
      kesulitan: inputKesulitan.value.trim(),
      pengalaman: inputPengalaman.value.trim()
    };

    if (!data.pahami && !data.kesulitan && !data.pengalaman) {
      return;
    }

    const stored = JSON.parse(localStorage.getItem('civistepRefleksi') || '[]');
    stored.unshift(data);
    localStorage.setItem('civistepRefleksi', JSON.stringify(stored));
    inputPahami.value = '';
    inputKesulitan.value = '';
    inputPengalaman.value = '';
    loadRefleksi();
  });

  function loadRefleksi() {
    const entries = JSON.parse(localStorage.getItem('civistepRefleksi') || '[]');
    if (!savedList) return;
    if (entries.length === 0) {
      savedList.innerHTML = '<p>Tidak ada catatan refleksi. Tuliskan pengalaman belajarmu di atas.</p>';
      return;
    }

    savedList.innerHTML = entries.map((item) => `
      <div class="refleksi-entry">
        <strong>${item.tanggal}</strong>
        <p><strong>Apa yang dipahami:</strong> ${item.pahami}</p>
        <p><strong>Kesulitan:</strong> ${item.kesulitan}</p>
        <p><strong>Pengalaman belajar:</strong> ${item.pengalaman}</p>
      </div>
    `).join('');
  }
}


