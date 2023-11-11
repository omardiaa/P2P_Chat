const generateOfferButton = document.getElementById('generateOfferButton');
const offerValue = document.getElementById('offerValue');
const answerInput = document.getElementById('answerInput');
const connectButton = document.getElementById('connectButton');
const chatText = document.getElementById('chatText');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

const configration = {
  iceServers: [
    { urls: 'STUN:freeturn.net:3478' },
    { urls: 'TURN:freeturn.net:3478', username: 'free', credential: 'free' }]
}

const connection = new RTCPeerConnection(configration)
const dataChannel = connection.createDataChannel("dataChannel");

const generateOffer = async () => {

  connection.onicecandidate = e => {
    offerValue.textContent = JSON.stringify(connection.localDescription)
    console.log(JSON.stringify(connection.localDescription))
  }

  dataChannel.onmessage = e => {
    console.log("Message:", e.data)
    chatText.innerHTML += `<br>-> ${e.data}`
  }
  dataChannel.onopen = e => dataChannel.send("Connection established with peer 1");
  dataChannel.onclose = e => console.log("Send Channel Closed");

  const offer = await connection.createOffer();
  await connection.setLocalDescription(offer);
}

const connect = async () => {
  const answer = JSON.parse(answerInput.value);
  connection.setRemoteDescription(answer).then(res => {
    console.log("Connection Status: ", res)
    console.log('Signaling State:', connection.signalingState);
    console.log('ICE Connection State:', connection.iceConnectionState);
    console.log('ICE Gathering State:', connection.iceGatheringState);
  })
}

const send = async () => {
  const message = messageInput.value;
  messageInput.value = "";
  dataChannel.send(message)
  chatText.innerHTML += `<br>=> ${message}`
}

generateOfferButton.addEventListener('click', generateOffer);
connectButton.addEventListener('click', connect);
sendButton.addEventListener('click', send);