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
//functions
getFilterMatData();

 async function boxToObject(){
    const responseBox =  await fetch('boxType.csv');
    const boxData =  await responseBox.text();
var arrayBoxes = boxData.split('\n');   
var boxHeaders =['name', 'long', 'height', 'width'];       
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
function decorateMatches(){
matches.forEach(function(match){
match.classList.add('matchDecor');
})  
orderButt.removeEventListener('click', boxChooser);    
}     
decorateMatches();
orderInputs.forEach(function (orderInput){
orderInput.addEventListener('input', undecorateMatches);     
})
     //uncolouring boxes that matched the criteria
function undecorateMatches(){
var boxoFill = document.querySelector('.boxFill');
boxoFill.remove(); 
var tetrisFill = document.querySelector('.tetrisContainer');    
//console.log(tetrisFill);  
if( tetrisFill !== null){
    tetrisFill.remove();
}    
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
            var filtsRemainder = totalFilts % properFiltersInBox;
            var para = document.getElementById(goodBoxes[i].name);
                idCollector.push(para);
    (function (currentPara){
            var spanOfVolumen = document.createElement('p');
                spanOfVolumen.innerText = `${totalBoxes} boxes, for cca ${properFiltersInBox} of ${totalFiltsInBox} max in one box`;
                currentPara.appendChild(spanOfVolumen);
            var spanOfRemainder = document.createElement('p');
                spanOfRemainder.innerText = `remainig filters : ${filtsRemainder}`;
                currentPara.appendChild(spanOfRemainder);
        /*for drawing cue purposes*/
                currentPara.addEventListener('click',function(){
                    matContainer.style.width = '4%';
                var boxConto = document.querySelector('.boxFill');
                    boxConto.style.width = '4%';
                })   
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
    tetrisContainer.classList.add('tetrisContainer');
   centerContainer.appendChild(tetrisContainer); 
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
var kartonContainer = document.createElement('div');
    tetrisContainer.appendChild(kartonContainer);
    kartonContainer.classList.add('kartonContainer');
var karton = document.createElement('div');
    karton.classList.add('karton');
    kartonContainer.appendChild(karton);
var frontSide = document.createElement('div');
    frontSide.innerHTML = 'front';
    frontSide.classList.add('kartonFaces','front');
    karton.appendChild(frontSide);
var backSide = document.createElement('div');
    backSide.classList.add('kartonFaces','back')
    backSide.innerHTML = 'back';
    karton.appendChild(backSide);
var leftSide = document.createElement('div');
    leftSide.classList.add('kartonFaces','left')
    leftSide.innerHTML = 'left';
    karton.appendChild(leftSide);
var rightSide = document.createElement('div');
    rightSide.classList.add('kartonFaces','right')
    rightSide.innerHTML = 'right';
    karton.appendChild(rightSide);
var topSide = document.createElement('div');
    topSide.classList.add('kartonFaces','top')
    topSide.innerHTML = 'top';
    karton.appendChild(topSide);
var bottomSide = document.createElement('div');
    bottomSide.classList.add('kartonFaces','bottom')
    bottomSide.innerHTML = 'bottom'
    karton.appendChild(bottomSide);
//karton rotating
function rotateKarton(e){
    var krabica = document.querySelectorAll('.karton');
//    console.log(krabica);
    var x = e.clientX - window.innerWidth/2;
    var y = e.clientY - window.innerHeight/2;
    var q = 0.55;//mouse sensitivity and rotating speed)
    var i;
    
    x = x * q * 1.25;
    y = -y * q * 1.25;
    
    for(i = 0; i < krabica.length; i++){
        krabica[i].style.transform = 'rotateY('+ x +'deg) rotateX('+ y +'deg)';
    }
//        console.log(`Rotate to: X = ${x} deg, Y = ${y} deg`);
    }
//function toggleMouseEvent
    var toggler = 1;
    function toggleMouseEvent(){
    if( toggler == 1){
        tetrisContainer.addEventListener('mouseover', rotateKarton);
        toggler = 0;
    }
    else{
         tetrisContainer.removeEventListener('mouseover', rotateKarton); 
         toggler = 1;
    }    
}
tetrisContainer.addEventListener('dblclick', toggleMouseEvent);
//buttons
    var standButt = document.createElement('button');  
    standButt.innerHTML = ' na stojáka';
    var layButt = document.createElement('button');    
    layButt.innerHTML = ' na ležato';
    var kantButt = document.createElement('button'); 
    kantButt.innerHTML = ' na kánt';
    tetrisContainer.appendChild(standButt);
    tetrisContainer.appendChild(layButt);
    tetrisContainer.appendChild(kantButt);
 }
//body.addEventListener('mousemove', rotateKarton);    