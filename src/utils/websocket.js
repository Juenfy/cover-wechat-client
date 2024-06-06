const url = "ws://127.0.0.1:1236";
if ("WebSocket" in window) {
  console.log("当前浏览器支持 WebSocket");
} else if ("MozWebSocket" in window) {
  console.log("当前浏览器支持 MozWebSocket");
} else {
  console.log("当前浏览器不支持 WebSocket");
}

const websocket = new WebSocket(url);

export default websocket;
