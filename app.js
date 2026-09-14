'use strict';
const $=id=>document.getElementById(id);
const C={blue:'#255cf4',mint:'#008575',red:'#c94359',ink:'#152139',muted:'#64728a',grid:'#e3e9f3'};
const LINEAR_DATA=[{x:1,y:43},{x:2,y:47},{x:3,y:51},{x:4,y:59},{x:5,y:61},{x:6,y:68},{x:7,y:72},{x:8,y:81},{x:9,y:83},{x:10,y:91}];
const sigmoid=z=>z>=0?1/(1+Math.exp(-z)):Math.exp(z)/(1+Math.exp(z));
const mse=(w,b,data=LINEAR_DATA)=>data.reduce((s,d)=>s+(w*d.x+b-d.y)**2,0)/data.length;
function ols(data=LINEAR_DATA){const n=data.length,x=data.reduce((s,d)=>s+d.x,0)/n,y=data.reduce((s,d)=>s+d.y,0)/n;const w=data.reduce((s,d)=>s+(d.x-x)*(d.y-y),0)/data.reduce((s,d)=>s+(d.x-x)**2,0);return {w,b:y-w*x};}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function ensureSvg(id){let svg=$(id);if(svg)return svg;const host=$('anscombeGrid')||document.getElementById('main');svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id=id;svg.setAttribute('class','plot');svg.setAttribute('viewBox','0 0 680 370');svg.setAttribute('role','img');if(host)host.appendChild(svg);return svg;}
function chart(id,opt={}){const svg=ensureSvg(id),W=680,H=370,L=64,R=22,T=24,B=56;const {xmin=0,xmax=11,ymin=0,ymax=110,xlabel='学习时长 / 小时',ylabel='考试分数 / 分',xticks=[0,2,4,6,8,10],yticks=[0,20,40,60,80,100]}=opt;const x=v=>L+(v-xmin)/(xmax-xmin)*(W-L-R),y=v=>H-B-(v-ymin)/(ymax-ymin)*(H-T-B);let s='';for(const t of yticks)s+=`<line x1="${L}" y1="${y(t)}" x2="${W-R}" y2="${y(t)}" stroke="${C.grid}"/><text x="${L-12}" y="${y(t)+5}" text-anchor="end" font-size="13" fill="${C.muted}">${t}</text>`;for(const t of xticks)s+=`<line x1="${x(t)}" y1="${T}" x2="${x(t)}" y2="${H-B}" stroke="${C.grid}"/><text x="${x(t)}" y="${H-B+24}" text-anchor="middle" font-size="13" fill="${C.muted}">${t}</text>`;s+=`<text x="${L}" y="15" font-size="13" fill="${C.muted}">${esc(ylabel)}</text><text x="${(L+W-R)/2}" y="${H-6}" text-anchor="middle" font-size="13" fill="${C.muted}">${esc(xlabel)}</text>`;return {svg,x,y,base:s,finish:body=>{svg.innerHTML=s+`<g>${body}</g>`;},xmin,xmax,ymin,ymax};}
function pathLine(p,fn,start,end,color=C.blue,width=3){let d='';for(let i=0;i<=180;i++){const v=start+(end-start)*i/180;d+=(i?'L':'M')+p.x(v).toFixed(2)+','+p.y(fn(v)).toFixed(2);}return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}"/>`;}
function dot(p,x,y,color,r=5){return `<circle cx="${p.x(x)}" cy="${p.y(y)}" r="${r}" fill="${color}" stroke="white" stroke-width="1.6"/>`;}
function renderLinear(exact){const w=exact?.w??+$('weight').value,b=exact?.b??+$('bias').value;$('weightOut').textContent=w.toFixed(2);$('biasOut').textContent=b.toFixed(2);$('mseOut').textContent=mse(w,b).toFixed(2);const p=chart('linearPlot');let body=pathLine(p,x=>w*x+b,0,11);for(const d of LINEAR_DATA){if($('residuals').checked)body+=`<line x1="${p.x(d.x)}" x2="${p.x(d.x)}" y1="${p.y(d.y)}" y2="${p.y(w*d.x+b)}" stroke="${C.red}" stroke-width="1.5" stroke-dasharray="4 3"/>`;body+=dot(p,d.x,d.y,C.blue);}p.finish(body);$('linearReadout').textContent=`当前 ŷ = ${w.toFixed(2)}x + ${b.toFixed(2)}；学习 6 小时的预测分数为 ${(w*6+b).toFixed(1)} 分。`+(exact?' 已显示最小二乘最优值；拖动滑块可继续比较。':'');}
let linearExact=null;
for(const id of ['weight','bias'])$(id).addEventListener('input',()=>{linearExact=null;renderLinear();});$('residuals').addEventListener('change',()=>renderLinear(linearExact));$('fitBtn').onclick=()=>{linearExact=ols();$('weight').value=linearExact.w;$('bias').value=linearExact.b;renderLinear(linearExact);};$('linearReset').onclick=()=>{$('weight').value=5;$('bias').value=30;linearExact=null;renderLinear();};renderLinear();
let leftSeconds=1080,timerHandle=null,lastTick=0;
function renderClock(){const m=Math.floor(leftSeconds/60),s=leftSeconds%60;$('clock').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;$('timerBtn').setAttribute('aria-label',`${timerHandle?'暂停':'开始'}汇报计时，剩余${m}分${s}秒`);}
$('timerBtn').onclick=()=>{if(timerHandle){clearInterval(timerHandle);timerHandle=null;}else{lastTick=Date.now();timerHandle=setInterval(()=>{const now=Date.now(),elapsed=Math.floor((now-lastTick)/1000);if(elapsed){leftSeconds=Math.max(0,leftSeconds-elapsed);lastTick+=elapsed*1000;renderClock();}if(!leftSeconds){clearInterval(timerHandle);timerHandle=null;$('timerBtn').style.background=C.red;renderClock();}},250);}renderClock();};$('timerReset').onclick=()=>{clearInterval(timerHandle);timerHandle=null;leftSeconds=1080;$('timerBtn').style.background='';renderClock();};$('modeBtn').onclick=()=>{const on=document.body.classList.toggle('talk-mode');$('modeBtn').textContent=on?'返回学习模式':'进入汇报模式';$('modeBtn').setAttribute('aria-pressed',String(on));};
const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){document.querySelectorAll('.sidebar nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main section').forEach(s=>observer.observe(s));
let training={w:0,b:0,step:0,history:[mse(0,0)],running:null,stopped:false};
function stopTraining(){if(training.running)clearInterval(training.running);training.running=null;$('trainBtn').textContent='播放训练';}
function renderTraining(){const g=training,last=g.history.at(-1);$('iteration').textContent=g.step;$('descentMse').textContent=last<1e5?last.toFixed(2):last.toExponential(2);$('descentParams').textContent=`w = ${g.w.toFixed(3)}，b = ${g.b.toFixed(3)}`;const xmax=Math.max(30,g.step),top=Math.max(4,Math.ceil(Math.log10(Math.max(...g.history)+1))),yticks=Array.from({length:5},(_,i)=>+(top*i/4).toFixed(1));const p=chart('descentPlot',{xmin:0,xmax,ymin:0,ymax:top,xlabel:'迭代次数',ylabel:'log₁₀(1 + MSE)',xticks:[0,Math.round(xmax/4),Math.round(xmax/2),Math.round(xmax*3/4),xmax],yticks});let d='';g.history.forEach((v,i)=>d+=(i?'L':'M')+p.x(i)+','+p.y(Math.log10(v+1)));p.finish(`<path d="${d}" fill="none" stroke="${C.blue}" stroke-width="3"/>`+dot(p,g.step,Math.log10(last+1),last>g.history[0]?C.red:C.blue,6));}
function trainStep(){const g=training;if(g.stopped)return;const alpha=+$('learningRate').value;let dw=0,db=0;for(const d of LINEAR_DATA){const e=g.w*d.x+g.b-d.y;dw+=2*e*d.x/LINEAR_DATA.length;db+=2*e/LINEAR_DATA.length;}const nw=g.w-alpha*dw,nb=g.b-alpha*db;g.w=nw;g.b=nb;g.step++;g.history.push(mse(nw,nb));if(!Number.isFinite(g.history.at(-1))||g.history.at(-1)>1e12){g.stopped=true;stopTraining();$('trainStatus').textContent='误差快速增大，已停止演示。学习率过大使这次训练发散，换小一些再试。';}else if(g.step>=240){g.stopped=true;stopTraining();$('trainStatus').textContent='已演示 240 步。误差下降不代表已经最优，也不代表在新数据上表现好。';}else $('trainStatus').textContent=g.history.at(-1)>g.history[0]?'损失正在增大：步子可能过大。':'损失随更新下降，继续观察变化是否趋缓。';$('trainBtn').disabled=g.stopped;$('stepBtn').disabled=g.stopped;renderTraining();}
function resetTraining(){stopTraining();training={w:0,b:0,step:0,history:[mse(0,0)],running:null,stopped:false};$('trainBtn').disabled=false;$('stepBtn').disabled=false;$('trainStatus').textContent='从同一组初始参数重新开始，便于比较学习率。';renderTraining();}
$('trainBtn').onclick=()=>{if(training.running)stopTraining();else{training.running=setInterval(trainStep,80);$('trainBtn').textContent='暂停训练';}};$('stepBtn').onclick=()=>{stopTraining();trainStep();};$('trainReset').onclick=resetTraining;$('learningRate').onchange=resetTraining;renderTraining();
function renderSigmoid(){const z=+$('zValue').value,prob=sigmoid(z);$('zOut').textContent=z.toFixed(1);$('probOut').textContent=(100*prob).toFixed(1)+'%';$('sigmoidReadout').textContent=`p = σ(${z.toFixed(1)}) = ${prob.toFixed(4)}`;const p=chart('sigmoidPlot',{xmin:-6,xmax:6,ymin:0,ymax:1,xlabel:'线性得分 z',ylabel:'正类概率 p',xticks:[-6,-4,-2,0,2,4,6],yticks:[0,.25,.5,.75,1]});p.finish(pathLine(p,sigmoid,-6,6,C.mint)+`<path d="M${p.x(z)},${p.y(0)}L${p.x(z)},${p.y(prob)}L${p.x(-6)},${p.y(prob)}" fill="none" stroke="${C.mint}" stroke-dasharray="5 4"/>`+dot(p,z,prob,C.mint,7));}
$('zValue').oninput=renderSigmoid;document.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{$('zValue').value=b.dataset.z;renderSigmoid();});renderSigmoid();
const crossEntropy=(p,y)=>-(y*Math.log(p)+(1-y)*Math.log(1-p));
function renderLoss(){const actual=+$('trueLabel').value,prob=+$('lossProb').value,loss=crossEntropy(prob,actual);$('lossProbOut').textContent=prob.toFixed(2);$('lossOut').textContent=loss.toFixed(3);$('lossReadout').textContent=`实际 y = ${actual}，为真实类别分配 ${(100*(actual?prob:1-prob)).toFixed(0)}% 概率。`;const p=chart('lossPlot',{xmin:0,xmax:1,ymin:0,ymax:5,xlabel:'预测正类概率 p',ylabel:'单样本交叉熵',xticks:[0,.2,.4,.6,.8,1],yticks:[0,1,2,3,4,5]});p.finish(pathLine(p,x=>crossEntropy(x,actual),.01,.99,C.mint)+dot(p,prob,loss,C.red,7));}
$('trueLabel').onchange=renderLoss;$('lossProb').oninput=renderLoss;renderLoss();
const CLASS_DATA=[{p:.08,y:0},{p:.16,y:0},{p:.24,y:1},{p:.32,y:0},{p:.41,y:1},{p:.48,y:0},{p:.56,y:1},{p:.64,y:0},{p:.71,y:1},{p:.79,y:1},{p:.87,y:0},{p:.94,y:1}];
function confusion(threshold){const out={tp:0,fn:0,fp:0,tn:0};for(const d of CLASS_DATA){const predicted=d.p>=threshold?1:0;out[d.y?(predicted?'tp':'fn'):(predicted?'fp':'tn')]++;}return out;}
function diamond(p,x,y,color,size=6){const cx=p.x(x),cy=p.y(y);return `<path d="M${cx},${cy-size}L${cx+size},${cy}L${cx},${cy+size}L${cx-size},${cy}Z" fill="${color}" stroke="white" stroke-width="1.5"/>`;}
const ratio=(a,b)=>b?`${(a/b*100).toFixed(1)}%`:'—';
function renderThreshold(){const t=+$('thresholdValue').value,m=confusion(t);$('thresholdOut').textContent=t.toFixed(2);for(const k of Object.keys(m))$(k).textContent=m[k];$('accuracy').textContent=ratio(m.tp+m.tn,CLASS_DATA.length);$('precision').textContent=ratio(m.tp,m.tp+m.fp);$('recall').textContent=ratio(m.tp,m.tp+m.fn);$('fixedLoss').textContent=(CLASS_DATA.reduce((s,d)=>s+crossEntropy(d.p,d.y),0)/CLASS_DATA.length).toFixed(3);$('thresholdReadout').textContent=`预测通过 ${m.tp+m.fp} 人，其中 ${m.fp} 人实际未通过；漏掉 ${m.fn} 位实际通过者。`+(m.tp+m.fp===0?' 没有预测正类，Precision 分母为 0，显示“—”。':'');const p=chart('thresholdPlot',{xmin:.3,xmax:12.7,ymin:0,ymax:1,xlabel:'模拟同学编号',ylabel:'固定的正类概率 p',xticks:[1,2,3,4,5,6,7,8,9,10,11,12],yticks:[0,.25,.5,.75,1]});let body=`<rect x="${p.x(.3)}" y="${p.y(1)}" width="${p.x(12.7)-p.x(.3)}" height="${p.y(t)-p.y(1)}" fill="#e6f6ee"/><line x1="${p.x(.3)}" y1="${p.y(t)}" x2="${p.x(12.7)}" y2="${p.y(t)}" stroke="${C.red}" stroke-width="2" stroke-dasharray="6 4"/>`;CLASS_DATA.forEach((d,i)=>{body+=`<line x1="${p.x(i+1)}" x2="${p.x(i+1)}" y1="${p.y(0)}" y2="${p.y(d.p)}" stroke="#cad5e6" stroke-width="2"/>`;if((d.p>=t?1:0)!==d.y)body+=`<circle cx="${p.x(i+1)}" cy="${p.y(d.p)}" r="11" fill="none" stroke="${C.red}" stroke-width="1.5"/>`;body+=d.y?dot(p,i+1,d.p,C.mint,6):diamond(p,i+1,d.p,C.blue,7);});p.finish(body);}
$('thresholdValue').oninput=renderThreshold;document.querySelectorAll('[data-threshold]').forEach(b=>b.onclick=()=>{$('thresholdValue').value=b.dataset.threshold;renderThreshold();});renderThreshold();
const BOUNDARY_DATA=[[-2,-1.6,0],[-1.7,.4,0],[-1.4,-.3,0],[-.5,-1.5,0],[.4,-1.4,0],[1.5,-1.4,0],[-1.2,1.8,1],[-.3,.9,1],[.5,.5,1],[1.4,.3,1],[1.8,1.6,1],[.8,-.3,1]];
function positivePolygon(w1,w2,b){const square=[[-2.5,-2.5],[2.5,-2.5],[2.5,2.5],[-2.5,2.5]],out=[];for(let i=0;i<4;i++){const a=square[i],c=square[(i+1)%4],va=w1*a[0]+w2*a[1]+b,vc=w1*c[0]+w2*c[1]+b;if(va>=0)out.push(a);if((va>=0)!==(vc>=0)){const f=va/(va-vc);out.push([a[0]+f*(c[0]-a[0]),a[1]+f*(c[1]-a[1])]);}}return out;}
function renderBoundary(){const w1=+$('w1').value,w2=+$('w2').value,b=+$('b2').value;for(const [id,v] of [['w1Out',w1],['w2Out',w2],['b2Out',b]])$(id).textContent=v.toFixed(1);const p=chart('boundaryPlot',{xmin:-2.5,xmax:2.5,ymin:-2.5,ymax:2.5,xlabel:'标准化学习时长 x₁',ylabel:'标准化练习完成量 x₂',xticks:[-2,-1,0,1,2],yticks:[-2,-1,0,1,2]});const poly=positivePolygon(w1,w2,b);let body=`<rect x="${p.x(-2.5)}" y="${p.y(2.5)}" width="${p.x(2.5)-p.x(-2.5)}" height="${p.y(-2.5)-p.y(2.5)}" fill="#255cf4" fill-opacity=".06"/>`;if(poly.length)body+=`<polygon points="${poly.map(q=>p.x(q[0])+','+p.y(q[1])).join(' ')}" fill="#008575" fill-opacity=".16"/>`;if(Math.abs(w2)>1e-12)body+=pathLine(p,x=>-(w1*x+b)/w2,-2.5,2.5,C.ink,2.5);else if(Math.abs(w1)>1e-12){const x=-b/w1;body+=`<line x1="${p.x(x)}" x2="${p.x(x)}" y1="${p.y(-2.5)}" y2="${p.y(2.5)}" stroke="${C.ink}" stroke-width="2.5"/>`;}let wrong=0;for(const [x,y,label] of BOUNDARY_DATA){if((w1*x+w2*y+b>=0?1:0)!==label){wrong++;body+=`<circle cx="${p.x(x)}" cy="${p.y(y)}" r="10" fill="none" stroke="${C.red}" stroke-width="1.5"/>`;}body+=label?dot(p,x,y,C.mint,6):diamond(p,x,y,C.blue,7);}p.finish(body);$('boundaryReadout').textContent=(w1===0&&w2===0?`所有位置的概率都是 ${sigmoid(b).toFixed(3)}，没有普通分割直线。`:`边界：${w1.toFixed(1)}x₁ + ${w2.toFixed(1)}x₂ + ${b.toFixed(1)} = 0。`)+` 模拟样本误分类 ${wrong}/12。`;}
for(const id of ['w1','w2','b2'])$(id).oninput=renderBoundary;$('boundaryReset').onclick=()=>{$('w1').value=1;$('w2').value=1;$('b2').value=0;renderBoundary();};renderBoundary();

