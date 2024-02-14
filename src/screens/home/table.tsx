import { faChevronDown, faChevronUp, faPrint, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTable, usePagination, useSortBy, useGlobalFilter, Column } from 'react-table';

type Props = {
  headers: { name: string; id: string }[];
  data: any[];
  title: string;
};

const Table: React.FC = () => {
  console.log("Rendering Table component");
  const location = useLocation();
  const receivedData: Props = location.state as Props;

  const columns: Column<any>[] = React.useMemo(
    () =>
      receivedData.headers.map((header) => ({
        Header: header.name,
        accessor: header.id,
      })),
    [receivedData.headers]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    
  } = useTable(
    {
      columns,
      data: receivedData.data,
      initialState: { pageIndex: 0, pageSize: 5 } as any,
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
  ) as any;

  const handlePrint = () => {
    // Open a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {    
      const printContent = `
        <html>
          <head>
            <title>${receivedData.title} - All Data</title>
          </head>
          <body>
            <h1>${receivedData.title}</h1>
            <p>Total No. of Alumni: ${receivedData.data.length}</p>
            <table style="border-collapse: collapse; width: 100%;">
              <thead>
                ${headerGroups.map((headerGroup: any) => `
                  <tr>
                    ${headerGroup.headers.map((column: any) => `
                      <th style="background-color: #2F5288; color: white; padding: 10px; width: 100px;">
                        ${column.render('Header')}
                      </th>`).join('')}
                  </tr>`).join('')}
              </thead>
              <tbody>
                ${receivedData.data.map((row: any, rowIndex: number) => `
                <tr style="background-color: ${rowIndex % 2 === 0 ? '#ECF1F7' : '#FFFF'};">
                  ${columns.map((column: any) => `
                    <td style="padding: 10px; color: #2F5288; font-size: 14px;">
                      ${row[column.accessor] !== undefined && row[column.accessor] !== null ? (typeof row[column.accessor] === 'object' ? JSON.stringify(row[column.accessor]) : row[column.accessor]) : ''}
                    </td>`).join('')}
                </tr>`).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
    
      // Write the content to the new window
      printWindow.document.write(printContent);
    
      // Close the document for further writing
      printWindow.document.close();
    
      // Call the print function
      printWindow.print();
    } else {
      alert('No document to print')
    }
  }
  
  

  return (
    <div className="container">
      <img src="https://i.imgur.com/mzylrqX.png" alt="Your Image" />
      <div className="image-overlay">
        <div className="table">
          <div className='table-itself'>
            <h1>{receivedData.title}</h1>
            <p>Total No. of Alumni: {receivedData.data.length}</p>
            <div className='print-dl' onClick={() => handlePrint()}>
            <FontAwesomeIcon icon={faPrint} style={{marginRight: 10}}/>
            <a>Print Document</a>
            </div>
            <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />

          <input
            type="text"
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
          />
        </div>
            <table {...getTableProps()} style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                {headerGroups.map((headerGroup: any) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column: any) => (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        style={{ backgroundColor: '#2F5288', color: 'white', padding: '10px', width: '100px' }}
                      >
                        {column.render('Header')}
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: 5 }} />
                            ) : (
                              <FontAwesomeIcon icon={faChevronUp} style={{ marginLeft: 5 }} />
                            )
                          ) : (
                            ''
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row: any, rowIndex: number) => {
                  prepareRow(row);
                  return (
                    <tr
                      key={rowIndex}
                      {...row.getRowProps()}
                      style={{ backgroundColor: rowIndex % 2 === 0 ? '#ECF1F7' : '#FFFF' }}
                    >
                      {row.cells.map((cell: any) => (
                        <td
                          key={cell.row.id}
                          {...cell.getCellProps()}
                          style={{ padding: '10px', color: '#2F5288', fontSize: 14 }}
                        >
                          {typeof cell.value === 'boolean' ? (cell.value ? 'Yes' : 'No') : cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <button className="pagination-button" onClick={() => previousPage()} disabled={!canPreviousPage}>
                Previous
              </button>
              <span>
                Page <strong>{pageIndex + 1}</strong> of {Math.ceil(receivedData.data.length / pageSize)}
              </span>
              <button className="pagination-button" onClick={() => nextPage()} disabled={!canNextPage}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
