import { ActionCall } from "@/enums/message";
import emitter from "@/utils/emitter";
let ws = null;
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.websocket = null;
  }

  start(uid) {
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
      this.websocket.onopen = (e) => {
        console.log("连接成功", e);
        //登录成功 绑定uid
        const data = {
          who: "user",
          action: "login",
          data: { uid: uid },
        };
        this.send(data);
      };
      this.websocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        // console.log("收到消息", data);
        if (data.action === ActionCall) {
          emitter.emit("onCallMessage", data);
        } else {
          emitter.emit("onMessage", data);
        }
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
if (ws == null)
  ws = new WebSocketClient(import.meta.env.VITE_APP_WEBSOCKET);
export default ws;

