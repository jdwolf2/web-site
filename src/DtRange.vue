<template>
  <div style="display: none">
    <EjsDaterangepicker
      ref="drp"
      :open="onOpen"
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
    />
  </div>
</template>
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
      :fullScreenMode="false"
      @change="handleChange"
      @open="onOpen"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { DateRangePickerComponent as EjsDaterangepicker } from '@syncfusion/ej2-vue-calendars'

// Props
const props = defineProps({
  startUnix: Number,
  stopUnix: Number,
})

// Emits
const emit = defineEmits(['update:start', 'update:stop'])

// Ref to the calendar component
const drp = ref(null)

// Watermark label
const waterMark = 'Select Date Range'

// Computed binding for initial date value
const computedValue = computed(() => ({
  startDate: props.startUnix ? new Date(props.startUnix * 1000) : null,
  endDate: props.stopUnix ? new Date(props.stopUnix * 1000) : null,
}))

// Expose method to parent
function openPicker() {
  drp.value?.show()
}
defineExpose({ openPicker })

// Handle date change
function handleChange(args) {
  const startUnix = args.startDate
    ? Math.floor(args.startDate.getTime() / 1000)
    : null
  const endUnix = args.endDate
    ? Math.floor(args.endDate.getTime() / 1000)
    : null

  emit('update:start', startUnix)
  emit('update:stop', endUnix)
}

// Optional: reposition the popup
function onOpen(args) {
  args.popup.position = { X: '18px', Y: '95px' }
}
</script>

