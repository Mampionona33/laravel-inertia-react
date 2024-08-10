import Layout from "@/Layouts/layout/layout";
import { Link, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Index = () => {
  const [showToast, setShowToast] = useState(true);
  const { props } = usePage();
  const { success } = props;

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-green-950 mb-2">Reservations</h1>
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
              href={route("users.create")}
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
              viewHeight={"auto"}
              height={"auto"}
              locale={"fr"}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
