import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1c236d] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12 lg:gap-6 lg:py-10">
          
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mr-4 shadow-lg p-1 overflow-hidden">
                <img src="/POLICE LOGO - APP - PLAIN 2.png" alt="Police Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Ticket Support</h2>
                <p className="text-sm text-gray-300">System</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Dedicated to providing excellent support services. Our platform helps manage and resolve issues efficiently while maintaining highest standards of service quality.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-5">
              <a href="#facebook" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all transform hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 7h-2.5v2.5H16v2h-2.5V18h-2v-3.5H9v-2h2.5V10c0-1.1.9-2 2-2h2v2h-1.5v1.5z" />
                </svg>
              </a>
              <a href="#twitter" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all transform hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.12A9.374 9.374 0 0023 3z" />
                </svg>
              </a>
              <a href="#youtube" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all transform hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 0H1C.4 0 0 .5 0 1v22c0 .5.4 1 1 1h22c.6 0 1-.5 1-1V1c0-.5-.4-1-1-1zm-15 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.397-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#instagram" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all transform hover:-translate-y-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.88 1.44 1.44 0 010 2.88z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-white/30 inline-block">Contact Information</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-1 text-white/70 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>Main Office Address<br />City Center Building</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-white/70 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                +255 787 668 306
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-white/70 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <a href="mailto:support@ticketsystem.local" className="hover:text-white transition">support@ticketsystem.local</a>
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-white/30 inline-block">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-white transition flex items-center"><span className="mr-2">→</span> Dashboard</a></li>
              <li><a href="/create-ticket" className="text-gray-300 hover:text-white transition flex items-center"><span className="mr-2">→</span> Create Ticket</a></li>
              <li><a href="/tickets" className="text-gray-300 hover:text-white transition flex items-center"><span className="mr-2">→</span> View Tickets</a></li>
              <li><a href="/reports" className="text-gray-300 hover:text-white transition flex items-center"><span className="mr-2">→</span> Reports</a></li>
              <li><a href="/settings" className="text-gray-300 hover:text-white transition flex items-center"><span className="mr-2">→</span> Settings</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-white/30 inline-block">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#help" className="text-gray-300 hover:text-white transition flex items-center"><span className="mr-2">→</span> Help Center</a></li>
              <li><a href="#faq" className="text-gray-300 hover:text-white transition flex items-center"><span className="mr-2">→</span> FAQ</a></li>
              <li><a href="#docs" className="text-gray-300 hover:text-white transition flex items-center"><span className="mr-2">→</span> Documentation</a></li>
              <li><a href="#status" className="text-gray-300 hover:text-white transition flex items-center"><span className="mr-2">→</span> System Status</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition flex items-center"><span className="mr-2">→</span> Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-px bg-white/10"></div>
        
        {/* Footer Bottom */}
        <div className="py-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Ticket Support System. Haki zote zimehifadhiwa.</p>
        </div>
      </div>
    </footer>
  );
};
