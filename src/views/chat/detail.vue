<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import "emoji-picker-element";
import { useFriendStore } from "@/stores/friend";
const router = useRouter();
const friendStore = useFriendStore();
const popupMoreBottom = ref(false);
const popupEmojiBottom = ref(false);
const message = ref("");
const input = ref(null);
const messageList = ref([]);

const onClickRight = (e) => {
  console.log(e);
  router.push({
    path: "/chat/setting",
    query: {
      id: 1,
    },
  });
};
const handleMoreClick = (e) => {
  if (popupEmojiBottom.value) {
    popupEmojiBottom.value = false;
    setTimeout(() => {
      popupMoreBottom.value = !popupMoreBottom.value;
    }, 200);
  } else {
    popupMoreBottom.value = !popupMoreBottom.value;
  }
};
const handleEmojiClick = (e) => {
  if (popupMoreBottom.value) {
    popupMoreBottom.value = false;
    setTimeout(() => {
      popupEmojiBottom.value = !popupEmojiBottom.value;
    }, 200);
  } else {
    popupEmojiBottom.value = !popupEmojiBottom.value;
  }
};
const onSelectEmoji = (emoji) => {
  console.log(emoji);
  message.value += emoji.detail.unicode;
  input.value.focus();
  console.log(input);
};

const sendMessage = () => {
  if (message.value) {
    console.log(message.value);
    messageList.value.push({
      id: Math.random(9999),
      avatar: "https://img.yzcdn.cn/vant/cat.jpeg",
      name: "Vant",
      message: message.value,
      right: Math.random(1) > 0.5 ? true : false,
    });
    message.value = "";
  }
};

const onClickAvatar = (id) => {
  router.push({
    path: "/friend/info",
    query: {
      id: id,
    },
  });
};
</script>
<template>
  <header>
    <van-nav-bar
      :title="friendStore.info.final_nickname"
      left-arrow
      @click-left="router.go(-1)"
      @click-right="onClickRight"
      style="
        box-sizing: border-box;
        border-bottom: 0.1rem solid var(--van-nav-bar-border-color);
      "
    >
      <template #right>
        <van-icon name="ellipsis" size="20" color="#191919" />
      </template>
    </van-nav-bar>
  </header>
  <main class="main">
    <ul class="message-list">
      <li v-for="item in messageList" :key="item.id">
        <p :class="item.right ? 'nickname right' : 'nickname'">
          {{ item.name }}
        </p>
        <article :class="item.right ? 'right' : ''">
          <div class="avatar">
            <img
              alt="avatar"
              :src="item.avatar"
              @click="onClickAvatar(item.id)"
            />
          </div>
          <div class="msg">
            <div class="tri"></div>
            <div class="msg_inner">{{ item.message }}</div>
          </div>
        </article>
      </li>
    </ul>
  </main>
  <footer>
    <div class="send-msg-box">
      <div class="send-msg-top">
        <div class="left">
          <van-icon name="volume-o" />
        </div>
        <input
          type="text"
          v-model="message"
          @keyup.enter="sendMessage"
          ref="input"
        />
        <div class="right">
          <van-icon name="smile-o" @click="handleEmojiClick" />
          <van-icon name="add-o" @click="handleMoreClick" />
        </div>
      </div>
      <div
        :class="
          popupMoreBottom ? 'more-bottom more-bottom-popup' : 'more-bottom'
        "
      >
        <van-grid :column-num="4" style="width: inherit" gutter="1rem">
          <van-grid-item
            v-for="value in 6"
            :key="value"
            icon="photo-o"
            text="文字"
            style="border-radius: 2rem"
          />
        </van-grid>
      </div>
      <emoji-picker
        :class="
          popupEmojiBottom ? 'emoji-bottom emoji-bottom-popup' : 'emoji-bottom'
        "
        @emojiClick="onSelectEmoji"
      />
    </div>
  </footer>
</template>
<style scoped lang="less">
.send-msg-box {
  width: 100%;
  position: fixed;
  z-index: 999;
  bottom: 0;
  > div {
    width: inherit;
    padding: 1rem 0;
    background-color: #f6f6f6;
    display: flex;
    border-top: 1px solid var(--van-nav-bar-border-color);
  }
  > .send-msg-top {
    border-top: none;
    > input {
      background-color: var(--van-white);
      border: none;
      outline: none;
      min-height: 2rem;
      height: auto;
      width: 75%;
      border-radius: 0.2rem;
    }
    > .left,
    > .right {
      height: inherit;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    > .left {
      width: 10%;
    }
    > .right {
      width: 15%;
      justify-content: space-evenly;
    }
  }
  > .more-bottom,
  > .emoji-bottom {
    padding: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-in-out;
  }
  > .more-bottom-popup,
  > .emoji-bottom-popup {
    max-height: 18rem;
  }
  > .more-bottom-popup {
    padding: 1rem 0;
  }
}
.main {
  background-image: url(/src/assets/bg.png);
  background-position: center;
  background-size: cover;
  overflow-y: scroll;
  flex-grow: 2;
  padding: 0;
  .message-list {
    padding: 0 1rem;
    > li {
      display: block;
    }
    > li > p.nickname {
      color: var(--theme-text-color-tint);
      font-size: 12px;
      line-height: 12px;
    }
    > li > p.right {
      text-align: right;
    }
    > li > article {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 0.5rem;
      > .avatar {
        margin-right: 0.7rem;
        > img {
          width: 3rem;
          height: 3rem;
          border-radius: 0.2rem;
        }
      }
      > .msg {
        display: flex;
        justify-content: space-between;
        > .tri {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 0.8rem 1rem 0;
          border-color: transparent #ffffff transparent transparent;
        }
        > .msg_inner {
          background-color: #fff;
          width: 100%;
          padding: 1rem 0.7rem;
          border-radius: 0 0.2rem 0.2rem 0.2rem;
          box-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
          text-align: left;
        }
      }
    }

    > li > article.right {
      flex-direction: row-reverse;
      > .avatar {
        margin-right: 0px;
        margin-left: 0.7rem;
      }
      > .msg {
        flex-direction: row-reverse;
        > .tri {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 1rem 0.7rem 0 0;
          border-color: #98e865 transparent transparent transparent;
        }

        > .msg_inner {
          border-radius: 0.2rem 0 0.2rem 0.2rem;
          text-align: right;
          background-color: #98e865;
        }
      }
    }

    > li > article.center {
      display: flex;
      justify-content: center;
      > .tips {
        background: #ccc;
        opacity: 0.5;
        color: #222;
        font-size: 10px;
        padding: 3px 8px;
        max-width: 80%;
        word-wrap: break-word;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
emoji-picker {
  width: inherit;
  height: 18rem;
  --background: #f6f6f6;
}
</style>
