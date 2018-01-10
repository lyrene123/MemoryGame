/**
* The gamescript will make the memory game webpage interactive by
* setting the right events on elements of the webpage such as the images
* and the buttons for ending or playing a new game. Event handlers are set
* as well in order to handle the different actions done by the user
* on the webpage such as clicking or typing a letter/image
*
* author: Lyrene Labor - 1541901
* version: March 2017
*/



/**
* global variables declaration for objects retrived from the DOM,
* for different arrays created to keep track of url of images and other objects
* and for objects or images selected by user to keep track of actions
* done during the game
*/
var objects = {};
var arrays = {};
var clicked = {};



/**
*The loadImages function will preload all images used in the webpage
*and save in in the webpage's cache.
*/
function loadImages(){
  var imgArray = ["images/backgroundBoard/dolphin.png",
                    "images/backgroundBoard/fish.png",
                    "images/backgroundBoard/garySnail.png",
                    "images/backgroundBoard/seahorse.png",
                    "images/backgroundBoard/shark.png",
                    "images/coverBoard/A.jpg",
                    "images/coverBoard/B.jpg",
                    "images/coverBoard/C.jpg",
                    "images/coverBoard/D.jpg",
                    "images/coverBoard/E.jpg",
                    "images/coverBoard/F.jpg",
                    "images/coverBoard/G.jpg",
                    "images/coverBoard/H.jpg",
                    "images/coverBoard/I.jpg",
                    "images/coverBoard/J.jpg",
                    "images/coverBoard/K.jpg",
                    "images/coverBoard/L.jpg",
                    "images/coverBoard/M.jpg",
                    "images/coverBoard/N.jpg",
                    "images/coverBoard/O.jpg",
                    "images/coverBoard/P.jpg",
                    "images/middleBoard/bob.jpg",
                    "images/middleBoard/krabs.jpg",
                    "images/middleBoard/patrick.jpg",
                    "images/middleBoard/pearl.jpg",
                    "images/middleBoard/plankton.jpg",
                    "images/middleBoard/puff.jpg",
                    "images/middleBoard/sandy.jpg",
                    "images/middleBoard/squidward.jpg",
                    "images/backgroundPage.gif"];
  var temp = new Image();
  for(var i = 0; i<imgArray.length; i++){
    temp.src = imgArray[i];
  }
}



/**
* The shuffleArray function follows the Fisher Yates'
* method for shuffling an array randomly and changing
* it's content order.
* @param {array} objArray - an array of any type
* @return {array} objArray - an array of same type as input
*/
function shuffleArray(objArray){
  for (var i = objArray.length - 1; i > 0; i--) {
        var randomPos = Math.floor(Math.random() * (i + 1));
        var placeHolder = objArray[i];
        objArray[i] = objArray[randomPos];
        objArray[randomPos] = placeHolder;
    }
  return objArray;
}




/**
* The displayMiddlePics function will loop through the
* middle layer pictures from the DOM and display its
* corresponding source image from the middle image sources
* array from the arrays global variable
*/
function displayMiddlePics(){
  for(var i = 0; i < objects.middlePics.length; i++){
    objects.middlePics[i].src = arrays.middleSrc[i];
  }
}



/**
* The addEvent function will add or attach an event depending
* whether the user is using Internet Explorer or other browser.
* The event will be attanched/added to an object from the DOM with an
* event handler and a phase type.
*/
function addEvent(obj, type, fn){
  if(obj && obj.addEventListener){
    obj.addEventListener(type, fn, false);
  }else if(obj && obj.attachEvent){
    obj.attachEvent("on" + type, fn);
  }
}




/**
* The deleteEvent function will delete or deattach an event depending
* whether the user is using Internet Explorer or other browser.
* The event will be detached/deleted from an object from the DOM with a
* specific event handler.
*/
function deleteEvent(obj, type, fn){
  if(obj && obj.removeEventListener){
    obj.removeEventListener(type, fn);
  }else if(obj && obj.detachEvent){
    obj.detachEvent("on" + type, fn);
  }else{
    alert("please use another browser");
  }
}




