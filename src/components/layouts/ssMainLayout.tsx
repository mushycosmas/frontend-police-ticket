import React from "react";
import { Outlet } from "react-router-dom";



const MainLayout = () => {
    return (
        <div className="d-flex flex-column vh-100">

            {/* HEADER */}
           

            <div className="d-flex flex-grow-1">

                {/* SIDEBAR */}
               

                {/* MAIN CONTENT */}
                <main className="flex-grow-1 p-3 bg-light">
                    <Outlet />   {/* 🔥 FIX IS HERE */}
                </main>

            </div>

            {/* FOOTER */}
            

        </div>
    );
};

export default MainLayout;