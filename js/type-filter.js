// 인원수(혼자서/둘이서/셋이서/넷이서) 선택 및 콘텐츠 필터링 공용 스크립트
// localStorage에 선택값을 저장해 카테고리 페이지 간 이동에도 선택이 유지된다.
(function () {
  var STORAGE_KEY = "wp_count";
  var ORDER = ["1", "2", "3", "4"];
  var ICON_MAP = { "1": "🧍 혼자서", "2": "👫 둘이서", "3": "👨‍👩‍👧 셋이서", "4": "👨‍👩‍👧‍👦 넷이서" };
  var STATUS_LABEL = { "1": "혼자", "2": "둘이", "3": "셋이", "4": "넷이(또는 그 이상)" };
  var NO_MATCH_TEXT = "선택하신 인원수에 딱 맞는 콘텐츠가 아직 없어요. 다른 인원수를 선택하거나 다른 카테고리를 둘러보세요!";

  function getCount() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function setCount(count) {
    try {
      localStorage.setItem(STORAGE_KEY, count);
    } catch (e) { /* 저장 실패 시 무시 */ }
  }

  function updateNoMatchMessages() {
    document.querySelectorAll(".link-list").forEach(function (list) {
      var anyVisible = Array.prototype.some.call(list.children, function (c) {
        return !c.classList.contains("is-hidden");
      });
      var msg = list.parentNode.querySelector(".no-match-msg");
      if (!anyVisible) {
        if (!msg) {
          msg = document.createElement("p");
          msg.className = "no-match-msg notice-box";
          msg.textContent = NO_MATCH_TEXT;
          list.parentNode.insertBefore(msg, list.nextSibling);
        }
        msg.style.display = "";
      } else if (msg) {
        msg.style.display = "none";
      }
    });
  }

  function applyFilter(count) {
    var items = document.querySelectorAll("[data-types]");
    items.forEach(function (el) {
      var tags = el.getAttribute("data-types").split(/\s+/);
      var visible = count === "" || tags.indexOf("all") !== -1 || tags.indexOf(count) !== -1;
      el.classList.toggle("is-hidden", !visible);
    });

    updateNoMatchMessages();

    var statusEl = document.getElementById("type-status");
    if (statusEl) {
      if (count === "") {
        statusEl.textContent = "전체 콘텐츠를 보여드릴게요.";
      } else {
        statusEl.textContent = STATUS_LABEL[count] + " 있을 때 어울리는 콘텐츠를 먼저 보여드릴게요.";
      }
    }
  }

  function renderSelector(container, onChange) {
    var current = getCount();

    container.innerHTML = ORDER.map(function (count) {
      var active = count === current ? " active" : "";
      return '<button type="button" class="type-btn' + active + '" data-count="' + count + '">' + ICON_MAP[count] + '</button>';
    }).join("");

    container.querySelectorAll(".type-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var count = btn.getAttribute("data-count");
        var wasActive = btn.classList.contains("active");
        var next = wasActive ? "" : count;
        setCount(next);
        container.querySelectorAll(".type-btn").forEach(function (b) { b.classList.remove("active"); });
        if (!wasActive) btn.classList.add("active");
        if (onChange) onChange(next);
      });
    });
  }

  function init() {
    var container = document.getElementById("type-selector");
    if (!container) return;

    renderSelector(container, function (count) {
      applyFilter(count);
    });

    applyFilter(getCount());
  }

  window.WPTypeFilter = { getType: getCount, setType: setCount, applyFilter: applyFilter };

  document.addEventListener("DOMContentLoaded", init);
})();
