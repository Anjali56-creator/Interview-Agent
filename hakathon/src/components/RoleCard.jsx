import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Sparkles } from 'lucide-react';

export default function RoleCard({ role, onStart }) {
  const Icon = role.icon;

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group surface-card flex h-full flex-col border-slate-200/80 p-6 transition-shadow hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10 transition group-hover:bg-blue-600">
          <Icon className="h-6 w-6" />
        </div>
        <span className="chip border-slate-200 bg-slate-50 text-slate-600">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          {role.category === 'technical' ? 'Technical' : 'Non-Technical'}
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-lg font-semibold tracking-tight text-slate-950">{role.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{role.description}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {role.skills.map((skill) => (
          <span key={skill} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-1 items-end">
        <button type="button" onClick={() => onStart(role)} className="primary-button w-full justify-center group-hover:bg-slate-800">
          Start Interview
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.article>
  );
}
