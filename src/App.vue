<template>
  <div class="outer-wrapper">
    <div class="app-container">
      <div class="top-line-wrapper">
        <div class="top-line-rows">
          <div class="top-line">
            <div class="row-logo">
              <img
                src="./assets/accuSaltLogo.png"
                alt="AccuSalt Logo"
                class="logo"
              />
            </div>

            <div class="row-date">
              <button
                @click="triggerDateRange"
                class="select-date"
                :disabled="!isAuthenticated || isLoading"
              >
                Dates
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
          <!-- close .top-line -->
        </div>
        <!-- close .top-line-rows -->

        <DtRange
          ref="dtRangeRef"
          :startUnix="startDate"
          :stopUnix="stopDate"
          @update:start="onStartDateUpdate"
          @update:stop="onStopDateUpdate"
        />
      </div>
      <!-- close .top-line-wrapper -->

      <div class="grid-wrapper">
        <div v-if="isAuthenticated && isLoading" class="loading-msg">
          Searching for records…
        </div>
        <Grid v-else-if="isAuthenticated && itemsFetched" :data="items" />
        <div v-if="statusMessage" class="status-msg">{{ statusMessage }}</div>
      </div>

      <div v-if="fetchError" style="color: red">Error: {{ fetchError }}</div>
    </div>
    <!-- close .app-container -->
  </div>
  <!-- close .outer-wrapper -->
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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

<style>
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
  padding-top: 4px;
  margin: 0;
}

.top-line-wrapper {
  margin: 5px 0 0 0;
}

.top-line {
  display: flex;
  align-items: center;
  gap: 0.5em;
  flex-wrap: wrap;
}

.sign-in,
.sign-out {
  height: 30px;
  font-size: 16px;
  margin: 0;
  border-radius: 5px;
}

