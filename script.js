document.addEventListener("DOMContentLoaded", () => {
  const screens = document.querySelectorAll(".screen");

  function showScreen(screenId) {
    const target = document.getElementById(screenId);

    if (!target) return;

    screens.forEach((screen) => {
      screen.classList.toggle("active", screen.id === screenId);
    });

    window.scrollTo(0, 0);
  }

  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      showScreen(button.dataset.screen);
    });
  });

  document.getElementById("home-button").addEventListener("click", () => {
    showScreen("home-screen");
  });

  const routeCards = document.querySelectorAll("[data-route]");
  const resultArea = document.getElementById("route-selection-result");
  const selectedRouteName = document.getElementById("selected-route-name");

  let selectedRoute = "";

  routeCards.forEach((card) => {
    card.addEventListener("click", () => {
      selectedRoute = card.dataset.route;

      routeCards.forEach((item) => {
        item.classList.toggle("selected", item === card);
      });

      selectedRouteName.textContent = selectedRoute + "を選択中";
      resultArea.hidden = false;
    });
  });
});
