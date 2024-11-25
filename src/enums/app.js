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
