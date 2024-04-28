<script setup>
import { toRefs } from "vue";
const props = defineProps(["list"]);
const { list } = toRefs(props);
const handleDelete = (id) => {
  console.log(id);
};
const handleTop = (id) => {
  console.log(id);
};
</script>
<template>
  <div>
    <van-cell-group :border="false">
      <van-swipe-cell v-for="item in list" :key="item.id">
        <router-link
          :to="{ name: 'chat-detail', query: { id: item.id } }"
          class="to-chat-detail"
        >
          <div class="chat-item-left">
            <van-badge
              :content="item.badge"
              max="99"
              :show-zero="false"
              :dot="item.badge > 0 && item.muted"
              position="top-right"
            >
              <div class="avatar-box">
                <img
                  alt="avatar"
                  v-for="avatar in item.avatars"
                  :key="avatar"
                  :src="avatar"
                  :class="item.avatars.length > 1 ? 'avatar-group' : ''"
                />
              </div>
            </van-badge>
          </div>
          <div class="chat-item-center">
            <span class="username">{{ item.name }}</span>
            <span class="text">{{ item.message }}</span>
          </div>
          <div class="chat-item-right">
            <span class="time">{{ item.time }}</span>
            <van-icon name="volume-o" v-show="item.muted" />
          </div>
        </router-link>
        <template #right>
          <van-button
            square
            type="danger"
            text="删除"
            style="height: inherit"
            @click="handleDelete(item.id)"
          />
          <van-button
            square
            type="primary"
            text="置顶"
            style="height: inherit"
            @click="handleTop(item.id)"
          />
        </template>
      </van-swipe-cell>
    </van-cell-group>
  </div>
</template>

<style scope lang="less">
.van-swipe-cell__wrapper,
.to-chat-detail {
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
  border-bottom: 0.01rem solid var(--van-nav-bar-border-color);
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
  box-sizing: border-box;
  border-radius: 0.3rem;
  float: left;
  background-color: var(--van-nav-bar-background);
}

.avatar-box > .avatar-group {
  width: 1.625rem;
  height: 1.625rem;
  float: left;
  margin: 0.25rem 0;
  border-radius: 0.1rem;
}
.chat-item-center > .username,
.chat-item-center > .text,
.chat-item-right > .time {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  width: inherit;
  display: block;
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
  color: var(--van-text-color-tint);
}
</style>
