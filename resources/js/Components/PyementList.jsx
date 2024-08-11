import React from "react";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";

const PaymentList = ({
  data,
  handleInputChange,
  paymentCount,
  onRemovePayment,
  onAddPayment,
  setData,
}) => {
  const handleAmountChange = (index, value) => {
    handleInputChange({
      name: `payment_${index + 1}`,
      value,
    });
    updateTotalAmount();
  };

  const updateTotalAmount = () => {
    const total = Array.from({ length: paymentCount }).reduce(
      (sum, _, index) => {
        console.log(data[`payment_${index + 1}`]);
        const amount = data[`payment_${index + 1}`] || 0;
        return sum + Number(amount);
      },
      0
    );
    setData("total_amount", total);
  };

  return (
    <div className="my-4">
      {Array.from({ length: paymentCount }).map((_, index) => (
        <div key={index} className="my-2 border p-2 rounded-md">
          <div>
            <label
              htmlFor={`payment_${index + 1}`}
              className="block font-medium text-sm text-gray-500 pl-2"
            >
              {`Montant paiement ${index + 1}`}
            </label>
            <InputNumber
              id={`payment_${index + 1}`}
              value={data[`payment_${index + 1}`] || null}
              required
              onValueChange={(e) => handleAmountChange(index, e.value)}
              className="h-12 w-full"
              min={20000}
              showButtons
            />
          </div>
          <div>
            <label
              htmlFor={`payment_date_${index + 1}`}
              className="block font-medium text-sm text-gray-500 pl-2"
            >
              Date paiement {index + 1}
            </label>
            <Calendar
              required
              id={`payment_date_${index + 1}`}
              value={data[`payment_date_${index + 1}`] || null}
              onChange={(e) =>
                handleInputChange({
                  name: `payment_date_${index + 1}`,
                  value: e.value,
                })
              }
              className="w-full"
              showIcon
            />
          </div>
          {index !== 0 && (
            <button
              type="button"
              className="p-button bg-red-700 text-white mt-2 border-0"
              onClick={() => onRemovePayment(index)}
            >
              Supprimer paiement
            </button>
          )}
        </div>
      ))}
      <button type="button" className="p-button" onClick={onAddPayment}>
        Ajouter paiement
      </button>
    </div>
  );
};

export default PaymentList;
