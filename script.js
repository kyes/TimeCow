document.addEventListener('DOMContentLoaded', () => {
    const monthlySalaryInput = document.getElementById('monthlySalary');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    const inputError = document.getElementById('inputError');

    const resultsSection = document.getElementById('results-section');
    const earningSpeedSpan = document.getElementById('earningSpeed');
    const accumulatedEarningsSpan = document.getElementById('accumulatedEarnings');
    const startTimeDisplay = document.getElementById('startTimeDisplay');
    const workingDaysInfo = document.getElementById('workingDaysInfo');

    const moneyAnimationContainer = document.getElementById('money-animation-container');
    const moneySymbols = ['💰', '🧧', '💸', '💵', '🪙'];

    let monthlySalary = 0;
    let earningSpeedPerMinute = 0;
    let calculationStartTime;
    let accumulatedIntervalId;
    let currentWorkingDays = 0;
    let animationTriggerCounter = 0; // Counter for triggering animation every minute

    function getWorkingDaysInCurrentMonth() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); // 0-indexed
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let workingDays = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const dayOfWeek = currentDate.getDay(); // 0 for Sunday, 6 for Saturday
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday and Saturday
                workingDays++;
            }
        }
        currentWorkingDays = workingDays;
        workingDaysInfo.textContent = `本月 (${year}年${month + 1}月) 预计工作日: ${workingDays} 天 (按每周5天计算)`;
        return workingDays;
    }

    function formatCurrency(amount) {
        return amount.toFixed(2);
    }

    function showInputError(message) {
        inputError.textContent = message;
    }

    function clearInputError() {
        inputError.textContent = '';
    }

    function startCalculation() {
        clearInputError();
        const salaryText = monthlySalaryInput.value;

        if (!salaryText) {
            showInputError('请输入月工资。');
            return;
        }

        const salary = parseFloat(salaryText);

        if (isNaN(salary) || salary <= 0) {
            showInputError('月工资必须为大于0的数字。');
            monthlySalaryInput.value = '';
            return;
        }

        monthlySalary = salary;
        const workingDays = getWorkingDaysInCurrentMonth();

        if (workingDays === 0) {
            showInputError('无法计算当月工作日数。');
            return;
        }

        earningSpeedPerMinute = monthlySalary / (workingDays * 8 * 60);
        earningSpeedSpan.textContent = formatCurrency(earningSpeedPerMinute);

        calculationStartTime = new Date();
        startTimeDisplay.textContent = calculationStartTime.toLocaleTimeString('zh-CN');

        resultsSection.style.display = 'block';
        resetButton.style.display = 'inline-block';
        startButton.style.display = 'none';
        monthlySalaryInput.disabled = true;

        animationTriggerCounter = 0; // Reset counter when calculation starts

        updateAccumulatedEarnings(); // Initial call
        if (accumulatedIntervalId) clearInterval(accumulatedIntervalId);
        accumulatedIntervalId = setInterval(updateAccumulatedEarnings, 1000); // Update display every second
    }

    function updateAccumulatedEarnings() {
        const now = new Date();
        const diffInMilliseconds = now - calculationStartTime;
        const diffInSeconds = diffInMilliseconds / 1000;

        const earningSpeedPerSecond = earningSpeedPerMinute / 60;
        const accumulated = diffInSeconds * earningSpeedPerSecond;

        accumulatedEarningsSpan.textContent = formatCurrency(accumulated);

        animationTriggerCounter++; // Increment counter every second
        if (animationTriggerCounter >= 60) { // 60 seconds = 1 minute
            if (accumulated > 0) { // Only animate if earning
                 triggerMoneyAnimation();
            }
            animationTriggerCounter = 0; // Reset counter
        }
    }

    // Keep all other functions and variables from your previous script.js
// ... (DOMContentLoaded, selectors, getWorkingDaysInCurrentMonth, formatCurrency, etc.) ...

