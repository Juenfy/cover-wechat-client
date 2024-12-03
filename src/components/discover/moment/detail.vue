<script setup>
import { ref, watch, onMounted } from 'vue';
import * as momentApi from '@/api/moment';
import { ActionComment, ActionLike, ActionUnlike } from '@/enums/moment';
import { useRouter } from "vue-router";
import { useUserStore } from '@/stores/user';
import { showFailToast } from 'vant';
import CommonComment from "@/components/common/comment.vue";
import { timestampFormat } from "@/utils/helper";

const props = defineProps({ show: Boolean, momentId: Number, userId: Number });
//调用父组件关闭弹窗
const emit = defineEmits(["hide"]);
const router = useRouter();
const userStore = useUserStore();
const content = ref("");
const toUser = ref(0);
const placeholder = ref("评论");
const moment = ref({});
const refreshing = ref(false);
const showMomentDetailMenu = ref(false);
const showCommonComment = ref(false);
const momentDetailActions = [
    { name: "置顶", subname: "被置顶的朋友圈，将在[我的朋友圈]顶部长期展示", value: "top" },
    { name: "修改可见范围", value: "edit" }
];

const onLoadDetail = async () => {
    setTimeout(() => {
        momentApi.getDetail(props.momentId).then(res => {
            if (!res.data?.id) {
                showFailToast("朋友圈不存在");
                emit("hide");
            }
            moment.value = res.data;
            moment.value.showActionPopover = false;
            let t = '赞', v = ActionLike, i = 'like-o';
            moment.value.likes.forEach(item => {
                if (item.from_user == userStore.info.id) {
                    t = '取消';
                    v = ActionUnlike;
                    i = 'like';
                }
            });
            moment.value.actions = [
                { text: t, value: v, icon: i },
                { text: "评论", value: ActionComment, icon: 'comment-o' },
            ];
            if (refreshing.value)
                refreshing.value = false;
        });
    }, 100);
};

const handleInput = (data) => {
    // console.log("handleInput", data.value);
    content.value = data.value.content;
};

//评论朋友圈的回调
const onCommentCb = async (data) => {
    if (content.value) {
        momentApi.comment({
            id: props.momentId,
            to_user: toUser.value,
            content: content.value,
        }).then(res => {
            moment.value.comments.push(res.data);
            showCommonComment.value = false
            content.value = "";
        })
    }
};

//回复评论
const replySomeOne = (to, ph) => {
    toUser.value = to;
    placeholder.value = ph;
    onSelectAction(ref(ActionComment));
};

//下拉刷新朋友圈详情
const onRefreshDetail = () => {
    //重新加载数据
    //将 loading 设置为 true，表示处于加载状态
    refreshing.value = true;
    onLoadDetail();
};

