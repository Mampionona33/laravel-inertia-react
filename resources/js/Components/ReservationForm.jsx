import React, { useState, useEffect } from "react";
import PrimaryButton from "./PrimaryButton";
import { InputText } from "primereact/inputtext";
import { router, usePage } from "@inertiajs/react";
import { TreeSelect } from "primereact/treeselect";
import InputError from "./InputError";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import SecondaryButton from "./SecondaryButton";
import usePaymentPlan from "@/hooks/usePaymentPlan";
import PaymentList from "./PyementList";

const ReservationForm = ({ data, setData, handleSubmit, errors, reset }) => {
  const salles = usePage().props.salles;
  const [selectedNodeKey, setSelectedNodeKey] = useState(data.salle_id || null);
  const { paymentCount, addPayment, removePayment } = usePaymentPlan();

  // Transformez les salles en une structure adaptée pour TreeSelect
  const salleOpt = salles.map((salle) => ({
    key: salle.id.toString(),
    label: salle.numero,
    value: salle.id,
  }));

  // Gestion des changements dans TreeSelect
  const handleNodeSelect = (e) => {
    setSelectedNodeKey(e.value);
    setData("salle_id", e.value);
  };

  const onCancel = () => {
    router.visit(route("reservations.index"), {
      method: "get",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target || e;
    setData(name, value !== null ? value : null);
  };

  return (
    <div className="flex flex-col items-center">
      <form
        className="w-11/12 shadow-sm p-6 rounded bg-white"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Référence */}
          <div className="flex flex-col gap-2 col-span-1 md:col-span-2 lg:col-span-3">
            <label
              htmlFor="ref"
              className="block font-medium text-sm text-gray-500 pl-2"
            >
              Référence
            </label>
            <InputText
              id="ref"
              value={data.ref}
              required
              onChange={(e) => setData("ref", e.target.value)}
              className="p-inputtext p-component w-full"
            />
            {errors.ref && (
              <InputError message={errors.ref} className="text-red-600" />
            )}
          </div>

          {/* Nom du client */}
          <div className="flex flex-col gap-2 col-span-1 md:col-span-2 lg:col-span-3">
            <label
              htmlFor="nom_client"
              className="block font-medium text-sm text-gray-500 pl-2"
            >
              Nom du client
            </label>
            <InputText
              id="nom_client"
              value={data.nom_client}
              required
              onChange={(e) => setData("nom_client", e.target.value)}
              className="p-inputtext p-component w-full"
            />
            {errors.nom_client && (
              <InputError
                message={errors.nom_client}
                className="text-red-600"
              />
            )}
          </div>

          {/* Numéro de téléphone */}
          <div className="flex flex-col gap-2 col-span-1 md:col-span-2 lg:col-span-3">
            <label
              htmlFor="num_tel"
              className="block font-medium text-sm text-gray-500 pl-2"
            >
              N° de téléphone
            </label>
            <InputText
              id="num_tel"
              value={data.num_tel}
              required
              onChange={(e) => setData("num_tel", e.target.value)}
              className="p-inputtext p-component w-full"
            />
            {errors.num_tel && (
              <InputError message={errors.num_tel} className="text-red-600" />
            )}
          </div>

          {/* Date de début */}
          <div className="flex flex-col gap-2 col-span-1 md:col-span-2 lg:col-span-3">
            <label
              htmlFor="date_debut"
              className="block font-medium text-sm text-gray-500 pl-2"
            >
              Date de début
            </label>
            <Calendar
              id="date_debut"
              required
              value={data.date_debut}
              onChange={(e) => setData("date_debut", e.value)}
              className="w-full"
              showIcon
            />
            {errors.date_debut && (
              <InputError
                message={errors.date_debut}
                className="text-red-600"
              />
            )}
          </div>

          {/* Date fin */}
          <div className="flex flex-col gap-2 col-span-1 md:col-span-2 lg:col-span-3">
            <label
              htmlFor="date_fin"
              className="block font-medium text-sm text-gray-500 pl-2"
            >
              Date fin
            </label>
            <Calendar
              id="date_fin"
              required
              value={data.date_fin}
              onChange={(e) => setData("date_fin", e.value)}
              className="w-full"
              showIcon
            />
            {errors.date_fin && (
              <InputError message={errors.date_fin} className="text-red-600" />
            )}
          </div>

          {/* Repas */}
          <div className="flex flex-col gap-2 col-span-1 md:col-span-2 lg:col-span-3">
            <label
              htmlFor="repas"
              className="block font-medium text-sm text-gray-500 pl-2"
            >
              Repas
            </label>
            <InputNumber
              id="repas"
              value={data.repas || null}
              onValueChange={(e) =>
                handleInputChange({ name: "repas", value: e.value })
              }
              className="h-12 w-full"
              min={0}
              showButtons
            />
            {errors.repas && (
              <InputError message={errors.repas} className="text-red-600" />
            )}
          </div>

          {/* Choisir une salle */}
          <div className="flex flex-col gap-2 col-span-1 md:col-span-2 lg:col-span-3 min-w-9">
            <label
              htmlFor="salle_id"
              className="block font-medium text-sm text-gray-500 pl-2"
            >
              Choisir une salle
            </label>
            <TreeSelect
              id="salle_id"
              required
              value={selectedNodeKey}
              options={salleOpt}
              onChange={handleNodeSelect}
              placeholder="Sélectionner une salle"
              className="w-full"
            />
            {errors.salle_id && (
              <InputError message={errors.salle_id} className="text-red-600" />
            )}
          </div>
        </div>

        {/* Gestion des paiements */}
        <PaymentList
          data={data}
          setData={setData}
          handleInputChange={handleInputChange}
          paymentCount={paymentCount}
          onRemovePayment={removePayment}
          onAddPayment={addPayment}
        />

        <div className="flex justify-end col-span-full mt-4 gap-4">
          <SecondaryButton label="Annuler" onClick={onCancel} />
          <PrimaryButton label="Enregistrer" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
