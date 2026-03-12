'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const SKILLS = [
  { icon: '☁️', name: 'Cloud Platforms', desc: 'Hands-on AWS across EC2, VPC, Lambda, RDS and more, plus Azure & GCP foundations.', tags: ['EC2','S3','IAM','VPC','RDS','Lambda','Route 53'] },
  { icon: '🔁', name: 'CI/CD & DevOps', desc: 'Pipelines that automate build, test, and deploy workflows end-to-end.', tags: ['Jenkins','GitHub Actions','Docker','CI/CD'] },
  { icon: '🐧', name: 'Linux & Scripting', desc: 'Terminal-native: automation scripts and day-to-day Linux system management.', tags: ['Bash','Python','Linux Admin'] },
  { icon: '🏗️', name: 'Infrastructure as Code', desc: 'Repeatable, version-controlled cloud infra using Terraform and AWS-native tools.', tags: ['Terraform','VPC Routing','Load Balancing','Security Groups'] },
  { icon: '📊', name: 'Monitoring & Alerting', desc: 'Full observability — metrics, logs and alerting to keep systems healthy.', tags: ['CloudWatch','Prometheus','Grafana','SNS','CloudTrail'] },
  { icon: '🤝', name: 'Collaboration & Tools', desc: 'Working effectively across teams with modern DevOps tooling.', tags: ['Git','Jira','Confluence','Slack'] },
]

const PROJECTS = [
  { emoji:'🏗️', bg:'linear-gradient(135deg,#071a29,#0a2e1e)', tag:'AWS Infrastructure', title:'Multi-Tier Web App on AWS', desc:'Highly available architecture using VPC, public/private subnets, ALB, EC2 Auto Scaling and Amazon RDS with full network isolation.', stack:['VPC','EC2','ALB','RDS','Auto Scaling'] },
  { emoji:'💰', bg:'linear-gradient(135deg,#1a1000,#0d2500)', tag:'Scripting & Automation', title:'Automated Cost Optimization', desc:'Lambda-based solution detecting idle EC2 instances and unattached EBS volumes, integrated with CloudWatch metrics and SNS alerts.', stack:['Lambda','CloudWatch','SNS','Python'] },
  { emoji:'🛡️', bg:'linear-gradient(135deg,#0b1f2e,#092819)', tag:'Cloud Infrastructure', title:'Disaster Recovery with RDS', desc:'Automated RDS snapshots with documented recovery procedures, defined RPO/RTO targets aligned with cloud operational best practices.', stack:['Amazon RDS','Snapshots','CloudWatch'] },
  { emoji:'🔒', bg:'linear-gradient(135deg,#170c2e,#091828)', tag:'Security & Networking', title:'Secure 3-Tier Architecture', desc:'Production-grade 3-tier setup with public load balancer, private app tier, isolated DB subnet with NACLs, security groups, and bastion host.', stack:['VPC','NACLs','Security Groups','Bastion Host','IAM'] },
  { emoji:'💾', bg:'linear-gradient(135deg,#001828,#001e12)', tag:'Storage & Automation', title:'Automated Backup & S3 Lifecycle', desc:'S3 lifecycle policies transitioning objects to Glacier at 30 days, expiring at 365. Lambda triggers send SNS completion notifications.', stack:['S3','Glacier','Lambda','SNS','Lifecycle Rules'] },
  { emoji:'🗄️', bg:'linear-gradient(135deg,#1a0e00,#0c1e0a)', tag:'Database Management', title:'Managed RDS Databases', desc:'Multi-AZ RDS instances with automated failover, read replicas, parameter group tuning and CloudWatch alarms for all critical thresholds.', stack:['RDS','Multi-AZ','Read Replicas','CloudWatch','Parameter Groups'] },
  { emoji:'🌐', bg:'linear-gradient(135deg,#001616,#001108)', tag:'Networking', title:'VPC Infrastructure Design', desc:'Full VPC from scratch with custom CIDR, public/private subnets across multiple AZs, Internet Gateway, NAT Gateway and route tables.', stack:['VPC','Subnets','NAT Gateway','IGW','Route Tables'] },
  { emoji:'📋', bg:'linear-gradient(135deg,#161200,#0d1600)', tag:'Observability', title:'Centralized Logging System', desc:'CloudWatch Logs pipeline with metric filters and CloudTrail API audit trails. Real-time dashboards and alarms for all infrastructure events.', stack:['CloudWatch Logs','CloudTrail','Metric Filters','Alarms','S3'] },
  { emoji:'⚙️', bg:'linear-gradient(135deg,#0a0a18,#001612)', tag:'CI/CD', title:'CI/CD Pipeline with GitHub Actions', desc:'End-to-end deployment with linting, testing, Docker build, push to ECR, and rolling deploy to EC2 on every merge to main with rollback.', stack:['GitHub Actions','Docker','ECR','EC2','Bash'] },
]

const BLOGS = [
  { emoji:'💸', bg:'linear-gradient(135deg,#001612,#000f0a)', date:'Feb 10, 2025', cat:'AWS', title:'How I cut AWS costs with Lambda automation', excerpt:'A walkthrough of my CloudWatch + Lambda setup that automatically hunts down idle resources before they drain your budget. Saved 40% on monthly EC2 spend with zero manual effort.' },
  { emoji:'📡', bg:'linear-gradient(135deg,#000e14,#000a18)', date:'Jan 22, 2025', cat:'Monitoring', title:'Prometheus + Grafana on AWS: a practical guide', excerpt:'Setting up a full observability stack with metrics, dashboards, and alerting that wakes you up for the right reasons only. Covers Node Exporter, Alert Manager, and SNS integration.' },
  { emoji:'🔐', bg:'linear-gradient(135deg,#0c0018,#001612)', date:'Dec 15, 2024', cat:'DevOps', title:'VPC security groups: lessons learned the hard way', excerpt:'Real lessons from debugging network connectivity and building a security group strategy that balances access with isolation. Includes a reusable 3-tier template.' },
  { emoji:'🐳', bg:'linear-gradient(135deg,#000a18,#001020)', date:'Mar 5, 2025', cat:'CI/CD', title:'Dockerizing a Node.js app and deploying to ECR + EC2', excerpt:'Step-by-step: write a lean Dockerfile, push to Elastic Container Registry, pull on EC2, and automate the whole thing with a GitHub Actions workflow on every push to main.' },
  { emoji:'🏗️', bg:'linear-gradient(135deg,#0a1000,#001612)', date:'Feb 28, 2025', cat:'Terraform', title:'My first Terraform module: a reusable VPC', excerpt:'How I went from copy-pasting CloudFormation to writing a parameterised Terraform module that spins up a production-ready VPC with public, private, and DB subnets in under 3 minutes.' },
  { emoji:'☁️', bg:'linear-gradient(135deg,#001420,#080020)', date:'Jan 8, 2025', cat:'AWS', title:'IAM least-privilege: stop giving AdministratorAccess', excerpt:'A guide to writing tight IAM policies using the principle of least privilege. Covers condition keys, resource-level permissions, and how to audit your existing roles with IAM Access Analyzer.' },
  { emoji:'📦', bg:'linear-gradient(135deg,#100800,#001008)', date:'Dec 2, 2024', cat:'Storage', title:'S3 lifecycle policies that actually save money', excerpt:'Breaking down Intelligent-Tiering vs. manual lifecycle rules vs. Glacier Deep Archive. With real cost comparisons and a ready-to-use Terraform snippet for automated transitions.' },
  { emoji:'🚨', bg:'linear-gradient(135deg,#100010,#001410)', date:'Nov 18, 2024', cat:'Monitoring', title:'CloudWatch alarms I wish I had set up from day one', excerpt:'The six CloudWatch alarms every AWS account needs before anything goes to production — covering CPU spikes, disk pressure, error rates, billing, and unhealthy ALB targets.' },
  { emoji:'🔄', bg:'linear-gradient(135deg,#000c18,#0a0020)', date:'Oct 30, 2024', cat:'DevOps', title:'RDS automated backups vs. snapshots: when to use what', excerpt:'Demystifying the difference between automated RDS backups, manual snapshots, and Aurora continuous backups. Includes a decision matrix for choosing the right RPO/RTO strategy.' },
]

const SNAKE_CODE = [
  'const canvas=document.getElementById("c");const ctx=canvas.getContext("2d");',
  'canvas.width=400;canvas.height=400;',
  'let snake=[{x:10,y:10}],dir={x:1,y:0},food={x:15,y:15},score=0,running=true;',
  'const S=20;',
  'function rand(n){return Math.floor(Math.random()*n);}',
  'function placeFood(){food={x:rand(20),y:rand(20)};}',
  'function draw(){',
  '  ctx.fillStyle="#03070f";ctx.fillRect(0,0,400,400);',
  '  ctx.strokeStyle="#0a1a14";ctx.lineWidth=0.5;',
  '  for(let i=0;i<20;i++){ctx.beginPath();ctx.moveTo(i*S,0);ctx.lineTo(i*S,400);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*S);ctx.lineTo(400,i*S);ctx.stroke();}',
  '  ctx.fillStyle="#FB923C";ctx.beginPath();ctx.arc(food.x*S+S/2,food.y*S+S/2,7,0,Math.PI*2);ctx.fill();',
  '  snake.forEach((s,i)=>{ctx.fillStyle=i===0?"#00F5D2":"#00a88a";ctx.beginPath();ctx.roundRect(s.x*S+1,s.y*S+1,S-2,S-2,4);ctx.fill();});',
  '  ctx.fillStyle="#e8f0ed";ctx.font="bold 13px monospace";ctx.fillText("Score: "+score,8,16);',
  '}',
  'function step(){',
  '  if(!running)return;',
  '  const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};',
  '  if(head.x<0||head.x>=20||head.y<0||head.y>=20||snake.some(s=>s.x===head.x&&s.y===head.y)){',
  '    ctx.fillStyle="rgba(0,0,0,0.78)";ctx.fillRect(0,0,400,400);',
  '    ctx.fillStyle="#00F5D2";ctx.font="bold 26px monospace";ctx.textAlign="center";',
  '    ctx.fillText("GAME OVER",200,170);ctx.font="14px monospace";ctx.fillStyle="#6b9e94";',
  '    ctx.fillText("Score: "+score,200,204);ctx.fillText("Press R to restart",200,230);running=false;return;',
  '  }',
  '  snake.unshift(head);',
  '  if(head.x===food.x&&head.y===food.y){score++;placeFood();}else{snake.pop();}',
  '  draw();',
  '}',
  'document.addEventListener("keydown",e=>{',
  '  if(e.key==="ArrowUp"&&dir.y===0)dir={x:0,y:-1};',
  '  if(e.key==="ArrowDown"&&dir.y===0)dir={x:0,y:1};',
  '  if(e.key==="ArrowLeft"&&dir.x===0)dir={x:-1,y:0};',
  '  if(e.key==="ArrowRight"&&dir.x===0)dir={x:1,y:0};',
  '  if(e.key==="r"||e.key==="R"){snake=[{x:10,y:10}];dir={x:1,y:0};score=0;running=true;placeFood();}',
  '});',
  'placeFood();draw();setInterval(step,120);',
].join('\n')

const BREAKOUT_CODE = [
  'const canvas=document.getElementById("c");const ctx=canvas.getContext("2d");',
  'canvas.width=480;canvas.height=480;',
  'let paddle={x:190,y:450,w:100,h:12},ball={x:240,y:400,vx:3,vy:-4,r:8},bricks=[],score=0,lives=3,running=true;',
  'const cols=8,rows=5,bw=50,bh=18,gap=6,ox=16,oy=50;',
  'const colors=["#00F5D2","#0EA5E9","#818CF8","#FB923C","#FBBF24"];',
  'function initBricks(){bricks=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)bricks.push({x:ox+c*(bw+gap),y:oy+r*(bh+gap),alive:true,color:colors[r%colors.length]});}',
  'initBricks();',
  'document.addEventListener("mousemove",e=>{const rect=canvas.getBoundingClientRect();paddle.x=e.clientX-rect.left-paddle.w/2;});',
  'document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")paddle.x-=20;if(e.key==="ArrowRight")paddle.x+=20;});',
  'function draw(){',
  '  ctx.fillStyle="#03070f";ctx.fillRect(0,0,480,480);',
  '  bricks.forEach(b=>{if(!b.alive)return;ctx.fillStyle=b.color;ctx.beginPath();ctx.roundRect(b.x,b.y,bw,bh,4);ctx.fill();});',
  '  ctx.fillStyle="rgba(0,245,210,0.85)";ctx.beginPath();ctx.roundRect(paddle.x,paddle.y,paddle.w,paddle.h,6);ctx.fill();',
  '  ctx.fillStyle="#FB923C";ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fill();',
  '  ctx.fillStyle="#e8f0ed";ctx.font="bold 13px monospace";ctx.fillText("Score: "+score,8,16);ctx.fillText("Lives: "+lives,390,16);',
  '}',
  'function step(){',
  '  if(!running)return;',
  '  ball.x+=ball.vx;ball.y+=ball.vy;',
  '  if(ball.x<ball.r||ball.x>480-ball.r)ball.vx*=-1;',
  '  if(ball.y<ball.r)ball.vy*=-1;',
  '  if(ball.y>480){lives--;if(lives<=0){ctx.fillStyle="rgba(0,0,0,0.85)";ctx.fillRect(0,0,480,480);ctx.fillStyle="#00F5D2";ctx.font="bold 26px monospace";ctx.textAlign="center";ctx.fillText("GAME OVER",240,215);running=false;return;}ball.x=240;ball.y=400;}',
  '  if(ball.y+ball.r>paddle.y&&ball.x>paddle.x&&ball.x<paddle.x+paddle.w&&ball.vy>0){ball.vy*=-1;ball.vx+=((ball.x-(paddle.x+paddle.w/2))/50);}',
  '  paddle.x=Math.max(0,Math.min(480-paddle.w,paddle.x));',
  '  bricks.forEach(b=>{if(!b.alive)return;if(ball.x>b.x&&ball.x<b.x+bw&&ball.y>b.y&&ball.y<b.y+bh){b.alive=false;ball.vy*=-1;score+=10;}});',
  '  if(bricks.every(b=>!b.alive)){ctx.fillStyle="rgba(0,0,0,0.85)";ctx.fillRect(0,0,480,480);ctx.fillStyle="#00F5D2";ctx.font="bold 26px monospace";ctx.textAlign="center";ctx.fillText("YOU WIN!",240,215);running=false;return;}',
  '  draw();',
  '}',
  'draw();setInterval(step,1000/60);',
].join('\n')

