<template>
  <div class="outer-wrapper">
    <div class="app-container">
      <div class="top-line-wrapper">
        <div class="top-line">
          <!-- Line 1: Logo -->
          <img src="./assets/tableLogo.jpg" alt="AccuSalt Logo" class="logo" />

          <!-- Line 2: Dates + Input -->
          <div class="date-group">
            <button
              @click="triggerDateRange"
              class="select-date"
              :disabled="!isAuthenticated || isLoading"
            >
              <!-- {{ isMobileWidth ? 'Dates' : 'Select Date Range' }} -->
              Select Dates
            </button>

            <input
              type="text"
              class="date-display"
              :value="isAuthenticated ? dateRangeDisplay : ''"
              :placeholder="!isAuthenticated ? 'Sign in to select dates' : ''"
              readonly
              :disabled="!isAuthenticated"
            />
          </div>

          <!-- Line 3: Export group + Auth buttons (same line) -->
          <div class="row-group">
            <div
              class="export-group"
              :class="{
                disabled: !isAuthenticated || items.length === 0 || isLoading,
              }"
            >
              <button
                class="export-button"
                @click="onExportToExcel"
                :disabled="!isAuthenticated || items.length === 0 || isLoading"
              >
                Export to Excel
              </button>

              <select
                v-model="exportOption"
                class="export-dropdown"
                :disabled="!isAuthenticated || items.length === 0 || isLoading"
              >
                <option value="all">All Records</option>
                <option value="currentPage">Current Page</option>
                <option value="filtered">Filtered Records</option>
              </select>
            </div>

            <button
              class="sign-in"
              v-if="!isAuthenticated"
              @click="onSignInClick"
            >
              Sign in
            </button>
            <button
              class="sign-out"
              v-if="isAuthenticated"
              @click="onSignOutClick"
            >
              Sign out
            </button>
          </div>

          <!-- Hidden calendar control -->
          <DtRange
            ref="dtRangeRef"
            :startUnix="startDate"
            :stopUnix="stopDate"
            @update:start="onStartDateUpdate"
            @update:stop="onStopDateUpdate"
          />
        </div>
      </div>

      <div class="grid-wrapper">
        <div v-if="isAuthenticated && isLoading" class="loading-msg">
          Searching for records…
        </div>
        <Grid v-else-if="isAuthenticated && itemsFetched" :data="items" />
        <div v-if="statusMessage" class="status-msg">{{ statusMessage }}</div>
      </div>

      <div v-if="fetchError" style="color: red">Error: {{ fetchError }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuth } from './useAuth.js'
import { useDynamoDB } from './useDynamoDB.js'
import DtRange from './DtRange.vue'
import Grid from './Grid.vue'

const startDate = ref(null)
const stopDate = ref(null)
const dtRangeRef = ref(null)

const { user, signIn, signOut, checkAuth } = useAuth()
const isAuthenticated = computed(() => !!user.value)
const isLoading = ref(false)

onMounted(() => {
  if (typeof checkAuth === 'function') checkAuth()
})

const isMobileWidth = ref(window.innerWidth < 1000)
function updateWidth() {
  isMobileWidth.value = window.innerWidth < 1000
}
onMounted(() => window.addEventListener('resize', updateWidth))
onUnmounted(() => window.removeEventListener('resize', updateWidth))

function onSignInClick() {
  if (typeof signIn === 'function') signIn()
}
function onSignOutClick() {
  if (typeof signOut === 'function') signOut()
}

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

const { items, fetchError, itemsFetched, fetchItems } = useDynamoDB()
const statusMessage = ref('')
const exportOption = ref('currentPage')

watch([startDate, stopDate, isAuthenticated], async ([start, stop, authed]) => {
  if (authed && Number.isInteger(start) && Number.isInteger(stop)) {
    isLoading.value = true
    await fetchItems(start.toString(), stop.toString())
    isLoading.value = false
  }
})

function onExportToExcel() {
  const grid = document.getElementById('gridcomp')?.ej2_instances?.[0]
  if (!grid) return

  const exportProps = {
    fileName: 'AccuSalt_Data.xlsx',
    header: {
      headerRows: 2,
      rows: [
        {
          cells: [
            {
              colSpan: 5,
              value: 'AccuSalt Export',
              style: { fontSize: 20, hAlign: 'Center', bold: true },
            },
          ],
        },
        {
          cells: [
            {
              colSpan: 5,
              value: `Exported: ${new Date().toLocaleDateString()}`,
              style: { fontSize: 12, hAlign: 'Center' },
            },
          ],
        },
      ],
    },
  }

  if (exportOption.value === 'currentPage') {
    exportProps.exportType = 'CurrentPage'
  } else if (exportOption.value === 'filtered') {
    exportProps.isFiltered = true
  }

  grid.excelExport(exportProps)
}
</script>

