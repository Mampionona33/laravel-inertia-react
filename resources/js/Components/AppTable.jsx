import React from "react";
import Tooltip from "react-simple-tooltip";
import { Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import PropTypes from "prop-types";

const AppTable = ({
  data,
  columns,
  handleEditClick,
  handleDeleteClick,
  paginationLinks,
  standarActions = true,
  customActions = [],
}) => {
  return (
    <div className="shadow-sm border rounded-md p-4">
      <table className="table-auto border-collapse w-full">
        <thead className="sticky top-0 z-10 bg-green-100 text-left">
          <tr className="text-gray-500">
            {columns.map((column, index) => (
              <th key={index} className="p-2">
                {column.header}
              </th>
            ))}
            <th className=" p-2">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={item.id}
                // className={index % 2 === 0 ? "bg-green-100" : "bg-white"}
                className="hover:bg-green-50"
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="border-b p-2">
                    {item[column.accessor]}
                  </td>
                ))}
                <td className="border-b p-2">
                  <div className="flex justify-center gap-4">
                    {standarActions && (
                      <>
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
                      </>
                    )}
                    {customActions.map((action, actionIndex) => (
                      <Tooltip
                        key={actionIndex}
                        content={action.tooltip}
                        placement="bottom"
                        style={{
                          padding: "4px",
                          borderRadius: "5px",
                          fontSize: "14px",
                        }}
                      >
                        <button
                          onClick={() => action.onClick(item)}
                          className={action.className || "hover:text-blue-500"}
                        >
                          {action.icon && <i className={action.icon}></i>}
                          {action.label && <span>{action.label}</span>}
                        </button>
                      </Tooltip>
                    ))}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-4 py-2 text-center text-gray-500"
              >
                Aucune ressource trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {paginationLinks && paginationLinks.length > 0 && (
        <Pagination links={paginationLinks} />
      )}
    </div>
  );
};

AppTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  handleEditClick: PropTypes.func,
  handleDeleteClick: PropTypes.func,
  paginationLinks: PropTypes.array,
  standarActions: PropTypes.bool,
  customActions: PropTypes.array,
};

export default AppTable;
