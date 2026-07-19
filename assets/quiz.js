/* AXIS 학습 세션 — 퀴즈 엔진 v2 (단계형 · 정답까지 재시도)
 * 페이지에서 전역 QUIZ 배열 정의 후 로드.
 * QUIZ = [{ q, opts:[..4], a: 정답인덱스, why: 정답해설, wrongWhy: [오답별 해설|null] }, ...]
 * - 오답을 골라도 그 보기만 잠기고 해설이 표시되며, 정답을 찾을 때까지 계속 시도할 수 있다.
 * - 점수는 "첫 시도에 맞춘 문제 수". localStorage 'axis-progress'에 {모듈명: 최고점수}로 저장
 *   (기존 형식과 호환 — 실습 플랫폼 진행 코드도 그대로 동작).
 */
(function () {
  if (typeof QUIZ === 'undefined' || !Array.isArray(QUIZ) || !QUIZ.length) return;
  var mount = document.getElementById('quiz');
  if (!mount) return;

  var moduleId = location.pathname.split('/').pop().replace('.html', '') || 'index';

  var header = document.createElement('div');
  header.className = 'quiz-header';
  header.innerHTML = '<span class="badge">CHECK</span><h2 style="margin:0">이해했는지 확인해 봅시다</h2>';
  mount.appendChild(header);

  var intro = document.createElement('p');
  intro.className = 'lead';
  intro.textContent = '틀려도 괜찮습니다 — 오답을 고르면 왜 아닌지 설명이 나오고, 정답을 찾을 때까지 다시 고를 수 있습니다. 점수는 첫 시도 기준입니다.';
  mount.appendChild(intro);

  var shell = document.createElement('div');
  shell.className = 'quiz-shell';
  mount.appendChild(shell);

  var idx = 0;
  var firstTry = [];   // 문제별: 첫 시도에 맞췄는가
  var solvedWhy = [];  // 리뷰용


  function renderQuestion() {
    var item = QUIZ[idx];
    var wrongCount = 0;
    var solved = false;
    shell.textContent = '';

    var top = document.createElement('div');
    top.className = 'quiz-top';
    var step = document.createElement('span');
    step.className = 'quiz-step';
    step.textContent = '문제 ' + (idx + 1) + ' / ' + QUIZ.length;
    var att = document.createElement('span');
    att.className = 'quiz-attempts';
    att.textContent = '';
    top.appendChild(step); top.appendChild(att);
    shell.appendChild(top);

    var bar = document.createElement('div');
    bar.className = 'quiz-bar';
    var fill = document.createElement('div');
    bar.appendChild(fill);
    shell.appendChild(bar);
    requestAnimationFrame(function () {
      fill.style.width = ((idx) / QUIZ.length * 100) + '%';
      requestAnimationFrame(function () { fill.style.width = ((idx + 0.5) / QUIZ.length * 100) + '%'; });
    });

    var qbox = document.createElement('div');
    qbox.className = 'quiz-q';
    var qt = document.createElement('div');
    qt.className = 'qtext';
    qt.textContent = 'Q' + (idx + 1) + '. ' + item.q;
    qbox.appendChild(qt);

    var feedback = document.createElement('div');
    feedback.className = 'quiz-feedback';

    var nextBtn = document.createElement('button');
    nextBtn.className = 'quiz-next';
    nextBtn.type = 'button';
    nextBtn.textContent = (idx === QUIZ.length - 1) ? '결과 보기 →' : '다음 문제 →';
    nextBtn.addEventListener('click', function () {
      idx++;
      if (idx < QUIZ.length) renderQuestion(); else renderFinish();
      shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    var buttons = [];
    item.opts.forEach(function (opt, oi) {
      var btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.type = 'button';
      btn.textContent = String.fromCharCode(9312 + oi) + ' ' + opt; /* ①②③④ */
      btn.addEventListener('click', function () {
        if (solved) {
          /* 정답 확정 후 탐색 모드: 남은 보기를 눌러 해설만 열람 (채점·표시 불변) */
          if (oi === item.a) return;
          if (!btn.classList.contains('wrong')) btn.classList.add('viewed');
          var info = (item.wrongWhy && item.wrongWhy[oi]) ? item.wrongWhy[oi] : '이 보기는 정답이 아닙니다.';
          feedback.className = 'quiz-feedback show info';
          feedback.textContent = '🔍 보기 ' + String.fromCharCode(9312 + oi) + ' 해설: ' + info + '\n\n✅ 정답 해설: ' + item.why;
          return;
        }
        if (oi === item.a) {
          solved = true;
          buttons.forEach(function (b) { b.disabled = (b === btn); });
          btn.classList.add('correct');
          firstTry[idx] = (wrongCount === 0);
          solvedWhy[idx] = { q: item.q, answer: item.opts[item.a], why: item.why, missed: wrongCount > 0 };
          feedback.className = 'quiz-feedback show good';
          feedback.textContent = (wrongCount === 0 ? '✅ 첫 시도에 정답! ' : '✅ 정답을 찾았습니다. ') + item.why;
          att.textContent = buttons.length > 1 ? '다른 보기를 누르면 해설을 (다시) 볼 수 있습니다' : '';
          nextBtn.classList.add('show');
          fill.style.width = ((idx + 1) / QUIZ.length * 100) + '%';
        } else {
          btn.disabled = true;
          btn.classList.add('wrong');
          wrongCount++;
          att.textContent = '시도 ' + (wrongCount + 1) + '번째';
          var msg = (item.wrongWhy && item.wrongWhy[oi]) ? item.wrongWhy[oi] : '이 보기는 정답이 아닙니다.';
          feedback.className = 'quiz-feedback show bad';
          feedback.textContent = '❌ ' + msg + '\n\n남은 보기에서 다시 골라보세요.';
        }
      });
      buttons.push(btn);
      qbox.appendChild(btn);
    });

    qbox.appendChild(feedback);
    qbox.appendChild(nextBtn);
    shell.appendChild(qbox);
  }

  function renderFinish() {
    var score = firstTry.filter(Boolean).length;
    shell.textContent = '';

    var bar = document.createElement('div');
    bar.className = 'quiz-bar';
    var fill = document.createElement('div');
    fill.style.width = '100%';
    bar.appendChild(fill);
    shell.appendChild(bar);

    var box = document.createElement('div');
    box.className = 'quiz-finish';

    var scoreEl = document.createElement('div');
    scoreEl.className = 'score';
    scoreEl.textContent = score + ' ';
    var small = document.createElement('small');
    small.textContent = '/ ' + QUIZ.length + ' 첫 시도 정답';
    scoreEl.appendChild(small);
    box.appendChild(scoreEl);

    var verdict = document.createElement('div');
    verdict.className = 'verdict';
    verdict.textContent =
      score === QUIZ.length ? '완벽합니다! 다음 모듈로 넘어가셔도 좋습니다. 🎉' :
      score >= Math.ceil(QUIZ.length * 0.6) ? '좋습니다. 아래 복습 항목만 한 번 더 읽어보세요.' :
      '본문을 한 번 더 읽고 다시 풀어보시길 권합니다.';
    box.appendChild(verdict);

    var missed = solvedWhy.filter(function (s) { return s && s.missed; });
    if (missed.length) {
      var review = document.createElement('div');
      review.className = 'quiz-review';
      var h = document.createElement('h3');
      h.textContent = '복습 포인트 — 첫 시도에 놓친 문제';
      review.appendChild(h);
      missed.forEach(function (s) {
        var rv = document.createElement('div');
        rv.className = 'rv';
        var rq = document.createElement('div'); rq.className = 'rq'; rq.textContent = s.q;
        var ra = document.createElement('div'); ra.className = 'ra'; ra.textContent = '정답: ' + s.answer;
        var rw = document.createElement('div'); rw.textContent = s.why;
        rv.appendChild(rq); rv.appendChild(ra); rv.appendChild(rw);
        review.appendChild(rv);
      });
      box.appendChild(review);
    }

    var retry = document.createElement('button');
    retry.className = 'quiz-retry';
    retry.type = 'button';
    retry.textContent = '↺ 처음부터 다시 풀기';
    retry.addEventListener('click', function () {
      idx = 0; firstTry = []; solvedWhy = [];
      renderQuestion();
      shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    box.appendChild(retry);

    shell.appendChild(box);

    try {
      var store = JSON.parse(localStorage.getItem('axis-progress') || '{}');
      var prev = store[moduleId];
      if (prev === undefined || score > prev) store[moduleId] = score;
      localStorage.setItem('axis-progress', JSON.stringify(store));
    } catch (e) { /* 시크릿 모드 등에선 저장 생략 */ }
  }

  renderQuestion();
})();
