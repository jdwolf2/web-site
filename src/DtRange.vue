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
    />
  </div>
</template>

<script>
import { DateRangePickerComponent as EjsDaterangepicker } from '@syncfusion/ej2-vue-calendars'

export default {
  name: 'DtRange',
  components: { EjsDaterangepicker },
  props: {
    startUnix: Number,
    stopUnix: Number,
  },
  emits: ['update:start', 'update:stop'],
  data() {
    return {
      waterMark: 'Select Date Range',
    }
  },
  computed: {
    computedValue() {
      // Always provide the picker a {startDate, endDate}
      return {
        startDate: this.startUnix ? new Date(this.startUnix * 1000) : null,
        endDate: this.stopUnix ? new Date(this.stopUnix * 1000) : null,
      }
    },
  },
  methods: {
    openPicker() {
      // Show the calendar programmatically
      if (this.$refs.drp && typeof this.$refs.drp.show === 'function') {
        this.$refs.drp.show()
      }
    },
    handleChange(args) {
      const startUnix = args.startDate
        ? Math.floor(args.startDate.getTime() / 1000)
        : null
      const endUnix = args.endDate
        ? Math.floor(args.endDate.getTime() / 1000)
        : null
      this.$emit('update:start', startUnix)
      this.$emit('update:stop', endUnix)
    },
  },
}
</script>
