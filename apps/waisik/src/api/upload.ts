import type { IUploadImageResponse } from './types/upload'
import { http } from '@/http/http'

/**
 * 上传图片
 * @param file 图片文件
 * @returns Promise<IUploadImageResponse> 上传结果（包含图片URL）
 */
export function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('image', file)

  return http.post<IUploadImageResponse>('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 上传图片（小程序版本）
 * @param filePath 本地文件路径
 * @returns Promise<IUploadImageResponse> 上传结果（包含图片URL）
 */
export function uploadImageMiniProgram(filePath: string) {
  return new Promise<IUploadImageResponse>((resolve, reject) => {
    uni.uploadFile({
      url: `${http.defaults.baseURL}/upload/image`,
      filePath,
      name: 'image',
      header: {
        // 如果需要认证，添加 token
        // 'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data)
          resolve(data)
        } else {
          reject(new Error('上传失败'))
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

/**
 * 选择并上传图片（小程序版本）
 * @param count 最多可选择的图片数量，默认 9
 * @returns Promise<string[]> 上传成功的图片URL数组
 */
export function chooseAndUploadImages(count: number = 9) {
  return new Promise<string[]>((resolve, reject) => {
    uni.chooseImage({
      count,
      sizeType: ['compressed'], // 压缩图
      sourceType: ['album', 'camera'],
      success: async (res) => {
        try {
          const uploadPromises = res.tempFilePaths.map(filePath =>
            uploadImageMiniProgram(filePath)
          )
          const results = await Promise.all(uploadPromises)
          const urls = results.map(result => result.url)
          resolve(urls)
        } catch (error) {
          reject(error)
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
