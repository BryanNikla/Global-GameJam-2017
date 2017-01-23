//turns off default browser actions for specific buttons that can cause problems while playing
window.addEventListener("keydown", function(e) {
    if([9, 32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);


//set music volume
backgroundAudio=document.getElementById("music");
backgroundAudio.volume=0.25;

//ART
drawing = new Image();
drawing.src = "titleArt.png";
health = new Image();
health.src = "Health.png";
gun = new Image();
gun.src = "Scatter.png";
shield = new Image();
shield.src = "Sheild.png";

//AUDIO
var hitAudio = new Audio("sound1.wav");
var burstAudio = new Audio("burst.wav");
var shot10 = new Audio("shot10.wav"); // weakest shot
var shot20 = new Audio("shot20.wav");
var shot30 = new Audio("shot30.wav");
var shot40 = new Audio("shot40.wav"); // full charge shot



var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

//gameState
var gameState = "title";


//win variable
var player1wins = 0;
var player2wins = 0;


function drawTitle() {
    ctx.save();
    ctx.font = "30px Arial";
    ctx.fillText("Hello World",10,50);
    ctx.restore();
}

function drawWins() {
    ctx.save();
    ctx.font = "50px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.fillText(player1wins,5, 45);
    ctx.restore();
    ctx.save();
    ctx.font = "50px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.fillText(player2wins, canvas.width - 33, 45);
    ctx.restore();
}

function drawGunCharges() {
    ctx.save();
    ctx.font = "20px Arial";
    ctx.fillStyle = '#aa2ca1';
    ctx.fillText(player1gun,5, canvas.height-10);
    ctx.restore();
    ctx.save();
    ctx.font = "20px Arial";
    ctx.fillStyle = '#aa2ca1';
    ctx.fillText(player2gun, (canvas.width -15), canvas.height-10);
    ctx.restore();
}

function resetGame(){
    waves = [];
    bursts = [];
    blueBursts = [];
    redBursts = [];
    powerups = [];
    x1 = canvas.width/4;
    y1 = canvas.height/2;
    dx1 = 0;
    dy1 = 0;
    player1radius = 40; //size of player 1
    upPressed1 = false;
    downPressed1 = false;
    leftPressed1 = false;
    rightPressed1 = false;
    player1moveSpeedVertical = 0;
    player1moveSpeedHorizontal = 0;
    player1charge = 0;
    player1shield = false;
    player1gun = 0;
    x2 = canvas.width * 0.75;
    y2 = canvas.height/2;
    dx2 = 0;
    dy2 = 0;
    player2radius = 40; //size of player 2
    upPressed2 = false;
    downPressed2 = false;
    leftPressed2 = false;
    rightPressed2 = false;
    player2moveSpeedVertical = 0;
    player2moveSpeedHorizontal = 0;
    player2charge = 0;
    player2shield = false;
    player2gun = 0;
}

//Game arrays
var waves = [];
var bursts = [];
var blueBursts = [];
var redBursts = [];
var powerups = [];

//// PLAYER 1 VARIABLES/////////////
var x1 = canvas.width/4;
var y1 = canvas.height/2;
var dx1 = 0;
var dy1 = 0;
var player1radius = 40; //size of player 1
var upPressed1 = false;
var downPressed1 = false;
var leftPressed1 = false;
var rightPressed1 = false;
var player1moveSpeedVertical = 0;
var player1moveSpeedHorizontal = 0;
var player1charge = 0;
var player1shield = false;
var player1gun = 0;
////////////////////////////////////

//// PLAYER 2 VARIABLES ////////////
var x2 = canvas.width * 0.75;
var y2 = canvas.height/2;
var dx2 = 0;
var dy2 = 0;
var player2radius = 40; //size of player 2
var upPressed2 = false;
var downPressed2 = false;
var leftPressed2 = false;
var rightPressed2 = false;
var player2moveSpeedVertical = 0;
var player2moveSpeedHorizontal = 0;
var player2charge = 0;
var player2shield = false;
var player2gun = 0;
////////////////////////////////////

/**
 * Draws the Line separating each half of the playing area
 */
function drawMiddleLine() {
    ctx.beginPath();
    ctx.moveTo(canvas.width/2,0);
    ctx.lineTo(canvas.width/2,canvas.height);
    ctx.strokeStyle = '#fdff00';
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#F8FF6B";
    ctx.stroke();
    ctx.restore();
}

function drawBorder() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fdff00';
    ctx.save();
    ctx.shadowBlur = 50;
    ctx.shadowColor = "#F8FF6B";
    ctx.stroke();
    ctx.restore();
}

/**
 * Draws player 1 to the canvas
 */
function drawPlayer1() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x1, y1, player1radius, 0, Math.PI*2);
    ctx.fillStyle = "#9495DD";
    ctx.fill();
    ctx.closePath();
    ctx.strokeStyle = '#4a4b72';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();
    if (player1shield) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x1, y1, (player1radius+1), 0, Math.PI*2);
        ctx.strokeStyle = '#3fff1e';
        ctx.lineWidth = 2;
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}

