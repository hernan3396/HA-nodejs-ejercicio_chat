const client = io.connect("http://localhost:3000/");
let username = "";

const sendMessage = (input, event) => {
  event.preventDefault();
  client.emit("new-message", input.value);
  addMessage(input.value);
  input.value = "";
};

const addMessage = (newMessage) => {
  // const messageParagraph = document.createElement('p');
  // messageParagraph.innerText = `[${username}] ${newMessage}`;
  // document.querySelector('div[data-messages]').appendChild(messageParagraph);

  $("#messages").append(getOutgoingMessageDom({ message: newMessage }));
};

client.on("new-message-ok", (newMessage) => {
  $("#messages").append(getIncomingMessageDom({ message: newMessage }));
});

const setUsername = (input, event) => {
  event.preventDefault();
  username = input.value;
  client.emit("set-username", username);
  input.value = "";
  $("#actual-username").text(username);
};

const getIncomingMessageDom = ({ message }) =>
  `<div class="incoming_msg">
      <div class="incoming_msg_img">
        <img
          src="https://ptetutorials.com/images/user-profile.png"
          alt="sunil"
        />
      </div>
      <div class="received_msg">
        <div class="received_withd_msg">
          <p>${message}</p>
          <span class="time_date"> 11:01 AM | June 9</span>
        </div>
      </div>
    </div>`;

const getOutgoingMessageDom = ({ message }) =>
  `<div class="outgoing_msg">
    <div class="sent_msg">
      <p>${message}</p>
      <span class="time_date"> 11:01 AM | June 9</span>
    </div>
  </div>`;
