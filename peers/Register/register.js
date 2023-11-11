const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const registerButton = document.getElementById('registerButton');
const statusText = document.getElementById('statusText');

const register = async() =>  {
    username = usernameInput.value
    password = passwordInput.value
    password = await generateHash(password)

    fetch("http://127.0.0.1:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: username, password: password})
    })
    .then(response => {
        if(!response.ok){
            throw new Error('User already exists')
        }else{
            return response.json()
        }
    })
    .then(data => {
        alert('User registered successfully')
        localStorage.setItem('username', username)
        localStorage.setItem('token', data.token)
        window.location.href = '../Login/login.html';
    })
    .catch(error => {
        alert(error);
    });
}

const generateHash = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

registerButton.addEventListener('click', register);