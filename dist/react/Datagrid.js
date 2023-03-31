"use strict";
"use client";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DataGrid;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.array.sort.js");
require("core-js/modules/es.json.stringify.js");
var _react = require("react");
const SortIcon = () => /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.5,
  stroke: "currentColor",
  className: "w-4 h-4"
}, /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  d: "M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
}));
const SortDesc = () => /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.5,
  stroke: "currentColor",
  className: "w-4 h-4"
}, /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  d: "M19.5 8.25l-7.5 7.5-7.5-7.5"
}));
const SortAsc = () => /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.5,
  stroke: "currentColor",
  className: "w-4 h-4"
}, /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  d: "M4.5 15.75l7.5-7.5 7.5 7.5"
}));
function DataGrid(_ref) {
  let {
    columns,
    rows,
    sortCallBack
  } = _ref;
  const [sortBy, setSortBy] = (0, _react.useState)('');
  const [sortOrder, setSortOrder] = (0, _react.useState)('');
  (0, _react.useEffect)(() => {
    if (sortCallBack) {
      sortCallBack(sortBy + '_' + sortOrder);
    } else {
      rows.sort((a, b) => {
        let result = 0;
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        const column = columns.find(column => column.field === sortBy);
        if (typeof (column === null || column === void 0 ? void 0 : column.sortValue) === 'function') {
          aValue = column.sortValue(aValue);
          bValue = column.sortValue(bValue);
        }
        if (aValue < bValue) {
          result = -1;
        }
        if (aValue > bValue) {
          result = 1;
        }
        if (sortOrder === 'desc') result *= -1;
        if (aValue && !bValue) result = -1;
        if (bValue && !aValue) result = 1;
        return result;
      });
    }
  }, [sortBy, sortOrder]);
  const totalCells = rows.length * columns.length;
  const getRow = cellIndex => rows[Math.floor(cellIndex / columns.length)];
  const getCellValue = cellIndex => {
    const column = columns[cellIndex % columns.length];
    const row = getRow(cellIndex);
    const field = column.field;
    const format = column.format;
    //@ts-ignore
    const content = format ? format(row[field], row) : JSON.stringify(row[field]);
    return /*#__PURE__*/React.createElement(React.Fragment, null, content);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      position: 'relative',
      gridAutoFlow: 'row',
      fontSize: '14px'
    }
  }, columns.map((column, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "shadow pb-2 font-bold ".concat(column.sortable && 'cursor-pointer', " pl-2 flex flex-row items-center"),
    onClick: () => {
      if (column.sortable) {
        setSortOrder(sortOrder === 'asc' && sortBy === column.field ? 'desc' : 'asc');
        setSortBy(column.field || '');
      }
    },
    style: {
      gridColumn: index + 1,
      gridRow: 1,
      position: 'sticky',
      alignSelf: 'start',
      background: 'white',
      top: 0
    }
  }, column.title, column.sortable && sortBy !== column.field && /*#__PURE__*/React.createElement(SortIcon, null), column.sortable && sortBy === column.field && sortOrder === 'asc' && /*#__PURE__*/React.createElement(SortAsc, null), column.sortable && sortBy === column.field && sortOrder === 'desc' && /*#__PURE__*/React.createElement(SortDesc, null))), Array.from(Array(rows.length * columns.length).keys()).map(cellIndex => /*#__PURE__*/React.createElement("div", {
    key: cellIndex,
    className: "py-2 px-1",
    style: {
      background: Math.floor(cellIndex / columns.length) % 2 === 0 ? '#f1f3f5' : 'white'
    }
  }, getCellValue(cellIndex))));
}