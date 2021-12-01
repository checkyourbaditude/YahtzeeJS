const gameButtons = document.getElementById('diceDiv');
let rollNumber = 0;

function startGame(){

    //update the roll dice button to remove the startGame function from onclick attribute
    document.getElementById("runButton").setAttribute("onclick","rollDice()");
    document.getElementById("runButton").innerHTML = "Roll";

    //roll the dice after adding attributes to elements
    rollDice();

    return;
}


function rollDice(){
    //create array for nodes and holding dice
    let diceHandArray = [];
    let diceKeptArray = [];
    let buttonArray = [];
    let diceKeptCounter = 0;

    //loop through the gameButtons node, adding all of the selected nodes/values into the ButtonArray
    while (gameButtons.firstChild) {
        if(gameButtons.firstChild.className==='diceSelected'){
            diceHandArray.push(parseInt(gameButtons.firstChild.value));
            diceKeptArray.push(parseInt(gameButtons.firstChild.value));
            console.log("Added the value "+gameButtons.firstChild.value+" to dice array, array length is "+diceHandArray.length+".");
            console.log("Added "+gameButtons.firstChild+" to button array.")
        }
        gameButtons.removeChild(gameButtons.firstChild);
    }

    console.log("Dice Array Length:"+diceHandArray.length);
    console.log("Button Array Length:"+buttonArray.length);

    //add values to diceHandArray
    for(let i=0;i<5;i++){

        //check if a value exists in the array, generate one if nothing is there
        if(!diceHandArray[i]){
            let roll = Math.floor((Math.random()*6)+1);
            diceHandArray[i]=roll;
        }
    }

    console.log("Unsorted Dice Array:"+diceHandArray);

    //sort the array
    diceHandArray.sort();

    console.log("Sorted Dice Array:"+diceHandArray);

    //for loop which adds nodes to buttonArray
    for(let j=0;j<5;j++){
        let diceTag = document.createElement("button");
        diceTag.setAttribute("onclick", "highlightDiceTag(this.id)");
        buttonArray.push(diceTag);

        console.log("diceKeptArray"+diceKeptArray);
        console.log("dicekeptArray[j]"+diceKeptArray[diceKeptCounter]);

        //check if the value in the kept hand equals the value in the full hand, then if it is present splice the kept hand, and make that node unselected
        if(diceHandArray.includes(diceKeptArray[diceKeptCounter]) && rollNumber>0 && parseInt(diceKeptArray[diceKeptCounter]) === parseInt(diceHandArray[j])){
            //add the correct attributes to the buttonArray
            buttonArray[j].setAttribute("value",diceHandArray[j]);
            buttonArray[j].setAttribute("id","dice"+(j+1));
            buttonArray[j].setAttribute("class","diceSelected");
            buttonArray[j].innerHTML = diceHandArray[j];
            console.log(buttonArray[j]);

            //append the game button
            gameButtons.append(buttonArray[j]);

            //console.log("Splicing:"+ diceKeptArray.splice(j-1,1));
            //Update the value of the Kept Array to a zero so it is no longer counted
            diceKeptArray[diceKeptCounter] = 0;

            //append the counter for the dice kept array
            diceKeptCounter++;

            console.log("The remaining Dice in the diceKept Array:"+diceKeptArray);
            console.log("The dice Counter is at:"+diceKeptCounter);

        } else {
            //add the correct attributes to the buttonArray
            buttonArray[j].setAttribute("value",diceHandArray[j]);
            buttonArray[j].setAttribute("id","dice"+(j+1));
            buttonArray[j].setAttribute("class","diceUnselected");
            buttonArray[j].innerHTML = diceHandArray[j];
            console.log(buttonArray[j]);

            //append the game button
            gameButtons.append(buttonArray[j]);
        }
    }
    
    console.log("Roll Number:"+rollNumber);

    //Make scorecard visible
    if(rollNumber===0){
        showScoreCard();
    }

    //Begin the scoring process
    Scoring(diceHandArray);

    rollNumber++;

    return;
}

//function which creates the table scorecard
function showScoreCard(){
    console.log("Showing scorecard...");
    document.getElementById("scoreCardTable").style.visibility="visible";
}

