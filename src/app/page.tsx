"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ChevronRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MoonStar,
  Shield,
  Database,
  Cpu,
  Filter,
  Sun,
  Moon,
  Terminal,
  GitPullRequest,
  BookOpen,
} from "lucide-react";

/* ── Animated Counter ── */
function Counter({ target, label }: { target: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold text-amber-400">{count}+</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}

/* ── GitHub PR type ── */
interface GitHubPR {
  title: string;
  html_url: string;
  repository_url: string;
  created_at: string;
  state: string;
  pull_request?: { merged_at: string | null };
}

/* ── Data ── */
const allSkills = [
  "Java","Python","C++","C","SQL","JavaScript",
  "AWS Lambda","Step Functions","S3","DynamoDB","ECS","SQS","SNS",
  "EventBridge","IAM","CloudFormation","CDK",
  "Aurora MySQL","OpenSearch","Microservices","Event-Driven Systems",
  "Reliability Engineering","Fault Tolerance","Workflow Orchestration","Multi-Tenant Platforms",
];

const projects = [
  {
    id: "aurora",
    title: "Aurora Serverless v2",
    category: "Database Engine",
    icon: Database,
    accent: "from-violet-500/20 to-fuchsia-500/10",
    summary: "Core infrastructure work across scale-to-zero, zero-downtime patching, cryptography migration, and fleet stability.",
    metrics: ["<15s wake-up latency", "100+ production clusters", "TLS 1.3 enablement"],
    details: [
      "Implemented scale-to-zero capability enabling idle database clusters to pause and resume automatically while maintaining wake-up latency under 15 seconds.",
      "Enhanced Zero-Downtime Patching mechanisms to preserve active client sessions and TLS connections during engine restarts.",
      "Led migration of Aurora cryptographic infrastructure from MySQL 5.7 to 8.0, enabling TLS 1.3 support and stronger connection security.",
      "Built memory-protection safeguards across 100+ production clusters, improving fleet stability and reducing non-graceful restarts.",
    ],
  },
  {
    id: "security-analytics",
    title: "OpenSearch Security Analytics",
    category: "Multi-Tenant Platform",
    icon: Shield,
    accent: "from-cyan-500/20 to-sky-500/10",
    summary: "Distributed backend services and orchestration for a multi-tenant security analytics platform handling large-scale telemetry ingestion and detections.",
    metrics: ["15+ customer APIs", "Multi-tenant architecture", "Cross-account security"],
    details: [
      "Developed core backend components for a multi-tenant security analytics platform enabling ingestion and analysis of large-scale security telemetry.",
      "Designed provisioning workflows using AWS Step Functions to orchestrate platform resources including queues, pipelines, and IAM roles.",
      "Built REST APIs for lifecycle management of analytics resources and detection pipelines using PPL, SQL, and SIGMA detection rules.",
      "Implemented secure cross-account architecture with STS AssumeRole, external IDs, and IAM trust policy validation.",
    ],
  },
  {
    id: "ops",
    title: "Production Reliability & Incident Response",
    category: "Operations",
    icon: Cpu,
    accent: "from-emerald-500/20 to-teal-500/10",
    summary: "Hands-on production ownership across on-call, incident response, debugging, and cross-team resolution of critical failures.",
    metrics: ["Cross-team coordination", "Production RCA leadership", "Fleet-wide mitigations"],
    details: [
      "Led incident response and root cause analysis for production failures including file descriptor leaks and replication issues, coordinating fixes across database engine, infrastructure, and reliability teams.",
      "Drove fleet-wide mitigations for critical customer escalations across 100+ production clusters.",
      "Established operational runbooks and trained engineers on production tooling and debugging procedures.",
    ],
  },
];

const timeline = [
  { year: "2021–Present", title: "Amazon Web Services", body: "Built distributed backend infrastructure across Aurora Serverless and OpenSearch Security Analytics with deep focus on reliability, orchestration, and secure multi-tenant design." },
  { year: "Aurora", title: "Database Engine Internals", body: "Worked on scale-to-zero, zero-downtime patching, TLS migration, maintenance scheduling, and fleet safeguards across production clusters." },
  { year: "OpenSearch", title: "Security Analytics Platform", body: "Built APIs, workflows, query conversion, testing infrastructure, and cross-account controls for a telemetry-driven detection platform." },
];

const terminalLines = [
  { cmd: "whoami", out: "manaswini · software engineer · aws" },
  { cmd: "cat experience.txt", out: "4+ years building distributed systems at scale" },
  { cmd: "ls projects/", out: "aurora-serverless/  opensearch-security-analytics/  incident-response/" },
  { cmd: "cat patent.txt", out: "Database Engine Sleep with Automatic In-Place Resource Scaling [PENDING]" },
  { cmd: "echo $FOCUS", out: "reliability · scalability · operational excellence" },
];

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [skillQuery, setSkillQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [dark, setDark] = useState(true);
  const [prs, setPrs] = useState<GitHubPR[]>([]);
  const [prsLoading, setPrsLoading] = useState(true);

  const filteredSkills = useMemo(() => {
    if (!skillQuery.trim()) return allSkills;
    return allSkills.filter((s) => s.toLowerCase().includes(skillQuery.toLowerCase()));
  }, [skillQuery]);

  /* Fetch public PRs from opensearch-project repos */
  useEffect(() => {
    const repos = ["alerting", "common-utils", "alerting-dashboards-plugin", "security-analytics"];
    async function fetchPRs() {
      try {
        const all = await Promise.all(
          repos.map((repo) =>
            fetch(`https://api.github.com/repos/opensearch-project/${repo}/pulls?state=all&per_page=100`)
              .then((r) => r.json())
              .then((pulls: GitHubPR[]) =>
                Array.isArray(pulls) ? pulls.filter((p) => p.html_url?.includes("manaswini")) : []
              )
              .catch(() => [] as GitHubPR[])
          )
        );
        /* also search via GitHub search API as fallback */
        const searchRes = await fetch(
          `https://api.github.com/search/issues?q=author:manaswini1920+type:pr+org:opensearch-project&per_page=100`
        ).then((r) => r.json()).catch(() => ({ items: [] }));
        const searchPRs: GitHubPR[] = searchRes.items || [];
        const combined = [...all.flat(), ...searchPRs];
        const unique = Array.from(new Map(combined.map((p) => [p.html_url, p])).values());
        unique.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setPrs(unique);
      } catch { setPrs([]); }
      finally { setPrsLoading(false); }
    }
    fetchPRs();
  }, []);

  const bg = dark ? "bg-[#0a0f1e] text-slate-100" : "bg-[#fafaf8] text-slate-900";
  const card = dark ? "border-[#1a2340] bg-[#0f1729]/80" : "border-slate-200 bg-slate-50";
  const card2 = dark ? "border-[#1a2340] bg-[#0f1729]/60" : "border-slate-200 bg-white";
  const card3 = dark ? "border-[#1a2340] bg-[#080d1a]/70" : "border-slate-200 bg-slate-100";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const mutedBorder = dark ? "border-[#2a3558]" : "border-slate-300";
  const heading = dark ? "text-white" : "text-slate-900";
  const body = dark ? "text-slate-300" : "text-slate-600";
  const label = dark ? "text-slate-500" : "text-slate-400";
  const accent = dark ? "text-amber-400" : "text-amber-600";

  return (
    <main className={`min-h-screen transition-colors duration-300 ${bg}`}>
      {dark && <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(217,170,75,0.08),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(99,130,200,0.08),_transparent_25%)]" />}

      {/* Theme toggle */}
      <div className="fixed right-5 top-5 z-50">
        <button onClick={() => setDark(!dark)} className={`rounded-full p-3 backdrop-blur transition ${dark ? "bg-[#1a2340]/80 text-amber-400 hover:bg-[#1a2340]" : "bg-slate-200 text-slate-900 hover:bg-slate-300"}`}>
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {/* ── HEADER ── */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className={`rounded-[28px] border ${card} p-8 shadow-2xl shadow-black/30 backdrop-blur`}>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {["Software Engineer", "Distributed Systems", "AWS"].map((t) => (
                <span key={t} className={`rounded-full border ${mutedBorder} px-3 py-1 ${body}`}>{t}</span>
              ))}
            </div>
            <h1 className={`mt-6 text-4xl font-bold tracking-tight md:text-6xl ${heading}`}>Manaswini Ragamouni</h1>
            <p className={`mt-5 max-w-3xl text-lg leading-8 ${body}`}>
              I build distributed infrastructure across <span className={`font-semibold ${heading}`}>database engines</span> and <span className={`font-semibold ${heading}`}>security analytics platforms</span> with a strong focus on reliability, scalability, and operational excellence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="mailto:manaswini1920@gmail.com" className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium transition hover:-translate-y-0.5 ${dark ? "bg-amber-400 text-[#0a0f1e]" : "bg-slate-900 text-white"}`}><Mail className="h-4 w-4" />Contact</a>
              <a href="https://github.com/manaswini1920" target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-2xl border ${mutedBorder} px-5 py-3 font-medium ${heading} transition hover:opacity-80`}><Github className="h-4 w-4" />GitHub</a>
              <a href="https://www.linkedin.com/in/manaswini-ragamouni" target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-2xl border ${mutedBorder} px-5 py-3 font-medium ${heading} transition hover:opacity-80`}><Linkedin className="h-4 w-4" />LinkedIn</a>
              <a href="https://medium.com/@manaswini1920" target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-2xl border ${mutedBorder} px-5 py-3 font-medium ${heading} transition hover:opacity-80`}><BookOpen className="h-4 w-4" />Medium</a>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className={`rounded-[28px] border ${card} p-8 backdrop-blur`}>
            <p className={`text-sm uppercase tracking-[0.3em] ${label}`}>Quick Snapshot</p>
            <div className={`mt-6 space-y-5 text-sm ${body}`}>
              <div className="flex items-start gap-3"><MapPin className={`mt-0.5 h-4 w-4 ${label}`} /><div><p className={label}>Location</p><p>Santa Clara, CA, USA</p></div></div>
              <div className="flex items-start gap-3"><MoonStar className={`mt-0.5 h-4 w-4 ${label}`} /><div><p className={label}>Patent</p><p>Database Engine Sleep with Automatic In-Place Resource Scaling</p></div></div>
              <div>
                <p className={label}>Core Areas</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Aurora Serverless","OpenSearch","Data Ingestion","Reliability","Multi-Tenant Systems"].map((item) => (
                    <span key={item} className={`rounded-full border ${mutedBorder} px-3 py-1 text-xs ${body}`}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── METRICS ── */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto max-w-7xl px-6 pb-10 md:px-10">
        <div className={`rounded-[28px] border ${card2} p-8`}>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <Counter target={100} label="Production Clusters Served" />
            <Counter target={15} label="Customer APIs Designed" />
            <Counter target={4} label="Years at AWS" />
            <Counter target={1} label="Patent (Pending)" />
          </div>
        </div>
      </motion.section>

      {/* ── TABS ── */}
      <section className="mx-auto max-w-7xl px-6 pb-6 md:px-10">
        <div className="flex flex-wrap gap-3">
          {["overview","experience","skills","open-source","terminal"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab ? (dark ? "bg-amber-400 text-[#0a0f1e]" : "bg-slate-900 text-white") : `border ${mutedBorder} ${dark ? "bg-[#0f1729]/70" : "bg-white"} ${body} hover:opacity-80`}`}>
              {tab === "open-source" ? "Open Source" : tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className={`rounded-[28px] border ${card2} p-6`}>
              <p className={`text-sm uppercase tracking-[0.3em] ${label}`}>Career Timeline</p>
              <div className="mt-6 space-y-6">
                {timeline.map((item, index) => (
                  <motion.div key={item.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="relative pl-8">
                    <div className={`absolute left-0 top-1 h-3 w-3 rounded-full ${dark ? "bg-amber-400" : "bg-slate-900"}`} />
                    {index !== timeline.length - 1 && <div className={`absolute left-[5px] top-5 h-[calc(100%+12px)] w-px ${dark ? "bg-[#2a3558]" : "bg-slate-300"}`} />}
                    <p className={`text-xs uppercase tracking-[0.25em] ${label}`}>{item.year}</p>
                    <h3 className={`mt-1 text-lg font-semibold ${heading}`}>{item.title}</h3>
                    <p className={`mt-2 leading-7 ${body}`}>{item.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className={`rounded-[28px] border ${card2} p-6`}>
              <p className={`text-sm uppercase tracking-[0.3em] ${label}`}>Featured Work</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {projects.map((project) => {
                  const Icon = project.icon;
                  const isActive = selectedProject.id === project.id;
                  return (
                    <button key={project.id} onClick={() => setSelectedProject(project)} className={`rounded-3xl border p-5 text-left transition ${isActive ? (dark ? "border-slate-500 bg-slate-800" : "border-slate-400 bg-slate-100") : `${dark ? "border-slate-800 bg-slate-950/40 hover:border-slate-600" : "border-slate-200 bg-white hover:border-slate-400"}`}`}>
                      <div className={`inline-flex rounded-2xl bg-gradient-to-br ${project.accent} p-3`}><Icon className={`h-5 w-5 ${heading}`} /></div>
                      <h3 className={`mt-4 text-lg font-semibold ${heading}`}>{project.title}</h3>
                      <p className={`mt-1 text-sm ${muted}`}>{project.category}</p>
                      <p className={`mt-3 text-sm leading-6 ${body}`}>{project.summary}</p>
                    </button>
                  );
                })}
              </div>
              <motion.div key={selectedProject.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`mt-6 rounded-3xl border ${card3} p-6`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className={`text-2xl font-semibold ${heading}`}>{selectedProject.title}</h3>
                    <p className={`mt-2 max-w-3xl leading-7 ${body}`}>{selectedProject.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.metrics.map((m) => (<span key={m} className={`rounded-full border ${mutedBorder} px-3 py-1 text-xs ${body}`}>{m}</span>))}
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  {selectedProject.details.map((detail) => (
                    <motion.div key={detail} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={`flex gap-3 rounded-2xl border ${dark ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-slate-50"} px-4 py-4`}>
                      <ChevronRight className={`mt-1 h-4 w-4 shrink-0 ${label}`} />
                      <p className={`leading-7 ${body}`}>{detail}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── EXPERIENCE ── */}
      {activeTab === "experience" && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className={`rounded-[28px] border ${card2} p-8`}>
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className={`text-sm uppercase tracking-[0.3em] ${label}`}>Professional Experience</p>
                <h2 className={`mt-2 text-3xl font-bold ${heading}`}>Amazon Web Services</h2>
                <p className={`mt-2 max-w-4xl leading-7 ${body}`}>Developed distributed backend infrastructure for the Aurora Serverless database engine and OpenSearch Security Analytics platform, focusing on reliability, distributed systems design, and large-scale telemetry ingestion.</p>
              </div>
              <p className={`text-sm ${muted}`}>Bay Area, CA</p>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {projects.map((project) => {
                const Icon = project.icon;
                return (
                  <motion.article key={project.id} whileHover={{ y: -4 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`rounded-3xl border ${card3} p-6`}>
                    <div className={`inline-flex rounded-2xl bg-gradient-to-br ${project.accent} p-3`}><Icon className={`h-5 w-5 ${heading}`} /></div>
                    <h3 className={`mt-4 text-xl font-semibold ${heading}`}>{project.title}</h3>
                    <p className={`mt-1 text-sm ${muted}`}>{project.category}</p>
                    <div className="mt-5 space-y-3">
                      {project.details.map((detail) => (
                        <div key={detail} className={`rounded-2xl border ${dark ? "border-slate-800" : "border-slate-200"} px-4 py-4 text-sm leading-7 ${body}`}>{detail}</div>
                      ))}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.section>
      )}

      {/* ── SKILLS ── */}
      {activeTab === "skills" && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <div className={`rounded-[28px] border ${card2} p-6`}>
              <p className={`text-sm uppercase tracking-[0.3em] ${label}`}>Skills Explorer</p>
              <h2 className={`mt-2 text-2xl font-semibold ${heading}`}>Search my toolkit</h2>
              <div className={`mt-5 flex items-center gap-3 rounded-2xl border ${dark ? "border-slate-800 bg-slate-950/50" : "border-slate-200 bg-slate-50"} px-4 py-3`}>
                <Filter className={`h-4 w-4 ${label}`} />
                <input value={skillQuery} onChange={(e) => setSkillQuery(e.target.value)} placeholder="Search Java, Step Functions, OpenSearch..." className={`w-full bg-transparent text-sm outline-none ${heading} placeholder:${label}`} />
              </div>
              <p className={`mt-4 text-sm leading-6 ${muted}`}>Explore languages, cloud services, and distributed systems technologies used across Aurora Serverless and OpenSearch Security Analytics.</p>
            </div>
            <div className={`rounded-[28px] border ${card2} p-6`}>
              <div className="flex items-center justify-between gap-4">
                <h3 className={`text-xl font-semibold ${heading}`}>Filtered Skills</h3>
                <p className={`text-sm ${muted}`}>{filteredSkills.length} results</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {filteredSkills.map((skill) => (
                  <motion.span key={skill} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-full border ${mutedBorder} ${dark ? "bg-slate-950/50" : "bg-white"} px-4 py-2 text-sm ${body}`}>{skill}</motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── OPEN SOURCE (dynamic PRs) ── */}
      {activeTab === "open-source" && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className={`rounded-[28px] border ${card2} p-8`}>
            <div className="flex items-center gap-3">
              <GitPullRequest className={`h-6 w-6 ${heading}`} />
              <div>
                <p className={`text-sm uppercase tracking-[0.3em] ${label}`}>Open Source Contributions</p>
                <h2 className={`mt-1 text-2xl font-bold ${heading}`}>OpenSearch Project (Linux Foundation)</h2>
              </div>
            </div>
            <p className={`mt-4 max-w-3xl leading-7 ${body}`}>Pull requests fetched live from GitHub. Contributions include feature development, bug fixes, and performance improvements to alerting and security analytics plugins.</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {["security-analytics","alerting","common-utils","alerting-dashboards-plugin"].map((repo) => (
                <a key={repo} href={`https://github.com/opensearch-project/${repo}`} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 rounded-full border ${mutedBorder} px-3 py-1 text-xs font-mono ${body} transition hover:opacity-70`}>
                  <Github className="h-3 w-3" />{repo}
                </a>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              {prsLoading ? (
                <div className="flex items-center gap-3 py-8">
                  <div className={`h-4 w-4 animate-spin rounded-full border-2 ${mutedBorder} border-t-transparent`} />
                  <p className={muted}>Fetching PRs from GitHub...</p>
                </div>
              ) : prs.length === 0 ? (
                <p className={muted}>No public PRs found. Check back later or visit the repos directly.</p>
              ) : (
                prs.map((pr) => {
                  const repo = pr.repository_url?.split("/").pop() || pr.html_url.split("/")[5] || "";
                  const merged = pr.pull_request?.merged_at;
                  const status = merged ? "merged" : pr.state === "closed" ? "closed" : "open";
                  const statusColor = status === "merged" ? "text-purple-400 border-purple-500/30" : status === "open" ? "text-green-400 border-green-500/30" : "text-red-400 border-red-500/30";
                  return (
                    <motion.a key={pr.html_url} href={pr.html_url} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`flex items-start gap-4 rounded-2xl border ${dark ? "border-slate-800 bg-slate-950/50 hover:border-slate-600" : "border-slate-200 bg-slate-50 hover:border-slate-400"} p-4 transition`}>
                      <GitPullRequest className={`mt-1 h-4 w-4 shrink-0 ${statusColor.split(" ")[0]}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`font-medium leading-6 ${heading}`}>{pr.title}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border ${statusColor} px-2 py-0.5 text-xs`}>{status}</span>
                          <span className={`font-mono text-xs ${muted}`}>{repo}</span>
                          <span className={`text-xs ${muted}`}>{new Date(pr.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                      </div>
                      <ExternalLink className={`mt-1 h-4 w-4 shrink-0 ${muted}`} />
                    </motion.a>
                  );
                })
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* ── TERMINAL ── */}
      {activeTab === "terminal" && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className="overflow-hidden rounded-[28px] border border-[#1a2340] bg-[#080d1a] shadow-2xl">
            <div className="flex items-center gap-2 border-b border-[#1a2340] px-5 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-3 font-mono text-xs text-slate-500">manaswini@aws ~ %</span>
            </div>
            <div className="p-6 font-mono text-sm leading-8">
              {terminalLines.map((line, i) => (
                <motion.div key={line.cmd} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                  <p className="text-amber-400">$ {line.cmd}</p>
                  <p className="text-slate-300">{line.out}</p>
                  {i < terminalLines.length - 1 && <div className="my-2" />}
                </motion.div>
              ))}
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: terminalLines.length * 0.15 }} className="mt-4 text-amber-400">$ <span className="animate-pulse">▊</span></motion.p>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── PATENT SPOTLIGHT ── */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mx-auto max-w-7xl px-6 py-6 md:px-10">
        <div className={`rounded-[28px] border ${dark ? "border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent" : "border-amber-300 bg-amber-50"} p-8`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className={`rounded-2xl ${dark ? "bg-amber-500/10" : "bg-amber-100"} p-3`}>
                <MoonStar className={`h-6 w-6 ${dark ? "text-amber-400" : "text-amber-600"}`} />
              </div>
              <div>
                <span className={`rounded-full border ${dark ? "border-amber-500/30 text-amber-400" : "border-amber-400 text-amber-700"} px-3 py-0.5 text-xs font-semibold uppercase tracking-wider`}>Patent Pending</span>
                <h3 className={`mt-2 text-xl font-bold ${heading}`}>Database Engine Sleep with Automatic In-Place Resource Scaling</h3>
                <p className={`mt-2 leading-7 ${body}`}>Co-inventor of scaling algorithm enabling automatic compute optimization for idle Aurora database clusters without service disruption.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className={`rounded-[28px] border ${dark ? "border-[#1a2340] bg-gradient-to-r from-[#0f1729] to-[#0a0f1e]" : "border-slate-200 bg-gradient-to-r from-slate-50 to-white"} p-8`}>
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={`text-sm uppercase tracking-[0.3em] ${label}`}>Open Source & Contact</p>
              <h2 className={`mt-2 text-2xl font-semibold ${heading}`}>Let&apos;s build something meaningful</h2>
              <p className={`mt-3 max-w-3xl leading-7 ${body}`}>I contribute to OpenSearch open source projects and enjoy working on distributed infrastructure, database systems, and secure multi-tenant platforms.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="https://github.com/manaswini1920" target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium ${dark ? "bg-amber-400 text-[#0a0f1e]" : "bg-slate-900 text-white"}`}><ExternalLink className="h-4 w-4" />View GitHub</a>
              <a href="mailto:manaswini1920@gmail.com" className={`inline-flex items-center gap-2 rounded-2xl border ${mutedBorder} px-5 py-3 font-medium ${heading}`}><Mail className="h-4 w-4" />Email Me</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