const GAME2048_CODE = [
  'const canvas=document.getElementById("c");const ctx=canvas.getContext("2d");',
  'canvas.width=420;canvas.height=480;',
  'const S=90,GAP=10,OFF=30;',
  'let grid=Array(4).fill(null).map(()=>Array(4).fill(0)),score=0,over=false;',
  'const tc={0:"#0d1321",2:"#132a1e",4:"#0c3040",8:"#3d2070",16:"#e94560",32:"#FB923C",64:"#FBBF24",128:"#00F5D2",256:"#0EA5E9",512:"#818CF8",1024:"#FB7185",2048:"#ffffff"};',
  'function addRandom(){const empty=[];for(let r=0;r<4;r++)for(let c=0;c<4;c++)if(grid[r][c]===0)empty.push([r,c]);if(!empty.length)return;const[r,c]=empty[Math.floor(Math.random()*empty.length)];grid[r][c]=Math.random()<0.9?2:4;}',
  'function draw(){',
  '  ctx.fillStyle="#03070f";ctx.fillRect(0,0,420,480);',
  '  ctx.fillStyle="#e8f0ed";ctx.font="bold 15px monospace";ctx.textAlign="left";ctx.textBaseline="top";',
  '  ctx.fillText("2048",16,10);ctx.fillText("Score: "+score,180,10);',
  '  ctx.fillStyle="#060d1a";ctx.beginPath();ctx.roundRect(OFF-GAP,OFF+18,4*(S+GAP)+GAP,4*(S+GAP)+GAP,8);ctx.fill();',
  '  for(let r=0;r<4;r++)for(let c=0;c<4;c++){',
  '    const v=grid[r][c],x=OFF+c*(S+GAP),y=OFF+18+GAP+r*(S+GAP);',
  '    ctx.fillStyle=tc[v]||"#00F5D2";ctx.beginPath();ctx.roundRect(x,y,S,S,6);ctx.fill();',
  '    if(v){ctx.fillStyle=v<=4?"#6b9e94":"#e8f0ed";ctx.font="bold "+(v>=1024?19:v>=128?25:31)+"px monospace";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(v,x+S/2,y+S/2);}',
  '  }',
  '  if(over){ctx.fillStyle="rgba(3,7,15,0.85)";ctx.fillRect(OFF-GAP,OFF+18,4*(S+GAP)+GAP,4*(S+GAP)+GAP);ctx.fillStyle="#00F5D2";ctx.font="bold 28px monospace";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("GAME OVER",210,260);}',
  '}',
  'function slide(row){let r=row.filter(v=>v);for(let i=0;i<r.length-1;i++)if(r[i]===r[i+1]){r[i]*=2;score+=r[i];r.splice(i+1,1);i++;}while(r.length<4)r.push(0);return r;}',
  'function move(dir){let moved=false;',
  '  if(dir===0){grid=grid.map(r=>{const n=slide(r);if(n.join()!==r.join())moved=true;return n;});}',
  '  if(dir===2){grid=grid.map(r=>{const n=slide([...r].reverse()).reverse();if(n.join()!==r.join())moved=true;return n;});}',
  '  if(dir===1||dir===3){let t=Array(4).fill(null).map(()=>Array(4).fill(0));for(let r=0;r<4;r++)for(let c=0;c<4;c++)t[c][r]=grid[r][c];t=t.map(r=>dir===1?slide(r):slide([...r].reverse()).reverse());for(let r=0;r<4;r++)for(let c=0;c<4;c++){if(t[c][r]!==grid[r][c])moved=true;grid[r][c]=t[c][r];}}',
  '  if(moved){addRandom();draw();}',
  '  if(grid.flat().every(v=>v>0)){let ok=false;for(let r=0;r<4;r++)for(let c=0;c<4;c++){if(c<3&&grid[r][c]===grid[r][c+1])ok=true;if(r<3&&grid[r][c]===grid[r+1][c])ok=true;}if(!ok){over=true;draw();}}',
  '}',
  'addRandom();addRandom();draw();',
  'document.addEventListener("keydown",e=>{if(over)return;const k={"ArrowLeft":0,"ArrowRight":2,"ArrowUp":3,"ArrowDown":1}[e.key];if(k!==undefined){e.preventDefault();move(k);}});',
].join('\n')

