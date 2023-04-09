// DISCORD AUTHENTICATION FLOW 
const AUTH_BTN = document.getElementById('auth_btn_flow');

AUTH_BTN.addEventListener('click', () => {
    chrome.runtime.sendMessage({ message: 'login' }, function (response) {
        if (response === 'success') window.location.replace("./home.html");
    });
});