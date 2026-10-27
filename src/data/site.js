/* Case-study content and drawn figures for the portfolio. Facts come from the résumé; the WHY lines are drafts to rewrite in your voice. */

export const CASES = [
  {
    slug: 'order-notes-summarizer',
    title: 'Order notes summarizer',
    org: 'Mindstix · US luxury furniture brand',
    year: '2025',
    role: 'Software Developer',
    kind: 'Production agent',
    lede: 'Reviewers read long order notes by hand. I replaced that with an LLM summarization agent, then rebuilt how its requests travel so every tier keeps moving.',
    stack: ['AWS Bedrock AgentCore', 'Strands Agents', 'Claude Sonnet 4.6', 'SSE streaming', 'Keycloak OAuth2'],
    diagrams: [
      { key: 'notes-system', title: 'Where the summarizer sits', caption: 'The centralized order notes system: the app and service the associate uses, and the summarizer agent it calls.', hero: ['Notes Summarizer'] },
      { key: 'order-notes-runtime', title: 'Inside the agent', caption: 'One request through the AgentCore runtime: fetch and rank the notes, cache them, and stream the summary from a Strands agent on Bedrock.', hero: ['Strands Agent'] }
    ],
    fig: { n: '43', u: '%', cap: 'Faster average generation time, from about 35 seconds to about 20.' },
    problem: 'The first version answered only when the whole summary was ready, and three tiers each waited on the one below, so every tier depended on the one beneath it.',
    approach: [
      'Rebuilt the request lifecycle around SSE streaming, so the first words reach the user while the model is still writing.',
      'Replaced the three-tier timeout chain with one streamed response, so every hop keeps moving on its own.',
      'Ran it in two production regions on shared Keycloak and OAuth.'
    ],
    out: [['2', 'production regions'], ['35 s to ~20 s', 'average generation time, measured'], ['SSE', 'streaming replaced the three-tier wait']],
    thumb: 'trace'
  },
  {
    slug: 'presentation-agent',
    title: 'Presentation agent',
    org: 'Mindstix · US luxury furniture brand',
    year: '2026',
    role: 'Engineer: technical design, architecture and build',
    kind: 'Agentic workflow',
    lede: 'A designer spends a long day building each client presentation by hand in InDesign. I designed an agent that turns a project ID into a finished, brand-compliant deck, and I am building it.',
    stack: ['Python', 'AWS Bedrock AgentCore', 'Strands Agents', 'Amazon Bedrock', 'Amazon S3', 'AWS Secrets Manager', 'Adobe InDesign (IDML)', 'Salesforce'],
    timeSaved: { handLow: 14, handHigh: 16, agentLow: 1, agentHigh: 2, buildMin: 10 },
    diagrams: [
      { key: 'presentation-agent', title: 'From a project ID to a deck', caption: 'The agent pipeline: fetch and prepare the project, validate it, plan the pages, assemble and fill them, validate the output and publish to S3.', hero: ['run_agent'] }
    ],
    fig: { n: '90', u: '%', cap: 'Less time to a professional client presentation: about 14 to 16 hours by hand, 1 to 2 hours with the agent.' },
    problem: 'A designer needs about 14 to 16 hours to build one professional client presentation by hand in Adobe InDesign, from the brand’s templates. Every room gets its own section, with product images, labels and dimensions taken from Salesforce, and a large project runs to 100+ pages. It is detailed, repetitive work, and the brand rules call for precision.',
    approach: [
      'The entrypoint takes a project ID and loads its settings from an AgentCore Config Bundle. It waits until the configuration is ready, rather than guessing.',
      'Fetch and prepare validates the input, then reads rooms, products and the cover from Salesforce. Image URLs come from the e-commerce catalog with a built-in safety switch, and the credentials for both sit in Secrets Manager.',
      'Images resolve through a chain: the e-commerce catalog first, then Salesforce, then a clear placeholder.',
      'Pre-assembly rules validate the data. In strict mode, the run continues only once every rule passes.',
      'The brand’s IDML templates and their layout cards are read from S3. Products are classified by category, and deterministic page plans are produced and ranked.',
      'A Strands agent on Amazon Bedrock only picks the plan and the hero. The deterministic choice is always ready as the fallback.',
      'Pages are assembled by cloning spreads onto the deck frame, then filled with the cover, images and captions. Output validation checks the IDML structure and the brand rules, and anything that needs refining is rechecked, up to three times, until it passes.',
      'The finished IDML is published to S3 with a manifest: the pages, a report and a sha256.'
    ],
    decisionsTitle: 'Decisions I made',
    decisions: [
      'The InDesign API takes inputs from an allowlist of storage providers through pre-signed URLs, and Google Drive and the client’s own domain sit outside it. I compared six storage options and designed a Drive to S3 staging layer: $0 in added licensing, approvals kept inside the client’s AWS account, and the work moving without waiting on an approval queue.',
      'I chose Strands on its own over LangGraph plus Strands: the pipeline is close to linear, and the Strands session manager with AgentCore Memory already gives checkpoint and resume.',
      'The workflow has nine states, checkpointed at every transition and after every room, so an interrupted run resumes from the last completed room.',
      'Five external systems sit behind AgentCore Gateway so the agent discovers its tools at startup. Each service has one secret and one cached OAuth2 token provider that refreshes under a lock.',
      'Rooms vary in SKU count but template slots are fixed. I compared three layout strategies and recommended capacity-tier templates with a resolver, the layout cards above: no custom layout code, and layouts stay clean by design.'
    ],
    out: [['10 min', 'for the agent to build the deck'], ['1 to 2 h', 'in total, with designer review'], ['100+', 'pages in a large project deck']],
    thumb: 'deck'
  },
  {
    slug: 'csr-rep-copilot',
    title: 'CSR rep copilot',
    org: 'Mindstix · Insurance agency',
    year: '2025',
    role: 'Software Developer',
    kind: 'Proof of concept',
    lede: 'Live suggestions for reps on a call, and claim verdicts that cite their evidence so an auditor can check them.',
    stack: ['Amazon Connect', 'Flask + Socket.IO', 'OpenAI gpt-4o', 'Milvus', 'MongoDB', 'React on Firebase'],
    diagrams: [
      { key: 'csr-copilot', title: 'How it fits together', caption: 'Contact events from Amazon Connect reach a Flask Socket.IO API; policies are searched in Milvus and the answer is written by OpenAI.', hero: ['Q&A API'] }
    ],
    fig: { n: 'Live', u: '', cap: 'Suggestions arrive while the customer is still talking.' },
    problem: 'A rep on a live call needs answers while the customer is still talking, and an auditor needs to see the evidence behind every verdict.',
    approach: [
      'Streamed contact events from Amazon Connect into a Flask Socket.IO API, with the rep signed in through Google Identity.',
      'Embedded the conversation with ada-002 and searched the policy documents in Milvus, so each suggestion comes from the insurer’s own text.',
      'gpt-4o writes the suggestion for the rep’s screen; chats and sessions are kept in MongoDB and traces go to Jaeger.',
      'Made every AI claim verdict cite the passages it used, so an auditor can follow it back.'
    ],
    out: [['Live', 'suggestions on the call'], ['Cited', 'evidence on every verdict'], ['PoC', 'proof of concept']],
    thumb: 'call'
  },
  {
    slug: 'rca-multi-agent-system',
    title: 'RCA multi-agent system',
    org: 'Mindstix',
    year: '2025',
    role: 'Software Developer',
    kind: 'Multi-agent system',
    lede: 'Five agents pass a production issue to each other until a root-cause document comes out the other end.',
    stack: ['AWS Bedrock AgentCore', 'CloudWatch', 'GitHub MCP', 'S3'],
    fig: { n: '5', u: '', cap: 'Agents, each with one job, one tool and one hand-off.' },
    problem: 'When production needs attention, someone reads logs, checks recent changes, searches for known fixes and writes it all up. Most of that is reading and cross-checking, which agents do well if each one stays in its lane.',
    approach: [
      'Observer reads the CloudWatch logs and spots the spike. Analyzer finds the pattern behind it.',
      'A code agent checks recent changes in GitHub over MCP. A web search agent looks for known fixes outside the building.',
      'Finalizer writes the root-cause document and files it to S3.'
    ],
    out: [['3', 'places it looks: logs, code and the web'], ['1', 'document, filed to S3'], ['MCP', 'how it reads GitHub changes']],
    diagrams: [
      { key: 'rca', title: 'Five agents, one hand-off at a time', caption: 'Each agent has one job. Logs, GitHub and the web feed three of them, and the Finalizer files the root-cause document.', hero: ['Finalizer'] }
    ],
    thumb: 'five'
  },
  {
    slug: 'promotions-sku-portal',
    title: 'Promotions portal and SKU management',
    org: 'Mindstix · FMCG client',
    year: '2025',
    role: 'Software Developer',
    kind: 'Full-stack features',
    lede: 'Full-stack features for an FMCG client’s promotions portal and SKU management system, turning business requirements into production-ready React and Node.js components.',
    stack: ['React 18', 'Node.js', 'NestJS', 'TypeScript'],
    archTitle: 'How a request becomes a feature',
    diagrams: [
      { key: 'promo', title: 'From a business request to production', caption: 'An illustration of the delivery flow: a request is planned, built as a portal screen and a service, checked, shipped, and fed back by support.', hero: ['Node.js + NestJS'] }
    ],
    fig: { n: '2', u: '', cap: 'Systems I delivered features for: a promotions portal and a SKU management system.' },
    problem: 'Business teams needed changes to their promotions and SKU tooling. Each request arrived as a business need and had to become something a team could build, test and support.',
    approach: [
      'Translated business requirements into scalable, production-ready components in React 18 and Node.js.',
      'Worked through every phase: requirement analysis, development, deployment and post-production support.',
      'Debugged and optimized in production in real time, to keep the applications stable and fast.',
      'Worked inside Agile and Scrum teams: sprint planning, estimations and code reviews.'
    ],
    out: [['2', 'systems: promotions and SKU management'], ['React 18', 'front end'], ['SDLC', 'from requirement to production support']],
    thumb: 'promo'
  },
  {
    slug: 'vidhaanai',
    title: 'VidhaanAI',
    org: 'Personal platform',
    year: '2025',
    role: 'Design and build',
    kind: 'Orchestration platform',
    lede: 'My own LLM platform for legal document analysis: hybrid retrieval, conversation memory and four agent roles, measured against a benchmark instead of a feeling.',
    stack: ['Python', 'LangChain', 'React', 'Node.js', 'OpenAI', 'Redis'],
    archTitle: 'How it fits together',
    diagrams: [
      { key: 'vidhaan', title: 'A question, end to end', caption: 'A reader’s question travels through the API to the orchestrator, which retrieves from the documents, keeps conversation memory and calls the model. An eval harness scores the answers.', hero: ['LangChain orchestrator'] }
    ],
    fig: { n: '26', u: '%', cap: 'Hallucination rate on a 50-query benchmark, down from about 40%.' },
    problem: 'I wanted a chatbot that keeps context, answers from the document, retrieves the right passage and can show it is getting better.',
    approach: [
      'Hybrid retrieval: semantic and keyword search together, so each strengthens the other.',
      'Conversation memory kept outside the model, so long sessions stay coherent.',
      'Four agent roles, and a small evaluation set to prove each change helped.'
    ],
    out: [['4', 'agent roles'], ['20+', 'concurrent sessions'], ['50', 'queries in the benchmark']],
    thumb: 'vidhaan'
  },
  {
    slug: 'stock-predictor',
    title: 'Stock Predictor',
    org: 'Personal project',
    year: '2024',
    role: 'Design and build',
    kind: 'Time-series model',
    lede: 'An LSTM with attention that forecasts a stock, trained and run end to end in a notebook.',
    stack: ['Python', 'TensorFlow', 'scikit-learn', 'Google Colab'],
    archTitle: 'The model',
    diagrams: [
      { key: 'stock', title: 'From price history to a forecast', caption: 'Prices are windowed, passed through LSTM layers and attention to a trend call; evaluation feeds back into preprocessing.', hero: ['Attention'] }
    ],
    fig: { n: '12', u: '%', cap: 'Improvement in accuracy from the LSTM model, with MSE and MAPE down 10% after tuning preprocessing and evaluation.' },
    problem: 'Stock prices move in layered patterns, so I wanted to see how far attention over a longer window would go.',
    approach: [
      'LSTM layers to carry the sequence, with attention to weight the days that mattered.',
      'Optimized the preprocessing and evaluation pipelines, which cut MSE and MAPE by 10%.',
      'Trained and evaluated in one notebook so every step can be rerun.'
    ],
    out: [['12%', 'improvement in accuracy'], ['10%', 'lower MSE and MAPE'], ['LSTM', 'with attention']],
    thumb: 'stock'
  },
  {
    slug: 'ratna',
    title: 'Ratna',
    org: 'Personal project',
    year: '2024',
    role: 'Design and build',
    kind: 'Front-end foundations',
    lede: 'A storefront demo in plain HTML, CSS and JavaScript, built to show that the browser fundamentals are solid.',
    stack: ['HTML5', 'CSS3', 'JavaScript (ES6)'],
    fig: { n: '12', u: '', cap: 'Products in the demo storefront, rendered and updated live in the DOM with plain JavaScript.' },
    problem: 'I wanted a project that shows the browser fundamentals up close, in plain HTML, CSS and JavaScript.',
    approach: [
      'Split the logic into small modules with one job each.',
      'Handled state and DOM updates by hand, so interaction stays responsive.',
      'Kept the page responsive using only plain CSS and JavaScript.'
    ],
    out: [['12', 'products, rendered live'], ['ES6', 'modules'], ['Plain', 'HTML, CSS and JavaScript']],
    thumb: 'ratna'
  }
];

