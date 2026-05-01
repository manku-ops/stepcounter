let steps = 0;
let lastMovement = 0;
let threshold = 3;
let canStep = true;

// Assumptions
let stepLength = 0.75; // meters
let caloriesPerStep = 0.04; // kcal

function start() {
    alert("Sensor started! Move your phone.");

    if (typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function") {

        DeviceMotionEvent.requestPermission()
        .then(response => {
            if (response === "granted") {
                initSensor();
            } else {
                alert("Permission denied");
            }
        })
        .catch(console.error);

    } else {
        initSensor();
    }
}

function initSensor() {
    window.addEventListener("devicemotion", function(event) {

        let acc = event.accelerationIncludingGravity;
        if (!acc) return;

        let x = acc.x || 0;
        let y = acc.y || 0;
        let z = acc.z || 0;

        let movement = Math.sqrt(x*x + y*y + z*z);
        let diff = Math.abs(movement - lastMovement);

        if (diff > threshold && canStep) {
            steps++;
            updateStats();

            canStep = false;
            setTimeout(() => {
                canStep = true;
            }, 300);
        }

        lastMovement = movement;
    });
}


function updateStats() {
    document.getElementById("steps").innerText = steps;

    let distance = (steps * stepLength).toFixed(2);
    document.getElementById("distance").innerText = distance + " m";

    let calories = (steps * caloriesPerStep).toFixed(2);
    document.getElementById("calories").innerText = calories + " kcal";

    // 🎯 Progress ring (goal = 5000 steps)
    let goal = 5000;
    let progress = Math.min(steps / goal, 1);
    let degrees = progress * 360;

    document.querySelector(".ring").style.background =
        `conic-gradient(#00e676 ${degrees}deg, #1e293b ${degrees}deg)`;
}
function reset() {
    steps = 0;
    lastMovement = 0;
    updateStats();
}
