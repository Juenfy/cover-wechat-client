<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as userApi from "@/api/user";
import { timestampFormatMoment } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import MomentMessage from "@/components/discover/moment/message.vue";
import MomentDetail from "@/components/discover/moment/detail.vue";
import MomentBackground from "@/components/common/background.vue";

const isOwner = ref(false);
const momentList = ref([]);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const showDom = ref(true);
const showMomentMessageMenu = ref(false);
const showMomentMessage = ref(false);
const showMomentDetail = ref(false);
const showMomentBackground = ref(false);
const momentId = ref(0);
const userId = ref(0);
const bgHeader = ref(null);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const navBar = ref(null);
const navTitle = ref("");
const page = ref(1);
const limit = ref(10);

const onClickDiscoverMoment = () => {
  bgHeader.value.classList.add("bg-header-back");
  setTimeout(() => {
    showDom.value = true;
    bgHeader.value.classList.remove("bg-header-go");
  }, 300);
};
const onClickBgHeader = () => {
  if (bgHeader.value?.classList) {
    bgHeader.value.classList.add("bg-header-go");
    setTimeout(() => {
      showDom.value = false;
      bgHeader.value.classList.remove("bg-header-back");
    }, 300);
  }
};

const handleMomentMessageMenu = () => {
  showMomentMessage.value = true;
  showMomentMessageMenu.value = false;
};

// 监听滚动
const onScroll = (e) => {
  if (showDom.value) {
    if (e.target.scrollTop > bgHeader.value.clientHeight - 46) {
      navTitle.value = '朋友圈';
      navBar.value.classList.add('header-bg');
      document.getElementsByClassName('van-icon-arrow-left')[0].style.color =
        'var(--black-white-color)';
      document.getElementsByClassName('van-icon-ellipsis')[0].style.color =
        'var(--black-white-color)';
    } else {
      navTitle.value = '';
      navBar.value.classList.remove('header-bg');
      document.getElementsByClassName('van-icon-arrow-left')[0].style.color =
        '#fff';
      document.getElementsByClassName('van-icon-ellipsis')[0].style.color =
        '#fff';
    }
  }
};

//加载朋友圈列表
const onLoadMomentList = () => {
  setTimeout(() => {
    if (refreshing.value) {
      momentList.value = [];
      refreshing.value = false;
      page.value = 1;
    }
    userApi.getMomentList(route.params.id, page.value, limit.value).then((res) => {
      console.log(res);
      res.data.forEach(element => {
        momentList.value.push(element);
      });
      ++page.value;
      loading.value = false;
      if (res.page_info.total_page < page.value) {
        finished.value = true;
      }
    });
  }, 100);
};
//下拉刷新朋友圈列表
const onRefreshMomentList = () => {
  //清空列表数据
  finished.value = false;

  //重新加载数据
  //将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoadMomentList();
};


//前往好友主页
const gotoFriendInfo = (keywords) => {
  router.push({
    name: "friend-info",
    query: {
      keywords: keywords,
    },
  });
}

//查看朋友圈详情
const gotoMomentDetail = (moment) => {
  momentId.value = moment.id;
  userId.value = moment.user_id;
  showMomentDetail.value = true;
}

