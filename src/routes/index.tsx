import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
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
    <div className="relative min-h-[100dvh] overflow-x-hidden">
      <BackgroundBlobs />
      <main className="relative z-10 mx-auto flex min-h-[100dvh] max-w-xl flex-col px-5 safe-top safe-bottom">
        <header className="ios-glass flex items-center justify-between rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div
              className="grid h-9 w-9 place-items-center rounded-[11px] text-base font-semibold text-white shadow-[var(--shadow-ios-button)]"
              style={{ background: "var(--gradient-button)" }}
            >
              ↗
            </div>
            <span className="text-[17px] font-semibold tracking-tight">careerswipe</span>
          </div>
          {stage === "swipe" && (
            <span className="ios-pill bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              {index + 1} / {QUESTIONS.length}
            </span>
          )}
        </header>

        <div
          className={`flex flex-1 items-center justify-center ${stage === "swipe" ? "py-6" : "py-10"}`}
        >
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

        {stage === "swipe" && (
          <div className="mt-auto space-y-4">
            <Progress value={(index / QUESTIONS.length) * 100} />
          </div>
        )}

        {stage !== "swipe" && (
          <footer className="pt-6 text-center text-xs text-muted-foreground">
            Built for curious students · {QUESTIONS.length} quick prompts
          </footer>
        )}
      </main>
    </div>
  );
}

function BackgroundBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-60 blur-3xl"
        style={{ background: "oklch(0.82 0.1 245 / 0.55)" }}
      />
      <div
        className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full opacity-50 blur-3xl"
        style={{ background: "oklch(0.82 0.12 350 / 0.5)" }}
      />
      <div
        className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "oklch(0.88 0.08 300 / 0.45)" }}
      />
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full text-center"
    >
      <div className="ios-glass ios-pill mb-6 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-muted-foreground">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        60 second career check
      </div>
      <h1 className="text-balance text-[2.35rem] font-bold leading-[1.08] tracking-tight sm:text-5xl">
        Swipe your way to{" "}
        <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
          the right career.
        </span>
      </h1>
      <p className="mx-auto mt-5 max-w-md text-balance text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        No long forms. No 40-page reports. Just a few honest gut reactions — and a recommendation that actually sounds like you.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="ios-pill mt-10 inline-flex items-center gap-2 px-8 py-3.5 text-[17px] font-semibold text-white shadow-[var(--shadow-ios-button)] transition"
        style={{ background: "var(--gradient-button)" }}
      >
        Start swiping <span aria-hidden>→</span>
      </motion.button>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground sm:gap-6">
        <Hint icon="👈" label="Swipe left for no" />
        <Hint icon="👉" label="Swipe right for yes" />
      </div>
    </motion.div>
  );
}

function Hint({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="ios-glass ios-pill flex items-center gap-1.5 px-3 py-1.5">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
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
  const current = QUESTIONS[index];
  const hasDeck = index < QUESTIONS.length - 1;
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-7">
      <div className="relative h-[min(420px,52dvh)] w-full min-h-[320px]">
        {hasDeck && <CardDeck />}
        <SwipeCard key={`cur-${index}`} question={current} onChoice={onChoice} />
      </div>
      <div className="flex items-center justify-center gap-12">
        <ActionButton variant="no" onClick={() => onChoice("no")} />
        <ActionButton variant="yes" onClick={() => onChoice("yes")} />
      </div>
    </div>
  );
}

function CardDeck() {
  return (
    <>
      <div
        className="ios-card-back absolute inset-0 z-0 rounded-[28px]"
        style={{ transform: "translateY(18px) scale(0.9)" }}
      />
      <div
        className="ios-card-back absolute inset-0 z-[1] rounded-[28px]"
        style={{ transform: "translateY(9px) scale(0.95)" }}
      />
    </>
  );
}

function ActionButton({ variant, onClick }: { variant: "yes" | "no"; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-label={variant === "yes" ? "Yes" : "No"}
      className="grid h-[60px] w-[60px] place-items-center rounded-full text-xl font-semibold text-white shadow-[var(--shadow-ios-button)] ring-4 ring-white/60"
      style={{ background: variant === "yes" ? "var(--gradient-yes)" : "var(--gradient-no)" }}
    >
      {variant === "yes" ? "✓" : "✕"}
    </motion.button>
  );
}

function EmojiBadge({ emoji }: { emoji: string }) {
  return (
    <div className="grid h-14 w-14 place-items-center rounded-[18px] bg-secondary text-4xl shadow-sm">
      {emoji}
    </div>
  );
}

function CardShell({ children }: { children: ReactNode }) {
  return (
    <div className="ios-card relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] p-6 sm:p-7">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: "var(--gradient-hero)" }}
      />
      {children}
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
      className="absolute inset-0 z-10 cursor-grab touch-none active:cursor-grabbing"
    >
      <CardShell>
        <motion.div style={{ opacity: yesOpacity }} className="absolute left-5 top-5 z-10">
          <SwipeStamp label="Yes" color="var(--yes)" />
        </motion.div>
        <motion.div style={{ opacity: noOpacity }} className="absolute right-5 top-5 z-10">
          <SwipeStamp label="Nope" color="var(--no)" />
        </motion.div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Prompt</span>
          <EmojiBadge emoji={question.emoji} />
        </div>
        <p className="text-[1.55rem] font-semibold leading-tight tracking-tight sm:text-[1.7rem]">{question.prompt}</p>
        <div className="text-xs text-muted-foreground">Drag the card, tap a button, or use your gut.</div>
      </CardShell>
    </motion.div>
  );
}

function SwipeStamp({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="rounded-xl border-[3px] bg-white px-3 py-1 text-sm font-bold uppercase tracking-wider shadow-sm"
      style={{ color, borderColor: color }}
    >
      {label}
    </span>
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
      <div className="ios-card overflow-hidden rounded-[28px] p-6 sm:p-8">
        <div
          className="pointer-events-none -mx-6 -mt-6 mb-4 h-1 sm:-mx-8 sm:-mt-8"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Your match</div>
        <div className="mt-4 flex items-center gap-4">
          <div
            className="grid h-16 w-16 shrink-0 place-items-center rounded-[18px] bg-secondary text-3xl shadow-sm"
          >
            {match.emoji}
          </div>
          <div className="min-w-0">
            <h2 className="text-[1.65rem] font-bold tracking-tight sm:text-3xl">{match.title}</h2>
            <p className="text-sm text-muted-foreground">{match.tagline}</p>
          </div>
        </div>

        <p className="mt-6 text-[15px] leading-relaxed text-foreground/85 sm:text-base">{match.why}</p>

        <div className="mt-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Paths to explore</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {match.paths.map((p) => (
              <span
                key={p}
                className="ios-pill bg-secondary px-3 py-1.5 text-sm font-medium text-foreground/90"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onReset}
          className="ios-pill ios-card flex-1 px-5 py-3 text-sm font-semibold transition hover:bg-secondary"
        >
          Swipe again
        </button>
        <button
          onClick={() => navigator.clipboard?.writeText(shareText)}
          className="ios-pill flex-1 px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-ios-button)]"
          style={{ background: "var(--gradient-button)" }}
        >
          Copy result
        </button>
      </div>
    </motion.div>
  );
}
