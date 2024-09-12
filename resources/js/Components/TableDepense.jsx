import { usePage } from "@inertiajs/react";
import { format } from "date-fns";
import React from "react";
import Pagination from "./Pagination";
import currency from "currency.js";
import Ar from "@/assets/ariaryCurrency";

const TableDepense = () => {
  const { depenseList } = usePage().props;

  return (
    <div>
      <div>
        <table className="table-auto border-collapse w-full">
          <thead className="bg-green-100 text-gray-500">
            <tr className="bg-green-100 text-left">
              <th className="p-2">Description</th>
              <th className="p-2">Montant</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {depenseList &&
              depenseList.data &&
              depenseList.data.map((depense) => {
                return (
                  <tr key={depense.id} className="hover:bg-green-50">
                    <td className="border-b p-2">{depense.description}</td>
                    <td className="border-b p-2">{Ar(depense.amount)}</td>
                    <td className="border-b p-2">
                      {format(new Date(depense.created_at), "dd/MM/yyyy")}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <Pagination links={depenseList && depenseList.links} />
      </div>
    </div>
  );
};

export default TableDepense;