/**
 * Draws player 2 to the canvas
 */
function drawPlayer2() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x2, y2, player2radius, 0, Math.PI*2);
    ctx.fillStyle = "#dd504a";
    ctx.fill();
    ctx.closePath();
    ctx.strokeStyle = '#722826';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();
    if (player2shield) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x2, y2, (player2radius+1), 0, Math.PI*2);
        ctx.strokeStyle = '#3fff1e';
        ctx.lineWidth = 2;
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}


function drawPlayer1Charge() {
    ctx.beginPath();
    ctx.arc(x1, y1, player1radius*( ((player1charge*100)/40)/100 ), 0, Math.PI*2);
    ctx.fillStyle = "#03ddc1";
    ctx.fill();
}

function drawPowerups() {
    for (pu = 0; pu < powerups.length; pu++) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(powerups[pu].x, powerups[pu].y, 20, 0, Math.PI*2);
        if (powerups[pu].type == "shield") {
            ctx.fillStyle = "#6fdd6c";
            ctx.save();
            ctx.drawImage(shield,powerups[pu].x,powerups[pu].y);
            ctx.restore();
        }
        if (powerups[pu].type == "gun") {
            ctx.fillStyle = "#dc9add";
            ctx.save();
            ctx.drawImage(gun,powerups[pu].x,powerups[pu].y);
            ctx.restore();
        }
        if (powerups[pu].type == "health") {
            ctx.fillStyle = "#ddd32c";
            ctx.save();
            ctx.drawImage(health,powerups[pu].x,powerups[pu].y);
            ctx.restore();
        }
        //ctx.fill();
        ctx.closePath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        //ctx.stroke();
        ctx.restore();
    }
}


