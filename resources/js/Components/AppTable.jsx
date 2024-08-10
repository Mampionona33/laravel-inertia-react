import React from "react";
import Tooltip from "react-simple-tooltip";
import { Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

const AppTable = ({
  data,
  columns,
  handleEditClick,
  handleDeleteClick,
  paginationLinks,
}) => {
  return (
    <div className="shadow-sm border rounded-md overflow-hidden p-4">
      <table className="table-auto border-collapse w-full">
        <thead className="bg-green-500 text-white">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="border border-green-500 px-4 py-2">
                {column.header}
              </th>
            ))}
            <th className="border border-green-500 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 0 ? "bg-green-100" : "bg-white"}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="border px-4 py-2 border-green-500"
                  >
                    {item[column.accessor]}
                  </td>
                ))}
                <td className="border px-4 py-2 border-green-500">
                  <div className="flex justify-center gap-4">
                    <Tooltip
                      content="Editer"
                      placement="bottom"
                      style={{
                        padding: "4px",
                        borderRadius: "5px",
                        fontSize: "14px",
                      }}
                    >
                      <button
                        onClick={() => handleEditClick(item)}
                        className="hover:text-green-500"
                      >
                        <i className="pi pi-pencil"></i>
                      </button>
                    </Tooltip>
                    <Tooltip
                      content="Supprimer"
                      placement="bottom"
                      style={{
                        padding: "4px",
                        borderRadius: "5px",
                        fontSize: "14px",
                      }}
                    >
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="hover:text-red-500"
                      >
                        <i className="pi pi-trash"></i>
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="border border-green-500 px-4 py-2 text-center text-gray-500"
              >
                Aucune ressource trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination links={paginationLinks} />
    </div>
  );
};

export default AppTable;