function fitXY(data){const n=data.length,mx=data.reduce((s,d)=>s+d.x,0)/n,my=data.reduce((s,d)=>s+d.y,0)/n;const sxx=data.reduce((s,d)=>s+(d.x-mx)**2,0),sxy=data.reduce((s,d)=>s+(d.x-mx)*(d.y-my),0),syy=data.reduce((s,d)=>s+(d.y-my)**2,0);const w=sxy/sxx,b=my-w*mx,sse=data.reduce((s,d)=>s+(w*d.x+b-d.y)**2,0);return {n,mx,my,w,b,r:sxy/Math.sqrt(sxx*syy),r2:1-sse/syy,mse:sse/n};}
function logisticMLE(xs,ys){let w=0,b=0;const n=xs.length;for(let k=0;k<40;k++){const ps=xs.map(x=>sigmoid(w*x+b));let gw=0,gb=0,hww=0,hwb=0,hbb=0;for(let i=0;i<n;i++){const p=ps[i],x=xs[i],y=ys[i],g=p*(1-p);gw+=(p-y)*x;gb+=(p-y);hww+=g*x*x;hwb+=g*x;hbb+=g;}gw/=n;gb/=n;hww/=n;hwb/=n;hbb/=n;const det=hww*hbb-hwb*hwb;if(Math.abs(det)<1e-18)break;const dw=(hbb*gw-hwb*gb)/det,db=(-hwb*gw+hww*gb)/det;w-=dw;b-=db;if(Math.abs(dw)+Math.abs(db)<1e-12)break;}return {w,b};}