/* Drawn thumbnails for work that has no shareable screens (enterprise work). One graphic language. */
export const DRAWN = {
  vidhaan: '<svg viewBox="0 0 320 220" role="img" aria-label="A question flowing through an orchestrator with retrieval above and below"><rect width="320" height="220" fill="#0b0d12"/><path d=\"M70 110H128M192 110H250M160 82V44M160 138V176\" stroke=\"#f0ede4\" stroke-opacity=\".3\" stroke-width=\"3\"/><circle cx=\"50\" cy=\"110\" r=\"20\" fill=\"none\" stroke=\"#f0ede4\" stroke-opacity=\".5\" stroke-width=\"3\"/><circle cx=\"270\" cy=\"110\" r=\"20\" fill=\"none\" stroke=\"#f0ede4\" stroke-opacity=\".5\" stroke-width=\"3\"/><circle cx=\"160\" cy=\"110\" r=\"30\" fill=\"#ffb020\"/><rect x=\"132\" y=\"22\" width=\"56\" height=\"22\" rx=\"11\" fill=\"#f0ede4\" fill-opacity=\".16\"/><rect x=\"132\" y=\"176\" width=\"56\" height=\"22\" rx=\"11\" fill=\"#f0ede4\" fill-opacity=\".16\"/></svg>',
  stock: '<svg viewBox="0 0 320 220" role="img" aria-label="A price line with an amber forecast tail"><rect width="320" height="220" fill="#0b0d12"/><path d=\"M30 150L70 128L110 150L150 98L190 120L230 80\" fill=\"none\" stroke=\"#f0ede4\" stroke-opacity=\".55\" stroke-width=\"3\" stroke-linejoin=\"round\"/><path d=\"M230 80L290 46\" fill=\"none\" stroke=\"#ffb020\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"290\" cy=\"46\" r=\"9\" fill=\"#ffb020\"/><path d=\"M30 186H290\" stroke=\"#f0ede4\" stroke-opacity=\".2\" stroke-width=\"2\"/></svg>',
  ratna: '<svg viewBox="0 0 320 220" role="img" aria-label="Three small modules feeding one lit square"><rect width="320" height="220" fill="#0b0d12"/><g fill=\"#f0ede4\" fill-opacity=\".16\"><rect x=\"40\" y=\"40\" width=\"130\" height=\"34\" rx=\"10\"/><rect x=\"40\" y=\"92\" width=\"130\" height=\"34\" rx=\"10\"/><rect x=\"40\" y=\"144\" width=\"130\" height=\"34\" rx=\"10\"/></g><path d=\"M170 57H210M170 109H210M170 161H210\" stroke=\"#f0ede4\" stroke-opacity=\".35\" stroke-width=\"3\"/><rect x=\"210\" y=\"70\" width=\"70\" height=\"80\" rx=\"12\" fill=\"#ffb020\"/></svg>',
  promo: '<svg viewBox="0 0 320 220" role="img" aria-label="Two cards feeding one service"><rect width="320" height="220" fill="#0b0d12"/><g fill=\"#f0ede4\" fill-opacity=\".16\"><rect x=\"40\" y=\"38\" width=\"120\" height=\"62\" rx=\"12\"/><rect x=\"40\" y=\"120\" width=\"120\" height=\"62\" rx=\"12\"/></g><path d=\"M160 69H190V110M160 151H190V110\" fill=\"none\" stroke=\"#f0ede4\" stroke-opacity=\".35\" stroke-width=\"3\"/><rect x=\"200\" y=\"70\" width=\"80\" height=\"80\" rx=\"12\" fill=\"#ffb020\"/><g fill=\"#0b0d12\" fill-opacity=\".55\"><rect x=\"214\" y=\"88\" width=\"52\" height=\"8\" rx=\"4\"/><rect x=\"214\" y=\"106\" width=\"36\" height=\"8\" rx=\"4\"/></g></svg>',
  deck: '<svg viewBox="0 0 320 220" role="img" aria-label="A stack of deck pages with the last one lit"><rect width="320" height="220" fill="#0b0d12"/><g fill="#f0ede4" fill-opacity=".14"><rect x="58" y="50" width="110" height="136" rx="10"/><rect x="96" y="38" width="110" height="136" rx="10"/><rect x="134" y="26" width="110" height="136" rx="10"/></g><rect x="172" y="14" width="110" height="136" rx="10" fill="#ffb020"/><g fill="#0b0d12" fill-opacity=".55"><rect x="188" y="34" width="78" height="46" rx="6"/><rect x="188" y="92" width="50" height="8" rx="4"/><rect x="188" y="108" width="64" height="8" rx="4"/></g></svg>',
  trace: '<svg viewBox="0 0 320 220" role="img" aria-label="Two request lanes: three waiting tiers above, one streamed response below"><rect width="320" height="220" fill="#0b0d12"/><g fill="#f0ede4" fill-opacity=".22"><rect x="24" y="52" width="86" height="14" rx="7"/><rect x="118" y="52" width="86" height="14" rx="7"/><rect x="212" y="52" width="84" height="14" rx="7"/></g><rect x="24" y="118" width="170" height="14" rx="7" fill="#ffb020"/><circle cx="194" cy="125" r="9" fill="#ffb020"/><g fill="#f0ede4" fill-opacity=".5"><rect x="24" y="168" width="34" height="3"/><rect x="24" y="178" width="22" height="3"/></g></svg>',
  five: '<svg viewBox="0 0 320 220" role="img" aria-label="Five linked nodes, the fifth lit"><rect width="320" height="220" fill="#0b0d12"/><path d="M36 120H284" stroke="#f0ede4" stroke-opacity=".28" stroke-width="3"/><g fill="#0b0d12" stroke="#f0ede4" stroke-opacity=".6" stroke-width="3"><circle cx="36" cy="120" r="12"/><circle cx="105" cy="120" r="12"/><circle cx="174" cy="120" r="12"/><circle cx="244" cy="120" r="12"/></g><circle cx="284" cy="120" r="14" fill="#ffb020"/></svg>',
  call: '<svg viewBox="0 0 320 220" role="img" aria-label="A live call with suggestion cards beside it"><rect width="320" height="220" fill="#0b0d12"/><circle cx="82" cy="110" r="38" fill="none" stroke="#f0ede4" stroke-opacity=".3" stroke-width="3"/><circle cx="82" cy="110" r="14" fill="#ffb020"/><g fill="#f0ede4"><rect x="156" y="62" width="130" height="26" rx="13" fill-opacity=".16"/><rect x="156" y="98" width="110" height="26" rx="13" fill-opacity=".16"/><rect x="156" y="134" width="130" height="26" rx="13" fill="#ffb020"/></g></svg>'
};