onMounted(() => {
  isOwner.value = route.params.id == userStore.info.id;
  momentList.value = [];
})
</script>
<template>
  <div class="overly" style="position: fixed;top: 0;left: 0;width: 100%;height: 100vh;z-index: 10;" v-show="!showDom"
    @click="onClickDiscoverMoment"></div>
  <div class="friend-moment">
    <header ref="navBar">
      <van-nav-bar left-arrow @click-left="router.go(-1)" @click-right="showMomentMessageMenu = true" :border="false"
        :title="navTitle" style="background: transparent;" v-if="showDom">
        <template #right v-if="isOwner">
          <van-icon name="ellipsis" />
        </template>
      </van-nav-bar>
    </header>
    <section>
      <van-pull-refresh v-model="refreshing" @refresh="onRefreshMomentList" class="container moment-container"
        @scroll.passive="onScroll" style="background: var(--black20-white-color);">
        <div class="bg-header" @click="onClickBgHeader" ref="bgHeader" :style="userStore.info.moment_bg_file_path == ''
          ? ''
          : 'background-image: url(' + userStore.info.moment_bg_file_path + ');'
          ">
          <div class="user" v-if="showDom">
            <div class="user-info">
              <span @click="gotoFriendInfo(userStore.homeInfo.wechat)">{{ userStore.homeInfo.display_nickname
                ? userStore.homeInfo.display_nickname :
                userStore.homeInfo.nickname }}</span>
              <van-image radius="8px" width="4rem" height="4rem" :src="userStore.homeInfo.avatar"
                @click="gotoFriendInfo(userStore.homeInfo.wechat)" />
            </div>
            <div class="user-info user-sign">
              <span>{{ userStore.homeInfo.sign }}</span>
            </div>
          </div>
          <div class="change-bg" v-if="isOwner && !showDom">
            <van-grid :column-num="1" :border="false">
              <van-grid-item icon="photo" text="换封面" icon-color="var(--theme-white)"
                @click="showMomentBackground = true" />
            </van-grid>
          </div>
        </div>
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoadMomentList"
          class="moment-list">
          <div v-for="(item, index) in momentList" :key="index" class="moment-item">
            <div class="year" v-if="item.year < item.current_year">{{ item.year }}</div>
            <div class="moment-year" v-for="(moment, index) in item.moments" :key="index">
              <div class="left">
                <span v-html="timestampFormatMoment(moment.ts)"></span>
              </div>
              <div class="right">
                <div class="item" v-for="(val, mk) in moment.list" :key="mk" @click="gotoMomentDetail(val)">
                  <div class="img-grid" v-if="val.files.length > 0" :class="'img-grid-' + val.files.length">
                    <div v-for="(file, fk) in val.files" :key="fk" class="img-item" :class="`item-${++fk}`"
                      :style="{ backgroundImage: `url(${file.file.path})` }"></div>
                  </div>
                  <div class="content" :class="val.files.length <= 0 ? 'content-bg' : ''"><van-text-ellipsis
                      :content="val.content" rows="3" /></div>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </section>
  </div>
  <van-popup v-model:show="showMomentMessageMenu" round position="bottom" class="popup-menu">
    <van-cell-group>
      <van-cell title="消息列表" clickable size="large" @click="handleMomentMessageMenu" />
    </van-cell-group>
    <van-cell-group class="cancel">
      <van-cell title="取消" clickable @click="showMomentMessageMenu = false" size="large" />
    </van-cell-group>
  </van-popup>
  <moment-message :show="showMomentMessage" @hide="showMomentMessage = false" />
  <moment-detail :show="showMomentDetail" @hide="showMomentDetail = false" :momentId="momentId" :userId="userId" />
  <moment-background :show="showMomentBackground" @hide="showMomentBackground = false" :info="{}" type="moment"
    title="更换相册封面" />