const ANSCOMBE=[
  {name:'I · 线性散点',pts:[{x:10,y:8.04},{x:8,y:6.95},{x:13,y:7.58},{x:9,y:8.81},{x:11,y:8.33},{x:14,y:9.96},{x:6,y:7.24},{x:4,y:4.26},{x:12,y:10.84},{x:7,y:4.82},{x:5,y:5.68}]},
  {name:'II · 曲线',pts:[{x:10,y:9.14},{x:8,y:8.14},{x:13,y:8.74},{x:9,y:8.77},{x:11,y:9.26},{x:14,y:8.10},{x:6,y:6.13},{x:4,y:3.10},{x:12,y:9.13},{x:7,y:7.26},{x:5,y:4.74}]},
  {name:'III · 离群点',pts:[{x:10,y:7.46},{x:8,y:6.77},{x:13,y:12.74},{x:9,y:7.11},{x:11,y:7.81},{x:14,y:8.84},{x:6,y:6.08},{x:4,y:5.39},{x:12,y:8.15},{x:7,y:6.42},{x:5,y:5.73}]},
  {name:'IV · 杠杆点',pts:[{x:8,y:6.58},{x:8,y:5.76},{x:8,y:7.71},{x:8,y:8.84},{x:8,y:8.47},{x:8,y:7.04},{x:8,y:5.25},{x:19,y:12.50},{x:8,y:5.56},{x:8,y:7.91},{x:8,y:6.89}]}
];
let anscombeFocus=0;
function renderAnscombe(){
  if(!$('anscombeGrid'))return;
  const st0=fitXY(ANSCOMBE[0].pts);
  $('anscombeStats').innerHTML=`<span>n = ${st0.n}</span><span>x̄ = ${st0.mx.toFixed(1)}</span><span>ȳ ≈ ${st0.my.toFixed(2)}</span><span>ŵ ≈ ${st0.w.toFixed(3)}</span><span>b̂ ≈ ${st0.b.toFixed(2)}</span><span>r ≈ ${st0.r.toFixed(3)}</span><span>R² ≈ ${st0.r2.toFixed(3)}</span>`;
  $('anscombeGrid').innerHTML=ANSCOMBE.map((s,i)=>`<button type="button" class="quartet-item${i===anscombeFocus?' active':''}" data-set="${i}"><h3>${esc(s.name)}</h3><svg id="anscombe${i}" class="plot" viewBox="0 0 680 370"></svg></button>`).join('');
  ANSCOMBE.forEach((s,i)=>{
    const st=fitXY(s.pts);
    const p=chart('anscombe'+i,{xmin:2,xmax:21,ymin:2,ymax:14,xlabel:'x',ylabel:'y',xticks:[4,8,12,16,20],yticks:[4,6,8,10,12,14]});
    let body=pathLine(p,x=>st.w*x+st.b,2,21,C.blue,2.5);
    for(const d of s.pts) body+=dot(p,d.x,d.y,i===anscombeFocus?C.blue:C.muted,6);
    p.finish(body);
  });
  const names=['线性云，最小二乘看起来合理。','明显弯曲，直线只是误导。','一条直线被单个离群点拉高。','x 几乎不变，斜率由一个杠杆点决定。'];
  $('anscombeReadout').textContent=`四组摘要数字几乎相同，但图 ${'I II III IV'.split(' ')[anscombeFocus]}：${names[anscombeFocus]} 只看 r 或 R² 不够。`;
  document.querySelectorAll('#anscombeGrid [data-set]').forEach(btn=>btn.onclick=()=>{anscombeFocus=+btn.dataset.set;renderAnscombe();});
}
renderAnscombe();

