// columns.js

export const dateValueAccessor = (field) => (data, column) => {
  const dateStr = data[field]
  return dateStr ? new Date(dateStr).getTime() : null // Unix time (ms)
}

export const timeValueAccessor = (field) => (data) => {
  const dateStr = data.StartDate // or whatever date you know is associated
  const timeStr = data[field]
  if (!dateStr || !timeStr) return null
  const fullDateTime = `${dateStr}T${timeStr}`
  return new Date(fullDateTime).getTime() // Unix time in ms
}

export const timeFormatter = (field) => (data) => {
  const dateStr = data.StartDate
  const timeStr = data[field]
  if (!dateStr || !timeStr) return ''
  const fullDateTime = `${dateStr}T${timeStr}`
  const dateObj = new Date(fullDateTime)
  return dateObj.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export const numberValueAccessor = (field) => (data) => {
  const value = data[field]
  return value != null ? parseFloat(value) : null
}

export const numberWithUnitsValueAccessor = (field) => (data) => {
  const value = data[field]
  if (!value) return null

  // Extract numeric portion only
  const match = value.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : null
}

// Example: Custom formatting (optional alternative)
// export const dateValueAccessor = (field) => (data) => {
//   const dateStr = data[field];
//   return dateStr ? new Date(dateStr).toLocaleDateString() : '';
// };

export const columns = [
  {
    field: 'siteName',
    headerText: 'Site Name',
    textAlign: 'Left',
    width: 150,
  },

  {
    field: 'Truck',
    headerText: 'Truck',
    textAlign: 'Left',
    width: 100, // Set close to estimated content width
    valueAccessor: numberValueAccessor('Truck'),
  },

  {
    field: 'Route',
    headerText: 'Route',
    textAlign: 'Left',
    width: 100,
    valueAccessor: numberValueAccessor('Route'),
  },
  {
    field: 'StartDate',
    headerText: 'Start Date',
    textAlign: 'Left',
    width: 180,
    valueAccessor: dateValueAccessor('StartDate'),
  },

  {
    field: 'StartTime',
    headerText: 'Start Time',
    textAlign: 'Left',
    width: 120,
    valueAccessor: timeValueAccessor('StartTime'),
    template: (data) => timeFormatter('StartTime')(data),
  },
  {
    field: 'StopTime',
    headerText: 'Stop Time',
    textAlign: 'Left',
    width: 120,
    valueAccessor: timeValueAccessor('StopTime'),
    template: (data) => timeFormatter('StopTime')(data),
  },

  {
    field: 'Duration',
    headerText: 'Duration',
    textAlign: 'Left',
    width: 100,
  },
  {
    field: 'Total',
    headerText: 'Total',
    textAlign: 'Left',
    width: 100,
    valueAccessor: numberWithUnitsValueAccessor('Total'),
  },
  {
    field: 'Rate',
    headerText: 'Rate',
    textAlign: 'Left',
    width: 100,
    numberWithUnitsValueAccessor: numberWithUnitsValueAccessor('Rate'),
  },
  {
    field: 'Lat',
    headerText: 'Latitude',
    textAlign: 'Left',
    width: 100,
  },
  {
    field: 'Lon',
    headerText: 'Longitude',
    textAlign: 'Left',
    width: 100,
  },
  // {
  //   field: 'Temp',
  //   headerText: 'Temperature',
  //   textAlign: 'Right',
  //   width: 100,
  // },
]
