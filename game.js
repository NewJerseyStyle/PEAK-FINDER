// ============================================================
// PEAK FINDER - Complete Game Engine
// ============================================================

// --- Constants ---
const DIM_1D = 1, DIM_2D = 2, DIM_3D = 3;
const OPT_SGD = 'SGD', OPT_MOM = 'Momentum', OPT_RMSPROP = 'RMSprop', OPT_ADAM = 'Adam';
const SCH_FIXED = 'Fixed', SCH_DECAY = 'Step Decay', SCH_WARMUP = 'Warmup', SCH_COSINE = 'Cosine';
const TOTAL_LEVELS = 110;
const WORLD_SIZE = 5000;

// --- Terrain types for educational variety ---
const TERRAIN_SIMPLE = 'simple';
const TERRAIN_MULTIMODAL = 'multimodal';
const TERRAIN_PLATEAU = 'plateau';
const TERRAIN_SADDLE = 'saddle';
const TERRAIN_RIDGE = 'ridge';
const TERRAIN_ROSENBROCK = 'rosenbrock';
const TERRAIN_NOISY = 'noisy';
const TERRAIN_DECEPTIVE = 'deceptive';

// --- Level Definition Generator ---
const LEVELS = [];

function generateLevels() {
    for (let i = 1; i <= TOTAL_LEVELS; i++) {
        const L = {
            level: i, dimension: DIM_1D, optimizer: OPT_SGD, scheduler: SCH_FIXED,
            terrainType: TERRAIN_SIMPLE, difficulty: 0,
            tutorialMsg: null, narrativeMsg: null, mechanicChange: null,
            terrain: null, spawnPos: null, dynamicTarget: 0, minStepsRequired: 0
        };

        // --- Dimension ---
        if (i <= 40) L.dimension = DIM_1D;
        else if (i <= 100) L.dimension = DIM_2D;
        else L.dimension = DIM_3D;

        // --- Difficulty curve ---
        if (i <= 40) L.difficulty = (i - 1) / 120;
        else if (i <= 100) L.difficulty = 0.33 + (i - 40) / 100;
        else L.difficulty = 0.7 + (i - 100) / 35;
        L.difficulty = Math.min(1, L.difficulty);

        // === 1D Levels 1-40 ===
        if (i >= 1 && i <= 8) {
            L.optimizer = OPT_SGD; L.scheduler = SCH_FIXED; L.terrainType = TERRAIN_SIMPLE;
            if (i === 1) {
                L.tutorialMsg = "SGD (Stochastic Gradient Descent): Move one step at a time. Press RIGHT \u2192. If height drops, turn LEFT \u2190. Reach the summit to escape!";
                L.narrativeMsg = "ERROR: DIMENSIONAL COLLAPSE. You are trapped in a 1D line inside a computer. Find the peak to break free.";
                L.mechanicChange = "NEW: SGD optimizer active";
            }
        } else if (i >= 9 && i <= 16) {
            L.optimizer = OPT_SGD; L.scheduler = SCH_DECAY; L.terrainType = TERRAIN_MULTIMODAL;
            if (i === 9) {
                L.tutorialMsg = "STEP DECAY: Your step size shrinks 0.5% per jump! Watch the step bar \u2014 it gets smaller over time. Find the peak before your steps become too tiny to matter.";
                L.mechanicChange = "NEW: Step Decay scheduler";
            }
        } else if (i >= 17 && i <= 24) {
            L.optimizer = OPT_MOM; L.scheduler = SCH_FIXED; L.terrainType = TERRAIN_PLATEAU;
            if (i === 17) {
                L.tutorialMsg = "MOMENTUM: You now have inertia! Consecutive same-direction jumps ACCELERATE (velocity builds up). Changing direction is harder \u2014 your momentum resists. Watch the VEL indicator. Great for crossing flat plateaus where SGD would get stuck!";
                L.mechanicChange = "NEW: Momentum optimizer";
            }
        } else if (i >= 25 && i <= 32) {
            L.optimizer = OPT_MOM; L.scheduler = SCH_DECAY;
            L.terrainType = (i % 2 === 0) ? TERRAIN_SADDLE : TERRAIN_PLATEAU;
            if (i === 25) {
                L.tutorialMsg = "MOMENTUM + DECAY: Speed builds up from momentum, but step size shrinks from decay. You must balance speed with precision. Watch for SADDLE POINTS \u2014 flat areas that are NOT peaks! If gradient is ~0 but you haven't won, keep exploring.";
                L.mechanicChange = "NEW: Momentum + Step Decay combined";
            }
        } else if (i >= 33 && i <= 40) {
            L.optimizer = OPT_ADAM; L.scheduler = SCH_FIXED;
            L.terrainType = (i <= 36) ? TERRAIN_NOISY : TERRAIN_MULTIMODAL;
            if (i === 33) {
                L.tutorialMsg = "ADAM: The all-rounder! Combines momentum (speed buildup) AND adaptive step sizing (adjusts per recent gradients). Handles noisy terrain better than SGD or pure Momentum. Watch how it smooths out bumpy landscapes.";
                L.mechanicChange = "NEW: Adam optimizer";
            }
        }

        // === 2D Levels 41-100 ===
        else if (i >= 41 && i <= 50) {
            L.optimizer = OPT_SGD; L.scheduler = SCH_FIXED; L.terrainType = TERRAIN_SIMPLE;
            if (i === 41) {
                L.tutorialMsg = "2D WORLD: You've breached into 2D! Now you can move in 4 directions: \u2190\u2191\u2192\u2193. Brighter colors = higher terrain. Using SGD \u2014 you already know this from 1D, just with an extra axis!";
                L.narrativeMsg = "DIMENSION BREACH! The barrier cracked. 2D space unfolds around you. Two axes of freedom. Keep climbing to escape.";
                L.mechanicChange = "NEW: 2D space (SGD stays the same)";
            }
            if (i >= 46) L.terrainType = TERRAIN_MULTIMODAL; // Increase challenge by 46
        } else if (i >= 51 && i <= 58) {
            L.optimizer = OPT_SGD; L.scheduler = SCH_DECAY;
            L.terrainType = (i >= 55) ? TERRAIN_RIDGE : TERRAIN_MULTIMODAL;
            if (i === 51) {
                L.tutorialMsg = "STEP DECAY in 2D: Steps shrink 0.5% per jump, same as before. But now you must choose direction wisely \u2014 wrong turns waste your shrinking steps! Navigate ridges carefully.";
                L.mechanicChange = "CHANGED: Step Decay scheduler (optimizer stays SGD)";
            }
        } else if (i >= 59 && i <= 66) {
            L.optimizer = OPT_MOM; L.scheduler = SCH_FIXED;
            L.terrainType = (i >= 63) ? TERRAIN_SADDLE : TERRAIN_PLATEAU;
            if (i === 59) {
                L.tutorialMsg = "MOMENTUM in 2D: Inertia applies to BOTH X and Y axes! Your velocity arrow shows which direction momentum carries you. Changing direction costs energy. Use momentum to cross 2D plateaus and saddle points.";
                L.mechanicChange = "CHANGED: Momentum optimizer (Fixed scheduler)";
            }
        } else if (i >= 67 && i <= 74) {
            L.optimizer = OPT_MOM; L.scheduler = SCH_DECAY;
            L.terrainType = TERRAIN_ROSENBROCK;
            if (i === 67) {
                L.tutorialMsg = "MOMENTUM + DECAY in 2D: A banana-shaped valley awaits! The ROSENBROCK terrain has a curved path to the peak. Build momentum along the curve, but your steps shrink. This classic test challenges every optimizer.";
                L.mechanicChange = "CHANGED: Step Decay scheduler (Momentum stays)";
            }
        } else if (i >= 75 && i <= 82) {
            L.optimizer = OPT_MOM; L.scheduler = SCH_WARMUP;
            L.terrainType = TERRAIN_DECEPTIVE;
            if (i === 75) {
                L.tutorialMsg = "WARMUP: Steps start TINY and grow over 10 jumps! This lets you SCOUT first with small careful steps, then SPRINT when you know the direction. Patient exploration beats blind rushing here. Watch for deceptive fake peaks!";
                L.mechanicChange = "NEW: Warmup scheduler";
            }
        } else if (i >= 83 && i <= 90) {
            L.optimizer = OPT_RMSPROP; L.scheduler = SCH_FIXED;
            L.terrainType = TERRAIN_RIDGE;
            if (i === 83) {
                L.tutorialMsg = "RMSprop: Adapts step size per direction based on recent gradient magnitudes! In steep directions it takes smaller steps (avoids overshooting), in flat directions it takes larger steps (moves faster). Perfect for narrow ravines where X and Y have very different curvatures.";
                L.mechanicChange = "NEW: RMSprop optimizer";
            }
        } else if (i >= 91 && i <= 95) {
            L.optimizer = OPT_ADAM; L.scheduler = SCH_FIXED;
            L.terrainType = TERRAIN_DECEPTIVE;
            if (i === 91) {
                L.tutorialMsg = "ADAM in 2D: Momentum + RMSprop combined \u2014 the ultimate optimizer. Handles momentum (speed buildup), per-axis adaptation (different step sizes for X and Y), and noisy gradients. Can you master the most complex 2D landscapes?";
                L.mechanicChange = "CHANGED: Adam optimizer (Fixed scheduler)";
            }
        } else if (i >= 96 && i <= 100) {
            L.optimizer = OPT_ADAM; L.scheduler = SCH_COSINE;
            L.terrainType = TERRAIN_DECEPTIVE;
            if (i === 96) {
                L.tutorialMsg = "COSINE ANNEALING: Step size follows a smooth cosine curve \u2014 large at the start (broad exploration), smoothly shrinking to tiny at the end (fine-tuning). Combined with Adam, this is the full modern training recipe!";
                L.mechanicChange = "NEW: Cosine Annealing scheduler";
            }
            if (i === 100) {
                L.narrativeMsg = "FINAL 2D BARRIER! One more peak and you'll break through to 3D space. This is it\u2026";
            }
        }

        // === 3D Levels 101-110 ===
        else if (i >= 101 && i <= 103) {
            L.optimizer = OPT_SGD; L.scheduler = SCH_FIXED; L.terrainType = TERRAIN_MULTIMODAL;
            if (i === 101) {
                L.tutorialMsg = "3D WORLD! Three axes to navigate: X, Y, Z. Use arrow keys for XY, Q/E for Z-axis. CLICK a slice panel (or press 1/2/3) to switch which plane your arrow keys control! The three SLICE VIEWS show cross-sections at your position. Your active slice is highlighted. Find the peak across ALL three dimensions!";
                L.narrativeMsg = "FINAL DIMENSION! 3D space detected. Navigate X, Y, Z to find the ultimate peak and escape the computer forever!";
                L.mechanicChange = "NEW: 3D space (SGD, back to basics)";
            }
        } else if (i >= 104 && i <= 106) {
            L.optimizer = OPT_MOM; L.scheduler = SCH_FIXED; L.terrainType = TERRAIN_SADDLE;
            if (i === 104) {
                L.tutorialMsg = "MOMENTUM in 3D: Inertia in all three axes! Watch the slice views \u2014 momentum carries across dimensions. A saddle point in 3D can look like a peak in 2 of 3 slices. Check ALL slices before committing!";
                L.mechanicChange = "CHANGED: Momentum optimizer in 3D";
            }
        } else if (i >= 107 && i <= 110) {
            L.optimizer = OPT_ADAM; L.scheduler = SCH_COSINE; L.terrainType = TERRAIN_DECEPTIVE;
            if (i === 107) {
                L.tutorialMsg = "ADAM + COSINE in 3D: The ultimate challenge. All techniques combined: adaptive per-axis step sizes, momentum, cosine decay \u2014 in three dimensions. This is how real neural network optimizers work in high-dimensional space!";
                L.mechanicChange = "CHANGED: Adam + Cosine in 3D";
            }
            if (i === 110) {
                L.narrativeMsg = "THE FINAL PEAK. Reach the summit to escape the computer and return to the real world\u2026";
            }
        }

        LEVELS.push(L);
    }
}
generateLevels();

