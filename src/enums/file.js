export const TypeFile = "file";

export const TypeEmoji = "emoji";

export const TypeImage = "image";

export const TypeVideo = "video";

export const TypeAudio = "audio";

export const TypeVideoCall = "video_call";

export const TypeAudioCall = "audio_call";

export const TypeContent = {
  file: "[文件消息]",
  emoji: "[表情消息]",
  image: "[图片消息]",
  video: "[视频消息]",
  audio: "[语音消息]",
  video_call: "[视频通话]",
  audio_call: "[语音通话]"
};

export const UploadMaxSize = {
  file: 5 * 1024 * 1024,
  image: 5 * 1024 * 1024,
  video: 30 * 1024 * 1024,
  audio: 10 * 1024 * 1024,
};
