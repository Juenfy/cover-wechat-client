export class WebSocketClient {
  constructor(url, emitter) {
    this.url = url;
    this.emitter = emitter;
    this.websocket = null;
  }

  start(cb) {
    console.log(this.emitter);
    if ("WebSocket" in window) {
      console.log("当前浏览器支持 WebSocket");
      this.websocket = new WebSocket(this.url);
    } else if ("MozWebSocket" in window) {
      console.log("当前浏览器支持 MozWebSocket");
      this.websocket = new MozWebSocket(this.url);
    } else {
      alert("当前浏览器不支持 WebSocket");
    }
    if (this.websocket) {
      this.websocket.onopen = cb;
      this.websocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log("收到消息", data);
        this.emitter.emit("onMessage", data);
      };

      this.websocket.onclose = (e) => {
        console.log("连接关闭", e);
      };
    }
  }

  stop() {
    if (this.websocket) {
      this.websocket.close();
    }
  }

  send(data) {
    if (this.websocket) {
      data = typeof data == "object" ? JSON.stringify(data) : data;
      console.log("发送消息", data);
      this.websocket.send(data);
    }
  }
}

export const startWebSocket = async (WebSocketClient, uid) => {
  WebSocketClient.start((e) => {
    console.log("连接成功", e);
    //登录成功 连接websocket
    const data = {
      who: "user",
      action: "login",
      data: { uid: uid },
    };
    WebSocketClient.send(data);
  });
};