//监听点赞、评论按钮
const onSelectAction = (action) => {
    console.log(action, props.momentId, toUser.value);
    switch (action.value) {
        //赞
        case ActionLike:
            momentApi.like(props.momentId).then((res) => {
                if (res.code == 200001) {
                    moment.value.likes.push(res.data);
                    moment.value.actions = [
                        { text: '取消', value: 'unlike', icon: 'like' },
                        { text: "评论", value: 'comment', icon: 'comment-o' },
                    ];
                }
            });
            break;
        //取消赞
        case ActionUnlike:
            momentApi.unlike(props.momentId).then((res) => {
                if (res.code == 200001) {
                    moment.value.likes = moment.value.likes.filter((item) => item.id != res.data.like_id);
                    moment.value.actions = [
                        { text: '赞', value: 'like', icon: 'like-o' },
                        { text: "评论", value: 'comment', icon: 'comment-o' },
                    ];
                }
            })
            break;
        case ActionComment:
            showCommonComment.value = true;
            break;
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

//朋友圈详情菜单选中
const onSelectMomentDetailAction = (action) => {

}
watch(() => props.show, (show) => {
    if (show) {
        onLoadDetail();
    } else {
        moment.value = {};
    }
});
</script>
<template>
    <van-popup v-model:show="props.show" position="right" :style="{ height: '100%', width: '100%' }" duration="0.2">
        <header>
            <van-nav-bar title="详情" left-arrow @click-left="$emit('hide')" :border="false"
                @click-right="showMomentDetailMenu = true">
                <template #right v-if="props.userId == userStore.info.id">
                    <van-icon name="ellipsis" />
                </template>
            </van-nav-bar>
        </header>
        <section>
            <div class="header"></div>
            <van-pull-refresh v-model="refreshing" @refresh="onRefreshDetail" class="container moment-container"
                style="background: var(--black20-white-color);" v-if="moment?.id">
                <div class="moment-detail">
                    <div class="content">
                        <div class="left">
                            <van-image width="3rem" height="3rem" fit="contain" :src="moment.user.avatar"
                                @click="gotoFriendInfo(moment.user.wechat)" radius="0.3rem" />
                        </div>
                        <div class="right">
                            <van-text-ellipsis :content="moment.user.nickname" class="nickname"
                                @click="gotoFriendInfo(moment.user.wechat)" />
                            <van-text-ellipsis :content="moment.content" class="content" rows="6" expand-text="展开"
                                collapse-text="收起" />
                            <van-uploader v-model="moment.files" :max-count="moment.files.length"
                                v-if="moment.files.length > 0" :deletable="false" />
                            <van-cell-group :border="false" style="background: transparent;">
                                <van-cell value="内容" style="padding: 0;background: transparent;">
                                    <template #title>
                                        <span style="color: var(--theme-gray-70);">{{ timestampFormat(moment.created_at)
                                            }}</span>
                                    </template>
                                    <template #value>
                                        <van-popover v-model:show="moment.showActionPopover" theme="dark"
                                            :actions="moment.actions" @select="onSelectAction"
                                            actions-direction="horizontal" placement="left-end">
                                            <template #reference>
                                                <van-button color="var(--black20-whitef7-color)" icon="ellipsis"
                                                    style="height: 16px;width: 20px;color: var(--theme-blue-1970)!important;cursor: pointer;" />
                                            </template>
                                        </van-popover>
                                    </template>
                                </van-cell>
                            </van-cell-group>

                        </div>
                    </div>
                    <div class="message">
                        <van-cell-group style="background: var(--black20-whitef7-color);margin-top: 8px;"
                            v-if="moment.likes.length > 0 || moment.comments.length > 0" class="message-box">
                            <van-cell v-if="moment.likes.length > 0" size="large">
                                <template #icon>
                                    <van-icon name="like-o" size="16" />
                                </template>
                                <template #title>
                                    <div class="like-box">
                                        <van-image :src="like.from.avatar" v-for="like in moment.likes" :key="like.id"
                                            height="2rem" width="2rem" radius="0.2rem"
                                            @click="gotoFriendInfo(like.from.wechat)" />
                                    </div>
                                </template>
                            </van-cell>
                            <van-cell v-for="(comment, index) in moment.comments" :key="comment.id" size="large">
                                <template #icon>
                                    <van-icon name="comment-o" size="16"
                                        :style="index == 0 ? '' : 'color: transparent'" />
                                </template>
                                <template #title>
                                    <div class="comment-box"
                                        @click="replySomeOne(comment.from_user, ('回复' + comment.from.nickname))">
                                        <van-cell style="padding: 0;">
                                            <template #icon>
                                                <van-image :src="comment.from.avatar" :key="comment.id" height="2rem"
                                                    width="2rem" radius="0.2rem"
                                                    @click="gotoFriendInfo(comment.from.wechat)" />
                                            </template>
                                            <template #title>
                                                <b>{{ comment.from.nickname }}</b>
                                            </template>
                                            <template #label>
                                                <span v-if="comment.to_user > 0">回复<b
                                                        @click="gotoFriendInfo(comment.to.wechat)">{{
                                                            comment.to.nickname
                                                        }}</b>:</span>
                                                {{ comment.content }}
                                            </template>
                                            <template #value>
                                                {{ timestampFormat(comment.created_at, true) }}
                                            </template>
                                        </van-cell>

                                    </div>
                                </template>
                            </van-cell>
                        </van-cell-group>
                    </div>
                </div>
            </van-pull-refresh>
            <common-comment :show="showCommonComment" :content="content" :placeholder="placeholder" position="bottom"
                @input="handleInput" @callback="onCommentCb" modules="emoji" @hide="showCommonComment = false" />
        </section>
    </van-popup>
    <van-action-sheet v-model:show="showMomentDetailMenu" :actions="momentDetailActions"
        @select="onSelectMomentDetailAction" cancel-text="取消" close-on-click-action />
</template>
<style lang="less">
.moment-container {
    .moment-detail {
        padding: 1rem 1rem;
        height: auto;
        width: 100%;
        position: relative;
        box-sizing: border-box;

        .content {
            display: flex;

            .left {
                width: 3rem;
                margin-right: 0.5rem;
            }

            .right {
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

        .message {
            display: flex;
            flex-direction: column;

            .message-box {
                background: var(--black20-whitef7-color);
                margin-top: 0.2rem;
                border-radius: 0.4rem;
                overflow: hidden;

                .van-icon {
                    position: absolute;
                    line-height: 2rem;
                    top: 0.4rem;
                }

                .like-box,
                .comment-box {
                    display: flex;
                    flex-wrap: wrap;
                    margin-left: 0.8rem;
                    padding: 0.2rem 0.4rem 0.4rem 0.4rem;

                    .van-image {
                        margin-top: 0.2rem;
                        margin-left: 0.2rem;
                    }
                }

                .comment-box {
                    .van-cell {
                        .van-cell__title {
                            margin-left: 4px;
                            font-size: 16px;

                            .van-cell__label {
                                font-size: 16px;
                            }
                        }

                        .van-cell__value {
                            font-size: 12px;

                        }

                        b {
                            color: var(--theme-blue-1970);
                        }
                    }
                }

                .van-cell {
                    padding: 0px 6px;
                    background: var(--black20-whitef7-color);
                }
            }
        }
    }
}
</style>