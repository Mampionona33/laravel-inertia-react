import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
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
    nb_participants: 0,
    remarques: "",
    activites: "",
    total_amount: 0,
    paymentCount: 1,
    installments: [{ amount: 0, due_date: "" }],
  });

  const handleInputChange = (name, value) => {
    setData(name, value);
  };

  // Mise à jour du montant total
  const updateTotalAmount = useCallback(() => {
    const total = Array.from({ length: data.paymentCount }).reduce(
      (sum, _, index) => {
        const amount = data[`amount_${index + 1}`] || 0;
        return sum + Number(amount);
      },
      0
    );

    // Mise à jour du total_amount uniquement si le montant a changé
    if (total !== data.total_amount) {
      setData("total_amount", total);
    }
  }, [data.paymentCount, data]);

  const updateInstallments = () => {
    const installments = Array.from({ length: data.paymentCount }).map(
      (_, index) => ({
        amount: data[`amount_${index + 1}`] || 0,
        due_date: data[`due_date_${index + 1}`] || "",
      })
    );
    setData("installments", installments);
  };

  const addPayment = () => {
    setData("paymentCount", data.paymentCount + 1);
  };

  const removePayment = (index) => {
    setData((prevData) => {
      const newData = { ...prevData };
      delete newData[`amount_${index + 1}`];
      delete newData[`due_date_${index + 1}`];
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

  // UseEffect pour détecter les changements et mettre à jour les valeurs nécessaires
  useEffect(() => {
    handlePaymentMethodChange();
    updateTotalAmount();
    updateInstallments();
  }, [data.paymentCount, JSON.stringify(data)]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("ref", data.ref);
    formData.append("nom_client", data.nom_client);
    formData.append("num_tel", data.num_tel);
    formData.append("activites", data.activites);
    formData.append("remarques", data.remarques);
    formData.append("nb_participants", data.nb_participants);
    formData.append("date_debut", new Date(data.date_debut).toISOString());
    formData.append("date_fin", new Date(data.date_fin).toISOString());
    formData.append("repas", data.repas);
    formData.append("salle_id", data.salle_id);

    const paymentCount = data.paymentCount || 1;

    let totalAmount = 0;

    if (paymentCount > 1) {
      const tranches = Array.from({ length: paymentCount }).map((_, index) => ({
        amount: data[`amount_${index + 1}`] || 0,
        due_date: new Date(data[`due_date_${index + 1}`]).toISOString(),
      }));
      totalAmount = tranches.reduce(
        (sum, { amount }) => sum + Number(amount),
        0
      );
      formData.append("tranches", JSON.stringify(tranches));
    } else {
      totalAmount = data.total_amount;
    }

    if (totalAmount > 0) {
      formData.append("total_amount", totalAmount);
    }

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
        handleSubmit,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => useContext(ReservationContext);