/**
* The topLayerHandler function will serve as an event handler
* for a (on)click event or a (on)keypress event. This will occur
* when the user clicks on one of the letter images or types a letter
* that corresponds to the letter on the images. When an image is selected
* whether typed or clicked, that image will be set as invisible and will
* reveal the image underneath it. At the second selection, the function
* will check if the first and second selection reveal the same image underneath
* by calling the checkPairs function.
*
* @param {object} e - the object of the event that occured, that called
                      this function
*/
function topLayerHandler(e){
  //cross browser compatibility
  var evt = e || window.event;
  var target = evt.target || evt.srcElement;

  //if the event that occured was (on)keypress, do the following
  if(evt.type === "keypress" || evt.type === "onkeypress"){

    //the following code is for accepting both lower and upper case letters:
    var input = evt.which || evt.keyCode; //get the keycode value of the key pressed
    var key = String.fromCharCode(input); //convert keycode to string
    key = key.toLowerCase(); //convert character to lowercase
    input = key.charCodeAt(0); //convert character back to keycode
    input = input - 97; //get corresponding array index from the topPics array

    //if the input is between aA - pP, do the following
    if(input >= 0 && input <= 15){
      target = objects.topPics[input];
      //if the target has already been clicked, don't use it by setting undefined
      if(target===clicked.previousTarget || target.style.visibility==='hidden'){
        target = undefined;
      }
    }
  }

  //if target is still available and target is a toptile, then do the following
  if(target && target.className === "toptile"){
      //first click
      if(clicked.numClicks === 1){
        //keep track of the selected image and the number of clicks done
        clicked.chosenPics.push(target);
        target.style.visibility = 'hidden'; //hide selected image
        clicked.previousTarget = target;
        clicked.numClicks++;
      }
      //second click
      else if(clicked.numClicks === 2) {
        //keep track of the selected image and hide it
        clicked.chosenPics.push(target);
        target.style.visibility = 'hidden';
        //make other images not clickabled or pressable by deleting events
        deleteEvent(objects.topSection, "click", topLayerHandler);
        deleteEvent(window, "keypress", topLayerHandler);
        //disable buttons to not hinder the checkPairs execution
        objects.newBtn.disabled = true;
        objects.endBtn.disabled = true;
        setTimeout(checkPairs, 900); //check if selected images are the same
      }
  }
}




/**
* The checkPairs function will compare the two selected images contained
* in the clicked array from the arrays global variable. If both selected
* images reveal the same images underneath, then the images underneath
* (2nd layer) will be set to invisible and a part of the game
* board background image will be revealed. If both selected images are
* the same, then those selected images will be set to visible again.
* The function will also ensure that the events are added back, the
* selected images array, the number of clicks, etc will be set back to
* initial values by calling the reset function in order to accept two
* new selections from the user.
*/
function checkPairs(){
  //get the source of the selected images/letters
  var srcPic1 = clicked.chosenPics[0].src;
  var srcPic2 = clicked.chosenPics[1].src;

  //get the index of the source of selected images from topSrc array
  //The sources of the selected images will be trimmed(replaced) into their filename
  var indexPic1 = arrays.topSrc.indexOf(srcPic1.replace(/^.*[\\\/]/, ''));
  var indexPic2 = arrays.topSrc.indexOf(srcPic2.replace(/^.*[\\\/]/, ''));

  //get the image from the 2nd layer right underneath of the selected letters
  var srcMiddle1 = arrays.middleSrc[indexPic1];
  var srcMiddle2 = arrays.middleSrc[indexPic2];

  //check if both pictures have the same source
  if(srcMiddle1 === srcMiddle2){
    objects.middlePics[indexPic1].style.visibility = 'hidden';
    objects.middlePics[indexPic2].style.visibility = 'hidden';
  }
  else{
    clicked.chosenPics[0].style.visibility = 'visible';
    clicked.chosenPics[1].style.visibility = 'visible';
  }
  reset();
}





/**
* The reset function will reset the number of clicks done by the user to
* initial value, empty the chosen/selected images or letters, empty the
* previous target made by the user, add the events once again and enable
* the buttons end and play again once again
*/
function reset(){
  clicked.numClicks = 1;
  clicked.chosenPics = [];
  clicked.previousTarget = "";
  addEvent(objects.topSection, "click", topLayerHandler);
  addEvent(window, "keypress", topLayerHandler);
  objects.newBtn.disabled = false;
  objects.endBtn.disabled = false;
}






/**
* The buttonHandler function will serve as an event handler for the click
* event for the end and play again button of the webpage. When the end
* button is clicked, all letters and images from the 1st and 2nd layer will
* be set to invisible and the game board background image will be revealed
* and the user cannot do anything else on the board until the play again button
* is clicked. When the play again button is clicked, all images from 1st
* and 2nd layer are revealed. The images from 2nd layer will be randomize again
* and another image will be displayed on the game board background image.
* everything will be set back to their initial value as well with the help
* of the reset function
*
* @param {object} e - object of the event that occured and called this function
*/
function buttonHandler(e){
  //cross browser compatibility
  var evt = e || window.event;
  var target = evt.target || evt.srcElement;

  //if the play again button is clicked, do the following
  if(target.id === "new"){
    //make 1st and 2nd layer visible again
    for(var i = 0; i<objects.topPics.length; i++){
      objects.topPics[i].style.visibility = "visible";
    }
    for(var i = 0; i<objects.middlePics.length; i++){
      objects.middlePics[i].style.visibility = "visible";
    }
    //randomize images 2nd layer and display them again
    arrays.middleSrc = shuffleArray(arrays.middleSrc);
    displayMiddlePics();
    displayNextBottomPic(); //display a new background board pic
    reset(); //reset everything else
  }
  //if the end button is clicked, do the following
  else if(target.id === "end"){
    //make 1st and 2nd layer hidden and remove all events on the images
    for(var i = 0; i<objects.topPics.length; i++){
      objects.topPics[i].style.visibility = "hidden";
    }
    for(var i = 0; i<objects.middlePics.length; i++){
      objects.middlePics[i].style.visibility = "hidden";
    }
    deleteEvent(objects.topSection, "click", topLayerHandler);
    deleteEvent(window, "keypress", topLayerHandler);
  }
}




