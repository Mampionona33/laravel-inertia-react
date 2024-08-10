import Layout from "@/Layouts/layout/layout";
import React from "react";
import { useForm } from "@inertiajs/react";
import SalleForme from "@/Components/SalleForm";

const Edit = ({ salle }) => {
  const { data, setData, patch, errors, reset } = useForm({
    numero: salle.numero,
    capacite: salle.capacite,
    loyer_journalier: salle.loyer_journalier,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route("salles.update", salle.id));
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-green-950 mb-4">
        {`Modifier la salle: ${salle.numero}`}
      </h1>
      <SalleForme
        data={data}
        setData={setData}
        handleSubmit={handleSubmit}
        errors={errors}
        reset={reset}
      />
    </Layout>
  );
};

export default Edit;
