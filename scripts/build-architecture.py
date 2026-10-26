from pathlib import Path
from xml.sax.saxutils import escape
import textwrap
out=Path('public/architecture');out.mkdir(exist_ok=True)
diagrams={
'centralized-notes':('Centralized notes system','Luxury furniture retailer',[
('Associate workspace','React UI · authenticated browser'),('Order notes service','Spring Boot · REST + SSE'),('Notes storage','MongoDB · legacy notes APIs'),('Identity services','Okta user login · Keycloak service auth'),('AI summarizer','AgentCore · Python · Strands'),('Model & operations','Bedrock Claude · managed prompts')],[(0,1,'REST / SSE'),(1,2,'Read / write notes'),(0,3,'User login'),(1,4,'Invoke runtime'),(4,1,'Retrieve notes'),(4,5,'Stream model output')],'The Java service relays summary events to the UI. Email and regional notes integrations are omitted for clarity.'),
'order-notes':('Order notes summarization','AgentCore runtime',[
('Caller / backend','InvokeAgentRuntime · streamed reply'),('Request orchestration','Rate limit · session context'),('Retrieve & rank notes','Notes API · OAuth · category filter'),('Runtime cache','In-memory · note-change fingerprint'),('Strands + Bedrock','Claude · managed prompt templates'),('Operations & config','CloudWatch · X-Ray · Secrets Manager')],[(0,1,'Invoke'),(1,2,'Fetch / rank'),(1,3,'Check cache'),(2,4,'Enriched prompt on miss'),(4,3,'Store result'),(1,5,'Config / traces')],'Cache hits reuse prior results; misses stream a model response. Cache and rate-limit state are scoped to each runtime instance.'),
'csr-copilot':('CSR Copilot','Home services provider · proof of concept',[
('Support workspace','React · Firebase · Google Identity'),('Q&A backend','Flask · REST + Socket.IO'),('Policy retrieval','Milvus · OpenAI answers + embeddings'),('Call context','Amazon Connect · transcript webhooks'),('Conversation records','MongoDB · cloud transcript storage'),('Observability','Jaeger · OpenTelemetry traces')],[(0,1,'Questions / answers'),(1,2,'Retrieve / generate'),(0,3,'Connect session'),(3,1,'Transcript updates'),(1,4,'Store / read'),(1,5,'Trace export')],'Live suggestions are feature-controlled. Policy answers retrieve supporting chunks; conversation records retain session context.'),
'presentation-agent':('Presentation Agent','Luxury furniture retailer · in development',[
('Project input','AgentCore · config · project ID'),('Fetch & prepare','Salesforce · catalog · image resolution'),('Validate inputs','Report / strict validation gates'),('Template & page plans','S3 IDML · categories · layouts'),('Select plan & hero','Strands + Bedrock · deterministic fallback'),('Assemble & fill','Clone spreads · images · captions'),('Validate output','IDML structure · rules · retry up to 3'),('Publish artifact','S3 IDML output · local dev option'),('Return manifest','Pages · findings · SHA-256 checksum')],[(0,1,'Fetch'),(1,2,'Check'),(2,3,'Validated data'),(3,4,'Ranked plans'),(4,5,'Chosen layouts'),(5,6,'Filled deck'),(6,7,'Pass / report'),(7,8,'Artifact URI')],'Implementation: 16-node LangGraph workflow with per-step tracing. Adobe PDF export and Drive delivery are separate design / feasibility work.')}
for key,(title,subtitle,nodes,edges,note) in diagrams.items():
 rows=(len(nodes)+2)//3; height=190+rows*215+110
 parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="{height}" viewBox="0 0 1200 {height}" role="img" aria-labelledby="title desc">',f'<title id="title">{escape(title)}</title><desc id="desc">{escape(note)}</desc>', '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="none" stroke="#73877b"/></marker></defs>',f'<rect width="1200" height="{height}" fill="#f7f9f7"/>',f'<text x="48" y="64" font-family="Arial,sans-serif" font-size="30" font-weight="600" fill="#202923">{escape(title)}</text>',f'<text x="48" y="98" font-family="Arial,sans-serif" font-size="17" fill="#637168">{escape(subtitle)}</text>']
 # Snake order keeps the primary sequence legible from left to right, then back.
 coords=[]
 for i in range(len(nodes)):
  row=i//3;col=i%3 if row%2==0 else 2-i%3;coords.append((48+col*376,155+row*215))
 for a,b,label in edges:
  x,y=coords[a];X,Y=coords[b]
  if y==Y:
   right=X>x;sx=x+330 if right else x;tx=X if right else X+330;sy=ty=y+72
   d=f'M{sx} {sy} L{tx} {ty}'
  elif x==X:
   sx=tx=x+165;sy=y+145 if Y>y else y;ty=Y if Y>y else Y+145;d=f'M{sx} {sy} L{tx} {ty}'
  else:
   sx=x+165;sy=y+145;tx=X+165;ty=Y;mid=(sy+ty)/2;d=f'M{sx} {sy} V{mid} H{tx} V{ty}'
  parts.append(f'<path d="{d}" fill="none" stroke="#73877b" stroke-width="2" marker-end="url(#arrow)"/>')
 for i,((label,detail),(x,y)) in enumerate(zip(nodes,coords)):
  parts.extend([f'<rect x="{x}" y="{y}" width="330" height="145" rx="14" fill="#fff" stroke="#dce4de"/>',f'<text x="{x+20}" y="{y+30}" font-family="Arial,sans-serif" font-size="13" fill="#52715e">{i+1:02d}</text>',f'<text x="{x+20}" y="{y+62}" font-family="Arial,sans-serif" font-size="20" font-weight="600" fill="#24352a">{escape(label)}</text>'])
  for line,t in enumerate(textwrap.wrap(detail,34)):parts.append(f'<text x="{x+20}" y="{y+92+line*23}" font-family="Arial,sans-serif" font-size="15" fill="#607067">{escape(t)}</text>')
 for line,t in enumerate(textwrap.wrap(note,125)):parts.append(f'<text x="48" y="{height-70+line*25}" font-family="Arial,sans-serif" font-size="16" fill="#607067">{escape(t)}</text>')
 parts.append('</svg>');(out/(key+'.svg')).write_text('\n'.join(parts),encoding='utf-8')

# Shared text version for responsive HTML diagrams.
import json
Path("src/data/architecture.json").write_text(json.dumps({key:[{"title":label,"detail":detail} for label,detail in value[2]] for key,value in diagrams.items()},ensure_ascii=False,indent=2),encoding="utf-8")