const GALTON_FREQ=[[64,61.7,1],[64,63.2,2],[64,64.2,4],[64,65.2,1],[64,66.2,2],[64,67.2,2],[64,68.2,1],[64,69.2,1],[64.5,61.7,1],[64.5,62.2,1],[64.5,63.2,4],[64.5,64.2,4],[64.5,65.2,1],[64.5,66.2,5],[64.5,67.2,5],[64.5,69.2,2],[65.5,61.7,1],[65.5,63.2,9],[65.5,64.2,5],[65.5,65.2,7],[65.5,66.2,11],[65.5,67.2,11],[65.5,68.2,7],[65.5,69.2,7],[65.5,70.2,5],[65.5,71.2,2],[65.5,72.2,1],[66.5,62.2,3],[66.5,63.2,3],[66.5,64.2,5],[66.5,65.2,2],[66.5,66.2,17],[66.5,67.2,17],[66.5,68.2,14],[66.5,69.2,13],[66.5,70.2,4],[67.5,62.2,3],[67.5,63.2,5],[67.5,64.2,14],[67.5,65.2,15],[67.5,66.2,36],[67.5,67.2,38],[67.5,68.2,28],[67.5,69.2,38],[67.5,70.2,19],[67.5,71.2,11],[67.5,72.2,4],[68.5,61.7,1],[68.5,63.2,7],[68.5,64.2,11],[68.5,65.2,16],[68.5,66.2,25],[68.5,67.2,31],[68.5,68.2,34],[68.5,69.2,48],[68.5,70.2,21],[68.5,71.2,18],[68.5,72.2,4],[68.5,73.2,3],[69.5,63.2,1],[69.5,64.2,16],[69.5,65.2,4],[69.5,66.2,17],[69.5,67.2,27],[69.5,68.2,20],[69.5,69.2,33],[69.5,70.2,25],[69.5,71.2,20],[69.5,72.2,11],[69.5,73.2,4],[69.5,73.7,5],[70.5,61.7,1],[70.5,63.2,1],[70.5,65.2,1],[70.5,66.2,1],[70.5,67.2,3],[70.5,68.2,12],[70.5,69.2,18],[70.5,70.2,14],[70.5,71.2,7],[70.5,72.2,4],[70.5,73.2,3],[70.5,73.7,3],[71.5,65.2,1],[71.5,66.2,3],[71.5,67.2,4],[71.5,68.2,3],[71.5,69.2,5],[71.5,70.2,10],[71.5,71.2,4],[71.5,72.2,9],[71.5,73.2,2],[71.5,73.7,2],[72.5,68.2,1],[72.5,69.2,2],[72.5,70.2,1],[72.5,71.2,2],[72.5,72.2,7],[72.5,73.2,2],[72.5,73.7,4],[73,72.2,1],[73,73.2,3]];
const GALTON_PTS=[];for(const [x,y,n] of GALTON_FREQ)for(let i=0;i<n;i++)GALTON_PTS.push({x,y});
const galtonFit=fitXY(GALTON_PTS);
function renderGalton(){
  const svg=ensureSvg('galtonPlot');
  if(!svg||!$('galtonW'))return;
  $('galtonW').textContent=galtonFit.w.toFixed(3);
  $('galtonB').textContent='b̂ = '+galtonFit.b.toFixed(2)+' 英寸';
  $('galtonR').textContent=galtonFit.r.toFixed(3);
  const p=chart('galtonPlot',{xmin:63.5,xmax:73.5,ymin:61,ymax:75,xlabel:'中亲身高 / 英寸',ylabel:'子女身高 / 英寸',xticks:[64,66,68,70,72],yticks:[62,64,66,68,70,72,74]});
  let body=pathLine(p,x=>galtonFit.w*x+galtonFit.b,63.5,73.5,C.blue,2.8);
  if($('galtonYX')&&$('galtonYX').checked) body+=pathLine(p,x=>x,63.5,73.5,C.red,1.8);
  const maxN=Math.max(...GALTON_FREQ.map(d=>d[2]));
  for(const [x,y,n] of GALTON_FREQ){const r=3.2+7*Math.sqrt(n/maxN);body+=`<circle cx="${p.x(x)}" cy="${p.y(y)}" r="${r.toFixed(2)}" fill="${C.blue}" fill-opacity="0.28" stroke="${C.blue}" stroke-opacity="0.55" stroke-width="1"/>`;}
  p.finish(body);
  if($('galtonReadout'))$('galtonReadout').textContent=`n = ${galtonFit.n}，R² = ${galtonFit.r2.toFixed(3)}。ŵ = ${galtonFit.w.toFixed(3)} < 1：高身材父母的子女平均仍偏高，但更靠近总体均值。这是“回归到均值”，不是身高一代代变矮。`;
}
try{if($('galtonYX'))$('galtonYX').onchange=renderGalton;renderGalton();}catch(err){console.error(err);}

