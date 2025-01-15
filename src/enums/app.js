export const SearchFriend = "search-friend";

export const CreateGroup = "create-group";

export const QrcodeScan = "qrcode-scan";

export const SearchChatRecord = "search-chat-record";

export const SearchGroup = "search-group";

export const SearchOnlyChatFriend = "search-only-chat-friend";

export const Home = "home";

export const HomeActions = [
  { text: "发起群聊", value: CreateGroup },
  { text: "添加朋友", value: SearchFriend },
  { text: "扫一扫", value: QrcodeScan },
];

export const UnreadChat = "unread-chat";
export const UnreadApply = "unread-apply";
export const UnreadMoment = "unread-moment";
export const Unread = [UnreadChat, UnreadApply, UnreadMoment];

/* 主题图标 */
export const ThemeIcon = {
  light: {
    emoji: "/emoji.png",
    audio: "/audio.png",
    more: "/more.png",
    keyboard: "/keyboard.png",
    call: "/call.png",
    red_packet: "/red-packet.png"
  },
  dark: {
    emoji: "/emoji-white.png",
    audio: "/audio-white.png",
    more: "/more-white.png",
    keyboard: "/keyboard-white.png",
    call: "/call-white.png",
    red_packet: "/red-packet-white.png"
  }
}

/* 系统音效 */
export const SystemAudio = {
  chat: {
    audio: "/audio/notification/chat/audio.mp3",
    msg: "/audio/notification/chat/msg.mp3"
  },
  call: {
    start: "/audio/notification/call/start.mp3",
    end: "/audio/notification/call/end.mp3"
  }
}