//Scoring Function
function Scoring(diceHand){

    console.log('Entered Scoring Phase of program...');
    console.log('\nScoring Upper Section');

    //Upper Section Scoring
    scoreUpper(diceHand,1);
    scoreUpper(diceHand,2);
    scoreUpper(diceHand,3);
    scoreUpper(diceHand,4);
    scoreUpper(diceHand,5);
    scoreUpper(diceHand,6);

    console.log("\nScoring Lower Section");

    //Lower Section Scoring
    is3ofaKind(diceHand);
    is4ofaKind(diceHand);
    isFullHouse(diceHand);
    isSmallStraight(diceHand);
    isLargeStraight(diceHand);
    isYahtzee(diceHand);
    isChance(diceHand);
}

//scores the upper scorecard, then addes the value to the potential column
function scoreUpper(diceHand, number){
    let total = 0;

    for(let i=0;i<5;i++){
        if(parseInt(diceHand[i])===parseInt(number)){
            total+=number;
        }
    }

    updateElementValue(number+"upperPotential",total);
    console.log("Total for "+number+" upper section is: "+total);
}

//function for scoring 3 of a kind
function is3ofaKind(diceHand){
    console.log("Scoring 3 of a Kind...\n");
    let score = 0;
    for(let i=0;i<3;i++){
        if(parseInt(diceHand[i]) === parseInt(diceHand[i+1]) && parseInt(diceHand[i+1]) === parseInt(diceHand[i+2])){
            score = totalDice(diceHand);
            break;
        }
    }
    console.log("Three of a kind, total is: "+score);
    updateElementValue("3ofaKindPotential",score);
}

//function for scoring 4 of a kind
function is4ofaKind(diceHand){
    console.log("Scoring 4 of a Kind...\n");
    let score = 0;
    for(let i=0;i<2;i++){
        if(parseInt(diceHand[i]) === parseInt(diceHand[i+1]) && parseInt(diceHand[i+1]) === parseInt(diceHand[i+2]) && parseInt(diceHand[i+2]) === parseInt(diceHand[i+3])){
            score = totalDice(diceHand);
            break;
        }
    }

    console.log("Four of a kind, total is: "+score);
    updateElementValue("4ofaKindPotential",score);
}

//function for scoring Full House
function isFullHouse(diceHand){
    console.log("Scoring Full House");
    if((parseInt(diceHand[0]) === parseInt(diceHand[1]) && parseInt(diceHand[2]) === parseInt(diceHand[3]) && parseInt(diceHand[3]) === parseInt(diceHand[4])) || 
    (parseInt(diceHand[3]) === parseInt(diceHand[4]) && parseInt(diceHand[0]) === parseInt(diceHand[1]) && parseInt(diceHand[1]) === parseInt(diceHand[2]))){
        console.log("Full House: "+25);
        updateElementValue("fullHousePotential",25);
    }
    else {
        updateElementValue("fullHousePotential",0);
    }
}

//function for scoring Small Straight
function isSmallStraight(diceHand){
    console.log("Scoring Small Straight");

    //copy the diceHand Array
    let diceHandCopy = [...diceHand];

    //remove duplicate elements
    for(let i=0;i<5;i++){
        if(parseInt(diceHandCopy[i])===parseInt(diceHandCopy[i+1])){
            diceHandCopy.splice(i,1);
        }
    }
    if(parseInt(diceHandCopy[0]+1) === parseInt(diceHandCopy[1]) && parseInt(diceHandCopy[1]+1) === parseInt(diceHandCopy[2])&& parseInt(diceHandCopy[2]+1) === parseInt(diceHandCopy[3])){
        console.log("Small Straight: "+30);
        updateElementValue("smallStraightPotential",30);
    }
    else {
        updateElementValue("smallStraightPotential",0);
    }
}

//function for scoring Large Straight
function isLargeStraight(diceHand){
    console.log("Scoring Large Straight");
    if(parseInt(diceHand[0]+1) === parseInt(diceHand[1]) && parseInt(diceHand[1]+1) === parseInt(diceHand[2]) && parseInt(diceHand[2]+1) === parseInt(diceHand[3]) && parseInt(diceHand[3]+1) === parseInt(diceHand[4])){
        console.log("Large Straight: "+40);
        updateElementValue("largeStraightPotential",40);
    }
    else {
        updateElementValue("largeStraightPotential",0);
    }
}

//function for scoring Yahtzee
function isYahtzee(diceHand){
    console.log("Scoring Yahtzee");
    if(parseInt(diceHand[0]) === parseInt(diceHand[1]) && parseInt(diceHand[1]) === parseInt(diceHand[2]) &&  parseInt(diceHand[2]) === parseInt(diceHand[3]) && parseInt(diceHand[3]) === parseInt(diceHand[4])){
        console.log("Yahtzee!!! "+50);
        updateElementValue("yahtzeePotential",50);
    }
    else {
        updateElementValue("yahtzeePotential",0);
    }
}

