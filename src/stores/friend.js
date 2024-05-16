import { reactive, ref } from "vue";
import { defineStore } from "pinia";
export const useFriendStore = defineStore("friend", () => {
  const list = ref([]);
  const setting = reactive({});
  const applyList = reactive({
    threeDay: [],
    overThreeDay: [],
  });
  const setList = (data) => {
    list.value = data;
  };
  const setApplyList = (data) => {
    applyList.threeDay = data.three_day;
    applyList.overThreeDay = data.over_three_day;
  };
  const setSetting = (data) => {
    setting = data;
  };
  const deleteApply = (id, type) => {
    if (type == "threeDay")
      applyList.threeDay = applyList.threeDay.filter((item) => item.id !== id);
    else
      applyList.overThreeDay = applyList.overThreeDay.filter(
        (item) => item.id !== id
      );
  };
  return {
    list,
    applyList,
    setting,
    setList,
    setApplyList,
    setSetting,
    deleteApply,
  };
});
