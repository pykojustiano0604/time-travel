// 공통 스크립트: 모바일 내비게이션 토글 + 웨이팅 타이머
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  initWaitingTimer();
});

// 이 브라우저 세션 동안 사이트에 머문 시간을 재는 타이머.
// 서버 저장이나 외부 API 없이 sessionStorage의 시작 시각과 현재 시각만으로 계산한다.
function initWaitingTimer() {
  var STORAGE_KEY = "wp_start_ts";
  var startTs = null;
  try {
    startTs = sessionStorage.getItem(STORAGE_KEY);
    if (!startTs) {
      startTs = Date.now().toString();
      sessionStorage.setItem(STORAGE_KEY, startTs);
    }
  } catch (e) {
    startTs = Date.now().toString();
  }
  startTs = parseInt(startTs, 10);

  var bar = document.createElement("div");
  bar.className = "waiting-timer-bar";
  bar.setAttribute("aria-label", "사이트에 머문 시간");
  document.body.classList.add("has-waiting-timer");
  document.body.insertBefore(bar, document.body.firstChild);

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function render() {
    var elapsed = Math.max(0, Math.floor((Date.now() - startTs) / 1000));
    var h = Math.floor(elapsed / 3600);
    var m = Math.floor((elapsed % 3600) / 60);
    var s = elapsed % 60;
    var timeText = h > 0 ? (h + ":" + pad(m) + ":" + pad(s)) : (pad(m) + ":" + pad(s));
    bar.textContent = "⏱️ 웨이팅 한 시간 : " + timeText;
  }

  render();
  setInterval(render, 1000);
}