const DEMO_GAMES = [
  { id:'snake',    name:'Snake Classic',  emoji:'🐍', color:'#071a0f', addedDate:'Built-in', code: [
  'const canvas=document.getElementById("c");const ctx=canvas.getContext("2d");',
  'canvas.width=400;canvas.height=400;',
  'let snake=[{x:10,y:10}],dir={x:1,y:0},food={x:15,y:15},score=0,running=true;',
  'const S=20;',
  'function rand(n){return Math.floor(Math.random()*n);}',
  'function placeFood(){food={x:rand(20),y:rand(20)};}',
  'function draw(){',
  '  ctx.fillStyle="#03070f";ctx.fillRect(0,0,400,400);',
  '  ctx.strokeStyle="#0a1a14";ctx.lineWidth=0.5;',
  '  for(let i=0;i<20;i++){ctx.beginPath();ctx.moveTo(i*S,0);ctx.lineTo(i*S,400);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*S);ctx.lineTo(400,i*S);ctx.stroke();}',
  '  ctx.fillStyle="#FB923C";ctx.beginPath();ctx.arc(food.x*S+S/2,food.y*S+S/2,7,0,Math.PI*2);ctx.fill();',
  '  snake.forEach((s,i)=>{ctx.fillStyle=i===0?"#00F5D2":"#00a88a";ctx.beginPath();ctx.roundRect(s.x*S+1,s.y*S+1,S-2,S-2,4);ctx.fill();});',
  '  ctx.fillStyle="#e8f0ed";ctx.font="bold 13px monospace";ctx.fillText("Score: "+score,8,16);',
  '}',
  'function step(){',
  '  if(!running)return;',
  '  const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};',
  '  if(head.x<0||head.x>=20||head.y<0||head.y>=20||snake.some(s=>s.x===head.x&&s.y===head.y)){',
  '    ctx.fillStyle="rgba(0,0,0,0.78)";ctx.fillRect(0,0,400,400);',
  '    ctx.fillStyle="#00F5D2";ctx.font="bold 26px monospace";ctx.textAlign="center";',
  '    ctx.fillText("GAME OVER",200,170);ctx.font="14px monospace";ctx.fillStyle="#6b9e94";',
  '    ctx.fillText("Score: "+score,200,204);ctx.fillText("Press R to restart",200,230);running=false;return;',
  '  }',
  '  snake.unshift(head);',
  '  if(head.x===food.x&&head.y===food.y){score++;placeFood();}else{snake.pop();}',
  '  draw();',
  '}',
  'document.addEventListener("keydown",e=>{',
  '  if(e.key==="ArrowUp"&&dir.y===0)dir={x:0,y:-1};',
  '  if(e.key==="ArrowDown"&&dir.y===0)dir={x:0,y:1};',
  '  if(e.key==="ArrowLeft"&&dir.x===0)dir={x:-1,y:0};',
  '  if(e.key==="ArrowRight"&&dir.x===0)dir={x:1,y:0};',
  '  if(e.key==="r"||e.key==="R"){snake=[{x:10,y:10}];dir={x:1,y:0};score=0;running=true;placeFood();}',
  '});',
  'placeFood();draw();setInterval(step,120);',
].join('\n') },
  { id:'breakout', name:'Breakout',        emoji:'🧱', color:'#071020', addedDate:'Built-in', code: [
  'const canvas=document.getElementById("c");const ctx=canvas.getContext("2d");',
  'canvas.width=480;canvas.height=480;',
  'let paddle={x:190,y:450,w:100,h:12},ball={x:240,y:400,vx:3,vy:-4,r:8},bricks=[],score=0,lives=3,running=true;',
  'const cols=8,rows=5,bw=50,bh=18,gap=6,ox=16,oy=50;',
  'const colors=["#00F5D2","#0EA5E9","#818CF8","#FB923C","#FBBF24"];',
  'function initBricks(){bricks=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)bricks.push({x:ox+c*(bw+gap),y:oy+r*(bh+gap),alive:true,color:colors[r%colors.length]});}',
  'initBricks();',
  'document.addEventListener("mousemove",e=>{const rect=canvas.getBoundingClientRect();paddle.x=e.clientX-rect.left-paddle.w/2;});',
  'document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")paddle.x-=20;if(e.key==="ArrowRight")paddle.x+=20;});',
  'function draw(){',
  '  ctx.fillStyle="#03070f";ctx.fillRect(0,0,480,480);',
  '  bricks.forEach(b=>{if(!b.alive)return;ctx.fillStyle=b.color;ctx.beginPath();ctx.roundRect(b.x,b.y,bw,bh,4);ctx.fill();});',
  '  ctx.fillStyle="rgba(0,245,210,0.85)";ctx.beginPath();ctx.roundRect(paddle.x,paddle.y,paddle.w,paddle.h,6);ctx.fill();',
  '  ctx.fillStyle="#FB923C";ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fill();',
  '  ctx.fillStyle="#e8f0ed";ctx.font="bold 13px monospace";ctx.fillText("Score: "+score,8,16);ctx.fillText("Lives: "+lives,390,16);',
  '}',
  'function step(){',
  '  if(!running)return;',
  '  ball.x+=ball.vx;ball.y+=ball.vy;',
  '  if(ball.x<ball.r||ball.x>480-ball.r)ball.vx*=-1;',
  '  if(ball.y<ball.r)ball.vy*=-1;',
  '  if(ball.y>480){lives--;if(lives<=0){ctx.fillStyle="rgba(0,0,0,0.85)";ctx.fillRect(0,0,480,480);ctx.fillStyle="#00F5D2";ctx.font="bold 26px monospace";ctx.textAlign="center";ctx.fillText("GAME OVER",240,215);running=false;return;}ball.x=240;ball.y=400;}',
  '  if(ball.y+ball.r>paddle.y&&ball.x>paddle.x&&ball.x<paddle.x+paddle.w&&ball.vy>0){ball.vy*=-1;ball.vx+=((ball.x-(paddle.x+paddle.w/2))/50);}',
  '  paddle.x=Math.max(0,Math.min(480-paddle.w,paddle.x));',
  '  bricks.forEach(b=>{if(!b.alive)return;if(ball.x>b.x&&ball.x<b.x+bw&&ball.y>b.y&&ball.y<b.y+bh){b.alive=false;ball.vy*=-1;score+=10;}});',
  '  if(bricks.every(b=>!b.alive)){ctx.fillStyle="rgba(0,0,0,0.85)";ctx.fillRect(0,0,480,480);ctx.fillStyle="#00F5D2";ctx.font="bold 26px monospace";ctx.textAlign="center";ctx.fillText("YOU WIN!",240,215);running=false;return;}',
  '  draw();',
  '}',
  'draw();setInterval(step,1000/60);',
].join('\n') },
  { id:'g2048',    name:'2048',            emoji:'🔢', color:'#100c00', addedDate:'Built-in', code: [
  'const canvas=document.getElementById("c");const ctx=canvas.getContext("2d");',
  'canvas.width=420;canvas.height=480;',
  'const S=90,GAP=10,OFF=30;',
  'let grid=Array(4).fill(null).map(()=>Array(4).fill(0)),score=0,over=false;',
  'const tc={0:"#0d1321",2:"#132a1e",4:"#0c3040",8:"#3d2070",16:"#e94560",32:"#FB923C",64:"#FBBF24",128:"#00F5D2",256:"#0EA5E9",512:"#818CF8",1024:"#FB7185",2048:"#ffffff"};',
  'function addRandom(){const empty=[];for(let r=0;r<4;r++)for(let c=0;c<4;c++)if(grid[r][c]===0)empty.push([r,c]);if(!empty.length)return;const[r,c]=empty[Math.floor(Math.random()*empty.length)];grid[r][c]=Math.random()<0.9?2:4;}',
  'function draw(){',
  '  ctx.fillStyle="#03070f";ctx.fillRect(0,0,420,480);',
  '  ctx.fillStyle="#e8f0ed";ctx.font="bold 15px monospace";ctx.textAlign="left";ctx.textBaseline="top";',
  '  ctx.fillText("2048",16,10);ctx.fillText("Score: "+score,180,10);',
  '  ctx.fillStyle="#060d1a";ctx.beginPath();ctx.roundRect(OFF-GAP,OFF+18,4*(S+GAP)+GAP,4*(S+GAP)+GAP,8);ctx.fill();',
  '  for(let r=0;r<4;r++)for(let c=0;c<4;c++){',
  '    const v=grid[r][c],x=OFF+c*(S+GAP),y=OFF+18+GAP+r*(S+GAP);',
  '    ctx.fillStyle=tc[v]||"#00F5D2";ctx.beginPath();ctx.roundRect(x,y,S,S,6);ctx.fill();',
  '    if(v){ctx.fillStyle=v<=4?"#6b9e94":"#e8f0ed";ctx.font="bold "+(v>=1024?19:v>=128?25:31)+"px monospace";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(v,x+S/2,y+S/2);}',
  '  }',
  '  if(over){ctx.fillStyle="rgba(3,7,15,0.85)";ctx.fillRect(OFF-GAP,OFF+18,4*(S+GAP)+GAP,4*(S+GAP)+GAP);ctx.fillStyle="#00F5D2";ctx.font="bold 28px monospace";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("GAME OVER",210,260);}',
  '}',
  'function slide(row){let r=row.filter(v=>v);for(let i=0;i<r.length-1;i++)if(r[i]===r[i+1]){r[i]*=2;score+=r[i];r.splice(i+1,1);i++;}while(r.length<4)r.push(0);return r;}',
  'function move(dir){let moved=false;',
  '  if(dir===0){grid=grid.map(r=>{const n=slide(r);if(n.join()!==r.join())moved=true;return n;});}',
  '  if(dir===2){grid=grid.map(r=>{const n=slide([...r].reverse()).reverse();if(n.join()!==r.join())moved=true;return n;});}',
  '  if(dir===1||dir===3){let t=Array(4).fill(null).map(()=>Array(4).fill(0));for(let r=0;r<4;r++)for(let c=0;c<4;c++)t[c][r]=grid[r][c];t=t.map(r=>dir===1?slide(r):slide([...r].reverse()).reverse());for(let r=0;r<4;r++)for(let c=0;c<4;c++){if(t[c][r]!==grid[r][c])moved=true;grid[r][c]=t[c][r];}}',
  '  if(moved){addRandom();draw();}',
  '  if(grid.flat().every(v=>v>0)){let ok=false;for(let r=0;r<4;r++)for(let c=0;c<4;c++){if(c<3&&grid[r][c]===grid[r][c+1])ok=true;if(r<3&&grid[r][c]===grid[r+1][c])ok=true;}if(!ok){over=true;draw();}}',
  '}',
  'addRandom();addRandom();draw();',
  'document.addEventListener("keydown",e=>{if(over)return;const k={"ArrowLeft":0,"ArrowRight":2,"ArrowUp":3,"ArrowDown":1}[e.key];if(k!==undefined){e.preventDefault();move(k);}});',
].join('\n') },
  { id:'tetris',   name:'Tetris',          emoji:'🟦', color:'#07071a', addedDate:'Built-in', code: [
    'const COLS=10,ROWS=20,B=30;',
    'const COLORS=[\'#00f0f0\',\'#f0a000\',\'#a000f0\',\'#00f000\',\'#f00000\',\'#0000f0\',\'#f0f000\'];',
    'const PIECES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0],[1,0],[1,1]],[[0,1],[0,1],[1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]]];',
    'const canvas=document.getElementById(\'c\');',
    'const ctx=canvas.getContext(\'2d\');',
    'canvas.width=COLS*B+160;canvas.height=ROWS*B;',
    'const empty=()=>Array.from({length:ROWS},()=>Array(COLS).fill(0));',
    'const rotate=m=>m[0].map((_,i)=>m.map(r=>r[i]).reverse());',
    'const fits=(board,shape,px,py)=>{for(let r=0;r<shape.length;r++)for(let c=0;c<shape[r].length;c++)if(shape[r][c]){const x=px+c,y=py+r;if(x<0||x>=COLS||y>=ROWS)return false;if(y>=0&&board[y][x])return false;}return true;};',
    'const randPiece=()=>{const i=Math.floor(Math.random()*PIECES.length);return{shape:PIECES[i],color:COLORS[i]};};',
    'let board=empty(),cur=null,nxt=randPiece(),pos={x:3,y:0},score=0,lines=0,level=1,status=\'idle\',ghost=0,dropT=null;',
    'function spawn(){cur=nxt;nxt=randPiece();pos={x:3,y:0};if(!fits(board,cur.shape,pos.x,pos.y)){status=\'over\';}}',
    'function calcGhost(){let gy=pos.y;while(fits(board,cur.shape,pos.x,gy+1))gy++;return gy;}',
    'function lock(){const nb=board.map(r=>[...r]);cur.shape.forEach((r,ri)=>r.forEach((c,ci)=>{if(c)nb[pos.y+ri][pos.x+ci]=cur.color;}));let cleared=0;const f=nb.filter(r=>r.some(c=>!c));cleared=ROWS-f.length;while(f.length<ROWS)f.unshift(Array(COLS).fill(0));board=f;lines+=cleared;score+=[0,100,300,500,800][cleared]*(level||1);level=Math.floor(lines/10)+1;cur=null;startDrop();}',
    'function drawBlock(x,y,color,alpha){ctx.globalAlpha=alpha||1;ctx.fillStyle=color;ctx.fillRect(x*B+1,y*B+1,B-2,B-2);ctx.fillStyle=\'rgba(255,255,255,0.25)\';ctx.fillRect(x*B+1,y*B+1,B-2,4);ctx.fillRect(x*B+1,y*B+1,4,B-2);ctx.fillStyle=\'rgba(0,0,0,0.3)\';ctx.fillRect(x*B+1,y*B+B-5,B-2,4);ctx.fillRect(x*B+B-5,y*B+1,4,B-2);ctx.globalAlpha=1;}',
    'function drawNext(){const ox=COLS*B+20,oy=60;ctx.fillStyle=\'#0f0f1a\';ctx.fillRect(ox-5,oy-5,140,90);const sh=nxt.shape;sh.forEach((r,ri)=>r.forEach((c,ci)=>{if(c){const bx=ox+(ci*25),by=oy+(ri*25);ctx.fillStyle=nxt.color;ctx.fillRect(bx+1,by+1,23,23);ctx.fillStyle=\'rgba(255,255,255,0.2)\';ctx.fillRect(bx+1,by+1,23,4);}}));}',
    'function draw(){ctx.fillStyle=\'#07071a\';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle=\'#13132e\';ctx.lineWidth=0.5;for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)ctx.strokeRect(c*B,r*B,B,B);board.forEach((row,r)=>row.forEach((col,c)=>{if(col)drawBlock(c,r,col);}));if(cur){ghost=calcGhost();cur.shape.forEach((r,ri)=>r.forEach((c,ci)=>{if(c)drawBlock(pos.x+ci,ghost+ri,cur.color,0.18);}));cur.shape.forEach((r,ri)=>r.forEach((c,ci)=>{if(c)drawBlock(pos.x+ci,pos.y+ri,cur.color);}));}',
    'const px=COLS*B+10;ctx.fillStyle=\'#888\';ctx.font=\'10px monospace\';ctx.fillText(\'NEXT\',px+10,20);drawNext();ctx.fillText(\'SCORE\',px+5,175);ctx.fillStyle=\'#0ff\';ctx.font=\'bold 18px monospace\';ctx.fillText(score,px+5,197);ctx.fillStyle=\'#888\';ctx.font=\'10px monospace\';ctx.fillText(\'LINES\',px+5,225);ctx.fillStyle=\'#0f0\';ctx.font=\'bold 18px monospace\';ctx.fillText(lines,px+5,247);ctx.fillStyle=\'#888\';ctx.font=\'10px monospace\';ctx.fillText(\'LEVEL\',px+5,275);ctx.fillStyle=\'#f0a\';ctx.font=\'bold 18px monospace\';ctx.fillText(level,px+5,297);',
    'if(status===\'idle\'||status===\'over\'){ctx.fillStyle=\'rgba(0,0,0,0.75)\';ctx.fillRect(0,0,COLS*B,ROWS*B);ctx.textAlign=\'center\';if(status===\'over\'){ctx.fillStyle=\'#f05\';ctx.font=\'bold 28px monospace\';ctx.fillText(\'GAME OVER\',COLS*B/2,ROWS*B/2-30);ctx.fillStyle=\'#aaa\';ctx.font=\'14px monospace\';ctx.fillText(\'Score: \'+score,COLS*B/2,ROWS*B/2);}else{ctx.fillStyle=\'#0ff\';ctx.font=\'bold 36px monospace\';ctx.fillText(\'TETRIS\',COLS*B/2,ROWS*B/2-20);}ctx.fillStyle=\'#fff\';ctx.font=\'16px monospace\';ctx.fillText(\'Press ENTER to \'+(status===\'over\'?\'retry\':\'start\'),COLS*B/2,ROWS*B/2+36);ctx.textAlign=\'left\';}',
    'if(status===\'paused\'){ctx.fillStyle=\'rgba(0,0,0,0.6)\';ctx.fillRect(0,0,COLS*B,ROWS*B);ctx.fillStyle=\'#ff0\';ctx.font=\'bold 32px monospace\';ctx.textAlign=\'center\';ctx.fillText(\'PAUSED\',COLS*B/2,ROWS*B/2);ctx.textAlign=\'left\';}}',
    'function startDrop(){clearInterval(dropT);if(status===\'playing\')dropT=setInterval(()=>{if(!cur){spawn();}else if(fits(board,cur.shape,pos.x,pos.y+1)){pos.y++;}else{lock();}draw();},Math.max(80,800-(level-1)*70));}',
    'document.addEventListener(\'keydown\',e=>{if(status===\'idle\'||status===\'over\'){if(e.key===\'Enter\'){board=empty();score=0;lines=0;level=1;nxt=randPiece();status=\'playing\';spawn();startDrop();draw();}return;}if(e.key===\'p\'||e.key===\'Escape\'){status=status===\'paused\'?\'playing\':\'paused\';if(status===\'playing\')startDrop();else clearInterval(dropT);draw();return;}if(status!==\'playing\'||!cur)return;if(e.key===\'ArrowLeft\'&&fits(board,cur.shape,pos.x-1,pos.y)){pos.x--;draw();}if(e.key===\'ArrowRight\'&&fits(board,cur.shape,pos.x+1,pos.y)){pos.x++;draw();}if(e.key===\'ArrowDown\'){if(fits(board,cur.shape,pos.x,pos.y+1)){pos.y++;}else lock();draw();}if(e.key===\'ArrowUp\'||e.key===\'x\'){const r=rotate(cur.shape);if(fits(board,r,pos.x,pos.y))cur.shape=r;else if(fits(board,r,pos.x+1,pos.y)){cur.shape=r;pos.x++;}else if(fits(board,r,pos.x-1,pos.y)){cur.shape=r;pos.x--;}draw();}if(e.key===\' \'){e.preventDefault();let gy=pos.y;while(fits(board,cur.shape,pos.x,gy+1))gy++;score+=(gy-pos.y)*2;pos.y=gy;lock();draw();}});',
    'draw();'
  ].join("\n") },
  { id:'pacman',   name:'Pac-Man',         emoji:'🟡', color:'#000022', addedDate:'Built-in', code: [
    'const canvas=document.getElementById(\'c\');const ctx=canvas.getContext(\'2d\');',
    'const TS=20,COLS=21,ROWS=21;',
    'canvas.width=COLS*TS;canvas.height=ROWS*TS+40;',
    'const MAP=[',
    '  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],',
    '  [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],',
    '  [1,3,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,3,1],',
    '  [1,2,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,2,1],',
    '  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],',
    '  [1,2,1,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,1,2,1],',
    '  [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1],',
    '  [1,1,1,1,2,1,1,1,0,0,0,0,0,1,1,1,2,1,1,1,1],',
    '  [1,1,1,1,2,1,0,0,0,0,0,0,0,0,0,1,2,1,1,1,1],',
    '  [1,1,1,1,2,0,0,1,0,0,0,0,0,1,0,0,2,1,1,1,1],',
    '  [0,0,0,0,2,0,0,1,0,0,0,0,0,1,0,0,2,0,0,0,0],',
    '  [1,1,1,1,2,0,0,1,1,1,1,1,1,1,0,0,2,1,1,1,1],',
    '  [1,1,1,1,2,1,0,0,0,0,0,0,0,0,0,1,2,1,1,1,1],',
    '  [1,1,1,1,2,1,0,0,0,0,0,0,0,0,0,1,2,1,1,1,1],',
    '  [1,1,1,1,2,1,1,1,0,0,0,0,0,1,1,1,2,1,1,1,1],',
    '  [1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],',
    '  [1,2,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,2,1],',
    '  [1,3,2,1,2,2,2,2,2,2,0,2,2,2,2,2,2,1,2,3,1],',
    '  [1,1,2,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,2,1,1],',
    '  [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1],',
    '  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],',
    '];',
    'let grid=MAP.map(r=>[...r]);',
    'let pac={x:10,y:15,dx:0,dy:0,ndx:1,ndy:0,mouth:0,mdir:1};',
    'let ghosts=[',
    '  {x:9,y:9,dx:1,dy:0,color:\'#ff0000\',scared:false,home:true,timer:60},',
    '  {x:10,y:9,dx:-1,dy:0,color:\'#ffb8ff\',scared:false,home:true,timer:100},',
    '  {x:11,y:9,dx:0,dy:1,color:\'#00ffff\',scared:false,home:true,timer:140},',
    '  {x:10,y:10,dx:0,dy:-1,color:\'#ffb852\',scared:false,home:true,timer:180},',
    '];',
    'let score=0,lives=3,scared=0,status=\'idle\',pellets=0;',
    'for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(grid[r][c]===2||grid[r][c]===3)pellets++;',
    'function wall(r,c){if(r<0||r>=ROWS||c<0||c>=COLS)return true;return grid[r][c]===1;}',
    'function moveGhost(g){',
    '  if(g.home){g.timer--;if(g.timer>0)return;g.home=false;}',
    '  const dirs=[[0,-1],[0,1],[-1,0],[1,0]];',
    '  const valid=dirs.filter(([dx,dy])=>!wall(g.y+dy,g.x+dx));',
    '  const noBack=valid.filter(([dx,dy])=>!(dx===-g.dx&&dy===-g.dy));',
    '  const candidates=noBack.length?noBack:valid;',
    '  let best=candidates[0];',
    '  if(!g.scared){',
    '    let bestD=9999;',
    '    candidates.forEach(([dx,dy])=>{const d=Math.hypot(pac.x-(g.x+dx),pac.y-(g.y+dy));if(d<bestD){bestD=d;best=[dx,dy];}});',
    '  }else{',
    '    let bestD=-1;',
    '    candidates.forEach(([dx,dy])=>{const d=Math.hypot(pac.x-(g.x+dx),pac.y-(g.y+dy));if(d>bestD){bestD=d;best=[dx,dy];}});',
    '  }',
    '  g.dx=best[0];g.dy=best[1];',
    '  g.x+=g.dx;g.y+=g.dy;',
    '  g.x=(g.x+COLS)%COLS;g.y=(g.y+ROWS)%ROWS;',
    '}',
    'function draw(){',
    '  ctx.fillStyle=\'#000\';ctx.fillRect(0,0,canvas.width,canvas.height);',
    '  for(let r=0;r<ROWS;r++){',
    '    for(let c=0;c<COLS;c++){',
    '      const t=grid[r][c];',
    '      if(t===1){ctx.fillStyle=\'#1a1aff\';ctx.fillRect(c*TS,r*TS,TS,TS);ctx.strokeStyle=\'#0000aa\';ctx.strokeRect(c*TS+1,r*TS+1,TS-2,TS-2);}',
    '      else if(t===2){ctx.fillStyle=\'#ffff00\';ctx.beginPath();ctx.arc(c*TS+TS/2,r*TS+TS/2,2.5,0,Math.PI*2);ctx.fill();}',
    '      else if(t===3){ctx.fillStyle=\'#ffaaff\';ctx.beginPath();ctx.arc(c*TS+TS/2,r*TS+TS/2,6,0,Math.PI*2);ctx.fill();}',
    '    }',
    '  }',
    '  // Pac-Man',
    '  const px=pac.x*TS+TS/2,py=pac.y*TS+TS/2;',
    '  const angle=Math.atan2(pac.dy,pac.dx)||0;',
    '  pac.mouth+=0.15*pac.mdir;',
    '  if(pac.mouth>0.35||pac.mouth<0.02)pac.mdir*=-1;',
    '  ctx.fillStyle=\'#ffff00\';',
    '  ctx.beginPath();ctx.moveTo(px,py);',
    '  ctx.arc(px,py,TS/2-1,angle+pac.mouth,angle+Math.PI*2-pac.mouth);',
    '  ctx.closePath();ctx.fill();',
    '  // Ghosts',
    '  ghosts.forEach(g=>{',
    '    if(g.home)return;',
    '    const gx=g.x*TS,gy=g.y*TS;',
    '    ctx.fillStyle=g.scared?(scared<80&&scared%20<10?\'#ffffff\':\'#0000ff\'):g.color;',
    '    ctx.beginPath();ctx.arc(gx+TS/2,gy+5,TS/2-1,Math.PI,0);',
    '    ctx.lineTo(gx+TS-1,gy+TS);',
    '    for(let i=0;i<3;i++){ctx.lineTo(gx+TS-1-(i*(TS/3)),gy+TS-(i%2===0?5:0));}',
    '    ctx.lineTo(gx+1,gy+TS);ctx.closePath();ctx.fill();',
    '    if(!g.scared){ctx.fillStyle=\'#fff\';ctx.beginPath();ctx.arc(gx+6,gy+8,3,0,Math.PI*2);ctx.arc(gx+14,gy+8,3,0,Math.PI*2);ctx.fill();ctx.fillStyle=\'#00f\';ctx.beginPath();ctx.arc(gx+6+g.dx,gy+8+g.dy,1.5,0,Math.PI*2);ctx.arc(gx+14+g.dx,gy+8+g.dy,1.5,0,Math.PI*2);ctx.fill();}',
    '  });',
    '  // HUD',
    '  const hy=ROWS*TS+8;',
    '  ctx.fillStyle=\'#ffff00\';ctx.font=\'bold 13px monospace\';ctx.fillText(\'Score: \'+score,8,hy+14);',
    '  for(let i=0;i<lives;i++){ctx.beginPath();ctx.arc(canvas.width-30-(i*22),hy+8,7,0.2,Math.PI*2-0.2);ctx.fill();}',
    '  if(status===\'idle\'||status===\'over\'||status===\'win\'){',
    '    ctx.fillStyle=\'rgba(0,0,0,0.7)\';ctx.fillRect(0,0,COLS*TS,ROWS*TS);',
    '    ctx.textAlign=\'center\';',
    '    if(status===\'win\'){ctx.fillStyle=\'#0f0\';ctx.font=\'bold 28px monospace\';ctx.fillText(\'YOU WIN!\',COLS*TS/2,ROWS*TS/2-20);}',
    '    else if(status===\'over\'){ctx.fillStyle=\'#f00\';ctx.font=\'bold 28px monospace\';ctx.fillText(\'GAME OVER\',COLS*TS/2,ROWS*TS/2-20);}',
    '    else{ctx.fillStyle=\'#ff0\';ctx.font=\'bold 28px monospace\';ctx.fillText(\'PAC-MAN\',COLS*TS/2,ROWS*TS/2-20);}',
    '    ctx.fillStyle=\'#fff\';ctx.font=\'16px monospace\';ctx.fillText(\'Score: \'+score,COLS*TS/2,ROWS*TS/2+10);',
    '    ctx.fillText(\'Press ENTER\',COLS*TS/2,ROWS*TS/2+36);ctx.textAlign=\'left\';',
    '  }',
    '  if(status===\'paused\'){ctx.fillStyle=\'rgba(0,0,0,0.5)\';ctx.fillRect(0,0,COLS*TS,ROWS*TS);ctx.fillStyle=\'#ff0\';ctx.font=\'bold 28px monospace\';ctx.textAlign=\'center\';ctx.fillText(\'PAUSED\',COLS*TS/2,ROWS*TS/2);ctx.textAlign=\'left\';}',
    '}',
    'let tick=0;',
    'function update(){',
    '  if(status!==\'playing\')return;',
    '  tick++;',
    '  // Try buffered direction first',
    '  if(!wall(pac.y+pac.ndy,pac.x+pac.ndx)){pac.dx=pac.ndx;pac.dy=pac.ndy;}',
    '  if(!wall(pac.y+pac.dy,pac.x+pac.dx)){pac.x+=pac.dx;pac.y+=pac.dy;pac.x=(pac.x+COLS)%COLS;pac.y=(pac.y+ROWS)%ROWS;}',
    '  // Eat',
    '  const t=grid[pac.y][pac.x];',
    '  if(t===2){grid[pac.y][pac.x]=0;score+=10;pellets--;if(pellets<=0)status=\'win\';}',
    '  if(t===3){grid[pac.y][pac.x]=0;score+=50;pellets--;scared=300;ghosts.forEach(g=>g.scared=true);}',
    '  if(scared>0){scared--;if(scared===0)ghosts.forEach(g=>g.scared=false);}',
    '  // Move ghosts every 3 ticks',
    '  if(tick%3===0)ghosts.forEach(g=>moveGhost(g));',
    '  // Collision',
    '  ghosts.forEach(g=>{',
    '    if(g.home)return;',
    '    if(Math.abs(g.x-pac.x)<1&&Math.abs(g.y-pac.y)<1){',
    '      if(g.scared){g.scared=false;g.home=true;g.timer=120;score+=200;}',
    '      else{lives--;if(lives<=0)status=\'over\';else{pac.x=10;pac.y=15;pac.dx=0;pac.dy=0;}}',
    '    }',
    '  });',
    '}',
    'document.addEventListener(\'keydown\',e=>{',
    '  if(status===\'idle\'||status===\'over\'||status===\'win\'){',
    '    if(e.key===\'Enter\'){grid=MAP.map(r=>[...r]);score=0;lives=3;scared=0;tick=0;pellets=0;for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(grid[r][c]===2||grid[r][c]===3)pellets++;pac={x:10,y:15,dx:0,dy:0,ndx:1,ndy:0,mouth:0,mdir:1};ghosts=[{x:9,y:9,dx:1,dy:0,color:\'#ff0000\',scared:false,home:true,timer:60},{x:10,y:9,dx:-1,dy:0,color:\'#ffb8ff\',scared:false,home:true,timer:100},{x:11,y:9,dx:0,dy:1,color:\'#00ffff\',scared:false,home:true,timer:140},{x:10,y:10,dx:0,dy:-1,color:\'#ffb852\',scared:false,home:true,timer:180}];status=\'playing\';}return;',
    '  }',
    '  if(e.key===\'p\'||e.key===\'Escape\'){status=status===\'paused\'?\'playing\':\'paused\';return;}',
    '  const map={\'ArrowLeft\':[-1,0],\'ArrowRight\':[1,0],\'ArrowUp\':[0,-1],\'ArrowDown\':[0,1]};',
    '  if(map[e.key]){e.preventDefault();[pac.ndx,pac.ndy]=map[e.key];}',
    '});',
    'setInterval(()=>{update();draw();},1000/15);',
    'draw();'
  ].join("\n") },
  { id:'space',    name:'Space Invaders',  emoji:'👾', color:'#000800', addedDate:'Built-in', code: [
    'const canvas=document.getElementById(\'c\');const ctx=canvas.getContext(\'2d\');',
    'canvas.width=600;canvas.height=650;',
    'const W=600,H=650;',
    'let player={x:280,y:590,w:40,h:16,speed:5,cooldown:0};',
    'let bullets=[],ebullets=[],aliens=[],particles=[],barriers=[];',
    'let score=0,lives=3,wave=1,status=\'idle\',tick=0,alienDir=1,alienSpeed=0.3,alienDrop=false,ufoX=-1,ufoDir=1,ufoTimer=400;',
    'function initAliens(){aliens=[];for(let r=0;r<4;r++)for(let c=0;c<11;c++){const t=r<1?0:r<3?1:2;aliens.push({x:60+c*44,y:60+r*44,t,alive:true,w:28,h:20,anim:0});}}',
    'function initBarriers(){barriers=[];const bx=[80,200,320,440];bx.forEach(bx=>{for(let r=0;r<4;r++)for(let c=0;c<8;c++){barriers.push({x:bx+c*8,y:520+r*8,hp:3,w:8,h:8});}});}',
    'function drawPlayer(){ctx.fillStyle=\'#00ff88\';ctx.fillRect(player.x,player.y+8,player.w,8);ctx.fillRect(player.x+8,player.y+4,player.w-16,4);ctx.fillRect(player.x+16,player.y,8,4);}',
    'function drawAlien(a){',
    '  ctx.fillStyle=a.t===0?\'#ff88ff\':a.t===1?\'#88ffff\':\'#ffff44\';',
    '  if(a.t===0){ctx.fillRect(a.x+4,a.y,20,4);ctx.fillRect(a.x,a.y+4,28,4);ctx.fillRect(a.x+4,a.y+8,20,8);ctx.fillRect(a.x+4,a.y+16,4,4);ctx.fillRect(a.x+20,a.y+16,4,4);if(a.anim){ctx.fillRect(a.x,a.y+8,4,4);ctx.fillRect(a.x+24,a.y+8,4,4);}else{ctx.fillRect(a.x+8,a.y+16,12,4);}}',
    '  else if(a.t===1){ctx.fillRect(a.x+8,a.y,12,4);ctx.fillRect(a.x+4,a.y+4,20,4);ctx.fillRect(a.x,a.y+8,28,8);ctx.fillRect(a.x+4,a.y+16,8,4);ctx.fillRect(a.x+16,a.y+16,8,4);if(a.anim){ctx.fillRect(a.x+4,a.y+8,4,4);ctx.fillRect(a.x+20,a.y+8,4,4);}else{ctx.fillRect(a.x,a.y+8,4,4);ctx.fillRect(a.x+24,a.y+8,4,4);}}',
    '  else{ctx.fillRect(a.x+4,a.y,20,4);ctx.fillRect(a.x,a.y+4,28,8);ctx.fillRect(a.x+4,a.y+12,20,8);if(a.anim){ctx.fillRect(a.x,a.y+4,4,4);ctx.fillRect(a.x+24,a.y+4,4,4);}else{ctx.fillRect(a.x+4,a.y+16,8,4);ctx.fillRect(a.x+16,a.y+16,8,4);}}',
    '}',
    'function spawnParticles(x,y,color){for(let i=0;i<8;i++)particles.push({x,y,vx:(Math.random()-0.5)*4,vy:(Math.random()-0.5)*4,life:30,color});}',
    'function update(){',
    '  if(status!==\'playing\')return;',
    '  tick++;',
    '  if(player.cooldown>0)player.cooldown--;',
    '  // Alien movement',
    '  let minX=999,maxX=-1;',
    '  aliens.filter(a=>a.alive).forEach(a=>{minX=Math.min(minX,a.x);maxX=Math.max(maxX,a.x+a.w);});',
    '  if(maxX>W-10||minX<10){alienDir*=-1;alienDrop=true;alienSpeed+=0.04;}',
    '  aliens.filter(a=>a.alive).forEach(a=>{a.x+=alienDir*alienSpeed;if(alienDrop)a.y+=12;if(a.y+a.h>player.y)status=\'over\';});',
    '  if(alienDrop)alienDrop=false;',
    '  // Animate aliens every 20 ticks',
    '  if(tick%20===0)aliens.forEach(a=>a.anim=1-a.anim);',
    '  // Alien shoot',
    '  if(tick%35===0){const alive=aliens.filter(a=>a.alive);if(alive.length){const a=alive[Math.floor(Math.random()*alive.length)];ebullets.push({x:a.x+14,y:a.y+20,vy:3.5});}}',
    '  // UFO',
    '  ufoTimer--;if(ufoTimer<=0){if(ufoX<0){ufoX=ufoDir>0?0:W;ufoTimer=600;}else{ufoX+=ufoDir*2;if(ufoX>W+40||ufoX<-40){ufoX=-1;ufoDir*=-1;ufoTimer=800;}}}',
    '  // Move bullets',
    '  bullets=bullets.filter(b=>{b.y-=9;return b.y>0;});',
    '  ebullets=ebullets.filter(b=>{b.y+=b.vy;return b.y<H;});',
    '  // Bullet-alien collision',
    '  bullets.forEach(b=>{',
    '    if(ufoX>0&&Math.abs(b.x-ufoX)<18&&b.y<26){score+=500;spawnParticles(ufoX,16,\'#ff00ff\');ufoX=-1;ufoTimer=600;b.dead=true;return;}',
    '    aliens.filter(a=>a.alive).forEach(a=>{if(b.x>a.x&&b.x<a.x+a.w&&b.y>a.y&&b.y<a.y+a.h){a.alive=false;score+=[30,20,10][a.t];spawnParticles(a.x+14,a.y+10,a.t===0?\'#ff88ff\':a.t===1?\'#88ffff\':\'#ffff44\');b.dead=true;}});',
    '    barriers.forEach(bar=>{if(b.x>bar.x&&b.x<bar.x+bar.w&&b.y>bar.y&&b.y<bar.y+bar.h){bar.hp--;if(bar.hp<=0)bar.dead=true;b.dead=true;}});',
    '  });',
    '  bullets=bullets.filter(b=>!b.dead);',
    '  // Enemy bullet-player collision',
    '  ebullets.forEach(b=>{',
    '    barriers.forEach(bar=>{if(b.x>bar.x&&b.x<bar.x+bar.w&&b.y>bar.y&&b.y<bar.y+bar.h){bar.hp--;if(bar.hp<=0)bar.dead=true;b.dead=true;}});',
    '    if(!b.dead&&b.x>player.x&&b.x<player.x+player.w&&b.y>player.y&&b.y<player.y+player.h+8){lives--;spawnParticles(player.x+20,player.y+8,\'#00ff88\');b.dead=true;player.x=280;if(lives<=0)status=\'over\';}',
    '  });',
    '  ebullets=ebullets.filter(b=>!b.dead);',
    '  barriers=barriers.filter(b=>!b.dead);',
    '  particles=particles.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.life--;return p.life>0;});',
    '  if(aliens.every(a=>!a.alive)){wave++;alienSpeed=0.3+wave*0.08;initAliens();initBarriers();}',
    '}',
    'function draw(){',
    '  ctx.fillStyle=\'#000\';ctx.fillRect(0,0,W,H);',
    '  ctx.strokeStyle=\'#003300\';ctx.lineWidth=0.3;for(let i=0;i<W;i+=40)ctx.strokeRect(i,0,40,H);',
    '  if(status===\'idle\'||status===\'over\'){',
    '    ctx.fillStyle=\'rgba(0,0,0,0.6)\';ctx.fillRect(0,0,W,H);',
    '    ctx.textAlign=\'center\';',
    '    if(status===\'over\'){ctx.fillStyle=\'#f00\';ctx.font=\'bold 36px monospace\';ctx.fillText(\'GAME OVER\',W/2,H/2-40);}',
    '    else{ctx.fillStyle=\'#0f0\';ctx.font=\'bold 40px monospace\';ctx.fillText(\'SPACE\',W/2,H/2-60);ctx.fillStyle=\'#88ffff\';ctx.fillText(\'INVADERS\',W/2,H/2-20);}',
    '    ctx.fillStyle=\'#fff\';ctx.font=\'18px monospace\';ctx.fillText(\'Score: \'+score,W/2,H/2+20);ctx.fillText(\'Wave: \'+wave,W/2,H/2+48);ctx.fillText(\'Press ENTER\',W/2,H/2+80);ctx.textAlign=\'left\';return;',
    '  }',
    '  if(status===\'paused\'){ctx.fillStyle=\'rgba(0,0,0,0.5)\';ctx.fillRect(0,0,W,H);ctx.fillStyle=\'#ff0\';ctx.font=\'bold 32px monospace\';ctx.textAlign=\'center\';ctx.fillText(\'PAUSED\',W/2,H/2);ctx.textAlign=\'left\';return;}',
    '  aliens.filter(a=>a.alive).forEach(a=>drawAlien(a));',
    '  // UFO',
    '  if(ufoX>0){ctx.fillStyle=\'#ff00ff\';ctx.beginPath();ctx.arc(ufoX,18,18,0,Math.PI*2);ctx.fill();ctx.fillStyle=\'#ff88ff\';ctx.beginPath();ctx.ellipse(ufoX,14,24,8,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=\'#ff00ff\';ctx.fillText(\'500\',ufoX-12,22);}',
    '  drawPlayer();',
    '  ctx.fillStyle=\'#00ff88\';bullets.forEach(b=>{ctx.fillRect(b.x-1,b.y,3,10);});',
    '  ctx.fillStyle=\'#ff4444\';ebullets.forEach(b=>{ctx.fillRect(b.x-2,b.y,4,10);});',
    '  barriers.forEach(b=>{const a=b.hp/3;ctx.fillStyle=\'rgba(0,255,68,\'+a+\')\';ctx.fillRect(b.x,b.y,b.w,b.h);});',
    '  particles.forEach(p=>{ctx.globalAlpha=p.life/30;ctx.fillStyle=p.color;ctx.fillRect(p.x-2,p.y-2,4,4);});',
    '  ctx.globalAlpha=1;',
    '  ctx.strokeStyle=\'#00ff88\';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,H-28);ctx.lineTo(W,H-28);ctx.stroke();',
    '  ctx.fillStyle=\'#0f0\';ctx.font=\'bold 13px monospace\';ctx.fillText(\'Score: \'+score,10,H-10);ctx.fillText(\'Wave: \'+wave,W/2-30,H-10);',
    '  for(let i=0;i<lives;i++){ctx.fillStyle=\'#00ff88\';ctx.fillRect(W-20-(i*22),H-20,16,8);}',
    '}',
    'const keys={};',
    'document.addEventListener(\'keydown\',e=>{',
    '  keys[e.key]=true;',
    '  if(status===\'idle\'||status===\'over\'){if(e.key===\'Enter\'){score=0;lives=3;wave=1;alienSpeed=0.3;alienDir=1;ufoX=-1;ufoTimer=400;initAliens();initBarriers();bullets=[];ebullets=[];particles=[];status=\'playing\';}return;}',
    '  if(e.key===\'p\'||e.key===\'Escape\'){status=status===\'paused\'?\'playing\':\'paused\';}',
    '  if(e.key===\' \'&&status===\'playing\'&&player.cooldown<=0){e.preventDefault();bullets.push({x:player.x+20,y:player.y});player.cooldown=14;}',
    '});',
    'document.addEventListener(\'keyup\',e=>{keys[e.key]=false;});',
    'setInterval(()=>{',
    '  if(status===\'playing\'){',
    '    if(keys[\'ArrowLeft\']&&player.x>0)player.x-=player.speed;',
    '    if(keys[\'ArrowRight\']&&player.x<W-player.w)player.x+=player.speed;',
    '    if(keys[\' \']&&player.cooldown<=0){bullets.push({x:player.x+20,y:player.y});player.cooldown=14;}',
    '  }',
    '  update();draw();',
    '},1000/60);',
    'draw();'
  ].join("\n") },
  { id:'dungeon',  name:'Shadow Dungeon',  emoji:'⚔️', color:'#08030f', addedDate:'Built-in', code: [
    'const canvas=document.getElementById(\'c\');const ctx=canvas.getContext(\'2d\');',
    'canvas.width=800;canvas.height=560;',
    'const W=800,H=560,TILE=32;',
    'const BIOMES=[',
    '  {name:\'Crypt of Shadows\',bg:\'#08030f\',wall:\'#1a0a28\',floor:\'#110520\',accent:\'#7c3aed\',light:\'#a855f7\'},',
    '  {name:\'Volcanic Depths\',bg:\'#0f0400\',wall:\'#2d0a00\',floor:\'#1a0800\',accent:\'#f97316\',light:\'#ef4444\'},',
    '  {name:\'Frozen Catacombs\',bg:\'#010a12\',wall:\'#0a2030\',floor:\'#051525\',accent:\'#38bdf8\',light:\'#7dd3fc\'},',
    '  {name:\'Poison Marshes\',bg:\'#020a02\',wall:\'#0a1f0a\',floor:\'#051205\',accent:\'#4ade80\',light:\'#86efac\'},',
    '  {name:\'The Void Realm\',bg:\'#000008\',wall:\'#080020\',floor:\'#030015\',accent:\'#c026d3\',light:\'#e879f9\'},',
    '  {name:\'Dark Citadel\',bg:\'#050508\',wall:\'#151520\',floor:\'#0a0a12\',accent:\'#94a3b8\',light:\'#cbd5e1\'},',
    '];',
    'let biome=BIOMES[0],biomeIdx=0;',
    'const ETYPES=[',
    '  {name:\'Goblin\',color:\'#4ade80\',r:9,speed:1.2,maxHp:45,dmg:7,xp:20},',
    '  {name:\'Skeleton\',color:\'#e2e8f0\',r:11,speed:0.9,maxHp:60,dmg:10,xp:28},',
    '  {name:\'Demon\',color:\'#dc2626\',r:12,speed:1.1,maxHp:90,dmg:15,xp:50},',
    '  {name:\'Wraith\',color:\'#93c5fd\',r:10,speed:1.4,maxHp:65,dmg:9,xp:42},',
    '  {name:\'Troll\',color:\'#a16207\',r:18,speed:0.6,maxHp:160,dmg:20,xp:55},',
    '];',
    '// Map generation',
    'const COLS=25,ROWS=17;',
    'let map=[],rooms=[],enemies=[],bullets=[],particles=[],items=[];',
    'let player={x:200,y:200,hp:120,maxHp:120,xp:0,xpNext:100,level:1,dmg:22,speed:3.2,r:12,atkCd:0,invincible:0,souls:0,kills:0,dungeonFloor:1};',
    'let cam={x:0,y:0};',
    'let keys={};let score=0;let status=\'idle\';let tick=0;let floor=1;',
    'function mkMap(){',
    '  map=Array.from({length:ROWS},()=>Array(COLS).fill(1));',
    '  rooms=[];',
    '  for(let i=0;i<9;i++){',
    '    const rw=4+Math.floor(Math.random()*5),rh=3+Math.floor(Math.random()*4);',
    '    const rx=1+Math.floor(Math.random()*(COLS-rw-2)),ry=1+Math.floor(Math.random()*(ROWS-rh-2));',
    '    rooms.push({x:rx,y:ry,w:rw,h:rh});',
    '    for(let r=ry;r<ry+rh;r++)for(let c=rx;c<rx+rw;c++)map[r][c]=0;',
    '  }',
    '  for(let i=0;i<rooms.length-1;i++){',
    '    const a=rooms[i],b=rooms[i+1];',
    '    const ax=Math.floor(a.x+a.w/2),ay=Math.floor(a.y+a.h/2);',
    '    const bx=Math.floor(b.x+b.w/2),by=Math.floor(b.y+b.h/2);',
    '    let cx=ax,cy=ay;',
    '    while(cx!==bx){map[cy][cx]=0;cx+=bx>cx?1:-1;}',
    '    while(cy!==by){map[cy][cx]=0;cy+=by>cy?1:-1;}',
    '  }',
    '}',
    'function spawnEnemies(){',
    '  enemies=[];',
    '  rooms.slice(1).forEach(room=>{',
    '    const cnt=2+Math.floor(Math.random()*3)+(floor-1);',
    '    for(let i=0;i<cnt;i++){',
    '      const et=ETYPES[Math.floor(Math.random()*Math.min(ETYPES.length,2+Math.floor(floor/2)))];',
    '      enemies.push({x:(room.x+1+Math.random()*(room.w-2))*TILE+TILE/2,y:(room.y+1+Math.random()*(room.h-2))*TILE+TILE/2,',
    '        hp:et.maxHp+floor*10,maxHp:et.maxHp+floor*10,dmg:et.dmg+floor*2,speed:et.speed,r:et.r,',
    '        color:et.color,name:et.name,xp:et.xp,dx:0,dy:0,atkCd:0,alive:true});',
    '    }',
    '  });',
    '  // Boss',
    '  if(rooms.length>1){',
    '    const boss=rooms[rooms.length-1];',
    '    enemies.push({x:(boss.x+boss.w/2)*TILE,y:(boss.y+boss.h/2)*TILE,hp:400+floor*80,maxHp:400+floor*80,',
    '      dmg:25+floor*5,speed:0.9,r:22,color:biome.accent,name:\'BOSS\',xp:200,dx:0,dy:0,atkCd:0,alive:true,boss:true});',
    '  }',
    '}',
    'function spawnItems(){',
    '  items=[];',
    '  rooms.forEach((room,i)=>{',
    '    if(i>0&&Math.random()>0.5){',
    '      items.push({x:(room.x+Math.floor(room.w/2))*TILE+TILE/2,y:(room.y+Math.floor(room.h/2))*TILE+TILE/2,',
    '        type:Math.random()<0.6?\'hp\':\'xp\',r:8,collected:false});',
    '    }',
    '  });',
    '  // Exit portal',
    '  const last=rooms[rooms.length-1];',
    '  items.push({x:(last.x+Math.floor(last.w/2))*TILE+TILE/2,y:(last.y+Math.floor(last.h/2))*TILE+TILE/2,',
    '    type:\'exit\',r:14,collected:false});',
    '}',
    'function startGame(){',
    '  floor=1;biomeIdx=0;biome=BIOMES[0];',
    '  player={x:0,y:0,hp:120,maxHp:120,xp:0,xpNext:100,level:1,dmg:22,speed:3.2,r:12,atkCd:0,invincible:0,souls:0,kills:0,dungeonFloor:1};',
    '  score=0;',
    '  nextFloor();',
    '  status=\'playing\';',
    '}',
    'function nextFloor(){',
    '  mkMap();',
    '  const start=rooms[0];',
    '  player.x=(start.x+Math.floor(start.w/2))*TILE+TILE/2;',
    '  player.y=(start.y+Math.floor(start.h/2))*TILE+TILE/2;',
    '  player.hp=Math.min(player.maxHp,player.hp+30);',
    '  spawnEnemies();spawnItems();',
    '  bullets=[];particles=[];',
    '  biomeIdx=Math.floor((floor-1)/2)%BIOMES.length;',
    '  biome=BIOMES[biomeIdx];',
    '}',
    'function solid(x,y){const c=Math.floor(x/TILE),r=Math.floor(y/TILE);if(c<0||c>=COLS||r<0||r>=ROWS)return true;return map[r][c]===1;}',
    'function moveEntity(e,dx,dy){',
    '  const nx=e.x+dx,ny=e.y+dy,r=e.r-1;',
    '  const cx=!solid(nx+r,e.y)&&!solid(nx-r,e.y)&&!solid(nx,e.y+r)&&!solid(nx,e.y-r);',
    '  const cy=!solid(e.x+r,ny)&&!solid(e.x-r,ny)&&!solid(e.x,ny+r)&&!solid(e.x,ny-r);',
    '  if(cx)e.x=nx;',
    '  if(cy)e.y=ny;',
    '}',
    'function spawnParticles(x,y,color,n){for(let i=0;i<(n||6);i++)particles.push({x,y,vx:(Math.random()-0.5)*5,vy:(Math.random()-0.5)*5,life:25+Math.random()*15,color,r:2+Math.random()*3});}',
    'function shoot(tx,ty){',
    '  const dx=tx-player.x,dy=ty-player.y,d=Math.hypot(dx,dy)||1;',
    '  bullets.push({x:player.x,y:player.y,vx:dx/d*9,vy:dy/d*9,r:5,life:60,dmg:player.dmg});',
    '}',
    'function update(){',
    '  if(status!==\'playing\')return;',
    '  tick++;',
    '  if(player.atkCd>0)player.atkCd--;',
    '  if(player.invincible>0)player.invincible--;',
    '  // Player move',
    '  let mx=0,my=0;',
    '  if(keys[\'ArrowLeft\']||keys[\'a\'])mx=-1;',
    '  if(keys[\'ArrowRight\']||keys[\'d\'])mx=1;',
    '  if(keys[\'ArrowUp\']||keys[\'w\'])my=-1;',
    '  if(keys[\'ArrowDown\']||keys[\'s\'])my=1;',
    '  if(mx||my){const d=Math.hypot(mx,my);moveEntity(player,mx/d*player.speed,my/d*player.speed);}',
    '  // Camera',
    '  cam.x=Math.max(0,Math.min(COLS*TILE-W,player.x-W/2));',
    '  cam.y=Math.max(0,Math.min(ROWS*TILE-H,player.y-H/2));',
    '  // Enemies',
    '  enemies.forEach(e=>{',
    '    if(!e.alive)return;',
    '    const dx=player.x-e.x,dy=player.y-e.y,d=Math.hypot(dx,dy)||1;',
    '    if(d<350){moveEntity(e,dx/d*e.speed,dy/d*e.speed);}',
    '    if(e.atkCd>0)e.atkCd--;',
    '    if(d<e.r+player.r+4&&e.atkCd<=0&&player.invincible<=0){',
    '      player.hp-=e.dmg;player.invincible=50;e.atkCd=60;',
    '      spawnParticles(player.x,player.y,\'#ff4444\',5);',
    '      if(player.hp<=0){status=\'over\';}',
    '    }',
    '  });',
    '  // Bullets',
    '  bullets=bullets.filter(b=>{',
    '    b.x+=b.vx;b.y+=b.vy;b.life--;',
    '    if(solid(b.x,b.y)||b.life<=0)return false;',
    '    let hit=false;',
    '    enemies.forEach(e=>{if(!e.alive)return;if(Math.hypot(b.x-e.x,b.y-e.y)<b.r+e.r){e.hp-=b.dmg;spawnParticles(e.x,e.y,e.color,4);hit=true;if(e.hp<=0){e.alive=false;player.xp+=e.xp;score+=e.xp*10;player.kills++;player.souls++;spawnParticles(e.x,e.y,e.color,12);while(player.xp>=player.xpNext){player.level++;player.xpNext=Math.floor(player.xpNext*1.4);player.maxHp+=15;player.hp=Math.min(player.maxHp,player.hp+15);player.dmg+=4;player.speed+=0.1;}}}});',
    '    return !hit;',
    '  });',
    '  // Items',
    '  items.forEach(item=>{',
    '    if(item.collected)return;',
    '    if(Math.hypot(player.x-item.x,player.y-item.y)<player.r+item.r){',
    '      item.collected=true;',
    '      if(item.type===\'hp\'){player.hp=Math.min(player.maxHp,player.hp+40);spawnParticles(item.x,item.y,\'#ff4444\',8);}',
    '      else if(item.type===\'xp\'){player.xp+=50;spawnParticles(item.x,item.y,\'#fbbf24\',8);}',
    '      else if(item.type===\'exit\'){floor++;nextFloor();}',
    '    }',
    '  });',
    '  // Particles',
    '  particles=particles.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vx*=0.9;p.vy*=0.9;p.life--;return p.life>0;});',
    '}',
    'function drawHp(x,y,hp,max,r,color){',
    '  const bw=r*2.5,bh=4;',
    '  ctx.fillStyle=\'#200\';ctx.fillRect(x-bw/2,y-r-8,bw,bh);',
    '  ctx.fillStyle=color||\'#f00\';ctx.fillRect(x-bw/2,y-r-8,bw*(hp/max),bh);',
    '}',
    'function draw(){',
    '  ctx.fillStyle=biome.bg;ctx.fillRect(0,0,W,H);',
    '  ctx.save();ctx.translate(-cam.x,-cam.y);',
    '  // Map',
    '  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){',
    '    const t=map[r][c];',
    '    ctx.fillStyle=t===1?biome.wall:biome.floor;',
    '    ctx.fillRect(c*TILE,r*TILE,TILE,TILE);',
    '    if(t===0){ctx.strokeStyle=\'rgba(255,255,255,0.03)\';ctx.lineWidth=0.5;ctx.strokeRect(c*TILE,r*TILE,TILE,TILE);}',
    '  }',
    '  // Items',
    '  items.forEach(item=>{',
    '    if(item.collected)return;',
    '    ctx.save();',
    '    if(item.type===\'exit\'){',
    '      ctx.fillStyle=biome.accent;ctx.globalAlpha=0.5+0.3*Math.sin(tick*0.08);',
    '      ctx.beginPath();ctx.arc(item.x,item.y,item.r+4*Math.sin(tick*0.06),0,Math.PI*2);ctx.fill();',
    '      ctx.globalAlpha=1;ctx.fillStyle=biome.light;ctx.font=\'20px monospace\';ctx.textAlign=\'center\';ctx.fillText(\'⬡\',item.x,item.y+7);',
    '    }else if(item.type===\'hp\'){ctx.fillStyle=\'#ff4444\';ctx.beginPath();ctx.arc(item.x,item.y,item.r,0,Math.PI*2);ctx.fill();ctx.fillStyle=\'#fff\';ctx.font=\'bold 12px monospace\';ctx.textAlign=\'center\';ctx.fillText(\'+\',item.x,item.y+4);}',
    '    else{ctx.fillStyle=\'#fbbf24\';ctx.beginPath();ctx.arc(item.x,item.y,item.r,0,Math.PI*2);ctx.fill();}',
    '    ctx.restore();',
    '  });',
    '  // Enemies',
    '  enemies.forEach(e=>{',
    '    if(!e.alive)return;',
    '    ctx.save();',
    '    if(e.boss){ctx.fillStyle=biome.accent;ctx.globalAlpha=0.15+0.1*Math.sin(tick*0.05);ctx.beginPath();ctx.arc(e.x,e.y,e.r+10,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}',
    '    ctx.fillStyle=e.color;ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.fill();',
    '    ctx.fillStyle=\'rgba(0,0,0,0.4)\';ctx.beginPath();ctx.arc(e.x+2,e.y+2,e.r,0,Math.PI*2);ctx.fill();',
    '    ctx.fillStyle=e.color;ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.fill();',
    '    drawHp(e.x,e.y,e.hp,e.maxHp,e.r,e.boss?biome.accent:\'#f00\');',
    '    ctx.restore();',
    '  });',
    '  // Player',
    '  ctx.save();',
    '  if(player.invincible>0&&Math.floor(tick/4)%2===0){ctx.globalAlpha=0.4;}',
    '  ctx.fillStyle=\'#00F5D2\';ctx.shadowColor=\'#00F5D2\';ctx.shadowBlur=8;',
    '  ctx.beginPath();ctx.arc(player.x,player.y,player.r,0,Math.PI*2);ctx.fill();',
    '  ctx.fillStyle=\'#fff\';ctx.beginPath();ctx.arc(player.x,player.y,player.r*0.45,0,Math.PI*2);ctx.fill();',
    '  ctx.restore();',
    '  // Bullets',
    '  bullets.forEach(b=>{ctx.fillStyle=biome.light;ctx.shadowColor=biome.light;ctx.shadowBlur=6;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;});',
    '  // Particles',
    '  particles.forEach(p=>{ctx.globalAlpha=p.life/40;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});',
    '  ctx.globalAlpha=1;ctx.restore();',
    '  // HUD',
    '  ctx.fillStyle=\'rgba(0,0,0,0.55)\';ctx.fillRect(0,0,W,38);',
    '  // HP bar',
    '  ctx.fillStyle=\'#300\';ctx.fillRect(10,8,200,16);',
    '  ctx.fillStyle=\'#e11\';ctx.fillRect(10,8,200*(player.hp/player.maxHp),16);',
    '  ctx.fillStyle=\'#fff\';ctx.font=\'bold 11px monospace\';ctx.textAlign=\'left\';ctx.fillText(\'HP \'+player.hp+\'/\'+player.maxHp,14,20);',
    '  // XP bar',
    '  ctx.fillStyle=\'#220\';ctx.fillRect(10,26,200,6);',
    '  ctx.fillStyle=\'#fbbf24\';ctx.fillRect(10,26,200*(player.xp/player.xpNext),6);',
    '  ctx.fillStyle=\'#fff\';ctx.font=\'10px monospace\';ctx.fillText(\'Lv \'+player.level+\' | XP \'+player.xp+\'/\'+player.xpNext,215,22);',
    '  ctx.fillText(\'Floor: \'+floor+\' | \'+biome.name,215,35);',
    '  ctx.fillStyle=biome.accent;ctx.font=\'bold 12px monospace\';ctx.textAlign=\'right\';ctx.fillText(\'Score: \'+score,W-10,20);ctx.fillText(\'Kills: \'+player.kills+\' | Souls: \'+player.souls,W-10,35);',
    '  ctx.textAlign=\'left\';',
    '  if(status===\'idle\'||status===\'over\'){',
    '    ctx.fillStyle=\'rgba(0,0,0,0.78)\';ctx.fillRect(0,0,W,H);',
    '    ctx.textAlign=\'center\';',
    '    if(status===\'over\'){ctx.fillStyle=\'#f00\';ctx.font=\'bold 32px monospace\';ctx.fillText(\'YOU DIED\',W/2,H/2-50);}',
    '    else{ctx.fillStyle=biome.accent;ctx.font=\'bold 32px monospace\';ctx.fillText(\'SHADOW\',W/2,H/2-60);ctx.fillStyle=biome.light;ctx.fillText(\'DUNGEON\',W/2,H/2-24);}',
    '    ctx.fillStyle=\'#fff\';ctx.font=\'16px monospace\';ctx.fillText(\'Score: \'+score+\' | Floor: \'+floor,W/2,H/2+10);',
    '    ctx.fillText(\'WASD/Arrows = move\',W/2,H/2+40);ctx.fillText(\'Click to shoot\',W/2,H/2+62);',
    '    ctx.fillText(\'Press ENTER to \'+(status===\'over\'?\'retry\':\'start\'),W/2,H/2+90);ctx.textAlign=\'left\';',
    '  }',
    '}',
    'document.addEventListener(\'keydown\',e=>{',
    '  keys[e.key]=true;',
    '  if((status===\'idle\'||status===\'over\')&&e.key===\'Enter\'){startGame();}',
    '  if(e.key===\'p\'||e.key===\'Escape\'){status=status===\'paused\'?\'playing\':\'paused\';}',
    '});',
    'document.addEventListener(\'keyup\',e=>{keys[e.key]=false;});',
    'canvas.addEventListener(\'click\',e=>{',
    '  if(status!==\'playing\')return;',
    '  const rect=canvas.getBoundingClientRect();',
    '  const mx=e.clientX-rect.left+cam.x,my=e.clientY-rect.top+cam.y;',
    '  if(player.atkCd<=0){shoot(mx,my);player.atkCd=18;}',
    '});',
    'canvas.addEventListener(\'mousemove\',e=>{',
    '  if(status!==\'playing\'||!keys[\' \'])return;',
    '  const rect=canvas.getBoundingClientRect();',
    '  const mx=e.clientX-rect.left+cam.x,my=e.clientY-rect.top+cam.y;',
    '  if(player.atkCd<=0){shoot(mx,my);player.atkCd=18;}',
    '});',
    'setInterval(()=>{update();draw();},1000/60);',
    'draw();'
  ].join("\n") },
]

