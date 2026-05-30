import { useState } from 'react';
import { usePlan } from '../contexts/PlanContext';
import { resolveActiveProgram, daysBetween, toISODate, getTotalWeeks } from '../utils/schedule';
import ProgramEditor from './ProgramEditor';
import ProgramGenerator from './ProgramGenerator';
import { blankProgram } from '../utils/programTemplate';

const TYPE_LABEL = { linear: 'Linear', repeating: 'Repeating' };

function fmtDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusOf(program, today, activeId) {
  if (program.id === activeId) return 'active';
  if (!program.start_date || !program.end_date) return 'draft';
  if (daysBetween(today, program.start_date) > 0) return 'scheduled';
  if (daysBetween(program.end_date, today) > 0) return 'ended';
  return 'scheduled';
}

const STATUS_LABEL = { active: 'Active now', scheduled: 'Scheduled', ended: 'Ended', draft: 'Not scheduled' };

function ProgramCard({ program, status, today, onSchedule, onUnschedule, onEdit, onDuplicate }) {
  const [startDate, setStartDate] = useState(program.start_date || toISODate(today));
  const phases = program.structure?.phases ?? [];
  const dayCount = phases[0]?.days?.length ?? 0;
  const weeks = getTotalWeeks(program);
  const scheduled = status !== 'draft';

  return (
    <div className={`program-card${status === 'active' ? ' is-active' : ''}`}>
      <div className="program-card-top">
        <div>
          <div className="program-card-name">{program.name}</div>
          <div className="program-card-tags">
            <span className="program-type">{TYPE_LABEL[program.type] ?? program.type}</span>
            <span className="program-spec">
              {program.type === 'repeating'
                ? `${dayCount}-day week`
                : `${phases.length} phase${phases.length > 1 ? 's' : ''} · ${weeks} wks`}
            </span>
          </div>
        </div>
        <span className={`program-status program-status--${status}`}>{STATUS_LABEL[status]}</span>
      </div>

      {scheduled && (
        <div className="program-range">{fmtDate(program.start_date)} → {fmtDate(program.end_date)}</div>
      )}

      <div className="program-actions">
        <label className="program-date">
          <span>Start</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <button className="btn btn--primary btn--sm" onClick={() => onSchedule(program.id, startDate)}>
          {scheduled ? 'Reschedule' : 'Schedule'}
        </button>
        {scheduled && <button className="btn btn--sm" onClick={() => onUnschedule(program.id)}>Unschedule</button>}
        <span className="program-actions-spacer" />
        <button className="btn btn--sm" onClick={() => onEdit(program.id)}>Edit</button>
        <button className="btn btn--sm" onClick={() => onDuplicate(program)}>Duplicate</button>
      </div>
    </div>
  );
}

export default function ProgramsSection() {
  const {
    programs, loading, today, scheduleProgram, resetPlan,
    createProgram, updateProgram, deleteProgram,
  } = usePlan();
  const [editing, setEditing] = useState(null); // { program, isNew } | null
  const [generating, setGenerating] = useState(false);

  const activeId = resolveActiveProgram(programs, today)?.id ?? null;
  const existingIds = programs.map((p) => p.id);

  if (loading) {
    return <div className="section"><div className="loading-inline">Loading programs…</div></div>;
  }

  if (generating) {
    return (
      <div className="section-content">
        <ProgramGenerator
          onCancel={() => setGenerating(false)}
          onGenerate={(program) => { setGenerating(false); setEditing({ program, isNew: true }); }}
        />
      </div>
    );
  }

  if (editing) {
    return (
      <div className="section-content">
        <ProgramEditor
          key={editing.program.id || 'new'}
          program={editing.program}
          isNew={editing.isNew}
          existingIds={existingIds.filter((id) => id !== editing.program.id)}
          onCancel={() => setEditing(null)}
          onDelete={async (id) => { await deleteProgram(id); setEditing(null); }}
          onSave={async (fields, isNew) => {
            const ok = isNew ? await createProgram(fields) : await updateProgram(fields.id, fields);
            if (ok) setEditing(null);
          }}
        />
      </div>
    );
  }

  function duplicate(program) {
    const copy = structuredClone(program);
    copy.id = ''; // assigned on save
    copy.name = `${program.name} (copy)`;
    copy.start_date = null;
    copy.end_date = null;
    setEditing({ program: copy, isNew: true });
  }

  return (
    <div className="section-content">
      <div className="hero">
        <div className="hero-eyebrow">Plan</div>
        <h1 className="hero-title">Your <em>programs</em></h1>
        <div className="hero-sub">
          Schedule a block and the app shows the right day automatically. Only one runs at a time.
        </div>
      </div>

      <div className="program-cta-row">
        <button className="btn btn--primary new-program" onClick={() => setGenerating(true)}>
          ✨ Generate a program
        </button>
        <button className="btn new-program" onClick={() => setEditing({ program: blankProgram(), isNew: true })}>
          + Start from scratch
        </button>
      </div>

      <div className="program-list">
        {programs.map((p) => (
          <ProgramCard
            key={p.id}
            program={p}
            status={statusOf(p, today, activeId)}
            today={today}
            onSchedule={scheduleProgram}
            onUnschedule={resetPlan}
            onEdit={(id) => setEditing({ program: programs.find((x) => x.id === id), isNew: false })}
            onDuplicate={duplicate}
          />
        ))}
      </div>
    </div>
  );
}
