import React from 'react';
var _= require('lodash');

export var possibleCombinationSum = function(arr, n) {
	if (arr.indexOf(n) >= 0) { return true; }
	if (arr[0] > n) { return false; }
	if (arr[arr.length - 1] > n) {
		arr.pop();
		return possibleCombinationSum(arr, n);
	}
	var listSize = arr.length, combinationsCount = (1 << listSize)
	for (var i = 1; i < combinationsCount ; i++ ) {
		var combinationSum = 0;
		for (var j=0 ; j < listSize ; j++) {
			if (i & (1 << j)) { combinationSum += arr[j]; }
		}
		if (n === combinationSum) { return true; }
	}
	return false;
};
export const Stars = (props) => {
	return (
  	<div className="col-5" >
  	  { _.range(props.numberOfStars).map(i =>
  	  	<i key = {i} className="fa fa-star"></i>
      )}
  	</div>
  );  
};

export const Button = (props) => {
	let button;
	switch (props.answerIsCorrect) {
		case true:
			button =
			<button className="btn btn-success"
			onClick={props.acceptAnswer}
			disabled={props.doneStatus}>
		<i className="fa fa-check"></i>
	  </button>;
			break;
		case false:
			button =
			<button className="btn btn-danger"
			disabled={props.doneStatus}>
<i className="fa fa-times"></i>
</button>;
			break;
		default:
			button =
			<button className="btn" 
			onClick={props.checkAnswer}
			disabled={props.selectedNumbers.length === 0||props.doneStatus}>
=
</button>;
			break;   
	}
	return (
  	<div className="col-2 text-center">
  	  {button}
      <br /><br />
      <button className="btn btn-info btn-sm" onClick={props.redraw}
	disabled={props.redraws===0||props.doneStatus}>
<i className="fas fa-sync"></i>
<strong className="space"> {props.redraws}</strong>        
</button>
</div>
  );
};

export const Answer = (props) => {
	return (
  	<div className="col-5">
  	  {props.selectedNumbers.map((number,i) =>
  	  	<span key={i} onClick={() => props.unselectNumber(number)}>{number}</span>
      )}
  	</div>
  );
};

export const Numbers = (props) => {
    const numberClassName = (number) => {
        if (props.usedNumbers.indexOf(number) >= 0) {
            return 'used';
        }
        if (props.selectedNumbers.indexOf(number) >= 0) {
            return 'selected';
        }
    };
    return (
        <div className="card text-center">
            <div>
                {Numbers.list.map((number, i) =>
                    <span key={i} className={numberClassName(number)}
                        onClick={() => props.selectNumber(number)}>
                        {number}
                    </span>
                )}
            </div>
        </div>
    );
};


export const Timer = (props) => {	
	return (
  	<div id="myTimer" className="text-center">
  		<strong>{props.seconds}</strong> seconds remaining!
 	 </div>);
};

export const DoneFrame = (props) => {	
	return(
  	<div className="text-center">
  	  <h2 className={props.doneStatus==='You Win! Awesome! :)' ?
      								"gameWin" : "gameLose"}>
                      <strong>{props.doneStatus}</strong>
      </h2>
      <button className="btn btn-secondary" onClick={props.resetGame}>
      	Play Again?
      </button>
  	</div>
  );
};