/**
* The displayNextBottomPic function will take care of the display of the
* different images of the game board background image. Everytime this function
* is called, the next image available will be set as the background image.
*/
function displayNextBottomPic(){
  if(objects.bottomPicIndex < (arrays.bottomSrc.length-1)){
    objects.bottomPicIndex++;
  }else{
    objects.bottomPicIndex=0;
  }
  objects.bottomPic.src = arrays.bottomSrc[objects.bottomPicIndex];
}





/**
* The init function will set the whole memory game of the webpage.
* It will take care of retriving all necesarry objects to manipulate
* from the DOM and will store them into their corresponding global
* variable fields. Arrays of image sources of the 1,2,3 layer will also be
* stored into an array and all images will be preloaded wit the help of the
* loadImages function. It will also take care of the adding the events
* to the correct objects such as the click/keypress event for the 1st
* layer images, and the click event for the buttons and will also assign
* their event handlers by calling the addEvent function. Other important
* setups such as randomizing the 2nd layer images and the array of background
* images of the board, setting the number of clicks of the user, create the array of
* selected letters/images and the previous image selected will be handled as well.
*/
function init(){

  loadImages(); //load all images on the webpage

  //get all objects needed from the DOM and store into global variables
  objects.bottomPic = document.getElementById('bottomPic');
  objects.middlePics = document.getElementsByClassName("middletile");
  objects.topPics = document.getElementsByClassName("toptile");
  objects.topSection = document.getElementById("top");
  objects.newBtn = document.getElementById("new");
  objects.endBtn = document.getElementById("end");

  //set all indexes needed
  objects.bottomPicIndex = 0;
  clicked.numClicks = 1;
  clicked.chosenPics = [];
  clicked.previousTarget = "";

  //set all arrays needed :
  //put all src of the last layer into an array and randomize the order
  arrays.bottomSrc = ["images/backgroundBoard/dolphin.png",
                    "images/backgroundBoard/fish.png",
                    "images/backgroundBoard/garySnail.png",
                    "images/backgroundBoard/seahorse.png",
                    "images/backgroundBoard/shark.png"];
  arrays.bottomSrc = shuffleArray(arrays.bottomSrc);
  //display the first image of the bottom layer
  objects.bottomPic.src = arrays.bottomSrc[objects.bottomPicIndex];

  //put all src of the middle layer into an array and randomize the order
  arrays.middleSrc = ["images/middleBoard/bob.jpg",
                         "images/middleBoard/krabs.jpg",
                          "images/middleBoard/patrick.jpg",
                          "images/middleBoard/pearl.jpg",
                          "images/middleBoard/plankton.jpg",
                          "images/middleBoard/puff.jpg",
                          "images/middleBoard/sandy.jpg",
                          "images/middleBoard/squidward.jpg",
                          "images/middleBoard/bob.jpg",
                          "images/middleBoard/krabs.jpg",
                          "images/middleBoard/patrick.jpg",
                          "images/middleBoard/pearl.jpg",
                          "images/middleBoard/plankton.jpg",
                          "images/middleBoard/puff.jpg",
                          "images/middleBoard/sandy.jpg",
                          "images/middleBoard/squidward.jpg"];
  arrays.middleSrc = shuffleArray(arrays.middleSrc);
  displayMiddlePics();

  //put all filename of the top layer images into an array
  arrays.topSrc = ["A.jpg","B.jpg","C.jpg","D.jpg","E.jpg","F.jpg",
                    "G.jpg","H.jpg","I.jpg","J.jpg","K.jpg","L.jpg",
                    "M.jpg","N.jpg","O.jpg","P.jpg"];

  //set all events
  addEvent(objects.topSection, "click", topLayerHandler);
  addEvent(window, "keypress", topLayerHandler);
  addEvent(objects.newBtn, "click", buttonHandler);
  addEvent(objects.endBtn , "click", buttonHandler);
}


window.onload = init; //don't let the browser run before the DOM is loaded
