const playButton = document.getElementById('play');
const playField = document.getElementById('playField');
const gameScore = document.getElementById('score');
const gameTimer = document.getElementById('timeout');

let score = 0;
let gametime = 15;
let win;
let lose;

function startGame () {
        if (win) document.body.style.backgroundImage = "url('images/win.jpg')";
        else if (lose) document.body.style.backgroundImage = "url('images/lose.jpg')";
        else document.body.style.backgroundImage = "url('images/0-start.jpg')";
        playButton.style.display = 'block';
        playField.style.display = 'none';  
}

startGame();

playButton.addEventListener('click', (event) => {
    document.body.style.backgroundImage = "url('images/fon.jpg')";
    playButton.style.display = 'none';
    playField.style.display = 'block';
    win = false;
    lose = false;
    playAngryPigs();
})

const Character = function (name, velocity, value, image, elemClass) {
    this._name = name;
    this._velocity = velocity;
    this._value = value;
    this._image = image;
    this._elemClass = elemClass;
    this._element = null;
    this._movement;
}

Character.prototype = {
    showNew: function(parent) {
        this._element = document.createElement('div');
        this._element.className = this._elemClass;
        this._element.style.backgroundImage = `url('images/${this._image}')`;
        this._element.style.position = 'absolute';
        this._element.dataset.points = this._value;
        parent.appendChild(this._element);
    },
    move: function() {
        let limit = this._element.parentElement.getBoundingClientRect();
        let elem = this._element.getBoundingClientRect();
        if (limit.left <= elem.left) this._element.style.left = 0 + 'px';
        if (limit.top <= elem.top) this._element.style.top = 0 + 'px';
        if (limit.width <= elem.left+elem.width) this._element.style.left = limit.width + 'px';
        if (limit.height <= elem.top+elem.height) this._element.style.top = limit.height + 'px';

        let x = Math.round(Math.random()*(limit.width-elem.width));
        let y = Math.round(Math.random()*(limit.height-elem.height));
        this._element.style.left = x + 'px';
        this._element.style.top = y + 'px';

        this._movement = setInterval(() => {
            x = Math.round(Math.random()*(limit.width-elem.width));
            y = Math.round(Math.random()*(limit.height-elem.height));
            this._element.style.left = x + 'px';
            this._element.style.top = y + 'px';
        }, this._velocity);
    },
    caught: function() {
        this._element.addEventListener('click', () => {
            score += +this._value;
            clearInterval(this._movement);
            this._element.className = 'poof';
            setTimeout(() => {
                this._element.remove();
            }, 1000);
            setTimeout(()=>{
                this.showNew(playField);
                this.move();
                this.caught();
            }, 1500)
        })
    },
    stop: function(time) {
        setTimeout(()=> {
            clearInterval(this._movement);
            this._element.remove(); 
        }, time)
    }
}

function playAngryPigs() {
    const characters = ['black-bird', 'red-bird', 'blue-bird', 'pig'];
    const speed = [1800, 1500, 1000, 2000];
    const points = [10, 20, 50, -100];
    const birds = ['bird_10_points.png', 'bird_20_points.png', 'bird_50_points.png', 'pig_minus_100_points.png'];

    for (let i = 0; i < 4; i++) {
        let item = new Character(characters[i], speed[i], points[i], birds[i], 'item');
        item.showNew(playField);
        item.move(); 
        item.caught();
        item.stop(gametime*1000);
    }

    let timeoutCounter = setInterval(() => {
        gametime--;
        gameScore.innerText = 'Your score: '+score;
        gameTimer.innerText = 'Time left: '+gametime;
        if (gametime == 0) {
            if (score >= 100)  win = true;
            else lose = true;
            console.log(score)
            console.log(win)
            console.log(lose)
            clearInterval(timeoutCounter);
            score=0;
            gametime = 15;
            startGame(); 
        }
    }, 1000);
}