// --- REPLACE THE OLD triggerMoneyAnimation FUNCTION WITH THIS NEW ONE ---
function triggerMoneyAnimation() {
    const numberOfCoins = Math.floor(Math.random() * 15) + 20; // Generate 20-34 coins
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight / 2;
    const coinSymbols = ['🪙', '💰', '✨']; // Using coin and a sparkle for variety

    for (let i = 0; i < numberOfCoins; i++) {
        const coinElement = document.createElement('div');
        coinElement.classList.add('money-item');
        coinElement.textContent = coinSymbols[Math.floor(Math.random() * coinSymbols.length)];
        coinElement.style.fontSize = `${Math.random() * 15 + 15}px`; // Random size: 15px to 30px
        
        // Set initial position at the center of the screen for the animation's origin
        coinElement.style.left = `${originX}px`;
        coinElement.style.top = `${originY}px`;
        // Gold-like colors
        coinElement.style.color = `hsl(${Math.random() * 15 + 40}, 90%, ${Math.random() * 20 + 55}%)`; // Shades of gold/yellow

        moneyAnimationContainer.appendChild(coinElement);

        const angle = Math.random() * Math.PI * 2; // Random angle in all directions (0 to 2PI radians)
        // Fly out distance - ensure it goes towards or off the edges
        const flyOutRadius = Math.max(window.innerWidth, window.innerHeight) * (Math.random() * 0.3 + 0.6); // 60% to 90% of max dimension

        const finalX = Math.cos(angle) * flyOutRadius;
        const finalY = Math.sin(angle) * flyOutRadius;

        const duration = Math.random() * 1500 + 1000; // Animation duration: 1s to 2.5s
        const initialScale = Math.random() * 0.4 + 0.2; // Start smaller: 0.2 to 0.6
        const peakScale = Math.random() * 0.5 + 1.0;    // Peak scale during flight: 1.0 to 1.5 (makes it "pop")
        const endScale = Math.random() * 0.3 + 0.1;     // End smaller as it fades: 0.1 to 0.4

        const animation = coinElement.animate([
            { // Initial state (at origin, small, visible)
                transform: `translate(-50%, -50%) scale(${initialScale}) rotate(0deg)`,
                opacity: 1,
                offset: 0 // Start
            },
            { // Mid-flight (moving out, reaches peak scale, slightly rotating)
                transform: `translate(calc(-50% + ${finalX * 0.5}px), calc(-50% + ${finalY * 0.5}px)) scale(${peakScale}) rotate(${Math.random() * 360 - 180}deg)`,
                opacity: 0.9,
                offset: 0.3 + Math.random() * 0.3 // Mid-point varies (30% to 60% of duration)
            },
            { // Final state (at destination, smaller, faded out, more rotation)
                transform: `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px)) scale(${endScale}) rotate(${Math.random() * 720 - 360}deg)`,
                opacity: 0,
                offset: 1 // End
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.15, 0.5, 0.5, 1)', // Smoother ease-out curve
            fill: 'forwards' // Keep final state
        });

        // Clean up the element after the animation finishes
        animation.onfinish = () => {
            if (coinElement) {
                coinElement.remove();
            }
        };
    }
}
// --- END OF REPLACEMENT ---

// ... (rest of your script.js like startCalculation, updateAccumulatedEarnings, resetAll, event listeners etc. remains THE SAME)


    function resetAll() {
        if (accumulatedIntervalId) {
            clearInterval(accumulatedIntervalId);
            accumulatedIntervalId = null;
        }

        monthlySalaryInput.value = '';
        monthlySalaryInput.disabled = false;
        clearInputError();

        resultsSection.style.display = 'none';
        earningSpeedSpan.textContent = '0.00';
        accumulatedEarningsSpan.textContent = '0.00';
        startTimeDisplay.textContent = '';
        // workingDaysInfo.textContent = ''; // Let it stay or be updated by getWorkingDays

        resetButton.style.display = 'none';
        startButton.style.display = 'inline-block';

        animationTriggerCounter = 0; // Reset animation counter

        while (moneyAnimationContainer.firstChild) {
            moneyAnimationContainer.removeChild(moneyAnimationContainer.firstChild);
        }
        getWorkingDaysInCurrentMonth(); // Update working days info
        workingDaysInfo.textContent = '输入月工资后点击“开始计算”查看您的赚钱动态。';
    }

    // Event Listeners
    startButton.addEventListener('click', startCalculation);
    monthlySalaryInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            startCalculation();
        }
    });

    resetButton.addEventListener('click', resetAll);

    // Initial setup
    resetAll();
});