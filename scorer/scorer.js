let circuit = false;

//An array of arrays to represent all 25 junctions. If the value is true, the junction is owned.
let junction = [
    [false, false, false, false, false],
    [false, false, false, false, false], 
    [false, false, false, false, false], 
    [false, false, false, false, false], 
    [false, false, false, false, false]];

//Checks if both terminals have cones in them then checks if the three junctions connected to the terminal are owned.
function circuitCheck(){
    if(document.getElementById('terminal1').checked == true && document.getElementById('terminal2').checked == true){
        if(junction[0][0] == true){
            //This calls the recursive function that finds a circuit
            circuitFind(0, 0);
        }
        else if(junction[0][1] == true){
            circuitFind(0, 1);
        }
        else if(junction[1][0] == true){
            circuitFind(1, 0);
        }
    }
}

//This is the recursive function for finding a circuit
function circuitFind(row, column){
    //Sets the junction it's looking around to false so that if it runs into it again, the program won't get stuck in a loop
    junction[row][column] = false;
    //The exit condition. If the current junction is one of the ones connecting to the opposite terminal the circuit variable is set to true
    if((row == 3 && column == 4) || (row == 4 && column == 3) || (row == 4 && column == 4)){
        circuit = true;
    }
    else{
        //The two for loops will check every junction surrounding the one being looked at
        for(let i = row-1; i <= row+1; i++){
            for(let j = column-1; j <= column+1; j++){
                //Ensures that the i and j are in the scope of the array so that an error doesn't happen when this is run for junctions without 8 connections
                if(i >= 0 && i <= 4 && j >= 0 && j <= 4){
                    //This also checks if a circuit has already been found so as not to waste too much memory
                    if(junction[i][j] == true && circuit == false){
                        circuitFind(i, j);
                    }
                }  
            }
        }
    }
}

//Selecting all the counters plus and minus buttons, and the grid buttons so it's easier to make event listeners for them
const counters = document.querySelectorAll('.count');
const plusButtons = document.querySelectorAll('.plus');
const minusButtons = document.querySelectorAll('.minus');
const gridButtons = document.querySelectorAll('.grid-item')

//This goes through and adds an event listener for the plus and minus buttons. When clicked, the count will increase or decrease by one
for (let i = 0; i < plusButtons.length; i++) {
let count = 0;
plusButtons[i].addEventListener('click', function() {
    count++;
    counters[i].textContent = count;
});

minusButtons[i].addEventListener('click', function() {
    if (count > 0) {
    count--;
    counters[i].textContent = count;
    }
});
}

//This adds event listeners for all the grid buttons
for(let i = 0; i < gridButtons.length; i++){
    gridButtons[i].addEventListener('click', function() {
        //To make each junction correspond with a value in the junction array, the row is i/5 rounded down and the column is the remainder of i/5
        let row = Math.floor(i / 5);
        let column = i % 5;
        //If the junction is not owned and it is clicked, the button on the grid will turn red and the junction value will become true
        if(junction[row][column] == false){
            junction[row][column] = true;
            gridButtons[i].style.backgroundColor = 'red';
        }
        //If the junction is owned the value will become false and the button will go back to being white
        else{
            junction[row][column] = false;
            gridButtons[i].style.backgroundColor = 'white';
        }
    })
}

//This big function is called when the score match button is pressed
document.getElementById("submit").addEventListener('click', function() {
    //The score is initialized to 0
    let score = 0;
    /*
    The number of cones on each junction is taken from the counter boxes. 
    Since The counter boxes are text they need to be called in the parseInt function to be converted to a number.
    Since the autonomous cones are counted twice, that value is doubled.
    */ 
    let highCones = parseInt(document.getElementById('autoHigh').textContent) * 2 + parseInt(document.getElementById('dcHigh').textContent);
    let midCones = parseInt(document.getElementById('autoMid').textContent) * 2 + parseInt(document.getElementById('dcMid').textContent);
    let lowCones = parseInt(document.getElementById('autoLow').textContent) * 2 + parseInt(document.getElementById('dcLow').textContent);
    let groundCones = parseInt(document.getElementById('autoGround').textContent) * 2 + parseInt(document.getElementById('dcGround').textContent);
    let termCones = parseInt(document.getElementById('autoTerm').textContent) * 2 + parseInt(document.getElementById('dcTerm').textContent);
    //This adds up the scores from all the cones
    score += highCones * 5 + midCones * 4 + lowCones * 3 + groundCones * 2 + termCones;
    //These next three statements check if the autonomous park, driver controlled park, and beacon boxes are checked, and adds the number of points for each
    if(document.getElementById('autoPark').checked == true){score += 20};
    if(document.getElementById('dcPark').checked == true){score += 2};
    if(document.getElementById('beacon').checked == true){score += 7};
    //This goes through every junction in the junction array. If it is controlled it adds 3 points to the score
    for(let i = 0; i < junction.length; i++){
        for(let j = 0; j < junction[i].length; j++){
            if(junction[i][j] == true){
                score += 3;
            }
        }
    }
    //This checks for a circuit. This must happen after the ownership points are calculated as the function turns many of the values false
    circuitCheck();
    if(circuit == true){score += 20};
    //Add the total score into the h2 tag at the top of the page
    document.getElementById('score').innerHTML = "Score: " + score;
})