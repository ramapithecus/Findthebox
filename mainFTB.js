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
            console.log(properFiltersInBox);
            var filtsRemainder = totalFilts % properFiltersInBox;
            console.log(filtsRemainder);
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
                playingTetris();
                    } else {
                     alert(` It's already clicked`);   
                    }
                })
        })(para);
    }}
 howManyBoxesHowManyPiecesIn(); 
}
function playingTetris(){
//declaring variables
    var boxes = goodBoxesGlobaly;
    var ourPara = clickedParagraphs.pop();
//    console.log(ourPara);
    clickedParagraphs.push(ourPara);
//    console.log(clickedParagraphs);
    var ourParaIndex = clickedParagraphs.indexOf(ourPara);
//    console.log(ourParaIndex);
    var boxModelContainer = document.createElement('div');
    boxModelContainer.classList.add('tetrisPlaying');
    var deleteButton = document.createElement('button');
    boxModelContainer.appendChild(deleteButton);
    deleteButton.classList.add('tetrisButt');
    deleteButton.addEventListener('click',function(){
    centerContainer.removeChild(boxModelContainer);
    removeParagraphAndUpdateArray(ourPara);
    function removeParagraphAndUpdateArray(para, callback) {
    var ourParaIndex = clickedParagraphs.indexOf(para);
    if (ourParaIndex !== -1) {
        clickedParagraphs.splice(ourParaIndex, 1);
        callback()
    };
    }
    })
    var header = document.createElement('h3');
        header.innerHTML = ourPara.dataset.box;
        boxModelContainer.appendChild(header);
    var sides = document.querySelectorAll('.boxSides');
//    console.log(sides);
    var leftSide = document.createElement('div');
    leftSide.classList.add('boxSides');
//    leftSide.style.height = `${ourPara.dataset.height}px`;
//    console.log(ourPara.dataset.height);
    var rightSide= document.createElement('div');
//    rightSide.classList.add('boxSides');
//    rightSide.style.height = `${ourPara.dataset.heigth}px`;
//    console.log(ourPara.dataset.height);
    var topSide = document.createElement('div');
    topSide.classList.add('boxSides');
//    topSide.style.height = ourPara.dataset.heigth;
//    console.log(ourPara.dataset.height);
    var downSide= document.createElement('div');
    downSide.classList.add('boxSides');
//    downSide.style.height = ourPara.dataset.heigth;
//    console.log(ourPara.dataset.height);
    var bottom = document.createElement('div');
    bottom.classList.add('boxSides');
    bottom.style.height = `calc(${ourPara.dataset.height}px * 0.5)`;
    bottom.style.width = `calc(${ourPara.dataset.width})px * 0.5`;
    
//    console.log(ourPara.dataset.height);
    boxModelContainer.appendChild(bottom, downSide, leftSide, rightSide,topSide);
    centerContainer.appendChild(boxModelContainer); 
    orderInputs.forEach(function (orderInput){
    addEventListener('input',function(){
    centerContainer.removeChild(boxModelContainer);
     
    });
    });
 }