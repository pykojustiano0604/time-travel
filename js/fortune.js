// 오늘의 운세 (재미용, 이름과 오늘 날짜를 조합한 결정론적 계산 - 외부 API 사용 안 함)
(function () {
  var TOTAL = [
    "오늘은 기다리던 일이 술술 풀리는 날! 여유로운 마음으로 하루를 보내보세요.",
    "작은 행운이 여기저기 숨어있는 날이에요. 평소 안 가던 길로 가보면 좋을지도?",
    "무리하지 않고 페이스 조절하면 좋은 하루가 될 거예요.",
    "생각지도 못한 곳에서 좋은 소식이 들려올 수 있어요.",
    "오늘은 주변 사람과의 대화에서 힌트를 얻는 날이에요.",
    "컨디션 관리가 중요한 날! 무리하지 말고 천천히 움직이세요.",
    "새로운 도전을 하기에 나쁘지 않은 타이밍이에요."
  ];
  var LOVE = [
    "함께 있는 사람에게 먼저 말을 걸어보세요. 분위기가 훈훈해질 거예요.",
    "솔직한 말 한마디가 관계를 더 가깝게 만들어줄 수 있어요.",
    "질문 하나로 몰랐던 이야기를 들을 수 있는 날이에요.",
    "괜히 툴툴대기보단 웃어넘기는 게 오늘의 정답이에요.",
    "함께 웃을 수 있는 시간이 늘어나는 하루예요.",
    "작은 배려가 크게 다가오는 날이니 챙겨보세요."
  ];
  var MONEY = [
    "충동적인 지출은 잠깐 참는 게 좋아요.",
    "생각보다 알뜰하게 하루를 보낼 수 있어요.",
    "커피 한 잔의 여유가 오늘의 사치품이 될 거예요.",
    "예상치 못한 지출이 생길 수 있으니 영수증을 잘 챙기세요.",
    "적당한 소비가 기분전환에 도움이 되는 날이에요."
  ];
  var ITEM = ["아메리카노 ☕", "우산 ☂️", "휴대폰 충전기 🔌", "손소독제 🧴", "이어폰 🎧", "무릎담요 🧣", "핸드크림 🧴", "사탕 🍬", "볼펜 🖊️", "휴지 🧻"];

  function hashString(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  function pick(arr, seed) {
    return arr[seed % arr.length];
  }

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function init() {
    var form = document.getElementById("fortune-form");
    var resultEl = document.getElementById("fortune-result");
    if (!form || !resultEl) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("fortune-name").value.trim() || "익명";
      var key = name + "_" + todayKey();
      var seed = hashString(key);

      var score = 60 + (seed % 41); // 60~100 사이 점수
      var total = pick(TOTAL, seed);
      var love = pick(LOVE, Math.floor(seed / 3));
      var money = pick(MONEY, Math.floor(seed / 7));
      var item = pick(ITEM, Math.floor(seed / 11));

      var html = '';
      html += '<div class="fortune-box">';
      html += '<div class="fortune-date">' + todayKey().replace(/-/g, ". ") + ' · ' + name + '님의 오늘 운세</div>';
      html += '<div class="fortune-score">🍀 ' + score + '점</div>';
      html += '<div class="notice-box" style="text-align:left"><b>총운</b><br>' + total + '</div>';
      html += '<div class="notice-box" style="text-align:left"><b>애정운</b><br>' + love + '</div>';
      html += '<div class="notice-box" style="text-align:left"><b>금전운</b><br>' + money + '</div>';
      html += '<div class="notice-box" style="text-align:left"><b>오늘의 행운 아이템</b><br>' + item + '</div>';
      html += '</div>';

      resultEl.innerHTML = html;
      resultEl.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
