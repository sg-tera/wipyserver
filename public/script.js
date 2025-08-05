const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
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
  savedTimes.forEach(fromTime => {
    const input = createTimeInput(fromTime);
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
  document.getElementById("next-btn").style.display = currentDayIndex === days.length - 1 ? "none" : "inline-block";
  document.getElementById("submit-btn").style.display = currentDayIndex === days.length - 1 ? "inline-block" : "none";
}

function createTimeInput(from = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "time-range";

  const fromLabel = document.createElement("label");
  fromLabel.innerText = "Starting time (HHMM):";
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
    const fromRaw = range.querySelector(".time-from").value; // e.g. "09:30"
    // Convert "09:30" to "0930"
    const from = fromRaw.replace(":", "");
    return from;  // e.g. "0930"
  });
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
  let height = localStorage.getItem("wipyHeight");
  let length = localStorage.getItem("wipyLength");

  // Validate deviceId is numeric
  if (!/^\d+$/.test(deviceId)) {
    alert("Device ID must be numeric.");
    return;
  }

  // Validate all time inputs - must be exactly 4 digits numeric
  const allInputs = document.querySelectorAll(".time-from");
  let allValid = true;
  allInputs.forEach(input => {
    // Convert HH:MM to HHMM for validation
    const val = input.value.replace(":", "");
    if (!/^\d{4}$/.test(val)) {
      input.classList.add("input-error");
      allValid = false;
    } else {
      input.classList.remove("input-error");
    }
  });

  if (!allValid) {
    alert("Please enter valid times in HH:MM format.");
    return;
  }

  // Pad length and height to 4 digits (e.g. '0099')
  length = length.toString().padStart(4, "0");
  height = height.toString().padStart(4, "0");

  // Map full day names to short keys
  const dayKeyMap = {
    "Sunday": "sun",
    "Monday": "mon",
    "Tuesday": "tue",
    "Wednesday": "wed",
    "Thursday": "thu",
    "Friday": "fri",
    "Saturday": "sat"
  };

  // Build schedules with arrays of 4-digit times using short keys
  const schedules = {};
  for (const [fullDay, times] of Object.entries(scheduleData)) {
    if (times.length > 0) {
      schedules[dayKeyMap[fullDay]] = times; // times already HHMM format from saveCurrentDayTimes()
    }
  }

  const fullPayload = {
    id: parseInt(deviceId, 10),
    dimensions: {
      width: length,
      height: height
    },
    schedules: schedules
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