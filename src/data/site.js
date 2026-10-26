// Sources: supplied resume, architecture diagrams and project notes. Customer identities generalized.
export const site = {
  "name": "Aamaan Sharrma",
  "fullName": "Aamaan Ssanjay Sharrma",
  "role": "Software Engineer",
  "location": "Pune, India",
  "email": "aamaansharrma6@gmail.com",
  "github": "https://github.com/ammansharrma",
  "linkedin": "https://www.linkedin.com/in/amman-sharrma/",
  "url": "https://ammansharrma.github.io/Portfolio/",
  "description": "Aamaan Sharrma is a software engineer in Pune building AI agents, full-stack applications and business automations. Explore his work and discuss a project."
};
export const projects = [
  {
    "id": "order-notes-agent",
    "title": "AI Order Notes Agent",
    "category": "AI & agents",
    "context": "Luxury furniture retailer · At Mindstix",
    "summary": "Production note summarization on AWS, built to handle real authentication and streaming constraints.",
    "stack": [
      "Python",
      "AWS AgentCore",
      "Strands Agents",
      "Amazon Bedrock",
      "SSE",
      "Keycloak"
    ],
    "result": "35s → ~20s",
    "detail": "Average generation time after re-engineering the streaming request lifecycle.",
    "sections": [
      [
        "The problem",
        "Manual review of order notes slowed the workflow. A production AI agent also had to work through authentication and a three-tier request lifecycle without cascading timeouts."
      ],
      [
        "My contribution",
        "At Mindstix, I architected and operated an AI summarization agent on AWS Bedrock AgentCore across two production regions, with shared Keycloak and OAuth authentication."
      ],
      [
        "The engineering decision",
        "I re-engineered the request lifecycle with server-sent events (SSE). Streaming addressed the cascading timeout failure and reduced average generation time from 35 seconds to approximately 20 seconds."
      ],
      [
        "Production work",
        "I resolved more than 15 production and QA defects spanning asynchronous races, CORS, OAuth/JWT and legacy integrations. This was employer work; the source code and internal application are not public."
      ],
      [
        "Architecture",
        "The surrounding notes platform uses a React interface, a Spring Boot Java service, MongoDB and legacy notes integrations. The service invokes AgentCore and relays server-sent events to the browser. The Python summarizer retrieves and ranks notes, uses an in-memory cache and streams Claude through Amazon Bedrock. OAuth service authentication, managed prompts and CloudWatch tracing support the runtime."
      ]
    ],
    "diagrams": [
      [
        "centralized-notes",
        "Centralized notes system",
        "A React interface and Java service connect order notes, authentication, storage and streamed AI summaries."
      ],
      [
        "order-notes",
        "Summarization runtime",
        "The runtime retrieves and ranks notes, checks a cache, and streams a summary through the service."
      ]
    ],
    "role": "Software engineer",
    "status": "Production",
    "outcome": "35s → ~20s · two production regions"
  },
  {
    "id": "vidhaan-ai",
    "title": "VidhaanAI",
    "category": "AI & agents",
    "context": "Independent project",
    "summary": "An LLM orchestration platform that connects retrieval, memory and multiple agents.",
    "stack": [
      "React",
      "Node.js",
      "OpenAI API",
      "LangChain",
      "Pinecone",
      "Redis"
    ],
    "result": "35% lower hallucination rate",
    "detail": "From approximately 40% to 26% on a custom 50-query enterprise benchmark.",
    "image": "Mockups/vidhaanai/cover.webp",
    "sections": [
      [
        "The problem",
        "An AI application needs more than a prompt. It needs relevant context, memory across a conversation and a way to coordinate specialized tasks."
      ],
      [
        "What I built",
        "I developed an LLM orchestration platform combining hybrid semantic and keyword retrieval, conversation memory and coordination across more than four agent roles."
      ],
      [
        "How it works",
        "A React interface connects to streaming WebSocket APIs in Node.js. LangChain coordinates the workflows, Pinecone supports retrieval, and Redis provides the memory layer."
      ],
      [
        "What I measured",
        "A custom evaluation framework measured hallucination on a 50-query enterprise benchmark. The rate fell from approximately 40% to 26%, a relative reduction of approximately 35%. The application supported more than 20 concurrent sessions. These are project benchmark results, not a general accuracy guarantee."
      ]
    ],
    "role": "Independent developer",
    "status": "Independent project",
    "outcome": "35% relative reduction on a 50-query benchmark"
  },
  {
    "id": "presentation-agent",
    "title": "Presentation Agent",
    "category": "AI & agents",
    "context": "Luxury furniture retailer · In development at Mindstix",
    "summary": "Turning project and product data into template-based interior design presentations.",
    "stack": [
      "Python",
      "AWS AgentCore",
      "LangGraph",
      "Strands Agents",
      "Amazon Bedrock",
      "Salesforce",
      "S3",
      "Adobe InDesign"
    ],
    "result": "Project data → presentation deck",
    "detail": "In development. Designed for large presentations of 100+ pages; no measured time savings or production rollout claimed.",
    "diagrams": [
      [
        "presentation-agent",
        "Presentation Agent architecture",
        "The supplied implementation builds and validates an IDML deck, then publishes the artifact and a manifest."
      ]
    ],
    "sections": [
      [
        "The problem",
        "Interior designers assemble client presentations by hand from brand templates, adding room sections, product images, labels and dimensions. Large projects can exceed 100 pages. The goal is to reduce repetitive assembly while preserving the design template."
      ],
      [
        "My contribution",
        "I led the technical design spike, investigated Adobe InDesign API feasibility, designed the agent architecture and am building the agent. I also documented the technical findings and a 10-sprint delivery plan."
      ],
      [
        "The implementation",
        "The supplied architecture runs a 16-node LangGraph workflow in AWS AgentCore. It fetches Salesforce project data and catalog images, validates inputs, resolves templates and plans pages. Strands and Bedrock support product classification and page-plan selection, with a deterministic fallback for plan selection. The pipeline assembles and fills IDML spreads, validates the output, and publishes an artifact plus a manifest containing page information, validation findings and a checksum."
      ],
      [
        "Validation and recovery",
        "Input and output checks support report and strict modes. The output loop can reassemble, fill and validate up to three times. Configuration and secrets are managed outside the application code, and workflow steps carry OpenTelemetry spans."
      ],
      [
        "Adobe API feasibility",
        "I evaluated six storage options and tested an end-to-end Adobe Data Merge flow with a template and CSV staged in S3, job polling and PDF output. A Drive-to-S3 staging design addressed the API storage-provider restriction without additional licensing fees. This feasibility work is separate from the IDML assembly path shown in the implementation diagram."
      ],
      [
        "Design decisions and scope",
        "The earlier design explored a nine-state checkpointed workflow, five external-system integrations, three per-item validation checks and three layout strategies. It recommended capacity-tier templates to fit varying product counts. Its 20 to 40 minute generation target was a design-time estimate, not a measured result. PDF delivery to Google Drive remains part of that design scope; it is not represented as a shipped capability in the supplied implementation diagram."
      ]
    ],
    "role": "Engineer · design & implementation",
    "status": "In development",
    "outcome": "Template-based decks · designed for 100+ pages"
  },
  {
    "id": "rep-copilot",
    "title": "CSR Copilot & Claims Analysis",
    "category": "AI & agents",
    "context": "Home services provider · POC at Mindstix",
    "summary": "Contextual suggestions for support calls, with evidence-backed claims analysis.",
    "stack": [
      "React",
      "Flask",
      "Socket.IO",
      "Amazon Connect",
      "OpenAI",
      "Milvus",
      "MongoDB"
    ],
    "result": "Evidence with every verdict",
    "detail": "A proof of concept designed to support auditor review, with cited evidence.",
    "sections": [
      [
        "The problem",
        "Customer service representatives need relevant context during a call. Claims reviewers need to understand the evidence behind a suggested verdict."
      ],
      [
        "My contribution",
        "I built a customer support copilot proof of concept connecting Amazon Connect with a React interface and a Flask / Socket.IO backend. The supplied architecture uses OpenAI for answers and embeddings, Milvus for policy retrieval, and MongoDB for chat and session records."
      ],
      [
        "Keeping people in the loop",
        "The claims workflow produced AI-generated verdicts with cited evidence for auditor review. It was a support tool for human reviewers, not an autonomous decision maker."
      ],
      [
        "Project scope",
        "This work was a POC at Mindstix. No production adoption or measured business outcome is claimed, and internal code is not publicly available."
      ],
      [
        "Call context and retrieval",
        "Google Identity authenticates the browser session. Call webhooks relay transcript updates over Socket.IO, while policy questions retrieve relevant chunks from Milvus. Transcript records are read from cloud storage, and Jaeger supports tracing. Live suggestions are feature-controlled."
      ]
    ],
    "diagrams": [
      [
        "csr-copilot",
        "CSR Copilot architecture",
        "Call events and policy retrieval support contextual answers, with stored conversations and traces."
      ]
    ],
    "role": "Software engineer",
    "status": "Proof of concept",
    "outcome": "Policy retrieval and contextual call assistance"
  },
  {
    "id": "multi-agent-rca",
    "title": "Multi-agent RCA System",
    "category": "AI & agents",
    "context": "At Mindstix Software Labs",
    "summary": "Specialized agents investigate production failures and assemble root-cause reports.",
    "stack": [
      "AWS AgentCore",
      "CloudWatch",
      "GitHub MCP",
      "S3"
    ],
    "result": "From signals to a report",
    "detail": "An investigation workflow connecting observation, analysis and document generation.",
    "sections": [
      [
        "The problem",
        "Root-cause investigation involves gathering operational signals, examining code and assembling findings into a useful explanation."
      ],
      [
        "My contribution",
        "I developed a multi-agent RCA system on AWS Bedrock AgentCore. CloudWatch Observer, Analyzer, GitHub MCP, Web Search and Finalizer agents worked across the investigation."
      ],
      [
        "The workflow",
        "The system helped localize production failures and generated RCA documents through S3. Each specialist contributed to the final investigation output."
      ],
      [
        "Project scope",
        "Built as part of my role at Mindstix Software Labs. Internal screenshots, source code and incident data are not included here."
      ]
    ],
    "role": "Software engineer",
    "status": "Employer project",
    "outcome": "Specialist agents assemble an RCA report"
  },
  {
    "id": "retail-workflows",
    "title": "Retail & Operations Workflows",
    "category": "Full-stack",
    "context": "Internship at OmneVu",
    "summary": "Inventory, warranty and retail interfaces that reduce everyday manual work.",
    "stack": [
      "React",
      "Express.js",
      "Firebase",
      "Material UI",
      "Vite"
    ],
    "result": "~5 hours saved each week",
    "detail": "Reduction in manual inventory reconciliation reported in my internship work.",
    "sections": [
      [
        "The problem",
        "Inventory reconciliation and warranty workflows depended on manual steps, while retail interfaces needed clearer user flows."
      ],
      [
        "My contribution",
        "During my OmneVu internship, I enhanced an inventory management system with React, Express.js and Firebase. I also redesigned warranty management workflows and retail interfaces using React, Material UI and Vite."
      ],
      [
        "The results",
        "The inventory work improved data accuracy by approximately 20% and reduced manual reconciliation by approximately five hours per week. Warranty and UI work reduced claim resolution time by approximately 30% and contributed to approximately 15% higher product page engagement."
      ],
      [
        "Project scope",
        "These contributions were part of my internship from December 2024 to June 2025. The internal systems and their source code are not public."
      ]
    ],
    "role": "Full-stack developer intern",
    "status": "Internship work",
    "outcome": "~5 hours less reconciliation each week"
  }
];
export const experience = [
  {
    "company": "Mindstix Software Labs",
    "role": "Software Developer",
    "date": "Jun 2025 to Present",
    "location": "Pune, India",
    "summary": "Building production AI agents and full-stack enterprise software, from requirements and architecture to delivery and support.",
    "bullets": [
      "Operated an AI summarization agent across two production regions on AWS Bedrock AgentCore.",
      "Leading the design and implementation of a Presentation Agent for a luxury furniture retailer.",
      "Built a CSR copilot POC, evidence-backed claims analysis and a multi-agent RCA system.",
      "Delivered FMCG client production features with React 18, Node.js, NestJS and databases.",
      "Triaged production issues within a 24-hour window using SonarQube and Splunk, contributing to a 50% reduction in recurring system errors."
    ],
    "projects": [
      "order-notes-agent",
      "presentation-agent",
      "rep-copilot",
      "multi-agent-rca"
    ]
  },
  {
    "company": "OmneVu",
    "role": "Full Stack Developer Intern",
    "date": "Dec 2024 to Jun 2025",
    "location": "Remote",
    "summary": "Improving inventory, warranty and retail systems with practical full-stack changes.",
    "bullets": [
      "Enhanced inventory management with React, Express.js and Firebase.",
      "Redesigned warranty and retail flows with React, Material UI and Vite.",
      "Connected interface improvements with measurable operational results."
    ],
    "projects": [
      "retail-workflows"
    ]
  }
];
export const skills = [
  [
    "Agentic AI",
    [
      "AWS AgentCore",
      "Amazon Bedrock",
      "LangChain",
      "RAG",
      "Multi-agent systems",
      "Prompt engineering",
      "MCP",
      "Strands Agents",
      "LangGraph"
    ]
  ],
  [
    "Development",
    [
      "React 18",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Express.js",
      "NestJS",
      "Java",
      "Flask",
      "REST APIs",
      "WebSockets",
      "Python"
    ]
  ],
  [
    "Cloud & data",
    [
      "AWS",
      "AWS Connect",
      "CloudWatch",
      "S3",
      "MongoDB",
      "SQL",
      "Pinecone",
      "Redis",
      "Firebase"
    ]
  ],
  [
    "Product & engineering",
    [
      "Solution architecture",
      "System design",
      "Requirements analysis",
      "Agile / Scrum",
      "Git",
      "GitHub",
      "SonarQube",
      "Dynatrace"
    ]
  ]
];
export const services = [
  {
    "title": "AI agents & integrations",
    "icon": "spark",
    "text": "Bring retrieval, summarization and agent workflows into your product, with clear sources and human review where it matters.",
    "deliverable": "A scoped retrieval or summarization prototype connected to your data, with evaluation criteria agreed before implementation.",
    "project": "order-notes-agent"
  },
  {
    "title": "Full-stack web applications",
    "icon": "code",
    "text": "Turn a business requirement into a React interface, backend APIs and connected data workflows.",
    "deliverable": "A React interface with backend APIs and data workflows, scoped around a specific business task.",
    "project": "retail-workflows"
  },
  {
    "title": "Workflow automation",
    "icon": "workflow",
    "text": "Reduce repetitive steps in support, reporting and operations with integrations that fit your existing tools.",
    "deliverable": "An integration that moves information between your tools and reduces a clearly identified manual step.",
    "project": "presentation-agent"
  }
];