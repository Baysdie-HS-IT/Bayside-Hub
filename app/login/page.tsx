import Link from "next/link";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen shell-container py-16">
      <div className="max-w-md mx-auto">
        <section className="section-surface">
          <h1 className="text-2xl font-bold text-bay-navy">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in to access the Bayside Hub.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Or go back <Link href="/">home</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
