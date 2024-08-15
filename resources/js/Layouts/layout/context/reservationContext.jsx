import React, { createContext, useContext, useEffect } from "react";
import { useForm } from "@inertiajs/react";

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const { data, setData, errors, reset, post } = useForm({
    ref: "",
    nom_client: "",
    num_tel: "",
    date_debut: "",
    date_fin: "",
    repas: null,
    salle_id: "",
    payment_method: "un_paiement",
    total_amount: 0,
    paymentCount: 1,
  });

  const handleInputChange = (name, value) => {
    setData(name, value);
  };

  const updateTotalAmount = React.useCallback(() => {
    const total = Array.from({ length: data.paymentCount }).reduce(
      (sum, _, index) => {
        const amount = data[`payment_${index + 1}`] || 0;
        return sum + Number(amount);
      },
      0
    );
    if (total !== data.total_amount) {
      setData("total_amount", total);
    }
  }, [data.paymentCount, data]);

  const addPayment = () => {
    setData("paymentCount", data.paymentCount + 1);
  };

  const removePayment = (index) => {
    setData((prevData) => {
      const newData = { ...prevData };
      delete newData[`payment_${index + 1}`];
      delete newData[`payment_date_${index + 1}`];
      return newData;
    });

    setData("paymentCount", Math.max(data.paymentCount - 1, 1));
  };

  const handlePaymentMethodChange = () => {
    if (data.paymentCount > 1) {
      setData("payment_method", "tranches");
    } else {
      setData("payment_method", "un_paiement");
    }
  };

  useEffect(() => {
    handlePaymentMethodChange();
    updateTotalAmount();
  }, [
    data.paymentCount,
    JSON.stringify(
      Array.from({ length: data.paymentCount }).map(
        (_, index) => data[`payment_${index + 1}`]
      )
    ),
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("ref", data.ref);
    formData.append("nom_client", data.nom_client);
    formData.append("num_tel", data.num_tel);
    formData.append("date_debut", new Date(data.date_debut).toISOString());
    formData.append("date_fin", new Date(data.date_fin).toISOString());
    formData.append("repas", data.repas);
    formData.append("salle_id", data.salle_id);

    const paymentCount = data.paymentCount || 1;

    let totalAmount = 0;

    if (paymentCount > 1) {
      const tranches = Array.from({ length: paymentCount }).map((_, index) => ({
        amount: data[`payment_${index + 1}`] || 0,
        due_date: new Date(data[`payment_date_${index + 1}`]).toISOString(),
      }));
      totalAmount = tranches.reduce(
        (sum, { amount }) => sum + Number(amount),
        0
      );
      formData.append("tranches", JSON.stringify(tranches));
    } else {
      totalAmount = data.total_amount;
    }

    // Ajout du total_amount dans le formData
    formData.append("total_amount", totalAmount);

    // Log pour vérifier les données envoyées
    console.log(
      "Form data to be sent:",
      Object.fromEntries(formData.entries())
    );
    console.log("Total Amount Calculated:", totalAmount);

    if (data.total_amount === 0) {
      console.warn("Total amount is not calculated yet.");
      return;
    }

    // Appel POST
    post(route("reservations.store"), {
      onSuccess: () => reset(),
      onError: (errors) => console.log(errors),
      preserveScroll: true,
      preserveState: true,
      data: formData,
    });
  };

  return (
    <ReservationContext.Provider
      value={{
        data,
        setData,
        errors,
        reset,
        handleInputChange,
        addPayment,
        removePayment,
        // updateTotalAmount,
        handleSubmit,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => useContext(ReservationContext);
