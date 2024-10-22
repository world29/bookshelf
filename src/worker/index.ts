console.log("hello worker");

window.workerAPI.handleSendMessage((_e, text) =>
  console.log(`message received: ${text}`)
);

window.workerAPI.doThing();
