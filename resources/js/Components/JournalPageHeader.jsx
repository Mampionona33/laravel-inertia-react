import { Link, router, useForm, usePage } from "@inertiajs/react";
import { Calendar } from "primereact/calendar";
import React, { useEffect } from "react";
import InputError from "./InputError";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { format, parseISO, isValid, startOfMonth, endOfMonth } from "date-fns";
import Ar from "@/assets/ariaryCurrency";
import FinancialCard from "./FinancialCard";

const JournalPageHeader = () => {
  const {
    date_fin,
    date_debut,
    journalEntries,
    totalDepenses,
    totalEncaissements,
    total,
    errors: journalErrors,
  } = usePage().props;

  // Utilisez useForm pour gérer les états du formulaire
  const { data, errors, setData } = useForm({
    date_debut: date_debut ? parseISO(date_debut) : startOfMonth(new Date()),
    date_fin: date_fin ? parseISO(date_fin) : endOfMonth(new Date()),
  });

  useEffect(() => {
    // Gestion de la date de début
    if (date_debut) {
      const parsedDateDebut = parseISO(date_debut);
      if (isValid(parsedDateDebut)) {
        setData("date_debut", parsedDateDebut);
      }
    }

    // Gestion de la date de fin
    if (date_fin) {
      const parsedDateFin = parseISO(date_fin);
      if (isValid(parsedDateFin)) {
        setData("date_fin", parsedDateFin);
      }
    }

    // Rediriger avec les valeurs par défaut si aucune date n'est fournie
    if (!date_debut && !date_fin) {
      router.get(
        route("journal.index"),
        {
          date_debut: format(startOfMonth(new Date()), "yyyy-MM-dd"),
          date_fin: format(endOfMonth(new Date()), "yyyy-MM-dd"),
        },
        { preserveState: true }
      );
    }
  }, [date_debut, date_fin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.get(
      route("journal.index"),
      {
        date_debut: format(data.date_debut, "yyyy-MM-dd"),
        date_fin: format(data.date_fin, "yyyy-MM-dd"),
      },
      {
        preserveState: true,
        onError: (error) => {
          // console.log("error", error);
        },
      }
    );
  };

  const handleClickExport = (e) => {
    e.preventDefault();
    window.open(
      route("journal.export", {
        date_debut: format(data.date_debut, "yyyy-MM-dd"),
        date_fin: format(data.date_fin, "yyyy-MM-dd"),
      }),
      "_blank"
    );
  };

  return (
    <div className="flex justify-between flex-col gap-4">
      <form method="GET" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-2">
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
              dateFormat="dd/mm/yy"
              value={data.date_debut}
              onChange={(e) => setData("date_debut", e.value)}
              className="w-full"
              showIcon
            />
            {journalErrors.date_debut && (
              <InputError
                message={journalErrors.date_debut}
                className="text-red-600"
              />
            )}
          </div>

          {/* Date de fin */}
          <div className="flex flex-col gap-2 col-span-1 md:col-span-2 lg:col-span-3">
            <label
              htmlFor="date_fin"
              className="block font-medium text-sm text-gray-500 pl-2"
            >
              Date de fin
            </label>
            <Calendar
              id="date_fin"
              required
              dateFormat="dd/mm/yy"
              value={data.date_fin}
              onChange={(e) => setData("date_fin", e.value)}
              className="w-full"
              showIcon
            />
            {journalErrors.date_fin && (
              <InputError
                message={journalErrors.date_fin}
                className="text-red-600"
              />
            )}
          </div>

          {/* Boutons */}
          <div className="flex flex-row gap-2 col-span-2 md:col-span-2 lg:col-span-3">
            <div className="flex justify-end items-end">
              <PrimaryButton
                type="submit"
                className="w-full"
                disabled={!data.date_debut || !data.date_fin}
              >
                Afficher
              </PrimaryButton>
            </div>
            <div className="flex justify-end items-end">
              <Link
                type="button"
                style={{ padding: "0.75rem 1.25rem" }}
                className="w-full rounded-md text-lg bg-blue-500 text-white"
                onClick={handleClickExport}
              >
                Export
              </Link>
            </div>
          </div>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FinancialCard
          amount={Ar(totalDepenses)}
          title="Total des depenses"
          iconClass="pi pi-money-bill text-white"
          bgColor="bg-red-500"
          cardBackground="bg-red-50"
        />

        <FinancialCard
          amount={Ar(totalEncaissements)}
          title="Total des recettes"
          iconClass="pi pi-money-bill text-white"
          bgColor="bg-green-500"
          cardBackground="bg-green-50"
        />

        <FinancialCard
          amount={Ar(totalEncaissements - totalDepenses)}
          title="Solde"
          iconClass="pi pi-dollar text-white"
          bgColor="bg-yellow-500"
          cardBackground="bg-yellow-50"
        />
      </div>
    </div>
  );
};

export default JournalPageHeader;
