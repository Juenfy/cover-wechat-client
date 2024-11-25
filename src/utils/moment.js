import { ref } from "vue";

export const momentList = ref([]);

export const likeMoment = (data) => {
    momentList.value.forEach((item, index) => {
        if (item.id == data.moment_id) {
            momentList.value[index].likes.push(data);
            momentList.value[index].actions = [
                { text: '取消', value: 'unlike', icon: 'like' },
                { text: "评论", value: 'comment', icon: 'comment-o' },
            ];
        }
    });
}

export const unlikeMoment = (data) => {
    momentList.value.forEach((item, i) => {
        if (item.id == data.moment_id) {
            momentList.value[i].likes.forEach((like, j) => {
                if (like.id == data.like_id) {
                    momentList.value[i].likes.splice(j, 1);
                    momentList.value[i].actions = [
                        { text: '赞', value: 'like', icon: 'like-o' },
                        { text: "评论", value: 'comment', icon: 'comment-o' },
                    ];
                }
            })
        }
    })
}

export const commentMoment = (data) => {
    momentList.value.forEach((item, i) => {
        if (item.id == data.moment_id) {
            momentList.value[i].comments.push(data);
        }
    })
}