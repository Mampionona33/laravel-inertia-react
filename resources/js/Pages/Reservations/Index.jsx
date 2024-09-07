import Layout from "@/Layouts/layout/layout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import React, { useState, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import LayoutTitle from "@/Components/LayoutTitle";
import Toast from "@/Components/Toast";
import { TreeSelect } from "primereact/treeselect";
import InputError from "@/Components/InputError";

const getReservationColor = (reservationId, latePayments, paidReservations) => {
  // Vérifier si la réservation a des paiements en retard
  const hasLatePayments = latePayments.some((res) => res.id === reservationId);

  // Vérifier si tous les paiements sont "paid"
  const allPaid = paidReservations.some((res) => res.id === reservationId);

  // Vérifier si tous les paiements sont en "pending" et pas en retard
  const allPendingAndNotLate =
    !hasLatePayments &&
    paidReservations.some(
      (res) => res.id === reservationId && res.status === "pending"
    );

  if (allPaid) {
    return "#16a085"; // Vert foncé si tous les paiements sont payés
  } else if (hasLatePayments) {
    return "#c0392b"; // Rouge si au moins un paiement est en retard
  } else if (allPendingAndNotLate) {
    return "#3498db"; // Bleu si tous les paiements sont en pending et pas en retard
  }
  return "#3498db";
};

// Fonction pour fusionner les réservations qui se chevauchent
const mergeOverlappingReservations = (reservations) => {
  if (reservations.length === 0) return [];

  const sortedReservations = reservations.sort(
    (a, b) => new Date(a.date_debut) - new Date(b.date_debut)
  );

  const mergedReservations = [];
  let currentMerged = {
    start: sortedReservations[0].date_debut,
    end: sortedReservations[0].date_fin,
  };

  sortedReservations.forEach((reservation, index) => {
    const currentStart = new Date(reservation.date_debut);
    const currentEnd = new Date(reservation.date_fin);
    const mergedEnd = new Date(currentMerged.end);

    if (currentStart <= mergedEnd) {
      // Étendre la période fusionnée si les réservations se chevauchent
      currentMerged.end =
        currentEnd > mergedEnd ? reservation.date_fin : currentMerged.end;
    } else {
      // Ajouter la période fusionnée à la liste et commencer une nouvelle période
      mergedReservations.push({
        ...currentMerged,
        title: "Réservations globales",
      });
      currentMerged = {
        start: reservation.date_debut,
        end: reservation.date_fin,
      };
    }

    // Ajouter le dernier événement fusionné à la liste
    if (index === sortedReservations.length - 1) {
      mergedReservations.push({
        ...currentMerged,
        title: "Réservations globales",
      });
    }
  });

  return mergedReservations;
};

const Index = () => {
  const { props } = usePage();
  const {
    success,
    currentSalleId,
    reservationsInMonth,
    listReservationHasLatePayments,
    listPaidReservations,
    salles,
    errors,
  } = props;

  const { data, setData } = useForm({
    id: currentSalleId || "",
    numero: "",
  });

  const [showToast, setShowToast] = useState(true);

  // Extraction des paramètres de recherche de la date actuelle
  const searchParams = new URLSearchParams(window.location.search);
  const queryMonth = searchParams.get("month");
  const queryYear = searchParams.get("year");
  const currentMonth = queryMonth
    ? parseInt(queryMonth)
    : new Date().getMonth() + 1;
  const currentYear = queryYear
    ? parseInt(queryYear)
    : new Date().getFullYear();

  // Options pour le TreeSelect des salles
  const salleOpt = salles.map((salle) => ({
    key: salle.id.toString(),
    label: salle.numero,
    value: salle.id,
  }));

  // Gérer la sélection de la salle
  const handleNodeSelect = (e) => {
    const selectedSalleId = e.value;
    setData("id", selectedSalleId);

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

  // Préparer les données pour le calendrier
  const parsingData = useMemo(() => {
    if (data.id) {
      reservationsInMonth.map((res) => {
        console.log(res);
      });
      return reservationsInMonth.map((reservation) => ({
        id: reservation.id,
        title: reservation.nom_client,
        start: reservation.date_debut,
        end: reservation.date_fin,
        backgroundColor: getReservationColor(
          reservation.id,
          listReservationHasLatePayments,
          listPaidReservations
        ),
        borderColor: getReservationColor(
          reservation.id,
          listReservationHasLatePayments,
          listPaidReservations
        ),
      }));
    } else {
      return mergeOverlappingReservations(reservationsInMonth);
    }
  }, [data.id, reservationsInMonth, listReservationHasLatePayments]);

  // Gérer les changements de dates dans le calendrier
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
    [currentMonth, currentYear, data.id]
  );

  // Gérer le clic sur un événement du calendrier
  const handleEventClick = (event) => {
    if (!currentSalleId) {
      alert("Veuillez choisir une salle");
      return;
    }
    router.get(route("reservations.account", event.event.id));
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
              eventTextColor="#fff"
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
