<script setup>
import FriendRemark from "@/components/friend/remark.vue";
import FriendPerm from "@/components/friend/perm.vue";
import FriendSetting from "@/components/friend/setting.vue";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as userApi from "@/api/user";
import { RelationShip } from "@/enums/friend";
import { showImagePreview } from "vant";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const homeInfo = ref({});
const showFriendRemark = ref(false);
const showFriendPerm = ref(false);
const showFriendSetting = ref(false);

const onButtonClick = () => {
  if (
    [RelationShip.Owner, RelationShip.Friend].indexOf(
      homeInfo.value.relationship
    ) != -1
  ) {
    router.push({
      name: "chat-message",
      params: {
        to_user: homeInfo.value.id,
        is_group: 0,
      },
    });
  } else {
    router.push({
      name: "friend-apply",
      query: {
        keywords: homeInfo.value.keywords,
        source: homeInfo.value.source,
        relationship: homeInfo.value.relationship,
      },
    });
  }
};

const getHomeInfo = () => {
  userApi.getHomeInfo(route.query.keywords).then((res) => {
    homeInfo.value = res.data;
    userStore.setHomeInfo(res.data);
  });
};

const updateCb = async () => {
  getHomeInfo();
};

const previewImage = (url) => {
  showImagePreview({
    images: [url],
  });
};

onMounted(() => {
  getHomeInfo();
});
</script>
<template>
  <header>
    <van-nav-bar left-arrow @click-left="router.go(-1)" @click-right="showFriendSetting = true" :border="false">
      <template #right v-if="homeInfo.relationship == RelationShip.Friend">
        <van-icon name="ellipsis" />
      </template>
    </van-nav-bar>
  </header>
  <section>
    <div class="header"></div>
    <div class="container">
      <div class="common friend-info">
        <van-cell-group :border="false">
          <van-cell>
            <template #title>
              <div class="card">
                <div class="info">
                  <van-image radius=".5rem" width="4rem" height="4rem" :src="homeInfo.avatar"
                    @click="previewImage(homeInfo.avatar)" />
                  <div class="text">
                    <span class="display-nickname">{{ homeInfo.display_nickname
                      }}<van-icon name="user" color="#008cff" /></span>
                    <span class="nickname" v-if="homeInfo.display_nickname != homeInfo.nickname">昵称：{{ homeInfo.nickname
                      }}</span>
                    <span class="vchat">微信号：{{ homeInfo.wechat }}</span>
                    <span class="area">地区：上海</span>
                  </div>
                </div>
                <div class="check-msg" v-if="homeInfo.check_msg">
                  <span>{{ homeInfo.check_msg }}</span>
                </div>
              </div>
            </template>
          </van-cell>
          <van-cell title="备注和标签" is-link clickable @click="showFriendRemark = true" size="large"
            v-if="homeInfo.relationship == RelationShip.Friend" />
          <van-cell title="朋友权限" is-link clickable @click="showFriendPerm = true" size="large"
            v-if="homeInfo.relationship == RelationShip.Friend" />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-cell is-link :to="homeInfo.id + '/moment'" size="large" :center="true">
            <template #title>
              <span>朋友圈</span>
              <van-image :src="v" style="width: 3rem; height: 3rem; margin-left: 1rem" v-for="(v, i) in homeInfo.moment"
                :key="i" fit="cover" />
            </template>
          </van-cell>
        </van-cell-group>
        <van-cell-group :border="false">
          <van-cell title="个性签名" v-if="homeInfo.sign" :value="homeInfo.sign" size="large" />
          <van-cell title="来源" :value="homeInfo.source_text" size="large"
            v-if="homeInfo.relationship != RelationShip.Owner" />
        </van-cell-group>
        <van-button size="large" :square="true" icon="chat-o" @click="onButtonClick" v-if="homeInfo.id != userStore.info.id && (
          homeInfo.relationship == RelationShip.Owner ||
          homeInfo.relationship == RelationShip.Friend)
        ">发送消息</van-button>
        <van-button size="large" :square="true" @click="onButtonClick" v-if="
          homeInfo.relationship == RelationShip.Apply ||
          homeInfo.relationship == RelationShip.WaitCheck
        ">添加到通讯录</van-button>
        <van-button size="large" :square="true" @click="onButtonClick"
          v-if="homeInfo.relationship == RelationShip.GoCheck">前往验证</van-button>
      </div>
    </div>
  </section>

  <friend-remark :show="showFriendRemark" @hide="showFriendRemark = false" :info="homeInfo" @updateCb="updateCb" />
  <friend-perm :show="showFriendPerm" @hide="showFriendPerm = false" :info="homeInfo" />
  <friend-setting :show="showFriendSetting" @hide="showFriendSetting = false" @showFP="showFriendPerm = true"
    @showFR="showFriendRemark = true" :info="homeInfo" />
</template>
<style scoped lang="less">
.van-cell-group {
  margin-bottom: 0.5rem;
}

.van-nav-bar {
  background: var(--friend-info-van-nav-bar);
}

.friend-info {
  button {
    margin-top: 0.5rem;
    border: none;
    font-weight: bold;
  }

  .card {
    width: 100%;

    .info,
    .check-msg {
      display: flex;
      position: relative;
      justify-content: flex-start;
      justify-items: flex-start;
      padding: 1.5rem 1.5rem 2.5rem 1.5rem;

      .text {
        height: 4rem;
        margin-left: 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        .display-nickname {
          font-weight: bold;
          font-size: 20px;
        }

        .nickname,
        .area,
        .vchat {
          color: var(--theme-gray-70);
        }
      }
    }

    .check-msg {
      padding: 0rem 1.5rem 0rem 1.5rem;

      span {
        padding: 1rem;
        width: 100%;
        background: var(--black20-whitef7-color);
        border-radius: 4px;
      }
    }
  }
}
</style>
