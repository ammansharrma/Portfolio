/* Sanitized architecture diagrams (client names, account ids and hostnames scrubbed). Loaded only by case pages. */
import notesSystem from './diagrams/notes-system.svg?raw';
import orderRuntime from './diagrams/order-notes-runtime.svg?raw';
import csr from './diagrams/csr-copilot.svg?raw';
import presentation from './diagrams/presentation-agent.svg?raw';
import { buildDiagram } from './diagramKit';

export const SVGS = {
  'notes-system': notesSystem,
  'order-notes-runtime': orderRuntime,
  'csr-copilot': csr,
  'presentation-agent': presentation,

  /* Drawn diagrams: illustrations of how each system fits together, built with the same kit. */
  vidhaan: buildDiagram({
    key: 'vidhaan', title: 'VidhaanAI', desc: 'A reader asks a question in a React app; a Node.js API passes it to a LangChain orchestrator with four agent roles, which uses hybrid retrieval over a vector store, Redis for conversation memory and a language model.',
    w: 1260, h: 600,
    nodes: [
      { id: 'user', kind: 'external', x: 40, y: 60, label: 'Reader', sub: 'asks about a document' },
      { id: 'ui', kind: 'frontend', x: 290, y: 60, label: 'React UI', sub: 'streaming answers' },
      { id: 'api', kind: 'backend', x: 540, y: 60, label: 'Node.js API', sub: 'WebSocket · rate limits' },
      { id: 'orch', kind: 'backend', x: 790, y: 60, label: 'LangChain orchestrator', sub: 'four agent roles' },
      { id: 'llm', kind: 'external', x: 1040, y: 60, label: 'OpenAI', sub: 'language model' },
      { id: 'redis', kind: 'database', x: 540, y: 250, label: 'Redis', sub: 'conversation memory' },
      { id: 'retr', kind: 'backend', x: 790, y: 250, label: 'Hybrid retrieval', sub: 'semantic + keyword' },
      { id: 'evalh', kind: 'backend', x: 1040, y: 250, label: 'Eval harness', sub: '50-query benchmark' },
      { id: 'vec', kind: 'database', x: 790, y: 440, label: 'Vector store', sub: 'document embeddings' }
    ],
    edges: [
      { from: 'user', to: 'ui', label: 'question' }, { from: 'ui', to: 'api', label: 'WebSocket' }, { from: 'api', to: 'orch', label: 'request' },
      { from: 'orch', to: 'llm', label: 'prompt' }, { from: 'orch', to: 'retr', label: 'query', fs: 'b', ts: 't', fo: 30, to_: 30 },
      { from: 'orch', to: 'redis', type: 'default', label: 'context', fs: 'b', ts: 't', fo: -50 },
      { from: 'retr', to: 'vec', type: 'default', label: 'search' }, { from: 'evalh', to: 'retr', type: 'dashed', label: 'scores' }
    ]
  }),

  stock: buildDiagram({
    key: 'stock', title: 'Stock Predictor', desc: 'Price history is preprocessed into time windows, passed through LSTM layers and an attention layer to produce a trend forecast; an evaluation step measures accuracy and feeds back into preprocessing.',
    w: 1260, h: 500,
    regions: [{ x: 272, y: 84, w: 966, h: 124, label: 'One notebook · Python, TensorFlow' }],
    nodes: [
      { id: 'prices', kind: 'external', x: 40, y: 120, label: 'Price history', sub: 'Google stock' },
      { id: 'prep', kind: 'backend', x: 290, y: 120, label: 'Preprocessing', sub: 'scaling · time windows' },
      { id: 'lstm', kind: 'backend', x: 540, y: 120, label: 'LSTM layers', sub: 'sequence memory' },
      { id: 'attn', kind: 'backend', x: 790, y: 120, label: 'Attention', sub: 'weights the days that matter' },
      { id: 'fore', kind: 'backend', x: 1040, y: 120, label: 'Forecast', sub: 'trend: up or down' },
      { id: 'evalN', kind: 'backend', x: 540, y: 320, label: 'Evaluation', sub: 'MSE · MAPE · accuracy' }
    ],
    edges: [
      { from: 'prices', to: 'prep', label: 'daily data' }, { from: 'prep', to: 'lstm', label: 'windows' }, { from: 'lstm', to: 'attn', label: 'sequence' }, { from: 'attn', to: 'fore', label: 'weighted' },
      { from: 'fore', to: 'evalN', type: 'default', label: 'compare', fs: 'b', ts: 'r' },
      { from: 'evalN', to: 'prep', type: 'dashed', label: 'tune', fs: 'l', ts: 'b' }
    ]
  }),


  rca: buildDiagram({
    key: 'rca', title: 'RCA multi-agent system', desc: 'Five agents in a row, Observer, Analyzer, Code agent, Web search and Finalizer, each handing its finding to the next. Logs, GitHub and the web feed three of them, and the Finalizer files the root-cause document to S3.',
    w: 1280, h: 560,
    regions: [{ x: 20, y: 186, w: 1240, h: 130, label: 'AgentCore runtime' }],
    nodes: [
      { id: 'cw', kind: 'cloud', x: 40, y: 60, label: 'CloudWatch', sub: 'logs' },
      { id: 'gh', kind: 'external', x: 540, y: 60, label: 'GitHub', sub: 'recent changes · MCP' },
      { id: 'net', kind: 'external', x: 790, y: 60, label: 'The web', sub: 'known fixes' },
      { id: 'obs', kind: 'backend', x: 40, y: 220, label: 'Observer', sub: 'spots the spike' },
      { id: 'ana', kind: 'backend', x: 290, y: 220, label: 'Analyzer', sub: 'finds the pattern' },
      { id: 'code', kind: 'backend', x: 540, y: 220, label: 'Code agent', sub: 'checks what changed' },
      { id: 'web', kind: 'backend', x: 790, y: 220, label: 'Web search agent', sub: 'looks outside' },
      { id: 'fin', kind: 'backend', x: 1040, y: 220, label: 'Finalizer', sub: 'writes the document' },
      { id: 's3', kind: 'cloud', x: 1040, y: 400, label: 'S3', sub: 'root-cause document' }
    ],
    edges: [
      { from: 'obs', to: 'ana', label: 'hand-off' }, { from: 'ana', to: 'code', label: 'hand-off' }, { from: 'code', to: 'web', label: 'hand-off' }, { from: 'web', to: 'fin', label: 'hand-off' },
      { from: 'cw', to: 'obs', type: 'default', label: 'logs' }, { from: 'gh', to: 'code', type: 'default', label: 'MCP' }, { from: 'net', to: 'web', type: 'default', label: 'search' },
      { from: 'fin', to: 's3', label: 'files' }
    ]
  }),

  promo: buildDiagram({
    key: 'promo', title: 'Promotions portal and SKU management', desc: 'A business request is planned in Agile ceremonies, built as a promotions portal and a SKU management screen in React 18 on Node.js and NestJS services, passed through a quality gate, shipped to production and fed back by support.',
    w: 1300, h: 580,
    nodes: [
      { id: 'req', kind: 'external', x: 40, y: 230, label: 'Business request', sub: 'a need, not a spec' },
      { id: 'plan', kind: 'external', x: 290, y: 230, label: 'Agile planning', sub: 'estimates · reviews' },
      { id: 'promo', kind: 'frontend', x: 560, y: 100, label: 'Promotions portal', sub: 'React 18' },
      { id: 'sku', kind: 'frontend', x: 560, y: 360, label: 'SKU management', sub: 'React 18' },
      { id: 'api', kind: 'backend', x: 830, y: 230, label: 'Node.js + NestJS', sub: 'production-ready services' },
      { id: 'qual', kind: 'security', x: 1070, y: 100, label: 'Quality gate', sub: 'code quality checks' },
      { id: 'prod', kind: 'cloud', x: 1070, y: 360, label: 'Production', sub: 'deploy · triage' }
    ],
    edges: [
      { from: 'req', to: 'plan', label: 'requirement' },
      { from: 'plan', to: 'promo', label: 'feature', fo: -8 }, { from: 'plan', to: 'sku', label: 'feature', fo: 8 },
      { from: 'promo', to: 'api', label: 'calls', to_: -8 }, { from: 'sku', to: 'api', label: 'calls', to_: 8 },
      { from: 'api', to: 'qual', type: 'default', label: 'checks', fo: -8 }, { from: 'api', to: 'prod', label: 'deploy', fo: 8 },
      { from: 'prod', to: 'req', type: 'dashed', label: 'support feedback', fs: 'b', ts: 'b', via: [[1160, 500], [130, 500]] }
    ]
  })
};
