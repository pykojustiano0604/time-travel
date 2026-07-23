// 관계 타입(친구/가족/연인) 선택 및 콘텐츠 필터링 공용 스크립트
// localStorage에 선택값을 저장해 카테고리 페이지 간 이동에도 선택이 유지된다.
(function () {
  var STORAGE_KEY = "wp_type";
  var LABELS = { "": "전체", friend: "친구", family: "가족", couple: "연인" };

  function getType() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function setType(type) {
    try {
      localStorage.setItem(STORAGE_KEY, type);
    } catch (e) { /* 저장 실패 시 무시 */ }
  }

  function applyFilter(type) {
    var items = document.querySelectorAll("[data-types]");
    items.forEach(function (el) {
      var types = el.getAttribute("data-types").split(/\s+/);
      var visible = type === "" || types.indexOf("all") !== -1 || types.indexOf(type) !== -1;
      el.classList.toggle("is-hidden", !visible);
    });

    var statusEl = document.getElementById("type-status");
    if (statusEl) {
      if (type === "") {
        statusEl.textContent = "전체 콘텐츠를 보여드릴게요.";
      } else {
        statusEl.textContent = LABELS[type] + "(이)랑 있을 때 어울리는 콘텐츠를 먼저 보여드릴게요.";
      }
    }
  }

  function renderSelector(container, onChange) {
    var current = getType();
    var order = ["", "friend", "family", "couple"];
    var iconMap = { "": "🙂 전체", friend: "👬 친구", family: "👨‍👩‍👧 가족", couple: "💑 연인" };

    container.innerHTML = order.map(function (type) {
      var active = type === current ? " active" : "";
      return '<button type="button" class="type-btn' + active + '" data-type="' + type + '">' + iconMap[type] + '</button>';
    }).join("");

    container.querySelectorAll(".type-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var type = btn.getAttribute("data-type");
        setType(type);
        container.querySelectorAll(".type-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        if (onChange) onChange(type);
      });
    });
  }

  function init() {
    var container = document.getElementById("type-selector");
    if (!container) return;

    renderSelector(container, function (type) {
      applyFilter(type);
    });

    applyFilter(getType());
  }

  window.WPTypeFilter = { getType: getType, setType: setType, applyFilter: applyFilter };

  document.addEventListener("DOMContentLoaded", init);
})();
