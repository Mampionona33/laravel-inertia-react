import React from "react";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import InputError from "@/Components/InputError";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

const UserForm = ({ data, setData, handleSubmit, errors, reset }) => {
  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-9/12 justify-center shadow-sm p-4 rounded bg-white pt-6"
      >
        <FloatLabel>
          <div className="flex flex-col gap-2">
            <div>
              <InputText
                id="name"
                value={data.name}
                required
                onChange={(e) => setData("name", e.target.value)}
                className="p-inputtext p-component w-full"
              />
              <label htmlFor="name" className="block font-medium mb-2 pl-2">
                Nom
              </label>
            </div>
            {errors.name && (
              <InputError message={errors.name} className="text-red-600" />
            )}
          </div>
        </FloatLabel>

        <FloatLabel>
          <div className="flex flex-col gap-2">
            <div>
              <InputText
                id="email"
                type="email"
                required
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                className="p-inputtext p-component w-full"
              />
              <label htmlFor="email" className="block font-medium mb-2 pl-2">
                Email
              </label>
            </div>
            {errors.email && (
              <InputError message={errors.email} className="text-red-600" />
            )}
          </div>
        </FloatLabel>

        <FloatLabel>
          <div className="flex flex-col gap-2">
            <div>
              <InputText
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                className="p-inputtext p-component w-full"
              />
              <label htmlFor="password" className="block font-medium mb-2 pl-2">
                Mot de passe
              </label>
            </div>
            {errors.password && (
              <InputError message={errors.password} className="text-red-600" />
            )}
          </div>
        </FloatLabel>

        <FloatLabel>
          <div className="flex flex-col gap-2">
            <div>
              <InputText
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) =>
                  setData("password_confirmation", e.target.value)
                }
                className="p-inputtext p-component w-full"
              />
              <label
                htmlFor="password_confirmation"
                className="block font-medium mb-2 pl-2"
              >
                Confirmer le mot de passe
              </label>
            </div>
            {errors.password_confirmation && (
              <InputError
                message={errors.password_confirmation}
                className="text-red-600"
              />
            )}
          </div>
        </FloatLabel>

        <div className="flex justify-end w-full gap-4 ">
          <PrimaryButton label="Enregistrer" type="submit" />
          <button
            type="button"
            onClick={() => reset()}
            className="p-2 bg-red-500 text-white rounded"
          >
            Réinitialiser
          </button>
          <SecondaryButton
            label="Annuler"
            onClick={() => window.history.back()}
          />
        </div>
      </form>
    </div>
  );
};

export default UserForm;
