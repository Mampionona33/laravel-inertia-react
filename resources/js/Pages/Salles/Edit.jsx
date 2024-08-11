import Layout from "@/Layouts/layout/layout";
import React from "react";
import { useForm } from "@inertiajs/react";
import SalleForme from "@/Components/SalleForm";
import LayoutTitle from "@/Components/LayoutTitle";

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
      <LayoutTitle title={`Modifier la salle ${salle.id}`} />
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
