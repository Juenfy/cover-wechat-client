<!--聊天设置页面-->
<script setup>
import ChatGroupAction from "@/components/chat/group/action.vue";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import { SearchChatRecord } from "@/enums/app";
import ChatBackground from "@/components/common/background.vue";
import * as chatApi from "@/api/chat";
import * as messageApi from "@/api/message";
import { showDialog } from 'vant';
import GroupUpdate from "@/components/chat/group/update.vue";
import { setCaller } from "@/utils/call";
import {atMessageIdList, imagePreviewList, messageList} from "@/utils/chat";

const router = useRouter();
const showClearChat = ref(false);
const showChatBackground = ref(false);
const showChatGroupInvite = ref(false);
const showChatGroupUpdate = ref(false);
const clearChatActions = [
  { name: "清空聊天记录", color: "red", value: "clear" }
];
const chatGroupUpdateField = ref("");
const appStore = useAppStore();
const props = defineProps({ show: Boolean, info: Object });
const chatInfo = ref({});
//调用父组件关闭弹窗
const emit = defineEmits(["hide"]);

const onSearchChatRecordClick = () => {
  appStore.setShowCommonSearch(true);
  appStore.initCommonSearch({
    action: SearchChatRecord,
    placeholder: "搜索",
  });
};

watch(
  () => props.info,
  (info) => {
    chatInfo.value = info;
    setCaller(info?.users[0] ?? []);
  }
);

const updateTop = (value) => {
  updateChatInfo(value, "top");
};

const updateMuted = (value) => {
  updateChatInfo(value, "muted");
};

const updateDisplayNickname = (value) => {
  updateChatInfo(value, "display_nickname");
};

const updateGroupInfo = (field) => {
  if (!['admin', 'super'].includes(chatInfo.value.role) && field == 'group_name') {
    return showDialog({
      message: '当前群聊仅群主、群管理员可修改群聊名称',
      confirmButtonText: '我知道了',
    })
  }
  chatGroupUpdateField.value = field;
  showChatGroupUpdate.value = true;
};

const updateChatInfo = (value, key) => {
  console.log(value, key);
  let data = {
    is_group: chatInfo.value.is_group,
    to_user: chatInfo.value.to_user,
  };
  data[key] = value;
  console.log(data);
  chatApi.putUpdate(data).then((res) => {
    console.log(res);
  });
};

//清空聊天记录菜单选中
const onSelectClearChatAction = (action) => {
  console.log(action);
  messageApi.clear({
    is_group: chatInfo.value.is_group,
    to_user: chatInfo.value.to_user,
  }).then(res => {
    if (res.code == 200001) {
      messageList.value = [];
      atMessageIdList.value = [];
      imagePreviewList.value = [];
      emit("hide");
    }
  });
};

onMounted(() => { });
</script>

<template>
  <van-popup v-model:show="props.show" position="right" :style="{ height: '100%', width: '100%' }" duration="0.2">
    <header>
      <van-nav-bar title="聊天详情" left-arrow @click-left="$emit('hide')" :border="false" />
    </header>
    <section class="bg-nav">
      <div class="header"></div>
      <div class="container chat-info-container">
        <van-cell-group style="padding-top: 0.8rem">
          <van-grid :column-num="5" icon-size="3rem" :border="false" :square="true">
            <van-grid-item :icon="item.avatar" :to="'/friend/info?keywords=' + item.wechat"
              v-for="item in chatInfo.users" :key="item.id" :text="item.nickname"/>
            <van-grid-item icon="/add.png" clickable @click="showChatGroupInvite = true" />
          </van-grid>
        </van-cell-group>
        <van-cell-group v-if="chatInfo.is_group == 1">
          <van-cell title="群聊名称" is-link clickable size="large" :value="chatInfo.group_name"
            @click="updateGroupInfo('group_name')" />
          <van-cell title="群二维码" is-link clickable size="large" :value="chatInfo.group_name" />
          <van-cell title="群公告" is-link clickable size="large"
            :value="chatInfo.group.notice ? chatInfo.group.notice : '未设置'" />
          <van-cell title="备注" is-link clickable size="large" :value="chatInfo.group.name"
            @click="updateGroupInfo('group_nickname')" />
        </van-cell-group>

        <van-cell-group>
          <van-cell title="查找聊天内容" is-link clickable @click="onSearchChatRecordClick" size="large" />
        </van-cell-group>
        <van-cell-group>
          <van-cell title="消息免打扰" size="large">
            <template #right-icon>
              <van-switch v-model="chatInfo.muted" @update:model-value="updateMuted" />
            </template>
          </van-cell>
          <van-cell title="置顶聊天" size="large">
            <template #right-icon>
              <van-switch v-model="chatInfo.top" @update:model-value="updateTop" />
            </template>
          </van-cell>
          <!-- <van-cell title="提醒" size="large">
          <template #right-icon>
            <van-switch v-model="chatInfo.remind" @update:model-value="updateRemind"/>
          </template>
        </van-cell> -->
        </van-cell-group>
        <van-cell-group v-if="chatInfo.is_group == 1">
          <van-cell title="我在本群的昵称" is-link clickable size="large" :value="chatInfo.group.nickname"
            @click="updateGroupInfo('nickname')" />
          <van-cell title="显示群成员昵称" size="large">
            <template #right-icon>
              <van-switch v-model="chatInfo.display_nickname" @update:model-value="updateDisplayNickname" />
            </template>
          </van-cell>
        </van-cell-group>
        <van-cell-group>
          <van-cell title="设置当前聊天背景" is-link clickable @click="showChatBackground = true" size="large" />
        </van-cell-group>
        <van-cell-group>
          <van-cell title="清除聊天记录" clickable size="large" @click="showClearChat = true" />
        </van-cell-group>
        <van-action-sheet v-model:show="showClearChat" :actions="clearChatActions" @select="onSelectClearChatAction"
          cancel-text="取消" close-on-click-action />
      </div>
    </section>
  </van-popup>
  <chat-background :show="showChatBackground" @hide="showChatBackground = false" :info="chatInfo" type="chat"
    title="聊天背景" />
  <chat-group-action :show="showChatGroupInvite" @hide="showChatGroupInvite = false" action="invite"
    :users="chatInfo.users" :groupId="chatInfo.to_user" />
  <group-update :show="showChatGroupUpdate" @hide="showChatGroupUpdate = false" :chatInfo="chatInfo"
    :updateField="chatGroupUpdateField" />
</template>
<style lang="less">
.chat-info-container {
  .van-cell-group {
    .van-icon__image {
      border-radius: 0.3rem;
    }
    .van-grid-item__text {
      white-space: nowrap;
      margin-top: 4px;
    }
  }
}
</style>
