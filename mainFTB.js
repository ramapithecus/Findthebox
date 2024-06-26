//define variables
var body = document.body;
body.classList.add('gridStyle');
var gridContainer = document.createElement('div');
gridContainer.classList.add('gridStyle');
body.appendChild(gridContainer);
var headContainer = document.createElement('div');
headContainer.classList.add('head');
var title = document.createElement('h1');
title.innerHTML = 'kokoti';
title.classList.add('headingClass');
headContainer.appendChild(title);
gridContainer.append(headContainer);
// arrays and global variables
var arrayMaterials = [];
var boxesIdGlobe = [];
var boxParameters = [];
var goodBoxesGlobaly = [];
var idCollector = [];
var clickedParagraphs = []
// order details
var orderContainer = document.createElement('div');
gridContainer.append(orderContainer);
var orderForm = document.createElement('form');
orderForm.setAttribute('id', 'order_Form');
orderForm.setAttribute('name', 'orderForm');
orderForm.classList.add('orderFormClass');
var selMat = document.createElement('select');
selMat.setAttribute('id', 'mats');
orderForm.appendChild(selMat);
var inpWidth = document.createElement('input');
inpWidth.setAttribute('name', 'orderWidth');
inpWidth.setAttribute('placeholder', 'width in mm');
inpWidth.setAttribute('value', '850');
inpWidth.classList.add('InpClassNumber');
orderForm.appendChild(inpWidth);
var inpHeight = document.createElement('input');
inpHeight.setAttribute('name', 'orderHeight');
inpHeight.setAttribute('placeholder', 'height in mm');
inpHeight.setAttribute('value', '630');
inpHeight.classList.add('InpClassNumber');
orderForm.appendChild(inpHeight);
var inpNumber = document.createElement('input');
inpNumber.setAttribute('name', 'orderNumber');
inpNumber.setAttribute('placeholder', 'how many pieces');
inpNumber.setAttribute('value', '1300');
inpNumber.classList.add('InpClassNumber');
orderForm.appendChild(inpNumber);
orderContainer.appendChild(orderForm);
var orderButt = document.createElement('input');
orderButt.setAttribute('type', 'submit');
orderButt.value = 'No pod to riesit';
orderButt.addEventListener('click', boxChooser);
//orderButt.addEventListener('click', boxToObject);
orderForm.appendChild(orderButt);
var orderInputs = document.querySelectorAll('.InpClassNumber');
orderInputs.forEach(function (orderInput) {
    orderInput.setAttribute('type', 'number');
    orderInput.setAttribute('min', 0);
    orderInput.setAttribute('max', 3000);
    orderInput.setAttribute('step', 1);
    orderInput.setAttribute('required', 'true');
    orderInput.style.width = '155px';
})
//box and materials lists
var centerContainer = document.createElement('div');
centerContainer.classList.add('centerFields');
gridContainer.append(centerContainer);
var matContainer = document.createElement('div');
matContainer.classList.add('matsClass');
centerContainer.appendChild(matContainer);
var matConHeader = document.createElement('div');
matConHeader.classList.add('matSpan');
matContainer.appendChild(matConHeader);
var spanName = document.createElement('span');
spanName.innerHTML = 'name';
matConHeader.append(spanName);
var spanLenght = document.createElement('span');
spanLenght.innerHTML = 'lenght';
matConHeader.append(spanLenght);
var spanHeigth = document.createElement('span');
spanHeigth.innerHTML = 'height';
matConHeader.append(spanHeigth);
var spanwidth = document.createElement('span');
spanwidth.innerHTML = 'width';
matConHeader.append(spanwidth);
/*var matContSpans = document.querySelectorAll('span');
matContSpans.forEach(function (matContSpan) {
    matContSpan.classList.add('matSpan');
//matContainer.appendChild(matContSpan);    
})*/
//functions
async function getFilterMatData() {
    const response = await fetch('FilterType.csv');
    const data = await response.text();
arrayMaterials = data.split(',');
var orderMaterialsSelect = document.querySelector('#mats');   
for(i = 0; i < arrayMaterials.length; i++ ){
    var optMat = document.createElement('option');
    optMat.setAttribute('id',arrayMaterials[i]);
    optMat.text = arrayMaterials[i];
    orderMaterialsSelect.add(optMat);
}  
}
//executing function
getFilterMatData();
 async function boxToObject(){
    const responseBox =  await fetch('boxType.csv');
    const boxData =  await responseBox.text();
var arrayBoxes = boxData.split('\n');   
//var boxParameters = [];     
var boxHeaders =['name', 'long', 'height', 'width'];       
//console.log(arrayBoxes) 
//console.log(boxParameters)         
//console.log(boxHeaders)
    for (var i = 0; i < arrayBoxes.length; i++) {
        var obj = {};
        if(arrayBoxes[i] == undefined || arrayBoxes[i].trim() == "") {
            continue;
        }
        var words = arrayBoxes[i].split(",");
        for(var j = 0; j < words.length; j++) {
            obj[boxHeaders[j].trim()] = words[j];
        }
        boxParameters.push(obj);
 var paraBoxName = document.createElement('p');
//     paraBoxName.setAttribute('id',boxParameters[i].name);
     paraBoxName.classList.add('paraBox');     
     paraBoxName.innerHTML = `${boxParameters[i].name}  -  ${boxParameters[i].long} - ${boxParameters[i].height} - ${boxParameters[i].width} `;
 matContainer.appendChild(paraBoxName);   
    }
  }
