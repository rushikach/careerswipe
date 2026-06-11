import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, type PanInfo } from "framer-motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Career Swipe — Find your path in 60 seconds" },
      { name: "description", content: "Swipe right or left through quick prompts and discover the career that fits your strengths and interests." },
      { property: "og:title", content: "Career Swipe" },
      { property: "og:description", content: "A playful, swipe-based career discovery tool for students." },
    ],
  }),
  component: CareerSwipe,
});

type Trait = "analytical" | "creative" | "social" | "practical" | "entrepreneurial" | "investigative";

type Question = {
  emoji: string;
  prompt: string;
  yes: Partial<Record<Trait, number>>;
  no: Partial<Record<Trait, number>>;
};

const QUESTIONS: Question[] = [
  { emoji: "🧩", prompt: "I love solving tricky logic puzzles for fun.", yes: { analytical: 2, investigative: 1 }, no: { creative: 1 } },
  { emoji: "🎨", prompt: "I'd rather design something than analyze data.", yes: { creative: 2 }, no: { analytical: 2 } },
  { emoji: "🗣️", prompt: "Presenting in front of a crowd energizes me.", yes: { social: 2, entrepreneurial: 1 }, no: { investigative: 1 } },
  { emoji: "🔬", prompt: "I get lost in 'why does this work?' rabbit holes.", yes: { investigative: 2, analytical: 1 }, no: { practical: 1 } },
  { emoji: "🛠️", prompt: "I like fixing real-world things with my hands.", yes: { practical: 2 }, no: { investigative: 1 } },
  { emoji: "💡", prompt: "I dream up business ideas in random moments.", yes: { entrepreneurial: 2, creative: 1 }, no: { practical: 1 } },
  { emoji: "🤝", prompt: "Helping a friend through a tough day feels meaningful.", yes: { social: 2 }, no: { analytical: 1 } },
  { emoji: "📊", prompt: "I'd happily stare at a spreadsheet to find a pattern.", yes: { analytical: 2 }, no: { creative: 1 } },
  { emoji: "🎬", prompt: "I tell stories that make people feel something.", yes: { creative: 2, social: 1 }, no: { analytical: 1 } },
  { emoji: "🚀", prompt: "Risk doesn't scare me if the upside is big.", yes: { entrepreneurial: 2 }, no: { practical: 1 } },
  { emoji: "🧪", prompt: "I want to discover something the world doesn't know yet.", yes: { investigative: 2 }, no: { social: 1 } },
  { emoji: "🏗️", prompt: "I'd rather build the thing than write about it.", yes: { practical: 2, creative: 1 }, no: { analytical: 1 } },
];

type CareerMatch = {
  title: string;
  tagline: string;
  emoji: string;
  why: string;
  paths: string[];
  primary: Trait;
};

const CAREERS: Record<Trait, CareerMatch> = {
  analytical: {
    title: "Data Strategist",
    tagline: "You turn noise into signal.",
    emoji: "📈",
    why: "You're wired to find patterns where others see chaos. Numbers are your second language and you trust evidence over hype.",
    paths: ["Data Science", "Financial Analysis", "Quantitative Research", "Business Intelligence"],
    primary: "analytical",
  },
  creative: {
    title: "Creative Director",
    tagline: "You make ideas feel alive.",
    emoji: "🎨",
    why: "You think in textures, colors, and stories. Your superpower is taking a vague feeling and shaping it into something people can't look away from.",
    paths: ["UX & Product Design", "Brand Strategy", "Film & Media", "Architecture"],
    primary: "creative",
  },
  social: {
    title: "People Catalyst",
    tagline: "You move humans, not just metrics.",
    emoji: "🤝",
    why: "You read a room in seconds and make everyone in it feel seen. Careers that revolve around people will fuel you, not drain you.",
    paths: ["Psychology & Counseling", "Marketing & Communications", "Teaching", "Human Resources"],
    primary: "social",
  },
  practical: {
    title: "Builder",
    tagline: "You'd rather ship than theorize.",
    emoji: "🛠️",
    why: "You learn by doing and you respect things that actually work. The world needs people who can take an idea from sketch to reality.",
    paths: ["Engineering", "Product Management", "Skilled Trades", "Operations"],
    primary: "practical",
  },
  entrepreneurial: {
    title: "Founder Type",
    tagline: "You see opportunity where others see walls.",
    emoji: "🚀",
    why: "You're allergic to 'this is just how it is.' You'd rather try, fail, and learn than wait for permission. Build something.",
    paths: ["Startups & Venture", "Product Management", "Sales & BD", "Consulting"],
    primary: "entrepreneurial",
  },
  investigative: {
    title: "Researcher",
    tagline: "Curiosity is your operating system.",
    emoji: "🔬",
    why: "You don't take answers at face value. You're at your best with a deep, hard, weird question and the time to chase it.",
    paths: ["Scientific Research", "Medicine", "Academia", "Investigative Journalism"],
    primary: "investigative",
  },
};

