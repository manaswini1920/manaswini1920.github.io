"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { motion, useInView } from "framer-motion";
import {
  ChevronRight, ExternalLink, Github, Linkedin, Mail, MapPin,
  Shield, Database, Cpu, Filter, Sun, Moon, BookOpen, GitPullRequest,
} from "lucide-react";

/* ── 3D Tilt Card ── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.02,1.02,1.02)`;
  };
  const handleLeave = () => { if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0) rotateX(0) scale3d(1,1,1)"; };
  return <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={`transition-transform duration-200 ease-out ${className}`}>{children}</div>;
}

/* ── Animated Counter ── */
function Counter({ target, label }: { target: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let n = 0; const step = Math.ceil(target / 90);
    const t = setInterval(() => { n += step; if (n >= target) { setCount(target); clearInterval(t); } else setCount(n); }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return <div ref={ref} className="text-center"><p className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">{count}+</p><p className="mt-1 text-xs text-slate-400">{label}</p></div>;
}

/* ── GitHub PR type ── */
interface PR { title: string; html_url: string; repository_url: string; created_at: string; state: string; pull_request?: { merged_at: string | null } }

/* ── Data ── */
const skills = [
  "Java","Python","C++","C","SQL","JavaScript","AWS Lambda","Step Functions","S3","DynamoDB","ECS","SQS","SNS","EventBridge","IAM","CloudFormation","CDK","Aurora MySQL","OpenSearch","Microservices","Event-Driven Systems","Reliability Engineering","Fault Tolerance","Workflow Orchestration","Multi-Tenant Platforms",
];

const projects = [
  {
    id: "aurora", title: "Aurora Serverless v2", cat: "Database Engine", icon: Database,
    gradient: "from-violet-600 to-fuchsia-500",
    summary: "Scale-to-zero, zero-downtime patching, cryptography migration, and fleet stability across 100+ production clusters.",
    metrics: ["<15s wake-up", "100+ clusters", "TLS 1.3"],
    details: [
      "Implemented scale-to-zero capability enabling idle clusters to pause and resume with wake-up latency under 15 seconds.",
      "Enhanced Zero-Downtime Patching to preserve active client sessions and TLS connections during engine restarts.",
      "Led migration of cryptographic stack from MySQL 5.7 to 8.0, enabling TLS 1.3 and stronger connection security.",
      "Built memory-protection safeguards across 100+ production clusters, improving fleet stability.",
    ],
  },
  {
    id: "sa", title: "OpenSearch Security Analytics", cat: "Multi-Tenant Platform", icon: Shield,
    gradient: "from-cyan-500 to-blue-500",
    summary: "Distributed backend services for a multi-tenant security analytics platform with large-scale telemetry ingestion.",
    metrics: ["15+ APIs", "Multi-tenant", "Cross-account"],
    details: [
      "Built core backend components enabling ingestion and analysis of large-scale security telemetry for threat detection.",
      "Designed provisioning workflows using Step Functions to orchestrate queues, pipelines, and IAM roles.",
      "Developed customer-facing REST APIs for analytics lifecycle and detection pipelines using PPL, SQL, and SIGMA.",
      "Implemented secure cross-account architecture with STS AssumeRole, external IDs, and IAM trust policies.",
    ],
  },
  {
    id: "ops", title: "Production Reliability", cat: "Operations", icon: Cpu,
    gradient: "from-emerald-500 to-teal-400",
    summary: "Cross-team incident response, root cause analysis, and fleet-wide mitigations for critical production systems.",
    metrics: ["Cross-team RCA", "Fleet mitigations", "Operational leadership"],
    details: [
      "Led incident response and RCA for production failures including resource leaks and replication issues, coordinating across engine, infrastructure, and reliability teams.",
      "Drove fleet-wide mitigations for critical customer escalations across 100+ production clusters.",
      "Established operational runbooks and trained engineers on production tooling and debugging procedures.",
    ],
  },
];

const termLines = [
  { cmd: "whoami", out: "manaswini · software engineer · aws" },
  { cmd: "cat focus.txt", out: "database engines · distributed systems · security analytics" },
  { cmd: "ls projects/", out: "aurora-serverless/  opensearch-security-analytics/" },
  { cmd: "echo $YEARS", out: "4+ years building at scale" },
];

export default function Page() {
  const [sel, setSel] = useState(projects[0]);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("overview");
  const [dark, setDark] = useState(true);
  const [prs, setPrs] = useState<PR[]>([]);
  const [loading, setLoading] = useState(true);

  const filtered = useMemo(() => q.trim() ? skills.filter((s) => s.toLowerCase().includes(q.toLowerCase())) : skills, [q]);

  useEffect(() => {
    fetch("https://api.github.com/search/issues?q=author:manaswini1920+type:pr+org:opensearch-project&per_page=100")
      .then((r) => r.json()).then((d) => { setPrs(d.items || []); }).catch(() => setPrs([])).finally(() => setLoading(false));
  }, []);

  // Theme tokens
  const t = {
    bg: dark ? "bg-[#060a14]" : "bg-[#f8f8f6]",
    glass: dark ? "border-white/[0.06] bg-white/[0.03] backdrop-blur-xl" : "border-slate-200/80 bg-white/70 backdrop-blur-xl",
    glass2: dark ? "border-white/[0.04] bg-white/[0.02] backdrop-blur-lg" : "border-slate-200/60 bg-white/50 backdrop-blur-lg",
    h: dark ? "text-white" : "text-slate-900",
    p: dark ? "text-slate-300" : "text-slate-600",
    m: dark ? "text-slate-500" : "text-slate-400",
    b: dark ? "border-white/[0.08]" : "border-slate-200",
    pill: dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-100",
  };

  return (
    <main className={`min-h-screen ${t.bg} transition-colors duration-500`}>
      {/* Mesh gradient bg */}
      {dark && <div className="pointer-events-none fixed inset-0 -z-10 opacity-60" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(217,170,75,0.12), transparent), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(99,102,241,0.08), transparent), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(6,182,212,0.06), transparent)" }} />}

      {/* Theme toggle */}
      <div className="fixed right-5 top-5 z-50">
        <button onClick={() => setDark(!dark)} className={`rounded-full p-3 ${t.glass} transition hover:scale-110`}>
          {dark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
        </button>
      </div>

      {/* ── HERO ── */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-8 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <TiltCard>
            <div className={`rounded-3xl border ${t.glass} p-8 shadow-2xl shadow-black/20`}>
              <div className="flex flex-wrap gap-2 text-xs">
                {["Software Engineer", "Distributed Systems", "AWS"].map((x) => (
                  <span key={x} className={`rounded-full border ${t.pill} px-3 py-1 ${t.p}`}>{x}</span>
                ))}
              </div>
              <h1 className={`mt-6 text-4xl font-bold tracking-tight md:text-6xl ${t.h}`}>
                <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent">Manaswini</span> Ragamouni
              </h1>
              <p className={`mt-5 max-w-2xl text-lg leading-8 ${t.p}`}>
                I build distributed systems across <span className={`font-semibold ${t.h}`}>database engines</span> and <span className={`font-semibold ${t.h}`}>security analytics platforms</span> with a focus on reliability, scalability, and operational excellence.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="mailto:manaswini1920@gmail.com" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20"><Mail className="h-4 w-4" />Contact</a>
                {[
                  { href: "https://github.com/manaswini1920", icon: Github, label: "GitHub" },
                  { href: "https://www.linkedin.com/in/manaswini-ragamouni", icon: Linkedin, label: "LinkedIn" },
                  { href: "https://medium.com/@manaswini1920", icon: BookOpen, label: "Medium" },
                ].map(({ href, icon: I, label: l }) => (
                  <a key={l} href={href} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-2xl border ${t.b} px-5 py-3 text-sm font-medium ${t.h} transition hover:-translate-y-0.5`}><I className="h-4 w-4" />{l}</a>
                ))}
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className={`h-full rounded-3xl border ${t.glass} p-8`}>
              <p className={`text-xs uppercase tracking-[0.3em] ${t.m}`}>Snapshot</p>
              <div className={`mt-6 space-y-5 text-sm ${t.p}`}>
                <div className="flex items-start gap-3"><MapPin className={`mt-0.5 h-4 w-4 ${t.m}`} /><div><p className={t.m}>Location</p><p>Santa Clara, CA</p></div></div>
                <div className="flex items-start gap-3"><Database className={`mt-0.5 h-4 w-4 ${t.m}`} /><div><p className={t.m}>Current</p><p>Software Development Engineer, AWS</p></div></div>
                <div>
                  <p className={t.m}>Focus Areas</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Aurora Serverless","OpenSearch","Reliability","Multi-Tenant Systems","Data Ingestion"].map((x) => (
                      <span key={x} className={`rounded-full border ${t.pill} px-3 py-1 text-xs`}>{x}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ── METRICS ── */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-7xl px-6 pb-8 md:px-10">
        <div className={`rounded-3xl border ${t.glass} p-6`}>
          <div className="grid grid-cols-3 gap-6">
            <Counter target={100} label="Production Clusters Served" />
            <Counter target={15} label="Customer APIs Designed" />
            <Counter target={4} label="Years at AWS" />
          </div>
        </div>
      </motion.section>

      {/* ── TABS ── */}
      <section className="mx-auto max-w-7xl px-6 pb-4 md:px-10">
        <div className={`inline-flex rounded-2xl border ${t.glass} p-1`}>
          {["overview","experience","skills","open-source","terminal"].map((x) => (
            <button key={x} onClick={() => setTab(x)} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === x ? "bg-gradient-to-r from-amber-400 to-orange-400 text-black shadow-lg shadow-amber-500/20" : `${t.p} hover:text-white`}`}>
              {x === "open-source" ? "Open Source" : x[0].toUpperCase() + x.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {projects.map((p, i) => {
              const Icon = p.icon;
              return (
                <TiltCard key={p.id}>
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    onClick={() => setSel(p)}
                    className={`cursor-pointer rounded-3xl border ${sel.id === p.id ? "border-amber-400/30" : t.b} ${t.glass} p-6 transition`}>
                    <div className={`inline-flex rounded-2xl bg-gradient-to-br ${p.gradient} p-3 shadow-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className={`mt-4 text-lg font-bold ${t.h}`}>{p.title}</h3>
                    <p className={`mt-1 text-xs ${t.m}`}>{p.cat}</p>
                    <p className={`mt-3 text-sm leading-6 ${t.p}`}>{p.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.metrics.map((m) => (<span key={m} className={`rounded-full border ${t.pill} px-2.5 py-0.5 text-[11px] ${t.m}`}>{m}</span>))}
                    </div>
                  </motion.div>
                </TiltCard>
              );
            })}
          </div>

          <motion.div key={sel.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 rounded-3xl border ${t.glass} p-6`}>
            <h3 className={`text-2xl font-bold ${t.h}`}>{sel.title}</h3>
            <p className={`mt-2 ${t.p}`}>{sel.summary}</p>
            <div className="mt-5 grid gap-3">
              {sel.details.map((d, i) => (
                <motion.div key={d} initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className={`flex gap-3 rounded-2xl border ${t.glass2} px-4 py-4`}>
                  <ChevronRight className={`mt-1 h-4 w-4 shrink-0 ${t.m}`} />
                  <p className={`leading-7 ${t.p}`}>{d}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>
      )}

      {/* ── EXPERIENCE ── */}
      {tab === "experience" && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className={`rounded-3xl border ${t.glass} p-8`}>
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className={`text-xs uppercase tracking-[0.3em] ${t.m}`}>Professional Experience</p>
                <h2 className={`mt-2 text-3xl font-bold ${t.h}`}>Amazon Web Services</h2>
                <p className={`mt-2 max-w-3xl leading-7 ${t.p}`}>Developed distributed backend infrastructure for the Aurora Serverless database engine and OpenSearch Security Analytics platform.</p>
              </div>
              <p className={`text-sm ${t.m}`}>Bay Area, CA</p>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {projects.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.article key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className={`rounded-3xl border ${t.glass2} p-6`}>
                    <div className={`inline-flex rounded-2xl bg-gradient-to-br ${p.gradient} p-3 shadow-lg`}><Icon className="h-5 w-5 text-white" /></div>
                    <h3 className={`mt-4 text-xl font-bold ${t.h}`}>{p.title}</h3>
                    <p className={`mt-1 text-sm ${t.m}`}>{p.cat}</p>
                    <div className="mt-5 space-y-3">
                      {p.details.map((d) => (<div key={d} className={`rounded-2xl border ${t.b} px-4 py-3 text-sm leading-7 ${t.p}`}>{d}</div>))}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.section>
      )}

      {/* ── SKILLS ── */}
      {tab === "skills" && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
            <div className={`rounded-3xl border ${t.glass} p-6`}>
              <p className={`text-xs uppercase tracking-[0.3em] ${t.m}`}>Skills Explorer</p>
              <h2 className={`mt-2 text-2xl font-bold ${t.h}`}>Search my toolkit</h2>
              <div className={`mt-5 flex items-center gap-3 rounded-2xl border ${t.glass2} px-4 py-3`}>
                <Filter className={`h-4 w-4 ${t.m}`} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Java, Step Functions, OpenSearch..." className={`w-full bg-transparent text-sm outline-none ${t.h} placeholder:${t.m}`} />
              </div>
            </div>
            <div className={`rounded-3xl border ${t.glass} p-6`}>
              <div className="flex items-center justify-between"><h3 className={`text-lg font-bold ${t.h}`}>Results</h3><p className={`text-sm ${t.m}`}>{filtered.length}</p></div>
              <div className="mt-5 flex flex-wrap gap-2">
                {filtered.map((s) => (
                  <motion.span key={s} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-full border ${t.pill} px-4 py-2 text-sm ${t.p}`}>{s}</motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── OPEN SOURCE ── */}
      {tab === "open-source" && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className={`rounded-3xl border ${t.glass} p-8`}>
            <div className="flex items-center gap-3">
              <GitPullRequest className={`h-6 w-6 ${t.h}`} />
              <div>
                <p className={`text-xs uppercase tracking-[0.3em] ${t.m}`}>Open Source</p>
                <h2 className={`mt-1 text-2xl font-bold ${t.h}`}>OpenSearch Project</h2>
              </div>
            </div>
            <p className={`mt-4 max-w-3xl leading-7 ${t.p}`}>Pull requests fetched live from GitHub across alerting, security-analytics, common-utils, and alerting-dashboards-plugin.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["security-analytics","alerting","common-utils","alerting-dashboards-plugin"].map((r) => (
                <a key={r} href={`https://github.com/opensearch-project/${r}`} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 rounded-full border ${t.pill} px-3 py-1 text-xs font-mono ${t.p} transition hover:border-amber-400/30`}>
                  <Github className="h-3 w-3" />{r}
                </a>
              ))}
            </div>
            <div className="mt-8 space-y-3">
              {loading ? (
                <div className="flex items-center gap-3 py-8"><div className={`h-4 w-4 animate-spin rounded-full border-2 ${t.b} border-t-amber-400`} /><p className={t.m}>Fetching PRs...</p></div>
              ) : prs.length === 0 ? (
                <p className={t.m}>No public PRs found.</p>
              ) : prs.map((pr) => {
                const repo = pr.repository_url?.split("/").pop() || "";
                const merged = pr.pull_request?.merged_at;
                const st = merged ? "merged" : pr.state === "closed" ? "closed" : "open";
                const sc = st === "merged" ? "text-purple-400 border-purple-500/30" : st === "open" ? "text-green-400 border-green-500/30" : "text-red-400 border-red-500/30";
                return (
                  <motion.a key={pr.html_url} href={pr.html_url} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className={`flex items-start gap-4 rounded-2xl border ${t.glass2} p-4 transition hover:border-amber-400/20`}>
                    <GitPullRequest className={`mt-1 h-4 w-4 shrink-0 ${sc.split(" ")[0]}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium leading-6 ${t.h}`}>{pr.title}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border ${sc} px-2 py-0.5 text-xs`}>{st}</span>
                        <span className={`font-mono text-xs ${t.m}`}>{repo}</span>
                        <span className={`text-xs ${t.m}`}>{new Date(pr.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    </div>
                    <ExternalLink className={`mt-1 h-4 w-4 shrink-0 ${t.m}`} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.section>
      )}

      {/* ── TERMINAL ── */}
      {tab === "terminal" && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className="overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0c1120] shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/80" /><div className="h-3 w-3 rounded-full bg-yellow-500/80" /><div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-3 font-mono text-xs text-slate-500">manaswini@portfolio ~ %</span>
            </div>
            <div className="p-6 font-mono text-sm leading-8">
              {termLines.map((l, i) => (
                <motion.div key={l.cmd} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                  <p className="text-amber-400">$ {l.cmd}</p><p className="text-slate-300">{l.out}</p>{i < termLines.length - 1 && <div className="my-2" />}
                </motion.div>
              ))}
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: termLines.length * 0.15 }} className="mt-4 text-amber-400">$ <span className="animate-pulse">▊</span></motion.p>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── FOOTER ── */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className={`rounded-3xl border ${t.glass} p-8`}>
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className={`text-2xl font-bold ${t.h}`}>Let&apos;s build something meaningful</h2>
              <p className={`mt-3 max-w-2xl leading-7 ${t.p}`}>I contribute to OpenSearch open source and enjoy working on distributed infrastructure, database systems, and secure multi-tenant platforms.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="https://github.com/manaswini1920" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-3 text-sm font-semibold text-black"><ExternalLink className="h-4 w-4" />GitHub</a>
              <a href="mailto:manaswini1920@gmail.com" className={`inline-flex items-center gap-2 rounded-2xl border ${t.b} px-5 py-3 text-sm font-medium ${t.h}`}><Mail className="h-4 w-4" />Email</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