function stripTS(src: string): string {
  // Remove imports
  src = src.replace(/^import[\s\S]*?from\s+['"][^'"]+['"];?\n?/gm, '')
  src = src.replace(/^import\s+['"][^'"]+['"];?\n?/gm, '')
  // Remove React JSX export default wrapper - extract canvas/DOM code
  src = src.replace(/export\s+default\s+function\s+\w+[\s\S]*$/m, '')
  src = src.replace(/^export\s+(default\s+)?/gm, '')
  // Remove TS syntax
  src = src.replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
  src = src.replace(/type\s+\w+\s*=\s*[^;\n]+/g, '')
  src = src.replace(/:\s*(string|number|boolean|void|any|null|undefined)(\[\])?/g, '')
  src = src.replace(/\b(private|public|protected|readonly|abstract)\s+/g, '')
  src = src.replace(/<[A-Z][\w]*>/g, '')
  // Remove JSX tags
  src = src.replace(/<[a-zA-Z][^>]*\/>/g, '')
  src = src.replace(/<[a-zA-Z][^>]*>[\s\S]*?<\/[a-zA-Z]+>/g, '')
  return src.trim()
}

function buildGameHTML(code: string): string {
  const needCanvas = code.includes('getContext') && !code.includes('createElement("canvas")')
  const idMatch = code.match(/getElementById\("([^"]+)"\)/)
  const cid = idMatch ? idMatch[1] : 'c'
  const canvasTag = needCanvas ? '<canvas id="' + cid + '" tabindex="0"></canvas>' : ''

  const html = [
    '<!DOCTYPE html>',
    '<html><head><meta charset="utf-8"><style>',
    '*{box-sizing:border-box;margin:0;padding:0}',
    'html,body{width:100%;height:100%;overflow:hidden;background:#03070f}',
    'body{display:flex;align-items:center;justify-content:center;font-family:monospace;color:#e8f0ed}',
    'canvas{display:block;max-width:100%;max-height:95vh}',
    '</style></head><body>',
    canvasTag,
    '<div id="game-root"></div>',
    '<script>',
    'window.addEventListener("load",function(){var c=document.querySelector("canvas");if(c){c.setAttribute("tabindex","0");c.focus();}});',
    'window.onerror=function(msg,s,line){',
    '  document.body.innerHTML="<div style=padding:32px;font-family:monospace;text-align:center><h2 style=color:#00F5D2>Error</h2><p style=color:#6b9e94>" + msg + " (line " + line + ")</p></div>";',
    '  return true;',
    '};',
    'try{',
    code,
    '}catch(e){',
    '  document.body.innerHTML="<div style=padding:32px;font-family:monospace;text-align:center><h2 style=color:#00F5D2>Error</h2><p style=color:#6b9e94>" + (e.message||String(e)) + "</p></div>";',
    '}',
    '</script></body></html>',
  ]
  return html.join('\n')
}

