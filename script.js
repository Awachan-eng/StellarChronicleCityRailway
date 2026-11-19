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

  const vehicleData = {
    "1000": {
      name: "1000系",
      service: "普通",
      maxSpeed: 80,
      description: "標準的な性能を持つ普通列車"
    },
    "2000": {
      name: "2000系",
      service: "急行",
      maxSpeed: 100,
      description: "高速運転に対応した急行列車"
    },
    "7000": {
      name: "7000系",
      service: "観光特急",
      maxSpeed: 120,
      description: "高い最高速度を持つ観光特急列車"
    }
  };

  const routeCards = document.querySelectorAll("[data-route]");
  const vehicleCards = document.querySelectorAll("[data-vehicle]");
  const resultArea = document.getElementById("route-selection-result");
  const selectedRouteName = document.getElementById("selected-route-name");
  const vehicleDetail = document.getElementById("vehicle-select-detail");
  const startDrivingButton = document.getElementById("start-driving-button");
  const drivingRouteName = document.getElementById("driving-route-name");
  const drivingMaxSpeed = document.getElementById("driving-max-speed");

  let selectedRoute = "";
  let selectedVehicle = null;

  routeCards.forEach((card) => {
    card.addEventListener("click", () => {
      selectedRoute = card.dataset.route;
      selectedVehicle = null;

      routeCards.forEach((item) => {
        item.classList.toggle("selected", item === card);
      });

      vehicleCards.forEach((item) => {
        item.classList.remove("selected");
      });

      vehicleDetail.textContent = "車両を選択してください。";
      startDrivingButton.disabled = true;

      selectedRouteName.textContent = selectedRoute + "を選択中";
      resultArea.hidden = false;
    });
  });

  vehicleCards.forEach((card) => {
    card.addEventListener("click", () => {
      selectedVehicle = vehicleData[card.dataset.vehicle];

      vehicleCards.forEach((item) => {
        item.classList.toggle("selected", item === card);
      });

      vehicleDetail.textContent =
        `${selectedVehicle.name}（${selectedVehicle.service}）を選択中：` +
        `${selectedVehicle.description}　最高速度 ${selectedVehicle.maxSpeed} km/h`;

      startDrivingButton.disabled = false;
    });
  });

  startDrivingButton.addEventListener("click", () => {
    if (!selectedRoute || !selectedVehicle) return;

    drivingRouteName.textContent = `${selectedRoute} ／ ${selectedVehicle.name}`;
    drivingMaxSpeed.textContent = `${selectedVehicle.maxSpeed} km/h`;
    updateController(7);
    showScreen("driving-screen");
  });

  const notches = [
    "P7", "P6", "P5", "P4", "P3", "P2", "P1",
    "N",
    "B1", "B2", "B3", "B4", "B5"
  ];

  const controllerTrack = document.getElementById("controller-track");
  const controllerInner = document.getElementById("controller-track-inner");
  const controllerThumb = document.getElementById("controller-thumb");
  const controllerReadout = document.getElementById("controller-readout");
  const controllerLabels = document.querySelectorAll(".notch-label");
  const drivingMessage = document.getElementById("driving-message");

  let currentNotchIndex = 7;
  let isDragging = false;

  function getNotchDescription(notchName) {
    if (notchName.startsWith("P")) return "力行・加速";
    if (notchName === "N") return "惰行";
    return "ブレーキ";
  }

  function updateController(index) {
    currentNotchIndex = Math.max(0, Math.min(12, index));

    const notchName = notches[currentNotchIndex];

    controllerThumb.style.top = `${(currentNotchIndex / 12) * 100}%`;
    controllerReadout.textContent = notchName;

    controllerLabels.forEach((label) => {
      label.classList.toggle(
        "selected",
        Number(label.dataset.index) === currentNotchIndex
      );
    });

    controllerTrack.setAttribute("aria-valuenow", currentNotchIndex);
    controllerTrack.setAttribute("aria-valuetext", notchName);

    drivingMessage.textContent =
      `マスコン：${notchName}　／　${getNotchDescription(notchName)}`;
  }

  function setNotchFromPointer(event) {
    const rect = controllerInner.getBoundingClientRect();

    let ratio = (event.clientY - rect.top) / rect.height;
    ratio = Math.max(0, Math.min(1, ratio));

    updateController(Math.round(ratio * 12));
  }

  controllerTrack.addEventListener("pointerdown", (event) => {
    isDragging = true;
    controllerTrack.setPointerCapture(event.pointerId);
    setNotchFromPointer(event);
  });

  controllerTrack.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    setNotchFromPointer(event);
  });

  controllerTrack.addEventListener("pointerup", () => {
    isDragging = false;
  });

  controllerTrack.addEventListener("pointercancel", () => {
    isDragging = false;
  });

  controllerTrack.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      updateController(currentNotchIndex - 1);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      updateController(currentNotchIndex + 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      updateController(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      updateController(12);
    }
  });

  updateController(7);

  document.getElementById("exit-driving-button").addEventListener("click", () => {
    showScreen("route-select-screen");
  });
});