</template>
<style scoped lang="less">
.friend-moment {
  .header-bg {
    background: var(--van-nav-bar-background);
  }

  section {


    .moment-container {
      .bg-header {
        background-image: url(../../assets/bg.png);
        position: relative;
        height: 40vh;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        cursor: pointer;

        .change-bg {
          position: absolute;
          bottom: 0;
          right: 1rem;
          z-index: 20;
        }

        .user {
          position: absolute;
          bottom: -2.8rem;
          right: 0.7rem;
          display: flex;
          flex-direction: column;

          &-info {
            width: inherit;
            display: flex;
            justify-content: flex-end;
            text-align: left;

            span {
              margin: 8px 6px;
              font-size: 20px;
              font-weight: 700;
              color: var(--theme-white);
            }
          }

          &-sign {
            height: 1.5rem;

            span {
              font-size: 12px;
              line-height: 14px;
              color: var(--van-cell-value-color);
            }
          }
        }
      }

      .bg-header-go {
        height: 80vh;
        animation: bg-header-go 0.3s ease-in-out;
      }

      .bg-header-back {
        height: 40vh;
        animation: bg-header-back 0.3s ease-in-out;
      }

      @keyframes bg-header-go {
        0% {
          height: 40vh;
        }

        100% {
          height: 80vh;
        }
      }

      @keyframes bg-header-back {
        0% {
          height: 100vh;
        }

        100% {
          height: 40vh;
        }
      }

      .moment-list {
        padding-top: 4rem;

        .moment-item {
          padding: 0 1rem;
          box-sizing: border-box;
          width: 100%;

          .year {
            font-size: 20px;
            font-weight: 700;
            padding: 1rem 0;
            color: var(--black-white-color);
          }

          .moment-year {
            display: flex;

            .left {
              width: 5rem;
              text-align: left;
              color: var(--black-white-color);
            }

            .right {
              flex: 1;

              .item {
                display: flex;
                width: inherit;
                justify-content: center;
                align-content: center;
                margin-bottom: 1rem;

                .img-grid {
                  width: 6rem;
                  height: 6rem;
                  display: grid;

                  .img-item {
                    background-size: cover;
                    background-position: center;
                    width: 100%;
                    height: 100%;
                  }

                  .item-1 {
                    grid-area: item-1;
                  }

                  .item-2 {
                    grid-area: item-2;
                  }

                  .item-3 {
                    grid-area: item-3;
                  }

                  .item-4 {
                    grid-area: item-4;
                  }

                  .item-5 {
                    grid-area: item-5;
                  }

                  .item-6 {
                    grid-area: item-6;
                  }

                  .item-7 {
                    grid-area: item-7;
                  }

                  .item-8 {
                    grid-area: item-8;
                  }

                  .item-9 {
                    grid-area: item-9;
                  }
                }

                .img-grid-1 {
                  grid-template-areas: "item-1";
                  grid-template-columns: 1fr;
                  grid-template-rows: 1fr;
                }

                .img-grid-2 {
                  grid-template-areas: "item-1 item-2";
                  grid-template-columns: 1fr 1fr;
                  grid-template-rows: 1fr;
                }

                .img-grid-3 {
                  grid-template-areas: "item-1 item-2" "item-1 item-3";
                  grid-template-columns: 1fr 1fr;
                  grid-template-rows: 1fr 1fr;
                }

                .img-grid-4 {
                  grid-template-areas: "item-1 item-2" "item-3 item-4";
                  grid-template-columns: 1fr 1fr;
                  grid-template-rows: 1fr 1fr;
                }

                .img-grid-5 {
                  grid-template-areas: "item-1 item-2" "item-1 item-3" "item-4 item-5";
                  grid-template-columns: 1fr 1fr;
                  grid-template-rows: 1fr 1fr 1fr;
                }

                .img-grid-6 {
                  grid-template-areas: "item-1 item-2 item-3" "item-4 item-5 item-6";
                  grid-template-columns: 1fr 1fr 1fr;
                  grid-template-rows: 1fr 1fr;
                }

                .img-grid-7 {
                  grid-template-areas: "item-1 item-2 item-3" "item-1 item-4 item-5" "item-1 item-6 item-7";
                  grid-template-columns: 1fr 1fr 1fr;
                  grid-template-rows: 1fr 1fr 1fr;
                }

                .img-grid-8 {
                  grid-template-areas: "item-1 item-2 item-3" "item-1 item-4 item-5" "item-6 item-7 item-8";
                  grid-template-columns: 1fr 1fr 1fr;
                  grid-template-rows: 1fr 1fr 1fr;
                }

                .img-grid-9 {
                  grid-template-areas: "item-1 item-2 item-3" "item-4 item-5 item-6" "item-7 item-8 item-9";
                  grid-template-columns: 1fr 1fr 1fr;
                  grid-template-rows: 1fr 1fr 1fr;
                }

                .content {
                  flex: 1;
                  padding: 0.5rem;
                  color: var(--black-white-color);
                  max-height: 6rem;
                  overflow: hidden;
                }

                .content-bg {
                  background: var(--black20-whitef7-color);
                  border-radius: 0.2rem;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="css">
.friend-moment .van-nav-bar .van-icon {
  color: #fff;
}

.van-text-ellipsis__action {
  color: var(--theme-gray-70) !important;
}

.change-bg .van-grid-item__text {
  color: var(--theme-white);
}
</style>