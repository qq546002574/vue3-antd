<template>
  <div class="client-info">
    <a-descriptions size="small" :column="2">
      <!--      <a-descriptions-item v-for="(value, key) in formatKeys" :key="key" :label="value">-->
      <!--        {{ infoObj[key] }}-->
      <!--      </a-descriptions-item>-->
      <a-descriptions-item label="终端别名">
        {{ infoObj.cname }}
      </a-descriptions-item>
      <a-descriptions-item label="所属部门">
        {{ infoObj.cname }}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'
import {Descriptions} from 'ant-design-vue'
import {clientDept} from "@/api/client";

export default defineComponent({
  name: "base-info",
  components: {ADescriptions: Descriptions, ADescriptionsItem: Descriptions.Item},
  setup(props, {attrs}) {

    const infoObj = ref({})

    onMounted(async () => {
      infoObj.value = await clientDept({},  attrs.pid)
      console.log(infoObj.value)
    })

    return {
      infoObj,
    }
  }
})
</script>

<style scoped>

</style>
