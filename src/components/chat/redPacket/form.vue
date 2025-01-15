<script setup>
import {ref, watch} from "vue";
import {TypeBelong, TypeLucky, TypeNormal, TypeName} from "@/enums/redPacket";
import ChatGroupUsers from "@/components/chat/group/users.vue";
import * as redPacketApi from "@/api/redPacket";
import {showFailToast} from "vant";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();
const props = defineProps({
  show: Boolean,
  info: Object
});
const emit = defineEmits(["hide", "sendCb"]);
const defaultData = ref({});
const formData = ref({});
const money = ref(null);
const chatInfo = ref({});
const typeActions = ref([
  {name: "拼手气红包", value: TypeLucky},
  {name: "普通红包", value: TypeNormal},
  {name: "专属红包", value: TypeBelong},
]);
const showChatGroupUsers = ref(false);

const showTypeMenu = ref(false);
const toUser = ref({});

const onSelectTypeAction = (action) => {
  formData.value.type = action.value;
  formData.value = defaultData.value;
  if (action.value == TypeBelong) {
    formData.value.total = 1;
  } else {
    formData.value.to_user = 0;
    toUser.value = {};
  }
};

const onSelectUser = (e) => {
  console.log(e);
  formData.value.to_user = e.id;
  toUser.value = e;
  showChatGroupUsers.value = false;
};

const onSubmit = () => {
  if (formData.value.remark.trim().length <= 0) {
    formData.value.remark = "恭喜发财，大吉大利"
  }
  if (formData.value.type == TypeBelong) {
    formData.value.total = 1;
  }
  if (formData.value.type == TypeNormal) {
    formData.value.money = money.value * formData.value.total;
  } else {
    formData.value.money = money.value * 1;
  }
  console.log(formData.value);
  redPacketApi.send(formData.value).then(res => {
    if (res.code == 200001) {
      userStore.updateInfo("money", res.data.money);
      emit("hide");
      emit("sendCb", res.data.id);
    } else {
      return showFailToast(res.msg);
    }
    console.log(res);
  });
};

watch(
    () => props.show,
    (val) => {
      if (val) {
        chatInfo.value = props.info;
        formData.value = defaultData.value = {
          group_id: chatInfo.value.is_group == 1 ? chatInfo.value.to_user : 0,
          to_user: chatInfo.value.is_group == 0 ? chatInfo.value.to_user : 0,
          type: chatInfo.value.is_group == 1 ? TypeLucky : TypeBelong,
          total: null,
          remark: null
        };
        money.value = null;
      }
    }
);
</script>

<template>
  <van-popup v-model:show="props.show" position="bottom" :style="{ height: '100%', width: '100%' }" duration="0.2">
    <header>
      <van-nav-bar title="红包" left-arrow @click-left="$emit('hide')" :border="false">
        <template #right>
          <van-icon name="ellipsis" size="20"/>
        </template>
        <template #left>
          <van-icon name="cross" size="20"/>
        </template>
      </van-nav-bar>
    </header>
    <section class="bg-nav">
      <div class="header"></div>
      <div class="container red-packet-form-container">
        <van-form @submit="onSubmit">
          <van-cell-group inset v-if="formData.group_id != 0" style="background: transparent">
            <span style="color: goldenrod;font-weight: bold" @click="showTypeMenu = true">{{
                TypeName?.[formData?.type]
              }} <van-icon
                  name="arrow-down"></van-icon></span>
          </van-cell-group>
          <van-cell-group inset v-if="chatInfo.is_group == 1 && formData.type == TypeBelong">
            <van-cell title="发给谁" is-link clickable @click="showChatGroupUsers = true"
                      style="font-size: 1rem;font-weight: bold;padding: 1rem;">
              <template #right-icon v-if="toUser?.id">
                <div style="display: flex;align-items: center;gap:0.5rem;">
                  <van-image :src="toUser.avatar" width="2rem" radius="0.2rem"/>
                  <span>{{ toUser.nickname }}</span>
                  <van-icon name="arrow"/>
                </div>
              </template>
            </van-cell>
          </van-cell-group>
          <van-cell-group inset v-if="chatInfo.is_group == 1 && formData.type != TypeBelong">
            <van-field
                v-model="formData.total"
                placeholder="填写红包个数"
                input-align="right"
            >
              <template #label>
                <span><van-icon name="/hb.png" size="20" style="margin-bottom: -4px"/> 红包个数</span>
              </template>
              <template #right-icon>
                <span>个</span>
              </template>
            </van-field>
          </van-cell-group>
          <van-cell-group
              :title="chatInfo.is_group == 1 && formData.type != TypeBelong ? `本群共${chatInfo.users.length}人` : ''"
              inset>
            <van-field
                v-model="money"
                placeholder="¥0.00"
                input-align="right"
            >
              <template #label>
                <span v-if="formData.type == TypeLucky"><van-icon name="/gift.png" size="20"
                                                                  style="margin-bottom: -4px"/> 总金额</span>
                <span v-if="formData.type == TypeNormal">单个金额</span>
                <span v-if="formData.type == TypeBelong">金额</span>
              </template>
            </van-field>
          </van-cell-group>
          <van-cell-group inset>
            <van-field
                v-model="formData.remark"
                placeholder="恭喜发财，大吉大利"
            >
              <template #right-icon>
                <span><van-icon name="/emoji+.png" size="20"/></span>
              </template>
            </van-field>
          </van-cell-group>
          <van-cell-group inset>
            <van-cell title="红包封面" is-link clickable style="font-size: 1rem;font-weight: bold;padding: 1rem;"/>
          </van-cell-group>
          <div style="text-align: center; margin-top: 3rem;">
            <h1 style="font-size: 3rem;color: var(--black-white-color)">¥{{
                formData.type != TypeNormal ? (money ? (money * 1).toFixed(2) : "0.00") : (money && formData.total ? (money * formData.total).toFixed(2) : "0.00")
              }}</h1>
          </div>

          <div style="margin:  2rem 6rem">
            <van-button block type="danger" native-type="submit">
              塞钱进红包
            </van-button>
          </div>
        </van-form>
      </div>
    </section>
    <van-action-sheet v-model:show="showTypeMenu" :actions="typeActions" @select="onSelectTypeAction"
                      cancel-text="取消" close-on-click-action/>
    <chat-group-users v-if="chatInfo.is_group == 1" :show="showChatGroupUsers" @hide="showChatGroupUsers = false"
                      @select="onSelectUser" :users="chatInfo.users" title="指定领取人" :multiple="false"/>
  </van-popup>
</template>

<style lang="less">
.red-packet-form-container {
  .van-form {
    .van-cell-group__title {
      padding-bottom: 0 !important;
    }

    .van-cell-group {
      margin-top: 2rem;

      .van-field {
        font-size: 1rem;
        font-weight: bold;
        padding: 1rem;
      }
    }
  }
}
</style>