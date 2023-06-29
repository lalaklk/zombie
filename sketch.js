var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie,zombieImg;
var heart1,heart2,heart3;
var heart1Img,heart2Img,heart3Img;
var zombieGroup;
var bullets = 100;
var gameState ="fight"
var score = 0;
var life = 3;
var lose,winning,explosion;
var bulletimg;

function preload()
{
  // imagem do personagem
  shooterImg = loadImage("assets/shooter_2.png");
  shooter_shooting = loadImage("assets/shooter_3.png");

 //imagem de fundo
  bgImg = loadImage("assets/bg.jpeg");

 //imagems da vida
  heart1Img = loadImage("assets/heart_1.png");
  heart2Img = loadImage("assets/heart_2.png");
  heart3Img = loadImage("assets/heart_3.png");

  zombieImg = loadImage("assets/zombie.png");

  lose = loadSound("assets/lose.mp3");
  winning = loadSound("assets/win.mp3");
  explosion = loadSound("assets/explosion.mp3");

  bulletimg = loadImage("assets/bullet.png");

}

function setup() 
{  
  createCanvas(windowWidth,windowHeight);

  //adicionando a imagem de fundo
  bg = createSprite(displayWidth/2 -20,displayHeight/2-40,20,20);
  bg.addImage(bgImg);
  bg.scale = 1.1;

  //criando o sprite do jogador
  player= createSprite(displayWidth-1150 ,displayHeight-300,50,50);
  player.addImage(shooterImg);
  player.scale = 0.3;

 //raio de colisao
  player.debug = true;
  player.setCollider("rectangle",0,0,300,300);

 //sprite para as vidas
 heart1 = createSprite(displayWidth-250,40,20,20);
 heart1.visible = false;
 heart1.addImage("heart1",heart1Img);
 heart1.scale = 0.4;

 heart2 = createSprite(displayWidth-200,40,20,20);
 heart2.visible = false;
 heart2.addImage("heart2",heart2Img);
 heart2.scale = 0.4;

 heart3 = createSprite(displayWidth-150,40,20,20);
 heart3.visible = false;
 heart3.addImage("heart3",heart3Img);
 heart3.scale = 0.4;

 //criando grupo de zombie
  zombieGroup = new Group();
 bulletGroup = new Group();
}

function draw() 
{
  background(0); 

  if(gameState === "fight"){

    if(life === 3){
      heart3.visible = true;
      heart1.visible = false;
      heart2.visible = false;
    }

    if(life === 2){
      heart2.visible = true;
      heart1.visible = false;
      heart3.visible = false;
    }

    if(life === 1){
      heart1.visible = true;
      heart2.visible = false;
      heart3.visible = false;
    }

    if(life === 0 ){
      gameState = "lost";

    }

    if(score === 100){
      gameState = "won";
      winning.play();

    }



     //movendo o jogador para cima e para baixo e tornando o jogo compatível com dispositivos móveis usando toques
  if(keyDown("UP_ARROW")||touches.length>0){
    player.y = player.y - 30;
  }
 if(keyDown("DOWN_ARROW")||touches.length>0){
    player.y = player.y + 30;
 }
  //solte balas e mude a imagem do atirador para a posição de tiro quando a tecla de espaço for pressionada
  if(keyWentDown("space")){
    bullet = createSprite(displayWidth - 1150, player.y - 30,20,10);
    bullet.addImage(bulletimg);
    bullet.scale = 0.03;
    bullet.velocityX = 20
    bulletGroup.add(bullet);
    player.depth = bullet.depth;
    player.depth = player.depth + 2;
    player.addImage(shooter_shooting);
    bullets = bullets -1;
    explosion.play();
  }
  else if(keyWentUp("space")){
    player.addImage(shooterImg);
  }
  if(bullets == 0){
    gameState = "bullet";
    lose.play();
  }
  if(zombieGroup.isTouching (bulletGroup)){
    for(var i = 0;i < zombieGroup.length;i ++){
      if(zombieGroup [i].isTouching(bulletGroup)){
        zombieGroup[i].destroy();
        bulletGroup.destroyEach();
        explosion.play();
        score = score + 2;
      }
    }
  }
  if(zombieGroup.isTouching(player)){
      lose.play();
     for(var i = 0;i < zombieGroup.length;i ++){
        if(zombieGroup [i].isTouching(player)){
          zombieGroup[i].destroy();
          life = life - 1;
        }
      }

  }
  

 

  //o jogador volta à imagem original quando pararmos de pressionar a barra de espaço

  enemy();
  }
  drawSprites();
  if(gameState == "lost"){
    textSize(100);
    fill("red");
    text("game over😕",400,400);
    zombieGroup.destroyEach();
    player.destroy();
  }
   else if(gameState == "won"){
    textSize(100);
    fill("green");
    text("you won😎",400,400);
    zombieGroup.destroyEach();
    player.destroy();
  }
  else if (gameState == "bullet"){
    textSize(50);
    fill("gold");
    text("you have no more bullets😕",470,410);
    zombieGroup.destroyEach();
    player.destroy();
    bulletGroup.destroyEach();
  }
  textSize(20);
  fill("white");
  text("bullets: "+bullets,displayWidth-200,displayHeight/2-250);
  text("score: "+score,displayWidth-200,displayHeight/2-220);
  text("life: "+life,displayWidth-200,displayHeight/2-280);
}
  function enemy(){ 
    //gerar um zombie a cada 50 frames
    if(frameCount%50 === 0){
      zombie = createSprite(random(500,1100),random(100,500),40,40);
      zombie.addImage(zombieImg);
      zombie.scale = 0.15;
      zombie.velocityX = -3;

      // debug do zombie
      zombie.debug = true;
      zombie.setCollider("rectangle",0,0,400,550);
      zombie.lifetime = 400;
      zombieGroup.add(zombie);
    }
  }