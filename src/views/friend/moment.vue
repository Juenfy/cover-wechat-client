<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { TypeText, TypeImage, TypeVideo } from "@/enums/moment";
import * as userApi from "@/api/user";
import { timestampFormat } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import { useAppStore } from "@/stores/app";
import MomentMessage from "@/components/discover/moment/message.vue";

const isOwner = ref(false);
const momentList = ref([]);
const appStore = useAppStore();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const showDom = ref(true);
const showMomentMessageMenu = ref(false);
const showMomentMessage = ref(false);
const bgHeader = ref(null);
const postType = ref("text");
const fileList = ref([]);
const momentId = ref(0);
const toUser = ref(0);
const placeholder = ref("评论");
const list = ref([]);
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
  bgHeader.value.classList.add("bg-header-go");
  setTimeout(() => {
    showDom.value = false;
    bgHeader.value.classList.remove("bg-header-back");
  }, 300);
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
      document.getElementsByClassName('van-icon-photo-o')[0].style.color =
        'var(--black-white-color)';
    } else {
      navTitle.value = '';
      navBar.value.classList.remove('header-bg');
      document.getElementsByClassName('van-icon-arrow-left')[0].style.color =
        '#fff';
      document.getElementsByClassName('van-icon-photo-o')[0].style.color =
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
  }, 500);
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

//点赞、评论气泡弹出框
const onOpenActionPopover = (id) => {
  momentId.value = id;
};

//回复评论
const replySomeOne = (id, to, ph) => {
  momentId.value = id;
  toUser.value = to;
  placeholder.value = ph;
  onSelectAction(ref('comment'));
}

//监听点赞、评论按钮
const onSelectAction = (action) => {
  console.log(action, momentId.value, toUser.value);
  switch (action.value) {
    //赞
    case "like":
      momentApi.like(momentId.value).then((res) => {
        if (res.code == 200001) {
          likeMoment(res.data);
        }
      });
      break;
    //取消赞
    case "unlike":
      momentApi.unlike(momentId.value).then((res) => {
        if (res.code == 200001) {
          unlikeMoment(res.data);
        }
      })
      break;
    case "comment":
      showCommonComment.value = true;
      break;
  }
}

//发布朋友圈的回调
const postSuccessCb = async (data) => {
  showPostMoment.value = false;
  refreshing.value = true;
  onRefreshMomentList();
};

//评论朋友圈的回调
const commentSuccessCb = async (data) => {
  commentMoment(data);
}


//前往好友主页
const gotoFriendInfo = (keywords) => {
  router.push({
    name: "friend-info",
    query: {
      keywords: keywords,
    },
  });
}

onMounted(() => {
  isOwner.value = route.params.id == userStore.homeInfo.id;
  momentList.value = [];
})
</script>
<template>
  <div class="overly" style="position: fixed;top: 0;left: 0;width: 100%;height: 100vh;z-index: 10;" v-show="!showDom"
    @click="onClickDiscoverMoment"></div>
  <div class="discover-moment">
    <header ref="navBar">
      <van-nav-bar left-arrow @click-left="router.go(-1)" @click-right="showMomentMessageMenu = true" :border="false"
        :title="navTitle" style="background: transparent;" v-if="showDom">
        <template #right v-if="isOwner">
          <van-icon name="ellipsis" />
        </template>
      </van-nav-bar>
    </header>
    <section>
      <van-pull-refresh v-model="refreshing" @refresh="onRefreshMomentList" class="container moment-list"
        @scroll.passive="onScroll" style="background: var(--black20-white-color);">
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoadMomentList">
          <div class="bg-header" @click="onClickBgHeader" ref="bgHeader" :style="userStore.homeInfo.moment_bg_file_path == ''
            ? ''
            : 'background-image: url(' + userStore.homeInfo.moment_bg_file_path + ');'
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
          <div class="moment-item" v-for="item in momentList" :key="item.id">
            <div class="moment-item-left">

            </div>
            <div class="moment-item-right">

            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </section>
  </div>
  <van-popup v-model:show="showMomentMessageMenu" round position="bottom" class="moment-message-menu">
    <van-cell-group>
      <van-cell title="消息列表" clickable size="large" @click="handleMomentMessageMenu" />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="取消" clickable @click="showMomentMessageMenu = false" size="large" />
    </van-cell-group>
  </van-popup>
</template>
<style scoped lang="less">
.discover-moment {
  .header-bg {
    background: var(--van-nav-bar-background);
  }

  section {


    .moment-list {
      box-sizing: border-box;
      background: var(--common-search-background) !important;

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

      .unread {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 1rem;

        button {
          border: none;
          color: var(--theme-blue-1970);
          background: var(--black20-whitef7-color);
          font-size: 16px;
        }
      }

      .moment-item:first-child {
        margin-top: 1rem;
      }

      .moment-item {
        padding: 2rem 2rem;
        height: auto;
        display: flex;
        position: relative;
        justify-content: flex-start;

        .moment-item-left {
          width: 3rem;
          margin-right: 0.5rem;
        }

        .moment-item-right {
          flex-grow: 1;

          .like-comment-box {
            background: var(--black20-whitef7-color);
            margin-top: 8px;

            .van-cell {
              padding: 0px 6px;
              background: var(--black20-whitef7-color);
              font-weight: 600;

              .van-cell__title>div {
                color: var(--theme-blue-1970);

                b {
                  color: var(--black4c-whitebc-color);
                }
              }
            }
          }

          .nickname {
            color: var(--theme-blue-1970);
            font-size: 18px;
            font-weight: 700;
            margin-top: -5px;
          }

          .content {
            color: var(--black-white-color);
          }
        }
      }

      .moment-item::after {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        right: 0;
        bottom: 0;
        left: 0;
        border-bottom: 1px solid var(--van-cell-border-color);
        transform: scaleY(.5);
      }
    }
  }
}
</style>
<style lang="css">
.moment-message-menu .van-cell__title {
  text-align: center;
  line-height: 2rem;
}

.van-icon-like {
  color: var(--theme-danger-color);
}

.van-text-ellipsis__action {
  color: var(--theme-gray-70) !important;
}

.change-bg .van-grid-item__text {
  color: var(--theme-white);
}

.unread .van-icon__image {
  width: 2rem;
  height: 2rem;
}
</style>