function calcResult(scores: Record<Trait, number>): CareerMatch {
  const top = (Object.entries(scores) as [Trait, number][]).sort((a, b) => b[1] - a[1])[0][0];
  return CAREERS[top];
}

function CareerSwipe() {
  const [stage, setStage] = useState<"intro" | "swipe" | "result">("intro");
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<Record<Trait, number>>({
    analytical: 0, creative: 0, social: 0, practical: 0, entrepreneurial: 0, investigative: 0,
  });

  const handleChoice = (dir: "yes" | "no") => {
    const q = QUESTIONS[index];
    const delta = dir === "yes" ? q.yes : q.no;
    setScores((s) => {
      const next = { ...s };
      for (const k of Object.keys(delta) as Trait[]) {
        next[k] = (next[k] ?? 0) + (delta[k] ?? 0);
      }
      return next;
    });
    if (index + 1 >= QUESTIONS.length) {
      setStage("result");
    } else {
      setIndex(index + 1);
    }
  };

  const reset = () => {
    setIndex(0);
    setScores({ analytical: 0, creative: 0, social: 0, practical: 0, entrepreneurial: 0, investigative: 0 });
    setStage("intro");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundBlobs />
      <main className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col px-5 py-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background">
              <span className="text-lg">↗</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">careerswipe</span>
          </div>
          {stage === "swipe" && (
            <span className="rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium backdrop-blur">
              {index + 1} / {QUESTIONS.length}
            </span>
          )}
        </header>

        <div className="flex flex-1 items-center justify-center py-10">
          <AnimatePresence mode="wait">
            {stage === "intro" && <Intro key="intro" onStart={() => setStage("swipe")} />}
            {stage === "swipe" && (
              <SwipeDeck
                key="swipe"
                index={index}
                onChoice={handleChoice}
              />
            )}
            {stage === "result" && <Result key="result" match={calcResult(scores)} onReset={reset} />}
          </AnimatePresence>
        </div>

        {stage === "swipe" && <Progress value={(index / QUESTIONS.length) * 100} />}

        <footer className="pt-6 text-center text-xs text-muted-foreground">
          Built for curious students · {QUESTIONS.length} quick prompts
        </footer>
      </main>
    </div>
  );
}

function BackgroundBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-50 blur-3xl" style={{ background: "var(--gradient-no)" }} />
      <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full opacity-40 blur-3xl" style={{ background: "var(--gradient-yes)" }} />
      <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-hero)" }} />
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium backdrop-blur">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yes" />
        60 second career check
      </div>
      <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
        Swipe your way to <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>the right career.</span>
      </h1>
      <p className="mx-auto mt-5 max-w-md text-balance text-base text-muted-foreground sm:text-lg">
        No long forms. No 40-page reports. Just a few honest gut reactions — and a recommendation that actually sounds like you.
      </p>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-semibold text-background shadow-[var(--shadow-glow)] transition"
      >
        Start swiping <span>→</span>
      </motion.button>
      <div className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <Hint icon="👈" label="Swipe left for no" />
        <Hint icon="👉" label="Swipe right for yes" />
      </div>
    </motion.div>
  );
}

