import { defineStore } from 'pinia'

export const useQueryStore = defineStore('query', {
  state: () => ({
    queryParams: {}  // 用于存储查询参数
  }),
  getters: {
    // 获取完整的查询字符串
    queryString: (state) => {
      return Object.entries(state.queryParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
    },
    // 获取单个查询参数
    getQueryParam: (state) => (key) => {
      return state.queryParams[key] || null
    }
  },
  actions: {
    // 设置单个查询参数
    setQueryParam(key, value) {
      this.queryParams[key] = value
    },
    // 移除单个查询参数
    removeQueryParam(key) {
      delete this.queryParams[key]
    },
    // 清空所有查询参数
    clearQueryParams() {
      this.queryParams = {}
    },
    // 从 URL 中解析查询字符串
    setQueryFromUrl(url) {
      const queryString = url.split('?')[1] || ''
      const params = new URLSearchParams(queryString)
      params.forEach((value, key) => {
        this.queryParams[key] = value
      })
    }
  }
})