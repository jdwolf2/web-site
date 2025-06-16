<template>
  <div class="app-container">
    <div class="top-line-wrapper">
      <div class="top-line">
        <!-- Far left: Logo -->

        <!-- Date Range button -->
        <button
          @click="triggerDateRange"
          class="select-date"
          :disabled="!isAuthenticated"
        >
          Select Date Range
        </button>

        <!-- Start/end date input -->
        <input
          type="text"
          class="date-display"
          :value="isAuthenticated ? dateRangeDisplay : ''"
          :placeholder="!isAuthenticated ? 'Sign in to select dates' : ''"
          readonly
          :disabled="!isAuthenticated"
        />

        <!-- Sign in/out button -->
        <button class="sign-in" v-if="!isAuthenticated" @click="onSignInClick">
          Sign in
        </button>
        <button class="sign-out" v-if="isAuthenticated" @click="onSignOutClick">
          Sign out
        </button>

        <!-- Hidden Date Picker -->
        <DtRange
          ref="dtRangeRef"
          :startUnix="startDate"
          :stopUnix="stopDate"
          @update:start="onStartDateUpdate"
          @update:stop="onStopDateUpdate"
        />
      </div>
    </div>

    <!-- Grid Display -->
    <div v-if="isAuthenticated && itemsFetched" class="grid-wrapper">
      <Grid :data="items" />
      <div v-if="statusMessage" class="status-msg">
        {{ statusMessage }}
      </div>
    </div>

    <div v-if="fetchError" style="color: red">Error: {{ fetchError }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuth } from './useAuth.js'
import { useDynamoDB } from './useDynamoDB.js'
import DtRange from './DtRange.vue'
import Grid from './Grid.vue'

// ---- Default dates ----
function getUnix(month, day, year) {
  return Math.floor(new Date(year, month - 1, day).getTime() / 1000)
}

const startDate = ref(null)
const stopDate = ref(null)

// const defaultStartUnix = getUnix(7, 1, 2020)
// const defaultStopUnix = getUnix(11, 23, 2020)

// const startDate = ref(defaultStartUnix)
// const stopDate = ref(defaultStopUnix)

const dtRangeRef = ref(null)

// ---- Auth ----
const { user, signIn, signOut, checkAuth } = useAuth()
const isAuthenticated = computed(() => !!user.value)
onMounted(() => {
  if (typeof checkAuth === 'function') checkAuth()
})
function onSignInClick() {
  if (typeof signIn === 'function') signIn()
}
function onSignOutClick() {
  if (typeof signOut === 'function') signOut()
}

// ---- Date logic ----
function triggerDateRange() {
  if (!isAuthenticated.value) {
    alert('Please sign in to select dates.')
    return
  }
  dtRangeRef.value?.openPicker()
}
function onStartDateUpdate(val) {
  if (val != null) startDate.value = val
}
function onStopDateUpdate(val) {
  if (val != null) stopDate.value = val
}
function formatUnix(unix) {
  if (unix == null) return '—'
  const d = new Date(unix * 1000)
  const m = d.toLocaleString('en-US', { month: 'short' })
  return `${m} ${d.getDate()} ${d.getFullYear()}`
}
const formattedStartDate = computed(() => formatUnix(startDate.value))
const formattedStopDate = computed(() => formatUnix(stopDate.value))
const dateRangeDisplay = computed(() =>
  startDate.value && stopDate.value
    ? `${formattedStartDate.value}  to  ${formattedStopDate.value}`
    : ''
)

// ---- Data & fetch ----
const { items, fetchError, itemsFetched, fetchItems } = useDynamoDB()
const isLoading = ref(false)
const statusMessage = ref('')

watch([startDate, stopDate, isAuthenticated], async ([start, stop, authed]) => {
  if (authed && Number.isInteger(start) && Number.isInteger(stop)) {
    await fetchItems(start.toString(), stop.toString())
  }
})
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

.app-container {
  width: 100%;
  font-family: Arial, sans-serif;
}

.top-line-wrapper {
  margin-top: 0; /* or even 0px */
  margin-bottom: 0; /* Ensures no extra space around the top line */
}

.select-date:disabled {
  margin-left: 10;
  background: #f0f0f0;
  color: #a0a0a0;
  cursor: not-allowed;
  border: 1px solid #e0e0e0;
  opacity: 1; /* Ensures the button does not appear "faded away" unless you want it to */
  font-size: 14px;
  height: 25px;
  padding: 0 10px;
  border-radius: 5px;
  margin-right: 0.4em;
  margin-left: 10px;
  white-space: nowrap;
  width: auto;
  min-width: 0;
}

.select-date {
  font-size: 14px;
  height: 25px;
  padding: 0 10px;
  border-radius: 5px;
  background: lightblue;
  color: black;
  border: none;
  cursor: pointer;
  margin-right: 0.4em;
  margin-left: 10px;
  white-space: nowrap;
  width: auto;
  min-width: 0;
}
.select-date:hover:enabled {
  background: #125da4;
  color: #fff;
}
.top-line {
  display: flex;
  align-items: center; /* Aligns items to the bottom */
  justify-content: flex-start; /* 🔧 ensures everything aligns left */
  width: 100%;
  gap: 0.2em; /* optional: adds consistent spacing between elements */
}
/* .logo {
  height: 20px;
  margin-left: auto;
  width: auto;
  height: 30px;
  margin-right: 20px;
} */

.sign-in {
  font-size: 14px;
  height: 25px;
  padding: 0 10px;
  border-radius: 5px;
  background: lightgreen;
  color: black;
  border: none;
  cursor: pointer;
  margin-left: 0;
  white-space: nowrap;
  width: auto;
  min-width: 0;
}
.sign-in:hover:enabled {
  background: green;
  color: white;
}

.sign-out {
  font-size: 14px;
  height: 25px;
  padding: 0 10px;
  border-radius: 5px;
  background: lightyellow;
  color: black;
  border: none;
  cursor: pointer;
  margin-left: 0;
  white-space: nowrap;
  width: auto;
  min-width: 0;
}
.sign-out:hover:enabled {
  background: yellow;
  color: black;
}

.date-display {
  font-size: 16px;
  height: 25px;
  border-radius: 5px;
  border: 1px solid #bdbdbd;
  background: #f5f5f5;
  padding: 0 12px;
  min-width: 210px;
  margin-right: 0.4em;
}

.results-table {
  margin-top: 1.2em;
  border-collapse: collapse;
  width: 100%;
}
.results-table th,
.results-table td {
  border: 1px solid #ccc;
  padding: 8px 12px;
  font-size: 1rem;
}
.results-table th {
  background: #f5f5f5;
  font-weight: bold;
}
.no-data-msg {
  margin-top: 1em;
  color: #d32f2f;
  background: #fff4f4;
  border: 1px solid #ffcdd2;
  padding: 12px 18px;
  border-radius: 7px;
  font-size: 1.12rem;
  text-align: left;
  letter-spacing: 0.01em;
}

.status-msg {
  margin: 0.5em 10px;
  font-size: 1rem;
  color: #333;
  background: #f1f1f1;
  border-left: 4px solid #2196f3;
  padding: 8px 12px;
  border-radius: 4px;
}

.grid-wrapper {
  margin: 4px 10px 0 10px;
  text-align: left;
}
</style>
