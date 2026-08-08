import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function Hero({ onExploreRoles }) {
  const steps = [
    'Choose your role',
    'Pick difficulty',
    'Configure interview',
    'Practice with AI feedback',
  ];

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-10 text-white shadow-[0_24px_90px_rgba(15,23,42,0.28)] md:px-10 md:py-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.26),transparent_22%)]" />
      <div className="absolute -right-16 top-12 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-100 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            AI interview practice
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
            AI-Powered Interview Practice
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
            Practice realistic interviews tailored to your role, experience, and goals.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onExploreRoles} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Explore roles
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-slate-100 backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-blue-200" />
              Structured feedback for every session
            </div>
          </div>
        </div>

        <div className="surface-card relative border-white/10 bg-white/10 p-5 text-white shadow-none backdrop-blur-xl">
          <div className="text-sm font-semibold text-blue-100">Interview flow</div>
          <div className="mt-4 space-y-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-blue-400/20 text-sm font-semibold text-blue-100">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-white">{step}</div>
                  <div className="mt-1 text-sm text-slate-300">
                    {index === 0
                      ? 'Pick the role you want to practice.'
                      : index === 1
                        ? 'Set the challenge level.'
                        : index === 2
                          ? 'Choose duration and interview style.'
                          : 'Receive evaluation and a result summary.'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 text-sm text-slate-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            Designed for a production-quality career platform experience
          </div>
        </div>
      </div>
    </section>
  );
}
