import Layout from "@/Layouts/layout/layout";
import React from "react";
import { useForm } from "@inertiajs/react";
import SalleForme from "@/Components/SalleForm";
import LayoutTitle from "@/Components/LayoutTitle";

const Create = () => {
  const { data, setData, post, errors, reset } = useForm({
    numero: "",
    capacite: "",
    loyer_journalier: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("salles.store"));
  };

  return (
    <Layout>
      <LayoutTitle title={"Ajouter une salle"} />
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

export default Create;
