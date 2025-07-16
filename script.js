document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const hoursDisplay = document.getElementById('hours');
  const minutesDisplay = document.getElementById('minutes');
  const secondsDisplay = document.getElementById('seconds');
  const millisecondsDisplay = document.getElementById('milliseconds');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const lapBtn = document.getElementById('lap-btn');
  const lapsList = document.getElementById('laps-list');

  // Stopwatch variables
  let startTime;
  let elapsedTime = 0;
  let timerInterval;
  let isRunning = false;
  let lapTimes = [];

  // Format time to always show 2 digits
  function formatTime(time) {
    return time.toString().padStart(2, '0');
  }

  // Format milliseconds to always show 2 digits
  function formatMilliseconds(ms) {
    return Math.floor(ms / 10).toString().padStart(2, '0');
  }

  // Update the display with current time
  function updateDisplay() {
    const totalMilliseconds = elapsedTime + (isRunning ? Date.now() - startTime : 0);
    
    const hours = Math.floor(totalMilliseconds / 3600000);
    const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    const milliseconds = totalMilliseconds % 1000;
    
    hoursDisplay.textContent = formatTime(hours);
    minutesDisplay.textContent = formatTime(minutes);
    secondsDisplay.textContent = formatTime(seconds);
    millisecondsDisplay.textContent = formatMilliseconds(milliseconds);
  }

  // Start the stopwatch
  function startStopwatch() {
    if (!isRunning) {
      startTime = Date.now() - elapsedTime;
      timerInterval = setInterval(updateDisplay, 10);
      isRunning = true;
      toggleButtons();
    }
  }

  // Pause the stopwatch
  function pauseStopwatch() {
    if (isRunning) {
      clearInterval(timerInterval);
      elapsedTime += Date.now() - startTime;
      isRunning = false;
      toggleButtons();
    }
  }

  // Reset the stopwatch
  function resetStopwatch() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    isRunning = false;
    lapTimes = [];
    updateDisplay();
    renderLaps();
    toggleButtons();
  }

  // Record a lap time
  function recordLap() {
    if (!isRunning && elapsedTime === 0) return;
    
    const currentTime = elapsedTime + (isRunning ? Date.now() - startTime : 0);
    const lapTime = {
      time: currentTime,
      number: lapTimes.length + 1
    };
    
    lapTimes.push(lapTime);
    renderLaps();
  }

  // Render lap times
  function renderLaps() {
    lapsList.innerHTML = '';
    
    if (lapTimes.length === 0) {
      lapsList.innerHTML = '<div class="empty-laps">No lap times recorded</div>';
      return;
    }
    
    // Calculate fastest and slowest laps
    let fastestIndex = 0;
    let slowestIndex = 0;
    
    if (lapTimes.length > 1) {
      for (let i = 1; i < lapTimes.length; i++) {
        const currentDiff = lapTimes[i].time - lapTimes[i-1].time;
        const fastestDiff = lapTimes[fastestIndex+1]?.time - lapTimes[fastestIndex]?.time;
        const slowestDiff = lapTimes[slowestIndex+1]?.time - lapTimes[slowestIndex]?.time;
        
        if (currentDiff < fastestDiff || fastestIndex === 0) {
          fastestIndex = i-1;
        }
        
        if (currentDiff > slowestDiff || slowestIndex === 0) {
          slowestIndex = i-1;
        }
      }
    }
    
    lapTimes.forEach((lap, index) => {
      const lapItem = document.createElement('li');
      lapItem.className = 'lap-item';
      
      // Format lap time
      const totalMilliseconds = lap.time;
      const hours = Math.floor(totalMilliseconds / 3600000);
      const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
      const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
      const milliseconds = totalMilliseconds % 1000;
      
      const formattedTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}.${formatMilliseconds(milliseconds)}`;
      
      // Calculate difference with previous lap (if any)
      let differenceText = '';
      if (index > 0) {
        const difference = lap.time - lapTimes[index-1].time;
        const diffHours = Math.floor(difference / 3600000);
        const diffMinutes = Math.floor((difference % 3600000) / 60000);
        const diffSeconds = Math.floor((difference % 60000) / 1000);
        const diffMilliseconds = difference % 1000;
        
        const sign = difference >= 0 ? '+' : '-';
        const absDifference = Math.abs(difference);
        
        differenceText = `${sign}${formatTime(diffHours)}:${formatTime(diffMinutes)}:${formatTime(diffSeconds)}.${formatMilliseconds(diffMilliseconds)}`;
      }
      
      // Highlight fastest and slowest laps
      if (index === fastestIndex && index < lapTimes.length - 1) {
        lapItem.classList.add('fastest');
      } else if (index === slowestIndex && index < lapTimes.length - 1) {
        lapItem.classList.add('slowest');
      }
      
      lapItem.innerHTML = `
        <span class="lap-number">Lap ${lap.number}</span>
        <div>
          <span class="lap-time">${formattedTime}</span>
          ${index > 0 ? `<span class="lap-difference">${differenceText}</span>` : ''}
        </div>
      `;
      
      lapsList.appendChild(lapItem);
    });
  }

  // Toggle button states
  function toggleButtons() {
    startBtn.disabled = isRunning;
    pauseBtn.disabled = !isRunning;
    lapBtn.disabled = !isRunning && elapsedTime === 0;
  }

  // Event listeners
  startBtn.addEventListener('click', startStopwatch);
  pauseBtn.addEventListener('click', pauseStopwatch);
  resetBtn.addEventListener('click', resetStopwatch);
  lapBtn.addEventListener('click', recordLap);

  // Initialize
  toggleButtons();
  renderLaps();
});