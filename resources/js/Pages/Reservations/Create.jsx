import LayoutTitle from "@/Components/LayoutTitle";
import ReservationForm from "@/Components/ReservationForm";
import Layout from "@/Layouts/layout/layout";
import { useForm, router } from "@inertiajs/react";
import React from "react";

const Create = () => {
  const { data, setData, errors, reset } = useForm({
    ref: "",
    nom_client: "",
    num_tel: "",
    date_debut: "",
    date_fin: "",
    repas: null,
    salle_id: "",
    payment_method: "",
    total_amount: "", // Ajouté pour gérer le paiement unique
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Handle submit called"); // Vérifiez si ce log apparaît

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

    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    console.log(formDataObj);

    // Envoi des données via Inertia
    // router.post(route("reservations.store"), formData, {
    //   method: "post",
    //   onSuccess: () => {
    //     reset();
    //   },
    // });
  };

  return (
    <Layout>
      <div>
        <LayoutTitle title={"Faire une réservation"} />
        <ReservationForm
          data={data}
          setData={setData}
          handleSubmit={handleSubmit}
          errors={errors}
          reset={reset}
        />
      </div>
    </Layout>
  );
};

export default Create;