function ParticleBackground() {
  const cvRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = cvRef.current
    if (!cv) return
    const cx = cv.getContext('2d')
    if (!cx) return
    let W = window.innerWidth
    let H = window.innerHeight
    let raf = 0
    cv.width = W
    cv.height = H
    const onResize = () => { W = window.innerWidth; H = window.innerHeight; cv.width = W; cv.height = H }
    window.addEventListener('resize', onResize)
    const N = 55
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6,
      op: Math.random() * 0.45 + 0.15,
    }))
    const draw = () => {
      cx.clearRect(0, 0, W, H)
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
      })
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 160) {
            const alpha = (1 - d / 160) * 0.1
            cx.beginPath()
            cx.moveTo(nodes[i].x, nodes[i].y)
            cx.lineTo(nodes[j].x, nodes[j].y)
            cx.strokeStyle = 'rgba(0,245,210,' + alpha + ')'
            cx.lineWidth = 0.7
            cx.stroke()
          }
        }
      }
      nodes.forEach(n => {
        cx.beginPath()
        cx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        cx.fillStyle = 'rgba(0,245,210,' + n.op + ')'
        cx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(raf) }
  }, [])
  return <canvas ref={cvRef} id="bg-canvas" />
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .eyebrow, .section-h, .section-sub')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } })
    }, { threshold: 0.1 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  })
}

