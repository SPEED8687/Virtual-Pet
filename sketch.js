var dog,sadDog,happyDog;
var database;
var foodObj;
var foodS, foodStock;
var fedTime, lastFed, feed, addFood;

function preload(){
  sadDog=loadImage("images/dogImg.png")
  happyDog=loadImage("images/dogImg1.png")
}

function setup() {
  database = firebase.database();
	createCanvas(500, 500);
 
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog=createSprite(250,300,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed = createButton("Feed the dog");
  feed.position(650,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(750,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46,139,87);

  foodObj.display();

  fedTime = database.ref('FedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })


  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Feed: " + lastFed %12 + "PM", 350,30); 
  }
  else if(lastFed == 0){
    text("Last Feed 12AM ", 350,30);
  }
  else{
    text("Last Feed: " + lastFed + "AM",350,30);
  }
  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(happyDog);
  }
  drawSprites();  

  fill("purple");
  stroke("black");
  text("food remaining: "+ foodS, 170,200);
  textSize(13);
  text("Note:press up arrow key to feed milk",130,10,300,20);
}


function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<=0){
    x=0
  }
  else{
    x=x-1
  }
  database.ref('/').update({
    Food:x
  })
}
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime : hour()
  })
}


function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}