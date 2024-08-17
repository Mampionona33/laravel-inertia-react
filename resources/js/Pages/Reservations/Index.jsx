import Layout from "@/Layouts/layout/layout";
import { Link, router, usePage } from "@inertiajs/react";
import React, { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import LayoutTitle from "@/Components/LayoutTitle";
import Toast from "@/Components/Toast";

const Index = () => {
  const { props } = usePage();
  const { success, month: queryMonth, year: queryYear } = props;

  // Parse the query parameters, falling back to the current date if they are not provided
  const [currentMonth, setCurrentMonth] = useState(() =>
    queryMonth ? parseInt(queryMonth) : new Date().getMonth() + 1
  );
  const [currentYear, setCurrentYear] = useState(() =>
    queryYear ? parseInt(queryYear) : new Date().getFullYear()
  );

  const [initialized, setInitialized] = useState(false);

  // Ensure the month and year are valid numbers, and format them correctly
  const formattedMonth = currentMonth.toString().padStart(2, "0"); // Pad with leading 0 if needed
  const initialDate = `${currentYear}-${formattedMonth}-01`; // YYYY-MM-DD format

  // Function to handle date changes and send data to the backend
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

        // Update the state if month or year changes
        if (newMonth !== currentMonth || newYear !== currentYear) {
          setCurrentMonth(newMonth);
          setCurrentYear(newYear);

          // Navigate to the updated URL without reloading the page
          router.get(
            route("reservations.index", {
              month: newMonth,
              year: newYear,
            }),
            {},
            { preserveState: true, replace: true }
          );
        }
      }
    },
    [currentMonth, currentYear]
  );

  useEffect(() => {
    // Ensure we only set the initial date once based on the URL parameters
    if (!initialized) {
      if (queryMonth && queryYear) {
        setCurrentMonth(parseInt(queryMonth));
        setCurrentYear(parseInt(queryYear));
      }
      setInitialized(true);
    }
  }, [queryMonth, queryYear, initialized]);

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
          <div className="flex justify-end">
            <Link
              href={route("reservations.create")}
              as="button"
              className="bg-green-900 text-white px-4 py-2 rounded-md"
            >
              Faire une reservation
            </Link>
          </div>
          <div className="w-full h-2/3">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              locale={"fr"}
              datesSet={handleDatesSet}
              initialDate={initialDate}
              height={"auto"}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