const ORINGS=[{t:53,y:1},{t:57,y:1},{t:58,y:1},{t:63,y:1},{t:66,y:0},{t:67,y:0},{t:67,y:0},{t:67,y:0},{t:68,y:0},{t:69,y:0},{t:70,y:1},{t:70,y:0},{t:70,y:1},{t:70,y:0},{t:72,y:0},{t:73,y:0},{t:75,y:0},{t:75,y:1},{t:76,y:0},{t:76,y:0},{t:78,y:0},{t:79,y:0},{t:81,y:0}];
const oringFit=logisticMLE(ORINGS.map(d=>d.t),ORINGS.map(d=>d.y));
function renderOring(){
  const svg=ensureSvg('oringPlot');
  if(!svg||!$('oringP'))return;
  const T=+$('oringT').value;const pr=sigmoid(oringFit.w*T+oringFit.b);
  if($('oringTOut'))$('oringTOut').textContent=String(T);
  $('oringP').textContent=(100*pr).toFixed(2)+'%';
  if($('oringCoef'))$('oringCoef').textContent='ŵ = '+oringFit.w.toFixed(3)+' /°F，b̂ = '+oringFit.b.toFixed(2);
  const p=chart('oringPlot',{xmin:28,xmax:85,ymin:-0.08,ymax:1.08,xlabel:'发射温度 / °F',ylabel:'热损伤概率',xticks:[31,40,50,60,70,80],yticks:[0,.25,.5,.75,1]});
  let body=pathLine(p,x=>sigmoid(oringFit.w*x+oringFit.b),28,85,C.mint,3);
  body+=`<line x1="${p.x(31)}" x2="${p.x(31)}" y1="${p.y(-0.08)}" y2="${p.y(1.08)}" stroke="${C.red}" stroke-width="1.6" stroke-dasharray="6 4"/>`;
  body+=`<line x1="${p.x(T)}" x2="${p.x(T)}" y1="${p.y(-0.08)}" y2="${p.y(pr)}" stroke="${C.mint}" stroke-dasharray="4 3"/><line x1="${p.x(28)}" x2="${p.x(T)}" y1="${p.y(pr)}" y2="${p.y(pr)}" stroke="${C.mint}" stroke-dasharray="4 3"/>`;
  const seen={};
  ORINGS.forEach((d,i)=>{seen[d.t]=(seen[d.t]||0)+1;const dx=(seen[d.t]-1)*0.55;body+=d.y?dot(p,d.t+dx,1,C.mint,6):diamond(p,d.t+dx,0,C.blue,7);});
  body+=dot(p,T,pr,C.red,7);
  p.finish(body);
  if($('oringReadout'))$('oringReadout').textContent=T<=35?`发射日约 ${T}°F，样本内拟合给出的损伤概率约为 ${(100*pr).toFixed(2)}%。训练点最低 53°F，31°F 是强外推。`:`T = ${T}°F 时，p̂ = ${(100*pr).toFixed(2)}%。温度升高，拟合概率下降。`;
}
try{
  if($('oringT'))$('oringT').oninput=renderOring;
  document.querySelectorAll('[data-oring]').forEach(b=>b.onclick=()=>{$('oringT').value=b.dataset.oring;renderOring();});
  renderOring();
}catch(err){console.error(err);}


