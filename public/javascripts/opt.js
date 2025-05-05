const otpInputs = document.querySelectorAll('.otp-input input');
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        if (input.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      });
    });

const form = document.getElementById('otpForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const otp = Array.from(otpInputs).map(i => i.value).join('');
  const email = document.getElementById('email').value;

  const response = await fetch('/api/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  
  const data = await response.json();
  console.log(data);
  message.style.color = response.ok ? 'green' : 'red';
  message.textContent = data.message || data.error;

  if (data.redirect) {
    window.location.href = data.redirect;
  }

});

let countdownTimer; // Declare the timer variable globally

const timer = () => {
  let timeLeft = 60;
  const div = document.getElementById('countdown-div');
  div.classList.add('retrying');
  const countdownEl = document.getElementById('countdown');
  const countdownText = document.getElementById('countdown-text');
  countdownText.removeAttribute('hidden');
  countdownEl.removeAttribute('hidden');

  // Clear any existing timer before starting a new one
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }

  // Update the countdown every second
  countdownTimer = setInterval(() => {
    timeLeft--;
    countdownEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdownTimer);
    }
  }, 1000);
  countdownEl.getAttribute('hidden');
};

const resendLink = document.getElementById("resendLink");
resendLink.addEventListener("click", async (e) => {
  e.preventDefault(); // Prevent the default link behavior
  resendLink.classList.add("disabled");
  timer();
  setTimeout(() => {
    const div = document.getElementById('countdown-div');
    div.classList.remove('retrying');
    const countdownEl = document.getElementById('countdown');
    countdownEl.setAttribute('hidden', '');
    const countdownText = document.getElementById('countdown-text');
  countdownText.setAttribute('hidden', '');
    resendLink.classList.remove("disabled");
  }, 60001);
  
  const response = await fetch('/api/resend-otp');
  const data = await response.json();

  const message = document.getElementById('message');
  message.style.color = 'green';
  message.textContent = data.message || data.error;
});
