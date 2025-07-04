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
            :allowReordering="false"
            :allowExcelExport="true"
            :columnQueryMode="'ExcludeHidden'"
            :allowPdfExport="false"
            :showColumnChooser="false"
            :enableScrolling="true"
            :scrollSettings="scrollSettings"
            :allowPaging="true"
            :pageSettings="pageSettings"
            :allowGrouping="true"
            :allowSorting="false"
            :showColumnMenu="true"
            :columnMenuItems="['ColumnChooser', 'Filter']"
            :groupSettings="groupOptions"
            :allowFiltering="true"
            :filterSettings="filterSettings"
            :allowTextWrap="true"
            :autoFit="false"
            :width="'100%'"
            :height="'510px'"
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
