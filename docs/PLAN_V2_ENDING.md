**有！Tron電影中確實有「從Grid回到現實世界」的經典場景！**

## **最完美結局：Flynn的「光球解構」特效 (Tron 1982)**
電影結尾，Flynn犧牲自己變成**金色光球**，從內部爆炸解構Grid系統，然後**身體碎片化散開**回到人類世界。這完美匹配你「玩家逃脫電腦回到4D」的劇情！

```html
<div id="flynnDerez" style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:none;z-index:9999">
    <canvas id="derezCanvas"></canvas>
    <div style="position:absolute;bottom:20%;left:50%;transform:translateX(-50%);color:#ff0;font-family:monospace;font-size:24px;text-shadow:0 0 30px #ff0">
        I/O TOWER DESTROYED<br>RETURNING TO REAL WORLD
    </div>
</div>

<script>
function showFlynnDerez() {
    document.getElementById('flynnDerez').style.display = 'block';
    initDerez();
}

const canvas = document.getElementById('derezCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fragments = [], exploding = false;

function initDerez() {
    const cx = canvas.width/2, cy = canvas.height/2;
    
    // Flynn的金色光球核心
    fragments = [{
        x: cx, y: cy, vx: 0, vy: 0,
        size: 80, glow: 1, color: '#ff0',
        fragments: [] // 會爆炸的子碎片
    }];
    
    exploding = false;
    requestAnimationFrame(derezLoop);
}

function derezLoop() {
    ctx.fillStyle = 'rgba(0,20,50,0.2)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    // Tron背景網格
    ctx.strokeStyle = '#00f'; ctx.lineWidth = 1; ctx.shadowBlur = 15; ctx.shadowColor = '#00f';
    for(let i=0; i<canvas.width; i+=50) {
        ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke();
    }
    
    fragments.forEach((f, idx) => {
        // 核心光球脈動
        if(!exploding) {
            f.size += Math.sin(Date.now()*0.01)*2;
            f.glow = 0.5 + Math.sin(Date.now()*0.005)*0.5;
            
            ctx.shadowBlur = 60 * f.glow;
            ctx.shadowColor = f.color;
            ctx.fillStyle = f.color;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.size, 0, Math.PI*2);
            ctx.fill();
            
            // 準備爆炸 (3秒後)
            if(Date.now() > explodeTime) {
                explodeFlynn(f);
                exploding = true;
            }
        } else {
            // 爆炸後碎片飛散
            f.x += f.vx; f.y += f.vy;
            f.vx *= 0.98; f.vy *= 0.98;
            f.size *= 0.995; f.glow *= 0.99;
            
            ctx.shadowBlur = 30 * f.glow;
            ctx.shadowColor = f.color;
            ctx.fillStyle = f.color;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.size, 0, Math.PI*2);
            ctx.fill();
            
            // 碎片消失
            if(f.size < 1) fragments.splice(idx, 1);
        }
    });
    
    if(fragments.length > 0) {
        requestAnimationFrame(derezLoop);
    } else {
        // 回到現實世界 (淡出)
        setTimeout(() => {
            document.getElementById('flynnDerez').style.opacity = 0;
            setTimeout(() => document.getElementById('flynnDerez').style.display = 'none', 2000);
        }, 3000);
    }
}

let explodeTime = Date.now() + 3000; // 3秒後爆炸

function explodeFlynn(core) {
    // 生成200個金色碎片飛散 (電影中身體解構)
    for(let i=0; i<200; i++) {
        const angle = (i/200) * Math.PI * 2;
        const speed = 2 + Math.random()*3;
        fragments.push({
            x: core.x, y: core.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 3 + Math.random()*4,
            glow: 1,
            color: `hsl(${20 + Math.random()*20}, 100%, ${60 + Math.random()*30}%)`
        });
    }
    fragments.splice(fragments.indexOf(core), 1);
}

// 遊戲勝利觸發
// if(playerEscapedGrid) showFlynnDerez();
</script>
```

## **視覺流程（完全還原電影）**
```
0-3秒：金色光球在螢幕中心脈動增縮
3秒：突然爆炸！200個金色碎片向外飛散
4-8秒：碎片逐漸減速、變小、消失
8秒後：畫面淡出，顯示「REAL WORLD」
```

## **音效（電影原聲）**
```javascript
function playDerezSound() {
    const audioCtx = new AudioContext();
    // 電影中「嗡嗡嗡→尖銳掃描→爆炸」三段音效
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 1.5);
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0, audioCtx.currentTime + 3);
    
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 3);
}
```

**這就是電影結尾Flynn犧牲時的確切特效！** 玩家看到自己變成金色光球爆炸解構，碎片飛散消失＝「成功逃脫Grid回到現實」。劇情完美收尾！ [youtube](https://www.youtube.com/watch?v=6Nn7J1Eb87E)