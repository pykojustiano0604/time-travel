// 이름 궁합 테스트 (100% 재미 목적, 실제 궁합과 무관)
(function () {
  var MESSAGE_SETS = {
    couple: {
      icon: "❤",
      label: "연애 궁합",
      tiers: [
        { min: 0, max: 39, emoji: "🌵", title: "아직은 서먹서먹", desc: "지금은 서로를 알아가는 단계! 대화 카드로 질문을 주고받으며 조금씩 친해져 보세요." },
        { min: 40, max: 59, emoji: "🌱", title: "무난무난 케미", desc: "크게 부딪힐 일은 없지만 강한 스파크도 아직은 없는 사이. 공통 관심사를 하나씩 찾아보면 좋아요." },
        { min: 60, max: 74, emoji: "🌤️", title: "은근히 잘 맞아요", desc: "생각보다 합이 좋은 편! 같이 있으면 시간 가는 줄 모르는 타입이에요." },
        { min: 75, max: 89, emoji: "🔥", title: "찰떡궁합", desc: "죽이 척척 맞는 사이! 데이트도, 여행도, 뭘 해도 잘 맞을 확률이 높아요." },
        { min: 90, max: 100, emoji: "💫", title: "운명적인 케미", desc: "흔치 않은 조합! 오늘 같이 있는 시간을 놓치지 말고 마음껏 즐겨보세요." }
      ]
    },
    friend: {
      icon: "🤝",
      label: "우정 케미",
      tiers: [
        { min: 0, max: 39, emoji: "🙂", title: "아직 알아가는 사이", desc: "친해질 여지가 충분해요! 대화 카드로 서로에 대해 하나씩 물어보면 좋아요." },
        { min: 40, max: 59, emoji: "🌱", title: "무난한 친구 사이", desc: "편하지만 아직 깊은 이야기는 안 해본 사이일 수 있어요. 같이 새로운 걸 해보세요." },
        { min: 60, max: 74, emoji: "😄", title: "은근 잘 맞는 친구", desc: "생각보다 합이 좋은 친구 사이! 같이 있으면 시간 가는 줄 모르겠네요." },
        { min: 75, max: 89, emoji: "🎉", title: "찐친 케미", desc: "말 안 해도 통하는 사이! 어디를 가도, 뭘 해도 죽이 잘 맞는 친구예요." },
        { min: 90, max: 100, emoji: "🏆", title: "인생 친구 케미", desc: "흔치 않은 인연이에요! 오늘도 이 친구랑 함께하는 시간을 마음껏 즐겨보세요." }
      ]
    },
    family: {
      icon: "🏠",
      label: "가족 케미",
      tiers: [
        { min: 0, max: 39, emoji: "😅", title: "아직은 어색해요", desc: "가족이라도 대화가 적었던 사이일 수 있어요. 대화 카드로 이야기를 시작해보세요." },
        { min: 40, max: 59, emoji: "🌱", title: "무난한 가족 케미", desc: "큰 갈등은 없지만 서로 모르는 부분도 많은 사이예요. 관심사를 나눠보면 좋아요." },
        { min: 60, max: 74, emoji: "🌤️", title: "따뜻한 가족 케미", desc: "생각보다 잘 통하는 가족이에요! 함께 있는 시간이 편안하게 느껴질 거예요." },
        { min: 75, max: 89, emoji: "🔥", title: "찐한 가족 케미", desc: "말 안 해도 통하는 가족! 티격태격해도 결국 서로가 제일 든든한 사이예요." },
        { min: 90, max: 100, emoji: "💫", title: "환상의 가족 케미", desc: "보기 드문 찰떡 케미! 오늘 함께하는 시간을 더 소중히 즐겨보세요." }
      ]
    }
  };

  function scoreFromNames(a, b) {
    var combined = (a + b).replace(/\s/g, "");
    var sum = 0;
    for (var i = 0; i < combined.length; i++) {
      sum += combined.charCodeAt(i) * (i + 1);
    }
    // 이름 조합에 따라 항상 같은 값이 나오는 결정론적 계산 (실시간/외부 API 아님)
    return sum % 101;
  }

  function pickTier(tiers, score) {
    for (var i = 0; i < tiers.length; i++) {
      if (score >= tiers[i].min && score <= tiers[i].max) return tiers[i];
    }
    return tiers[0];
  }

  function currentRelation() {
    var active = document.querySelector("#relation-selector .type-btn.active");
    return active ? active.getAttribute("data-relation") : "couple";
  }

  function renderRelationSelector() {
    var container = document.getElementById("relation-selector");
    if (!container) return;

    var order = ["friend", "family", "couple"];
    var iconMap = { friend: "👬 친구", family: "👨‍👩‍👧 가족", couple: "💑 연인" };
    var initial = "couple";

    container.innerHTML = order.map(function (rel) {
      var active = rel === initial ? " active" : "";
      return '<button type="button" class="type-btn' + active + '" data-relation="' + rel + '">' + iconMap[rel] + '</button>';
    }).join("");

    container.querySelectorAll(".type-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        container.querySelectorAll(".type-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
      });
    });
  }

  function init() {
    renderRelationSelector();

    var form = document.getElementById("compat-form");
    var resultEl = document.getElementById("compat-result");
    if (!form || !resultEl) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameA = document.getElementById("name-a").value.trim();
      var nameB = document.getElementById("name-b").value.trim();
      if (!nameA || !nameB) return;

      var relation = currentRelation();
      var set = MESSAGE_SETS[relation] || MESSAGE_SETS.couple;
      var score = scoreFromNames(nameA, nameB);
      var tier = pickTier(set.tiers, score);

      var html = '';
      html += '<div class="result-box">';
      html += '<div class="result-emoji">' + tier.emoji + '</div>';
      html += '<div class="result-title">' + nameA + ' ' + set.icon + ' ' + nameB + '</div>';
      html += '<div class="progress-label">' + set.label + '</div>';
      html += '<div class="meter"><div class="meter-fill" style="width:' + score + '%">' + score + '%</div></div>';
      html += '<div class="result-title" style="font-size:1.2rem;margin-top:10px;">' + tier.title + '</div>';
      html += '<div class="result-desc">' + tier.desc + '</div>';
      html += '</div>';

      resultEl.innerHTML = html;
      resultEl.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
