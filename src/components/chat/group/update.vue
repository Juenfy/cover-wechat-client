<script setup>
import { watch, ref } from "vue";
import { chatInfo, getChatInfo } from "@/utils/websocket";
import * as chatApi from "@/api/chat";
//调用父组件关闭弹窗
const emit = defineEmits(["hide"]);
const props = defineProps({
  show: Boolean,
  chatInfo: Object,
  updateField: String,
});

const text = {
  group_name: {
    h1: "修改群聊名称",
    h4: "修改群聊名称后，将在群内通知其他成员。",
    ph: ""
  },
  group_nickname: {
    h1: "备注",
    h4: "群聊的备注仅自己可见",
    ph: "备注"
  },
  nickname: {
    h1: "我在群里的昵称",
    h4: "昵称修改后，只会在此群内显示，群内成员都可以看见你。",
    ph: ""
  }
}

const users = ref([]);
const updateValue = ref("");
const originValue = ref("");
watch(() => props.show, (show) => {
  if (show) {
    switch (props.updateField) {
      case 'group_name':
        updateValue.value = props.chatInfo.group_name;
        break;
      case 'group_nickname':
        updateValue.value = props.chatInfo.group.name;
        break;
      case 'nickname':
        updateValue.value = props.chatInfo.group.nickname;
    }
    originValue.value = updateValue.value;
    if (['group_name', 'group_nickname'].includes(props.updateField)) {
      if (props.chatInfo.users.length > 4) {
        users.value = props.chatInfo.users.slice(0, 4);
      } else {
        users.value = props.chatInfo.users;
      }
    } else {
      users.value = props.chatInfo.users.filter(user => {
        return user.id == props.chatInfo.from_user;
      });
    }
  }
});

const onSubmit = () => {
  let params = {
    to_user: props.chatInfo.to_user,
    is_group: props.chatInfo.is_group
  }
  switch (props.updateField) {
    case 'group_name':
      params.group_name = updateValue.value;
      break;
    case 'group_nickname':
      params.name = updateValue.value;
      break;
    case 'nickname':
      params.nickname = updateValue.value;
      break;
  }

  chatApi.putUpdate(params).then((res) => {
    if (res.code == 200001) {
      const queryData = {
        to_user: props.chatInfo.to_user,
        is_group: props.chatInfo.is_group
      }
      getChatInfo(queryData, (res) => {
        if (res.code == 200001) {
          emit('hide');
        }
      });
    }
  });
};
</script>
<template>
  <van-popup v-model:show="props.show" position="right" :style="{ height: '100%', width: '100%' }" duration="0.2">
    <header>
      <van-nav-bar left-arrow @click-left="$emit('hide')" :border="false" class="bg-white" />
    </header>
    <section>
      <div class="header">
      </div>
      <div class="container bg-white group-update">
        <h1>{{ text[props.updateField].h1 }}</h1>
        <h4>{{ text[props.updateField].h4 }}</h4>
        <van-cell-group>
          <van-cell>
            <template #icon>
              <div class="avatar-box">
                <img alt="avatar" v-for="user in users" :key="user.id" :src="user.avatar"
                  :class="props.updateField == 'nickname' ? '' : 'avatar-group'" />
              </div>
            </template>
            <template #title>
              <van-field v-model="updateValue" :placeholder="text[props.updateField].ph" />
            </template>
          </van-cell>
        </van-cell-group>
        <van-button type="primary" style="margin-top: 10rem;width: 10rem;"
          :disabled="updateValue.length <= 0 || updateValue === originValue" @click="onSubmit">确定</van-button>
      </div>
    </section>
  </van-popup>
</template>
<style scoped lang="less">
.group-update {
  text-align: center;
  padding: 0 2rem;
  box-sizing: border-box;

  .avatar-box {
    width: 3rem;
    height: 3rem;
    border-radius: 0.3rem;
    background-color: var(--theme-white-de);

    img {
      width: inherit;
      height: inherit;
      border-radius: 0.1rem;
    }

    .avatar-group {
      width: 1.15rem;
      height: 1.15rem;
      float: left;
      margin: 0.25rem 0 0 0.25rem;

    }
  }
}
</style>
