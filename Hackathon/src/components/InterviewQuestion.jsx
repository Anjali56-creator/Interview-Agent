import { ArrowLeft, ArrowRight, TimerReset, Volume2, VolumeX, Square, LoaderCircle } from 'lucide-react';
import ProgressBar from './ProgressBar.jsx';

export default function InterviewQuestion({
  role,
  difficulty,
  currentIndex,
  totalQuestions,
  question,
  timerLabel,
  progressValue,
  onPrevious,
  onNext,
  canGoNext,
  canGoPrevious,
  onListenQuestion,
  onStopQuestion,
  isQuestionSpeaking,
  isVoiceSupported,
}) {
  return (
    <section className="surface-card p-6 md:p-8">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="section-label">Question {currentIndex + 1} of {totalQuestions}</div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{question}</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="chip">{role}</span>
          <span className="chip">{difficulty}</span>
          <span className="chip">
            <TimerReset className="h-3.5 w-3.5 text-blue-500" />
            {timerLabel}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">AI Interviewer</div>
          <p className="mt-1 text-sm text-slate-600">Use the speaker button to listen to the current question aloud.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={isQuestionSpeaking ? onStopQuestion : onListenQuestion}
            disabled={!isVoiceSupported}
            aria-label="Listen to interview question"
            className={`secondary-button px-4 py-2.5 ${isQuestionSpeaking ? 'border-blue-300 bg-blue-50 text-blue-700' : ''}`}
          >
            {isQuestionSpeaking ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isQuestionSpeaking ? 'Stop' : 'Listen'}
          </button>
          {isQuestionSpeaking && <LoaderCircle className="h-5 w-5 animate-spin text-blue-600" />}
          {!isVoiceSupported && <span className="text-sm text-slate-500">Audio unavailable</span>}
        </div>
      </div>

      <div className="mt-6">
        <ProgressBar value={progressValue} label="Interview progress" />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <button type="button" onClick={onPrevious} disabled={!canGoPrevious} className="inline-flex items-center gap-2 font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40">
          <ArrowLeft className="h-4 w-4" />
          Previous question
        </button>
        <button type="button" onClick={onNext} disabled={!canGoNext} className="inline-flex items-center gap-2 font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40">
          Next question
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
