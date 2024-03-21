// Add this JavaScript code to your existing script
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourRotation = (hours % 12 + minutes / 60) * 30;
    const minuteRotation = minutes * 6;
    const secondRotation = seconds * 6;

    document.querySelector('.hour').style.transform = `rotate(${hourRotation}deg)`;
    document.querySelector('.minute').style.transform = `rotate(${minuteRotation}deg)`;
    document.querySelector('.second').style.transform = `rotate(${secondRotation}deg)`;

    const sun = document.querySelector('.sun');
    const sunRotation = (hours * 60 + minutes) / 4; // Change this factor for smoother animation
    sun.style.transform = `rotate(${sunRotation}deg)`;

    const sunColor = `rgba(255, 255, 0, ${Math.abs(Math.sin((hours % 12) * Math.PI / 6))})`;
    sun.style.backgroundColor = sunColor;

    requestAnimationFrame(updateClock);
}

updateClock();
