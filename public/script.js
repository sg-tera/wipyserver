const days =
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let currentDayIndex = 0;
const scheduleData = {};
window.onload = () => {
    renderDay();
    document.getElementById("next-btn").addEventListener("click", handleNext);

    document.getElementById("prev-btn").addEventListener("click", handlePrevious);

    document.getElementById("schedule-form").addEventListener("submit", handleSubmit);

};
function renderDay() {
    const container = document.getElementById("days-container");
    container.innerHTML = "";
    const day = days[currentDayIndex];
    const section = document.createElement("div");
    section.className = "day-section";
    const title = document.createElement("h2");
    title.innerText = day;
    section.appendChild(title);
    const timeList = document.createElement("div");
    timeList.id = "time-list";
    section.appendChild(timeList);
    const savedTimes = scheduleData[day] || [];
    savedTimes.forEach((from) => {
        const input = createTimeInput(from);
        timeList.appendChild(input);
    });

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.innerText = "Add Time";
    addButton.onclick = () => {
        timeList.appendChild(createTimeInput());
    };
    section.appendChild(addButton);
    container.appendChild(section);
    document.getElementById("prev-btn").disabled = currentDayIndex === 0;

    document.getElementById("next-btn").style.display = currentDayIndex ===
        days.length - 1 ? "none" : "inline-block";
    document.getElementById("submit-btn").style.display = currentDayIndex ===
        days.length - 1 ? "inline-block" : "none";
}
function createTimeInput(from = "") {
    const wrapper = document.createElement("div");
    wrapper.className = "time-range";
    const fromLabel = document.createElement("label");
    fromLabel.innerText = "Starting time:";
    fromLabel.className = "time-label";
    const fromInput = document.createElement("input");
    fromInput.type = "time";
    fromInput.value = from;
    fromInput.className = "time-from";
    wrapper.appendChild(fromLabel);
    wrapper.appendChild(fromInput);
    return wrapper;
}

function saveCurrentDayTimes() {
    const timeRanges = document.querySelectorAll(".time-range");
    const times = Array.from(timeRanges).map(range => {
        const from = range.querySelector(".time-from").value;
        return from ? from : null;
    }).filter(entry => entry !== null);
    scheduleData[days[currentDayIndex]] = times;
}

function handleNext() {
    saveCurrentDayTimes();
    if (currentDayIndex < days.length - 1) {
        currentDayIndex++;
        renderDay();
    }
}
function handlePrevious() {
    saveCurrentDayTimes();
    if (currentDayIndex > 0) {
        currentDayIndex--;

        renderDay();
    }
}
function handleSubmit(event) {
    event.preventDefault();
    saveCurrentDayTimes();
    const deviceId = localStorage.getItem("wipyDeviceId");
    const height = localStorage.getItem("wipyHeight");
    const length = localStorage.getItem("wipyHeight");
    const fullPayload = {
        deviceId,
        length,
        height,
        schedule: scheduleData
    };
    console.log("Submitting:", fullPayload);
    fetch('/api/settings/' + deviceId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fullPayload)
    })
        .then(res => res.ok ? alert('Schedule submitted!') : alert('Failed to send schedule'))
        .catch(err => alert('Error connecting to eraser: ' + err.message));
}