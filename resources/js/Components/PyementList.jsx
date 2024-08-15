import React from "react";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { useReservation } from "@/Layouts/layout/context/reservationContext";

const PaymentList = () => {
  const { data, handleInputChange, addPayment, removePayment } =
    useReservation();

  const handleAmountChange = (index, value) => {
    handleInputChange(`payment_${index + 1}`, value);
  };

  return (
    <div className="my-4">
      {Array.from({ length: data.paymentCount }).map((_, index) => (
        <div
          key={index}
          className="my-2 border p-4 rounded-md grid grid-cols-1 lg:grid-cols-4 items-end gap-y-4 justify-between"
        >
          {/* Input Number */}
          <div className="">
            <label
              htmlFor={`payment_${index + 1}`}
              className="block font-medium text-sm text-gray-600 mb-1"
            >
              Montant acompte {(index + 1).toString().padStart(2, "0")}
            </label>
            <InputNumber
              id={`payment_${index + 1}`}
              value={data[`payment_${index + 1}`] || null}
              required
              onValueChange={(e) => handleAmountChange(index, e.value)}
              className="h-12 w-full"
              min={20000}
              showButtons
              mode="currency"
              currency="MGA"
              locale="fr-MG"
            />
          </div>

          {/* Calendar */}
          <div className="">
            <label
              htmlFor={`payment_date_${index + 1}`}
              className="block font-medium text-sm text-gray-600 mb-1"
            >
              Date limite de paiement de l'acompte{" "}
              {(index + 1).toString().padStart(2, "0")}
            </label>
            <Calendar
              required
              id={`payment_date_${index + 1}`}
              value={data[`payment_date_${index + 1}`] || null}
              onChange={(e) =>
                handleInputChange(`payment_date_${index + 1}`, e.value)
              }
              className="w-full"
              showIcon
            />
          </div>

          {/* Button */}
          <div className="">
            {index !== 0 ? (
              <button
                type="button"
                className="bg-red-600 text-white rounded-md border-0 h-12 px-3 "
                onClick={() => removePayment(index)}
              >
                Supprimer acompte
              </button>
            ) : (
              <button
                type="button"
                className="bg-blue-500 text-white rounded-md h-12 px-3 "
                onClick={addPayment}
              >
                Ajouter acompte
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentList;
