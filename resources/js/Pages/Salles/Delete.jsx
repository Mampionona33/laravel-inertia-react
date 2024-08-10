import React from "react";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

const Delete = ({ salle, onClose }) => {
  const { post } = useForm();

  const handleDeactivate = (e) => {
    e.preventDefault();
    post(route("salles.desactivate", salle.id), {
      method: "POST",
      preserveState: true,
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal onClose={onClose} show>
      <form onSubmit={handleDeactivate} className="flex flex-col gap-5 p-4">
        <div className="flex flex-row gap-2 m-4 align-items-center mb-0">
          <i className="pi pi-exclamation-triangle text-5xl text-red-600"></i>
          <label htmlFor="confirmation" className="text-lg">
            {`Voulez-vous vraiment désactiver ${salle.name} ?`}
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <SecondaryButton type="submit" label="Désactiver" />
          <PrimaryButton type="button" label="Annuler" onClick={onClose} />
        </div>
      </form>
    </Modal>
  );
};

export default Delete;
