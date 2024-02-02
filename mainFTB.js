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
headContainer.appendChild(title);
gridContainer.append(headContainer);
// arrays and global variables
var arrayMaterials = [];
var boxParameters = [];
var goodBoxesGlobaly = [];
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
});
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
spanHeigth.innerHTML = 'heigth';
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
var idCollector = []; 
var AllBoxesNames = [];     
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
//Global variable with good boxes 
goodBoxesGlobaly = goodBoxes;
boxFillCreation();    
var boxDiv = document.querySelector('.boxFill');
for(i = 0; i < goodBoxesGlobaly.length; i++){     
var boxDivParaName = document.createElement('p');
      boxDivParaName .setAttribute('id',goodBoxesGlobaly[i].name);
      boxDivParaName .classList.add('paraBoxDiv');     
      boxDivParaName .innerHTML = `${goodBoxesGlobaly[i].name}  -  ${goodBoxesGlobaly[i].long} - ${goodBoxesGlobaly[i].height} - ${goodBoxesGlobaly[i].width} `;
boxDiv.appendChild(boxDivParaName);  
}
//colouring matches     
var matches = []; 
for(i = 0; i < goodBoxes.length; i++){
var idMatch = document.getElementById(goodBoxes[i].name)    
//console.log(idMatch);       
matches.push(idMatch); 
 }  
//console.log(matches);
//orderButt.removeEventListener('click', boxChooser);
function decorateMatches(){
matches.forEach(function(match){
match.classList.add('matchDecor');
})  
}     
decorateMatches();
orderInputs.forEach(function (orderInput){
orderInput.addEventListener('input', undecorateMatches);     
})
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
}
function boxFillCreation(){
var boxFillCont = document.createElement('div');
    boxFillCont.classList.add('boxFill');
    centerContainer.appendChild(boxFillCont);
    howManyBoxesHowManyPiecesIn();
 }
function howManyBoxesHowManyPiecesIn(){
    var boxes = [];
    boxes = goodBoxesGlobaly;
//    console.log(boxes);
//    console.log(inpHeight.value);
    var filtHeigth = parseFloat(inpHeight.value);
    var filtWidth = parseFloat(inpWidth.value);
    var filtDepth = 1;
    var FiltVolumen = filtDepth * filtHeigth * filtWidth;
    var totalFilts = parseFloat(inpNumber.value);
    for(i = 0; i < boxes.length; i ++){
            var boxWidth = boxes[i].width;
            var boxLength = boxes[i].long ; 
            var boxHeight = boxes[i].height;
            var boxVolumen = boxHeight * boxLength * boxWidth;
//console.log(boxWidth, boxLength, boxHeight);  
        var totalFiltsInBox = Math.floor(boxVolumen / FiltVolumen); 
        var totalBoxes = Math.ceil(totalFilts / totalFiltsInBox);
console.log(boxes[i].name, totalBoxes, totalFiltsInBox);
        var paraWithId = document.getElementById(boxes[i].name);
        console.log(`${paraWithId}`);
        }

//    var parasBoxes = document.querySelectorAll('.paraBoxDiv');
//    console.log(parasBoxes);
    /*for(i = 0; i < boxes.length; i++ ){
        
    }*/
}
