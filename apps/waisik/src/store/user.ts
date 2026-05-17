import type { IUserInfoRes } from '@/api/types/login'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUserInfo,
} from '@/api/login'

const userInfoState: IUserInfoRes = {
  userId: -1,
  username: '',
  nickname: '',
  avatar: '/static/images/default-avatar.png',
}

/**
 * 用户信息状态管理
 * 负责用户基本信息的存储和更新
 */
export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserInfoRes>({ ...userInfoState })

    const setUserInfo = (val: IUserInfoRes) => {
      if (!val.avatar) {
        val.avatar = userInfoState.avatar
      }
      userInfo.value = val
    }

    const setUserAvatar = (avatar: string) => {
      userInfo.value.avatar = avatar
    }

    const clearUserInfo = () => {
      userInfo.value = { ...userInfoState }
      uni.removeStorageSync('user')
    }

    /**
     * 从服务器获取最新用户信息
     */
    const fetchUserInfo = async () => {
      const res = await getUserInfo()
      setUserInfo(res)
      return res
    }

    return {
      userInfo,
      clearUserInfo,
      fetchUserInfo,
      setUserInfo,
      setUserAvatar,
    }
  },
  {
    persist: true,
  },
)
