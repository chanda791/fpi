import React from "react";

interface Column<T> {
  key: string;
  title: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

function DataTable<T>({
  columns,
  data,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  if (!data.length) {
    return (
      <div className="text-center py-16 text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            {columns.map((column) => (

              <th
                key={column.key}
                className="px-6 py-4 text-left font-semibold"
              >
                {column.title}
              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {data.map((row: any, index) => (

            <tr
              key={index}
              className="border-t hover:bg-slate-50"
            >

              {columns.map((column) => (

                <td
                  key={column.key}
                  className="px-6 py-4"
                >

                  {column.render
                    ? column.render(row)
                    : row[column.key]}

                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default DataTable;