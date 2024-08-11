import React, { createContext, useState, useContext } from "react";

// Créez un contexte pour la réservation
const ReservationContext = createContext();

// Créez un composant Provider pour le contexte
export const ReservationProvider = ({ children }) => {
  const [data, setData] = useState({
    ref: "",
    nom_client: "",
    num_tel: "",
    date_debut: "",
    date_fin: "",
    repas: null,
    salle_id: "",
    payment_method: "",
    total_amount: "",
    paymentCount: 1,
  });

  const [errors, setErrors] = useState({});

  // Fonction pour mettre à jour les valeurs de formulaire
  const handleInputChange = (name, value) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Fonction pour ajouter un paiement
  const addPayment = () => {
    setData((prevData) => ({
      ...prevData,
      paymentCount: prevData.paymentCount + 1,
    }));
  };

  // Fonction pour retirer un paiement
  const removePayment = (index) => {
    setData((prevData) => ({
      ...prevData,
      paymentCount: Math.max(prevData.paymentCount - 1, 1),
    }));
  };

  // Fonction pour gérer l'envoi du formulaire
  const handleSubmit = (event) => {
    event.preventDefault();
    // Préparer les données pour l'envoi
    const formData = new FormData();
    formData.append("ref", data.ref);
    formData.append("nom_client", data.nom_client);
    formData.append("num_tel", data.num_tel);
    formData.append("date_debut", data.date_debut);
    formData.append("date_fin", data.date_fin);
    formData.append("repas", data.repas);
    formData.append("salle_id", data.salle_id);

    const paymentCount = data.paymentCount || 1;

    if (paymentCount > 1) {
      formData.append("payment_method", "tranches");
      const installments = Array.from({ length: paymentCount }).map(
        (_, index) => ({
          amount: data[`payment_${index + 1}`] || null,
          due_date: data[`payment_date_${index + 1}`] || null,
        })
      );
      formData.append("installments", JSON.stringify(installments));
    } else {
      formData.append("payment_method", "un_paiement");
      formData.append("total_amount", data.total_amount);
    }

    console.log("Form data:", Object.fromEntries(formData.entries()));

    // Envoi des données via Inertia ou autre méthode
    // router.post(route("reservations.store"), formData, {
    //   method: "post",
    //   onSuccess: () => {
    //     reset();
    //   },
    // });
  };

  return (
    <ReservationContext.Provider
      value={{
        data,
        setData,
        errors,
        setErrors,
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

// Créez un hook pour utiliser le contexte plus facilement
export const useReservation = () => useContext(ReservationContext);