//function for scoring chance
function isChance(diceHand){
    console.log("Scoring Chance");
    let score = totalDice(diceHand);
    console.log("Chance: "+score);
    updateElementValue("chancePotential",score)
}

//totals all dice, used in 3 of a kind, 4 of a kind, and chance scoring
function totalDice(diceHand){
    let diceTotal = 0;
    for(let k=0;k<5;k++){
        console.log(diceHand[k]);
        diceTotal += parseInt(diceHand[k])
        console.log(diceTotal);
    }
    return diceTotal;
}

//updates the inner HTML and value attribute
function updateElementValue(elementID,value){
    document.getElementById(elementID).innerHTML = value;
    document.getElementById(elementID).setAttribute("value",value);
}

//highlights dice if selected by updating the class
function highlightDiceTag(id){
    //get document ID
    let highlighted = document.getElementById(id).getAttribute("class");
    
    //flip the value if selected
    if(highlighted === "diceUnselected"){
        document.getElementById(id).setAttribute("class", "diceSelected");
        return;
    }
    
    if(highlighted === "diceSelected"){
        document.getElementById(id).setAttribute("class", "diceUnselected");
        return;
    }
}

//selects the score the user wants to keep
function selectScore(id){
    let highlightedClass = document.getElementById(id).getAttribute("class");
    let highlightedNodes = document.getElementsByClassName("selectedScore");

    //iterate through the selected node and remove all highlighted nodes
    for (let i=0; i<highlightedNodes.length;i++){
        highlightedNodes[i].className = "unselectedScore";
    }

    //update the value to be selected
    if(highlightedClass === "unselectedScore"){
        console.log("Potential Value:"+document.getElementById(id).getAttribute("value"));
        document.getElementById(id).setAttribute("class", "selectedScore");
        updateElementValue(id.replace("Potential",""),document.getElementById(id).getAttribute("value"));
        return;
    }

    //update the value to become unselected
    if(highlightedClass === "selectedScore"){
        document.getElementById(id).setAttribute("class", "unselectedScore");
        updateElementValue(id.replace("Potential",""),"");
        return;
    }
}

//removes all child nodes
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*

function startGame(){
    //add highlight tag to all dice buttons after click
    
    for(let i=0;i<5;i++){
        let diceTag = document.getElementById('dice'+(i+1));
        console.log(diceTag);
        diceTag.setAttribute("onclick", "highlightTag(this.id)");
    }
    

    //update the roll dice button to remove the startGame function from onclick attribute
    document.getElementById("runButton").setAttribute("onclick","rollDice()");
    document.getElementById("runButton").innerHTML = "Roll";

    //roll the dice after adding attributes to elements
    rollDice();

    return;
}

function arrangeDice() {
    //define array
    let diceHand = [];

    //create an array of values in player's hand
    for(let i=0;i<5;i++){
        diceHand.push(parseInt(document.getElementById('dice'+(i+1)).innerHTML));
    }

    //sort the hand
    diceHand.sort();

    //update each html element with sorted value
    for(let j=0;j<5;j++){
        //check to see if the element is highlighted
        let highlighted = document.getElementById('dice'+(j+1)).getAttribute("class");

        //make sure the highlighted dice are kept highlighted for less confusion
        if(highlighted === "diceSelected"){
            document.getElementById('dice'+(j+1)).setAttribute("class","diceSelected");
        }

        //update the remainder of the elements
        document.getElementById('dice'+(j+1)).innerHTML = diceHand[j];
        document.getElementById('dice'+(j+1)).setAttribute("value",diceHand[j]);

    }
}


function increaseNumber(){
    let numberTag = document.getElementById("number");
    let number = Number(document.getElementById('number').innerHTML);
    console.log(number);

    //increment the number inside the HTML
    number++;
    console.log(number);

    //update the inner HTML of the tag
    numberTag.innerHTML= number;
}

function decreaseNumber(){
    let numberTag = document.getElementById("number");
    let number = Number(document.getElementById('number').innerHTML);
    console.log(number);

    //increment the number inside the HTML
    number--;
    console.log(number);

    //update the inner HTML of the tag
    numberTag.innerHTML= number;
}

*/
