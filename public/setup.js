document.getElementById("setup-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const deviceId = document.getElementById("device-id").value.trim();
    const length = parseInt(document.getElementById("length").value.trim(), 10);
    const height = parseInt(document.getElementById("height").value.trim(), 10);

    if (!deviceId || !length || !height) {
        alert("Please fill in all fields.");
        return;
    }

    localStorage.setItem("wipyDeviceId", deviceId);
    localStorage.setItem("wipyLength", length);
    localStorage.setItem("wipyHeight", height);

    window.location.href = "schedule.html";
})