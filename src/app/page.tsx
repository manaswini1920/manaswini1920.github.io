"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ExternalLink, Github, Linkedin, Mail, BookOpen,
  Shield, Database, Cpu, GitPullRequest, Layers, Zap, Lock, Search,
  ArrowRight,
} from "lucide-react";

/* ── 3D Tilt ── */
function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -10;
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.01,1.01,1.01)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = "none"; };
  return <div ref={ref} onMouseMove={move} onMouseLeave={leave} className={`transition-transform duration-200 ${className}`}>{children}</div>;
}

/* ── Counter ── */
function Num({ n, label }: { n: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const vis = useInView(ref, { once: true });
  const [c, setC] = useState(0);
  useEffect(() => {
    if (!vis) return;
    let v = 0; const s = Math.ceil(n / 60);
    const t = setInterval(() => { v += s; if (v >= n) { setC(n); clearInterval(t); } else setC(v); }, 16);
    return () => clearInterval(t);
  }, [vis, n]);
  return <div ref={ref}><p className="text-4xl font-black text-slate-900">{c}<span className="text-orange-500">+</span></p><p className="mt-1 text-sm text-slate-500">{label}</p></div>;
}

/* ── Types ── */
interface PR { title: string; html_url: string; repository_url: string; created_at: string; state: string; pull_request?: { merged_at: string | null } }

/* ── Architecture nodes with descriptions ── */
const archNodes = [
  { id: "client", label: "Client Request", x: 50, y: 8, icon: Zap, color: "bg-orange-500", desc: "Incoming API calls from customer applications — authenticated via IAM and routed to the appropriate service endpoint." },
  { id: "api", label: "REST APIs (15+)", x: 50, y: 25, icon: Layers, color: "bg-blue-500", desc: "Customer-facing APIs for use-case lifecycle, findings search, detection rules (SIGMA/SQL/PPL), and data registry management." },
  { id: "workflow", label: "Step Functions", x: 20, y: 45, icon: Cpu, color: "bg-violet-500", desc: "Provisioning and de-provisioning workflows that orchestrate parallel creation of collections, pipelines, queues, and IAM roles." },
  { id: "security", label: "IAM / STS", x: 80, y: 45, icon: Lock, color: "bg-emerald-500", desc: "Cross-account access via STS AssumeRole with external IDs and trust policy validation to isolate multi-tenant environments." },
  { id: "data", label: "OpenSearch / DynamoDB", x: 50, y: 65, icon: Database, color: "bg-cyan-500", desc: "Distributed data layer for security telemetry indexing, metadata storage, and cross-account state synchronization." },
  { id: "detect", label: "Detection Engine", x: 50, y: 85, icon: Shield, color: "bg-rose-500", desc: "Rule evaluation engine processing SIGMA, SQL, and PPL detection rules against ingested security events in near real-time." },
];

const archEdges = [
  { x1: 50, y1: 14, x2: 50, y2: 21 },
  { x1: 50, y1: 31, x2: 20, y2: 41 },
  { x1: 50, y1: 31, x2: 80, y2: 41 },
  { x1: 20, y1: 51, x2: 50, y2: 61 },
  { x1: 80, y1: 51, x2: 50, y2: 61 },
  { x1: 50, y1: 71, x2: 50, y2: 81 },
];

/* ── Engineering principles ── */
const principles = [
  { title: "Design for Failure", body: "Every system I build assumes components will fail. Retry logic, dead-letter queues, graceful degradation — reliability is a feature, not an afterthought.", icon: Shield },
  { title: "Measure Before Optimizing", body: "I benchmark before I refactor. From cryptographic library performance to patching duration analysis, data drives every architecture decision.", icon: Search },
  { title: "Secure by Default", body: "Cross-account isolation, trust policy validation, and least-privilege access aren't bolted on — they're baked into the initial design.", icon: Lock },
  { title: "Automate the Toil", body: "From test pipeline configs to provisioning workflows, I eliminate manual steps. Engineers should solve problems, not run checklists.", icon: Zap },
];

/* ── Projects ── */
const projects = [
  {
    id: "aurora", title: "Aurora Serverless v2", cat: "Database Engine", icon: Database, gradient: "from-violet-600 to-fuchsia-500",
    summary: "Scale-to-zero, zero-downtime patching, cryptography migration, and fleet stability across 100+ production clusters.",
    details: [
      "Implemented scale-to-zero enabling idle clusters to pause/resume with <15s wake-up latency.",
      "Enhanced Zero-Downtime Patching to preserve active sessions and TLS connections during restarts.",
      "Led cryptographic stack migration from MySQL 5.7 → 8.0, enabling TLS 1.3.",
      "Built memory-protection safeguards preventing non-graceful restarts fleet-wide.",
    ],
  },
  {
    id: "sa", title: "OpenSearch Security Analytics", cat: "Multi-Tenant Platform", icon: Shield, gradient: "from-cyan-500 to-blue-500",
    summary: "Distributed backend for a multi-tenant security analytics platform with large-scale telemetry ingestion.",
    details: [
      "Built core backend enabling ingestion and analysis of large-scale security telemetry.",
      "Designed Step Functions workflows to orchestrate provisioning of queues, pipelines, and IAM roles.",
      "Developed 15+ customer-facing REST APIs for analytics lifecycle and detection pipelines.",
      "Implemented cross-account security with STS AssumeRole, external IDs, and trust policies.",
    ],
  },
  {
    id: "ops", title: "Production Reliability", cat: "Operations", icon: Cpu, gradient: "from-emerald-500 to-teal-400",
    summary: "Cross-team incident response, root cause analysis, and fleet-wide mitigations.",
    details: [
      "Led RCA for production failures including resource leaks and replication issues across engine, infra, and reliability teams.",
      "Drove fleet-wide mitigations for critical escalations across 100+ production clusters.",
      "Established operational runbooks and trained engineers on production debugging.",
    ],
  },
];

/* ── GitHub Repo type ── */
interface Repo { name: string; description: string | null; html_url: string; language: string | null; stargazers_count: number; fork: boolean }

const skills = ["Java","Python","C++","C","SQL","JavaScript","AWS Lambda","Step Functions","S3","DynamoDB","ECS","SQS","SNS","EventBridge","IAM","CloudFormation","CDK","Aurora MySQL","OpenSearch","Microservices","Event-Driven Systems","Reliability Engineering","Fault Tolerance","Workflow Orchestration","Multi-Tenant Platforms"];

export default function Page() {
  const [sel, setSel] = useState(projects[0]);
  const [q, setQ] = useState("");
  const [prs, setPrs] = useState<PR[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const filtered = useMemo(() => q.trim() ? skills.filter((s) => s.toLowerCase().includes(q.toLowerCase())) : skills, [q]);

  useEffect(() => {
    fetch("https://api.github.com/search/issues?q=author:manaswini1920+type:pr+org:opensearch-project&per_page=100")
      .then((r) => r.json()).then((d) => setPrs(d.items || [])).catch(() => setPrs([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const show = new Set(["Leetcode", "Database_Systems_project", "ResourceFull", "boston-house-prices-prediction", "network-based-app-dev"]);
    fetch("https://api.github.com/users/manaswini1920/repos?sort=updated&per_page=30")
      .then((r) => r.json())
      .then((d: Repo[]) => setRepos(d.filter((r) => show.has(r.name))))
      .catch(() => setRepos([]));
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-slate-900">
      {/* Subtle warm gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(251,191,36,0.06), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(168,85,247,0.04), transparent)" }} />

      {/* ── HERO ── */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-wrap gap-2 text-xs">
            {["Software Engineer","Distributed Systems","AWS"].map((x) => (
              <span key={x} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-500">{x}</span>
            ))}
          </div>
          <h1 className="mt-8 text-5xl font-black tracking-tight md:text-7xl">
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">Manaswini</span><br />Ragamouni
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-slate-600">
            I build distributed systems at <span className="font-semibold text-slate-900">Amazon Web Services</span> — from database engine internals to multi-tenant security platforms. I care about systems that are reliable, secure, and elegant under the hood.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="mailto:manaswini1920@gmail.com" className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/20"><Mail className="h-4 w-4" />Get in Touch</a>
            {[
              { href: "https://github.com/manaswini1920", icon: Github, l: "GitHub" },
              { href: "https://www.linkedin.com/in/manaswini-ragamouni", icon: Linkedin, l: "LinkedIn" },
              { href: "https://medium.com/@manaswini1920", icon: BookOpen, l: "Medium" },
            ].map(({ href, icon: I, l }) => (
              <a key={l} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"><I className="h-4 w-4" />{l}</a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── METRICS ── */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-3 gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <Num n={100} label="Production Clusters Served" />
          <Num n={15} label="Customer APIs Designed" />
          <Num n={4} label="Years Building at AWS" />
        </div>
      </section>

      {/* ── HOW I THINK ── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Engineering Philosophy</p>
          <h2 className="mt-3 text-3xl font-black">How I Think About Systems</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {principles.map((p, i) => {
              const Icon = p.icon;
              return (
                <Tilt key={p.title}>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                    <div className="inline-flex rounded-2xl bg-slate-100 p-3"><Icon className="h-5 w-5 text-slate-700" /></div>
                    <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
                    <p className="mt-2 leading-7 text-slate-600">{p.body}</p>
                  </motion.div>
                </Tilt>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ── ARCHITECTURE EXPLORER ── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Interactive</p>
          <h2 className="mt-3 text-3xl font-black">System Architecture I&apos;ve Built</h2>
          <p className="mt-3 max-w-2xl text-slate-600">Hover over components to see what each layer does in the multi-tenant security analytics platform.</p>
          <div className="relative mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm" style={{ height: 480 }}>
            <svg className="absolute inset-8 h-[calc(100%-64px)] w-[calc(100%-64px)]" style={{ zIndex: 0 }}>
              {archEdges.map((e, i) => (
                <line key={i} x1={`${e.x1}%`} y1={`${e.y1}%`} x2={`${e.x2}%`} y2={`${e.y2}%`} stroke="#e2e8f0" strokeWidth="2" />
              ))}
            </svg>
            {archNodes.map((node) => {
              const Icon = node.icon;
              const hovered = hoveredNode === node.id;
              return (
                <div key={node.id} onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex: 2 }}>
                  <motion.div animate={{ scale: hovered ? 1.1 : 1 }} className={`flex items-center gap-2 rounded-2xl border ${hovered ? "border-orange-300 shadow-lg shadow-orange-500/10" : "border-slate-200"} bg-white px-4 py-2.5 transition cursor-default`}>
                    <div className={`rounded-lg ${node.color} p-1.5`}><Icon className="h-3.5 w-3.5 text-white" /></div>
                    <span className="text-sm font-semibold whitespace-nowrap">{node.label}</span>
                  </motion.div>
                  <AnimatePresence>
                    {hovered && (
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                        className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-10">
                        <p className="text-xs leading-5 text-slate-600">{node.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Work</p>
        <h2 className="mt-3 text-3xl font-black">What I&apos;ve Built</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {projects.map((p, i) => {
            const Icon = p.icon; const active = sel.id === p.id;
            return (
              <Tilt key={p.id}>
                <motion.button initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  onClick={() => setSel(p)} className={`w-full rounded-3xl border ${active ? "border-orange-300 shadow-lg shadow-orange-500/10" : "border-slate-200 hover:border-slate-300 hover:shadow-md"} bg-white p-6 text-left transition`}>
                  <div className={`inline-flex rounded-2xl bg-gradient-to-br ${p.gradient} p-3 shadow-md`}><Icon className="h-5 w-5 text-white" /></div>
                  <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{p.cat}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{p.summary}</p>
                </motion.button>
              </Tilt>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={sel.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-black">{sel.title}</h3>
            <div className="mt-5 grid gap-3">
              {sel.details.map((d, i) => (
                <motion.div key={d} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-orange-400" />
                  <p className="leading-7 text-slate-700">{d}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── SKILLS ── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Toolkit</p>
        <h2 className="mt-3 text-3xl font-black">Technologies</h2>
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" style={{ maxWidth: 400 }}>
          <Search className="h-4 w-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter skills..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {filtered.map((s) => (
            <motion.span key={s} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:border-orange-300 hover:shadow-md">{s}</motion.span>
          ))}
        </div>
      </section>

      {/* ── OPEN SOURCE ── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Open Source</p>
        <h2 className="mt-3 text-3xl font-black">OpenSearch Contributions</h2>
        <p className="mt-3 text-slate-600">Live from GitHub — updates automatically with new contributions.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["security-analytics","alerting","common-utils","alerting-dashboards-plugin"].map((r) => (
            <a key={r} href={`https://github.com/opensearch-project/${r}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-xs text-slate-600 transition hover:border-orange-300"><Github className="h-3 w-3" />{r}</a>
          ))}
        </div>
        <div className="mt-8 space-y-3">
          {loading ? (
            <div className="flex items-center gap-3 py-8"><div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-orange-500" /><p className="text-slate-400">Fetching PRs...</p></div>
          ) : prs.length === 0 ? <p className="text-slate-400">No public PRs found.</p> : prs.slice(0, 15).map((pr) => {
            const repo = pr.repository_url?.split("/").pop() || "";
            const merged = pr.pull_request?.merged_at;
            const st = merged ? "merged" : pr.state === "closed" ? "closed" : "open";
            const sc = st === "merged" ? "text-purple-600 bg-purple-50 border-purple-200" : st === "open" ? "text-green-600 bg-green-50 border-green-200" : "text-slate-500 bg-slate-50 border-slate-200";
            return (
              <motion.a key={pr.html_url} href={pr.html_url} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-orange-200 hover:shadow-md">
                <GitPullRequest className={`mt-1 h-4 w-4 shrink-0 ${st === "merged" ? "text-purple-500" : st === "open" ? "text-green-500" : "text-slate-400"}`} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-6">{pr.title}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${sc}`}>{st}</span>
                    <span className="font-mono text-xs text-slate-400">{repo}</span>
                    <span className="text-xs text-slate-400">{new Date(pr.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
                <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
              </motion.a>
            );
          })}
        </div>
      </section>

      {/* ── PERSONAL PROJECTS (dynamic from GitHub) ── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Side Projects</p>
        <h2 className="mt-3 text-3xl font-black">Personal GitHub</h2>
        <p className="mt-3 text-slate-600">Fetched live — updates automatically when I push new repos.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {repos.length === 0 ? (
            <p className="text-slate-400">Loading repos...</p>
          ) : repos.map((r, i) => (
            <Tilt key={r.name}>
              <motion.a href={r.html_url} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="block rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-orange-300 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <Github className="h-5 w-5 text-slate-400" />
                  {r.language && <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">{r.language}</span>}
                </div>
                <h3 className="mt-4 text-base font-bold">{r.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-2">{r.description || "No description yet."}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-slate-400">
                  <ExternalLink className="h-3 w-3" /> View on GitHub
                </div>
              </motion.a>
            </Tilt>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-slate-900 p-10 text-white">
          <h2 className="text-3xl font-black">Let&apos;s build something meaningful</h2>
          <p className="mt-4 max-w-2xl leading-8 text-slate-300">I&apos;m always interested in hard distributed systems problems, open source collaboration, and teams that care about engineering craft.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="mailto:manaswini1920@gmail.com" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30"><Mail className="h-4 w-4" />Get in Touch<ArrowRight className="h-4 w-4" /></a>
            <a href="https://github.com/manaswini1920" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3.5 text-sm font-medium transition hover:bg-white/10"><Github className="h-4 w-4" />View GitHub</a>
          </div>
        </div>
      </section>
    </main>
  );
}
