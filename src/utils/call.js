import { ref } from "vue";

export const isCall = ref(false);
export const caller = ref(null);
export const callType = ref(null);

export const startCall = async (type) => {
    isCall.value = true;
    callType.value = type;
};

export const overCall = async () => {
    isCall.value = false;
};

export const setCaller = async (data) => {
    caller.value = data;
}