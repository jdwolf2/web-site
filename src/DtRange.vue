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
      :autoFit="false"
      :responsive="true"
      :fullScreenMode="false"
      @change="handleChange"
    />
  </div>
</template>

<script>
import { DateRangePickerComponent as EjsDaterangepicker } from '@syncfusion/ej2-vue-calendars'
const classVal = 'customCSS'
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

<style>
@import '~@syncfusion/ej2-base/styles/material.css';
@import '~@syncfusion/ej2-buttons/styles/material.css';
@import '~@syncfusion/ej2-calendars/styles/material.css';
@import '~@syncfusion/ej2-dropdowns/styles/material.css';
@import '~@syncfusion/ej2-inputs/styles/material.css';
@import '~@syncfusion/ej2-navigations/styles/material.css';
@import '~@syncfusion/ej2-popups/styles/material.css';
@import '~@syncfusion/ej2-splitbuttons/styles/material.css';
@import '~@syncfusion/ej2-vue-grids/styles/material-lite.css';

.e-date-range-container {
  position: absolute;
  top: -120px !important; /* ← Adjust as needed */
  left: -220px !important;
  height: 100px !important; /* ← Set to your desired height */
  min-height: 100px;
}

.e-footer {
  position: absolute !important;
  top: 40px !important; /* ← Adjust as needed */
  left: 25px !important;
  padding: 30px 0 32px 0;
}

.e-daterangepicker.e-popup .e-range-header {
  position: absolute;
  top: 0;
  left: 300px;
  background: beige;
  height: 10px;
  /* display: none; */
}

/* To specify color and font size */
.e-daterangepicker.e-popup .e-range-header .e-start-label,
.e-daterangepicker.e-popup .e-range-header .e-end-label {
  color: brown;
  font-size: 16px;
}
.e-start-btn {
  position: absolute !important;
  width: 121px !important;
  top: -62px !important;
  left: -317px !important;
}
.e-end-btn {
  position: absolute !important;
  width: 121px !important;
  top: -62px !important;
  left: -196px !important;
}

.e-end-btn e-lib e-btn e-control {
  width: 200px !important;
}
</style>
