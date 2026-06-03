import React from "react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1c236d] text-white border-t border-blue-800">
      <div className="px-6 py-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* System Info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/POLICE LOGO - APP - PLAIN 2.png"
                alt="Logo"
                className="w-12 h-12 object-contain bg-white rounded-md p-1"
              />

              <div>
                <h3 className="font-bold text-lg">
                  Ticket Support System
                </h3>
                <p className="text-sm text-blue-200">
                  Service Desk Portal
                </p>
              </div>
            </div>

            <p className="text-sm text-blue-200">
              Manage incidents, service requests, complaints,
              investigations and support tickets from a single platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">
              Quick Links
            </h4>

            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <a href="/dashboard" className="hover:text-white">
                  Dashboard
                </a>
              </li>

              <li>
                <a href="/tickets" className="hover:text-white">
                  Tickets
                </a>
              </li>

              <li>
                <a href="/reports" className="hover:text-white">
                  Reports
                </a>
              </li>

              <li>
                <a href="/settings" className="hover:text-white">
                  Settings
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">
              Contact Information
            </h4>

            <ul className="space-y-2 text-sm text-blue-200">
              <li>📍 Dar es Salaam, Tanzania</li>
              <li>📞 +255 787 668 306</li>
              <li>✉️ support@ticketsystem.local</li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-blue-800 mt-8 pt-4 text-center text-sm text-blue-300">
          © {currentYear} Ticket Support System. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;