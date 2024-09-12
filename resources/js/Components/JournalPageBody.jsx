import Ar from "@/assets/ariaryCurrency";
import { usePage } from "@inertiajs/react";
import { format, parseISO } from "date-fns";
import React from "react";

const JournalPageBody = () => {
  const { journalEntries, total } = usePage().props;

  return (
    <div className="py-4 flex flex-col">
      <div className="overflow-auto max-h-[300px]">
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-green-100 text-left">
            <tr className="text-gray-500">
              <th className="p-2">Reférence réservation</th>
              <th className="p-2">Description</th>
              <th className="p-2">Montant</th>
              <th className="p-2">Date</th>
              <th className="p-2">Encaissement</th>
              <th className="p-2">Décaissement</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {journalEntries &&
              journalEntries.map((entry, index) => (
                <tr key={`${entry.id}-${index}`} className="hover:bg-green-50">
                  <td className="border-b p-2">{entry.ref}</td>
                  <td className="border-b p-2">{entry.description}</td>
                  <td className="border-b p-2">{Ar(entry.amount)}</td>
                  <td className="border-b p-2">
                    {format(parseISO(entry.date), "dd/MM/yyyy")}
                  </td>
                  {entry.type === "encaissement" ? (
                    <td className="border-b p-3">{Ar(entry.amount)}</td>
                  ) : (
                    <td className="border-b p-3"></td>
                  )}
                  {entry.type === "decaissement" ? (
                    <td className="border-b p-3">{Ar(entry.amount)}</td>
                  ) : (
                    <td className="border-b p-3"></td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JournalPageBody;
