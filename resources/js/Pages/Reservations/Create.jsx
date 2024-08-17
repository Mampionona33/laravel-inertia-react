import LayoutTitle from "@/Components/LayoutTitle";
import ReservationForm from "@/Components/ReservationForm";
import Toast from "@/Components/Toast";
import { useReservation } from "@/Layouts/layout/context/reservationContext";
import Layout from "@/Layouts/layout/layout";
import React from "react";

const Create = () => {
  const [showToast, setShowToast] = React.useState(true);
  const { errors } = useReservation();

  React.useEffect(() => {
    setShowToast(true);
  }, [errors]);

  return (
    <Layout>
      <LayoutTitle title={"Faire une réservation"} />
      <div>
        {errors && errors.salle_id && showToast && (
          <Toast
            message={errors.salle_id}
            type={"error"}
            position={"top-center"}
            onClose={() => setShowToast(false)}
          />
        )}
        <ReservationForm />
      </div>
    </Layout>
  );
};

export default Create;
