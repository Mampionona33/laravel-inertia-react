import React from "react";
import InputError from "./InputError";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";

const SalleForme = ({ data, setData, handleSubmit, errors, reset }) => {
  const handleCapaciteChange = (e) => {
    // Set data.capacite to null if value is empty
    setData("capacite", e.value !== null ? e.value : null);
  };

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-9/12 justify-center shadow-sm p-4 rounded bg-white pt-6"
      >
        <div className="flex flex-col gap-4">
          <FloatLabel>
            <div className="flex flex-col gap-2">
              <div>
                <InputText
                  id="numero"
                  value={data.numero}
                  required
                  onChange={(e) => setData("numero", e.target.value)}
                  className="p-inputtext p-component w-full"
                />
                <label htmlFor="numero" className="block font-medium mb-2 pl-2">
                  Numéro
                </label>
              </div>
              {errors.numero && (
                <InputError message={errors.numero} className="text-red-600" />
              )}
            </div>
          </FloatLabel>

          <FloatLabel>
            <div className="flex flex-col gap-2">
              <div>
                <InputNumber
                  id="capacite"
                  value={data.capacite || null}
                  onValueChange={handleCapaciteChange}
                  className="p-component w-full"
                  min={0}
                  showButtons
                />
                <label
                  htmlFor="capacite"
                  className="block font-medium mb-2 pl-2"
                >
                  Capacité
                </label>
              </div>
              {errors.capacite && (
                <InputError
                  message={errors.capacite}
                  className="text-red-600"
                />
              )}
            </div>
          </FloatLabel>

          <FloatLabel>
            <div className="flex flex-col gap-2">
              <div>
                <InputNumber
                  id="loyer_journalier"
                  value={data.loyer_journalier || null} // Set to null if no value
                  onValueChange={(e) => setData("loyer_journalier", e.value)}
                  className="p-component w-full"
                  min={0}
                  showButtons
                />
                <label
                  htmlFor="loyer_journalier"
                  className="block font-medium mb-2 pl-2"
                >
                  Loyer Journalier
                </label>
              </div>
              {errors.loyer_journalier && (
                <InputError
                  message={errors.loyer_journalier}
                  className="text-red-600"
                />
              )}
            </div>
          </FloatLabel>
        </div>

        <div className="flex justify-end space-x-4">
          <SecondaryButton onClick={reset} label="Réinitialiser" />
          <PrimaryButton label="Enregistrer" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default SalleForme;
