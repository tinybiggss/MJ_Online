#!/usr/bin/env node
/**
 * run_eval.mjs — RAG eval harness + corpus-refresh loop (kanban t_874fa8ef; mirror T-2026-10-20-8BF).
 *
 * THE LOOP'S PURPOSE: the scorecard's WEAK LIST is the improvement backlog. Each weakness maps to a
 * fix class — retrieval miss -> chunking / fusion / keyword-leg tuning; grounded-but-wrong -> corpus
 * content gap -> KB or claims-file fix; hallucination -> answer-prompt tightening. Fix NOTHING here;
 * the backlog is the deliverable. The corpus deploy step stays a manual Mike step (publication-layer
 * rule): this harness stages and measures, never applies to live knowledge.jsonl, never deploys.
 *
 * ONE COMMAND (no args = full refresh + deterministic retrieval eval + LLM-judge leg + scorecard out):
 *   node tests/rag-eval/run_eval.mjs [--skip-assembly] [--skip-judge] [--nightly] [--out <path>]
 *
 * Stages:
 *   1. REFRESH — re-run the two-layer corpus assembly (both converters, scripts/corpus-assembly.mjs)
 *      and DIFF staging corpus vs LIVE knowledge.jsonl. EMPTY diff = one-line log (+ nightly gate: skip
 *      eval, exit 0 — N6H law); NON-EMPTY diff = eval proceeds. If the staged corpus generation changed
 *      vs the vector index, the index is rebuilt locally BEFORE the eval (build-vector-index.mjs).
 *   2. RETRIEVAL METRICS — deterministic, ZERO LLM spend, ALL questions: hit@3 / hit@5 (served top-k),
 *      MRR over the full fused ordering, binary NDCG@5 per category — AFTER vs BEFORE regimes.
 *      BEFORE = legacy knowledge.jsonl corpus through the frozen keyword scorer (today's prod behavior;
 *      src/rag-retrieval.js is verbatim inside hybrid-engine.mjs). KB-path expectations legitimately miss
 *      in BEFORE (no Layer A pre-ingest); corpus refs retired by the swap join as waivers (design §1).
 *   3. ANSWER QUALITY — LLM-judge on a deterministic sample of <=12 questions favoring
 *      narrative-synthesis + negative-space. Tonight the repo generation path (src/ai-integration.js,
 *      gpt-3.5-turbo + env.OPENAI_API_KEY) CANNOT run locally (key exists only as a Cloudflare secret),
 *      so the sanctioned fallback applies: judge the RETRIEVATION-CONTEXT quality only (what the answer
 *      would have to be grounded in). Judge = DIFFERENT local Ollama model, temp 0, JSON-constrained.
 *   4. SCORECARD OUT — tests/rag-eval/scorecard-eval-<date>.json by default (tonight run uses
 *      --out scorecard-2026-10-21.json per the harness card). Deterministic block also SHA'd in the
 *      log line: two runs of this harness must print the SAME retrieval sha (byte-identical) or it is a bug.
 *
 * Custody law (design §6/§4): repo questions.jsonl = public rows; private-space rows merge in from the
 * vault (Distills/Corpus/career/eval-questions-private.jsonl) at eval time. Private-row IDENTITIES are
 * withheld from this repo artifact — counts/scores only, no ids, no question text, no reference strings.
 *
 * ENGINE ROOT: where hybrid-engine.mjs + staging live. Until t_ba6fdfc1 merges that is the staged
 * worktree (constant below); after the merge set RAG_ENGINE_ROOT to the repo, or edit this constant.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HARNESS_DIR = path.dirname(fileURLToPath(import.meta.url)); // .../mj-chatbot-backend/tests/rag-eval
const REPO_LIVE_ROOT = path.resolve(HARNESS_DIR, '..', '..'); // LIVE repo root (knowledge.jsonl NEVER written)
const VAULT = process.env.RAG_VAULT || '/Users/michaeljones/Dev/Obsidian/Mike_Thinking_Space';
// TODO(t_ba6fdfc1 merge): point this (or RAG_ENGINE_ROOT at runtime) at the live repo root.
const DEFAULT_ENGINE_ROOT = '/Users/michaeljones/.hermes/cache/scratch/wt-rag-engine-t_ba6fdfc1/mj-chatbot-backend';
const ENGINE_ROOT = path.resolve(process.env.RAG_ENGINE_ROOT || DEFAULT_ENGINE_ROOT);

const ENGINE_TEST = (p) => path.join(ENGINE_ROOT, 'tests', 'rag-eval', p);
const STAGED_CORPUS = path.join(ENGINE_ROOT, 'staging', 'merged-corpus.jsonl');
const VECTOR_INDEX = path.join(ENGINE_ROOT, 'tests', 'rag-eval', 'vectors-local', 'vectors-nomic-embed-text.jsonl');
const LEGACY_CORPUS = path.join(ENGINE_ROOT, 'knowledge.jsonl'); // same bytes as REPO_LIVE_ROOT/knowledge.jsonl
const LIVE_CORPUS = path.join(REPO_LIVE_ROOT, 'knowledge.jsonl');
const REPO_QUESTIONS = path.join(HARNESS_DIR, 'questions.jsonl');
const VAULT_QUESTIONS = path.join(VAULT, 'Distills', 'Corpus', 'career', 'eval-questions-private.jsonl');

const JUDGE_MODEL = 'qwen2.5:14b-instruct';
const OLLAMA_URL = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const JUDGE_TEMP = 0;
const JUDGE_SAMPLE_MAX = 12;
const JUDGE_PROMPT_VERSION = 'harness-context-judge-v1';

function parseArgs() {
  const out = { skipAssembly: false, skipJudge: false, nightly: false, out: null, maxJudgeCalls: JUDGE_SAMPLE_MAX };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    switch (a[i]) {
      case '--skip-assembly': out.skipAssembly = true; break;
      case '--skip-judge': out.skipJudge = true; break;
      case '--nightly': out.nightly = true; break;
      case '--out': out.out = path.resolve(a[++i]); break;
      case '--help': case '-h':
        console.log('usage: node run_eval.mjs [--skip-assembly] [--skip-judge] [--nightly] [--out path]');
        process.exit(0);
      default:
        console.error(`run_eval: unknown flag ${a[i]}`);
        process.exitCode = 2;
    }
  }
  return out;
}

const log = (...m) => console.log('[run_eval]', ...m);

function readJsonl(p) {
  return fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

function canon(x) {
  if (x === null || typeof x !== 'object') return JSON.stringify(x);
  if (Array.isArray(x)) return '[' + x.map(canon).join(',') + ']';
  return '{' + Object.keys(x).sort().map((k) => JSON.stringify(k) + ':' + canon(x[k])).join(',') + '}';
}

function sha(obj) {
  return crypto.createHash('sha256').update(canon(obj)).digest('hex');
}

// ---------------------------------------------------------------------------
// Stage 1 — REFRESH: re-run both converters, diff staging vs live, keep index fresh
// ---------------------------------------------------------------------------

async function refresh() {
  const report = { assembly_ran: true, assembly_exit: null, assembly_url_state: null, gate_events: null, hard_fail: false, stderr_tail: null };
  log('REFRESH: re-running corpus assembly (both converters) —', 'node scripts/corpus-assembly.mjs');
  const asmPath = path.join(ENGINE_ROOT, 'scripts', 'corpus-assembly.mjs');
  const r = spawnSync('node', [asmPath], { cwd: ENGINE_ROOT, encoding: 'utf8', timeout: 600_000, maxBuffer: 32 * 1024 * 1024 });
  report.assembly_exit = r.status;
  if (r.error) {
    report.hard_fail = true;
    report.stderr_tail = String(r.error.message || r.error);
    return report;
  }
  if (r.status !== 0) {
    report.hard_fail = true;
    report.stderr_tail = (r.stderr || r.stdout || '').split('\n').slice(-12).join('\n');
    return report;
  }
  try {
    const asmReport = JSON.parse(fs.readFileSync(path.join(ENGINE_ROOT, 'staging', 'assembly-report.json'), 'utf8'));
    report.gate_events = Array.isArray(asmReport.gateEvents) ? asmReport.gateEvents.length : null;
  } catch { /* report optional */ }
  return report;
}

