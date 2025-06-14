<template>
  <div class="total-container">
    <div class="page-container">
      <div id="table-container">
        <div id="table-div">
          <EjsGrid
            ref="gridRef"
            id="gridcomp"
            :dataSource="data"
            :allowScrolling="true"
            :rowHeight="40"
            :enableAltRow="true"
            :allowReordering="true"
            :allowExcelExport="true"
            :columnQueryMode="'ExcludeHidden'"
            :allowPdfExport="true"
            :showColumnChooser="true"
            :enableScrolling="true"
            :scrollSettings="scrollSettings"
            :allowPaging="false"
            :allowGrouping="true"
            :allowSorting="true"
            :showColumnMenu="true"
            :groupSettings="groupOptions"
            :allowFiltering="true"
            :filterSettings="filterSettings"
            :allowTextWrap="true"
            :autoFit="true"
            :width="'auto'"
            :height="'400px'"
            :frozenRows="0"
            :frozenColumns="1"
            @headerCellInfo="onHeaderCellInfo"
          >
            <EColumns>
              <EColumn
                v-for="col in displayedColumns"
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
import { ref, onMounted, watch, provide } from 'vue'
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

const selectedColumns = ref(columns.map((col) => col.field))
const displayedColumns = ref(columns)
const gridRef = ref(null)

provide('grid', [Group, Sort, Resize, ColumnMenu, Filter])

const updateColumns = () => {
  displayedColumns.value = columns.filter((col) =>
    selectedColumns.value.includes(col.field)
  )
  gridRef.value?.autoFitColumns()
}

onMounted(() => {
  gridRef.value?.autoFitColumns()
})

watch(selectedColumns, updateColumns)

const onHeaderCellInfo = (args) => {
  const columnField = args.cell.column.field
  const headerCell = args.node

  headerCell.style.padding = '0 25px 0 10px'
  headerCell.style.borderColor = 'lightlightgray'
  headerCell.style.borderRight = '1px solid white'

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
      headerCell.style.background = 'rgb(0,0, 150)'
      break
    case 'Total':
    case 'Rate':
      headerCell.style.background = 'darkgreen'
      break
    case 'Lat':
    case 'Lon':
      headerCell.style.background = 'rgb(100,0, 0)'
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

body {
  background-color: rgb(80, 80, 80);
}

button {
  margin: 10px;
}

.e-grid td.e-selectionbackground {
  background-color: #00b7ea;
}

/* .table-container {
    height: 30%;
    margin-top: auto;
    margin-bottom: auto;
  } */
.page-container {
  display: block;
  width: 100%;
  margin: 0;
  overflow: auto;
}

/* #table-container {
    overflow: auto;
  }
  #table-div {
    overflow: auto;
  } */

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
  /* flex-grow: 1 1 auto; */
  align-items: center;
  /* display: block; */
  /* background-color: black; */
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

/* @media (max-width: 800px) {
    .e-daterangepicker.e-popup {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      margin-right: auto;
      margin-bottom: auto;
    } */

.custom-filter-popup {
  max-height: 800px;
  z-index: 2147483647;
  width: 255px;
  top: -69.2533px;
  display: block;
  visibility: visible;
  position: absolute; /* Ensure it can float */
  left: 0px; /* Align to the left */
}

.e-gridheader {
  padding-right: 0 !important;
}

.total-container {
  display: flex;
}

.logo {
  /* display: inline-block; */
  width: auto;
  height: 40px;
  /* margin-bottom: 10px; */

  margin-left: auto;
  padding-right: 10px;
  /* margin-bottom: 15px; */
  /* margin: 0 auto -20px 10px; */

  /* background-color: white; */
}
/* .logo-divider {
    width: 100%;
    height: 5px;
    border-bottom: 1px solid black;
  } */
.dateRangePicker {
  display: inline-block;
  width: 300px;
  height: 40px;
  background-color: white;
  /* background-color: lightgreen; */
  font-family: Arial, Helvetica, sans-serif;
  padding-left: 25px;
  margin-top: 0;
  margin-bottom: 0;
  padding-right: 20px;
  /* margin-left: 25px; */
}
.e-popup {
  /* transform: translate(192px, 5px); */
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

/* .e-calendar .e-content thead {
    background: black;
  } */

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

@import '~@syncfusion/ej2-vue-grids/styles/material-lite.css';
</style>
