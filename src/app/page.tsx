"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

const allSkills = [
  "Java",
  "Python",
  "C++",
  "C",
  "SQL",
  "JavaScript",
  "AWS Lambda",
  "Step Functions",
  "S3",
  "DynamoDB",
  "ECS",
  "SQS",
  "SNS",
  "EventBridge",
  "IAM",
  "CloudFormation",
  "CDK",
  "Aurora MySQL",
  "OpenSearch",
  "Microservices",
  "Event-Driven Systems",
  "Reliability Engineering",
  "Fault Tolerance",
  "Workflow Orchestration",
  "Multi-Tenant Platforms",
];

const projects = [
  {
    id: "aurora",
    title: "Aurora Serverless v2",
    category: "Database Engine",
    icon: Database,
    accent: "from-violet-500/20 to-fuchsia-500/10",
    summary:
      "Core infrastructure work across scale-to-zero, zero-downtime patching, cryptography migration, and fleet stability.",
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
    summary:
      "Distributed backend services and orchestration for a multi-tenant security analytics platform handling large-scale telemetry ingestion and detections.",
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
    summary:
      "Hands-on production ownership across on-call, incident response, debugging, and cross-team resolution of critical failures.",
    metrics: ["128+ incidents resolved", "13 on-call rotations", "Cross-team RCA"],
    details: [
      "Led incident response and root cause analysis for production failures including file descriptor leaks and replication issues.",
      "Coordinated fixes across database engine, infrastructure, and reliability teams for high-severity issues.",
      "Ranked among top engineers for ticket resolution rate while supporting large-scale production systems.",
    ],
  },
];

