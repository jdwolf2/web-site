<template>
  <div class="total-container">
    <div class="page-container">
      <div id="table-container">
        <div id="table-div">
          <EjsGrid
            ref="gridRef"
            id="gridcomp"
            :dataSource="data"
            :enableAdaptiveUI="false"
            :allowScrolling="true"
            :rowHeight="40"
            :enableAltRow="true"
            :allowReordering="false"
            :allowExcelExport="true"
            :columnQueryMode="'ExcludeHidden'"
            :allowPdfExport="false"
            :showColumnChooser="false"
            :enableScrolling="true"
            :scrollSettings="scrollSettings"
            :allowPaging="true"
            :pageSettings="pageSettings"
            :allowGrouping="false"
            :allowSorting="false"
            :showColumnMenu="true"
            :columnMenuItems="['ColumnChooser', 'Filter']"
            :groupSettings="groupOptions"
            :allowFiltering="true"
            :filterSettings="filterSettings"
            :allowTextWrap="true"
            :autoFit="false"
            :width="'100%'"
            :height="'210px'"
            :frozenRows="0"
            :frozenColumns="1"
            @headerCellInfo="onHeaderCellInfo"
          >
            <EColumns>
              <EColumn
                v-for="col in filteredColumns"
                :key="col.field"
                :field="col.field"
                :headerText="col.headerText"
                :textAlign="col.textAlign"
                :width="col.width"
              />
            </EColumns>
          </EjsGrid>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, provide, computed } from 'vue'
import { columns } from './assets/columns.js'
import {
  GridComponent as EjsGrid,
  ColumnDirective as EColumn,
  ColumnsDirective as EColumns,
  Group,
  Sort,
  Resize,
  ColumnMenu,
  Filter,
  Page,
  ExcelExport,
} from '@syncfusion/ej2-vue-grids'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

const scrollSettings = { width: '100%', height: '100%' }
const groupOptions = { showGroupedColumn: true }
const filterSettings = { type: 'CheckBox' }
const pageSettings = ref({ pageSize: 100, pageSizes: false, currentPage: 1 })

const selectedColumns = ref(columns.map((col) => col.field))
const displayedColumns = ref(columns)
const filteredColumns = computed(() =>
  displayedColumns.value.filter((col) => col.visible !== false)
)

const gridRef = ref(null)
provide('grid', [Group, Sort, Resize, ColumnMenu, Filter, Page, ExcelExport])

onMounted(() => {
  gridRef.value?.autoFitColumns()
})

watch(selectedColumns, () => {
  displayedColumns.value = columns.filter((col) =>
    selectedColumns.value.includes(col.field)
  )
  gridRef.value?.autoFitColumns()
})

const onHeaderCellInfo = (args) => {
  const headerCell = args.node
  const columnField = args.cell.column.field
  headerCell.style.padding = '0 5px'
  headerCell.style.borderRight = '1px solid white'
  headerCell.style.height = '20px'

  switch (columnField) {
    case 'siteName':
    case 'Truck':
    case 'Route':
      headerCell.style.background = 'black'
      break
    case 'StartDate':
    case 'StartTime':
    case 'StopTime':
    case 'Duration':
      headerCell.style.background = 'rgb(0,0,150)'
      break
    case 'Total':
    case 'Rate':
      headerCell.style.background = 'darkgreen'
      break
    case 'Lat':
    case 'Lon':
      headerCell.style.background = 'rgb(100,0,0)'
      break
    case 'Temp':
      headerCell.style.background = 'lightblue'
      break
  }
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



.export-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0 10px 10px;
}

/* .export-button {
  padding: 0px 10px;
  font-size: 14px;
  height: 25px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
} */

.export-button {
  font-size: 14px;
  height: 25px;
  padding: 0 10px;
  /* border-radius: 5px; */
  background: lightblue;
  color: black;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 0;
  padding-right: 32px;
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
  font-size: 14px;
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
  border-radius: 4px; /* Optional: rounded corners */
  padding: 2px; /* Optional: tighter fit */
}

.e-grid .e-filtered::before {
  color: black;
  background-color: yellow;
  border: 7px solid yellow;
}


/* @media screen and (orientation: landscape) {
  .e-daterangepicker.e-popup .e-calendar-container {
    flex-direction: row !important;
  }

  .e-daterangepicker.e-popup .e-calendar {
    width: 220px !important;
    font-size: 12px;
  }

  .e-daterangepicker.e-popup .e-calendar .e-header,
  .e-daterangepicker.e-popup .e-calendar .e-title {
    font-size: 14px !important;
  }

  .e-daterangepicker.e-popup .e-day,
  .e-daterangepicker.e-popup .e-week-header {
    font-size: 12px !important;
  }
} */

/* @media screen and (orientation: portrait) {
  body::before {
    content: 'Please rotate your device to landscape mode.';
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 9999;
    inset: 0;
    background: black;
    color: white;
    font-size: 1.5rem;
    padding: 1rem;
    text-align: center;
  } */


</style>
