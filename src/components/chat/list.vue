<script setup>
import { timestampFormat } from "@/utils/helper";
import * as chatApi from "@/api/chat";
const props = defineProps(["list"]);
const emit = defineEmits(["action"]);

const makeData = (item) => {
  return {
    is_group: item.is_group,
    to_user: item.to_user,
  };
};

const handleDelete = (item) => {
  chatApi.putDelete(makeData(item)).then((res) => {
    if (res.code == 200001) {
      emit("action", "delete", res.data);
    }
  });
};

const handleHide = (item) => {
  chatApi.putHide(makeData(item)).then((res) => {
    if (res.code == 200001) {
      emit("action", "hide", res.data);
    }
  });
};

const handleTop = (item, isTop) => {
  let data = makeData(item);
  data.is_top = isTop;
  chatApi.putTop(data).then((res) => {
    if (res.code == 200001) {
      emit("action", "top", res.data);
    }
  });
};
</script>
<template>
  <van-cell-group :border="false">
    <van-swipe-cell
      v-for="item in props.list"
      :key="item.id"
      :class="item.top > 0 ? 'top-active' : ''"
    >
      <router-link
        :to="{
          name: 'chat-message',
          params: {
            to_user: item.to_user,
            is_group: item.is_group,
          },
        }"
        class="to-chat-message"
      >
        <div class="chat-item-left">
          <van-badge
            :content="item.unread"
            max="99"
            :show-zero="false"
            :dot="item.unread > 0 && item.muted"
            position="top-right"
          >
            <div class="avatar-box">
              <img
                alt="avatar"
                v-for="avatar in item.to.avatars"
                :key="avatar"
                :src="avatar"
                :class="item.to.avatars.length > 1 ? 'avatar-group' : ''"
              />
            </div>
          </van-badge>
        </div>
        <div class="chat-item-center">
          <span class="username">{{ item.nickname }}</span>
          <span class="text">{{ item.content }}</span>
        </div>
        <div class="chat-item-right">
          <span class="time">{{ timestampFormat(item.time) }}</span>
          <van-icon name="volume-o" v-show="item.muted" />
        </div>
      </router-link>
      <template #right>
        <van-button
          square
          type="danger"
          text="删除"
          style="height: inherit"
          @click="handleDelete(item)"
        />
        <van-button
          square
          type="warning"
          text="不显示"
          style="height: inherit"
          @click="handleHide(item)"
        />
        <van-button
          square
          type="primary"
          :text="item.top > 0 ? '取消置顶' : '置顶'"
          style="height: inherit"
          @click="handleTop(item, item.top > 0 ? 0 : 1)"
        />
      </template>
    </van-swipe-cell>
  </van-cell-group>
</template>

<style scope lang="less">
.top-active {
  background: var(--van-nav-bar-background);
}

.van-swipe-cell__wrapper,
.to-chat-message {
  display: flex;
  width: 100%;
  color: var(--van-text-color);
}

.chat-item-right,
.chat-item-center,
.chat-item-left {
  padding: 0.8rem 0 0.8rem 1.4rem;
}
.chat-item-center,
.chat-item-right {
  height: inherit;
  box-sizing: border-box;
  border-bottom: 1px solid var(--van-cell-border-color);
}
.chat-item-center {
  flex-grow: 2;
}
.chat-item-left {
  position: relative;
}

.avatar-box > img {
  width: 4rem;
  height: 4rem;
  border-radius: 0.3rem;
}

.avatar-box {
  width: 4rem;
  height: 4rem;
  border-radius: 0.3rem;
  background-color: var(--van-nav-bar-background);
}

.avatar-box > .avatar-group {
  width: 1.625rem;
  height: 1.625rem;
  float: left;
  margin: 0.25rem 0 0 0.25rem;
  border-radius: 0.1rem;
}
.chat-item-center > .username,
.chat-item-center > .text,
.chat-item-right > .time {
  display: block;
}
.chat-item-center > .text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  width: 10rem;
}

.chat-item-center > .username {
  font-size: 1.2rem;
  margin-top: 0.2rem;
  margin-bottom: 0.8rem;
}

.chat-item-center > .text {
  font-size: 0.9rem;
}

.chat-item-right {
  font-size: 0.8rem;
  padding-right: 1.4rem;
  text-align: right;
}
.chat-item-right > .time {
  margin-top: 0.2rem;
  margin-bottom: 2rem;
}

.chat-item-center > .text,
.chat-item-right {
  color: var(--theme-text-color-tint);
}
</style>
