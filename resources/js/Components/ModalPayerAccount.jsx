import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import { InputNumber } from "primereact/inputnumber";
import InputError from "./InputError";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { useModal } from "@/Layouts/layout/context/modalContext";
import { useForm } from "@inertiajs/react";
import { format } from "date-fns";

const FormPayerAccount = ({ account }) => {
  const { handleClose } = useModal();
  const { data, patch } = useForm({
    id: account.id,
    reservation: account.reservation_id,
  });

  const handleSubmit = (e) => {
    console.log(account);
    e.preventDefault();
    patch(
      route("reservations.pay", {
        id: account.id,
        reservation: account.reservation_id,
      }),
      {
        onSuccess: () => handleClose(),
      }
    );
  };

  return (
    <div className="flex p-4 flex-col">
      <p>
        Payer la somme de <span className="font-bold">{account.amount} Ar</span>{" "}
        pour l'acompte du {format(new Date(account.due_date), "dd/MM/yyyy")}
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="id"
          id="id"
          value={account.id}
          className="hidden"
        />
        <div className="flex gap-4 justify-end">
          <PrimaryButton type="submit">Payer</PrimaryButton>
          <SecondaryButton type="button" onClick={handleClose}>
            Annuler
          </SecondaryButton>
        </div>
      </form>
    </div>
  );
};

const ModalPayerAccount = ({ show, account }) => {
  return (
    <div>
      <Modal show={show}>{<FormPayerAccount account={account} />}</Modal>
    </div>
  );
};

ModalPayerAccount.propTypes = {
  show: PropTypes.bool,
  accountId: PropTypes.array,
};

export default ModalPayerAccount;
