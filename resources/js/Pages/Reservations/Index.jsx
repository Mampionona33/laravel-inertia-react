import Layout from "@/Layouts/layout/layout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import LayoutTitle from "@/Components/LayoutTitle";
import Toast from "@/Components/Toast";
import { TreeSelect } from "primereact/treeselect";
import InputError from "@/Components/InputError";

const Index = () => {
  const { props } = usePage();
  const {
    success,
    currentSalleId,
    reservedSalles,
    reservationsInMonth,
    salles,
    errors,
  } = props;
  const { data, setData, reset } = useForm({
    id: currentSalleId || "",
    numero: "",
  });

  const [showToast, setShowToast] = useState(true);

  // Extract query params from window.location
  const searchParams = new URLSearchParams(window.location.search);
  const queryMonth = searchParams.get("month");
  const queryYear = searchParams.get("year");

  const salleOpt = salles.map((salle) => ({
    key: salle.id.toString(),
    label: salle.numero,
    value: salle.id,
  }));

  const handleNodeSelect = (e) => {
    const selectedSalleId = e.value;
    setData("id", selectedSalleId);

    // Rediriger vers l'URL avec la salle sélectionnée et les paramètres de date actuels
    router.get(
      route("reservations.index", {
        salle_id: selectedSalleId,
        month: queryMonth || new Date().getMonth() + 1,
        year: queryYear || new Date().getFullYear(),
      }),
      {},
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };

  // Initialize month and year based on the query or default to the current date
  const currentMonth = queryMonth
    ? parseInt(queryMonth)
    : new Date().getMonth() + 1;
  const currentYear = queryYear
    ? parseInt(queryYear)
    : new Date().getFullYear();

  // UseEffect to update parsingData when data.id or reservations change
  const parsingData = useMemo(() => {
    if (data.id) {
      return reservationsInMonth.map((reservation) => ({
        id: reservation.id,
        title: reservation.nom_client,
        start: reservation.date_debut,
        end: reservation.date_fin,
      }));
    } else {
      return reservationsInMonth.length
        ? [
            {
              title: "Réservations globales",
              start: Math.min(
                ...reservationsInMonth.map(
                  (reservation) => new Date(reservation.date_debut)
                )
              ),
              end: Math.max(
                ...reservationsInMonth.map(
                  (reservation) => new Date(reservation.date_fin)
                )
              ),
            },
          ]
        : [];
    }
  }, [data.id, reservationsInMonth]);

  // Function to handle date changes and navigate if necessary
  const handleDatesSet = useCallback(
    (arg) => {
      const startDate = new Date(arg.start);
      const endDate = new Date(arg.end);

      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        const middleDate = new Date(
          (startDate.getTime() + endDate.getTime()) / 2
        );

        const newMonth = middleDate.getMonth() + 1;
        const newYear = middleDate.getFullYear();

        if (newMonth !== currentMonth || newYear !== currentYear) {
          const routeParams = {
            month: newMonth,
            year: newYear,
          };

          if (data.id) {
            routeParams.salle_id = data.id;
          }

          router.get(
            route("reservations.index", routeParams),
            {},
            { preserveState: true, preserveScroll: true, replace: true }
          );
        }
      }
    },
    [currentMonth, currentYear, data.id, reset]
  );

  const handleEventClick = (event) => {
    if (!currentSalleId) {
      alert("Veuillez choisir une salle");
      return;
    }
    console.log(event.event.id);
    router.get(route("reservations.detail", event.event.id));
  };

  return (
    <Layout>
      <div>
        <LayoutTitle title={"Reservations"} />
        {success && showToast && (
          <Toast
            type={"success"}
            message={success}
            onClose={() => setShowToast(false)}
          />
        )}
        <div className="flex justify-between flex-wrap flex-col gap-4">
          <div className="flex justify-between">
            <div>
              <div className="flex flex-col gap-2 col-span-1 md:col-span-2 lg:col-span-3 min-w-9">
                <label
                  htmlFor="id"
                  className="block font-medium text-sm text-gray-500 pl-2"
                >
                  Choisir une salle
                </label>
                <TreeSelect
                  id="id"
                  required
                  value={data.id}
                  options={salleOpt}
                  onChange={handleNodeSelect}
                  placeholder="Sélectionner une salle"
                  className="w-full"
                />
                {errors.salle_id && (
                  <InputError
                    message={errors.salle_id}
                    className="text-red-600"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end items-end">
              <div>
                <Link
                  href={route("reservations.create")}
                  as="button"
                  className="bg-green-900 text-white px-4 py-2 rounded-md"
                >
                  Faire une reservation
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full h-3/4">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              locale={"fr"}
              datesSet={handleDatesSet}
              eventClick={handleEventClick}
              eventBackgroundColor="#008000"
              eventTextColor="#fff"
              eventBorderColor="#008000"
              editable={true}
              displayEventTime={false}
              initialDate={`${currentYear}-${currentMonth
                .toString()
                .padStart(2, "0")}-01`}
              height={450}
              events={parsingData}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