.select-date {
  height: 30px;
  font-size: 16px; /* optional size */
  background: lightblue;
  color: black;
  border-right: 3px solid lightgray;
  cursor: pointer;
  padding: 0 10px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
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
  height: 20px;
  padding: 4px 10px 2px 10px;
  font-size: 16px;
  background: #f5f5f5;
  padding-bottom: 1 12px;
  min-width: 250px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.export-group {
  display: flex;
}

.export-button {
  align-items: center;
  height: 30px;
  background: lightblue;
  color: black;
  border-right: 2px solid lightgray;
  cursor: pointer;
  padding: 0 10px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  margin-right: 0;
  white-space: nowrap;
  width: auto;
  min-width: 0;
}
.export-button:disabled {
  background: #ccc;
  color: #666;
  cursor: not-allowed;
}

.export-button:hover:enabled {
  background: #125da4;
  color: white;
}
.export-dropdown {
  padding: 0 10px;
  height: 30px;
  font-size: 16px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  margin-left: 0px;
}
.export-dropdown:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

.grid-wrapper {
  /* margin: 4px 10px 0 10px; */
  margin: 0;
  text-align: left;
  min-height: 520px;
}

.status-msg {
  margin: 0 10px;
  font-size: 1rem;
  color: #333;
  background: #f1f1f1;
  border-left: 4px solid #2196f3;
  padding: 8px 12px;
}

.loading-msg {
  font-size: 1.1rem;
  margin: 0;
  color: #333;
}

.e-daterangepicker.e-popup {
  position: fixed !important;
  left: 130px !important;
  top: 70px !important;
  z-index: 10000 !important;
}

body {
  background-color: rgb(40, 40, 40);
}

/* body {
  background-color: rgb(200, 200, 200);
} */

@import '~@syncfusion/ej2-base/styles/material.css';
@import '~@syncfusion/ej2-buttons/styles/material.css';
@import '~@syncfusion/ej2-calendars/styles/material.css';
@import '~@syncfusion/ej2-dropdowns/styles/material.css';
@import '~@syncfusion/ej2-inputs/styles/material.css';
@import '~@syncfusion/ej2-navigations/styles/material.css';
@import '~@syncfusion/ej2-popups/styles/material.css';
@import '~@syncfusion/ej2-splitbuttons/styles/material.css';
@import '~@syncfusion/ej2-vue-grids/styles/material-lite.css';

.export-controls {
  display: flex;
  align-items: center;
  gap: 0;
  /* margin: 10px 0 10px 10px; */
}

.e-grid td.e-selectionbackground {
  background-color: #00b7ea;
}

.page-container {
  display: block;
  width: 100%;
  margin: 0;
  overflow: auto;
}

.e-grid {
  overflow: auto;
}

.egrid .e-gridcontent {
  overflow-y: auto;
  overflow-x: auto;
}

.e-grid .e-gridheader {
  overflow: auto;
}

.block-container {
  display: flex;
  align-items: center;
  background-color: white;
  /* margin-top: 2%; */
  height: max-content;
}

@media (max-width: 800px) {
  .e-gridheader,
  .e-gridcontent {
    overflow: auto;
  }
}

.custom-filter-popup {
  max-height: 800px;
  z-index: 2147483647;
  width: 255px;
  top: -69.2533px;
  display: block;
  visibility: visible;
  position: absolute;
  left: 0px;
}

.e-gridheader {
  padding-right: 0 !important;
}

.total-container {
  display: flex;
  margin: 0;
}

.dateRangePicker {
  display: inline-block;
  width: 300px;
  height: 25px;
  background-color: white;
  font-family: Arial, Helvetica, sans-serif;
  padding-left: 25px;
  margin-top: 0;
  margin-bottom: 0;
  padding-right: 20px;
}

.e-popup {
  height: fit-content;
}

.e-hide {
  display: none;
}

.e-grid .e-gridheader {
  border: 1px solid white;
}

.e-grid .e-headercell {
  color: black;
  background-color: lightsteelblue;
}

.e-grid .e-headercelldiv {
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  color: white;
  overflow: hidden;
}

.e-grid .e-columnselection {
  background-color: #e2efd7;
}

.e-input-group input.e-input,
.e-input-group.e-control-wrapper input.e-input {
  font-size: 16px;
}

.e-input-group .e-input-group-icon:last-child,
.e-input-group.e-control-wrapper .e-input-group-icon:last-child {
  font-size: 12px;
  margin-right: 0;
  background-color: white;
}

.e-calendar .e-header .e-title,
.e-bigger.e-small .e-calendar .e-header .e-title {
  font-size: 16px;
}

.e-calendar .e-header span,
.e-bigger.e-small .e-calendar .e-header span {
  border: 1px solid;
  color: chocolate;
}

.e-grid
  .e-gridheader
  .e-icons:not(.e-icon-hide):not(.e-check):not(.e-stop):not(
    .e-icon-reorderuparrow
  ):not(.e-icon-reorderdownarrow) {
  color: white;
}

.e-grid
  th.e-headercell[aria-sort='ascending']:not(.e-columnselection)
  .e-headertext,
.e-grid
  th.e-headercell[aria-sort='descending']:not(.e-columnselection)
  .e-headertext,
.e-grid th.e-headercell[aria-sort='ascending'] .e-sortfilterdiv,
.e-grid th.e-headercell[aria-sort='descending'] .e-sortfilterdiv {
  color: white;
}

.e-grid .e-headercell .e-columnmenu {
  margin-left: 0; /* Adjust this value as needed */
  padding-left: 0px; /* Ensure no padding */
}

.e-grid .e-headercell[data-ej-mappingname='Truck'] .e-headercelldiv {
  display: flex;
  justify-content: start; /* Align text to the left */
  padding-right: 0 !important; /* Remove extra padding */
  gap: 0 !important; /* Eliminate spacing between text and icons */
}

.e-grid .e-headercell.e-filtered .e-columnmenu {
  color: white !important; /* Change icon color */
  background-color: darkblue !important; /* Change icon background */
  padding: 2px; /* Optional: tighter fit */
}

.e-grid .e-filtered::before {
  color: black;
  background-color: yellow;
  border: 7px solid yellow;
}
.sign-in,
.sign-out {
  flex: 0 0 auto;
  /* padding: 10px 0; */
  margin-left: auto;
  height: 30px;
  width: 90px;
  font-size: 16px;
  align-self: center;
}

@media (orientation: portrait) {
  .top-line-rows {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .row-logo {
    display: flex;
    flex: 0 0 auto;
    justify-content: center;
    align-items: center;
    background-color: white;
    width: 100%;
  }

  .row-date {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 0;
  }
  .select-date {
    flex: 0 0 auto;
    height: 30px;
    font-size: 16px;
    border-right: 2px solid lightgray;
  }
  .date-display {
    flex: 1 1 auto;
    width: 250px;
    font-size: 16px;
  }

  .outter-wrapper {
    margin: 0;
  }

  .e-daterangepicker.e-popup {
    position: fixed !important;
    /* left: 50% !important; */
    transform: translate(40px, 200px) !important;

    min-width: 350px !important;
    max-width: 100% !important;
    z-index: 10000 !important;
    /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); */
  }

  .e-daterangepicker .e-calendar-container {
    flex-direction: column !important;
    align-items: center !important;
  }

  .e-daterangepicker .e-calendar {
    width: 100% !important;
  }
}
@media (orientation: landscape) {
  .top-line {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }

  .sign-in,
  .sign-out {
    flex: 0 0 auto;
    margin-left: 0;
    height: 30px;
    width: 90px;
    font-size: 16px;
    /* margin-right: 10px; */
  }

  .row-date {
    display: flex;
    /* align-items: center; */
    flex: 0 0 auto;
    gap: 0;
  }

  .outter-wrapper {
    margin: 0;
  }

  .e-daterangepicker .e-calendar-container {
    flex-direction: row !important;
  }

  .e-daterangepicker.e-popup {
    position: fixed !important;
    /* left: 50% !important; */
    transform: translateX(20%) !important;

    min-height: 350px !important;
    max-height: 100vh !important;

    z-index: 10000 !important;
    /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); */
  }
}

.table-container {
  margin: 0;
}

#table-div {
  margin: 0 !important;
}
.table-margin {
  margin: 0 !important;
}

.select-date,
.date-display {
  display: inline-flex;
  align-items: center;
  height: 30px; /* Make sure both are equal */
  line-height: 1;
  font-size: 16px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  padding: 0 12px;
}

.select-date {
  border-right: none; /* So the button and input touch cleanly */
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.date-display {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.export-group {
  display: flex;
  align-items: center;
  gap: 0;
}

.export-button,
.export-dropdown {
  height: 30px;
  font-size: 16px;
  padding: 0 12px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  line-height: 1;
}

.export-button {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-right: none; /* Seamless connection to dropdown */
  background: lightblue;
  color: black;
  cursor: pointer;
}

.export-button:hover:enabled {
  background: #125da4;
  color: white;
}

.export-dropdown {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background: white;
}

/* Light gray background for alternate rows */
/* .e-grid .e-altrow {
  background-color: #dee1e0;
} */

/* **************************************************************** */

/* Optional: consistent hover effect */
.e-grid .e-row:hover,
.e-grid .e-altrow:hover,
.e-grid .e-frozencontent .e-row:hover,
.e-grid .e-frozen-left-content .e-row:hover {
  background-color: #9ac7db;
}

/* Optional: for cell selection mode */
.e-grid .e-selectionbackground.e-active {
  background-color: #caf167 !important;
  color: black !important;
}
</style>