/* DRAFT trade-off copy (one reflection per case, derived from the facts above): rewrite in your own voice. */
export const WHY = {
  'promotions-sku-portal': 'A request that arrives as a business sentence has to become something testable before it becomes code. Most of the work is in that translation, and in keeping the result easy to change when the next request lands.',
  'presentation-agent': 'Most of this agent is deterministic on purpose: the model plans the pages and picks the hero, and everything that has to be exact, the checks, the layouts and the credentials, is plain code. The trade is more design up front, and a template for each capacity tier.',
  'order-notes-summarizer': 'Streaming changes what the user feels, not only the average: the first words appear while the model is still writing. The trade is that the answer arrives in pieces, so anything that needs the whole summary waits for the end.',
  'rca-multi-agent-system': 'One job and one tool per agent means an answer can be traced to the step that produced it. The trade is more hand-offs, so most of the design is about what passes between agents.',
  'csr-rep-copilot': 'A suggestion has to be useful in seconds, so it is short and sits beside the call. A verdict can take its time on purpose: an auditor needs the evidence more than the speed.',
  'vidhaanai': 'Semantic search finds meaning and keyword search finds exact terms, and together they cover more ground. The trade is a second index to keep in step, which is what the 50-query benchmark is there to justify.',
  'stock-predictor': 'Precision and direction tell different stories, so both are tracked together. The model is trained on one stock over one period, so the next step is testing it on more.',
  'ratna': 'With plain JavaScript, state and DOM updates are explicit, so the code shows how they work. The trade is a little more code, in return for full control.'
};

