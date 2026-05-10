/**
 * Upload API Type Definitions
 * 上传相关接口类型定义
 */

export interface IUploadImageResponse {
  url: string
}

export interface IUploadOptions {
  maxSize?: number // 最大文件大小（字节），默认 5MB
  allowedTypes?: string[] // 允许的文件类型，默认 ['jpg', 'jpeg', 'png', 'webp']
}
