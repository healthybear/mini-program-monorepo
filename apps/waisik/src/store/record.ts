import type { ICreateExploreRecordDto, IExploreRecord, IExploreRecordDetail, IExploreRecordListQuery, IUpdateExploreRecordDto } from '@/api/types/record'
import { createRecord, deleteRecord, getRecordDetail, getRecordList, updateRecord } from '@/api/record'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecordStore = defineStore(
  'record',
  () => {
    const records = ref<IExploreRecord[]>([])
    const currentRecord = ref<IExploreRecordDetail | null>(null)
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const hasMore = ref(true)
    const loading = ref(false)

    /**
     * 获取记录列表（支持分页加载）
     * @param reset 是否重置列表（下拉刷新时使用）
     */
    const fetchRecords = async (reset = false) => {
      if (loading.value)
        return
      if (!reset && !hasMore.value)
        return

      loading.value = true
      try {
        if (reset) {
          currentPage.value = 1
          records.value = []
        }

        const query: IExploreRecordListQuery = {
          pageNum: currentPage.value,
          pageSize: pageSize.value,
          sortBy: 'latest',
        }

        const res = await getRecordList(query)

        if (reset) {
          records.value = res.list
        }
        else {
          records.value.push(...res.list)
        }

        total.value = res.total
        hasMore.value = records.value.length < res.total
        currentPage.value += 1
      }
      catch (error) {
        console.error('获取记录列表失败:', error)
        throw error
      }
      finally {
        loading.value = false
      }
    }

    /**
     * 获取记录详情
     */
    const fetchRecordDetail = async (id: string) => {
      try {
        const record = await getRecordDetail(id)
        currentRecord.value = record
        const index = records.value.findIndex(r => r._id === id)
        if (index > -1) {
          records.value[index] = record
        }
        return record
      }
      catch (error) {
        console.error('获取记录详情失败:', error)
        throw error
      }
    }

    /**
     * 创建记录
     */
    const addRecord = async (data: ICreateExploreRecordDto) => {
      try {
        const record = await createRecord(data)
        records.value.unshift(record)
        total.value += 1
        return record
      }
      catch (error) {
        console.error('创建记录失败:', error)
        throw error
      }
    }

    /**
     * 更新记录
     */
    const modifyRecord = async (id: string, data: IUpdateExploreRecordDto) => {
      try {
        const record = await updateRecord(id, data)
        const index = records.value.findIndex(r => r._id === id)
        if (index > -1) {
          records.value[index] = record
        }
        return record
      }
      catch (error) {
        console.error('更新记录失败:', error)
        throw error
      }
    }

    /**
     * 删除记录
     */
    const removeRecord = async (id: string) => {
      try {
        await deleteRecord(id)
        const index = records.value.findIndex(r => r._id === id)
        if (index > -1) {
          records.value.splice(index, 1)
          total.value -= 1
        }
      }
      catch (error) {
        console.error('删除记录失败:', error)
        throw error
      }
    }

    /**
     * 清空列表
     */
    const clearRecords = () => {
      records.value = []
      total.value = 0
      currentPage.value = 1
      hasMore.value = true
    }

    return {
      records,
      currentRecord,
      total,
      currentPage,
      pageSize,
      hasMore,
      loading,
      fetchRecords,
      fetchRecordDetail,
      addRecord,
      modifyRecord,
      removeRecord,
      clearRecords,
    }
  },
  {
    persist: {
      paths: ['records', 'total'],
    },
  },
)
