<template>
  <div class="outer-wrapper">
    <div class="app-container">
      <div class="top-line-wrapper">
        <div class="top-line-rows">
          <div class="top-line">
            <div class="row-logo">
              <img
                src="./assets/tableLogo.jpg"
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
  margin-left: 10px;
  margin-right: 0;
}

.top-line-wrapper {
  margin: 10px 0 0 0;
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
  font-size: 16px;
  margin: 0;
}

.select-date {
  background: lightblue;
  color: black;
  border: none;
  cursor: pointer;
  padding: 0 10px;
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
  padding: 8px 5px;
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
  padding: 0 5px;
}
.export-button:hover:enabled {
  background: #125da4;
  color: white;
}
.export-button:disabled {
  background-color: gray;
  color: white;
  cursor: not-allowed;
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
  font-size: 20px;
  border: 1px solid #bdbdbd;
  background: #f5f5f5;
  padding: 0 12px;
  min-width: 150px;
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
  left: 130px !important;
  top: 70px !important;
  z-index: 10000 !important;
}

@import '~@syncfusion/ej2-base/styles/material.css';
@import '~@syncfusion/ej2-buttons/styles/material.css';
@import '~@syncfusion/ej2-calendars/styles/material.css';
@import '~@syncfusion/ej2-dropdowns/styles/material.css';
@import '~@syncfusion/ej2-inputs/styles/material.css';
@import '~@syncfusion/ej2-navigations/styles/material.css';
@import '~@syncfusion/ej2-popups/styles/material.css';
@import '~@syncfusion/ej2-splitbuttons/styles/material.css';
@import '~@syncfusion/ej2-vue-grids/styles/material-lite.css';

body {
  background-color: rgb(40, 40, 40);
}

.export-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0 10px 10px;
}

.export-button {
  font-size: 16px;
  height: 25px;
  padding: 0 10px;
  /* border-radius: 5px; */
  background: lightblue;
  color: black;
  border: none;
  cursor: pointer;
  /* margin-left: 10px; */
  margin-right: 0;
  /* padding-right: 32px; */
  white-space: nowrap;
  width: auto;
  min-width: 0;
}
.export-button:hover:enabled {
  background: #125da4;
  color: #fff;
}

.export-dropdown {
  padding: 0px 10px;
  font-size: 16px;
  /* border-radius: 5px; */
  height: 25px;
  margin-left: 0px;
  border: none;
  /* border: 1px solid #ccc; */
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
  margin-top: 2%;
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

/* .logo {
  width: auto;
  height: 40px;
  margin-left: auto;
  padding-right: 10px;
} */

/* .logo {
  display: inline-block;
  height: 20px;
  margin-left: auto;
  width: auto;
  height: 30px;
  margin-right: 20px;
} */

.dateRangePicker {
  display: inline-block;
  width: 300px;
  height: 40px;
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
  background-color: #aec2ec;
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

.e-calendar .e-content td:hover span.e-day,
.e-calendar .e-content td:focus span.e-day,
.e-bigger.e-small .e-calendar .e-content td:hover span.e-day,
.e-bigger.e-small .e-calendar .e-content td:focus span.e-day {
  background-color: red;
  border: 2px solid;
  padding-right: 0;
  margin-right: 0;
  color: #212529;
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
    gap: 10px;
  }
  .select-date {
    flex: 0 0 auto;
    height: 35px;
    font-size: 20px;
  }
  .date-display {
    flex: 1 1 auto;
    margin-left: auto;
    width: 200;
    height: 40px;
    font-size: 20px;
  }
  .sign-in,
  .sign-out {
    flex: 0 0 auto;
    padding: 10px 0;
    margin-left: auto;
    height: 40px;
    width: 92px;
    font-size: 18px;
    align-self: center;
  }
  .export-group {
    flex: 0 0 auto;
    margin-left: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .export-button {
    width: auto;
    min-width: 0;
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
  .logo {
    width: auto;
    height: 35px;
    margin-left: 8px;
    margin-right: 0;
  }

  .sign-in,
  .sign-out {
    flex: 0 0 auto;
    margin-left: 30px;
    height: 40px;
    width: 78px;
    font-size: 16px;
    margin-right: 10px;
  }

  .row-date {
    display: flex;
    /* align-items: center; */
    flex: 0 0 auto;
    gap: 5px;
  }

  .select-date {
    margin-right: 5px;
    height: 34px;
    font-size: 20px; /* optional size */
    padding: 0 5px; /* optional spacing */
  }

  .date-display {
    height: 35px;
    width: 230px;
    font-size: 18px;
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
</style>