<style scoped>
.outer-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
}

.app-container {
  width: 100%;
  max-width: 1500px;
  font-family: Arial, sans-serif;
}

.logo {
  width: auto;
  height: 35px;
  margin-left: 10px;
  margin-right: 0;
}

.top-line-wrapper {
  margin: 20px 0 0 0;
}

.top-line {
  display: flex;
  align-items: center;
  gap: 0.5em;
  flex-wrap: wrap;
}

.select-date,
.sign-in,
.sign-out,
.export-button,
.export-dropdown {
  height: 25px;
  font-size: 14px;
  border-radius: 0;
  margin: 0;
  padding: 0 6px;
}

.select-date {
  background: lightblue;
  color: black;
  border: none;
  cursor: pointer;
  padding: 0 10px;
  margin-right: 4px;
}
.select-date:disabled {
  background: #ccc;
  color: #666;
  cursor: not-allowed;
}
.select-date:hover:enabled {
  background: #125da4;
  color: white;
}

.export-group {
  display: flex;
  align-items: center;
  border: 2px solid white;
  padding: 2px 5px;
  gap: 5px;
}
.export-group.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.export-button {
  background: lightblue;
  color: black;
  border: none;
  cursor: pointer;
  padding: 0 10px;
  border-radius: 0;
}
.export-button:hover:enabled {
  background: #125da4;
  color: white;
  border-radius: 0;
}
.export-button:disabled {
  background-color: gray;
  color: white;
  cursor: not-allowed;
  border-radius: 0;
  opacity: 0.6;
}

.export-dropdown {
  padding: 0 10px;
  border: none;
}
.export-dropdown:disabled {
  background-color: #ccc;
  color: #666;
  opacity: 0.6;
}

.sign-in {
  background: lightgreen;
  color: black;
  border: none;
  cursor: pointer;
  padding: 0 10px;
}
.sign-in:hover {
  background: green;
  color: white;
}

.sign-out {
  background: lightyellow;
  color: black;
  border: none;
  cursor: pointer;
  padding: 0 10px;
}
.sign-out:hover {
  background: yellow;
  color: black;
}

.date-display {
  height: 25px;
  font-size: 16px;
  border: 1px solid #bdbdbd;
  background: #f5f5f5;
  padding: 0 12px;
  min-width: 210px;
}

.grid-wrapper {
  margin: 4px 10px 0 10px;
  text-align: left;
  min-height: 520px;
}

.status-msg {
  margin: 0.5em 10px;
  font-size: 1rem;
  color: #333;
  background: #f1f1f1;
  border-left: 4px solid #2196f3;
  padding: 8px 12px;
}

.loading-msg {
  font-size: 1.1rem;
  margin: 20px;
  color: #333;
}

.e-daterangepicker.e-popup {
  position: fixed !important;
  left: 18px !important;
  top: 95px !important;
  z-index: 10000 !important;
}

* {
  border-radius: 0;
}

.row-group {
  display: flex;
  gap: 6px;
  align-items: center;
}

@media (max-width: 1000px) and (orientation: portrait) {
  .logo {
    margin: 0;
  }
  .logo {
    vertical-align: top;
  }

  .top-line {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin: 0;
  }

  .logo {
    order: 1;
    flex: 0 0 auto;
  }

  .date-group {
    order: 2;
    display: flex;
    gap: 4px;
    width: 100%;
    padding-left: 0;
  }

  .select-date {
    flex: 0 0 auto;
    padding: 0 4px;
  }

  .date-display {
    flex: 1 1 auto;
    min-width: 0;
  }

  .row-group {
    order: 3;
    display: flex;
    align-items: center;
    width: 100%;
    gap: 8px;
  }

  .export-button,
  .export-dropdown {
    flex: 0 0 auto;
  }

  .sign-in,
  .sign-out {
    flex: 0 0 auto;
    margin-left: auto;
  }
}
</style>
<style>
body {
  margin: 0;
  padding: 0;
  background-color: rgb(20, 20, 20);
}
</style>
