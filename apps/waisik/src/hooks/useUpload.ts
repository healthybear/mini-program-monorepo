import type { UploadError, UploadResponse, UploadSuccessData } from '@/types/upload'
import { ref } from 'vue'
import { getEnvBaseUrl } from '@/utils/index'

const VITE_UPLOAD_BASEURL = `${getEnvBaseUrl()}/upload`

type TfileType = 'image' | 'file'
type TImage = 'png' | 'jpg' | 'jpeg' | 'webp' | '*'
type TFile = 'doc' | 'docx' | 'ppt' | 'zip' | 'xls' | 'xlsx' | 'txt' | TImage

interface TOptions<T extends TfileType> {
  formData?: Record<string, string | number | boolean>
  maxSize?: number
  accept?: T extends 'image' ? TImage[] : TFile[]
  fileType?: T
  success?: (params: UploadSuccessData) => void
  error?: (err: UploadError) => void
}

export default function useUpload<T extends TfileType>(options: TOptions<T> = {} as TOptions<T>) {
  const {
    formData = {},
    maxSize = 5 * 1024 * 1024,
    accept = ['*'],
    fileType = 'image',
    success,
    error: onError,
  } = options

  const loading = ref(false)
  const error = ref<UploadError | null>(null)
  const data = ref<UploadSuccessData | null>(null)

  const handleFileChoose = ({ tempFilePath, size }: { tempFilePath: string, size: number }) => {
    if (size > maxSize) {
      uni.showToast({
        title: `文件大小不能超过 ${maxSize / 1024 / 1024}MB`,
        icon: 'none',
      })
      return
    }

    loading.value = true
    uploadFile({
      tempFilePath,
      formData,
      onSuccess: (res) => {
        // 修改这里的解析逻辑，适应不同平台的返回格式
        let parsedData: UploadSuccessData = res
        try {
          // 尝试解析为JSON
          const jsonData = JSON.parse(res) as UploadResponse
          // 检查是否包含data字段
          parsedData = (jsonData as { data?: UploadResponse }).data || jsonData
        }
        catch (e) {
          // 如果解析失败，使用原始数据
        }
        data.value = parsedData
        success?.(parsedData)
      },
      onError: (err) => {
        error.value = err
        onError?.(err)
      },
      onComplete: () => {
        loading.value = false
      },
    })
  }

  const run = () => {
    // 微信小程序从基础库 2.21.0 开始， wx.chooseImage 停止维护，请使用 uni.chooseMedia 代替。
    // 微信小程序在2023年10月17日之后，使用本API需要配置隐私协议
    const handleSuccess = (res: UniApp.ChooseImageSuccessCallbackResult | UniApp.ChooseMediaSuccessCallbackResult) => {
      // 小程序中res:{errMsg: "chooseImage:ok", tempFiles: [{fileType: "image", size: 48976, tempFilePath: "http://tmp/5iG1WpIxTaJf3ece38692a337dc06df7eb69ecb49c6b.jpeg"}]}
      // h5中res:{errMsg: "chooseImage:ok", tempFilePaths: "blob:http://localhost:9000/f74ab6b8-a14d-4cb6-a10d-fcf4511a0de5", tempFiles: [File]}
      // h5的File有以下字段：{name: "girl.jpeg", size: 48976, type: "image/jpeg"}
      // App中res:{errMsg: "chooseImage:ok", tempFilePaths: "file:///Users/feige/xxx/gallery/1522437259-compressed-IMG_0006.jpg", tempFiles: [File]}
      // App的File有以下字段：{path: "file:///Users/feige/xxx/gallery/1522437259-compressed-IMG_0006.jpg", size: 48976}
      let tempFilePath = ''
      let size = 0
      // #ifdef MP-WEIXIN
      const mediaRes = res as UniApp.ChooseMediaSuccessCallbackResult
      tempFilePath = mediaRes.tempFiles[0].tempFilePath
      size = mediaRes.tempFiles[0].size
      // #endif
      // #ifndef MP-WEIXIN
      const imageRes = res as UniApp.ChooseImageSuccessCallbackResult
      tempFilePath = imageRes.tempFilePaths[0]
      size = imageRes.tempFiles[0].size
      // #endif
      handleFileChoose({ tempFilePath, size })
    }

    const handleFail = (err: UniApp.GeneralCallbackResult) => {
      console.error('File selection failed:', err)
      error.value = err as UploadError
      onError?.(err as UploadError)
    }

    const chooseFileOptions = {
      count: 1,
      success: handleSuccess,
      fail: handleFail,
    }

    if (fileType === 'image') {
      // #ifdef MP-WEIXIN
      uni.chooseMedia({
        ...chooseFileOptions,
        mediaType: ['image'],
      } as any)
      // #endif

      // #ifndef MP-WEIXIN
      uni.chooseImage(chooseFileOptions as UniApp.ChooseImageOptions)
      // #endif
    }
    else {
      uni.chooseFile({
        ...chooseFileOptions,
        type: 'all',
      } as any)
    }
  }

  return { loading, error, data, run }
}

async function uploadFile({
  tempFilePath,
  formData,
  onSuccess,
  onError,
  onComplete,
}: {
  tempFilePath: string
  formData: Record<string, string | number | boolean>
  onSuccess: (data: string) => void
  onError: (err: UploadError) => void
  onComplete: () => void
}) {
  uni.uploadFile({
    url: VITE_UPLOAD_BASEURL,
    filePath: tempFilePath,
    name: 'file',
    formData,
    success: (uploadFileRes: UniApp.UploadFileSuccessCallbackResult) => {
      try {
        const data = uploadFileRes.data
        onSuccess(data)
      }
      catch (err) {
        onError(err as UploadError)
      }
    },
    fail: (err: UniApp.GeneralCallbackResult) => {
      console.error('Upload failed:', err)
      onError(err as UploadError)
    },
    complete: onComplete,
  })
}