//executing function
boxToObject();
 function boxChooser(event){
event.preventDefault();
//undecorateMatches();     
var matHeight = parseFloat(inpHeight.value);
var matWidth = parseFloat(inpWidth.value);
var matPieces = parseFloat(inpNumber.value); 
var biggerSideOfMat, lesserSideOfMat;
if(matHeight >= matWidth){
    biggerSideOfMat = parseFloat(matHeight);
    lesserSideOfMat = parseFloat(matWidth); 
}  
else{
 biggerSideOfMat = parseFloat(matWidth);  
 lesserSideOfMat = parseFloat(matHeight);    
}   
var boxes = boxParameters;
var possibleBoxes = [];     
var badBoxes = [];
var goodBoxes = [];
var paraBoxes = document.querySelectorAll('.paraBox'); 
//var AllBoxesNames = [];     
//filter possible boxes, at least one side of box must be bigger than the bigger side of filter cut
for(i = 0; i < boxes.length; i++){
    if( boxes[i].width > biggerSideOfMat || 
        boxes[i].height > biggerSideOfMat  ||
        boxes[i].long > biggerSideOfMat){
 possibleBoxes.push(boxes[i]);       
    }
    else{
badBoxes.push(boxes[i]);        
    }
} 
//from possible boxes, lesser side of filter cut must be less than one of the remaining box sides       
for(i = 0; i < possibleBoxes.length; i++){
   
if(possibleBoxes[i].width > lesserSideOfMat && possibleBoxes[i].long > lesserSideOfMat || 
   possibleBoxes[i].height > lesserSideOfMat && possibleBoxes[i].width > lesserSideOfMat ||
   possibleBoxes[i].long > lesserSideOfMat && possibleBoxes[i].height > lesserSideOfMat ){
goodBoxes.push(possibleBoxes[i]);
    }
}
//console.log(goodBoxes)     
//Global variable with good boxes 
goodBoxesGlobaly = goodBoxes;
function boxFillCreation(){
var boxFillCont = document.createElement('div');
    boxFillCont.classList.add('boxFill');
    centerContainer.appendChild(boxFillCont);
    var boxFillHeader = document.createElement('h3');
        boxFillHeader.classList.add('headingClass'); 
        boxFillHeader.innerText = 'pure volumen';    
    boxFillCont.appendChild(boxFillHeader);
 }
boxFillCreation();    
// making a div with boxes that match the criteria     
var boxDiv = document.querySelector('.boxFill');
for(i = 0; i < goodBoxes.length; i++){     
var boxDivParaName = document.createElement('p');
    boxDivParaName .setAttribute('id',goodBoxes[i].name);
    boxDivParaName .setAttribute('data-box',goodBoxes[i].name);
    boxDivParaName .setAttribute('data-length',goodBoxes[i].long);
    boxDivParaName .setAttribute('data-height',goodBoxes[i].height);
    boxDivParaName .setAttribute('data-width',goodBoxes[i].width);
    boxDivParaName .setAttribute('data-clicked','false');
    boxDivParaName .classList.add('paraBoxDiv');     
    boxDivParaName .innerHTML = `${goodBoxes[i].name}  -  ${goodBoxes[i].long} - ${goodBoxes[i].height} - ${goodBoxes[i].width} `;
    boxesIdGlobe.push(boxDivParaName);
boxDiv.appendChild(boxDivParaName);  
}
//colouring boxes that matches criteria     
var matches = document.querySelectorAll('.paraBoxDiv'); 
//console.log(matches);
//console.log(boxesIdGlobe);
function decorateMatches(){
matches.forEach(function(match){
match.classList.add('matchDecor');
})  
orderButt.removeEventListener('click', boxChooser);    
}     
decorateMatches();
//boxesIdGlobe = matches;    
orderInputs.forEach(function (orderInput){
orderInput.addEventListener('input', undecorateMatches);     
})
//console.log(boxesIdGlobe); 
     //uncolouring boxes that matched the criteria
function undecorateMatches(){
var boxoFill = document.querySelector('.boxFill');
boxoFill.remove();        
orderButt.addEventListener('click', boxChooser);
matches.forEach(function(match){
match.classList.remove('matchDecor');
orderInputs.forEach(function (orderInput){
orderInput.removeEventListener('input', undecorateMatches);
})    
})      
}     
//calculations of filters fittng into boxes
function howManyBoxesHowManyPiecesIn(){
    var filtHeigth = parseFloat(inpHeight.value);
    var filtWidth = parseFloat(inpWidth.value);
    var filtDepth = 10;// in mm
    var filtVolumen = filtDepth * filtHeigth * filtWidth;
    var totalFilts = parseFloat(inpNumber.value);
    for(i = 0; i < goodBoxes.length; i ++){
            var boxWidth = goodBoxes[i].width;
            var boxLength = goodBoxes[i].long ; 
            var boxHeight = goodBoxes[i].height;
            var boxVolumen = boxHeight * boxLength * boxWidth;
            var totalFiltsInBox = Math.floor(boxVolumen / filtVolumen); 
            var totalBoxes = Math.ceil(totalFilts / totalFiltsInBox);
            var properFiltersInBox = Math.floor(totalFilts / totalBoxes);
//            console.log(properFiltersInBox);
            var filtsRemainder = totalFilts % properFiltersInBox;
//            console.log(filtsRemainder);
//        console.log(boxVolumen, filtVolumen);
//        console.log(goodBoxes[i].name, totalBoxes, totalFiltsInBox);
            var para = document.getElementById(goodBoxes[i].name);
                idCollector.push(para);
//            let currentPara = para;
    (function (currentPara){
            var spanOfVolumen = document.createElement('p');
                spanOfVolumen.innerText = `${totalBoxes} boxes, for cca ${properFiltersInBox} of ${totalFiltsInBox} max in one box`;
                currentPara.appendChild(spanOfVolumen);
            var spanOfRemainder = document.createElement('p');
                spanOfRemainder.innerText = `remainig filters : ${filtsRemainder}`;
                currentPara.appendChild(spanOfRemainder);
                currentPara.addEventListener('click',function(){
                var index = clickedParagraphs.indexOf(currentPara);
                    if ( index === -1){
                clickedParagraphs.push(currentPara);
                creatingTetris();
                    } else {
                     alert(` It's already clicked`);   
                    }
                })
        })(para);
    }}
 howManyBoxesHowManyPiecesIn(); 
}
function creatingTetris(){
//declaring variables
    var boxes = goodBoxesGlobaly;
    var ourPara = clickedParagraphs.pop();
//    console.log(ourPara);
    clickedParagraphs.push(ourPara);
//    console.log(clickedParagraphs);
    var ourParaIndex = clickedParagraphs.indexOf(ourPara);
//    console.log(ourParaIndex);
    var tetrisContainer = document.createElement('div');
    tetrisContainer.classList.add('tetrisPlaying');
    var deleteButton = document.createElement('button');
    tetrisContainer.appendChild(deleteButton);
    deleteButton.classList.add('tetrisButt');
    deleteButton.addEventListener('click',function(){
    centerContainer.removeChild(tetrisContainer);
    removeParagraphAndUpdateArray(ourPara);
    function removeParagraphAndUpdateArray(para, callback) {
    var ourParaIndex = clickedParagraphs.indexOf(para);
    if (ourParaIndex !== -1) {
        clickedParagraphs.splice(ourParaIndex, 1);
        callback()
    };
    }
    })
    // karton name as a header for div
    var tetrisContHeader = document.createElement('h3');
        tetrisContHeader.innerHTML = ourPara.dataset.box;
        tetrisContainer.appendChild(tetrisContHeader);
    
    // creating cube/ box
  var canvas = document.createElement('canvas');
      canvas.classList.add('canvaClass');
  var canvaID = `canva_${ourPara.dataset.box}`;
//      console.log(canvaID);   
      canvas.setAttribute('id',canvaID);
//      canvas.setAttribute('width','200px');   
//      canvas.setAttribute('height','200px');   
    const ctx = canvas.getContext('2d');
//    ctx.style.cursor = 'crosshair';
 // Define vertices of the cube
    const vertices = [
      { x: -2, y: -1, z: 1 },  // Vertex 0
      { x: 2, y: -1, z: 1 },   // Vertex 1
      { x: 2, y: 1, z: 1 },    // Vertex 2
      { x: -2, y: 1, z: 1 },   // Vertex 3
      { x: -2, y: -1, z: -1 }, // Vertex 4
      { x: 2, y: -1, z: -1 },  // Vertex 5
      { x: 2, y: 1, z: -1 },   // Vertex 6
      { x: -2, y: 1, z: -1 }   // Vertex 7
    ];

    // Define edges of the cube
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Front face
      [4, 5], [5, 6], [6, 7], [7, 4], // Back face
      [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
    ];

    // Projection function to convert 3D coordinates to 2D
    const projection = (vertex) => {
      const scale = 200; // Scale factor for the projection
      const distance = 5; // Distance from the viewer to the object
      const zOffset = 4; // Offset to avoid division by zero and to position the cube properly
      return {
        x: (vertex.x / (vertex.z + zOffset)) * scale + canvas.width / 2,
        y: (vertex.y / (vertex.z + zOffset)) * scale + canvas.height / 2
      };
    };

    // Function to draw the cube
    const drawCube = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2.5;

      edges.forEach(([startIndex, endIndex]) => {
        const startVertex = projection(vertices[startIndex]);
        const endVertex = projection(vertices[endIndex]);
        ctx.beginPath();
        ctx.moveTo(startVertex.x, startVertex.y);
        ctx.lineTo(endVertex.x, endVertex.y);
        ctx.stroke();
      });
    };
    drawCube();
    
    //appending elements and adding/removing event listeners
    tetrisContainer.appendChild(canvas);
//    canvas.addEventListener('',playingTetris);
    centerContainer.appendChild(tetrisContainer); 
    orderInputs.forEach(function (orderInput){
    addEventListener('input',function(){
    centerContainer.removeChild(tetrisContainer);
     
    });
    });
    var standButt = document.createElement('button');  
    standButt.innerHTML = ' na stojáka';
    var layButt = document.createElement('button');    
    layButt.innerHTML = ' na ležato';
    var kantButt = document.createElement('button'); 
    kantButt.innerHTML = ' na kánt';
    tetrisContainer.appendChild(standButt);
    tetrisContainer.appendChild(layButt);
    tetrisContainer.appendChild(kantButt);
/*function playingTetris(){
    var playGround = document.querySelector('.tetrisPlaying');
    console.log(playGround);
    var canvaModel = document.querySelector('.canvaClass');
    console.log(canvaModel);
}*/
//  playingTetris(); 
 }