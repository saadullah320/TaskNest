document.addEventListener('DOMContentLoaded', function () {
    let timeout = null;

    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.addEventListener('input', function () {
            clearTimeout(timeout);

            const username = this.value;

            // Wait 500ms after user stops typing
            timeout = setTimeout(() => {
                if (username.length > 2) {
                    checkUsernameAvailability(username);
                } else {
                    document.getElementById('username-status').textContent = '';
                }
            }, 500);
        });
    }
});

function checkUsernameAvailability(username) {
    fetch(`/api/check-username?username=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            const statusEl = document.getElementById('username-status');
            if (data.available) {
                statusEl.textContent = "✅";
                statusEl.style.color = "green";
                statusEl.setAttribute("data-tooltip", "Username is available");
            } else {
                statusEl.textContent = "❌";
                statusEl.style.color = "red";
                statusEl.setAttribute("data-tooltip", "Username is already taken");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}