import LayoutTitle from "@/Components/LayoutTitle";
import ReservationForm from "@/Components/ReservationForm";
import Layout from "@/Layouts/layout/layout";
import { useForm, router } from "@inertiajs/react";
import React from "react";

const Create = () => {
  return (
    <Layout>
      <div>
        <LayoutTitle title={"Faire une réservation"} />
        <ReservationForm />
      </div>
    </Layout>
  );
};

export default Create;