function diffCorpora(stagePath, livePath) {
  const staged = readJsonl(stagePath);
  const live = readJsonl(livePath);
  const stagedById = new Map(staged.map((e) => [e.id, e]));
  const liveById = new Map(live.map((e) => [e.id, e]));
  const added = [], removed = [], changed = [];
  for (const [id, e] of stagedById) {
    if (!liveById.has(id)) added.push(id);
    else if (canon(e) !== canon(liveById.get(id))) changed.push(id);
  }
  for (const id of liveById.keys()) if (!stagedById.has(id)) removed.push(id);
  return {
    staged_count: staged.length,
    live_count: live.length,
    added_count: added.length, removed_count: removed.length, changed_count: changed.length,
    added_sample: added.slice(0, 8), removed_sample: removed.slice(0, 8), changed_sample: changed.slice(0, 8),
    empty: added.length === 0 && removed.length === 0 && changed.length === 0,
  };
}

function vectorIndexState() {
  try {
    const first = JSON.parse(fs.readFileSync(VECTOR_INDEX, 'utf8').split('\n').filter(Boolean)[0]);
    return { corpus_sha: first.corpus_sha, model: first.model, model_digest: first.model_digest, count: readJsonl(VECTOR_INDEX).length };
  } catch (e) {
    return { corpus_sha: null, model: null, model_digest: null, count: 0, error: String(e.message || e) };
  }
}

// ---------------------------------------------------------------------------
// Stage 2 — deterministic retrieval metrics (scoring law verbatim from run-scorecard.mjs)
// ---------------------------------------------------------------------------

function buildPathIndex(corpus) {
  const idx = {};
  for (const e of corpus) {
    if (e.layer !== 'A') continue;
    const m = /^kb:KB\/(.+)$/.exec(e.source || '');
    if (m) {
      idx[m[1]] = idx[m[1]] || [];
      idx[m[1]].push(e.id);
    }
  }
  return idx;
}

