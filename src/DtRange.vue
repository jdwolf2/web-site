<template>
  <div style="display: none">
    <EjsDaterangepicker
      ref="drp"
      :cssClass="isMobile ? 'e-device' : ''"
      :watermark="waterMark"
      :value="computedValue"
      format="MMM d, yyyy"
      separator=" to "
      :allowEdit="false"
      :openOnFocus="false"
      :showClearButton="false"
      :autoFit="true"
      :responsive="true"
      :fullScreenMode="false"
      @change="handleChange"
      @open="onOpen"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { DateRangePickerComponent as EjsDaterangepicker } from '@syncfusion/ej2-vue-calendars'

// Props
const props = defineProps({
  startUnix: Number,
  stopUnix: Number,
})

// Emits
const emit = defineEmits(['update:start', 'update:stop'])

// Refs
const drp = ref(null)
const isMobile = ref(false)
const waterMark = 'Select Date Range'

// Responsive check
function updateMobileFlag() {
  isMobile.value = window.innerWidth <= 768
}
onMounted(() => {
  updateMobileFlag()
  window.addEventListener('resize', updateMobileFlag)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateMobileFlag)
})

// Computed: date range value passed to the picker
const computedValue = computed(() => ({
  startDate: props.startUnix ? new Date(props.startUnix * 1000) : null,
  endDate: props.stopUnix ? new Date(props.stopUnix * 1000) : null,
}))

// Expose method to parent
function openPicker() {
  drp.value?.show()
}
defineExpose({ openPicker })

// Emit updated values when user selects date range
function handleChange(args) {
  const startUnix = args.startDate ? Math.floor(args.startDate.getTime() / 1000) : null
  const endUnix = args.endDate ? Math.floor(args.endDate.getTime() / 1000) : null

  emit('update:start', startUnix)
  emit('update:stop', endUnix)
}

// Popup open handler for positioning
function onOpen(args) {
  if (isMobile.value) {
    // Mobile: stacked calendar, Syncfusion handles layout
    return
  }

  // Desktop: exact pixel positioning relative to page
  args.popup.relateTo = document.body
  args.popup.targetType = 'container'
  args.popup.position = { X: 'left', Y: 'top' }
  args.popup.offsetX = 232  // left: 232px
  args.popup.offsetY = 95   // top: 95px
  args.popup.zIndex = 10000
}
</script>
