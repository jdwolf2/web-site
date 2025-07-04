<template>
  <div class="outer-wrapper">
    <div class="app-container">
      <div class="top-line-wrapper">
        <div class="top-line">
          <img src="./assets/tableLogo.jpg" alt="AccuSalt Logo" class="logo" />

          <button
            @click="triggerDateRange"
            class="select-date"
            :disabled="!isAuthenticated || isLoading"
          >
            {{ isMobileWidth ? 'Dates' : 'Select Date Range' }}
          </button>

          <input
            type="text"
            class="date-display"
            :value="isAuthenticated ? dateRangeDisplay : ''"
            :placeholder="!isAuthenticated ? 'Sign in to select dates' : ''"
            readonly
            :disabled="!isAuthenticated"
          />

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

// 📱 Mobile Width Check
const isMobileWidth = ref(window.innerWidth < 1000)

function updateWidth() {
  isMobileWidth.value = window.innerWidth < 1000
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

// 🔐 Auth actions
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
