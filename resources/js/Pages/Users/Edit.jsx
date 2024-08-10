import Layout from "@/Layouts/layout/layout";
import React from "react";
import { useForm } from "@inertiajs/react";
import UserForm from "@/Components/UserForm";

const Edit = ({ user }) => {
  const { data, setData, patch, errors, reset } = useForm({
    name: user.name,
    email: user.email,
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route("users.update", user.id));
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-green-950">
        Modifier l'utilisateur
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

export default Edit;
