const usernameInput = document.getElementById('usernameInput');
const connectButton = document.getElementById('connectButton');
const chatText = document.getElementById('chatText');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

const token = localStorage.getItem('token');

const configration = {
    iceServers: [
        { urls: 'STUN:freeturn.net:3478' },
        { urls: 'TURN:freeturn.net:3478', username: 'free', credential: 'free' }]
}

const connection = new RTCPeerConnection(configration)
const dataChannel = connection.createDataChannel("dataChannel");

//Private Functions
const heartbeat = async (token, offer) => {
    let response = await fetch("http://127.0.0.1:3000/heartbeat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: token, offer: offer })
    });
    response = await response.json();
    return response
}

const generateOffer = async () => {
    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
}

const handle_answers = (answers) => {
    let answer = answers[0]
    connection.setRemoteDescription(answer).then(res => {
        connection.ondatachannel = e => {
            const dataChannel2 = e.channel;
            dataChannel2.onmessage = e => {
                add_message_div(e.data, 'right')
            }
            dataChannel2.onopen = e => connection.channel.send("Connection established with peer 2")
            dataChannel2.onclose = e => console.log("Send Channel Closed");
            connection.channel = dataChannel2;
        }
    })
}

const connect = async () => {
    const username = usernameInput.value;

    let response = await fetch("http://127.0.0.1:3000/get_offer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: token, username: username })
    });
    let peer_offer = await response.json();
    peer_offer = JSON.parse(peer_offer['offer'])

    await connection.setRemoteDescription(peer_offer);
    const answer = await connection.createAnswer(); 
    await connection.setLocalDescription(answer);

    response = await fetch("http://127.0.0.1:3000/connect_to_peer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: token, username: username, answer: answer })
    });
    response = await response.json();
    alert("Connection request sent to server");
    return response
}

const send = async () => {
    const message = messageInput.value;
    messageInput.value = "";
    dataChannel.send(message)
    if(connection.channel) connection.channel.send(message)

    add_message_div(message, "left")
}

const handle_enter_click = event => {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        send();
    }
}

const add_message_div = (message, direction) => {
    let chat_container_class_name = "chat-container-right";
    let chat_text_class_name = "chat-text-right";
    if(direction == "left"){
        chat_container_class_name = "chat-container-left"
        chat_text_class_name = "chat-text-left";
    }

    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat-container", chat_container_class_name);

    const chatSpan = document.createElement("span");
    chatSpan.classList.add("chat-text", chat_text_class_name);
    chatSpan.textContent = message;

    chatDiv.appendChild(chatSpan);

    chatText.appendChild(chatDiv);
    chatText.scrollTop = chatText.scrollHeight;
}

//Main Code
let offer;
connection.onicecandidate = e => {
    offer = JSON.stringify(connection.localDescription)
}

setInterval(()=>{
    heartbeat(token, offer).then(res=>{
        if(res['answers'].length>0){
            handle_answers(res['answers'])
        }
    }).catch(err=>{
        console.log(err)
    })
}, 2000)

dataChannel.onmessage = e => {
    add_message_div(e.data, "right")
}
dataChannel.onopen = e => {
    dataChannel.send("Connection established with peer 1");
    messageInput.disabled = false;
}
dataChannel.onclose = e => console.log("Send Channel Closed");

generateOffer();

connectButton.addEventListener('click', connect);
sendButton.addEventListener('click', send);
messageInput.addEventListener('keydown', handle_enter_click)