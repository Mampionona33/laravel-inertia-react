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
          <thead>
            <tr>
              <th className="border border-slate-300 p-2">Description</th>
              <th className="border border-slate-300 p-2">Montant</th>
              <th className="border border-slate-300 p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {depenseList.data.map((depense) => {
              return (
                <tr key={depense.id}>
                  <td className="border border-slate-300 p-2">
                    {depense.description}
                  </td>
                  <td className="border border-slate-300 p-2">
                    {Ar(depense.amount)}
                  </td>
                  <td className="border border-slate-300 p-2">
                    {format(new Date(depense.created_at), "dd/MM/yyyy")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination links={depenseList.links} />
      </div>
    </div>
  );
};

export default TableDepense;
