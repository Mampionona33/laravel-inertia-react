import Layout from "@/Layouts/layout/layout";
import React from "react";
import { useForm } from "@inertiajs/react";
import UserForm from "@/Components/UserForm";
import LayoutTitle from "@/Components/LayoutTitle";

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
      <LayoutTitle title={"Modifier un utilisateur"} />
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
