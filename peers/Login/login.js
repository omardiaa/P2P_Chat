const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const statusText = document.getElementById('statusText');

const login = async() =>  {
    username = usernameInput.value
    password = passwordInput.value
    password = await generateHash(password)

    fetch("http://127.0.0.1:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: username, password: password})
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Login failed')
        }else{
            return response.json() 
        }
    })
    .then(data => {
        localStorage.setItem('username', username)
        localStorage.setItem('token', data.token)
        window.location.href = '../index.html';
    })
    .catch(error => {
        alert(error);
    });
}

const generateHash = async (password) => {
    const encoder = new TextEncoder();generateHash
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

loginButton.addEventListener('click', login);