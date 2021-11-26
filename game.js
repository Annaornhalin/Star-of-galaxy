const { Phaser } = require("./phaser.min");

var config = {
    type: Phaser.AUTO,
    width : 1340,
    height : 750,
    parent : 'gameContainer',
    scale: {
        mode: Phaser.scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: "arcade",
        arcade: {
        gravity:{ y: 0},
        debug: false
        }
    }
};


var game = new Phaser.Game(config);
var scene;
var player;
var keyUp, keyDown;
var keyLeft, keyRight;
var keyFire;
var bulletSpeed = 1200;
var playerBulletGrp;

var ufoGrp;
var ufoSpacing = 130;

var explosionGrp;
var UfoBulletGrp;

var playerHeart = 5;
var heartGrp;


function preload() {
    //console.log("preloading");
    scene = this;
    scene.load.image('superhero','./assets/img/superhero.png');
    scene.load.image('bone_bullet', './assets/img/bone_bullet.png');
    scene.load.image('ufo','./assets/img/ufo.png');
    scene.load.image('Explosion1','/assets/img/Explosion1.png');
    scene.load.image('Explosion2','/assets/imgExplosion2.png');
    scene.load.image('bullet','./assets/image/bullet.png');
    scene.load.image('heart','./assets/img/heart .png');

}

