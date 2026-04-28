import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f4c3a 0%, #1a6b52 50%, #0f4c3a 100%)" }}>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }} />

      {/* Decorative circles */}
      <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-10"
        style={{ background: "var(--color-accent)" }} />
      <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full opacity-10"
        style={{ background: "white" }} />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "var(--color-accent)" }}>
              ⚕
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Apothecary Ledger
            </h1>
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            Pharmacy Management System
          </p>
        </div>

        {/* Clerk sign-in component */}
        <SignIn
          appearance={{
            elements: {
              rootBox: "shadow-2xl rounded-2xl overflow-hidden",
              card: "shadow-none",
            }
          }}
        />
      </div>
    </div>
  );
}
