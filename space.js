const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('scoreVal');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('startBtn');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let gameActive = false;
let player = { x: canvas.width/2, y: canvas.height/2, radius: 20 };
let enemies = [];
let collectibles = [];

// יצירת אובייקטים (יהלומים/מוקשים)
function spawnObject(type) {
    const obj = {
        x: Math.random() * canvas.width,
        y: -50,
        radius: type === 'enemy' ? 15 : 10,
        speed: Math.random() * 3 + 2,
        type: type
    };
    if (type === 'enemy') enemies.push(obj);
    else collectibles.push(obj);
}

// לולאת המשחק המרכזית
function update() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ציור השחקן (חללית ניאון)
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#00d2ff";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00d2ff";
    ctx.fill();
    ctx.closePath();

    // עדכון וציור יהלומים
    collectibles.forEach((c, index) => {
        c.y += c.speed;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#f1c40f"; // צהוב זהב
        ctx.fill();
        
        // בדיקת התנגשות (איסוף)
        let dist = Math.hypot(player.x - c.x, player.y - c.y);
        if (dist < player.radius + c.radius) {
            score += 10;
            scoreEl.innerText = score;
            collectibles.splice(index, 1);
            createFirework(c.x, c.y); // הזיקוק המטריף שלך!
        }
    });

    // עדכון וציור מוקשים
    enemies.forEach((e, index) => {
        e.y += e.speed;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#e74c3c"; // אדום סכנה
        ctx.fill();

        let dist = Math.hypot(player.x - e.x, player.y - e.y);
        if (dist < player.radius + e.radius) {
            gameOver();
        }
    });

    requestAnimationFrame(update);
}

// שליטה עם העכבר
window.addEventListener('mousemove', (e) => {
    player.x = e.clientX;
    player.y = e.clientY;
});

function gameOver() {
    gameActive = false;
    alert("GAME OVER! הניקוד שלך: " + score);
    location.reload();
}

startBtn.onclick = () => {
    startScreen.style.display = 'none';
    gameActive = true;
    setInterval(() => spawnObject('enemy'), 1000);
    setInterval(() => spawnObject('collect'), 1500);
    update();
};

// כאן תוסיף את פונקציית ה-createFirework המקורית שכתבנו!