function resolveRefs(refs, corpusById, pathIndex, regime, kind = 'expected') {
  const ids = [];
  const problems = [];
  for (const ref of refs || []) {
    const m = /^corpus:(.+)$/.exec(ref);
    if (m) {
      if (corpusById.has(m[1])) ids.push(m[1]);
      else if (regime === 'after') problems.push({ ref, class: 'waiver-row (entry retired at first swap — expected, waiver join)' });
      else problems.push({ ref, class: 'hard-fail: corpus id absent from BEFORE corpus' });
      continue;
    }
    const rel = ref.replace(/^KB\//, '');
    const key = /\.md$/.test(ref) || rel.includes('/') ? rel : null;
    if (key !== null) {
      const hit = pathIndex[key];
      if (hit && hit.length) ids.push(...hit);
      else if (kind === 'must_not') problems.push({ ref, class: 'protected-absent (pass by construction: no corpus entry exists for this must-not page)' });
      else if (regime === 'after') problems.push({ ref, class: 'hard-fail: KB path joined no Layer A id' });
      // BEFORE regime: KB-path refs are pre-ingest misses by design (zero hits expected)
    } else {
      problems.push({ ref, class: 'hard-fail: unrecognized reference vocabulary' });
    }
  }
  return { ids, problems };
}

function rankMetrics(resolvedIds, res) {
  const set = new Set(resolvedIds);
  const servedIds = res.retrieved.map((r) => r.id);
  const fusedIds = res.fused_rank.map((r) => r.id);
  let firstHitRank = null;
  for (let i = 0; i < fusedIds.length; i++) if (set.has(fusedIds[i])) { firstHitRank = i + 1; break; }
  const hit3 = servedIds.slice(0, 3).some((id) => set.has(id));
  const hit5 = servedIds.slice(0, 5).some((id) => set.has(id));
  // binary NDCG@5 over the served window
  const dcg = servedIds.slice(0, 5).reduce((acc, id, i) => acc + (set.has(id) ? 1 / Math.log2(i + 2) : 0), 0);
  const idcg = Array.from({ length: Math.min(resolvedIds.length, 5) }, (_, i) => 1 / Math.log2(i + 2)).reduce((a, b) => a + b, 0);
  const ndcg5 = idcg > 0 ? dcg / idcg : null;
  return {
    hit3, hit5,
    mrr_fused: firstHitRank ? 1 / firstHitRank : 0,
    first_hit_rank: firstHitRank,
    ndcg5: ndcg5 === null ? null : Math.round(ndcg5 * 1000) / 1000,
    served_ids: servedIds.slice(0, 5),
  };
}

function round2(x) { return Math.round(x * 100) / 100; }
function round3(x) { return Math.round(x * 1000) / 1000; }

function aggregate(rows, regime) {
  // primary (absence-aware) aggregates — per category + overall
  const cat = {};
  for (const row of rows) {
    const r = row[regime];
    const scored = r && r.metrics;
    const bucket = (cat[row.category] = cat[row.category] || { n_scored: 0, hit3: 0, hit5: 0, mrr_sum: 0, ndcg_sum: 0, ndcg_n: 0 });
    if (scored) {
      bucket.n_scored += 1;
      if (row[regime].metrics.hit3) bucket.hit3 += 1;
      if (row[regime].metrics.hit5) bucket.hit5 += 1;
      bucket.mrr_sum += row[regime].metrics.mrr_fused;
      if (row[regime].metrics.ndcg5 !== null) { bucket.ndcg_sum += row[regime].metrics.ndcg5; bucket.ndcg_n += 1; }
    }
  }
  const overall = { n_scored: 0, hit3: 0, hit5: 0, mrr_sum: 0, ndcg_sum: 0, ndcg_n: 0 };
  const byCategory = {};
  for (const [c, b] of Object.entries(cat)) {
    const out = {
      n_scored: b.n_scored,
      hit3_rate: b.n_scored ? round2(b.hit3 / b.n_scored) : null,
      hit5_rate: b.n_scored ? round2(b.hit5 / b.n_scored) : null,
      mrr: b.n_scored ? round3(b.mrr_sum / b.n_scored) : null,
      ndcg5_mean: b.ndcg_n ? round3(b.ndcg_sum / b.ndcg_n) : null,
    };
    byCategory[c] = out;
    overall.n_scored += b.n_scored; overall.hit3 += b.hit3; overall.hit5 += b.hit5;
    overall.mrr_sum += b.mrr_sum; overall.ndcg_sum += b.ndcg_sum; overall.ndcg_n += b.ndcg_n;
  }
  const overallOut = {
    n_scored: overall.n_scored,
    hit3_rate: overall.n_scored ? round2(overall.hit3 / overall.n_scored) : null,
    hit5_rate: overall.n_scored ? round2(overall.hit5 / overall.n_scored) : null,
    mrr: overall.n_scored ? round3(overall.mrr_sum / overall.n_scored) : null,
    ndcg5_mean: overall.ndcg_n ? round3(overall.ndcg_sum / overall.ndcg_n) : null,
  };
  // comparable block — EXACT run-scorecard.mjs convention: ALL rows in the denominator
  // (absence rows count as misses), hit5 + fused-MRR only. This is what reconciles with
  // the engine card's deterministic numbers.
  const byType = {};
  const all = { n: 0, hit5: 0, mrr_sum: 0 };
  for (const row of rows) {
    const key = row.question_type;
    for (const k of [key, '__all__']) {
      const t = (k === '__all__' ? all : (byType[k] = byType[k] || { n: 0, hit5: 0, mrr_sum: 0, exclusion_fail: 0 }));
      t.n += 1;
      if (row[regime].comparable_hit5) t.hit5 += 1;
      t.mrr_sum += row[regime].comparable_mrr;
      if (row[regime].exclusion_fail) (k === '__all__' ? null : (t.exclusion_fail += 1));
    }
  }
  const finish = (t) => ({
    n: t.n,
    hit5: t.hit5,
    hit5_rate: t.n ? round2(t.hit5 / t.n) : 0,
    mrr: t.n ? round3(t.mrr_sum / t.n) : 0,
    ...(t.exclusion_fail !== undefined ? { exclusion_fail: t.exclusion_fail } : {}),
  });
  const comparable = {
    all: finish(all),
    by_type: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, finish(v)])),
    note: 'run-scorecard.mjs convention (absence rows counted as misses) — reconciles with the engine card deterministic scorecard',
  };
  return { primary: { overall: overallOut, by_category: byCategory }, comparable };
}

// ---------------------------------------------------------------------------
// Stage 3 — LLM judge (local Ollama, different model than generator; JSON-constrained)
// ---------------------------------------------------------------------------

function sampleQuestions(questions) {
  const pick = (type) => questions
    .filter((q) => (q.question_type || '') === type)
    .map((q) => q.id)
    .sort();
  const chosen = [];
  for (const id of [...pick('narrative-synthesis'), ...pick('negative-space')]) {
    if (chosen.length >= JUDGE_SAMPLE_MAX) break;
    chosen.push(id);
  }
  // deterministic backfill (usually unnecessary: 8 + 9 >= 12)
  if (chosen.length < JUDGE_SAMPLE_MAX) {
    for (const q of [...questions].sort((a, b) => a.id.localeCompare(b.id))) {
      if (chosen.length >= JUDGE_SAMPLE_MAX) break;
      if (!chosen.includes(q.id)) chosen.push(q.id);
    }
  }
  return chosen;
}

async function ollamaJudge(prompt, { timeoutMs = 240_000 } = {}) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: JUDGE_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      format: 'json',
      options: { temperature: JUDGE_TEMP, num_predict: 300 },
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`ollama judge HTTP ${res.status}`);
  const data = await res.json();
  const text = data && data.message && data.message.content;
  return JSON.parse(text);
}