const QUIZZES=[{q:'1. 单个样本的预测误差从 2 分变成 4 分，它对平方损失的贡献变为原来的几倍？',a:['2 倍','4 倍','不变'],correct:1,why:'4²/2² = 4。平方损失会更强地惩罚较大的误差。'}, {q:'2. 模型固定，只把分类阈值从 0.5 改成 0.7，哪些数值一定保持不变？',a:['每个样本的预测概率','混淆矩阵','召回率'],correct:0,why:'阈值改变决策规则，模型的参数和预测概率没有变化，平均 LogLoss 也保持不变。'}, {q:'3. 在二维原始特征上，标准逻辑回归的 Sigmoid 是曲线，因此决策边界一定弯曲。',a:['正确','错误'],correct:1,why:'阈值0.5下边界满足 w₁x₁ + w₂x₂ + b = 0。非零权重时是直线，S形的是概率对线性得分的映射。'}, {q:'4. 测试集上的 R² = −0.2 说明什么？',a:['程序必定算错了','比该评价集均值基线更差','准确率是 −20%'],correct:1,why:'R² 可以为负，它不是分类准确率。预测残差平方和大于均值基线的平方和时就会出现负值。'}, {q:'5. 哪个预处理流程正确？',a:['全体标准化，再划分','先划分，仅用训练集拟合标准化'],correct:1,why:'先划分，再用训练集fit预处理，验证集和测试集只transform，避免信息泄漏。'}, {q:'6. 在经典机器学习里，线性回归和逻辑回归首先应被理解为？',a:['无监督聚类方法','监督学习中的线性基线模型','必须配合神经网络才能使用'],correct:1,why:'二者都从特征的线性加权出发，用标签学习参数，适合作为可解释的监督学习基线。'}, {q:'7. Anscombe 四组数据的 r 和拟合直线几乎相同，因此散点图也一定相似。',a:['正确','错误'],correct:1,why:'这正是 Anscombe (1973) 的论点：摘要统计可以完全一致，图形结构却完全不同。'}, {q:'8. Galton 亲子身高的拟合斜率约为 0.65 < 1，含义是？',a:['子女一代代变矮','高身材父母的子女平均更靠近总体均值','相关系数为负'],correct:1,why:'回归到均值：极端值的下一代期望更靠近均值，平均身高并没有系统下降。'}, {q:'9. 用挑战者号 23 次飞行拟合逻辑回归后，31°F 的损伤概率与 70°F 相比？',a:['差不多','明显更低','明显更高，且 31°F 低于训练温度范围'],correct:2,why:'样本内拟合在低温端概率很高；31°F 低于最低训练点 53°F，属于外推。'}];
$('quizList').innerHTML=QUIZZES.map((q,i)=>`<article class="quiz-card"><h3>${esc(q.q)}</h3><div class="quiz-options">${q.a.map((a,j)=>`<button data-quiz="${i}" data-answer="${j}">${esc(a)}</button>`).join('')}</div><p class="feedback" id="feedback${i}" aria-live="polite">选择答案后查看解析。</p></article>`).join('');document.querySelectorAll('[data-quiz]').forEach(b=>b.onclick=()=>{const i=+b.dataset.quiz,j=+b.dataset.answer,q=QUIZZES[i];document.querySelectorAll(`[data-quiz="${i}"]`).forEach(x=>x.classList.toggle('chosen',x===b));$('feedback'+i).textContent=(j===q.correct?'回答正确。':'再想一想。')+q.why;$('feedback'+i).style.color=j===q.correct?C.mint:C.red;});