function useTyping(words: string[], spd = 70, pause = 2000) {
  const [txt, setTxt] = useState('')
  const st = useRef({ i: 0, ci: 0, del: false })
  useEffect(() => {
    const s = st.current
    const word = words[s.i]
    const t = setTimeout(() => {
      if (!s.del) {
        setTxt(word.slice(0, s.ci + 1))
        s.ci++
        if (s.ci === word.length) setTimeout(() => { s.del = true }, pause)
      } else {
        setTxt(word.slice(0, s.ci - 1))
        s.ci--
        if (s.ci === 0) { s.del = false; s.i = (s.i + 1) % words.length }
      }
    }, s.del ? spd / 2 : spd)
    return () => clearTimeout(t)
  })
  return txt
}

const SK = 'alan_portfolio_games'
type Game = { id: string; name: string; emoji: string; color: string; addedDate: string; code: string }

function loadGames(): Game[] {
  if (typeof window === 'undefined') return []
  try { const s = localStorage.getItem(SK); return s ? JSON.parse(s) : [] } catch { return [] }
}

function GameCenter() {
  const [games, setGames] = useState<Game[]>(() => [...DEMO_GAMES])
  const [ready, setReady] = useState(false)
  const [drag, setDrag] = useState(false)
  const [active, setActive] = useState<Game | null>(null)
  const [showCfg, setShowCfg] = useState(false)
  const [cfgTxt, setCfgTxt] = useState('')
  const fRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const s = loadGames()
    if (s.length) setGames([...DEMO_GAMES, ...s])
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    const up = games.filter(g => !DEMO_GAMES.find(d => d.id === g.id))
    try { localStorage.setItem(SK, JSON.stringify(up)) } catch {}
    setCfgTxt(JSON.stringify(games.map((g: Game) => ({ id: g.id, name: g.name, emoji: g.emoji })), null, 2))
  }, [games, ready])

  const addGame = useCallback((file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['js', 'ts', 'tsx', 'txt'].includes(ext || '')) { alert('Upload .js/.ts/.tsx/.txt'); return }
    const reader = new FileReader()
    reader.onload = e => {
      let code = (e.target?.result as string) || ''
      if (ext === 'ts' || ext === 'tsx') code = stripTS(code)
      const emojis = ['🎮', '👾', '🏆', '🎯', '🕹️', '⭐', '🔥', '💫']
      const colors = ['#071a0f', '#071020', '#100c00', '#0a0a18', '#001420']
      setGames(g => [...g, {
        id: Date.now().toString(),
        name: file.name.replace(/\.(ts|tsx|js|txt)$/, ''),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        addedDate: new Date().toLocaleDateString(),
        code,
      }])
    }
    reader.readAsText(file)
  }, [])

  return (
    <div>
      <div className="gc-bar">
        <div>
          <span className="eyebrow vis">GAME CENTER</span>
          <h2 className="section-h vis" style={{ marginBottom: 0 }}>Play <em>Anything</em></h2>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="config-toggle" onClick={() => setShowCfg(v => !v)}>
            {showCfg ? '▲' : '▼'} config
          </button>
          <button className="btn-glow" style={{ padding: '9px 18px' }} onClick={() => fRef.current?.click()}>
            + Upload Game
          </button>
          <input ref={fRef} type="file" accept=".js,.ts,.tsx,.txt" style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) addGame(e.target.files[0]); e.target.value = '' }} />
        </div>
      </div>

      {showCfg && (
        <div className="config-panel">
          <h3>// games.config.json</h3>
          <textarea className="config-ta" value={cfgTxt} readOnly />
          <button className="btn-sm" onClick={() => {
            try { const p = JSON.parse(cfgTxt); alert('Valid: ' + p.length + ' games') } catch { alert('Invalid JSON') }
          }}>Validate</button>
        </div>
      )}

      <div
        className={`gc-drop ${drag ? 'drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) addGame(e.dataTransfer.files[0]) }}
        onClick={() => fRef.current?.click()}
      >
        <div className="gc-drop-icon">🎮</div>
        <h3>Drop a game file here</h3>
        <p>Supports <strong>.js</strong>, <strong>.ts</strong>, <strong>.tsx</strong> — TypeScript stripped automatically</p>
        <button className="btn-ghost" style={{ padding: '9px 20px' }} onClick={e => { e.stopPropagation(); fRef.current?.click() }}>
          Browse Files
        </button>
      </div>

      <div className="games-grid">
        {games.map(g => (
          <div key={g.id} className="glass game-card">
            <div className="game-thumb" style={{ background: g.color }}>
              <span className="game-emoji">{g.emoji}</span>
              {!DEMO_GAMES.find(d => d.id === g.id) && (
                <button className="game-remove" onClick={() => setGames(gs => gs.filter(x => x.id !== g.id))}>x</button>
              )}
            </div>
            <div className="game-info">
              <div className="game-name">{g.name}</div>
              <div className="game-meta">Added: {g.addedDate}</div>
              <button className="btn-play" onClick={() => setActive(g)}>Play Now</button>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <div className="modal-overlay" onClick={() => setActive(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <div className="modal-hdr-title">{active.emoji} {active.name}</div>
              <button className="modal-x" onClick={() => setActive(null)}>x</button>
            </div>
            <div className="modal-body">
              <div className="game-iframe-wrap">
                <iframe className="game-sandbox" title={active.name} srcDoc={buildGameHTML(active.code)} sandbox="allow-scripts" />
              </div>
              <p style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', fontFamily: 'var(--mono)' }}>
                click canvas to focus, arrow keys / mouse to play
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BlogPage() {
  const [activeCat, setActiveCat] = useState('All')
  const cats = ['All', ...Array.from(new Set(BLOGS.map(b => b.cat)))]
  const filtered = activeCat === 'All' ? BLOGS : BLOGS.filter(b => b.cat === activeCat)
  return (
    <div className="section">
      <div className="eyebrow">BLOG</div>
      <h2 className="section-h">Writing &amp; <em>thinking aloud</em></h2>
      <p className="section-sub">Notes on cloud infrastructure, DevOps practices, and lessons learned.</p>
      <div className="blog-filters">
        {cats.map(c => (
          <button key={c} className={`blog-filter-btn ${activeCat === c ? 'active' : ''}`} onClick={() => setActiveCat(c)}>
            {c === 'All' ? '# all' : '# ' + c.toLowerCase()}
          </button>
        ))}
        <span className="blog-count">{filtered.length} post{filtered.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="blog-grid">
        {filtered.map((b, i) => (
          <div key={b.title} className={`glass blog-card reveal d${Math.min((i % 3) + 1, 3)}`}>
            <div className="blog-img" style={{ background: b.bg }}>
              <span style={{ fontSize: 32, position: 'relative', zIndex: 1 }}>{b.emoji}</span>
            </div>
            <div className="blog-body">
              <div className="blog-meta">
                <span className="blog-date">{b.date}</span>
                <span className="blog-cat">#{b.cat}</span>
              </div>
              <div className="blog-title">{b.title}</div>
              <div className="blog-excerpt">{b.excerpt}</div>
              <button className="blog-cta">read_more() →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const typed = useTyping(['Cloud Engineer', 'DevOps Engineer', 'AWS Architect', 'Automation Builder'], 72, 2200)
  useReveal()

  const sectionRefs = {
    home:     useRef<HTMLElement>(null),
    about:    useRef<HTMLElement>(null),
    skills:   useRef<HTMLElement>(null),
    projects: useRef<HTMLElement>(null),
    blog:     useRef<HTMLElement>(null),
    games:    useRef<HTMLElement>(null),
    contact:  useRef<HTMLElement>(null),
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
      const offsets = Object.entries(sectionRefs).map(([id, ref]) => ({
        id, top: ref.current ? ref.current.getBoundingClientRect().top : 9999
      }))
      const visible = offsets.filter(s => s.top <= 120)
      if (visible.length) setActiveSection(visible[visible.length - 1].id)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    const ref = sectionRefs[id as keyof typeof sectionRefs]
    if (ref?.current) ref.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <ParticleBackground />
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Side dot navigation */}
      <nav className="side-nav">
        {(['home','about','skills','projects','blog','games','contact'] as const).map(s => (
          <button
            key={s}
            className={`side-dot ${activeSection === s ? 'active' : ''}`}
            onClick={() => scrollTo(s)}
            title={s}
          >
            <span className="side-dot-label">{s}</span>
          </button>
        ))}
      </nav>

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo" onClick={() => scrollTo('home')}>alan.cloud</div>
        <div className="nav-links">
          {(['home', 'about', 'skills', 'projects', 'blog', 'games', 'contact'] as const).map(p => (
            <button key={p} className={`nav-link ${activeSection === p ? 'active' : ''}`} onClick={() => scrollTo(p)}>
              {p === 'games' ? '🎮 games' : p}
            </button>
          ))}
        </div>
        <div className="nav-actions">
          <a className="nav-resume" href="https://drive.google.com/file/d/1Z9kbNvGaXNXZh6FIhH2_eQ2iHsPffCMO/view?usp=sharing" target="_blank" rel="noopener noreferrer">
            ↓ resume
          </a>
          <button className="nav-cta" onClick={() => scrollTo('contact')}>hire_me()</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={sectionRefs.home} id="home" className="hero">
        <div>
          <div className="hero-badge">
            <div className="badge-dot" />
            open_to_opportunities
          </div>
          <h1 className="hero-title">
            <span className="line1">hello, world</span>
            <span className="name">Alan Sarang</span>
            <span className="role">
              {typed}<span className="typed-cursor">|</span>
            </span>
          </h1>
          <p className="hero-desc">
            AWS Certified professional building reliable <code>cloud infrastructure</code>,{' '}
            <code>CI/CD pipelines</code> and automated cost-optimization systems.
          </p>
          <div className="hero-btns">
            <button className="btn-glow" onClick={() => scrollTo('projects')}>view_projects()</button>
            <button className="btn-ghost" onClick={() => scrollTo('contact')}>get_in_touch()</button>
            <a className="btn-resume" href="https://drive.google.com/file/d/1Z9kbNvGaXNXZh6FIhH2_eQ2iHsPffCMO/view?usp=sharing" target="_blank" rel="noopener noreferrer">↓ resume.pdf</a>
          </div>
          <div className="hero-stats">
            <div className="stat"><div className="stat-n">1+</div><div className="stat-l">years_exp</div></div>
            <div className="stat"><div className="stat-n">9</div><div className="stat-l">projects</div></div>
            <div className="stat"><div className="stat-n">4</div><div className="stat-l">aws_certs</div></div>
          </div>
        </div>
        <div className="hero-right">
          <div className="terminal">
            <div className="scanline" />
            <div className="term-bar">
              <div className="term-dot" style={{ background: '#ff5f57' }} />
              <div className="term-dot" style={{ background: '#febc2e' }} />
              <div className="term-dot" style={{ background: '#28c840' }} />
              <div className="term-filename">profile.json</div>
            </div>
            <div className="term-body">
              <div><span className="t-c">// Cloud &amp; DevOps Engineer</span></div>
              <div><span className="t-k">name</span>{': '}<span className="t-s">&quot;Alan Sarang M A&quot;</span></div>
              <div><span className="t-k">role</span>{': '}<span className="t-s">&quot;Cloud &amp; DevOps Intern&quot;</span></div>
              <div><span className="t-k">company</span>{': '}<span className="t-s">&quot;TechBrein IT Solutions&quot;</span></div>
              <div><span className="t-k">location</span>{': '}<span className="t-s">&quot;Bengaluru, IN&quot;</span></div>
              <div><span className="t-k">cloud</span>{': ['}<span className="t-v">AWS</span>{', '}<span className="t-v">Azure</span>{', '}<span className="t-v">GCP</span>{']'}</div>
              <div><span className="t-k">certs</span>{': '}<span className="t-n">4</span></div>
              <div><span className="t-k">status</span>{': '}<span className="t-b">&quot;open_to_work&quot;</span> <span className="t-cur" /></div>
            </div>
          </div>
          <div className="cert-strip">
            {[
              { i: '🏅', n: 'AWS Solutions Architect Associate' },
              { i: '☁️', n: 'AWS Cloud Technology Consultant' },
              { i: '🎓', n: 'AWS Cloud Solutions Architect' },
              { i: '🔷', n: 'Oracle Cloud Infrastructure DevOps' },
            ].map(c => (
              <div key={c.n} className="cert-chip">
                <div className="cert-icon">{c.i}</div>
                <div className="cert-name">{c.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section ref={sectionRefs.about} id="about" className="section">
        <div className="eyebrow">ABOUT ME</div>
        <h2 className="section-h">The engineer <em>behind the infra</em></h2>
        <div className="about-grid">
          <div>
            <p className="about-p reveal d1">I&apos;m Alan Sarang M A, an AWS Certified Cloud &amp; DevOps Engineer based in Bengaluru, Karnataka. Passionate about building reliable infrastructure, automating toil, and keeping systems observable and cost-efficient.</p>
            <p className="about-p reveal d2">Currently interning at TechBrein IT Solutions in Calicut, where I provision and manage EC2 infrastructure, implement monitoring with CloudWatch, Prometheus &amp; Grafana, and document deployment and recovery procedures.</p>
            <p className="about-p reveal d3">I hold 4 certifications across AWS and Oracle. Outside of cloud work, I enjoy building small games — check out my Game Center!</p>
            <button className="btn-glow reveal d4" style={{ marginTop: 28 }} onClick={() => scrollTo('contact')}>
              lets_work_together()
            </button>
          </div>
          <div className="glass about-card reveal d2">
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 18 }}>// quick_facts.json</div>
            <div className="info-grid">
              {[
                ['location', 'Bengaluru, Karnataka'],
                ['experience', 'Intern (Sep 2025 - now)'],
                ['education', 'BCA, Kannur University'],
                ['focus', 'Cloud & DevOps'],
                ['stack', 'Bash · Python · YAML'],
                ['email', 'alansarang21@gmail.com'],
              ].map(([l, v]) => (
                <div key={l}><div className="il">{l}</div><div className="iv">{v}</div></div>
              ))}
            </div>
            <div className="cert-list-title">certifications</div>
            {['AWS Solutions Architect Associate', 'AWS Cloud Technology Consultant', 'AWS Cloud Solutions Architect', 'Oracle Cloud Infrastructure DevOps Pro'].map(c => (
              <div key={c} className="cert-row">{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section ref={sectionRefs.skills} id="skills" className="section">
        <div className="eyebrow">SKILLS</div>
        <h2 className="section-h">What I <em>bring to the table</em></h2>
        <p className="section-sub">A toolkit built across cloud infrastructure, automation, and DevOps.</p>
        <div className="skills-grid">
          {SKILLS.map((s, i) => (
            <div key={s.name} className={`glass skill-card reveal d${Math.min(i + 1, 6)}`}>
              <div className="sk-icon">{s.icon}</div>
              <div className="sk-name">{s.name}</div>
              <div className="sk-desc">{s.desc}</div>
              <div className="sk-tags">{s.tags.map(t => <span key={t} className="sk-tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section ref={sectionRefs.projects} id="projects" className="section">
        <div className="eyebrow">PROJECTS</div>
        <h2 className="section-h">Things I&apos;ve <em>built &amp; deployed</em></h2>
        <p className="section-sub">AWS projects ranging from scalable infrastructure to cost automation, security, and observability.</p>
        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <div key={p.title} className={`glass proj-card reveal d${Math.min((i % 3) + 1, 6)}`}>
              <div className="proj-img" style={{ background: p.bg }}>
                <span className="proj-emoji">{p.emoji}</span>
              </div>
              <div className="proj-body">
                <span className="proj-tag">{p.tag}</span>
                <div className="proj-title">{p.title}</div>
                <div className="proj-desc">{p.desc}</div>
                <div className="proj-stack">{p.stack.map(t => <span key={t} className="proj-st">{t}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BLOG ── */}
      <section ref={sectionRefs.blog} id="blog">
        <BlogPage />
      </section>

      {/* ── GAMES ── */}
      <section ref={sectionRefs.games} id="games" className="section">
        <GameCenter />
      </section>

      {/* ── CONTACT ── */}
      <section ref={sectionRefs.contact} id="contact" className="section">
        <div className="eyebrow">CONTACT</div>
        <h2 className="section-h">Let&apos;s <em>build something</em></h2>
        <p className="section-sub">Open to full-time roles, internships, and freelance cloud projects.</p>
        <div className="contact-grid">
          <div className="reveal d1">
            {[
              { i: '📍', l: 'location', v: 'Bengaluru, Karnataka' },
              { i: '✉️', l: 'email', v: 'alansarang21@gmail.com' },
              { i: '💼', l: 'linkedin', v: 'linkedin.com/in/alan-sarang' },
              { i: '🐙', l: 'github', v: 'github.com/alansarang' },
            ].map(c => (
              <div key={c.l} className="contact-item">
                <div className="contact-ico">{c.i}</div>
                <div><div className="contact-lbl">{c.l}</div><div className="contact-val">{c.v}</div></div>
              </div>
            ))}
          </div>
          <div className="glass contact-form reveal d2">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>🚀</div>
                <h3 style={{ fontFamily: 'var(--mono)', fontSize: 18, color: 'var(--teal)', marginBottom: 8 }}>message_sent!</h3>
                <p style={{ color: 'var(--text-soft)', fontSize: 14 }}>Thanks! I&apos;ll get back to you within 24 hours.</p>
                <button className="btn-glow" style={{ marginTop: 24 }} onClick={() => setSent(false)}>send_another()</button>
              </div>
            ) : (
              <>
                {[['name', 'text', 'your_name'], ['email', 'email', 'your@email.com']].map(([k, t, ph]) => (
                  <div key={k} className="fgroup">
                    <label className="flabel">{k}</label>
                    <input className="finput" type={t} placeholder={ph}
                      value={form[k as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                  </div>
                ))}
                <div className="fgroup">
                  <label className="flabel">message</label>
                  <textarea className="finput ftextarea" placeholder="describe_your_project..."
                    value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                </div>
                <button className="btn-glow" style={{ width: '100%' }}
                  onClick={() => { if (form.name && form.email && form.message) setSent(true) }}>
                  send_message()
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-logo">[ alan.cloud ]</div>
        <div className="footer-txt" style={{ marginTop: 8 }}>
          © {new Date().getFullYear()} Alan Sarang M A · Cloud &amp; DevOps Engineer · AWS Certified
        </div>
      </footer>
    </>
  )
}
