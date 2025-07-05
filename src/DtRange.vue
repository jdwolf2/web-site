<template>
  <div style="display: none">
    <EjsDaterangepicker
      ref="drp"
      :watermark="waterMark"
      :value="computedValue"
      format="MMM d, yyyy"
      separator=" to "
      :allowEdit="false"
      :openOnFocus="false"
      :showClearButton="false"
      :autoFit="true"
      :responsive="true"
      :fullScreenMode="isMobileWidth"
      @change="handleChange"
      @open="onOpen"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { DateRangePickerComponent as EjsDaterangepicker } from '@syncfusion/ej2-vue-calendars'

const props = defineProps({
  startUnix: Number,
  stopUnix: Number,
})

const emit = defineEmits(['update:start', 'update:stop'])
const drp = ref(null)
const waterMark = 'Select Date Range'

const computedValue = computed(() => ({
  startDate: props.startUnix ? new Date(props.startUnix * 1000) : null,
  endDate: props.stopUnix ? new Date(props.stopUnix * 1000) : null,
}))

const openPicker = () => drp.value?.show()
defineExpose({ openPicker })

function handleChange(args) {
  const startUnix = args.startDate ? Math.floor(args.startDate.getTime() / 1000) : null
  const endUnix = args.endDate ? Math.floor(args.endDate.getTime() / 1000) : null
  emit('update:start', startUnix)
  emit('update:stop', endUnix)
}

const isMobileWidth = ref(window.innerWidth < 1000)
function updateWidth() {
  isMobileWidth.value = window.innerWidth < 1000
}
onMounted(() => window.addEventListener('resize', updateWidth))
onUnmounted(() => window.removeEventListener('resize', updateWidth))

function onOpen(args) {
  if (!isMobileWidth.value) {
    args.popup.element.style.position = 'fixed'
    args.popup.element.style.left = '18px'
    args.popup.element.style.top = '95px'
    args.popup.element.style.zIndex = '10000'
  }
}
</script>

<style scoped>
.e-daterangepicker.e-popup {
  max-width: 300px;
}
</style>
