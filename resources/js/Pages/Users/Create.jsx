import Layout from "@/Layouts/layout/layout";
import React from "react";
import { useForm } from "@inertiajs/react";
import UserForm from "@/Components/UserForm";
import LayoutTitle from "@/Components/LayoutTitle";

const Create = () => {
  const { data, setData, post, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("users.store"));
  };

  return (
    <Layout>
      <LayoutTitle title={"Ajouter un utilisateur"} />
      <UserForm
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