function drawBursts() {
    while(bursts.length > 10) {
        bursts.splice(0, 1); //remove the burst from the array
    }
    for (b = 0; b < bursts.length; b++) {
        if (bursts[b].r > 1000) {
            bursts.splice(b, 1); //remove the burst from the array
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(bursts[b].x, bursts[b].y, bursts[b].r, 0, Math.PI*2);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        bursts[b].r = bursts[b].r + bursts[b].intensity;
        ctx.restore();
    }
}


function drawBlueBursts() {
    for (bb = 0; bb < blueBursts.length; bb++) {
        if (blueBursts[bb].r > 1000) {
            blueBursts.splice(bb, 1); //remove the burst from the array
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(blueBursts[bb].x, blueBursts[bb].y, blueBursts[bb].r, 0, Math.PI*2);
        ctx.strokeStyle = '#1f269e';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        blueBursts[bb].r = blueBursts[bb].r + blueBursts[bb].intensity;
        ctx.restore();
    }
}

function drawRedBursts() {
    for (rb = 0; rb < redBursts.length; rb++) {
        if (redBursts[rb].r > 1000) {
            redBursts.splice(rb, 1); //remove the burst from the array
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(redBursts[rb].x, redBursts[rb].y, redBursts[rb].r, 0, Math.PI*2);
        ctx.strokeStyle = '#a10c05';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        redBursts[rb].r = redBursts[rb].r + redBursts[rb].intensity;
        ctx.restore();
    }
}




function drawPlayer2Charge() {
    ctx.beginPath();
    ctx.arc(x2, y2, player2radius*( ((player2charge*100)/40)/100 ), 0, Math.PI*2);
    ctx.fillStyle = "#dd325d";
    ctx.fill();
}

/**
 * Pass in two circles with x, y, and radius values.
 * Determine if the two circles are colliding and return true if they are.
 */
function circlesColliding(c1,c2){
    var dx=c2.x-c1.x;
    var dy=c2.y-c1.y;
    var rSum=c1.r+c2.r;
    return(dx*dx+dy*dy<=rSum*rSum);
}

/**
 * Starts by looping through each wave in the wave array.
 * sets variables for each player and the current wave.
 * Determines if the wave has hit either play, and if it finds that it has collided with
 * a player, remove that wave from the array and damage the player (lower their radius.)
 * If it finds no players have been hit, then iterate through the waves again and check
 * if the current wave is colliding with any OTHER waves.
 * If it determines that the wave has collided with another wave, AND that it is not
 * checking against iself, remove both waves from the waves array.
 */
function playerCollisionDetection() {
    for (pd = 0; pd < powerups.length; pd++) {
        var player1p = { x:x1, y:y1, r:player1radius };
        var player2p = { x:x2, y:y2, r:player2radius };
        var powerup = { x:powerups[pd].x, y:powerups[pd].y, r:20 };
        if(circlesColliding(player1p, powerup)){
            console.log("PLAYER 1 POWERUP!");
            hitAudio.play(); //plays sound effect on pickup
            if (powerups[pd].type == "shield") {
                player1shield = true;
                powerups.splice(pd, 1); //remove the powerup from the array
                console.log("player 1 got a shield!");
            }
            if (powerups[pd].type == "health") {
                player1radius = 40;
                powerups.splice(pd, 1); //remove the powerup from the array
                console.log("player 1 got more health!");
            }
            if (powerups[pd].type == "gun") {
                player1gun += 5;
                powerups.splice(pd, 1); //remove the powerup from the array
                console.log("player 1 got a gun!");
            }
        }
        if(circlesColliding(player2p, powerup)){
            console.log("PLAYER 2 POWERUP!");
            hitAudio.play(); //plays sound effect on pickup
            if (powerups[pd].type == "shield") {
                player2shield = true;
                powerups.splice(pd, 1); //remove the powerup from the array
                console.log("player 2 got a shield!");
            }
            if (powerups[pd].type == "health") {
                player2radius = 40;
                powerups.splice(pd, 1); //remove the powerup from the array
                console.log("player 2 got more health!");
            }
            if (powerups[pd].type == "gun") {
                player2gun += 5;
                powerups.splice(pd, 1); //remove the powerup from the array
                console.log("player 2 got a gun!");
            }
        }
    }

    for (c = 0; c < waves.length; c++) {
        var player1= { x:x1, y:y1, r:player1radius };
        var player2= { x:x2, y:y2, r:player2radius };
        var wave = { x:waves[c].x, y:waves[c].y, r:waves[c].power };
        if(circlesColliding(player1, wave) && waves[c].player == 2){
            console.log("PLAYER 1 HIT!!  Wave's Power: " + waves[c].power);
            hitAudio.play(); //plays sound effect on hit
            if (player1shield) {
                player1shield = false;
            } else {
                if (waves[c].power <5) {
                    player1radius -= 0.5;
                }
                if (waves[c].power <10) {
                    player1radius -= 1;
                }
                if (waves[c].power <15) {
                    player1radius -= 1.5;
                }
                if (waves[c].power <20) {
                    player1radius -= 3;
                }
                if (waves[c].power <21) {
                    player1radius -= 5;
                }
                //create a Blue BURST and push it into the Blue burst array
                var blueIntensity = 3;
                blueBursts.push({
                    x: waves[c].x,
                    y: waves[c].y,
                    intensity: blueIntensity,
                    r: 1
                });
            }
            waves.splice(c, 1); //remove the wave from the array
        }
        if(circlesColliding(player2, wave) && waves[c].player == 1){
            console.log("PLAYER 2 HIT!!  Wave's Power: " + waves[c].power);
            hitAudio.play(); //plays sound effect on hit
            if (player2shield) {
                player2shield = false;
            } else {
                if (waves[c].power <5) {
                    player2radius -= 0.5;
                }
                if (waves[c].power <10) {
                    player2radius -= 1;
                }
                if (waves[c].power <15) {
                    player2radius -= 1.5;
                }
                if (waves[c].power <20) {
                    player2radius -= 3;
                }
                if (waves[c].power <21) {
                    player2radius -= 5;
                }
                //create a red BURST and push it into the red burst array
                var redIntensity = 3;
                redBursts.push({
                    x: waves[c].x,
                    y: waves[c].y,
                    intensity: redIntensity,
                    r: 1
                });
            }
            waves.splice(c, 1); //remove the wave from the array
        }
        //CHECK TO SEE IF WAVE COLLIDED WITH ANOTHER WAVE
        for (k = 0; k < waves.length; k++) {
            var otherWave = { x:waves[k].x, y:waves[k].y, r:waves[k].power };
            if(circlesColliding(wave, otherWave)){
                if (waves[c].player == waves[k].player) {
                    //DO NOTHING
                } else {
                    if(waves[c] == waves[k]){
                        //DO NOTHING
                    } else {
                        //detected 2 waves collided. remove both waves from the waves array.
                        //determine intensity
                        var intensity = 0;
                        combinedPower = waves[c].power + waves[k].power;
                        if (combinedPower < 41) {
                            intensity = 5;
                        }
                        if (combinedPower < 40) {
                            intensity = 4;
                        }
                        if (combinedPower < 30) {
                            intensity = 3;
                        }
                        if (combinedPower < 20) {
                            intensity = 2;
                        }
                        if (combinedPower < 10) {
                            intensity = 1;
                        }
                        burstAudio.play(); //plays sound effect on hit
                        //create a BURST and push it into the burst array
                        bursts.push({
                            x: waves[c].x,
                            y: waves[c].y,
                            intensity: intensity,
                            r: 1
                        });
                        var wavesToRemove = [c, k];
                        wavesToRemove.sort();
                        for (var i = wavesToRemove.length - 1; i >= 0; i--){
                            waves.splice(wavesToRemove[i], 1);
                        }
                    }
                }
            }
        }
    }
}



/**
 * Clears the canvas then redraws the game state
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clears canvas for a complete redraw
    if (gameState == "title") {
        ctx.save();
        ctx.drawImage(drawing,0,0);
        ctx.restore();
        ctx.save();
        ctx.font = "bold 60px Arial";
        ctx.fillStyle = "#ff0e11";
        ctx.fillText("Press ENTER to play!", 20, canvas.height-50);
        ctx.restore();

    } else {
        drawWins();
        drawGunCharges();
        //Determine if there was a gameState and display a game over screen
        if (gameState == "Player 1" || gameState == "Player 2") {
            ctx.save();
            ctx.drawImage(drawing,0,0);
            ctx.restore();
            ctx.save();
            ctx.save();
            ctx.font = "bold 68px Arial";
            ctx.fillStyle = "#ff1a0f";
            ctx.fillText(gameState + " Wins!", 20, canvas.height-100);
            ctx.restore();
            ctx.save();
            ctx.font = "bold 30px Arial";
            ctx.fillStyle = "#ff7bc1";
            ctx.fillText("Press ENTER to play again", 20, canvas.height-50);
            ctx.restore();
        } else {
            if (player1radius < 5) {
                gameState = "Player 2";
                player2wins += 1;
                waves = [];
            }
            if (player2radius < 5) {
                gameState = "Player 1";
                player1wins += 1;
                waves = [];
            }
            drawBursts();
            drawBlueBursts();
            drawRedBursts();
            drawMiddleLine();
            drawBorder();
            drawPlayer1();
            drawPlayer2();
            drawPlayer1Charge();
            drawPlayer2Charge();
            playerCollisionDetection();
            drawPowerups();
            x1 += dx1;
            y1 += dy1;
            x2 += dx2;
            y2 += dy2;

            //player 1 collisions
            if(x1 + dx1 > canvas.width/2 - player1radius || x1 + dx1 < player1radius) {
                dx1 = -dx1;
            }
            if(y1 + dy1 > canvas.height - player1radius || y1 + dy1 < player1radius) {
                dy1 = -dy1;
            }

            //player 2 collisions
            if(x2 + dx2 < canvas.width/2 + player2radius || x2 + dx2 > canvas.width - player2radius) {
                dx2 = -dx2;
            }
            if(y2 + dy2 > canvas.height - player2radius || y2 + dy2 < player2radius) {
                dy2 = -dy2;
            }

            //DRAW THE WAVES
            while(waves.length > 50) {
                waves.splice(0, 1); //remove the burst from the array
            }
            for (w = 0; w < waves.length; w++) {
                ctx.beginPath();
                ctx.arc(waves[w].x, waves[w].y, waves[w].power, 0, Math.PI*2);

                if (waves[w].player == 1) {
                    ctx.fillStyle = "#1A19DD";
                    ctx.save();
                    ctx.shadowBlur = 40;
                    ctx.shadowColor = "blue";
                } else {
                    ctx.fillStyle = "#dd100f";
                    ctx.save();
                    ctx.shadowBlur = 40;
                    ctx.shadowColor = "red";
                }
                ctx.fill();
                ctx.closePath();
                ctx.restore();

                waves[w].x = waves[w].x + waves[w].dx;
                waves[w].y = waves[w].y + waves[w].dy;
                ///////// wave collisions  with walls //////////////
                if(waves[w].x + waves[w].dx > canvas.width- waves[w].power || waves[w].x + waves[w].dx < waves[w].power) {
                    waves[w].dx = -waves[w].dx; //reverse the dx
                    if (waves[w].power < 3) {
                        waves.splice(w, 1); //remove the wave from the array
                    } else {
                        waves[w].power = waves[w].power - 3;
                        if (waves[w].player == 1) {
                            waves[w].player = 2;
                        } else {
                            waves[w].player = 1;
                        }
                    }
                }
                if(waves[w].y + waves[w].dy > canvas.height- waves[w].power || waves[w].y + waves[w].dy < waves[w].power) {
                    waves[w].dy = -waves[w].dy; //reverse the dy
                    if (waves[w].power < 3) {
                        waves.splice(w, 1); //remove the wave from the array
                    } else {
                        waves[w].power = waves[w].power - 3;
                        if (waves[w].player == 1) {
                            waves[w].player = 2;
                        } else {
                            waves[w].player = 1;
                        }
                    }
                }
                ////////////////end of wave collisions with walls /////////
            }

            //Sets player 1 charge up or down.
            if(upPressed1) {
                if (player1charge < 40) {
                    player1charge += 1;
                }
            }
            else if(downPressed1) {
                if (player1charge < 40) {
                    player1charge += 1;
                }
            }
            //Moves Player 1 LEFT or RIGHT
            if(leftPressed1) {
                if (player1charge < 40) {
                    player1charge += 1;
                }
            }
            else if(rightPressed1) {
                if (player1charge < 40) {
                    player1charge += 1;
                }
            }

            //Moves Player 2 UP or DOWN
            if(upPressed2) {
                if (player2charge < 40) {
                    player2charge += 1;
                }
            }
            else if(downPressed2) {
                if (player2charge < 40) {
                    player2charge += 1;
                }
            }
            //Moves Player 2 LEFT or RIGHT
            if(leftPressed2) {
                if (player2charge < 40) {
                    player2charge += 1;
                }
            }
            else if(rightPressed2) {
                if (player2charge < 40) {
                    player2charge += 1;
                }
            }
        }
    }
}

//even listeners for key inputs
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//Key press listener
function keyDownHandler(e) {
    // key => ENTER  --- Restart Game
    if(e.keyCode == 13) {
        gameState = "null";
        resetGame();
    }
    // key => W  --- PLAYER 1
    if(e.keyCode == 87) {
        upPressed1 = true;
    }
    // key => S  --- PLAYER 1
    else if(e.keyCode == 83) {
        downPressed1 = true;
    }
    // key => A  --- PLAYER 1
    else if(e.keyCode == 65) {
        leftPressed1 = true;
    }
    // key => D  --- PLAYER 1
    else if(e.keyCode == 68) {
        rightPressed1 = true;
    }
    // key => Up Arrow  --- PLAYER 2
    if(e.keyCode == 38) {
        upPressed2 = true;
    }
    // key => Down Arrow  --- PLAYER 2
    else if(e.keyCode == 40) {
        downPressed2 = true;
    }
    // key => Left Arrow  --- PLAYER 2
    else if(e.keyCode == 37) {
        leftPressed2 = true;
    }
    // key => Right Arrow  --- PLAYER 2
    else if(e.keyCode == 39) {
        rightPressed2 = true;
    }
}

//Key release listener
function keyUpHandler(e) {
    // key => W  --- PLAYER 1
    if(e.keyCode == 87) {
        upPressed1 = false;
        player1moveSpeedVertical = player1charge / 5;
        if (dy1 < 0) {
            dy1 = 0;
            dy1 = dy1 + player1moveSpeedVertical;
        } else {
            dy1 = dy1 + player1moveSpeedVertical;
        }
        //Sound Effects
        if ( player1charge < 10 ){ shot10.play(); }
        if ( player1charge < 20 ){ shot20.play(); }
        if ( player1charge < 30 ){ shot30.play(); }
        if ( player1charge < 41 ){ shot40.play(); }
        //create a wave and push it into the waves array
        waves.push({
            x: x1,
            y: y1 - (player1radius*1.2) - player1charge,
            dx: 0,
            dy: -(player1charge/5),
            player: 1,
            power: player1charge / 2
        });
        //scatter shots (correct)
        console.log("gun:" + player1gun);
        if (player1gun > 0) {
            console.log("found bullets!");
            waves.push({
                x: x1 - (player1radius*1.4) - player1charge,
                y: y1 - (player1radius*1.4) - player1charge,
                dx: -(player1charge/5),
                dy: -(player1charge/5),
                player: 1,
                power: 7
            });
            waves.push({
                x: x1 + (player1radius*1.4) - player1charge,
                y: y1 - (player1radius*1.4) - player1charge,
                dx: (player1charge/5),
                dy: -(player1charge/5),
                player: 1,
                power: 7
            });
            player1gun -= 1;
        }
        player1radius -= 2;
        player1charge = 0;
    }
    // key => S  --- PLAYER 1
    else if(e.keyCode == 83) {
        downPressed1 = false;
        player1moveSpeedVertical = player1charge / 5;
        if (dy1 > 0) {
            dy1 = 0;
            dy1 = dy1 - player1moveSpeedVertical;
        } else {
            dy1 = dy1 - player1moveSpeedVertical;
        }
        //Sound Effects
        if ( player1charge < 10 ){ shot10.play(); }
        if ( player1charge < 20 ){ shot20.play(); }
        if ( player1charge < 30 ){ shot30.play(); }
        if ( player1charge < 41 ){ shot40.play(); }
        //create a wave and push it into the waves array
        waves.push({
            x: x1,
            y: y1 + (player1radius*1.2) + player1charge,
            dx: 0,
            dy: (player1charge/5),
            player: 1,
            power: player1charge / 2
        });
        //scatter shots (correct)
        console.log("gun:" + player1gun);
        if (player1gun > 0) {
            console.log("found bullets!");
            waves.push({
                x: x1 - (player1radius*1.4) - player1charge,
                y: y1 + (player1radius*1.4) - player1charge,
                dx: -(player1charge/5),
                dy: (player1charge/5),
                player: 1,
                power: 7
            });
            waves.push({
                x: x1 + (player1radius*1.4) - player1charge,
                y: y1 + (player1radius*1.4) - player1charge,
                dx: (player1charge/5),
                dy: (player1charge/5),
                player: 1,
                power: 7
            });
            player1gun -= 1;
        }
        player1radius -= 2;
        player1charge = 0;
    }
    // key => A  --- PLAYER 1
    else if(e.keyCode == 65) {
        leftPressed1 = false;
        player1moveSpeedHorizontal = player1charge / 10;
        if (dx1 < 0) {
            dx1 = 0;
            dx1 = dx1 + player1moveSpeedHorizontal;
        } else {
            dx1 = dx1 + player1moveSpeedHorizontal;
        }
        //Sound Effects
        if ( player1charge < 10 ){ shot10.play(); }
        if ( player1charge < 20 ){ shot20.play(); }
        if ( player1charge < 30 ){ shot30.play(); }
        if ( player1charge < 41 ){ shot40.play(); }
        //create a wave and push it into the waves array
        waves.push({
            x: x1 - (player1radius*1.2) - player1charge,
            y: y1,
            dx: -(player1charge/5),
            dy: 0,
            player: 1,
            power: player1charge / 2
        });
        //scatter shots (correct)
        console.log("gun:" + player1gun);
        if (player1gun > 0) {
            console.log("found bullets!");
            waves.push({
                x: x1 - (player1radius*1.4) - player1charge,
                y: y1 - (player1radius*1.4) - player1charge,
                dx: -(player1charge/5),
                dy: -(player1charge/5),
                player: 1,
                power: 7
            });
            waves.push({
                x: x1 - (player1radius*1.4) - player1charge,
                y: y1 + (player1radius*1.4) - player1charge,
                dx: -(player1charge/5),
                dy: (player1charge/5),
                player: 1,
                power: 7
            });
            player1gun -= 1;
        }
        player1radius -= 2;
        player1charge = 0;
    }
    // key => D  --- PLAYER 1
    else if(e.keyCode == 68) {
        rightPressed1 = false;
        player1moveSpeedHorizontal = player1charge / 10;
        if (dx1 > 0) {
            dx1 = 0;
            dx1 = dx1 - player1moveSpeedHorizontal;
        } else {
            dx1 = dx1 - player1moveSpeedHorizontal;
        }
        //Sound Effects
        if ( player1charge < 10 ){ shot10.play(); }
        if ( player1charge < 20 ){ shot20.play(); }
        if ( player1charge < 30 ){ shot30.play(); }
        if ( player1charge < 41 ){ shot40.play(); }
        //create a wave and push it into the waves array
        waves.push({
            x: x1 + (player1radius*1.2) + player1charge,
            y: y1,
            dx: (player1charge/5),
            dy: 0,
            player: 1,
            power: player1charge / 2
        });
        //scatter shots (correct)
        console.log("gun:" + player1gun);
        if (player1gun > 0) {
            console.log("found bullets!");
            waves.push({
                x: x1 + (player1radius*1.4) - player1charge,
                y: y1 + (player1radius*1.4) - player1charge,
                dx: (player1charge/5),
                dy: (player1charge/5),
                player: 1,
                power: 7
            });
            waves.push({
                x: x1 + (player1radius*1.4) - player1charge,
                y: y1 - (player1radius*1.4) - player1charge,
                dx: (player1charge/5),
                dy: -(player1charge/5),
                player: 1,
                power: 7
            });
            player1gun -= 1;
        }
        player1radius -= 2;
        player1charge = 0;
    }
    // key => Up Arrow  --- PLAYER 2
    if(e.keyCode == 38) {
        upPressed2 = false;
        player2moveSpeedVertical = player2charge / 10;
        if (dy2 < 0) {
            dy2 = 0;
            dy2 = dy2 + player2moveSpeedVertical;
        } else {
            dy2 = dy2 + player2moveSpeedVertical;
        }
        //Sound Effects
        if ( player2charge < 10 ){ shot10.play(); }
        if ( player2charge < 20 ){ shot20.play(); }
        if ( player2charge < 30 ){ shot30.play(); }
        if ( player2charge < 41 ){ shot40.play(); }
        //create a wave and push it into the waves array
        waves.push({
            x: x2,
            y: y2 - (player2radius*1.2) - player2charge,
            dx: 0,
            dy: -(player2charge/5),
            player: 2,
            power: player2charge / 2
        });
        //scatter shots (correct)
        console.log("gun:" + player2gun);
        if (player2gun > 0) {
            console.log("found bullets!");
            waves.push({
                x: x2 - (player2radius*1.4) - player2charge,
                y: y2 - (player2radius*1.4) - player2charge,
                dx: -(player2charge/5),
                dy: -(player2charge/5),
                player: 2,
                power: 7
            });
            waves.push({
                x: x2 + (player2radius*1.4) - player2charge,
                y: y2 - (player2radius*1.4) - player2charge,
                dx: (player2charge/5),
                dy: -(player2charge/5),
                player: 2,
                power: 7
            });
            player2gun -= 1;
        }
        player2radius -= 2;
        player2charge = 0;
    }
    // key => Down Arrow  --- PLAYER 2
    else if(e.keyCode == 40) {
        downPressed2 = false;
        player2moveSpeedVertical = player2charge / 10;
        if (dy2 > 0) {
            dy2 = 0;
            dy2 = dy2 - player2moveSpeedVertical;
        } else {
            dy2 = dy2 - player2moveSpeedVertical;
        }
        //Sound Effects
        if ( player2charge < 10 ){ shot10.play(); }
        if ( player2charge < 20 ){ shot20.play(); }
        if ( player2charge < 30 ){ shot30.play(); }
        if ( player2charge < 41 ){ shot40.play(); }
        //create a wave and push it into the waves array
        waves.push({
            x: x2,
            y: y2 + (player2radius*1.2) + player2charge,
            dx: 0,
            dy: (player2charge/5),
            player: 2,
            power: player2charge / 2
        });
        //scatter shots (correct)
        console.log("gun:" + player2gun);
        if (player2gun > 0) {
            console.log("found bullets!");
            waves.push({
                x: x2 - (player2radius*1.4) - player2charge,
                y: y2 + (player2radius*1.4) - player2charge,
                dx: -(player2charge/5),
                dy: (player2charge/5),
                player: 2,
                power: 7
            });
            waves.push({
                x: x2 + (player2radius*1.4) - player2charge,
                y: y2 + (player2radius*1.4) - player2charge,
                dx: (player2charge/5),
                dy: (player2charge/5),
                player: 2,
                power: 7
            });
            player2gun -= 1;
        }
        player2radius -= 2;
        player2charge = 0;
    }
    // key => Left Arrow  --- PLAYER 2
    else if(e.keyCode == 37) {
        leftPressed2 = false;
        player2moveSpeedHorizontal = player2charge / 10;
        if (dx2 < 0) {
            dx2 = 0;
            dx2 = dx2 + player2moveSpeedHorizontal;
        } else {
            dx2 = dx2 + player2moveSpeedHorizontal;
        }
        //Sound Effects
        if ( player2charge < 10 ){ shot10.play(); }
        if ( player2charge < 20 ){ shot20.play(); }
        if ( player2charge < 30 ){ shot30.play(); }
        if ( player2charge < 41 ){ shot40.play(); }
        //create a wave and push it into the waves array
        waves.push({
            x: x2 - (player2radius*1.2) - player2charge,
            y: y2,
            dx: -(player2charge/5),
            dy: 0,
            player: 2,
            power: player2charge / 2
        });
        //scatter shots (correct)
        console.log("gun:" + player2gun);
        if (player2gun > 0) {
            console.log("found bullets!");
            waves.push({
                x: x2 - (player2radius*1.4) - player2charge,
                y: y2 - (player2radius*1.4) - player2charge,
                dx: -(player2charge/5),
                dy: -(player2charge/5),
                player: 2,
                power: 7
            });
            waves.push({
                x: x2 - (player2radius*1.4) - player2charge,
                y: y2 + (player2radius*1.4) - player2charge,
                dx: -(player2charge/5),
                dy: (player2charge/5),
                player: 2,
                power: 7
            });
            player2gun -= 1;
        }
        player2radius -= 2;
        player2charge = 0;
    }
    // key => Right Arrow  --- PLAYER 2
    else if(e.keyCode == 39) {
        rightPressed2 = false;
        player2moveSpeedHorizontal = player2charge / 10;
        if (dx2 > 0) {
            dx2 = 0;
            dx2 = dx2 - player2moveSpeedHorizontal;
        } else {
            dx2 = dx2 - player2moveSpeedHorizontal;
        }
        //Sound Effects
        if ( player2charge < 10 ){ shot10.play(); }
        if ( player2charge < 20 ){ shot20.play(); }
        if ( player2charge < 30 ){ shot30.play(); }
        if ( player2charge < 41 ){ shot40.play(); }
        //create a wave and push it into the waves array
        waves.push({
            x: x2 + (player2radius*1.2) - player2charge,
            y: y2,
            dx: (player2charge/5),
            dy: 0,
            player: 2,
            power: player2charge / 2
        });
        //scatter shots (correct)
        console.log("gun:" + player2gun);
        if (player2gun > 0) {
            console.log("found bullets!");
            waves.push({
                x: x2 + (player2radius*1.4) - player2charge,
                y: y2 + (player2radius*1.4) - player2charge,
                dx: (player2charge/5),
                dy: (player2charge/5),
                player: 2,
                power: 7
            });
            waves.push({
                x: x2 + (player2radius*1.4) - player2charge,
                y: y2 - (player2radius*1.4) - player2charge,
                dx: (player2charge/5),
                dy: -(player2charge/5),
                player: 2,
                power: 7
            });
            player2gun -= 1;
        }
        player2radius -= 2;
        player2charge = 0;
    }
}

function playerGrow(){
    player1radius += 1;
    if (player1radius > 40) {player1radius = 40;}
    player2radius += 1;
    if (player2radius > 40) {player2radius = 40;}
}


function randomPowerup() {
    ////////// POWERUPS!!!!!!! ///////////////////////
    var spawn = false;
    var random = Math.random();
    var type = "null";
    if (random > 0.5) {
        spawn = true;
    }
    var typeRandom = Math.random();
    if (typeRandom < 1) {
        type = "gun";
    }
    if (typeRandom < 0.66) {
        type = "health";
    }
    if (typeRandom < 0.33) {
        type = "shield";
    }
    //spawn a power-up!
    if (spawn == true) {
        powerups.push({
            type: type,
            x: canvas.width * Math.random(),
            y: canvas.height * Math.random()
        });
    }
}

var gamePlay = setInterval(draw, 25); //call the draw() function every 1 ms
var player1grow = setInterval(playerGrow, 750);
var powerupsTimer = setInterval(randomPowerup, 2500);