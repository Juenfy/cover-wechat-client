<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { TypeText, TypeImage, TypeVideo } from "@/enums/moment";
import PostMoment from "@/components/discover/moment/post.vue";
import CommonCamera from "@/components/common/camera.vue";
import CommonComment from "@/components/common/comment.vue";
import MomentMessage from "@/components/discover/moment/message.vue";
import * as momentApi from "@/api/moment";
import { timestampFormat } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import MomentBackground from "@/components/common/background.vue";
import "emoji-picker-element";
import { useAppStore } from "@/stores/app";
import {
  momentList,
  likeMoment,
  unlikeMoment,
  commentMoment
} from "@/utils/moment";

const appStore = useAppStore();
const router = useRouter();
const userStore = useUserStore();
const showDom = ref(true);
const showPostMomentMenu = ref(false);
const showPostMoment = ref(false);
const showCommonCamera = ref(false);
const showMomentBackground = ref(false);
const showCommonComment = ref(false);
const showMomentMessage = ref(false);
const content = ref("");
const bgHeader = ref(null);
const postType = ref("text");
const fileList = ref([]);
const momentId = ref(0);
const toUser = ref(0);
const placeholder = ref("评论");
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const navBar = ref(null);
const navTitle = ref("");
const page = ref(1);
const limit = ref(10);

const handleInput = (data) => {
  // console.log("handleInput", data.value);
  content.value = data.value.content;
};

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

const handlePostMomentMenu = (type) => {
  postType.value = type;
  showPostMoment.value = true;
  showPostMomentMenu.value = false;
};
const afterRead = async (file) => {
  console.log(file);
  fileList.value = file?.length > 0 ? file : [file];
  handlePostMomentMenu(TypeImage);
};

const takePhotoCb = async (data) => {
  showCommonCamera.value = false;
  alert(data);
};
const hidePostMoment = () => {
  fileList.value = [];
  showPostMoment.value = false;
};