// ============================================================
// TERRAIN GENERATOR
// ============================================================
class TerrainGenerator {
    generate(level, spawnX, spawnY, spawnZ) {
        const terrain = { peaks: [], maxHeight: 0, targetX: 0, targetY: 0, targetZ: 0, type: level.terrainType, saddlePoints: [], ridgeAxis: null };

        const dist = 600 + level.difficulty * 1400;
        const angle = Math.random() * Math.PI * 2;
        const angle2 = Math.random() * Math.PI - Math.PI / 2;
        terrain.targetX = spawnX + Math.cos(angle) * dist;
        terrain.targetY = (level.dimension >= DIM_2D) ? spawnY + Math.sin(angle) * dist : spawnY;
        terrain.targetZ = (level.dimension >= DIM_3D) ? spawnZ + Math.sin(angle2) * dist * 0.6 : spawnZ;

        const mainAmp = 140 + level.difficulty * 100;
        const mainSigma = 250 + level.difficulty * 100;
        terrain.peaks.push({ x: terrain.targetX, y: terrain.targetY, z: terrain.targetZ, amplitude: mainAmp, sigma: mainSigma });

        switch (level.terrainType) {
            case TERRAIN_SIMPLE:
                this._addSimple(terrain, level, spawnX, spawnY, spawnZ);
                break;
            case TERRAIN_MULTIMODAL:
                this._addMultimodal(terrain, level, spawnX, spawnY, spawnZ);
                break;
            case TERRAIN_PLATEAU:
                this._addPlateau(terrain, level, spawnX, spawnY, spawnZ);
                break;
            case TERRAIN_SADDLE:
                this._addSaddle(terrain, level, spawnX, spawnY, spawnZ);
                break;
            case TERRAIN_RIDGE:
                this._addRidge(terrain, level, spawnX, spawnY, spawnZ);
                break;
            case TERRAIN_ROSENBROCK:
                this._addRosenbrock(terrain, level, spawnX, spawnY, spawnZ);
                break;
            case TERRAIN_NOISY:
                this._addNoisy(terrain, level, spawnX, spawnY, spawnZ);
                break;
            case TERRAIN_DECEPTIVE:
                this._addDeceptive(terrain, level, spawnX, spawnY, spawnZ);
                break;
        }

        terrain.maxHeight = this.getHeight(terrain, terrain.targetX, terrain.targetY, terrain.targetZ);
        return terrain;
    }

    _addSimple(terrain, level, sx, sy, sz) {
        const n = 5 + Math.floor(level.difficulty * 15);
        for (let i = 0; i < n; i++) {
            terrain.peaks.push({
                x: sx + (Math.random() - 0.5) * 3000, y: sy + (Math.random() - 0.5) * 3000,
                z: sz + (Math.random() - 0.5) * 3000,
                amplitude: 20 + Math.random() * 60, sigma: 100 + Math.random() * 200
            });
        }
    }

    _addMultimodal(terrain, level, sx, sy, sz) {
        // Multiple competing peaks of varying heights
        const n = 3 + Math.floor(level.difficulty * 5);
        for (let i = 0; i < n; i++) {
            const angle = (i / n) * Math.PI * 2;
            const d = 400 + Math.random() * 800;
            terrain.peaks.push({
                x: sx + Math.cos(angle) * d, y: sy + Math.sin(angle) * d, z: sz,
                amplitude: 60 + Math.random() * 80, sigma: 150 + Math.random() * 200
            });
        }
        // Small distractors
        for (let i = 0; i < 20; i++) {
            terrain.peaks.push({
                x: sx + (Math.random() - 0.5) * 3000, y: sy + (Math.random() - 0.5) * 3000, z: sz,
                amplitude: 10 + Math.random() * 40, sigma: 50 + Math.random() * 150
            });
        }
    }

    _addPlateau(terrain, level, sx, sy, sz) {
        // Large flat region between spawn and target (gradient ~0, momentum needed)
        const mx = (sx + terrain.targetX) / 2;
        const my = (sy + terrain.targetY) / 2;
        // Flat plateau: wide gaussian with low amplitude creates flat zone
        terrain.peaks.push({ x: mx, y: my, z: sz, amplitude: 50, sigma: 800 });
        // Dips around plateau edges to create "moat"
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            terrain.peaks.push({
                x: mx + Math.cos(a) * 500, y: my + Math.sin(a) * 500, z: sz,
                amplitude: -30, sigma: 200
            });
        }
        // Small bumps on plateau to confuse
        for (let i = 0; i < 10; i++) {
            terrain.peaks.push({
                x: mx + (Math.random() - 0.5) * 600, y: my + (Math.random() - 0.5) * 600, z: sz,
                amplitude: 3 + Math.random() * 5, sigma: 100 + Math.random() * 100
            });
        }
    }

    _addSaddle(terrain, level, sx, sy, sz) {
        // Saddle point between spawn and target: goes up in one direction, down in another
        const mx = (sx + terrain.targetX) / 2;
        const my = (sy + terrain.targetY) / 2;
        terrain.saddlePoints.push({ x: mx, y: my, z: sz, strength: 40 + level.difficulty * 30 });
        // Distractors
        for (let i = 0; i < 10; i++) {
            terrain.peaks.push({
                x: sx + (Math.random() - 0.5) * 2500, y: sy + (Math.random() - 0.5) * 2500, z: sz,
                amplitude: 20 + Math.random() * 50, sigma: 100 + Math.random() * 200
            });
        }
    }

    _addRidge(terrain, level, sx, sy, sz) {
        // Narrow ridge/ravine: sharp in one axis, gentle in another (shows RMSprop advantage)
        terrain.ridgeAxis = Math.random() > 0.5 ? 'x' : 'y';
        const mx = (sx + terrain.targetX) / 2;
        const my = (sy + terrain.targetY) / 2;
        // Ridge along one axis: very narrow sigma in one direction
        for (let i = 0; i < 8; i++) {
            const t = i / 7;
            const rx = sx + (terrain.targetX - sx) * t;
            const ry = sy + (terrain.targetY - sy) * t;
            terrain.peaks.push({
                x: rx, y: ry, z: sz,
                amplitude: 30 + t * 40,
                sigma: terrain.ridgeAxis === 'x' ? 30 : 200,
                sigmaY: terrain.ridgeAxis === 'x' ? 200 : 30
            });
        }
        // Valley walls
        for (let i = 0; i < 15; i++) {
            terrain.peaks.push({
                x: mx + (Math.random() - 0.5) * 2000, y: my + (Math.random() - 0.5) * 2000, z: sz,
                amplitude: -20 - Math.random() * 30, sigma: 100 + Math.random() * 100
            });
        }
    }

    _addRosenbrock(terrain, level, sx, sy, sz) {
        // Banana-shaped valley curving from spawn toward target
        terrain.rosenbrock = { cx: sx, cy: sy, tx: terrain.targetX, ty: terrain.targetY, a: 1, b: 100 * (0.5 + level.difficulty * 0.5) };
        // Some fake peaks along the valley
        for (let i = 0; i < 8; i++) {
            const t = i / 7;
            const px = sx + (terrain.targetX - sx) * t + (Math.random() - 0.5) * 300;
            const py = sy + (terrain.targetY - sy) * t + (Math.random() - 0.5) * 300;
            terrain.peaks.push({ x: px, y: py, z: sz, amplitude: 20 + Math.random() * 30, sigma: 150 + Math.random() * 100 });
        }
    }

    _addNoisy(terrain, level, sx, sy, sz) {
        // Base terrain + high-frequency noise
        terrain.noiseFreq = 0.02 + level.difficulty * 0.03;
        terrain.noiseAmp = 8 + level.difficulty * 15;
        for (let i = 0; i < 15; i++) {
            terrain.peaks.push({
                x: sx + (Math.random() - 0.5) * 3000, y: sy + (Math.random() - 0.5) * 3000, z: sz,
                amplitude: 20 + Math.random() * 50, sigma: 100 + Math.random() * 200
            });
        }
    }

    _addDeceptive(terrain, level, sx, sy, sz) {
        // Multiple peaks of NEARLY equal height — only one is the true target
        const n = 3 + Math.floor(level.difficulty * 4);
        for (let i = 0; i < n; i++) {
            const angle = Math.random() * Math.PI * 2;
            const d = 500 + Math.random() * 1200;
            terrain.peaks.push({
                x: sx + Math.cos(angle) * d, y: sy + Math.sin(angle) * d, z: sz + (Math.random() - 0.5) * 600,
                amplitude: terrain.peaks[0].amplitude * (0.7 + Math.random() * 0.25), // Nearly as high
                sigma: 150 + Math.random() * 200
            });
        }
        // Noise
        for (let i = 0; i < 15; i++) {
            terrain.peaks.push({
                x: sx + (Math.random() - 0.5) * 3000, y: sy + (Math.random() - 0.5) * 3000, z: sz,
                amplitude: 10 + Math.random() * 25, sigma: 80 + Math.random() * 150
            });
        }
    }

    getHeight(terrain, x, y, z) {
        let h = 30;
        h += Math.sin(x * 0.004) * 6 + Math.cos(y * 0.004) * 6;
        if (terrain.type === TERRAIN_NOISY && terrain.noiseFreq) {
            h += Math.sin(x * terrain.noiseFreq * 7.3 + y * 3.1) * terrain.noiseAmp * 0.4;
            h += Math.cos(x * terrain.noiseFreq * 4.7 - y * 5.3) * terrain.noiseAmp * 0.3;
            h += Math.sin((x + y) * terrain.noiseFreq * 2.1) * terrain.noiseAmp * 0.3;
        }
        // Saddle points: h += strength * (dx^2 - dy^2) / scale^2
        if (terrain.saddlePoints) {
            terrain.saddlePoints.forEach(sp => {
                const dx = (x - sp.x) / 300;
                const dy = (y - sp.y) / 300;
                const dz = z !== undefined ? (z - (sp.z || 0)) / 300 : 0;
                const dist = dx * dx + dy * dy + dz * dz;
                if (dist < 9) { // Only affect nearby area
                    h += sp.strength * (dx * dx - dy * dy) * Math.exp(-dist * 0.3);
                }
            });
        }
        // Rosenbrock valley
        if (terrain.rosenbrock) {
            const rb = terrain.rosenbrock;
            const dx = (x - rb.tx) / 500;
            const dy = (y - rb.ty) / 500;
            const rosenVal = (rb.a - dx) * (rb.a - dx) + rb.b * (dy - dx * dx) * (dy - dx * dx);
            h += 80 / (1 + rosenVal * 0.5); // Inverted rosenbrock — peak at minimum
        }
        // Gaussian peaks (with optional anisotropic sigma)
        terrain.peaks.forEach(p => {
            const ddx = x - p.x, ddy = y - p.y, ddz = (z !== undefined ? z - (p.z || 0) : 0);
            const sx = p.sigma, sy = p.sigmaY || p.sigma, sz = p.sigma;
            const dSq = (ddx * ddx) / (sx * sx) + (ddy * ddy) / (sy * sy) + (ddz * ddz) / (sz * sz);
            h += p.amplitude * Math.exp(-dSq / 2);
        });
        return Math.max(0, h);
    }
}

