import { usePage } from "@inertiajs/react";
import { format } from "date-fns";
import React from "react";

const DetailReservation = () => {
  const { reservation, salle } = usePage().props;

  return (
    <div className="p-4 bg-slate-200 text-gray-700 rounded-sm mt-4 shadow-sm">
      <div className="flex gap-2 ">
        <p className="font-bold">Nom du client: </p>
        {reservation.nom_client}
      </div>
      <div className="flex gap-2 ">
        <p className="font-bold">Salle: </p>
        {salle.numero}
      </div>
      <div className="flex gap-2 ">
        <p className="font-bold">Numéro tel: </p>
        {reservation.num_tel}
      </div>
      <div className="flex gap-2 ">
        <p className="font-bold">Nombre de places: </p>
        {reservation.nb_participants}
      </div>
      <div className="flex">
        <p className="font-bold">{`Du: `}</p>
        {` ${format(new Date(reservation.date_debut), "dd/MM/yyyy")} au
        ${format(new Date(reservation.date_fin), "dd/MM/yyyy")}`}
      </div>

      {reservation.activites && (
        <div className="flex gap-x-2 ">
          <p className="font-bold">Activité: </p>
          {reservation.activites}
        </div>
      )}
      {reservation.remarque && (
        <div className="flex gap-2 ">
          <p className="font-bold">Remarque: </p>
          {reservation.remarque}
        </div>
      )}
    </div>
  );
};

export default DetailReservation;