// Optional standard WebMCP surface; the full page also works in browsers without it.
const demoContext=document.modelContext??navigator.modelContext;
if(demoContext?.registerTool){
  const lifecycle=new AbortController();
  try { Promise.resolve(demoContext.registerTool({name:'set_regression_demo',title:'设置回归教学演示',annotations:{readOnlyHint:false,untrustedContentHint:false},description:'设置本地教学图的参数并返回观察值。只改变网页演示状态，不保存或发送数据。',inputSchema:{type:'object',properties:{demo:{type:'string',enum:['linear','sigmoid','threshold','boundary']},w:{type:'number',minimum:-2,maximum:12},b:{type:'number',minimum:-3,maximum:70},z:{type:'number',minimum:-6,maximum:6},threshold:{type:'number',minimum:0,maximum:1},w1:{type:'number',minimum:-3,maximum:3},w2:{type:'number',minimum:-3,maximum:3}},required:['demo'],additionalProperties:false},execute:async(args)=>{
    if(!args||!['linear','sigmoid','threshold','boundary'].includes(args.demo))throw new Error('请选择有效的教学实验');
    const allowed={linear:{w:[-2,12],b:[0,70]},sigmoid:{z:[-6,6]},threshold:{threshold:[0,1]},boundary:{w1:[-3,3],w2:[-3,3],b:[-3,3]}}[args.demo];
    for(const [key,v] of Object.entries(args)){if(key==='demo')continue;const r=allowed[key];if(!r||typeof v!=='number'||!Number.isFinite(v)||v<r[0]||v>r[1])throw new Error('参数类型或范围无效：'+key);}
    const put=(id,v)=>{if(v!==undefined)$(id).value=v;};let result;
    if(args.demo==='linear'){put('weight',args.w,-2,12);put('bias',args.b,0,70);linearExact=null;renderLinear();result=$('linearReadout').textContent+' MSE='+$('mseOut').textContent;}
    else if(args.demo==='sigmoid'){put('zValue',args.z,-6,6);renderSigmoid();result=$('sigmoidReadout').textContent;}
    else if(args.demo==='threshold'){put('thresholdValue',args.threshold,0,1);renderThreshold();result=$('thresholdReadout').textContent;}
    else {put('w1',args.w1,-3,3);put('w2',args.w2,-3,3);put('b2',args.b,-3,3);renderBoundary();result=$('boundaryReadout').textContent;}
    return {content:[{type:'text',text:result}]};}}, {signal:lifecycle.signal})).catch(()=>{}); } catch {}
  window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
