import { Link, Head } from '@inertiajs/react';
import {LayoutContext, LayoutProvider} from "@/Layouts/layout/context/layoutcontext.jsx";
import {PrimeReactProvider} from "primereact/api";
import {Button} from "primereact/button";
import React, {useContext} from "react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const { layoutConfig} = useContext(LayoutContext);
    return (
        <>
            <PrimeReactProvider>
                <LayoutProvider>
            <Head title="Welcome" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="sm:fixed sm:top-0 sm:left-0 p-6">

                    <div className="flex align-items-center">
                        {/* <img src={`/images/logo/-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="100.22px" height={'35px'} alt="logo" className="mr-3"/> */}
                        <img src={`/images/logo/-avec-text.svg`} width="100.22px" alt="logo" className="mr-3"/>

                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Log in
                                </Link>
                            </>
                        )}
                    </div>
                </div>


                <div className="grid grid-nogutter surface-0 text-800 m-0 min-h-screen">
                    <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
                        <section>
                            <span className="block text-6xl font-bold mb-1">Dashboard Fafiala</span>
                            <div className="text-6xl text-green-700 font-bold mb-3">Gestion Optimale des Salles et Finances</div>
                            <p className="mt-0 mb-4 text-700 line-height-3">Votre solution complète pour la gestion des salles en location : suivez vos réservations, gérez vos revenus et contrôlez vos mouvements financiers avec facilité.</p>
                           
                        </section>
                    </div>
                    <div className="col-12 md:col-6 overflow-hidden">
                        <img src="/images/hero/fafiala_background_image_02.jpg" alt="backround_fafial" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                    </div>
                </div>

            </div>
            </LayoutProvider>
            </PrimeReactProvider>
        </>
    );
}
