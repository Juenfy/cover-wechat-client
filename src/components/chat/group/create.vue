<script setup>
import { ref, watch, inject } from "vue";
import * as friendApi from "@/api/friend";
import * as groupApi from "@/api/group";
import { showFailToast, showSuccessToast } from "vant";
import router from "@/router";

const WebSocketClient = inject("WebSocketClient");
const checkedList = ref([]);
const choseText = ref("多选");
const friendList = ref({});
const searchFriendList = ref([]);
const props = defineProps({ show: Boolean });
//调用父组件关闭弹窗
const emit = defineEmits(["hide"]);
const sendData = ref({
  who: "group",
  action: "create",
  data: {},
});
const indexList = ref([]);
const searchFocus = ref(false);
const keywords = ref("");

const getFriendList = () => {
  friendApi.getList().then((res) => {
    friendList.value = res.data;
    indexList.value = Object.keys(res.data).reverse();
  });
};

const searchResult = () => {
  searchFriendList.value = [];
  choseText.value == "多选";
  if (keywords.value.length <= 0) return;
  indexList.value.forEach((element) => {
    friendList.value[element].forEach((item) => {
      if (item.nickname.includes(keywords.value)) {
        searchFriendList.value.push(item);
      }
    });
  });
};
const onClickChoseText = () => {
  if (choseText.value == "多选") {
    choseText.value = "结束多选";
  } else {
    keywords.value = "";
    searchFocus.value = false;
  }
};
const onSubmit = () => {
  checkedList.value = [];
  indexList.value.forEach((element) => {
    friendList.value[element].forEach((item) => {
      if (item.checked) {
        checkedList.value.push(item.friend);
      }
    });
  });

  if (checkedList.value.length == 0) {
    return showFailToast("请选择好友");
  }

  groupApi.postCreate({ group_users: checkedList.value }).then((res) => {
    if (res.code == 200001) {
      showSuccessToast(res.msg);
      sendData.value.data = res.data;
      WebSocketClient.send(sendData.value);
      setTimeout(() => {
        emit("hide");
        router.push({
          name: "chat-message",
          params: { to_user: res.data.group_id, is_group: 1, unread: 0 },
        });
      }, 2000);
    } else {
      showFailToast(res.msg);
    }
  });
};

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      getFriendList();
    }
  }
);
</script>
<template>
  <van-popup
    v-model:show="props.show"
    position="bottom"
    :style="{ height: '100%', width: '100%' }"
    duration="0.2"
  >
    <header>
      <van-nav-bar
        title="选择联系人"
        @click-left="$emit('hide')"
        @click-right="onSubmit"
      >
        <template #left>
          <span>取消</span>
        </template>
        <template #right>
          <van-button type="primary" size="small">完成</van-button>
        </template>
      </van-nav-bar>
    </header>
    <main class="friend-list">
      <van-search
        v-model="keywords"
        placeholder="搜索"
        @focus="searchFocus = true"
        @blur="searchFocus = keywords.length > 0"
        @update:model-value="searchResult"
      />
      <van-index-bar v-if="!searchFocus" :index-list="indexList">
        <van-cell title="选择一个群" size="large" is-link to="" />
        <van-cell title="新面对面群" size="large" is-link to="" />
        <div v-for="val in indexList" :key="val">
          <van-index-anchor :index="val" />
          <van-cell
            :title="item.nickname"
            size="large"
            :center="true"
            v-for="(item, index) in friendList[val]"
            :key="item.friend"
          >
            <template #icon>
              <van-checkbox
                v-model="friendList[val][index].checked"
                @change="
                  (checked) => {
                    friendList[val][index].checked = checked;
                  }
                "
              ></van-checkbox>
              <van-image width="3rem" height="3rem" :src="item.avatar" />
            </template>
          </van-cell>
        </div>
      </van-index-bar>
      <div class="search-result" v-else-if="keywords.length > 0 && searchFocus">
        <van-nav-bar
          left-text="搜索结果"
          :right-text="choseText"
          left-disabled
          @click-right="onClickChoseText"
        />
        <van-cell-group title="联系人" :border="false">
          <van-cell
            :title="item.nickname"
            size="large"
            :center="true"
            v-for="(item, index) in searchFriendList"
            :key="item.friend"
          >
            <template #icon>
              <van-checkbox
                v-model="searchFriendList[index].checked"
                v-if="choseText != '多选'"
              ></van-checkbox>
              <van-image width="3rem" height="3rem" :src="item.avatar" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </main>
  </van-popup>
</template>

<style scoped lang="less">
.friend-list {
  .van-checkbox,
  .van-image {
    margin-right: 1rem;
  }
}
</style>
