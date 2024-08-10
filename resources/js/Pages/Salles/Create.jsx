import Layout from "@/Layouts/layout/layout";
import React from "react";
import { useForm } from "@inertiajs/react";
import SalleForme from "@/Components/SalleForm";

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
      <h1 className="text-3xl font-bold text-green-950 mb-4">
        Creer une salle
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

export default Create;
