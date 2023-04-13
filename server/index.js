import WebSocket, { WebSocketServer } from 'ws'
import words from './words.js'

const nthWord = Math.floor(Math.random() * 1669);

let userList = [];
const currentWord = words[nthWord].toLocaleLowerCase("TR-tr");

const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
  }
});

wss.on('listening', () => {
  console.log("WSS Started!")
})

wss.on('connection', function connection(ws) {
  let username;
  console.log("new connection!")
  ws.on('error', console.error);

  ws.on('close', () => {
    userList = userList.filter(u => u.username !== username)
    broadcastUserList()
  })

  ws.on('message', function message(rawData) {
    console.log('received: %s', rawData)
    const data = JSON.parse(rawData)
    
    if (data.type == "CONNECT") {
      console.log("New user connected!", data.payload)
      username = data.payload
      userList.push({
        username,
        leftTrial: 5,
        points: 0,
        ws
      })
      ws.send(JSON.stringify({type: "CONNECT_SUCCESS"}))
      broadcastUserList()
      ws.send(JSON.stringify({type: "CORRECT_ANSWER", payload: currentWord}))
    }
    if (data.type == "USER_SUBMIT") {
      handleUserSubmit(ws, username, data.payload)
    }
  });
});

function handleUserSubmit(ws, username, payload) {
  const resp = []
  for (let index = 0; index < payload.length; index++) {
    const char = payload.charAt(index)
    resp.push(currentWord.charAt(index) == char ? 'CL' : currentWord.includes(char) ? 'WL' : 'NI')
  }
  ws.send(JSON.stringify({type: "SUBMIT_RESPONSE", payload: resp}))
  if (payload === currentWord) {
    userList.filter(user => user.username === username)[0].points++
    broadcastUserList()
  }
}

function broadcastUserList() {
  let usersInfo = userList.map(u => ({username: u.username, point: u.points}))
  userList.forEach(u => {
    u.ws.send(JSON.stringify({type: "USER_LIST", payload: usersInfo}))
  })
}