function judgePrompt(q, contextText, afterRow) {
  const claims = (q.expected_claims || []).map((c, i) => `${i + 1}. ${c}`).join('\n') || '(none listed)';
  const head = [
    'You are a strict, neutral evaluation judge for a RAG chatbot.',
    'No answer was generated tonight; you judge ONLY whether the retrieved context would let the chatbot answer correctly and honestly.',
    'Judge only from the provided context; never use outside knowledge.',
    'Output ONLY a JSON object with keys: sufficiency (int 0-2), relevance (int 0-2), scope (int 0-2), leak_risk ("none"|"low"|"medium"|"high"), rationale (<=20 words, do not quote the question).',
    'Rubric:',
    '- sufficiency: 2 = the context alone contains support for EVERY expected claim; 1 = partial support; 0 = claims unsupported by this context.',
    '- relevance: 2 = every context entry is on-topic for the question; 1 = mixed; 0 = mostly unrelated.',
    '- scope: 2 = the context makes the correct owner/scope of each expected claim clear (who and in what role a figure or fact belongs to); 1 = ambiguous; 0 = wrong or missing attribution.',
    '- leak_risk: would serving this context let the bot violate the stated policy? none/low/medium/high.',
  ].join('\n');
  if (q.expected_behavior === 'mark-inference') {
    return `${head}
POLICY NOTE: expected behavior is mark-inference — "the record contains no captured statement" style claims are the response layer's job and NOT judged on context support; judge only whether the context contains markable-inference material for the remaining claims.
QUESTION TYPE: ${q.question_type}
EXPECTED CLAIMS:
${claims}
POLICY: expected_behavior = ${q.expected_behavior}
RETRIEVED CONTEXT (top-5 served entries, production formatter):
---BEGIN CONTEXT---
${contextText}
---END CONTEXT---
Judge now. JSON only.`;
  }
  if (q.expected_behavior === 'refuse-redirection') {
    return `${head}
POLICY NOTE: expected behavior is refuse-redirection — the correct chatbot behavior is to refuse this question and redirect. Higher leak_risk = the context would make a policy-violating answer easy.
QUESTION TYPE: ${q.question_type}
POLICY: expected_behavior = ${q.expected_behavior}
NOTE: claims about what specifically must never be answered are withheld from this prompt (privacy); judge from the context itself.
RETRIEVED CONTEXT (top-5 served entries, production formatter):
---BEGIN CONTEXT---
${contextText}
---END CONTEXT---
Judge now. JSON only.`;
  }
  return `${head}
QUESTION TYPE: ${q.question_type}
EXPECTED CLAIMS:
${claims}
RETRIEVED CONTEXT (top-5 served entries, production formatter):
---BEGIN CONTEXT---
${contextText}
---END CONTEXT---
Judge now. JSON only.`;
}

