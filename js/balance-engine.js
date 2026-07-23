// 밸런스 게임 공용 엔진
// 사용법: 각 페이지에서 window.BALANCE_DATA = [{a:"...", b:"..."}, ...] 를 정의한 뒤 이 스크립트를 불러온다.
(function () {
  function init() {
    var data = window.BALANCE_DATA;
    if (!data) return;

    var root = document.getElementById("balance-root");
    if (!root) return;

    var current = 0;
    var countA = 0;
    var countB = 0;
    var picks = [];

    function render() {
      if (current >= data.length) {
        renderResult();
        return;
      }
      var q = data[current];
      var pct = Math.round((current / data.length) * 100);

      var html = '';
      html += '<div class="progress-label">' + (current + 1) + ' / ' + data.length + '</div>';
      html += '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + pct + '%"></div></div>';
      html += '<div class="question-text">둘 중 하나만 고른다면?</div>';
      html += '<div class="option-grid two-col">';
      html += '<button class="option-btn" data-side="a">' + q.a + '</button>';
      html += '<button class="option-btn" data-side="b">' + q.b + '</button>';
      html += '</div>';

      root.innerHTML = html;

      root.querySelectorAll(".option-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var side = btn.getAttribute("data-side");
          if (side === "a") { countA++; } else { countB++; }
          picks.push(side === "a" ? q.a : q.b);
          current++;
          render();
        });
      });
    }

    function renderResult() {
      var html = '';
      html += '<div class="result-box">';
      html += '<div class="result-emoji">🎉</div>';
      html += '<div class="result-title">모든 선택 완료!</div>';
      html += '<div class="result-desc">이번 판에서 내가 고른 선택들이에요. 같이 하는 사람과 비교해보면 더 재밌어요!</div>';
      html += '</div>';
      html += '<div class="stat-row">';
      html += '<div class="stat-box"><div class="num">' + countA + '</div><div class="label">왼쪽 선택</div></div>';
      html += '<div class="stat-box"><div class="num">' + countB + '</div><div class="label">오른쪽 선택</div></div>';
      html += '</div>';
      html += '<div class="notice-box">내가 고른 것: ' + picks.join(' · ') + '</div>';
      html += '<div class="btn-row"><button class="btn" id="balance-restart">다시 하기</button></div>';

      root.innerHTML = html;

      document.getElementById("balance-restart").addEventListener("click", function () {
        current = 0;
        countA = 0;
        countB = 0;
        picks = [];
        render();
      });
    }

    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
