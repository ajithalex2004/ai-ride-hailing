import DynamicBookingForm from "@/components/booking/DynamicBookingForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-deep-space flex flex-col items-center justify-center p-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black bg-gradient-to-r from-neon-blue via-white to-pulse-orange bg-clip-text text-transparent mb-4 tracking-tighter">
          AI MOBILITY & EMERGENCY OS
        </h1>
        <p className="text-muted-grey font-medium tracking-widest uppercase text-sm">Powered by EXL Solutions • Mission Critical Platform</p>
      </header>

      <main className="w-full max-w-4xl animate-slideUp">
        <DynamicBookingForm />
      </main>

      <footer className="mt-16 opacity-30">
        <p className="text-xs text-white font-mono">SYSTEM_READY // DOMAIN_SEGREGATION_ACTIVE // PHASE_1_ALPHA</p>
      </footer>
    </div>
  );
}
