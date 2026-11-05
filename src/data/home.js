export const AGENT_STORY = [
  { name: 'Observer', title: 'First, notice the problem.', text: 'The Observer reads CloudWatch logs and spots the spike.', evidence: 'CloudWatch signals', source: 'Logs' },
  { name: 'Analyzer', title: 'Then, find the pattern.', text: 'The Analyzer investigates what the signals have in common.', evidence: 'Pattern analysis', source: 'Findings' },
  { name: 'Code agent', title: 'Check what changed.', text: 'The Code agent inspects recent GitHub changes through MCP.', evidence: 'Relevant code changes', source: 'GitHub · MCP' },
  { name: 'Web search', title: 'Look beyond the codebase.', text: 'The Web search agent looks for known fixes and relevant context.', evidence: 'External context', source: 'Web' },
  { name: 'Finalizer', title: 'Bring the findings together.', text: 'The Finalizer assembles the root-cause document and saves it to S3.', evidence: 'Root-cause document', source: 'S3' }
];
export const METHOD = [
  ['Start with the requirement.', 'I work with the people who own the goal to define what success looks like and how we’ll test it.'],
  ['Design the handoffs.', 'We decide which agents and tools belong in the system, where state lives, and what happens when a call fails.'],
  ['Ship with evidence.', 'I build evaluations alongside the workflow so we can inspect what improved and what still needs work.'],
  ['Stay for production.', 'I follow the system into real use, investigate failures, and turn recurring issues into fixes.']
];
export const TOOLS = [
  ['Agentic AI', 'AWS Bedrock AgentCore, Amazon Bedrock, Strands Agents, LangChain, LangGraph, RAG, MCP, prompt engineering'],
  ['Development', 'React 18, TypeScript, JavaScript, Node.js, Express.js, NestJS, Flask, Material-UI, HTML, CSS, WebSockets'],
  ['Data and cloud', 'MongoDB, SQL, Pandas, NumPy, scikit-learn, Matplotlib, Seaborn, AWS (S3, Secrets Manager, CloudWatch), Firebase'],
  ['Tools and practice', 'Git, Streamlit, Hugging Face, SonarQube, Splunk, Agile and Scrum']
];
export const CAREER = [
  { company: 'Mindstix Software Labs', dates: 'Jun 2025 to Nov 2026', role: 'Software Developer · AI agents on AWS', points: [
    'Architected and operated the order notes summarizer for a US luxury furniture brand across two production regions on shared Keycloak and OAuth.',
    'Led the design spike and architecture for a presentation agent for the same brand. The build combines model-assisted planning with deterministic layouts and validation.',
    'Built GenAI solutions for contextual querying and document intelligence with LangChain, Flask and React, including a CSR copilot proof of concept for an insurance agency and a multi-agent RCA system.',
    'Delivered full-stack features for an FMCG client’s promotions portal and SKU management system in React 18 and Node.js.',
    'Took part in every SDLC phase, from requirement analysis to post-production support, inside Agile and Scrum teams.',
    'Responded to production issues within 24 hours with SonarQube and Splunk, helping cut recurring issues by 50%.'
  ] },
  { company: 'OmneVu', dates: 'Dec 2024 to Jun 2025', role: 'Full Stack Developer Intern · React.js, Node.js, Express.js, MongoDB', points: [
    'Built and optimized full-stack web applications across several business domains.',
    'Improved stock-tracking accuracy and reporting efficiency in an inventory management system.',
    'Streamlined a warranty management system, reducing claim resolution time and improving the user experience.',
    'Lifted product sales and customer engagement in a retail system through UI and UX improvements.'
  ] }
];
export const CREDENTIALS = [
  'Anthropic Academy: Claude 101, Claude Code 101, Claude Code in Action and Claude Platform 101.',
  'IBM Data Scientist Professional Certificate (Nov 2024).',
  'Microsoft AI Odyssey and AI Skills Challenge (Feb 2024).',
  'AWS Machine Learning Foundation and Cloud Foundation (Oct 2023).',
  'Research paper: Advancing AI in Law Governance (Feb 2024).'
];