const timeline = [
  {
    year: "2021–Present",
    title: "Amazon Web Services",
    body: "Built distributed backend infrastructure across Aurora Serverless and OpenSearch Security Analytics with deep focus on reliability, orchestration, and secure multi-tenant design.",
  },
  {
    year: "Aurora",
    title: "Database Engine Internals",
    body: "Worked on scale-to-zero, zero-downtime patching, TLS migration, maintenance scheduling, and fleet safeguards across production clusters.",
  },
  {
    year: "OpenSearch",
    title: "Security Analytics Platform",
    body: "Built APIs, workflows, query conversion, testing infrastructure, and cross-account controls for a telemetry-driven detection platform.",
  },
];

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [skillQuery, setSkillQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const filteredSkills = useMemo(() => {
    if (!skillQuery.trim()) return allSkills;
    return allSkills.filter((skill) =>
      skill.toLowerCase().includes(skillQuery.toLowerCase())
    );
  }, [skillQuery]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.12),_transparent_25%)]" />

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]"
        >
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-slate-700 px-3 py-1">Software Engineer</span>
              <span className="rounded-full border border-slate-700 px-3 py-1">Distributed Systems</span>
              <span className="rounded-full border border-slate-700 px-3 py-1">AWS</span>
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              Manaswini Ragamouni
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              I build distributed infrastructure across{" "}
              <span className="font-semibold text-white">database engines</span> and{" "}
              <span className="font-semibold text-white">security analytics platforms</span>{" "}
              with a strong focus on reliability, scalability, and operational excellence.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:manaswini1920@gmail.com"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-slate-950 transition hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4" />
                Contact
              </a>
              <a
                href="https://github.com/manaswini1920"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 font-medium text-white transition hover:border-slate-500 hover:bg-slate-800"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/manaswini-ragamouni"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 font-medium text-white transition hover:border-slate-500 hover:bg-slate-800"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-8 backdrop-blur"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Quick Snapshot</p>
            <div className="mt-6 space-y-5 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-slate-500">Location</p>
                  <p>Santa Clara, CA, USA</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MoonStar className="mt-0.5 h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-slate-500">Patent</p>
                  <p>Database Engine Sleep with Automatic In-Place Resource Scaling</p>
                </div>
              </div>
              <div>
                <p className="text-slate-500">Core Areas</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    "Aurora Serverless",
                    "OpenSearch",
                    "Telemetry Ingestion",
                    "Reliability",
                    "Multi-Tenant Systems",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-6 md:px-10">
        <div className="flex flex-wrap gap-3">
          {["overview", "experience", "skills"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-white text-slate-950"
                  : "border border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500"
              }`}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "overview" && (
        <section className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Career Timeline</p>
              <div className="mt-6 space-y-6">
                {timeline.map((item, index) => (
                  <div key={item.title} className="relative pl-8">
                    <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-white" />
                    {index !== timeline.length - 1 && (
                      <div className="absolute left-[5px] top-5 h-[calc(100%+12px)] w-px bg-slate-700" />
                    )}
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.year}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 leading-7 text-slate-300">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Featured Work</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {projects.map((project) => {
                  const Icon = project.icon;
                  const isActive = selectedProject.id === project.id;
                  return (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className={`rounded-3xl border p-5 text-left transition ${
                        isActive
                          ? "border-slate-500 bg-slate-800"
                          : "border-slate-800 bg-slate-950/40 hover:border-slate-600"
                      }`}
                    >
                      <div className={`inline-flex rounded-2xl bg-gradient-to-br ${project.accent} p-3`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-white">{project.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{project.category}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{project.summary}</p>
                    </button>
                  );
                })}
              </div>

              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/50 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{selectedProject.title}</h3>
                    <p className="mt-2 max-w-3xl leading-7 text-slate-300">{selectedProject.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.metrics.map((metric) => (
                      <span
                        key={metric}
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {selectedProject.details.map((detail) => (
                    <div
                      key={detail}
                      className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-4"
                    >
                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
                      <p className="leading-7 text-slate-300">{detail}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "experience" && (
        <section className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/60 p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Professional Experience
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">Amazon Web Services</h2>
                <p className="mt-2 max-w-4xl leading-7 text-slate-300">
                  Developed distributed backend infrastructure for the Aurora Serverless
                  database engine and OpenSearch Security Analytics platform, focusing on
                  reliability, distributed systems design, and large-scale telemetry ingestion.
                </p>
              </div>
              <p className="text-sm text-slate-400">Bay Area, CA</p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {projects.map((project) => {
                const Icon = project.icon;
                return (
                  <motion.article
                    key={project.id}
                    whileHover={{ y: -4 }}
                    className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6"
                  >
                    <div className={`inline-flex rounded-2xl bg-gradient-to-br ${project.accent} p-3`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-white">{project.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{project.category}</p>
                    <div className="mt-5 space-y-3">
                      {project.details.map((detail) => (
                        <div
                          key={detail}
                          className="rounded-2xl border border-slate-800 px-4 py-4 text-sm leading-7 text-slate-300"
                        >
                          {detail}
                        </div>
                      ))}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {activeTab === "skills" && (
        <section className="mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="rounded-[28px] border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Skills Explorer</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Search my toolkit</h2>
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3">
                <Filter className="h-4 w-4 text-slate-500" />
                <input
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                  placeholder="Search Java, Step Functions, OpenSearch..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Explore languages, cloud services, and distributed systems technologies
                used across Aurora Serverless and OpenSearch Security Analytics.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold text-white">Filtered Skills</h3>
                <p className="text-sm text-slate-400">{filteredSkills.length} results</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {filteredSkills.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-full border border-slate-700 bg-slate-950/50 px-4 py-2 text-sm text-slate-300"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="rounded-[28px] border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Open Source & Contact
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Let&apos;s build something meaningful
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                I contribute to OpenSearch open source projects and enjoy working on
                distributed infrastructure, database systems, and secure multi-tenant platforms.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/manaswini1920"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-slate-950"
              >
                <ExternalLink className="h-4 w-4" />
                View GitHub
              </a>
              <a
                href="mailto:manaswini1920@gmail.com"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 font-medium text-white"
              >
                <Mail className="h-4 w-4" />
                Email Me
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
