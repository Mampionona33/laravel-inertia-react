import React from "react";
import InputLabel from "./InputLabel";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import PrimaryButton from "./PrimaryButton";
import { router, useForm, usePage } from "@inertiajs/react";
import Toast from "./Toast";

const FormAddDepense = () => {
  const { data, setData, reset } = useForm({
    description: "",
    amount: 0,
  });
  const [showToast, setShowToast] = React.useState(false);

  const { reservation, errors } = usePage().props;

  const handleInputChange = (name, value) => {
    setData(name, value);
  };

  // Définir le message d'erreur basé sur la première erreur
  const errorMessage = errors[Object.keys(errors)[0]]; // Utilisation d'une clé dynamique

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post(
      route("reservations.depense.store", { reservation: reservation }),
      data,
      {
        onSuccess: () => {
          reset();
        },
        onError: () => {
          setShowToast(true);
        },
      }
    );
  };

  return (
    <div className="w-full gap-4">
      {showToast && errorMessage && (
        <div className="mt-4">
          <Toast
            type="error"
            message={errorMessage}
            onClose={() => setShowToast(false)}
          />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-row gap-4 justify-between p-4"
      >
        <div className="w-1/2">
          <InputLabel htmlFor="description" value="Description *" />
          <InputText
            id="description"
            type="text"
            required
            placeholder="Raison de la dépense"
            value={data.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="p-inputtext p-component w-full"
          />
        </div>
        <div>
          <InputLabel value={"Montant *"} />
          <InputNumber
            id="amount"
            value={data.amount || null}
            required
            onValueChange={(e) => handleInputChange("amount", e.value)}
            className="w-full"
            min={0}
            placeholder="0.00 Ar"
            showButtons
            mode="currency"
            currency="MGA"
            locale="fr-MG"
          />
        </div>
        <div className="flex items-end ">
          <PrimaryButton className="w-full py-2">Ajouter</PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default FormAddDepense;
