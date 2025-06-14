<template>
  <div class="app-container">
    <div class="top-line">
      <!-- Far left: Logo -->
      <img src="./assets/tableLogo.jpg" alt="AccuSalt Logo" class="logo" />

      <!-- Date Range button -->
      <button
        @click="triggerDateRange"
        class="select-date"
        :disabled="!isAuthenticated"
      >
        Date Range
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
      <!-- Sign in/out button always right of date input -->
      <button class="sign-in" v-if="!isAuthenticated" @click="onSignInClick">
        Sign in
      </button>
      <button class="sign-out" v-if="isAuthenticated" @click="onSignOutClick">
        Sign out
      </button>
      <!-- Hidden DtRange component (calendar) -->
      <DtRange
        ref="dtRangeRef"
        :startUnix="startDate"
        :stopUnix="stopDate"
        @update:start="onStartDateUpdate"
        @update:stop="onStopDateUpdate"
      />
    </div>

    <!-- Table/results below -->
    <div v-if="isAuthenticated && itemsFetched">
      <table v-if="items.length" class="results-table">
        <thead>
          <tr>
            <th v-for="key in tableHeaders" :key="key">{{ key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id || item.ID || item.timestamp || item.pk"
          >
            <td v-for="key in tableHeaders" :key="key">{{ item[key] }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="no-data-msg">No data found for selected range.</div>
    </div>
    <div v-if="fetchError" style="color: red">Error: {{ fetchError }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuth } from './useAuth.js'
import { useDynamoDB } from './useDynamoDB.js'
import DtRange from './DtRange.vue'

// ---- Default dates: JUL/01/2020 - NOV/23/2020 ----
function getUnix(month, day, year) {
  return Math.floor(new Date(year, month - 1, day).getTime() / 1000)
}
const defaultStartUnix = getUnix(7, 1, 2020)
const defaultStopUnix = getUnix(11, 23, 2020)

const startDate = ref(defaultStartUnix)
const stopDate = ref(defaultStopUnix)
const dtRangeRef = ref(null)

// ---- Auth state & logic ----
const { user, signIn, signOut, checkAuth } = useAuth()
const isAuthenticated = computed(() => !!user.value)
onMounted(() => {
  if (typeof checkAuth === 'function') checkAuth()
})

function onSignInClick() {
  if (typeof signIn === 'function') signIn()
  else console.error('signIn is not a function')
}
function onSignOutClick() {
  if (typeof signOut === 'function') signOut()
  else console.error('signOut is not a function')
}

// ---- Date picker logic ----
function triggerDateRange() {
  if (!isAuthenticated.value) {
    alert('Please sign in to select dates.')
    return
  }
  if (dtRangeRef.value && typeof dtRangeRef.value.openPicker === 'function') {
    dtRangeRef.value.openPicker()
  }
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

// ---- DynamoDB query integration ----
const { items, fetchError, itemsFetched, fetchItems } = useDynamoDB()
const tableHeaders = computed(() =>
  items.value.length > 0 ? Object.keys(items.value[0]) : []
)
watch([startDate, stopDate, isAuthenticated], async ([start, stop, authed]) => {
  if (authed && start && stop) {
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
  min-width: 600px; /* Ensures no wrapping of the top line */
  font-family: Arial, sans-serif;
}

.select-date:disabled {
  background: #f0f0f0;
  color: #a0a0a0;
  cursor: not-allowed;
  border: 1px solid #e0e0e0;
  opacity: 1; /* Ensures the button does not appear "faded away" unless you want it to */
}

.top-line {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5em 0;
}

.logo {
  height: 20px;
  width: auto;
  margin-right: 10px;
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
  white-space: nowrap;
  width: auto;
  min-width: 0;
}
.select-date:hover:enabled {
  background: #125da4;
  color: #fff;
}

.sign-in {
  font-size: 14px;
  height: 25px;
  padding: 0 10px;
  border-radius: 5px;
  background: lightgreen;
  color: black;
  border: none;
  cursor: pointer;
  margin-right: 0.4em;
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
  margin-right: 0.4em;
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
</style>
