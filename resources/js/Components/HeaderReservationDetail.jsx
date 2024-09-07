import React from "react";
import { format } from "date-fns";

const HeaderReservationDetail = ({ reservation, salle }) => {
  return (
    <div className="flex flex-col shadow-md p-4 rounded-lg bg-white border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">
          Réservation: {reservation.ref}
        </h3>
        <div className="flex items-center">
          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              <span className="material-icons text-gray-500">Client : </span>
              {reservation.nom_client}
            </span>
          </div>
          <div className="mx-2">|</div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              Salle:{" "}
              <span className="text-green-600 font-semibold">
                {salle.numero}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Début:{" "}
            <span className="font-medium text-gray-800">
              {format(new Date(reservation.date_debut), "dd-MM-yyyy")}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Fin:{" "}
            <span className="font-medium text-gray-800">
              {format(new Date(reservation.date_fin), "dd-MM-yyyy")}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderReservationDetail;
