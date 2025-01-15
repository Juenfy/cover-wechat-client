<script setup>
import {ref, watch} from "vue";
import CommonPopup from "@/components/common/popup.vue";
import {useUserStore} from "@/stores/user";
import * as userApi from "@/api/user";
import {showFailToast, showSuccessToast} from "vant";

const userStore = useUserStore();
const props = defineProps({
  show: Boolean,
});
const emit = defineEmits(["hide"]);
const money = ref("");
const showKeyboard = ref(true);


const onInput = (e) => {
  money.value += e
};

const onDelete = () => {
  if (money.value.length > 0) {
    money.value = money.value.slice(0, -1);
  }
}

const onCharge = () => {
  if (money.value * 1 <= 0 || money.value * 1 > 10000) {
    return showFailToast("充值金额要大于0且小于10000");
  }
  userApi.postCharge(money.value).then(res => {
    if (res.code == 200001) {
      showSuccessToast(res.msg);
      userStore.updateInfo("money", res.data.money);
      money.value = "";
    } else {
      showFailToast(res.msg);
    }
  });
}

watch(() => props.show, (val) => {
  if (!val) {
    money.value = "";
  }
})
</script>

<template>
  <common-popup :show="props.show">
    <template #header>
      <van-nav-bar left-arrow right-text="零钱明细" @click-left="$emit('hide')" @click-right="() => {}"
                   :border="false"/>
    </template>
    <template #container>
      <div class="wallet">
        <van-image src="/money.png" width="5rem" height="5rem"/>
        <span>我的零钱</span>
        <h1>¥{{ (userStore.info.money / 100).toFixed(2) }}</h1>

        <span class="mt">充值金额</span>
        <h1>¥{{ (money * 1).toFixed(2) }}</h1>
        <van-button block type="primary" class="mt" @click="onCharge">充值</van-button>
        <van-number-keyboard
            :show="showKeyboard"
            :hide-on-click-outside="false"
            @input="onInput"
            @delete="onDelete"
        />
      </div>
    </template>
  </common-popup>
</template>

<style lang="less">
.wallet {
  padding: 1rem 4rem;
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  color: var(--black-white-color);
  font-size: 18px;

  h1 {
    font-size: 30px;
    font-weight: bold;
  }
}

@media (min-device-height: 844px) {
  .wallet {
    .mt {
      margin-top: 6rem;
    }
  }
}

@media (min-device-height: 720px) {
  .wallet {
    .mt {
      margin-top: 2rem;
    }
  }
}

@media (min-device-height: 600px) {
  .wallet {
    padding: 0 4rem;
    font-size: 16px;

    h1 {
      font-size: 20px;
    }
  }
}
</style>