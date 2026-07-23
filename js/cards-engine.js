// 대화 카드 공용 엔진
// 사용법: 각 페이지에서 window.CARD_DATA = ["질문1", "질문2", ...] 를 정의한 뒤 이 스크립트를 불러온다.
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
    var data = window.CARD_DATA;
    if (!data) return;

    var root = document.getElementById("card-root");
    if (!root) return;

    var order = shuffle(data.map(function (_, i) { return i; }));
    var pos = 0;

    function render() {
      var text = data[order[pos]];
      var html = '';
      html += '<div class="talk-card">' + text + '</div>';
      html += '<div class="card-counter">' + (pos + 1) + ' / ' + data.length + '</div>';
      html += '<div class="btn-row">';
      html += '<button class="btn secondary" id="card-shuffle">🔀 순서 섞기</button>';
      html += '<button class="btn" id="card-next">다음 질문 ▶</button>';
      html += '</div>';

      root.innerHTML = html;

      document.getElementById("card-next").addEventListener("click", function () {
        pos = (pos + 1) % data.length;
        render();
      });
      document.getElementById("card-shuffle").addEventListener("click", function () {
        order = shuffle(data.map(function (_, i) { return i; }));
        pos = 0;
        render();
      });
    }

    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
