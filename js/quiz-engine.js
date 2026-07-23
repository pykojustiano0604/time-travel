// 심리테스트 공용 엔진
// 사용법: 각 페이지에서 window.QUIZ_DATA = { questions: [...], results: {...} } 를 정의한 뒤 이 스크립트를 불러온다.
(function () {
  function init() {
    var data = window.QUIZ_DATA;
    if (!data) return;

    var root = document.getElementById("quiz-root");
    if (!root) return;

    var current = 0;
    var scores = {};

    function render() {
      if (current >= data.questions.length) {
        renderResult();
        return;
      }
      var q = data.questions[current];
      var pct = Math.round((current / data.questions.length) * 100);

      var html = '';
      html += '<div class="progress-label">' + (current + 1) + ' / ' + data.questions.length + '</div>';
      html += '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + pct + '%"></div></div>';
      html += '<div class="question-text">' + q.text + '</div>';
      html += '<div class="option-grid">';
      q.options.forEach(function (opt, i) {
        html += '<button class="option-btn" data-index="' + i + '">' + opt.label + '</button>';
      });
      html += '</div>';

      root.innerHTML = html;

      var buttons = root.querySelectorAll(".option-btn");
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var idx = parseInt(btn.getAttribute("data-index"), 10);
          var type = q.options[idx].type;
          scores[type] = (scores[type] || 0) + 1;
          current++;
          render();
          root.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }

    function renderResult() {
      var bestType = null;
      var bestScore = -1;
      Object.keys(scores).forEach(function (type) {
        if (scores[type] > bestScore) {
          bestScore = scores[type];
          bestType = type;
        }
      });
      // 동점일 경우 결과 정의 순서상 첫 번째 타입 사용
      if (!bestType) {
        bestType = Object.keys(data.results)[0];
      }
      var result = data.results[bestType];

      var html = '';
      html += '<div class="result-box">';
      html += '<div class="result-emoji">' + result.emoji + '</div>';
      html += '<div class="result-title">' + result.title + '</div>';
      html += '<div class="result-desc">' + result.desc + '</div>';
      html += '</div>';
      html += '<div class="btn-row">';
      html += '<button class="btn" id="quiz-restart">다시 테스트하기</button>';
      html += '</div>';

      root.innerHTML = html;

      document.getElementById("quiz-restart").addEventListener("click", function () {
        current = 0;
        scores = {};
        render();
        root.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