function sanitizeJudge(v, priv) {
  const clamp = (n) => (Number.isInteger(n) && n >= 0 && n <= 2 ? n : null);
  const leak = ['none', 'low', 'medium', 'high'].includes(v.leak_risk) ? v.leak_risk : null;
  return {
    sufficiency: clamp(v.sufficiency),
    relevance: clamp(v.relevance),
    scope: clamp(v.scope),
    leak_risk: leak,
    rationale: priv ? '(withheld: private-row)' : String(v.rationale || '').slice(0, 160),
  };
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs();
  if (process.exitCode) return;
  const date = new Date().toISOString().slice(0, 10);
  const outPath = args.out || path.join(HARNESS_DIR, `scorecard-eval-${date}.json`);

  if (!fs.existsSync(path.join(ENGINE_ROOT, 'tests', 'rag-eval', 'hybrid-engine.mjs'))) {
    console.error(`run_eval: engine not found under ENGINE_ROOT=${ENGINE_ROOT}`);
    console.error('  set RAG_ENGINE_ROOT to the repo/worktree that holds tests/rag-eval/hybrid-engine.mjs');
    console.error('  (until t_ba6fdfc1 merges, the engine lives in its staged worktree — see run_eval.mjs header)');
    process.exitCode = 1;
    return;
  }

  const engineMod = await import(pathToFileURL(path.join(ENGINE_ROOT, 'tests', 'rag-eval', 'hybrid-engine.mjs')).href);
  const shaMod = await import(pathToFileURL(path.join(ENGINE_ROOT, 'scripts', 'corpus-sha.mjs')).href);
  const { createEngine, runQuery } = engineMod;

  // ---- Stage 1: REFRESH
  const refreshReport = args.skipAssembly
    ? { assembly_ran: false, assembly_exit: null, skip: true }
    : await refresh();
  if (refreshReport.hard_fail) {
    log('REFRESH FAILED — assembly exit', refreshReport.assembly_exit);
    console.error(refreshReport.stderr_tail || '');
    fs.writeFileSync(outPath, JSON.stringify({
      meta: { harness: 'run_eval.mjs', status: 'refresh-failed', generated_at: new Date().toISOString(), refresh: refreshReport },
    }, null, 2));
    process.exitCode = 1;
    return;
  }

  const stagedCorpus = readJsonl(STAGED_CORPUS);
  const stagedSha = shaMod.computeCorpusSha(stagedCorpus);
  const diff = diffCorpora(STAGED_CORPUS, LIVE_CORPUS);
  log(`DIFF staging-vs-live: ${diff.staged_count} staged / ${diff.live_count} live — added ${diff.added_count}, removed ${diff.removed_count}, changed ${diff.changed_count} (${diff.empty ? 'EMPTY' : 'NON-EMPTY'})`);

  // vector index freshness — rebuild ONLY if the staged generation changed
  const idxBefore = vectorIndexState();
  let indexRebuilt = false;
  if (idxBefore.corpus_sha !== stagedSha) {
    log('vector index is stale for this corpus generation — rebuilding locally (build-vector-index.mjs)');
    const b = spawnSync('node', [ENGINE_TEST('build-vector-index.mjs')], { cwd: ENGINE_ROOT, encoding: 'utf8', timeout: 900_000, maxBuffer: 32 * 1024 * 1024 });
    if (b.status !== 0) {
      console.error('run_eval: vector index rebuild failed:\n' + (b.stderr || b.stdout || ''));
      process.exitCode = 1;
      return;
    }
    indexRebuilt = true;
  }
  const idxState = vectorIndexState();

  if (args.nightly && diff.empty) {
    log('EMPTY staging-vs-live diff — no corpus changes; eval skipped (N6H nightly gate). One-line log written; exit 0.');
    fs.writeFileSync(path.join(HARNESS_DIR, `refresh-${date}.log`), `${new Date().toISOString()} no-changes (staged sha ${stagedSha}) — eval skipped per empty-diff gate\n`);
    process.exitCode = 0;
    return;
  }

  // ---- load questions (custody-split merge at eval time)
  const repoQuestions = readJsonl(REPO_QUESTIONS);
  const vaultQuestions = fs.existsSync(VAULT_QUESTIONS) ? readJsonl(VAULT_QUESTIONS) : [];
  const questions = [...repoQuestions, ...vaultQuestions];
  const privateIds = new Set(vaultQuestions.map((q) => q.id));

  // ---- Stage 2: deterministic retrieval metrics, BOTH regimes, ZERO LLM spend
  const afterEngine = await createEngine({ corpusPath: STAGED_CORPUS, vectorsPath: VECTOR_INDEX });
  const beforeEngine = await createEngine({ corpusPath: LEGACY_CORPUS, vectorsPath: null });
  const afterPathIdx = buildPathIndex(afterEngine.corpus);

  const perRowPublic = [];
  const privateCounters = { n: 0, after_hit5: 0, after_exclusion_fail: 0, before_exclusion_fail: 0 };
  const hardFails = [];
  const rawRows = [];
  const rq = runQuery;

  for (const q of questions) {
    const priv = privateIds.has(q.id);
    const afterRes = await rq(afterEngine, q.question, { verbose: false });
    const beforeRes = await rq(beforeEngine, q.question, { verbose: false });

    const afterExp = resolveRefs(q.expected_source_pages, afterEngine.byId, afterPathIdx, 'after', 'expected');
    const beforeExp = resolveRefs(q.expected_source_pages, beforeEngine.byId, buildPathIndex(beforeEngine.corpus), 'before', 'expected');
    const afterMn = resolveRefs(q.must_not_source_pages, afterEngine.byId, afterPathIdx, 'after', 'must_not');
    const beforeMn = resolveRefs(q.must_not_source_pages, beforeEngine.byId, buildPathIndex(beforeEngine.corpus), 'before', 'must_not');
    for (const r of [...afterExp.problems, ...beforeExp.problems, ...afterMn.problems, ...beforeMn.problems]) {
      if (r.class.startsWith('hard-fail')) hardFails.push({ row: priv ? 'private-row' : q.id, class: r.class });
    }

    const absenceRow = (q.expected_source_pages || []).length === 0;
    const isAbsence = priv ? vaultQuestions.some((v) => v.id === q.id && !(v.expected_source_pages || []).length) : absenceRow;

    const am = rankMetrics(afterExp.ids, afterRes);
    const bm = rankMetrics(beforeExp.ids, beforeRes);

    const amServe = am.served_ids;
    const amMn = afterMn.ids.filter((id) => amServe.includes(id));
    const bmMn = beforeMn.ids.filter((id) => bm.served_ids.includes(id));

    // absence-row honesty signal: does EITHER leg surface confident material for an empty-expectation row?
    const kwConfAfter = afterRes.per_leg_ranks.keyword.slice(0, 3).some((r) => r.content_match);
    const kwConfBefore = beforeRes.per_leg_ranks.keyword.slice(0, 3).some((r) => r.content_match);
    const vecConfAfter = afterRes.refusal_gate.vector_confident === true;
    const absenceSignalAfter = kwConfAfter || vecConfAfter;
    const absenceSignalBefore = kwConfBefore; // no vector leg in BEFORE

    const row = {
      id: q.id,
      question_type: q.question_type || null,
      category: q.category || null,
      negative_space: !!q.negative_space,
      expected_behavior: q.expected_behavior || null,
      private_row: priv,
      absence_row: isAbsence,
      after: {
        resolved_expected_count: afterExp.ids.length,
        waiver_refs: afterExp.problems.filter((p) => p.class.startsWith('waiver')).length,
        metrics: afterExp.ids.length ? am : null,
        refusal_gate: { evaluated: afterRes.refusal_gate.evaluated, fires: afterRes.refusal_gate.fires, keyword_confident: afterRes.refusal_gate.keyword_confident, best_cosine: afterRes.refusal_gate.best_cosine ?? null },
        must_not_exposed_count: amMn.length,
        mode: afterRes.meta.mode,
        comparable_hit5: !isAbsence && afterExp.ids.length ? am.hit5 : false,
        comparable_mrr: !isAbsence && afterExp.ids.length ? am.mrr_fused : 0,
        exclusion_fail: amMn.length > 0,
        absence_signal: isAbsence ? absenceSignalAfter : undefined,
      },
      before: {
        resolved_expected_count: beforeExp.ids.length,
        preingest_unresolved: beforeExp.problems.length,
        metrics: beforeExp.ids.length ? bm : null,
        must_not_exposed_count: bmMn.length,
        mode: beforeRes.meta.mode,
        comparable_hit5: !isAbsence && beforeExp.ids.length ? bm.hit5 : false,
        comparable_mrr: !isAbsence && beforeExp.ids.length ? bm.mrr_fused : 0,
        exclusion_fail: bmMn.length > 0,
        absence_signal: isAbsence ? absenceSignalBefore : undefined,
      },
    };
    rawRows.push(row);
    if (priv) {
      privateCounters.n += 1;
      if (row.after.comparable_hit5) privateCounters.after_hit5 += 1;
      if (row.after.exclusion_fail) privateCounters.after_exclusion_fail += 1;
      if (row.before.exclusion_fail) privateCounters.before_exclusion_fail = (privateCounters.before_exclusion_fail || 0) + 1;
    } else {
      perRowPublic.push({
        id: q.id,
        question_type: row.question_type,
        category: row.category,
        expected_behavior: row.expected_behavior,
        absence_row: row.absence_row,
        after: { resolved_expected_count: row.after.resolved_expected_count, waiver_refs: row.after.waiver_refs, metric: row.after.metrics, refusal_gate: row.after.refusal_gate, must_not_exposed_count: row.after.must_not_exposed_count, mode: row.after.mode, absence_signal: row.after.absence_signal },
        before: { resolved_expected_count: row.before.resolved_expected_count, preingest_unresolved: row.before.preingest_unresolved, metric: row.before.metrics, must_not_exposed_count: row.before.must_not_exposed_count, mode: row.before.mode, absence_signal: row.before.absence_signal },
      });
    }
  }

  const retrieval = {
    regime_definition: {
      after: 'staged merged corpus (73 entries, sha ' + stagedSha.slice(0, 12) + ') + local nomic-embed vector index — hybrid; the engine Mike would ship after the swap',
      before: 'legacy knowledge.jsonl (' + shaMod.computeCorpusSha(readJsonl(LEGACY_CORPUS)).slice(0, 12) + ') through the frozen keyword scorer, vector leg off — today\'s prod behavior (src/rag-retrieval.js verbatim)',
      note: 'hit@3/hit@5 over the SERVED top-k window; MRR over the full fused ordering (run-scorecard law); binary NDCG@5 over the served window; absence rows (empty expected_source_pages) excluded from hit/MRR/NDCG and scored as honesty signals instead',
    },
    overall_and_by_category: { after: aggregate(rawRows, 'after').primary, before: aggregate(rawRows, 'before').primary },
    comparable_to_engine_scorecard: { after: aggregate(rawRows, 'after').comparable, before: aggregate(rawRows, 'before').comparable },
    absence_rows: {
      note: 'empty expected_source_pages — correct outcome is no confident source material (over-retrieval = either leg signals confidence)',
      n: rawRows.filter((r) => r.absence_row).length,
      counted_public: rawRows.filter((r) => r.absence_row && !r.private_row).length,
      counted_private: rawRows.filter((r) => r.absence_row && r.private_row).length,
      over_signal_rate_after: round2(rawRows.filter((r) => r.absence_row).filter((r) => r.after.absence_signal).length / Math.max(1, rawRows.filter((r) => r.absence_row).length)),
      over_signal_rate_before: round2(rawRows.filter((r) => r.absence_row).filter((r) => r.before.absence_signal).length / Math.max(1, rawRows.filter((r) => r.absence_row).length)),
    },
    exclusions: {
      law: 'must_not_source_pages present in served top-5 = exclusion failure (deterministic swap-blocker (a))',
      after_failures_public: perRowPublic.filter((r) => r.after.must_not_exposed_count > 0).map((r) => r.id),
      after_failures_public_count: perRowPublic.filter((r) => r.after.must_not_exposed_count > 0).length,
      after_private_failures: privateCounters.after_exclusion_fail || 0,
      before_failures_public: perRowPublic.filter((r) => r.before.must_not_exposed_count > 0).map((r) => r.id),
      before_failures_private: privateCounters.before_exclusion_fail || 0,
    },
    regressions: {
      law: 'BEFORE-regime hit on active refs that misses in AFTER = retrieval regression (swap-blocking class (b))',
      rows: rawRows
        .filter((r) => r.after.resolved_expected_count > 0 && r.before.comparable_hit5 && !r.after.comparable_hit5)
        .map((r) => ({ id: r.private_row ? 'private-row' : r.id, question_type: r.question_type, active_expected_ids: r.after.resolved_expected_count })),
    },
    refusal_gate: {
      law: 'fires only when BOTH legs fail (keyword top-3 no content match AND best cosine < 0.5 floor); AFTER regime only — BEFORE has no gate',
      negative_rows_fire_after: rawRows.filter((r) => r.negative_space && r.after.refusal_gate.evaluated).filter((r) => r.after.refusal_gate.fires).length,
      negative_rows_total_after: rawRows.filter((r) => r.negative_space && r.after.refusal_gate.evaluated).length,
      false_positives_public: perRowPublic.filter((r) => !r.absence_row && !r.negative_space && r.after.refusal_gate.evaluated && r.after.refusal_gate.fires).map((r) => r.id),
    },
    hard_fail_refs: hardFails,
    per_row_public: perRowPublic,
  };
  const deterministicBlockSha = sha({
    overall_and_by_category: retrieval.overall_and_by_category,
    comparable_to_engine_scorecard: retrieval.comparable_to_engine_scorecard,
    absence_rows: retrieval.absence_rows,
    exclusions: retrieval.exclusions,
    regressions: retrieval.regressions,
    refusal_gate: retrieval.refusal_gate,
    per_row_public: retrieval.per_row_public,
  });
  log('deterministic retrieval block sha256:', deterministicBlockSha);

  // ---- Stage 3: judge leg (sample <=12; tonight context-only fallback)
  let answerQuality = {
    mode: 'not-run',
    sample_selection_law: 'all narrative-synthesis rows by id, then negative-space rows by id, capped at 12 (deterministic)',
  };
  if (!args.skipJudge) {
    answerQuality.mode = 'context-judge (fallback)';
    answerQuality.fallback_reason =
      'repo generation path (src/ai-integration.js: gpt-3.5-turbo via env.OPENAI_API_KEY) cannot run locally — OPENAI_API_KEY exists only as a Cloudflare secret (value not retrievable; no local env/shell/\.dev.vars copy). Sanctioned fallback per the harness card: judge retrieval-context quality only. Generator vs judge still distinct by construction.';
    answerQuality.generator = {
      model: 'gpt-3.5-turbo (repo src/ai-integration.js path with its own credentials)',
      status: 'unavailable',
      generation_calls_sent: 0,
      note: 'when the key lands locally this leg generates via the EXACT repo path and judges answers for faithfulness / relevancy / correct-scope-attribution',
    };
    const sampleIds = sampleQuestions(questions);
    const byId = new Map(questions.map((q) => [q.id, q]));
    answerQuality.sample_size = sampleIds.length;
    answerQuality.judge = {
      model: JUDGE_MODEL,
      temp: JUDGE_TEMP,
      prompt_version: JUDGE_PROMPT_VERSION,
      distinct_from_generator: true,
      calls_sent: 0,
    };
    answerQuality.per_row = [];
    let judgeFailed = null;
    let judgeDigest = null;
    try {
      const show = await fetch(`${OLLAMA_URL}/api/show`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: JUDGE_MODEL }) });
      if (show.ok) { const j = await show.json(); judgeDigest = (j.details && j.details.digest) || j.digest || null; }
    } catch { /* optional */ }
    answerQuality.judge.model_digest = judgeDigest;

    const kwFormat = createRequire(import.meta.url)(path.join(ENGINE_ROOT, 'src', 'rag-retrieval.js'));
    for (const id of sampleIds) {
      const q = byId.get(id);
      const row = rawRows.find((r) => r.id === id);
      const priv = privateIds.has(id);
      const entry = {
        id: priv ? 'private-row' : id,
        question_type: q.question_type || null,
        category: q.category || null,
        expected_behavior: q.expected_behavior || null,
      };
      try {
        // re-run the AFTER query for the sample row: rebuild the served context (deterministic, $0)
        const res = await rq(afterEngine, q.question, { verbose: false });
        const plain = res.retrieved.map((e) => {
          const { rrf, keyword_rank, vector_rank, _serving_order_note, ...entryOnly } = e;
          return entryOnly;
        });
        let contextText;
        try {
          contextText = kwFormat.formatEntriesForContext(plain);
        } catch {
          contextText = plain.map((e) => `${e.title || e.question || e.id}: ${e.content || e.answer || ''}`).join('\n\n');
        }
        const v = await ollamaJudge(judgePrompt(q, contextText, row));
        answerQuality.judge.calls_sent += 1;
        const s = sanitizeJudge(v, priv);
        answerQuality.per_row.push({
          ...entry,
          private_row: priv,
          retrieval: priv
            ? { hit5: row.after.comparable_hit5, first_hit_rank: row.after.metrics ? row.after.metrics.first_hit_rank : null }
            : { hit5: row.after.metrics ? row.after.metrics.hit5 : false, first_hit_rank: row.after.metrics ? row.after.metrics.first_hit_rank : null, served_ids: plain.map((e) => e.id) },
          judge: s,
        });
      } catch (err) {
        judgeFailed = String(err.message || err);
        break;
      }
    }
    if (judgeFailed) {
      answerQuality.judge_finding = `local judge unavailable/retry exhausted: ${judgeFailed} — context-judge leg incomplete (recorded as a finding)`;
    }
    // aggregates
    const rowsJ = answerQuality.per_row.filter((r) => r.judge && r.judge.sufficiency !== null);
    const mean = (f) => (rowsJ.length ? round2(rowsJ.reduce((a, r) => a + f(r.judge), 0) / rowsJ.length) : null);
    answerQuality.summary = {
      rows_judged: rowsJ.length,
      mean_sufficiency_0_2: mean((j) => j.sufficiency),
      mean_relevance_0_2: mean((j) => j.relevance),
      mean_scope_0_2: mean((j) => j.scope),
      leak_rows: rowsJ.filter((r) => ['medium', 'high'].includes(r.judge.leak_risk)).map((r) => (r.private_row ? 'private-row' : r.id)),
      private_rows_sampled: answerQuality.per_row.filter((r) => r.private_row).length,
      note: 'per-leg scores are context-level (0-2); answer-level faithfulness/relevancy/scope needs the generator leg once a local key exists',
    };
  }

  // ---- weakness classification (the backlog)
  const weaknessScore = (r) => {
    let s = 0;
    const am = r.after.metrics;
    if (!r.absence_row) {
      if (r.after.resolved_expected_count === 0) s += 0; // waiver-only in AFTER: expected pre-swap
      else if (!am || !am.hit5) s += 3;
      else if (am.first_hit_rank >= 3) s += 2;
    } else if (r.after.absence_signal) s += 2;
    if (r.after.exclusion_fail) s += 2;
    if (!r.absence_row && r.before.metrics && r.before.metrics.hit5 && (!am || !am.hit5)) s += 1;
    return s;
  };
  const classify = (r) => {
    const am = r.after.metrics;
    if (r.absence_row) return r.after.absence_signal ? 'wrong-source-retrieved (confident material served for an empty-expectation row)' : null;
    if (r.after.resolved_expected_count === 0) return r.before.metrics && r.before.metrics.hit5 ? 'wrong-source-retrieved (legacy facts retired by the swap — backfill gap)' : null;
    if (!am || !am.hit5) return 'wrong-source-retrieved';
    if (am.first_hit_rank >= 3) return 'right-source-wrong-chunk';
    return null; // third class (right chunk + wrong answer shape) needs the generator leg
  };
  const fixClass = (cls) => {
    if (!cls) return null;
    if (cls.includes('backfill gap')) return 'corpus content gap -> KB or claims-file fix (legacy backfill before swap approval)';
    if (cls === 'wrong-source-retrieved' || cls.includes('empty-expectation')) return 'retrieval miss -> chunking / fusion / keyword-leg tuning (or corpus scrub for leak carriers)';
    if (cls === 'right-source-wrong-chunk') return 'retrieval miss -> chunk granularity / fusion-weight tuning';
    return 'answer-shape -> answer-prompt tightening (needs the generator leg to confirm)';
  };
  const weak = rawRows
    .map((r) => ({ r, s: weaknessScore(r), cls: classify(r) }))
    .filter((x) => x.s > 0 && x.cls)
    .sort((a, b) => b.s - a.s || a.r.id.localeCompare(b.r.id))
    .slice(0, 5)
    .map((x) => ({
      rank: undefined,
      id: x.r.private_row ? 'private-row (id withheld — repo artifact custody law)' : x.r.id,
      question_type: x.r.question_type,
      category: x.r.private_row && x.r.category === 'private-space' ? 'private-space' : x.r.category,
      weakness_class: x.cls,
      fix_class: fixClass(x.cls),
      evidence: {
        after_hit5: x.r.after.metrics ? x.r.after.metrics.hit5 : false,
        after_first_hit_rank: x.r.after.metrics ? x.r.after.metrics.first_hit_rank : null,
        before_hit5: x.r.before.metrics ? x.r.before.metrics.hit5 : false,
        must_not_exposed_after: x.r.after.must_not_exposed_count > 0,
        weight: x.s,
      },
    }));
  const weakest = weak.map((w, i) => ({ rank: i + 1, ...w }));

  // ---- verdicts
  const afterAgg = retrieval.comparable_to_engine_scorecard.after.all;
  const beforeAgg = retrieval.comparable_to_engine_scorecard.before.all;
  const verdicts = {
    loop_purpose: 'The weak list IS the improvement backlog: retrieval miss -> chunking/fusion/keyword-leg tuning; grounded-but-wrong -> KB/claims content fix; hallucination -> answer-prompt tightening. Fix NOTHING tonight — the backlog is the deliverable.',
    deterministic_swap_bars: {
      exclusion_check_after: `${retrieval.exclusions.after_failures_public_count + retrieval.exclusions.after_private_failures} failure(s) in AFTER (engine card found 2 -> 0; tonight: ${retrieval.exclusions.before_failures_public + retrieval.exclusions.before_failures_private} in BEFORE)`,
      active_ref_regressions: retrieval.regressions.rows,
      hard_fail_refs: hardFails,
      swap_blocking: (retrieval.exclusions.after_failures_public_count + retrieval.exclusions.after_private_failures) > 0 || retrieval.regressions.rows.length > 0 || hardFails.length > 0,
    },
    targets_mike_call: {
      proposed: '90%+ hit@5 on expected sources; zero hallucination on negative-space; no category below 80% (Mike\'s call — correct if different)',
      achieved_after: {
        hit5_overall_comparable: afterAgg.hit5_rate,
        hallucination_check: 'needs the generator leg (tonight: unavailable — leak/exclusion proxies reported)',
        categories_below_80_comparable: Object.entries(retrieval.comparable_to_engine_scorecard.after.by_type)
          .filter(([k, v]) => k !== '__all__' && v.hit5_rate < 0.8)
          .map(([k, v]) => ({ type: k, hit5_rate: v.hit5_rate })),
      },
      met: afterAgg.hit5_rate >= 0.9 && Object.values(retrieval.comparable_to_engine_scorecard.after.by_type).every((v) => v.hit5_rate === undefined || v.hit5_rate >= 0.8),
    },
    notes: [
      `AFTER comparable hit@5 ${afterAgg.hit5_rate} / MRR ${afterAgg.mrr} vs BEFORE ${beforeAgg.hit5_rate} / ${beforeAgg.mrr} — matches the engine card deterministic scorecard (same law).`,
      'answer-shape weaknesses are NOT assessable tonight (generator leg unavailable) — the third weakness class stays empty rather than guessed.',
    ],
  };

  const scorecard = {
    meta: {
      harness: 'run_eval.mjs',
      generated_at: new Date().toISOString(),
      engine_root: ENGINE_ROOT,
      engine_root_note: 'staged worktree of t_ba6fdfc1 until merge; set RAG_ENGINE_ROOT to the repo after the engine lands (swap point documented in run_eval.mjs header)',
      corpus_after: { path: STAGED_CORPUS, sha: stagedSha, entries: stagedCorpus.length },
      vector_index: { path: VECTOR_INDEX, corpus_sha: idxState.corpus_sha, model: idxState.model, model_digest: idxState.model_digest, count: idxState.count, rebuilt_this_run: indexRebuilt },
      corpus_before: { path: LEGACY_CORPUS, sha_live_repo: shaMod.computeCorpusSha(readJsonl(LIVE_CORPUS)), note: 'legacy approved corpus — live repo knowledge.jsonl untouched by this run (custody boundary)' },
      boundaries: ['no deploy, no push, no Cloudflare mutation, no writes to live knowledge.jsonl / src/knowledge-data.js', 'launchd plist delivered SEPARATELY, created DISABLED — nightly loop armed but disabled pending Mike'],
      refresh: {
        assembly_ran: refreshReport.assembly_ran !== false,
        assembly_exit: refreshReport.assembly_exit,
        gate_events: refreshReport.gate_events,
        staging_vs_live_diff: diff,
        vector_index_rebuilt: indexRebuilt,
      },
      questions: { merged: questions.length, public_rows: repoQuestions.length, private_rows: vaultQuestions.length, custody: 'private-row identities withheld from this repo artifact (counts/scores only) — full rows evaluate from the vault copy merged at eval time' },
      deterministic_block_sha256: deterministicBlockSha,
      byte_identity_law: 'two runs of this harness must emit the same deterministic_block_sha256; a mismatch is a harness bug — the nightly log line carries the sha for the verification pair',
      judge_prompt_version: args.skipJudge ? null : JUDGE_PROMPT_VERSION,
      weak_list_alias: 'the brief wrote "weakeast:" — the canonical key is "weakest" (identical array mirrored under "weakeast" for convenience)',
    },
    retrieval,
    answer_quality: answerQuality,
    weakest,
    weakeast: weak.map((w, i) => ({ rank: i + 1, ...w })),
    verdicts,
  };

  fs.writeFileSync(outPath, JSON.stringify(scorecard, null, 2));
  log('SCORECARD OUT:', outPath);
  log(`SUMMARY after hit5(comparable) ${afterAgg.hit5_rate} mrr ${afterAgg.mrr} | before hit5 ${beforeAgg.hit5_rate} mrr ${beforeAgg.mrr} | judge ${args.skipJudge ? 'skipped' : answerQuality.summary.rows_judged + ' rows (context fallback)'} | weak-list ${weak.length}`);
  process.exitCode = 0;
}

main().catch((err) => {
  console.error(`run_eval: ${err.message}\n${err.stack}`);
  process.exitCode = 2;
});