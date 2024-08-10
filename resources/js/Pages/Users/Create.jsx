import Layout from "@/Layouts/layout/layout";
import React from "react";
import { useForm } from "@inertiajs/react";
import UserForm from "@/Components/UserForm";

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
      <h1 className="text-3xl font-bold text-green-950 mb-4">
        Creer un utilisateur
      </h1>
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
