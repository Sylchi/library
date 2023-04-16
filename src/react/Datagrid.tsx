"use client"
import { useState, useEffect, ReactNode } from 'react'

type Column = {
  title: string
  field?: string
  format?: Function
  sortable?: boolean
  sortValue?: Function
}

type Classes = {
  rowClasses?: string
  headerClasses?: string
  cellClasses?: string
  containerClasses?: string
  oddRowClasses?: string
  evenRowClasses?: string
}

const SortIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
</svg>

const SortDesc = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
</svg>

const SortAsc = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
</svg>


export default function DataGrid({ columns, rows, sortCallBack, classes, children }: { columns: Array<Column>, rows: Array<any>, sortCallBack?: Function, classes?: Classes, children?: ReactNode }) {
  const [ sortBy, setSortBy ] = useState<string>('');
  const [ sortOrder, setSortOrder ] = useState('');

  useEffect(() => {
    if(sortCallBack) {
      sortCallBack(sortBy + '_' + sortOrder);
    } else {
      rows.sort((a,b) => {
        let result = 0;
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        const column = columns.find(column => column.field === sortBy);
        if(typeof column?.sortValue === 'function'){
          aValue = column.sortValue(aValue, a);
          bValue = column.sortValue(bValue, b);
        }
        if (aValue < bValue) {
          result = -1;
        }
        if (aValue > bValue) {
          result = 1;
        }
        if(sortOrder === 'desc') result *= -1;
        if(aValue && !bValue) result = -1;
        if(bValue && !aValue) result = 1;
        return result;
      })
    }
  }, [sortBy, sortOrder, rows])


  const totalCells = rows.length * columns.length;

  const getRow = (cellIndex: number) => rows[Math.floor((cellIndex) / columns.length)]

  const getCellValue = (cellIndex: number) => {
    const column = columns[cellIndex % columns.length];
    const row = getRow(cellIndex);
    const field = column.field;
    const format = column.format;
    //@ts-ignore
    const content = format ? format(row[field], row) : row[field]?.toString();
    return <>{content}</>
  }
  
  return <div style={{
      display: 'grid',
      position: 'relative',
      gridAutoFlow: 'row',
      fontSize: '14px'
    }}
    className={`__datagrid__container ${classes?.containerClasses}`}
  >
    {columns.map((column, index) => <div key={index} 
      className={`shadow pb-2 font-bold ${column.sortable && 'cursor-pointer'} pl-2 flex flex-row items-center __datagrid__columnheader ${classes?.headerClasses} bg-white dark:bg-darkBlue`}
      onClick={() => {
        if(column.sortable) {
          setSortOrder(sortOrder === 'asc' && sortBy === column.field ? 'desc' : 'asc');
          setSortBy(column.field || '')
        }
      }}
      style={{ 
        gridColumn: index + 1,
        gridRow: 1,
        position: 'sticky',
        alignSelf: 'start',
        top: 0
      }}
    >{column.title}
    { column.sortable && sortBy !== column.field && <SortIcon />}
    { column.sortable && sortBy === column.field && sortOrder === 'asc' && <SortAsc />}
    { column.sortable && sortBy === column.field && sortOrder === 'desc' && <SortDesc />}
    </div>)}

    {Array.from(Array(rows.length * columns.length).keys()).map((cellIndex) => <div
      key={cellIndex}
      className={`py-2 px-1 ${classes?.cellClasses} ${ Math.floor((cellIndex) / columns.length) % 2 === 0 ? classes?.evenRowClasses || 'bg-gray-200 dark:bg-slate-800' : classes?.oddRowClasses ||'bg-white dark:bg-slate-700' } __datagrid__cell ${ Math.floor((cellIndex) / columns.length) % 2 === 0 ? ' __datagrid__row__even' : '__datagrid__row__odd' }`}
    >
      { getCellValue(cellIndex) }
    </div>
    )}
    {children}
  </div>
}