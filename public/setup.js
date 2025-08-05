document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("setup-form");
  const deviceIdInput = document.getElementById("device-id");

  // Real-time input filter: only digits allowed
  deviceIdInput.addEventListener("input", () => {
    deviceIdInput.value = deviceIdInput.value.replace(/\D/g, "");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const lengthInput = document.getElementById("length");
    const heightInput = document.getElementById("height");

    // Clear previous error styles
    [deviceIdInput, lengthInput, heightInput].forEach(input =>
      input.classList.remove("input-error")
    );

    let hasError = false;

    const deviceId = deviceIdInput.value.trim();
    const length = parseInt(lengthInput.value.trim(), 10);
    const height = parseInt(heightInput.value.trim(), 10);

    if (!/^\d+$/.test(deviceId)) {
      deviceIdInput.classList.add("input-error");
      hasError = true;
    }
    if (isNaN(length) || length <= 0) {
      lengthInput.classList.add("input-error");
      hasError = true;
    }
    if (isNaN(height) || height <= 0) {
      heightInput.classList.add("input-error");
      hasError = true;
    }

    if (hasError) {
      alert("Please correct the highlighted fields.");
      return;
    }

    const paddedLength = String(length).padStart(4, "0");
    const paddedHeight = String(height).padStart(4, "0");

    localStorage.setItem("wipyDeviceId", deviceId);
    localStorage.setItem("wipyLength", paddedLength);
    localStorage.setItem("wipyHeight", paddedHeight);

    window.location.href = "schedule.html";
  });
});