/* Large case figures: real diagrams of each system (enterprise work has no shareable screens). */
export const FIGURES = (() => {
  const INK = '#0b0d12', CH = '#f0ede4', AM = '#ffb020';
  const head = label => `<svg viewBox="0 0 1600 900" role="img" aria-label="${label}"><rect width="1600" height="900" fill="${INK}"/>`;
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-family="${o.serif ? "'Instrument Serif', serif" : "Geist, system-ui, sans-serif"}" font-size="${o.size || 24}" font-weight="${o.w || 400}" fill="${o.fill || CH}" fill-opacity="${o.op ?? 1}" text-anchor="${o.a || 'start'}">${s}</text>`;
  const cap = s => T(80, 852, s, { size: 20, op: .6 });
  const arrow = (x1, x2, y) => `<path d="M${x1} ${y}H${x2 - 10}" stroke="${CH}" stroke-opacity=".35" stroke-width="3"/><path d="M${x2 - 14} ${y - 8}L${x2} ${y}L${x2 - 14} ${y + 8}" fill="none" stroke="${CH}" stroke-opacity=".5" stroke-width="3"/>`;
  const F = {};

  /* order notes: the request path, before and after, on a seconds axis */
  {
    const x0 = 360, k = 33, X = s => x0 + s * k;
    let o = head('Two request paths on a seconds axis. Before: three tiers each wait for the next, 35 seconds. After: one streamed response, about 20 seconds.');
    o += T(80, 118, 'One request, two paths', { serif: 1, size: 60 });
    [0, 10, 20, 30].forEach(s => { o += `<path d="M${X(s)} 190V700" stroke="${CH}" stroke-opacity=".12" stroke-width="2"/>` + T(X(s), 742, s + ' s', { size: 22, op: .6, a: 'middle' }); });
    o += T(80, 290, 'Before', { size: 32, w: 600 }) + T(80, 326, 'Each tier waits for the next', { size: 22, op: .7 });
    [['Tier 1 waits', 0, 11.67], ['Tier 2 waits', 11.67, 23.33], ['Tier 3 waits', 23.33, 35]].forEach(([n, a, b]) => {
      o += `<rect x="${X(a) + 3}" y="250" width="${(b - a) * k - 6}" height="72" rx="14" fill="${CH}" fill-opacity=".2"/>` + T(X(a) + 28, 294, n, { size: 24 });
    });
    o += T(X(35), 232, '35 s average', { size: 30, w: 600, a: 'end' });
    o += T(x0, 372, 'Each tier waits for the one below it.', { size: 22, op: .7 });
    o += T(80, 540, 'After', { size: 32, w: 600 }) + T(80, 576, 'One streamed response', { size: 22, op: .7 });
    o += `<rect x="${x0}" y="500" width="${20 * k}" height="72" rx="36" fill="${AM}"/>` + T(x0 + 36, 544, 'Streamed to the user as it is written', { size: 24, w: 600, fill: INK });
    o += T(X(20), 482, '~20 s average', { size: 30, w: 600, a: 'end' });
    o += `<path d="M${x0 + 36} 572V612" stroke="${AM}" stroke-width="3" stroke-dasharray="6 6"/>` + T(x0 + 36, 646, 'First words reach the user here, while the model is still writing.', { size: 22, op: .85 });
    o += cap('Schematic of the request path. The two totals are measured averages; the segment lengths are drawn for illustration.') + '</svg>';
    F['order-notes-summarizer'] = o;
  }


  return F;
})();
