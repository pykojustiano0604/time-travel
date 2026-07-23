// 초성퀴즈 공용 엔진
// 사용법: 각 페이지에서 window.CHOSUNG_DATA = [{hint:"ㅅㄱㅈㅅ", answer:"사과주스", category:"음식"}, ...] 를 정의한 뒤 이 스크립트를 불러온다.
(function () {
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function init() {
    var data = window.CHOSUNG_DATA;
    if (!data) return;

    var root = document.getElementById("chosung-root");
    if (!root) return;

    var order = shuffle(data.map(function (_, i) { return i; }));
    var pos = 0;
    var revealed = false;

    function render() {
      if (pos >= data.length) {
        renderDone();
        return;
      }
      var item = data[order[pos]];
      var pct = Math.round((pos / data.length) * 100);

      var html = '';
      html += '<div class="progress-label">' + (pos + 1) + ' / ' + data.length + '</div>';
      html += '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + pct + '%"></div></div>';
      html += '<div class="chosung-category">' + item.category + '</div>';
      html += '<div class="chosung-hint">' + item.hint + '</div>';

      if (revealed) {
        html += '<div class="chosung-answer">정답: ' + item.answer + '</div>';
        html += '<div class="btn-row"><button class="btn" id="chosung-next">다음 문제 ▶</button></div>';
      } else {
        html += '<div class="btn-row"><button class="btn" id="chosung-reveal">정답 보기</button></div>';
      }

      root.innerHTML = html;

      var revealBtn = document.getElementById("chosung-reveal");
      if (revealBtn) {
        revealBtn.addEventListener("click", function () {
          revealed = true;
          render();
        });
      }
      var nextBtn = document.getElementById("chosung-next");
      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          pos++;
          revealed = false;
          render();
          root.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }

    function renderDone() {
      var html = '';
      html += '<div class="result-box">';
      html += '<div class="result-emoji">🎉</div>';
      html += '<div class="result-title">' + data.length + '문제 완료!</div>';
      html += '<div class="result-desc">몇 개나 맞혔나요? 순서를 섞어서 다시 도전해보세요.</div>';
      html += '</div>';
      html += '<div class="btn-row"><button class="btn" id="chosung-restart">다시 하기</button></div>';

      root.innerHTML = html;

      document.getElementById("chosung-restart").addEventListener("click", function () {
        order = shuffle(data.map(function (_, i) { return i; }));
        pos = 0;
        revealed = false;
        render();
        root.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