function Hint({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <motion.div
        className="h-full rounded-full"
        style={{ background: "var(--gradient-hero)" }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}

function SwipeDeck({ index, onChoice }: { index: number; onChoice: (d: "yes" | "no") => void }) {
  // show current + next for stacked illusion
  const current = QUESTIONS[index];
  const next = QUESTIONS[index + 1];
  return (
    <div className="relative h-[460px] w-full max-w-sm">
      {next && (
        <Card key={`next-${index}`} question={next} stacked />
      )}
      <SwipeCard key={`cur-${index}`} question={current} onChoice={onChoice} />
      <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-6">
        <ActionButton variant="no" onClick={() => onChoice("no")} />
        <ActionButton variant="yes" onClick={() => onChoice("yes")} />
      </div>
    </div>
  );
}

function ActionButton({ variant, onClick }: { variant: "yes" | "no"; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      aria-label={variant}
      className="grid h-16 w-16 place-items-center rounded-full text-2xl font-bold text-white shadow-[var(--shadow-card)]"
      style={{ background: variant === "yes" ? "var(--gradient-yes)" : "var(--gradient-no)" }}
    >
      {variant === "yes" ? "✓" : "✕"}
    </motion.button>
  );
}

function Card({ question, stacked }: { question: Question; stacked?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between rounded-[2rem] border border-border p-7 shadow-[var(--shadow-card)]"
      style={{
        background: "var(--gradient-card)",
        transform: stacked ? "translateY(14px) scale(0.95)" : undefined,
        opacity: stacked ? 0.6 : 1,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Prompt</span>
        <span className="text-3xl">{question.emoji}</span>
      </div>
      <p className="text-2xl font-semibold leading-snug tracking-tight">{question.prompt}</p>
      <div className="text-xs text-muted-foreground">Trust your gut — first reaction wins.</div>
    </div>
  );
}

function SwipeCard({ question, onChoice }: { question: Question; onChoice: (d: "yes" | "no") => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const yesOpacity = useTransform(x, [20, 140], [0, 1]);
  const noOpacity = useTransform(x, [-140, -20], [1, 0]);

  const handleEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 120) onChoice("yes");
    else if (info.offset.x < -120) onChoice("no");
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate }}
      onDragEnd={handleEnd}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ x: 400, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
    >
      <div
        className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-border p-7 shadow-[var(--shadow-card)]"
        style={{ background: "var(--gradient-card)" }}
      >
        <motion.div
          style={{ opacity: yesOpacity }}
          className="absolute left-6 top-6 rounded-xl border-2 px-3 py-1 text-sm font-black uppercase tracking-wider"
          // eslint-disable-next-line react/forbid-dom-props
        >
          <span style={{ color: "var(--yes)", borderColor: "var(--yes)" }} className="rounded-xl border-2 px-3 py-1">Yes</span>
        </motion.div>
        <motion.div
          style={{ opacity: noOpacity }}
          className="absolute right-6 top-6 rounded-xl px-3 py-1 text-sm font-black uppercase tracking-wider"
        >
          <span style={{ color: "var(--no)", borderColor: "var(--no)" }} className="rounded-xl border-2 px-3 py-1">Nope</span>
        </motion.div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Prompt</span>
          <span className="text-4xl">{question.emoji}</span>
        </div>
        <p className="text-[1.7rem] font-semibold leading-tight tracking-tight">{question.prompt}</p>
        <div className="text-xs text-muted-foreground">Drag the card, tap a button, or use your gut.</div>
      </div>
    </motion.div>
  );
}

function Result({ match, onReset }: { match: CareerMatch; onReset: () => void }) {
  const shareText = useMemo(() => `I got ${match.title} on Career Swipe — ${match.tagline}`, [match]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 20 }}
      className="w-full"
    >
      <div
        className="overflow-hidden rounded-[2rem] border border-border p-8 shadow-[var(--shadow-card)]"
        style={{ background: "var(--gradient-card)" }}
      >
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your match</div>
        <div className="mt-4 flex items-center gap-4">
          <div
            className="grid h-16 w-16 place-items-center rounded-2xl text-3xl shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-hero)" }}
          >
            {match.emoji}
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{match.title}</h2>
            <p className="text-sm text-muted-foreground">{match.tagline}</p>
          </div>
        </div>

        <p className="mt-6 text-base leading-relaxed text-foreground/80">{match.why}</p>

        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Paths to explore</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {match.paths.map((p) => (
              <span
                key={p}
                className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm font-medium"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition hover:bg-muted"
        >
          Swipe again
        </button>
        <button
          onClick={() => navigator.clipboard?.writeText(shareText)}
          className="flex-1 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
        >
          Copy result
        </button>
      </div>
    </motion.div>
  );
}
