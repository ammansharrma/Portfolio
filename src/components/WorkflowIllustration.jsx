import { useId, useState } from 'react';
import './WorkflowIllustration.css';

const workflows = {
  summary: {
    title: 'From order notes to a concise summary',
    steps: [
      ['Order notes', 'document', 'A request brings together the order notes that need summarizing.'],
      ['AI agent', 'agent', 'The agent runs on AWS Bedrock AgentCore behind shared Keycloak/OAuth authentication.'],
      ['Streamed summary', 'output', 'SSE delivers the response through a reworked request lifecycle that resolved cascading timeouts.'],
    ],
  },
  rca: {
    title: 'From a production failure to an RCA report',
    steps: [
      ['Observe', 'logs', 'The CloudWatch Observer gathers signals from production logs.'],
      ['Investigate', 'agent', 'The Analyzer uses evidence from GitHub MCP and web search to investigate the failure.'],
      ['Report', 'output', 'The Finalizer brings the findings together into an RCA document delivered through S3.'],
    ],
  },
  retrieval: {
    title: 'From a question to a contextual answer',
    steps: [
      ['Question', 'document', 'A user asks a question in a conversation with retained context.'],
      ['Retrieve context', 'search', 'Hybrid semantic and keyword retrieval brings relevant knowledge into the agent workflow.'],
      ['Stream an answer', 'output', 'Coordinated agents use the retrieved context and conversation memory to generate a streamed response.'],
    ],
  },
};

function Glyph({ kind }) {
  if (kind === 'agent') return <><rect x="27" y="25" width="46" height="48" rx="12"/><path d="M40 25v-8m20 8v-8M27 42H17m10 16H17m56-16h10m-10 16h10M40 73v10m20-10v10"/><circle cx="41" cy="46" r="3"/><circle cx="59" cy="46" r="3"/><path d="M39 60h22"/></>;
  if (kind === 'search') return <><rect x="18" y="22" width="38" height="52" rx="6"/><path d="M28 36h18M28 46h13M28 56h11"/><circle cx="63" cy="57" r="15"/><path d="m74 68 10 12"/></>;
  if (kind === 'logs') return <><rect x="16" y="21" width="68" height="58" rx="8"/><path d="M16 37h68M28 49h4m8 0h30M28 59h4m8 0h20M28 69h4m8 0h25"/><circle cx="26" cy="29" r="1"/><circle cx="33" cy="29" r="1"/></>;
  return <><path d="M29 17h30l15 15v49H29zM59 17v16h15M39 44h25M39 54h25"/>{kind === 'output' ? <path d="m39 66 6 6 13-13"/> : <path d="M39 64h25M39 73h16M21 27v62h43"/>}</>;
}

export default function WorkflowIllustration({ variant }) {
  const flow = workflows[variant];
  const [active, setActive] = useState(0);
  const id = useId();
  return (
    <figure className="workflow-illustration" aria-labelledby={`${id}-title`}>
      <figcaption id={`${id}-title`}>{flow.title}</figcaption>
      <div className="workflow-steps" role="group" aria-label="Explore the workflow">
        {flow.steps.map(([label, kind], index) => (
          <button type="button" key={label} className={`workflow-step ${index === active ? 'is-active' : ''}`} aria-pressed={index === active} aria-controls={`${id}-description`} onClick={() => setActive(index)}>
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><Glyph kind={kind}/></svg>
            <span>{label}</span>
          </button>
        ))}
      </div>
      <p id={`${id}-description`} className="workflow-description" aria-live="polite">{flow.steps[active][2]}</p>
      <small>Conceptual workflow · Select a step to explore</small>
    </figure>
  );
}
