var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy, boy_running;
var ground, invisibleGround, groundImage,backGroundImg;

var obstaclesGroup, obstacle1 , obstacle;

var score;

var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;


function preload(){
  boy_running = loadAnimation("boy running.gif");

  backGroundImg = loadImage("backGroundImage.jpg");
  
  groundImage = loadImage("ground2.png");
  
  obstacle1 = loadImage("stoneImage.png") 
  
  restartImg = loadImage("restartImage.png");
  gameOverImg = loadImage("gameOverImage.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  boy = createSprite(50,180,20,50);
  boy.addAnimation("running", boy_running);
  boy.scale = 1.3;
  boy.setCollider("rectangle",0,0,200,250);
  boy.debug = true;

  backGround = createSprite(width/2,height/2);
  backGround.addImage(backGroundImg);
  backGround.scale = 2.3;

  
  ground = createSprite(200,height);
  ground.scale = 5;
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2+150,height/2-100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.80;
  restart.scale = 0.50;
  
  invisibleGround = createSprite(200,height+50,width,20);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
 
  score = 0;
  
}

function draw() {
  
  background(0);
  //displaying score
  
 
  ground.depth = boy.depth;
  boy.depth += 1;

  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(4+3*+score/100);
    backGround.velocityX = -(4+3*+score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    if(score%100==0 && score>0  )
       {
           checkPointSound.play();
       }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if (backGround.x <400){
      backGround.x = backGround.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& boy.y >= 140) {
        boy.velocityY = -12;
        jumpSound.play();
    }
   
    console.log(boy.y)
    
    //add gravity
    boy.velocityY = boy.velocityY + 0.8
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(boy)){
       gameState = END;
       dieSound.play();
       //boy.velocityY=-12;
       //jumpSound.play();
    }
  }
   else if (gameState === END) {
  
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      backGround.velocityX = 0;
      boy.velocityY = 0
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     
     if(mousePressedOver(restart)) {
        reset();
        }
   }

    boy.collide(invisibleGround);
  
  drawSprites();
  textSize(30);
  text("Score: "+ score, 1390,50);
}

function spawnObstacles(){
 if (frameCount % 150 === 0){
   var obstacle = createSprite(width,height-50,10,40);
   obstacle.velocityX = -(6+score/100);
   obstacle.setCollider("rectangle",50,0,50,50);
   
   //generate random obstacles
    obstacle.addImage(obstacle1);

   //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.04;
    obstacle.lifetime = 300;
    invisibleGround.depth = obstacle.depth;
    obstacle.depth += 1;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function reset() 
{
  gameState = PLAY;
  score = 0;
  boy.changeAnimation("running", boy_running);
  obstaclesGroup.destroyEach();
  gameOver.visible = false;
  restart.visible = false;
}




