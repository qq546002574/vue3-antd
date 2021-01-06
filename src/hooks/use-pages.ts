import { watch, ref, reactive } from "vue"

export interface PageOption {
  pageSize?: number
}

export function usePages<T>(watchCallback: () => T[], pageOption?: PageOption) {
  const { pageSize = 10 } = pageOption || {}

  const rawData = ref<T[]>([])
  const data = ref<T[]>([])

  // 提供给ant-pagination组件的参数
  const bindings = reactive({
    current: 1,
    currentChange: (currentPage: number) => {
      // @ts-ignorey
      data.value = sliceData(rawData.value, currentPage)
    }
  })

  // 根据页数切分数据
  const sliceData = (rawData: T[], currentPage: number) => {
    return rawData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  }

  watch(watchCallback, values => {
    // @ts-ignore
    rawData.value = values
    bindings.currentChange(1)
  })

  return {
    data,
    bindings
  }
}