// ============================================================
// GAME CLASS
// ============================================================
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.mCanvas = document.getElementById('minimapCanvas');
        this.mCtx = this.mCanvas.getContext('2d');
        this.state = 'MENU';
        this.currentLevel = null;
        this.terrain = null;
        this.generator = new TerrainGenerator();
        this.pos = { x: 2500, y: 2500, z: 2500 };
        this.history = [];
        this.steps = 0;
        this.pulse = 0;
        this.camera = { x: 2500, y: 2500, z: 2500, h: 50 };
        this.power = 20;
        this.velocity = { x: 0, y: 0, z: 0 };
        this.effectiveStep = 4;
        this.totalStars = 0;
        this.totalSteps = 0;
        // RMSprop / Adam state
        this.gradSqAvg = { x: 0, y: 0, z: 0 };
        this.gradAvg = { x: 0, y: 0, z: 0 };
        // Optimizer replay state
        this.optimizerPath = null;
        this.replayState = null;
        this.playerHistory = null; // saved during replay
        this.playerPos = null;
        this.nextLevelPromise = null;
        this.winStars = 0;
        this.optimizerPathName = null;
        // Difficulty: 'dummy' (terrain visible), 'normal' (terrain hidden), 'hard' (no heatmap + tight scoring)
        this.difficulty = 'dummy';
        // 3D active slice: which plane arrow keys control
        this.activeSlice = 'XY'; // 'XY', 'XZ', 'YZ'
        // Player progress / save data
        this.playerName = '';
        this.maxLevelPassed = 0; // highest level completed
        this.levelStars = {}; // { levelNum: bestStars }
        this.loadProgress();

        this.inpPower = document.getElementById('inpPower');
        this.inpPower.oninput = (e) => { this.power = parseInt(e.target.value); document.getElementById('valPower').textContent = this.power; };
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('keydown', (e) => this.handleInput(e));
        this.resize();
        this.animate();

        // Restore player name in input
        const nameInput = document.getElementById('playerNameInput');
        if (nameInput && this.playerName) nameInput.value = this.playerName;
    }

    // --- Save/Load using localStorage ---
    saveProgress() {
        const data = {
            playerName: this.playerName,
            maxLevelPassed: this.maxLevelPassed,
            levelStars: this.levelStars,
        };
        try { localStorage.setItem('peakfinder_save', JSON.stringify(data)); } catch (e) { /* quota */ }
    }

    loadProgress() {
        try {
            const raw = localStorage.getItem('peakfinder_save');
            if (raw) {
                const data = JSON.parse(raw);
                this.playerName = data.playerName || '';
                this.maxLevelPassed = data.maxLevelPassed || 0;
                this.levelStars = data.levelStars || {};
            }
        } catch (e) { /* parse error */ }
    }

    saveRanking() {
        // Append current run to ranking leaderboard
        const entry = {
            name: this.playerName || 'ANONYMOUS',
            stars: this.totalStars,
            steps: this.totalSteps,
            levels: this.maxLevelPassed,
            difficulty: this.difficulty,
            date: Date.now()
        };
        try {
            const raw = localStorage.getItem('peakfinder_ranking');
            const ranking = raw ? JSON.parse(raw) : [];
            ranking.push(entry);
            // Keep top 50 by stars desc, steps asc
            ranking.sort((a, b) => b.stars - a.stars || a.steps - b.steps);
            if (ranking.length > 50) ranking.length = 50;
            localStorage.setItem('peakfinder_ranking', JSON.stringify(ranking));
        } catch (e) { /* quota */ }
    }

    getRanking() {
        try {
            const raw = localStorage.getItem('peakfinder_ranking');
            return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
    }

    setPlayerName(name) {
        this.playerName = name.trim().substring(0, 16);
        this.saveProgress();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.mCanvas.width = this.mCanvas.offsetWidth || 200;
        this.mCanvas.height = this.mCanvas.offsetHeight || 100;
        // Resize slice canvases if 3D
        ['XY', 'XZ', 'YZ'].forEach(id => {
            const c = document.getElementById('sliceCanvas' + id);
            if (c) { c.width = c.offsetWidth || 130; c.height = c.offsetHeight || 120; }
        });
    }

    handleInput(e) {
        if (e.key === 'Escape') { this.togglePause(); return; }
        if (this.state !== 'PLAYING') return;
        const dim = this.currentLevel.dimension;

        // 3D slice switching with 1/2/3 keys
        if (dim === DIM_3D) {
            if (e.key === '1') { this.setActiveSlice('XY'); return; }
            if (e.key === '2') { this.setActiveSlice('XZ'); return; }
            if (e.key === '3') { this.setActiveSlice('YZ'); return; }
        }

        if (dim <= DIM_2D) {
            // 1D/2D: standard controls
            switch (e.key) {
                case 'ArrowLeft': this.jump(-1, 0, 0); break;
                case 'ArrowRight': this.jump(1, 0, 0); break;
                case 'ArrowUp': if (dim >= DIM_2D) this.jump(0, 1, 0); break;
                case 'ArrowDown': if (dim >= DIM_2D) this.jump(0, -1, 0); break;
            }
        } else {
            // 3D: arrow keys control the active slice axes, Q/E control the third axis
            const s = this.activeSlice;
            // Map arrow keys to the two axes of the active slice
            // Left/Right = first axis (negative/positive), Up/Down = second axis
            let dx = 0, dy = 0, dz = 0;
            switch (e.key) {
                case 'ArrowLeft':
                    if (s === 'XY' || s === 'XZ') dx = -1; else dy = -1; break;
                case 'ArrowRight':
                    if (s === 'XY' || s === 'XZ') dx = 1; else dy = 1; break;
                case 'ArrowUp':
                    if (s === 'XY') dy = 1; else dz = 1; break;
                case 'ArrowDown':
                    if (s === 'XY') dy = -1; else dz = -1; break;
                case 'q': case 'Q':
                    if (s === 'XY') dz = 1; else if (s === 'XZ') dy = 1; else dx = 1; break;
                case 'e': case 'E':
                    if (s === 'XY') dz = -1; else if (s === 'XZ') dy = -1; else dx = -1; break;
            }
            if (dx || dy || dz) this.jump(dx, dy, dz);
        }
    }

    setActiveSlice(sliceId) {
        this.activeSlice = sliceId;
        ['XY', 'XZ', 'YZ'].forEach(id => {
            document.getElementById('slice' + id).classList.toggle('active', id === sliceId);
        });
        // Update d-pad button labels to show which axes they control
        const labels = {
            'XY': { up: 'Y+', down: 'Y-', left: 'X-', right: 'X+', zup: 'Z+', zdown: 'Z-' },
            'XZ': { up: 'Z+', down: 'Z-', left: 'X-', right: 'X+', zup: 'Y+', zdown: 'Y-' },
            'YZ': { up: 'Z+', down: 'Z-', left: 'Y-', right: 'Y+', zup: 'X+', zdown: 'X-' },
        };
        const l = labels[sliceId];
        document.getElementById('btnUp').textContent = l.up;
        document.getElementById('btnDown').textContent = l.down;
        document.getElementById('btnLeft').textContent = l.left;
        document.getElementById('btnRight').textContent = l.right;
        document.getElementById('btnZUp').textContent = l.zup;
        document.getElementById('btnZDown').textContent = l.zdown;
        this.showHint(`Active: ${sliceId} plane`);
    }

    // D-pad button handler: maps button presses to correct axes based on activeSlice
    dpadJump(dir) {
        const dim = this.currentLevel ? this.currentLevel.dimension : DIM_1D;
        if (dim <= DIM_2D) {
            // 1D/2D: standard mapping
            switch (dir) {
                case 'up': this.jump(0, 1, 0); break;
                case 'down': this.jump(0, -1, 0); break;
                case 'left': this.jump(-1, 0, 0); break;
                case 'right': this.jump(1, 0, 0); break;
            }
        } else {
            // 3D: map based on activeSlice
            const maps = {
                'XY': { up: [0,1,0], down: [0,-1,0], left: [-1,0,0], right: [1,0,0], zup: [0,0,1], zdown: [0,0,-1] },
                'XZ': { up: [0,0,1], down: [0,0,-1], left: [-1,0,0], right: [1,0,0], zup: [0,1,0], zdown: [0,-1,0] },
                'YZ': { up: [0,0,1], down: [0,0,-1], left: [0,-1,0], right: [0,1,0], zup: [1,0,0], zdown: [-1,0,0] },
            };
            const m = maps[this.activeSlice][dir];
            if (m) this.jump(m[0], m[1], m[2]);
        }
    }

    setDifficulty(diff) {
        this.difficulty = diff;
        // Visual feedback on start screen
        ['dummy', 'normal', 'hard'].forEach(d => {
            const btn = document.getElementById('diff' + d.charAt(0).toUpperCase() + d.slice(1));
            if (btn) btn.style.background = d === diff ? 'rgba(78,204,163,0.2)' : 'transparent';
        });
    }

    // --- Shared optimizer simulation (used by both verify and replay) ---
    // Runs the EXACT same optimizer logic so replay always matches verification.
    // Returns array of {x, y, z, h} positions.
    _simulateOptimizer(level, terrain, startPos, maxSim) {
        let simPos = { ...startPos };
        let simVel = { x: 0, y: 0, z: 0 };
        let simGradSqAvg = { x: 0, y: 0, z: 0 };
        let simGradAvg = { x: 0, y: 0, z: 0 };
        const cosinePeriod = 500;
        const baseLR = 10;
        const path = [];
        const h0 = this.generator.getHeight(terrain, simPos.x, simPos.y, simPos.z);
        path.push({ x: simPos.x, y: simPos.y, z: simPos.z, h: h0 });
        let stuckCount = 0;
        let prevH = h0;

        for (let step = 0; step < maxSim; step++) {
            const h = this.generator.getHeight(terrain, simPos.x, simPos.y, simPos.z);
            if (h >= terrain.maxHeight * 0.985) break;

            // Compute gradient per axis
            const delta = 5;
            const gx = this.generator.getHeight(terrain, simPos.x + delta, simPos.y, simPos.z) - h;
            const gy = (level.dimension >= DIM_2D) ? this.generator.getHeight(terrain, simPos.x, simPos.y + delta, simPos.z) - h : 0;
            const gz = (level.dimension >= DIM_3D) ? this.generator.getHeight(terrain, simPos.x, simPos.y, simPos.z + delta) - h : 0;

            // Normalize direction (ensures movement even when gradient is tiny)
            let len = Math.sqrt(gx * gx + gy * gy + gz * gz);
            if (len < 0.0001) len = 0.0001;
            const dx = gx / len, dy = gy / len, dz = gz / len;

            // Apply scheduler to learning rate
            let lr = baseLR;
            if (level.scheduler === SCH_DECAY) lr *= Math.pow(0.995, step);
            if (level.scheduler === SCH_WARMUP && step < 10) lr *= (step + 1) / 10;
            if (level.scheduler === SCH_COSINE) lr *= 0.5 * (1 + Math.cos(Math.PI * Math.min(step, cosinePeriod) / cosinePeriod));

            let moveX = 0, moveY = 0, moveZ = 0;

            if (level.optimizer === OPT_SGD) {
                // SGD: step in normalized gradient direction
                moveX = dx * lr; moveY = dy * lr; moveZ = dz * lr;
            } else if (level.optimizer === OPT_MOM) {
                // Momentum: v = beta*v + lr*direction; pos += v
                const beta = 0.9;
                simVel.x = beta * simVel.x + lr * dx;
                simVel.y = beta * simVel.y + lr * dy;
                simVel.z = beta * simVel.z + lr * dz;
                moveX = simVel.x; moveY = simVel.y; moveZ = simVel.z;
            } else if (level.optimizer === OPT_RMSPROP) {
                // RMSprop: adapt per axis using gradient magnitude, but move in normalized direction
                // s = decay*s + (1-decay)*g^2; step = lr * dir / (sqrt(s) + eps)
                // This way it adapts step SIZE per axis but always MOVES (doesn't freeze at local max)
                const rmsDecay = 0.9, rmsEps = 0.01;
                simGradSqAvg.x = rmsDecay * simGradSqAvg.x + (1 - rmsDecay) * gx * gx;
                simGradSqAvg.y = rmsDecay * simGradSqAvg.y + (1 - rmsDecay) * gy * gy;
                simGradSqAvg.z = rmsDecay * simGradSqAvg.z + (1 - rmsDecay) * gz * gz;
                // Use normalized direction * lr, scaled by adaptive factor
                moveX = lr * dx / (Math.sqrt(simGradSqAvg.x) + rmsEps);
                moveY = lr * dy / (Math.sqrt(simGradSqAvg.y) + rmsEps);
                moveZ = lr * dz / (Math.sqrt(simGradSqAvg.z) + rmsEps);
            } else if (level.optimizer === OPT_ADAM) {
                // Adam: textbook m_hat / (sqrt(v_hat) + eps) but using normalized direction
                // to prevent freezing at local maxima
                const beta1 = 0.9, beta2 = 0.999, adamEps = 0.01;
                const t = step + 1;
                // First moment (accumulates normalized gradient direction = momentum)
                simGradAvg.x = beta1 * simGradAvg.x + (1 - beta1) * dx;
                simGradAvg.y = beta1 * simGradAvg.y + (1 - beta1) * dy;
                simGradAvg.z = beta1 * simGradAvg.z + (1 - beta1) * dz;
                // Second moment (tracks gradient magnitude for adaptation)
                simGradSqAvg.x = beta2 * simGradSqAvg.x + (1 - beta2) * gx * gx;
                simGradSqAvg.y = beta2 * simGradSqAvg.y + (1 - beta2) * gy * gy;
                simGradSqAvg.z = beta2 * simGradSqAvg.z + (1 - beta2) * gz * gz;
                // Bias correction
                const bc1 = 1 - Math.pow(beta1, t), bc2 = 1 - Math.pow(beta2, t);
                const mHatX = simGradAvg.x / bc1, mHatY = simGradAvg.y / bc1, mHatZ = simGradAvg.z / bc1;
                const vHatX = simGradSqAvg.x / bc2, vHatY = simGradSqAvg.y / bc2, vHatZ = simGradSqAvg.z / bc2;
                // Adam update: lr * m_hat / (sqrt(v_hat) + eps)
                moveX = lr * mHatX / (Math.sqrt(vHatX) + adamEps);
                moveY = lr * mHatY / (Math.sqrt(vHatY) + adamEps);
                moveZ = lr * mHatZ / (Math.sqrt(vHatZ) + adamEps);
            }

            simPos.x = Math.max(0, Math.min(WORLD_SIZE, simPos.x + moveX));
            simPos.y = Math.max(0, Math.min(WORLD_SIZE, simPos.y + moveY));
            simPos.z = Math.max(0, Math.min(WORLD_SIZE, simPos.z + moveZ));
            const newH = this.generator.getHeight(terrain, simPos.x, simPos.y, simPos.z);
            path.push({ x: simPos.x, y: simPos.y, z: simPos.z, h: newH });

            // Detect if stuck at local maximum (height not improving)
            if (Math.abs(newH - prevH) < 0.001) stuckCount++;
            else stuckCount = 0;
            prevH = newH;
            // If stuck for 50 steps, add random perturbation (simulates restart/exploration)
            if (stuckCount >= 50) {
                const jitter = 30 + step * 0.1;
                simPos.x += (Math.random() - 0.5) * jitter;
                simPos.y += (Math.random() - 0.5) * jitter;
                if (level.dimension >= DIM_3D) simPos.z += (Math.random() - 0.5) * jitter;
                simVel = { x: 0, y: 0, z: 0 };
                stuckCount = 0;
            }

            if (lr < 0.01) break;
        }
        return path;
    }

    // --- Level Verification (async wrapper around shared simulation) ---
    async verifyLevel(level, terrain, startPos) {
        // Yield to UI periodically during heavy generation
        await new Promise(r => requestAnimationFrame(r));
        const path = this._simulateOptimizer(level, terrain, startPos, 1500);
        const lastH = path[path.length - 1].h;
        const reached = lastH >= terrain.maxHeight * 0.985;
        return { reached, steps: path.length - 1 };
    }

    // --- Terrain Generation (reusable for pre-gen) ---
    async generateTerrainForLevel(levelObj) {
        const spawnCenter = 2500;
        let winnable = false, genAttempts = 0, idealResult = null, terrain = null, spawnPos = null;
        while (!winnable && genAttempts < 5) {
            terrain = this.generator.generate(levelObj, spawnCenter, spawnCenter, spawnCenter);
            levelObj.dynamicTarget = terrain.maxHeight * 0.97;
            let attempts = 0;
            while (attempts < 15) {
                const rx = spawnCenter + (Math.random() - 0.5) * 400;
                const ry = levelObj.dimension >= DIM_2D ? spawnCenter + (Math.random() - 0.5) * 400 : spawnCenter;
                const rz = levelObj.dimension >= DIM_3D ? spawnCenter + (Math.random() - 0.5) * 400 : spawnCenter;
                const h = this.generator.getHeight(terrain, rx, ry, rz);
                const distToPeak = Math.sqrt(Math.pow(rx - terrain.targetX, 2) + Math.pow(ry - terrain.targetY, 2) + Math.pow(rz - terrain.targetZ, 2));
                if (h > 25 && h < levelObj.dynamicTarget * 0.7 && distToPeak > 500) {
                    spawnPos = { x: rx, y: ry, z: rz };
                    idealResult = await this.verifyLevel(levelObj, terrain, spawnPos);
                    if (idealResult.reached) { winnable = true; break; }
                }
                attempts++;
            }
            genAttempts++;
        }
        if (!winnable) {
            terrain = this.generator.generate({ ...levelObj, terrainType: TERRAIN_SIMPLE }, spawnCenter, spawnCenter, spawnCenter);
            terrain.maxHeight = this.generator.getHeight(terrain, terrain.targetX, terrain.targetY, terrain.targetZ);
            levelObj.dynamicTarget = terrain.maxHeight * 0.97;
            spawnPos = { x: spawnCenter, y: spawnCenter, z: spawnCenter };
            idealResult = await this.verifyLevel(levelObj, terrain, spawnPos);
        }
        levelObj.minStepsRequired = idealResult ? idealResult.steps : 50;
        levelObj.terrain = terrain;
        levelObj.spawnPos = { ...spawnPos };
        return { terrain, spawnPos };
    }

    // --- Pre-generate next level terrain in background ---
    preGenerateNextLevel(nextNum) {
        if (nextNum > TOTAL_LEVELS) return;
        const nextLevel = LEVELS[nextNum - 1];
        if (nextLevel.terrain) return; // Already generated
        this.nextLevelPromise = this.generateTerrainForLevel(nextLevel);
    }

    // --- Start Level ---
    async startLevel(num, isRestart = false) {
        if (num > TOTAL_LEVELS) { this.showTronEnding(); return; }
        this.currentLevel = LEVELS[num - 1];
        const detailDiv = document.getElementById('levelDetails');
        let hintInterval = null;

        // Hide win/replay UI
        document.getElementById('winScreen').classList.add('hidden');
        document.getElementById('replayBanner').classList.add('hidden');
        this.replayState = null;

        // Generate terrain if needed (skip if pre-generated or restart)
        if (!this.currentLevel.terrain) {
            const hints = [
                "SGD: Stochastic Gradient Descent \u2014 simple, steady, reliable.",
                "Momentum helps cross flat plateaus where gradient is near zero.",
                "Step Decay: Use your steps wisely \u2014 they shrink over time!",
                "RMSprop adapts step size per axis \u2014 great for ravines.",
                "Adam = Momentum + RMSprop. The modern default optimizer.",
                "Saddle points look flat but aren't peaks \u2014 keep exploring!",
                "Warmup: Start small, scout the terrain, then sprint.",
                "Cosine Annealing: Explore broadly at start, fine-tune at end.",
                "In 3D, check ALL slice views before committing to a direction."
            ];
            const showHint = () => {
                const hint = hints[Math.floor(Math.random() * hints.length)];
                detailDiv.innerHTML = `<div class="title-pop" style="font-size:22px;color:#4ecca3;">CALIBRATING...</div><div class="title-pop" style="font-size:14px;opacity:1;">${hint}</div>`;
            };
            showHint();
            hintInterval = setInterval(showHint, 12000);
            await new Promise(r => requestAnimationFrame(r));
            await this.generateTerrainForLevel(this.currentLevel);
        }
        this.terrain = this.currentLevel.terrain;
        this.pos = { ...this.currentLevel.spawnPos };

        if (hintInterval) clearInterval(hintInterval);

        // Reset state
        this.history = [];
        this.steps = 0;
        this.velocity = { x: 0, y: 0, z: 0 };
        this.gradSqAvg = { x: 0, y: 0, z: 0 };
        this.gradAvg = { x: 0, y: 0, z: 0 };
        this.state = 'PLAYING';
        const h0 = this.generator.getHeight(this.terrain, this.pos.x, this.pos.y, this.pos.z);
        this.history.push({ x: this.pos.x, y: this.pos.y, z: this.pos.z, h: h0 });

        // UI setup
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('levelSelectScreen').classList.add('hidden');
        document.getElementById('rankingScreen').classList.add('hidden');
        document.getElementById('pauseScreen').classList.add('hidden');
        document.getElementById('hud').classList.remove('hidden');
        this.resize();

        // Update HUD values
        document.getElementById('valLevel').textContent = num;
        document.getElementById('valSteps').textContent = 0;
        document.getElementById('valDim').textContent = this.currentLevel.dimension + 'D';
        document.getElementById('valOptimizer').textContent = this.currentLevel.optimizer;
        document.getElementById('valScheduler').textContent = this.currentLevel.scheduler;
        document.getElementById('valMomentum').textContent = '0.0';

        // Show/hide controls based on dimension
        const is1D = this.currentLevel.dimension === DIM_1D;
        const is3D = this.currentLevel.dimension === DIM_3D;
        document.getElementById('btnUp').classList.toggle('hidden', is1D);
        document.getElementById('btnDown').classList.toggle('hidden', is1D);
        document.getElementById('btnZUp').classList.toggle('hidden', !is3D);
        document.getElementById('btnZDown').classList.toggle('hidden', !is3D);
        document.getElementById('slicePanels').classList.toggle('hidden', !is3D);

        // Show momentum badge only for momentum-based optimizers
        const hasMomentum = this.currentLevel.optimizer !== OPT_SGD;
        document.getElementById('momentumBadge').classList.toggle('hidden', !hasMomentum);

        // Update difficulty badge
        const diffBadge = document.getElementById('diffBadge');
        diffBadge.textContent = this.difficulty.toUpperCase();
        diffBadge.className = 'difficulty-badge ' + this.difficulty;

        // Level intro
        let html = `<div class="title-pop">LEVEL ${num}</div>`;
        if (this.currentLevel.mechanicChange) {
            html += `<div class="mechanic-change-pop">${this.currentLevel.mechanicChange}</div>`;
        }
        if (this.currentLevel.tutorialMsg) {
            html += `<div class="tutorial-pop">${this.currentLevel.tutorialMsg}</div>`;
        }
        if (this.currentLevel.narrativeMsg) {
            html += `<div class="narrative-pop">${this.currentLevel.narrativeMsg}</div>`;
        }
        detailDiv.innerHTML = html;

        this.updateHUD();
        this.camera = { x: this.pos.x, y: this.pos.y, z: this.pos.z, h: h0 };
    }

    resetLevel() {
        document.getElementById('winScreen').classList.add('hidden');
        document.getElementById('replayBanner').classList.add('hidden');
        this.replayState = null;
        if (this.currentLevel) this.startLevel(this.currentLevel.level, true);
    }

    // Start game from the next unfinished level (or level 1)
    startGame() {
        const nextLevel = Math.min(this.maxLevelPassed + 1, TOTAL_LEVELS);
        this.startLevel(nextLevel);
    }

    showMenu() {
        this.state = 'MENU';
        this.replayState = null;
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('pauseScreen').classList.add('hidden');
        document.getElementById('levelSelectScreen').classList.add('hidden');
        document.getElementById('winScreen').classList.add('hidden');
        document.getElementById('replayBanner').classList.add('hidden');
        document.getElementById('rankingScreen').classList.add('hidden');
        document.getElementById('tronEnding').classList.add('hidden');
        document.getElementById('tronText').style.display = 'none';
        document.getElementById('tronButtons').style.display = 'none';
        document.getElementById('tronButtons').style.opacity = '0';
        const startScreen = document.getElementById('startScreen');
        startScreen.classList.remove('hidden');
        startScreen.style.opacity = '1';
        // Reset level select opacity for next open
        document.getElementById('levelSelectScreen').style.opacity = '1';
    }

    showLevelSelect() {
        const list = document.getElementById('levelList');
        list.innerHTML = '';
        LEVELS.forEach(l => {
            const btn = document.createElement('button');
            btn.className = 'menu-btn';
            btn.style.cssText = 'width:100%;font-size:11px;padding:8px 4px;margin:0;position:relative;';
            btn.textContent = `${l.level}`;
            const dimLabel = l.dimension === DIM_1D ? '1D' : l.dimension === DIM_2D ? '2D' : '3D';
            btn.title = `L${l.level} ${dimLabel} ${l.optimizer} ${l.scheduler}`;
            // Color code by dimension
            if (l.dimension === DIM_2D) btn.style.borderColor = '#ffcc4e';
            if (l.dimension === DIM_3D) btn.style.borderColor = '#ff6b9d';

            const passed = l.level <= this.maxLevelPassed;
            const unlocked = l.level <= this.maxLevelPassed + 1; // Can play next unfinished level
            if (passed) {
                btn.classList.add('level-btn-passed');
                const stars = this.levelStars[l.level];
                if (stars) btn.setAttribute('data-stars', '\u2B50'.repeat(stars));
            }
            if (!unlocked) {
                btn.classList.add('level-btn-locked');
            } else {
                btn.onclick = () => this.startLevelFromSelect(l.level);
            }
            list.appendChild(btn);
        });
        document.getElementById('startScreen').classList.add('hidden');
        const screen = document.getElementById('levelSelectScreen');
        screen.style.opacity = '1';
        screen.classList.remove('hidden');
    }

    // Start level from level select with fade-out transition
    async startLevelFromSelect(num) {
        const screen = document.getElementById('levelSelectScreen');
        // Fade out the level select overlay
        screen.style.opacity = '0';
        // Wait for fade transition
        await new Promise(r => setTimeout(r, 500));
        screen.classList.add('hidden');
        screen.style.opacity = '1';
        this.startLevel(num);
    }

    showRanking() {
        this._renderRanking();
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('rankingScreen').classList.remove('hidden');
    }

    showRankingFromEnding() {
        this._renderRanking();
        document.getElementById('tronEnding').classList.add('hidden');
        document.getElementById('tronText').style.display = 'none';
        document.getElementById('tronButtons').style.display = 'none';
        document.getElementById('rankingScreen').classList.remove('hidden');
    }

    restartFromEnding() {
        document.getElementById('tronEnding').classList.add('hidden');
        document.getElementById('tronText').style.display = 'none';
        document.getElementById('tronButtons').style.display = 'none';
        this.totalStars = 0;
        this.totalSteps = 0;
        this.showMenu();
    }

    _renderRanking() {
        const ranking = this.getRanking();
        const container = document.getElementById('rankingList');
        if (ranking.length === 0) {
            container.innerHTML = '<div style="color:#666;text-align:center;padding:30px;font-size:13px;">No records yet. Complete the game to enter the ranking!</div>';
            return;
        }
        let html = '';
        ranking.forEach((entry, i) => {
            const isSelf = entry.name === (this.playerName || 'ANONYMOUS') && entry.date === ranking[i].date;
            const diffLabel = entry.difficulty ? entry.difficulty.toUpperCase() : '';
            html += `<div class="rank-entry${isSelf ? ' rank-self' : ''}">
                <span class="rank-pos">#${i + 1}</span>
                <span class="rank-name">${this._escapeHtml(entry.name)}</span>
                <span class="rank-score">${'\u2B50'.repeat(Math.min(5, Math.floor(entry.stars / 22)))} ${entry.stars}\u2605 ${entry.steps} steps L${entry.levels} ${diffLabel}</span>
            </div>`;
        });
        container.innerHTML = html;
    }

    _escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    togglePause() {
        if (this.state === 'PLAYING') { this.state = 'PAUSED'; document.getElementById('pauseScreen').classList.remove('hidden'); }
        else if (this.state === 'PAUSED') { this.state = 'PLAYING'; document.getElementById('pauseScreen').classList.add('hidden'); }
    }

    showHint(msg) {
        const detailDiv = document.getElementById('levelDetails');
        const hint = document.createElement('div');
        hint.className = 'hint-pop';
        hint.textContent = msg;
        detailDiv.appendChild(hint);
        setTimeout(() => hint.remove(), 2500);
    }

    // --- Core Jump Logic ---
    jump(dx, dy, dz) {
        if (this.state !== 'PLAYING') return;
        const level = this.currentLevel;
        if (level.dimension === DIM_1D) { dy = 0; dz = 0; }
        if (level.dimension === DIM_2D) { dz = 0; }
        this.pulse = 1.0;

        // Base step from slider
        let baseStep = (this.power / 100) * 20;

        // Apply scheduler
        if (level.scheduler === SCH_DECAY) baseStep *= Math.pow(0.995, this.steps);
        if (level.scheduler === SCH_WARMUP) {
            if (this.steps < 10) baseStep *= (this.steps + 1) / 10;
        }
        if (level.scheduler === SCH_COSINE) {
            const cosinePeriod = 500;
            baseStep *= 0.5 * (1 + Math.cos(Math.PI * Math.min(this.steps, cosinePeriod) / cosinePeriod));
        }

        this.effectiveStep = baseStep;

        // Compute gradient for adaptive methods
        const h0 = this.generator.getHeight(this.terrain, this.pos.x, this.pos.y, this.pos.z);
        const gDelta = 5;
        const gx = dx !== 0 ? (this.generator.getHeight(this.terrain, this.pos.x + gDelta * dx, this.pos.y, this.pos.z) - h0) : 0;
        const gy = dy !== 0 ? (this.generator.getHeight(this.terrain, this.pos.x, this.pos.y + gDelta * dy, this.pos.z) - h0) : 0;
        const gz = dz !== 0 ? (this.generator.getHeight(this.terrain, this.pos.x, this.pos.y, this.pos.z + gDelta * dz) - h0) : 0;

        let moveX = 0, moveY = 0, moveZ = 0;

        if (level.optimizer === OPT_SGD) {
            moveX = dx * baseStep;
            moveY = dy * baseStep;
            moveZ = dz * baseStep;
        } else if (level.optimizer === OPT_MOM) {
            // Direction reversal penalty
            if (dx !== 0 && Math.sign(dx) !== Math.sign(this.velocity.x)) this.velocity.x *= 0.5;
            if (dy !== 0 && Math.sign(dy) !== Math.sign(this.velocity.y)) this.velocity.y *= 0.5;
            if (dz !== 0 && Math.sign(dz) !== Math.sign(this.velocity.z)) this.velocity.z *= 0.5;
            this.velocity.x = this.velocity.x * 0.85 + dx * baseStep * 0.5;
            this.velocity.y = this.velocity.y * 0.85 + dy * baseStep * 0.5;
            this.velocity.z = this.velocity.z * 0.85 + dz * baseStep * 0.5;
            moveX = this.velocity.x; moveY = this.velocity.y; moveZ = this.velocity.z;
        } else if (level.optimizer === OPT_RMSPROP) {
            // RMSprop: adapt step per axis based on squared gradient
            const rmsDecay = 0.9, rmsEps = 0.01;
            this.gradSqAvg.x = rmsDecay * this.gradSqAvg.x + (1 - rmsDecay) * gx * gx;
            this.gradSqAvg.y = rmsDecay * this.gradSqAvg.y + (1 - rmsDecay) * gy * gy;
            this.gradSqAvg.z = rmsDecay * this.gradSqAvg.z + (1 - rmsDecay) * gz * gz;
            moveX = dx * baseStep / (Math.sqrt(this.gradSqAvg.x) + rmsEps);
            moveY = dy * baseStep / (Math.sqrt(this.gradSqAvg.y) + rmsEps);
            moveZ = dz * baseStep / (Math.sqrt(this.gradSqAvg.z) + rmsEps);
        } else if (level.optimizer === OPT_ADAM) {
            const beta1 = 0.9, beta2 = 0.999, adamEps = 0.01;
            const t = this.steps + 1;
            // First moment: accumulates gradient direction (player input acts as gradient sign)
            this.gradAvg.x = beta1 * this.gradAvg.x + (1 - beta1) * gx;
            this.gradAvg.y = beta1 * this.gradAvg.y + (1 - beta1) * gy;
            this.gradAvg.z = beta1 * this.gradAvg.z + (1 - beta1) * gz;
            // Second moment: accumulates gradient magnitude
            this.gradSqAvg.x = beta2 * this.gradSqAvg.x + (1 - beta2) * gx * gx;
            this.gradSqAvg.y = beta2 * this.gradSqAvg.y + (1 - beta2) * gy * gy;
            this.gradSqAvg.z = beta2 * this.gradSqAvg.z + (1 - beta2) * gz * gz;
            // Bias correction
            const bc1 = 1 - Math.pow(beta1, t), bc2 = 1 - Math.pow(beta2, t);
            const mHatX = this.gradAvg.x / bc1, mHatY = this.gradAvg.y / bc1, mHatZ = this.gradAvg.z / bc1;
            const vHatX = this.gradSqAvg.x / bc2, vHatY = this.gradSqAvg.y / bc2, vHatZ = this.gradSqAvg.z / bc2;
            // Adam update: player direction * lr * adaptive_scale
            // The player's dx/dy/dz chooses direction, Adam adjusts magnitude per-axis
            const adamScaleX = 1 / (Math.sqrt(vHatX) + adamEps);
            const adamScaleY = 1 / (Math.sqrt(vHatY) + adamEps);
            const adamScaleZ = 1 / (Math.sqrt(vHatZ) + adamEps);
            // Momentum from first moment, but respect player's direction choice
            this.velocity.x = this.velocity.x * 0.85 + dx * baseStep * 0.5;
            this.velocity.y = this.velocity.y * 0.85 + dy * baseStep * 0.5;
            this.velocity.z = this.velocity.z * 0.85 + dz * baseStep * 0.5;
            moveX = this.velocity.x * Math.min(4, adamScaleX);
            moveY = this.velocity.y * Math.min(4, adamScaleY);
            moveZ = this.velocity.z * Math.min(4, adamScaleZ);
        }

        // Apply movement
        const newX = Math.max(0, Math.min(WORLD_SIZE, this.pos.x + moveX));
        const newY = Math.max(0, Math.min(WORLD_SIZE, this.pos.y + moveY));
        const newZ = Math.max(0, Math.min(WORLD_SIZE, this.pos.z + moveZ));

        if (this.pos.x + moveX < 0 || this.pos.x + moveX > WORLD_SIZE ||
            this.pos.y + moveY < 0 || this.pos.y + moveY > WORLD_SIZE ||
            this.pos.z + moveZ < 0 || this.pos.z + moveZ > WORLD_SIZE) {
            this.showHint("BOUNDARY REACHED");
        }

        this.pos.x = newX; this.pos.y = newY; this.pos.z = newZ;
        this.steps++;

        const h = this.generator.getHeight(this.terrain, this.pos.x, this.pos.y, this.pos.z);
        this.history.push({ x: this.pos.x, y: this.pos.y, z: this.pos.z, h: h });
        this.updateHUD();

        if (h >= this.currentLevel.dynamicTarget || h >= this.terrain.maxHeight * 0.985) this.win();
    }

    updateHUD() {
        const h = this.generator.getHeight(this.terrain, this.pos.x, this.pos.y, this.pos.z);
        document.getElementById('valSteps').textContent = this.steps;
        document.getElementById('valHeight').textContent = h.toFixed(1);
        document.getElementById('valEffStep').textContent = this.effectiveStep.toFixed(1);
        // Step size bar
        const maxStep = (this.power / 100) * 20;
        const pct = Math.min(100, (this.effectiveStep / Math.max(0.1, maxStep)) * 100);
        document.getElementById('stepBarFill').style.width = pct + '%';
        // Momentum magnitude
        const velMag = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2 + this.velocity.z ** 2);
        document.getElementById('valMomentum').textContent = velMag.toFixed(1);
    }

    win() {
        this.state = 'WIN';
        const ideal = this.currentLevel.minStepsRequired;
        const actual = this.steps;
        let stars = 0;
        if (this.difficulty === 'hard') {
            // Hard: must match optimizer within tight margins
            if (actual <= ideal * 1.05) stars = 3;
            else if (actual <= ideal * 1.15) stars = 2;
            else if (actual <= ideal * 1.5) stars = 1;
        } else {
            if (actual <= ideal * 1.3) stars = 3;
            else if (actual <= ideal * 2.5) stars = 2;
            else if (actual <= ideal * 5.0) stars = 1;
        }
        this.totalStars += stars;
        this.totalSteps += actual;
        this.winStars = stars;

        // Save progress
        const lvlNum = this.currentLevel.level;
        if (lvlNum > this.maxLevelPassed) this.maxLevelPassed = lvlNum;
        if (!this.levelStars[lvlNum] || stars > this.levelStars[lvlNum]) this.levelStars[lvlNum] = stars;
        this.saveProgress();

        // Start pre-generating next level terrain in background
        const nextNum = this.currentLevel.level + 1;
        this.preGenerateNextLevel(nextNum);

        // Compute optimizer replay path for this level
        this.computeOptimizerPath();

        // Build win content
        const starStr = stars > 0 ? '\u2B50'.repeat(stars) : 'NO STARS';
        const lvl = this.currentLevel.level;
        let html = `<h1 style="color:#4ecca3;font-size:32px;margin-bottom:12px;">PEAK REACHED!</h1>`;
        html += `<div style="font-size:28px;color:#ffcc4e;margin-bottom:10px;">${starStr}</div>`;
        html += `<div style="font-size:13px;color:#888;margin-bottom:6px;">Your Steps: ${actual} | Optimal: ${ideal}</div>`;
        html += `<div style="font-size:12px;color:#4ecca3;margin-bottom:6px;">You played with: <strong>${this.currentLevel.optimizer}</strong> + ${this.currentLevel.scheduler}</div>`;
        html += `<div style="font-size:11px;color:#666;margin-bottom:16px;">${this.currentLevel.dimension}D | Level ${lvl}</div>`;

        // Dimension breach narrative
        if (lvl === 40) {
            html += `<div style="color:#ffcc4e;font-size:15px;margin-top:10px;">DIMENSION BREACH! Breaking through to 2D...</div>`;
        } else if (lvl === 100) {
            html += `<div style="color:#ff6b9d;font-size:15px;margin-top:10px;">FINAL BARRIER CRACKING! 3D space detected...</div>`;
        } else if (lvl === 110) {
            html += `<div style="color:#ff0;font-size:15px;margin-top:10px;">DIMENSIONAL BARRIER BROKEN!</div>`;
        }

        document.getElementById('winContent').innerHTML = html;
        document.getElementById('levelDetails').innerHTML = '';

        // Update button labels — use optimizerPathName (locked at compute time)
        const btnWatch = document.getElementById('btnWatchOpt');
        const optName = this.optimizerPathName || this.currentLevel.optimizer;
        btnWatch.textContent = `WATCH ${optName} SOLVE`;
        const btnNext = document.getElementById('btnNextLevel');
        btnNext.textContent = lvl >= TOTAL_LEVELS ? 'ESCAPE THE GRID' : 'NEXT LEVEL';

        // Show win screen after short dramatic pause
        setTimeout(() => {
            if (this.state === 'WIN') {
                document.getElementById('winScreen').classList.remove('hidden');
            }
        }, 1200);
    }

    // --- Compute the optimizer auto-solve path (reuses shared simulation) ---
    computeOptimizerPath() {
        const level = this.currentLevel;
        this.optimizerPath = this._simulateOptimizer(level, this.terrain, level.spawnPos, 1500);
        this.optimizerPathName = level.optimizer;
    }

    // --- Watch optimizer solve the level step by step ---
    watchOptimizer() {
        if (!this.optimizerPath || this.optimizerPath.length === 0) return;

        // Save player state
        this.playerHistory = [...this.history];
        this.playerPos = { ...this.pos };

        // Set up replay state
        this.replayState = {
            path: this.optimizerPath,
            currentStep: 0,
            frameCount: 0,
            speed: 6, // advance 1 step every N frames (lower = faster)
            done: false
        };

        // Reset view to spawn
        const start = this.optimizerPath[0];
        this.pos = { x: start.x, y: start.y, z: start.z };
        this.history = [{ ...start }];
        this.camera = { x: start.x, y: start.y, z: start.z, h: start.h };
        this.velocity = { x: 0, y: 0, z: 0 };

        // UI
        this.state = 'REPLAY';
        document.getElementById('winScreen').classList.add('hidden');
        document.getElementById('replayBanner').classList.remove('hidden');
        document.getElementById('replayLabel').textContent = `WATCHING: ${this.optimizerPathName || this.currentLevel.optimizer}`;
        document.getElementById('replayTotal').textContent = this.optimizerPath.length - 1;
        document.getElementById('replayStep').textContent = '0';
        document.getElementById('replayHeight').textContent = `H: ${start.h.toFixed(1)}`;
    }

    // --- Skip the replay ---
    skipReplay() {
        if (this.replayState) {
            // Jump to end of replay
            this.replayState.currentStep = this.replayState.path.length - 1;
            this.replayState.done = true;
            this.finishReplay();
        }
    }

    // --- Called when replay finishes ---
    finishReplay() {
        document.getElementById('replayBanner').classList.add('hidden');

        // Restore player state
        if (this.playerHistory) {
            this.history = this.playerHistory;
            this.pos = { ...this.playerPos };
            this.playerHistory = null;
            this.playerPos = null;
        }

        // Show win screen again with replay result
        const path = this.replayState.path;
        const optSteps = path.length - 1;
        const optFinalH = path[path.length - 1].h;
        const reachedPeak = optFinalH >= this.terrain.maxHeight * 0.985;

        const content = document.getElementById('winContent');
        const starStr = this.winStars > 0 ? '\u2B50'.repeat(this.winStars) : 'NO STARS';
        let html = `<h1 style="color:#4ecca3;font-size:28px;margin-bottom:12px;">REPLAY COMPLETE</h1>`;
        html += `<div style="font-size:24px;color:#ffcc4e;margin-bottom:8px;">${starStr}</div>`;
        const replayOptName = this.optimizerPathName || this.currentLevel.optimizer;
        html += `<div style="font-size:13px;color:#888;margin-bottom:4px;">Your Steps: ${this.steps} | ${replayOptName} Auto: ${optSteps} steps</div>`;
        html += `<div style="font-size:11px;color:${reachedPeak ? '#4ecca3' : '#ff6b6b'};margin-bottom:8px;">${reachedPeak ? 'Optimizer reached the peak!' : `Optimizer got to H: ${optFinalH.toFixed(1)} (did not reach peak)`}</div>`;
        html += `<div style="font-size:11px;color:#666;">The optimizer follows the gradient automatically.<br>You chose your own path \u2014 that's the art of optimization!</div>`;
        content.innerHTML = html;

        this.state = 'WIN';
        this.replayState = null;
        document.getElementById('winScreen').classList.remove('hidden');
    }

    // --- Go to next level (uses pre-generated terrain if ready) ---
    async goToNextLevel() {
        const nextNum = this.currentLevel.level + 1;
        document.getElementById('winScreen').classList.add('hidden');

        if (nextNum > TOTAL_LEVELS) {
            this.showTronEnding();
            return;
        }

        const nextLevel = LEVELS[nextNum - 1];

        // If terrain is pre-generated, go directly
        if (nextLevel.terrain) {
            this.startLevel(nextNum);
            return;
        }

        // Still generating - show calibration with loading hints
        const detailDiv = document.getElementById('levelDetails');
        const hints = [
            "Generating terrain for next level...",
            "The optimizer is computing the landscape...",
            "Verifying the level is solvable...",
            "Placing peaks and valleys...",
        ];
        const showHint = () => {
            const hint = hints[Math.floor(Math.random() * hints.length)];
            detailDiv.innerHTML = `<div class="title-pop" style="font-size:22px;color:#4ecca3;">CALIBRATING...</div><div class="title-pop" style="font-size:14px;opacity:1;">${hint}</div>`;
        };
        showHint();
        const hintInterval = setInterval(showHint, 3000);
        document.getElementById('hud').classList.remove('hidden');
        this.state = 'LOADING';

        // Wait for pre-generation to finish
        if (this.nextLevelPromise) {
            await this.nextLevelPromise;
            this.nextLevelPromise = null;
        }

        clearInterval(hintInterval);
        this.startLevel(nextNum);
    }

    // ============================================================
    // TRON ENDING SEQUENCE
    // ============================================================
    showTronEnding() {
        this.state = 'ENDING';
        document.getElementById('hud').classList.add('hidden');
        const container = document.getElementById('tronEnding');
        container.classList.remove('hidden');
        const canvas = document.getElementById('derezCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let fragments = [];
        const cx = canvas.width / 2, cy = canvas.height / 2;
        let phase = 'orb'; // orb -> explode -> fade -> text
        let timer = 0;
        const orbDuration = 180; // 3 seconds at 60fps
        const explodeDuration = 300;

        // Derez sound
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(110, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 1.5);
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3);
            osc.connect(gain).connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 3);
        } catch (e) { /* audio not available */ }

        const animate = () => {
            timer++;
            ctx.fillStyle = 'rgba(0, 10, 30, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Tron grid background
            ctx.strokeStyle = 'rgba(78, 204, 163, 0.15)';
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 50) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            }
            for (let j = 0; j < canvas.height; j += 50) {
                ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
            }

            if (phase === 'orb') {
                const size = 60 + Math.sin(timer * 0.08) * 15;
                const glow = 0.5 + Math.sin(timer * 0.05) * 0.5;
                ctx.shadowBlur = 60 * glow;
                ctx.shadowColor = '#ff0';
                ctx.fillStyle = `rgba(255, 255, 0, ${0.6 + glow * 0.4})`;
                ctx.beginPath();
                ctx.arc(cx, cy, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Inner ring
                ctx.strokeStyle = `rgba(255, 200, 0, ${glow})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(cx, cy, size * 0.6, 0, Math.PI * 2);
                ctx.stroke();

                if (timer >= orbDuration) {
                    // Explode!
                    for (let i = 0; i < 200; i++) {
                        const angle = (i / 200) * Math.PI * 2 + Math.random() * 0.3;
                        const speed = 1.5 + Math.random() * 3.5;
                        fragments.push({
                            x: cx, y: cy,
                            vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                            size: 2 + Math.random() * 4, life: 1,
                            hue: 30 + Math.random() * 30
                        });
                    }
                    phase = 'explode';
                }
            } else if (phase === 'explode') {
                fragments.forEach(f => {
                    f.x += f.vx; f.y += f.vy;
                    f.vx *= 0.985; f.vy *= 0.985;
                    f.size *= 0.997; f.life *= 0.992;
                    ctx.shadowBlur = 20 * f.life;
                    ctx.shadowColor = `hsl(${f.hue}, 100%, 60%)`;
                    ctx.fillStyle = `hsla(${f.hue}, 100%, 60%, ${f.life})`;
                    ctx.beginPath();
                    ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
                    ctx.fill();
                });
                ctx.shadowBlur = 0;
                fragments = fragments.filter(f => f.life > 0.05 && f.size > 0.5);

                if (timer >= orbDuration + explodeDuration || fragments.length === 0) {
                    phase = 'text';
                    // Save ranking on completion
                    this.saveRanking();
                    // Show score text
                    const tronText = document.getElementById('tronText');
                    tronText.style.display = 'block';
                    const playerLabel = this.playerName || 'ANONYMOUS';
                    document.getElementById('tronScore').innerHTML = `
                        <p style="color:#ff0;font-size:16px;">JOURNEY COMPLETE</p>
                        <p style="color:#4ecca3;">${this._escapeHtml(playerLabel)}</p>
                        <p>Total Stars: ${'⭐'.repeat(Math.min(20, this.totalStars))} (${this.totalStars})</p>
                        <p>Total Steps: ${this.totalSteps}</p>
                        <p>Levels Cleared: ${this.maxLevelPassed} / ${TOTAL_LEVELS}</p>
                        <p>Difficulty: ${this.difficulty.toUpperCase()}</p>
                        <p>Dimensions Traversed: 1D \u2192 2D \u2192 3D \u2192 4D (Reality)</p>
                    `;
                    // Fade in buttons after 3 seconds
                    setTimeout(() => {
                        const btns = document.getElementById('tronButtons');
                        btns.style.display = 'block';
                        requestAnimationFrame(() => { btns.style.opacity = '1'; });
                    }, 3000);
                }
            } else {
                // Slow background animation continues
                if (Math.random() < 0.02) {
                    fragments.push({
                        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
                        size: 1 + Math.random() * 2, life: 0.5, hue: 40 + Math.random() * 20
                    });
                }
                fragments.forEach(f => {
                    f.x += f.vx; f.y += f.vy; f.life *= 0.99;
                    ctx.fillStyle = `hsla(${f.hue}, 100%, 60%, ${f.life * 0.3})`;
                    ctx.beginPath(); ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2); ctx.fill();
                });
                fragments = fragments.filter(f => f.life > 0.05);
            }

            requestAnimationFrame(animate);
        };
        animate();
    }

    // ============================================================
    // ANIMATION LOOP
    // ============================================================
    animate() {
        this.update();
        this.draw();
        this.drawMinimap();
        const dim3Active = this.currentLevel && this.currentLevel.dimension === DIM_3D;
        if (dim3Active && (this.state === 'PLAYING' || this.state === 'REPLAY')) {
            this.drawSlices();
        }
        requestAnimationFrame(() => this.animate());
    }

    update() {
        if (this.state === 'PLAYING' || this.state === 'REPLAY') {
            this.camera.x += (this.pos.x - this.camera.x) * 0.1;
            this.camera.y += (this.pos.y - this.camera.y) * 0.1;
            this.camera.z += (this.pos.z - this.camera.z) * 0.1;
            const hCur = this.generator.getHeight(this.terrain, this.pos.x, this.pos.y, this.pos.z);
            this.camera.h += (hCur - this.camera.h) * 0.1;
        }
        if (this.pulse > 0) this.pulse -= 0.04;

        // Replay stepping
        if (this.state === 'REPLAY' && this.replayState && !this.replayState.done) {
            this.replayState.frameCount++;
            if (this.replayState.frameCount % this.replayState.speed === 0) {
                this.replayState.currentStep++;
                if (this.replayState.currentStep < this.replayState.path.length) {
                    const p = this.replayState.path[this.replayState.currentStep];
                    this.pos = { x: p.x, y: p.y, z: p.z };
                    this.history.push({ ...p });
                    this.pulse = 0.3;
                    // Update replay HUD
                    document.getElementById('replayStep').textContent = this.replayState.currentStep;
                    document.getElementById('replayHeight').textContent = `H: ${p.h.toFixed(1)}`;
                    document.getElementById('valHeight').textContent = p.h.toFixed(1);
                    document.getElementById('valSteps').textContent = this.replayState.currentStep;
                } else {
                    this.replayState.done = true;
                    setTimeout(() => this.finishReplay(), 1000);
                }
            }
        }
    }

    // ============================================================
    // MAIN DRAW
    // ============================================================
    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width, h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);
        if (this.state === 'MENU' || this.state === 'ENDING') return;

        // Loading state: calibration scan lines
        if (this.state === 'LOADING' || !this.terrain) {
            const t = Date.now() * 0.002;
            ctx.strokeStyle = 'rgba(78, 204, 163, 0.15)';
            ctx.lineWidth = 1;
            for (let y = 0; y < h; y += 4) {
                const offset = Math.sin(y * 0.02 + t) * 20;
                const alpha = 0.05 + Math.sin(y * 0.01 + t * 1.5) * 0.05;
                ctx.strokeStyle = `rgba(78, 204, 163, ${alpha})`;
                ctx.beginPath(); ctx.moveTo(offset, y); ctx.lineTo(w + offset, y); ctx.stroke();
            }
            // Vertical scan line sweeping
            const scanX = ((t * 80) % (w + 100)) - 50;
            const grad = ctx.createLinearGradient(scanX - 30, 0, scanX + 30, 0);
            grad.addColorStop(0, 'rgba(78, 204, 163, 0)');
            grad.addColorStop(0.5, 'rgba(78, 204, 163, 0.15)');
            grad.addColorStop(1, 'rgba(78, 204, 163, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(scanX - 30, 0, 60, h);
            return;
        }

        const level = this.currentLevel;
        const hCur = this.generator.getHeight(this.terrain, this.pos.x, this.pos.y, this.pos.z);
        const viewW = 1500;
        const zoom = w / viewW;

        const toX = (px) => w / 2 + (px - this.camera.x) * zoom;
        const toY_1D = (px, ph) => h / 2 - (ph - this.camera.h) * 3.5 * zoom;
        const toY_2D = (py) => h / 2 - (py - this.camera.y) * zoom;

        // --- Grid ---
        ctx.strokeStyle = 'rgba(78, 204, 163, 0.1)';
        ctx.lineWidth = 1;
        const gStep = 100, gRange = 800;
        const gMinX = Math.floor((this.camera.x - gRange) / gStep) * gStep;
        const gMaxX = Math.ceil((this.camera.x + gRange) / gStep) * gStep;
        const gMinY = Math.floor((this.camera.y - gRange) / gStep) * gStep;
        const gMaxY = Math.ceil((this.camera.y + gRange) / gStep) * gStep;

        // Determine if terrain should be visible based on difficulty
        const showTerrain = this.difficulty === 'dummy' ||
            (this.difficulty === 'normal' && level.dimension === DIM_3D) || // Normal: show heatmap in 3D only
            this.state === 'REPLAY'; // Always show during optimizer replay

        if (level.dimension === DIM_1D) {
            if (showTerrain) {
                // Draw terrain profile
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(78, 204, 163, 0.25)';
                ctx.lineWidth = 2;
                for (let px = this.camera.x - gRange; px <= this.camera.x + gRange; px += 4) {
                    const th = this.generator.getHeight(this.terrain, px, this.pos.y, this.pos.z);
                    const sx = toX(px), sy = toY_1D(px, th);
                    if (px === this.camera.x - gRange) ctx.moveTo(sx, sy);
                    else ctx.lineTo(sx, sy);
                }
                ctx.stroke();
            }

            // Target zone line (always show - gives player a goal)
            ctx.strokeStyle = 'rgba(255, 204, 78, 0.4)';
            ctx.setLineDash([4, 4]);
            const targetScreenY = toY_1D(this.pos.x, this.currentLevel.dynamicTarget);
            ctx.beginPath(); ctx.moveTo(0, targetScreenY); ctx.lineTo(w, targetScreenY); ctx.stroke();
            ctx.setLineDash([]);

            // Baseline
            ctx.strokeStyle = 'rgba(78, 204, 163, 0.08)';
            ctx.beginPath();
            ctx.moveTo(toX(gMinX), toY_1D(gMinX, this.camera.h));
            ctx.lineTo(toX(gMaxX), toY_1D(gMaxX, this.camera.h));
            ctx.stroke();
        } else if (level.dimension === DIM_2D) {
            if (showTerrain) {
                // 2D heatmap background
                const cellSize = 12;
                for (let sx = 0; sx < w; sx += cellSize) {
                    for (let sy = 0; sy < h; sy += cellSize) {
                        const wx = this.camera.x + (sx - w / 2) / zoom;
                        const wy = this.camera.y - (sy - h / 2) / zoom;
                        const th = this.generator.getHeight(this.terrain, wx, wy, this.pos.z);
                        const ratio = Math.min(1, th / (this.terrain.maxHeight || 100));
                        const hue = ratio * 120;
                        ctx.fillStyle = `hsla(${hue}, 70%, ${15 + ratio * 35}%, 0.6)`;
                        ctx.fillRect(sx, sy, cellSize, cellSize);
                    }
                }
            }
            // Grid overlay
            for (let i = gMinX; i <= gMaxX; i += gStep) {
                ctx.beginPath(); ctx.strokeStyle = 'rgba(78,204,163,0.08)';
                ctx.moveTo(toX(i), toY_2D(gMinY)); ctx.lineTo(toX(i), toY_2D(gMaxY)); ctx.stroke();
            }
            for (let j = gMinY; j <= gMaxY; j += gStep) {
                ctx.beginPath();
                ctx.moveTo(toX(gMinX), toY_2D(j)); ctx.lineTo(toX(gMaxX), toY_2D(j)); ctx.stroke();
            }
        } else {
            // 3D: Draw active slice as heatmap on main canvas
            // Show heatmap for dummy and normal; hide for hard
            const show3DHeatmap = this.difficulty !== 'hard' || this.state === 'REPLAY';
            if (show3DHeatmap) {
                const cellSize = 14;
                // Determine which plane to render based on activeSlice
                const sliceMap = {
                    'XY': { ax1: 'x', ax2: 'y', fixed: 'z' },
                    'XZ': { ax1: 'x', ax2: 'z', fixed: 'y' },
                    'YZ': { ax1: 'y', ax2: 'z', fixed: 'x' }
                };
                const sm = sliceMap[this.activeSlice];
                const camA1 = this.camera[sm.ax1];
                const camA2 = this.camera[sm.ax2];
                const fixedVal = this.pos[sm.fixed];
                for (let sx = 0; sx < w; sx += cellSize) {
                    for (let sy = 0; sy < h; sy += cellSize) {
                        const wa1 = camA1 + (sx - w / 2) / zoom;
                        const wa2 = camA2 - (sy - h / 2) / zoom;
                        const coords = { x: this.pos.x, y: this.pos.y, z: this.pos.z };
                        coords[sm.ax1] = wa1;
                        coords[sm.ax2] = wa2;
                        coords[sm.fixed] = fixedVal;
                        const th = this.generator.getHeight(this.terrain, coords.x, coords.y, coords.z);
                        const ratio = Math.min(1, th / (this.terrain.maxHeight || 100));
                        const hue = ratio * 120;
                        ctx.fillStyle = `hsla(${hue}, 70%, ${15 + ratio * 35}%, 0.5)`;
                        ctx.fillRect(sx, sy, cellSize, cellSize);
                    }
                }
            }
            // Label showing which slice is displayed
            ctx.fillStyle = 'rgba(255,204,78,0.6)';
            ctx.font = '11px Courier New';
            const sliceLabels = {
                'XY': `XY SLICE at Z=${Math.round(this.pos.z)}`,
                'XZ': `XZ SLICE at Y=${Math.round(this.pos.y)}`,
                'YZ': `YZ SLICE at X=${Math.round(this.pos.x)}`
            };
            ctx.fillText(sliceLabels[this.activeSlice], 12, h - 12);
        }

        // --- History trail ---
        if (this.history.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = this.state === 'REPLAY' ? 'rgba(255, 204, 78, 0.5)' : 'rgba(78, 204, 163, 0.3)';
            ctx.lineWidth = this.state === 'REPLAY' ? 2 : 1;
            this.history.forEach((p, i) => {
                const px = toX(p.x);
                const py = level.dimension === DIM_1D ? toY_1D(p.x, p.h) : toY_2D(p.y);
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            });
            ctx.stroke();
        }

        // --- History points (larger and brighter when terrain is hidden) ---
        const hiddenBoost = !showTerrain ? 1.5 : 1;
        this.history.forEach((p, i) => {
            const dist = Math.sqrt((p.x - this.camera.x) ** 2 + (p.y - this.camera.y) ** 2);
            if (dist > 1200) return;
            const hue = (p.h / (this.terrain.maxHeight || 100)) * 120;
            const px = toX(p.x);
            const py = level.dimension === DIM_1D ? toY_1D(p.x, p.h) : toY_2D(p.y);
            const r = (level.dimension === DIM_1D ? 4 : 10) * hiddenBoost;
            const alpha = (level.dimension === DIM_1D ? 0.4 : 0.5) * hiddenBoost;
            ctx.fillStyle = `hsla(${hue}, 80%, 50%, ${Math.min(1, alpha)})`;
            ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
            // Show height number on points when terrain is hidden (Normal/Hard)
            if (!showTerrain && hiddenBoost > 1 && i % 3 === 0 && dist < 600) {
                ctx.fillStyle = `hsla(${hue}, 60%, 70%, 0.7)`;
                ctx.font = '8px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText(p.h.toFixed(0), px, py - r - 2);
                ctx.textAlign = 'left';
            }
        });

        // --- Player dot ---
        const px = toX(this.pos.x);
        const py = level.dimension === DIM_1D ? toY_1D(this.pos.x, hCur) : toY_2D(this.pos.y);

        // Pulse ring
        if (this.pulse > 0) {
            ctx.strokeStyle = `rgba(78, 204, 163, ${this.pulse})`;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(px, py, 12 + (1 - this.pulse) * 60, 0, Math.PI * 2); ctx.stroke();
        }

        // Player glow (gold during replay, white during play)
        ctx.fillStyle = this.state === 'REPLAY' ? '#ffcc4e' : '#fff';
        ctx.shadowBlur = 18;
        ctx.shadowColor = this.state === 'REPLAY' ? '#ffcc4e' : '#4ecca3';
        ctx.beginPath(); ctx.arc(px, py, this.state === 'REPLAY' ? 10 : 8, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        // --- Velocity arrow (for momentum-based optimizers) ---
        if (this.currentLevel.optimizer !== OPT_SGD) {
            const velMag = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
            if (velMag > 0.5) {
                const arrowLen = Math.min(80, velMag * 8);
                let ax, ay;
                if (level.dimension === DIM_1D) {
                    ax = px + (this.velocity.x / velMag) * arrowLen;
                    ay = py;
                } else {
                    ax = px + (this.velocity.x / velMag) * arrowLen;
                    ay = py - (this.velocity.y / velMag) * arrowLen;
                }
                ctx.strokeStyle = 'rgba(255, 107, 157, 0.7)';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ax, ay); ctx.stroke();
                // Arrowhead
                const angle = Math.atan2(ay - py, ax - px);
                ctx.beginPath();
                ctx.moveTo(ax, ay);
                ctx.lineTo(ax - 8 * Math.cos(angle - 0.4), ay - 8 * Math.sin(angle - 0.4));
                ctx.moveTo(ax, ay);
                ctx.lineTo(ax - 8 * Math.cos(angle + 0.4), ay - 8 * Math.sin(angle + 0.4));
                ctx.stroke();
            }
        }

        // --- "Fog of war" label when terrain is hidden ---
        if (!showTerrain && this.state !== 'REPLAY') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.font = '14px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('TERRAIN HIDDEN \u2014 Explore to discover', w / 2, 40);
            ctx.textAlign = 'left';
        }
    }

    // ============================================================
    // HEIGHT TREND MINIMAP
    // ============================================================
    drawMinimap() {
        if (this.state === 'MENU' || !this.history.length) return;
        const ctx = this.mCtx;
        const w = this.mCanvas.width, h = this.mCanvas.height;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, w, h);

        const heights = this.history.map(p => p.h);
        const maxH = Math.max(150, ...heights, this.currentLevel.dynamicTarget);

        // Height trend line
        ctx.beginPath();
        ctx.strokeStyle = '#4ecca3';
        ctx.lineWidth = 2;
        const stepX = w / Math.max(200, this.history.length);
        this.history.forEach((p, i) => {
            const lx = i * stepX;
            const ly = h - (p.h / maxH) * h;
            if (i === 0) ctx.moveTo(lx, ly); else ctx.lineTo(lx, ly);
        });
        ctx.stroke();

        // Target line
        const targetY = h - (this.currentLevel.dynamicTarget / maxH) * h;
        ctx.strokeStyle = 'rgba(255, 204, 78, 0.5)';
        ctx.setLineDash([2, 2]);
        ctx.beginPath(); ctx.moveTo(0, targetY); ctx.lineTo(w, targetY); ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = 'rgba(255,204,78,0.6)';
        ctx.font = '8px Courier New';
        ctx.fillText('TARGET', w - 40, targetY - 3);
    }

    // ============================================================
    // 3D SLICE VIEWS
    // ============================================================
    drawSlices() {
        const slices = [
            { id: 'XY', fixedAxis: 'z', fixedVal: this.pos.z, ax1: 'x', ax2: 'y' },
            { id: 'XZ', fixedAxis: 'y', fixedVal: this.pos.y, ax1: 'x', ax2: 'z' },
            { id: 'YZ', fixedAxis: 'x', fixedVal: this.pos.x, ax1: 'y', ax2: 'z' }
        ];

        slices.forEach(slice => {
            const canvas = document.getElementById('sliceCanvas' + slice.id);
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const w = canvas.width, h = canvas.height;
            if (w === 0 || h === 0) return;
            ctx.clearRect(0, 0, w, h);

            // Update slice label
            const labelSpan = document.querySelector(`#slice${slice.id} .sz`);
            if (labelSpan) labelSpan.textContent = Math.round(slice.fixedVal);

            const range = 600;
            const cellSize = 6;
            const centerA1 = this.pos[slice.ax1];
            const centerA2 = this.pos[slice.ax2];

            // Draw heatmap (hidden in hard mode unless replaying)
            const showSliceHeatmap = this.difficulty !== 'hard' || this.state === 'REPLAY';
            if (showSliceHeatmap) {
                for (let sx = 0; sx < w; sx += cellSize) {
                    for (let sy = 0; sy < h; sy += cellSize) {
                        const a1 = centerA1 + (sx - w / 2) / w * range * 2;
                        const a2 = centerA2 - (sy - h / 2) / h * range * 2;
                        const coords = { x: this.pos.x, y: this.pos.y, z: this.pos.z };
                        coords[slice.ax1] = a1;
                        coords[slice.ax2] = a2;
                        const th = this.generator.getHeight(this.terrain, coords.x, coords.y, coords.z);
                        const ratio = Math.min(1, th / (this.terrain.maxHeight || 100));
                        const hue = ratio * 120;
                        ctx.fillStyle = `hsla(${hue}, 70%, ${12 + ratio * 40}%, 0.8)`;
                        ctx.fillRect(sx, sy, cellSize, cellSize);
                    }
                }
            } else {
                // Hard mode: dark background for slices
                ctx.fillStyle = 'rgba(0, 10, 20, 0.9)';
                ctx.fillRect(0, 0, w, h);
            }

            // Draw visited points on this slice (semi-transparent for points not on this exact slice)
            this.history.forEach(p => {
                const distFromSlice = Math.abs(p[slice.fixedAxis] - slice.fixedVal);
                if (distFromSlice > 100) return;
                const opacity = Math.max(0.1, 1 - distFromSlice / 100);
                const pa1 = (p[slice.ax1] - centerA1) / (range * 2) * w + w / 2;
                const pa2 = -(p[slice.ax2] - centerA2) / (range * 2) * h + h / 2;
                if (pa1 < 0 || pa1 > w || pa2 < 0 || pa2 > h) return;
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
                ctx.beginPath(); ctx.arc(pa1, pa2, 2, 0, Math.PI * 2); ctx.fill();
            });

            // Player position on slice
            const ppA1 = w / 2; // Player is always at center of their axes
            const ppA2 = h / 2;
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#4ecca3';
            ctx.beginPath(); ctx.arc(ppA1, ppA2, 4, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            // Highlight active slice panel
            const panel = document.getElementById('slice' + slice.id);
            panel.classList.toggle('active', slice.id === this.activeSlice);
        });
    }
}

// ============================================================
// BOOT
// ============================================================
const game = new Game();