const hideCommonComment = () => {
  showCommonComment.value = false;
  momentId.value = 0;
  toUser.value = 0;
  placeholder.value = "评论";
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
    momentApi.getList(page.value, limit.value).then((res) => {
      res.data.forEach(element => {
        element.showActionPopover = false;
        let t = '赞', v = 'like', i = 'like-o';
        element.likes.forEach(item => {
          if (item.from_user == userStore.info.id) {
            t = '取消';
            v = 'unlike';
            i = 'like';
          }
        });
        element.actions = [
          { text: t, value: v, icon: i },
          { text: "评论", value: 'comment', icon: 'comment-o' },
        ];
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
};

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
};

//发布朋友圈的回调
const postSuccessCb = async (data) => {
  showPostMoment.value = false;
  refreshing.value = true;
  onRefreshMomentList();
};

//评论朋友圈的回调
const onCommentCb = async (data) => {
  if (content.value) {
    momentApi.comment({
      id: momentId.value,
      to_user: toUser.value,
      content: content.value,
    }).then(res => {
      if (res.code == 200001) {
        commentMoment(res.data);
        showCommonComment.value = false
        content.value = "";
      }
    })
  }

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

onMounted(() => {
  momentList.value = [];
});
</script>
<template>
  <div class="overly" style="position: fixed;top: 0;left: 0;width: 100%;height: 100vh;z-index: 10;" v-show="!showDom"
    @click="onClickDiscoverMoment"></div>
  <div class="discover-moment">
    <header ref="navBar">
      <van-nav-bar left-arrow @click-left="router.go(-1)" @click-right="showPostMomentMenu = true" :border="false"
        :title="navTitle" style="background: transparent;" v-if="showDom">
        <template #right>
          <van-icon name="photo-o" />
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
            <span @click="gotoFriendInfo(userStore.info.wechat)">{{ userStore.info.nickname }}</span>
            <van-image radius="8px" width="4rem" height="4rem" :src="userStore.info.avatar"
              @click="gotoFriendInfo(userStore.info.wechat)" />
          </div>
          <div class="change-bg" v-else>
            <van-grid :column-num="1" :border="false">
              <van-grid-item icon="photo" text="换封面" icon-color="var(--theme-white)"
                @click="showMomentBackground = true" />
            </van-grid>
          </div>
        </div>
        <div class="unread" v-if="appStore.unread.moment.num > 0" @click="showMomentMessage = true">
          <van-button :icon="appStore.unread.moment.from.avatar">&nbsp;{{
            appStore.unread.moment.num }}条未读</van-button>
        </div>
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoadMomentList"
          class="moment-list">
          <div class="moment-item" v-for="item in momentList" :key="item.id">
            <div class="moment-item-left">
              <van-image width="3rem" height="3rem" fit="contain" :src="item.user.avatar"
                @click="gotoFriendInfo(item.user.wechat)" />
            </div>
            <div class="moment-item-right">
              <van-text-ellipsis :content="item.user.nickname" class="nickname"
                @click="gotoFriendInfo(item.user.wechat)" />
              <van-text-ellipsis :content="item.content" class="content" rows="6" expand-text="展开" collapse-text="收起" />
              <van-uploader v-model="item.files" :max-count="item.files.length" v-if="item.files.length > 0"
                :deletable="false" />
              <van-cell-group :border="false" style="background: transparent;">
                <van-cell value="内容" style="padding: 0;background: transparent;">
                  <template #title>
                    <span style="color: var(--theme-gray-70);">{{ timestampFormat(item.created_at) }}</span>
                  </template>
                  <template #value>
                    <van-popover v-model:show="item.showActionPopover" theme="dark" :actions="item.actions"
                      @select="onSelectAction" actions-direction="horizontal" placement="left-end"
                      @open="onOpenActionPopover(item.id)">
                      <template #reference>
                        <van-button color="var(--black20-whitef7-color)" icon="ellipsis"
                          style="height: 16px;width: 20px;color: var(--theme-blue-1970)!important;cursor: pointer;" />
                      </template>
                    </van-popover>
                  </template>
                </van-cell>
              </van-cell-group>
              <van-cell-group style="background: var(--black20-whitef7-color);margin-top: 8px;"
                v-if="item.likes.length > 0 || item.comments.length > 0" class="like-comment-box">
                <van-cell style="padding: 0 6px;background: var(--black20-whitef7-color);" v-if="item.likes.length > 0">
                  <template #title>
                    <div>
                      <van-icon name="like-o" />
                      <b style="margin-left: 4px;" v-for="(like, index) in item.likes" :key="like.id"
                        @click="gotoFriendInfo(like.from.wechat)">{{
                          like.from.nickname + (index + 1 == item.likes.length ? '' : ',') }}</b>
                    </div>
                  </template>
                </van-cell>
                <van-cell v-if="item.comments.length > 0">
                  <template #title>
                    <div v-for="(comment) in item.comments" :key="comment.id"
                      @click="replySomeOne(item.id, comment.from_user, ('回复' + comment.from.nickname))">
                      <b @click="gotoFriendInfo(comment.from.wechat)">{{ comment.from.nickname }}</b><span
                        v-if="comment.to_user > 0" @click="gotoFriendInfo(comment.to.wechat)">回复<b>{{
                          comment.to.nickname }}</b></span>
                      <span>：{{ comment.content }}</span>
                    </div>
                  </template>
                </van-cell>
              </van-cell-group>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </section>
  </div>
  <van-popup v-model:show="showPostMomentMenu" round position="bottom" class="post-moment-menu">
    <van-cell-group>
      <van-cell title="拍摄" clickable size="large" @click="showCommonCamera = true" />
      <van-cell title="从手机相册选择" clickable size="large">
        <template #title>
          <van-uploader :after-read="afterRead" max-count="9" accept="image/*" multiple>从手机相册选择</van-uploader>
        </template>
      </van-cell>
      <van-cell title="纯文案" clickable size="large" @click="handlePostMomentMenu(TypeText)" />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="取消" clickable @click="showPostMomentMenu = false" size="large" />
    </van-cell-group>
  </van-popup>
  <post-moment :show="showPostMoment" :fileList="fileList" :postType="postType" @hide="hidePostMoment"
    @postSuccessCb="postSuccessCb" />
  <common-camera :show="showCommonCamera" @hide="showCommonCamera = false" @takePhotoCb="takePhotoCb" />
  <moment-background :show="showMomentBackground" @hide="showMomentBackground = false" :info="{}" type="moment"
    title="更换相册封面" />
  <common-comment :show="showCommonComment" :content="content" :placeholder="placeholder" position="bottom"
    @input="handleInput" @callback="onCommentCb" modules="emoji" @hide="hideCommonComment" />
  <moment-message :show="showMomentMessage" @hide="showMomentMessage = false" />
</template>
<style scoped lang="less">
.discover-moment {
  .header-bg {
    background: var(--van-nav-bar-background);
  }

  section {


    .moment-container {
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
          bottom: -1.5rem;
          right: 0.7rem;
          display: flex;
          flex-direction: row;

          span {
            margin: 8px 6px;
            font-size: 20px;
            font-weight: 700;
            color: var(--theme-white);
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

      .moment-list {
        margin-top: 1rem;

        .moment-item {
          padding: 1rem 2rem;
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

                .van-cell__title>div {
                  color: var(--black4c-whitebc-color);

                  b {
                    color: var(--theme-blue-1970);
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
}
</style>
<style lang="css">
.discover-moment .van-nav-bar .van-icon {
  color: #fff;
}

.post-moment-menu .van-cell__title {
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