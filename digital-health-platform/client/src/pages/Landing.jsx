// client/src/pages/Landing.jsx
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      {/* NAVBAR */}
      <nav className="w-full py-4 px-6 flex justify-between items-center bg-white/70 backdrop-blur-md shadow-sm">
        <h1 className="text-2xl font-bold text-blue-700">Digital Health Platform</h1>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => (window.location.href = "/login")}>
            Login
          </Button>
          <Button onClick={() => (window.location.href = "/register")}>
            Sign Up
          </Button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative flex-1 flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-blue-900">
            Healthcare Made Simple, Fast & Accessible
          </h2>

          <p className="text-lg md:text-xl max-w-2xl text-gray-700 mb-8">
            Book appointments, connect with providers, manage records, and receive care — 
            all in one unified digital health platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => (window.location.href = "/register")}
            >
              Get Started
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => (window.location.href = "/login")}
            >
              Login to Your Account
            </Button>
          </div>
        </div>

        {/* WAVES (SVG) */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 pointer-events-none">
          <div className="wave-wrapper">
            {/* slower, larger, subtle */}
            <svg className="wave wave-slow" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,30 C150,80 350,0 600,30 C850,60 1050,20 1200,40 L1200,120 L0,120 Z" fill="rgba(99,102,241,0.10)"/>
            </svg>

            {/* faster, smaller, brighter */}
            <svg className="wave wave-fast" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,50 C200,10 400,90 600,50 C800,10 1000,90 1200,50 L1200,120 L0,120 Z" fill="rgba(59,130,246,0.12)"/>
            </svg>
          </div>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <section className="py-16 px-6 bg-white">
        <h3 className="text-3xl font-bold text-center mb-10 text-blue-800">
          Why Choose Our Platform?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-white border rounded-xl shadow hover:shadow-md transition">
            <div className="text-4xl mb-3">🩺</div>
            <h4 className="text-xl font-semibold mb-2">For Patients</h4>
            <p className="text-gray-600">
              Instantly book appointments, receive real-time updates, and manage your care 
              effortlessly from your phone or computer.
            </p>
          </div>

          <div className="p-6 bg-white border rounded-xl shadow hover:shadow-md transition">
            <div className="text-4xl mb-3">👨‍⚕️</div>
            <h4 className="text-xl font-semibold mb-2">For Providers</h4>
            <p className="text-gray-600">
              Accept appointments, view schedules, and receive live notifications of patient 
              requests — all in real time.
            </p>
          </div>

          <div className="p-6 bg-white border rounded-xl shadow hover:shadow-md transition">
            <div className="text-4xl mb-3">📊</div>
            <h4 className="text-xl font-semibold mb-2">For Admin</h4>
            <p className="text-gray-600">
              Monitor analytics, manage system-wide data, and keep operations running smoothly 
              with powerful management tools.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Start Your Healthcare Journey Today</h3>
        <p className="text-lg mb-8 opacity-90">
          Sign up now and experience seamless, modern digital healthcare.
        </p>

        <Button
          size="lg"
          className="bg-white text-blue-700 font-semibold hover:bg-gray-100"
          onClick={() => (window.location.href = "/register")}
        >
          Create Your Account
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-gray-600 text-sm bg-white">
        © {new Date().getFullYear()} Digital Health Platform — All Rights Reserved.
      </footer>
    </div>
  );
}