function create() {
    //console.log("create");
   createPlayer();

   playerBulletGrp = scene.add.group();

   ufoGrp = scene.add.group();
   bulletGrp=scene.add.group();
   createUFO();

   explosionGrp=scene.add.group();

   // game ui
   heartGrp = scene.add.group();
   createPlayerHeart();

   
   // check collisions
   scene.physics.add.overlap(ufoGrp, playerBulletGrp, onUFOHit);
   scene.physics.add.overlap(player,UfoBulletGrp, onPlayerHit);
   scene.physics.add.overlap(player,ufoGrp,onPlayerHit);


    keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    keyFire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function createPlayer() {
    player = scene.physics.add.sprite(config.width/2, config.height/2, 'corgi');
    player.speed = 400;
    player.setScale(0.3);
    player.immortal = false;

}

function createUFO() {
    for (var i = 0; i < 5; i++) {
        var ufo = scene.physics.add.sprite(1000, 100 + (i * ufoSpacing), "ufo");
        ufo.setScale(0.25);
        ufo.speed = (Math.random() * 2) + 1;
        ufo.startX = config.width + (ufo.width/2);
        ufo.startY = 100 + (i * ufoSpacing);
        ufo.x = ufo.startX;
        ufo.Y = ufo.startY;
        ufo.magnitude = Math.random() * 60;
        ufo.fireInterval=(Math.random()* 3000)+1500;
        ufo.fireTimer = scene.Time.addEvent({
            delay: ufo.fireInterval,
            args:[ufo]
            callback:ufoFire,
            repeat: -1
            
        });
        ufoGrp.add(ufo);
        

    }
}

function createPlayerHeart(){
    for (var i = 0; i < playerHeart; i++){
        var heart = scene.add.sprite(40+(i * 55)40, "heart");
        heart.depth = 10;
        heartGrp.add(heart);
    }
}


function update() {
    updatePlayer();
    updatePlayerBullets();

    updateUFO();

    updateExplosion();

    updateUfoBullets(){
        for (var i = 0;i < UfoBulletGrp)
    }
}

function updatePlayer(){
    //console
    if (keyUp.isDown) {
        player.setVelocityY(-player.speed);
    }
    else if (keyDown.isDown) {
        player.setVelocityY(player.speed);
    }
    else {
        player.setVelocityY(0);
    }

    // check for left and right keys
    if (keyLeft.isDown) {
        player.setVelocityX(-player.speed);
    }
    else if (keyRight.isDown) {
        player.setVelocityX(player.speed);
    }
    else {
        player.setVelocityX(0);
    }

    if (player.y < 0 +(player.getBounds().height/2)) {
        player.y = (player.getBounds().height/2);
    }
    else if (player.y > config.height - (player.getBounds().height/2)) {
        //console.log("hit the bottom screen");
        player.y = config.height - (player.getBounds().height/2);
    }

    if (player.x < 0 +(player.getBounds().width/2)) {
        player.x = (player.getBounds().width/2);
    }
    else if (player.x > config.width -(player.getBounds().width/2)){
        //console.log("hit the right screen");
        player.x = config.width - (player.getBounds().width/2);
    }
    // check for spacebar to fire a bullet
    if (Phaser.Input.keyboard.Justdown(keyFire)) {
        Fire();
    }
}

function updatePlayerBullets() {
    for (var i = 0; i <playerBulletGrp.getChildren().length; i++) {
        //console.log(playerBulletGrp.getChildren()[i]);
        var bullet = playerBulletGrp.getChildren()[i];
        bullet.rotation += 0.2;

        if (bullet.x > config.width) {
            bullet.destroy();
        }
    }
    //console.log("================");
}

function updateUFO() {
    for (var i = 0; i < ufoGrp.getChildren().length; i++) {
        var enemy = ufoGrp.getChildren()[i];
        enemy.x -= enemy.speed;
        enemy.y = enemy.startY + (Math.sin(game.getTime()/1000) * enemy.magnitude);

        if (enemy.x < 0 - (enemy.width/2)) {
            enemy.speed = (Math.random() * 2) + 1;
            enemy.x = enemy.startX;
            enemy.magnitude = Math.random() * 60;
        }
    }
}
function updateExplosion(){
    for(var i=explosionGrp.getChildren().length-1; i>=0; i--)
    var explosion = explosionGrp.getChildren()[i];
    explosion.rotation += 0.04;
    explosion.scale+= 0.02;
    explosion.alpha -= 0.05;

    i (explosion.alpha <= 0) {
        explosion.destroy();
    }
}
function updatePlayerBullets(){
    for (var i= 0 < UfoBulletGrp.getChildren(),'length'; i=++){
        var bullet = UfoBulletGrp.getChildren()[i];

        if (bullet.x < 0 - (bullet.width/2)){
            bullet.destroy();
        }
    }
}

function fire() {
    console.log("Fire a bullet");
    var bullet = scene.physics.add.sprite(player.x + 50, player.y + 10, "bone_bullet");
    bullet.body.velocity.x = bulletSpeed;

    playerBulletGrp.add(bullet);
    //console.log(playerBulletGrp.children);
}

function onUFOHit(ufo,bullet) {
    createExplosion(ufo,x,ufo.y)
    bullet.destroy();
    ufo.x = ufo.startX;
    ufo.speed = (Math.random() * 2) + 1;
}
function createExplosion(posX,posY){
    var Explosion1=scene.add.sprite(posX,posY,'Explosion1');
    Explosion1.setScale(0.4);
    Explosion1.rotation=Phaser.Math.Between(0,360)

    var Explosion2=scene.add.sprite(posX,posY,'Explosion2');
    Explosion2.setScale(0.2);
    Explosion2.rotation=Phaser.Math.Between(0,360);

    explosionGrp.add(Explosion1);
    explosionGrp.add(Explosion2);
}
function ufoFire(enemy){
    var bullet =scene.physics.add.sprite(enemy.x,enemy.y,'bullet');
    UfoBulletGrp.setScale(0.5);
    bullet.body.velocity.x= -bulletSpeed;

    UfoBulletGrp.add(bullet);
}
function onPlayerHit(player,obstacle){
    if(player.immortal == false){
        if(obstacle.texture.key == "ufo_bullet"){
            obstacle.destroy();
        }
        
    
    
        // decrease player's heart
        playerHeart --;
        if(playerHeart <= 0){
            playerHeart = 0;
            console.log("Game over");
        }
    
        updatePlayerHeart();

        player.immortal = true;
        player,flickerTimer = scene.time.addEvent({
            delay:100,
            callback:playerFlickering,
            repeat:15
        });
    }
    
}
function playerFlickering(){
    player.setVisible(!player.visible);

    if (player.flickerTimer.repeatCount == 0){
        player.immortal = (false);
        player.flickerTimer.remove();
    }
}

function updatePlayerHeart(){
    for (var i =heartGrp.getChildren.length-1; i >= 0; i--){
        if (playerHeart < i+1){
            heartGrp.getChildren()[i].setVisible(false);
        }
        else{
            heartGrp.getChildren()[i].setVisible(true);
        }
    }
}