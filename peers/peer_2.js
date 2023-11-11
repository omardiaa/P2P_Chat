const offerInput = document.getElementById('offerInput');
const generateAnswerButton = document.getElementById('generateAnswerButton');
const answerValue = document.getElementById('answerValue');
const chatText = document.getElementById('chatText');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

const configration = {
  iceServers: [
    { urls: 'STUN:freeturn.net:3478' },
    { urls: 'TURN:freeturn.net:3478', username: 'free', credential: 'free' }]
}
const connection = new RTCPeerConnection(configration)

const generateAnswer = async() => {
  connection.onicecandidate = e =>  {
    answerValue.textContent = JSON.stringify(connection.localDescription)
    console.log(JSON.stringify(connection.localDescription))
  }

  connection.ondatachannel = e => {
    const dataChannel = e.channel;
    dataChannel.onmessage = e => {
      console.log("->", e.data )
      chatText.innerHTML += `<br>-> ${e.data}`
    }
    dataChannel.onopen = e => connection.channel.send("Connection established with peer 2")
    dataChannel.onclose = e => console.log("Send Channel Closed");
    connection.channel = dataChannel;
  }

  let offer = JSON.parse(offerInput.value);
  console.log("Offer",offer)

  await connection.setRemoteDescription(offer); //Must be before creating answer
  const answer = await connection.createAnswer(); 
  await connection.setLocalDescription(answer);
}

const send = async() => {
  const message = messageInput.value;
  messageInput.value = "";
  connection.channel.send(message);
  chatText.innerHTML += `<br>=> ${message}`;
}

generateAnswerButton.addEventListener('click', generateAnswer);
sendButton.addEventListener('click', send);
