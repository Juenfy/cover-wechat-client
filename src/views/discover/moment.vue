<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { TypeText, TypeImage, TypeVideo } from "@/enums/momment";
import PostMoment from "@/components/discover/postMoment.vue";
import CommonCamera from "@/components/common/camera.vue";
import * as momentApi from "@/api/moment";

const router = useRouter();
const showPostMomentMenu = ref(false);
const showPostMoment = ref(false);
const showCommonCamera = ref(false);
const bgHeader = ref(null);
const postType = ref("text");
const fileList = ref([]);
const momentList = ref([]);
const navBar = ref(null);
const navTitle = ref("");
const onClickBgHeader = () => {
  bgHeader.value.animate({ height: "30rem" }, { duration: 300 });
};
const handlePostMomentMenu = (type) => {
  postType.value = type;
  showPostMoment.value = true;
  showPostMomentMenu.value = false;
};
const afterRead = async (file) => {
  console.log(file);
  fileList.value = file.hasOwnProperty("length") ? file : [file];
  handlePostMomentMenu(TypeImage);
};

const takePhotoCb = async (data) => {
  showCommonCamera.value = false;
  alert(photo);
};
const hidePostMoment = () => {
  fileList.value = [];
  showPostMoment.value = false;
};

const getMomentList = async () => {
  momentApi.getList().then((res) => {
    momentList.value = res.data;
  });
};

const onScroll = (e) => {

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
};

const postSuccessCb = async (data) => {
  await getMomentList();
  showPostMoment.value = false;
};

onMounted(async () => {
  await getMomentList();
});
</script>
<template>
  <div class="discover-moment">
    <header ref="navBar">
      <van-nav-bar left-arrow @click-left="router.go(-1)" @click-right="showPostMomentMenu = true" :border="false"
        :title="navTitle" style="background: transparent;">
        <template #right>
          <van-icon name="photo-o"></van-icon>
        </template>
      </van-nav-bar>
    </header>
    <section>
      <div class="container moment-list" @scroll.passive="onScroll" style="background: var(--black20-white-color);">
        <div class="bg-header" @click="onClickBgHeader" ref="bgHeader">

        </div>
        <div class="moment-item" v-for="item in momentList" :key="item.id">
          <div class="moment-item-left">
            <van-image width="3rem" height="3rem" fit="contain" :src="item.user.avatar" />
          </div>
          <div class="moment-item-right">
            <van-text-ellipsis :content="item.user.nickname" class="nickname" />
            <van-text-ellipsis :content="item.content" class="content" />
            <van-uploader v-model="item.files" multiple :max-count="item.files.length" v-if="item.files.length > 0"
              :deletable="false" />
          </div>
        </div>
      </div>
    </section>
  </div>
  <van-popup v-model:show="showPostMomentMenu" round position="bottom" class="post-moment-menu">
    <van-cell-group>
      <van-cell title="拍摄" clickable size="large" @click="showCommonCamera = true" />
      <van-cell title="从手机相册选择" clickable size="large">
        <template #title>
          <van-uploader :after-read="afterRead" max-count="8" accept="image/*" multiple>从手机相册选择</van-uploader>
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
</template>
<style scoped lang="less">
.discover-moment {
  .header-bg {
    background: var(--van-nav-bar-background);
  }

  section {


    .moment-list {
      box-sizing: border-box;

      .bg-header {
        height: 20rem;
        background-image: url("./../../assets/bg.png");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        cursor: pointer;
      }

      .moment-item:first-child {
        margin-top: 1rem;
      }

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
.post-moment-menu .van-cell__title {
  text-align: center;
  line-height: 2rem;
}
</style>