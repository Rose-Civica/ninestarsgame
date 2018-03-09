import React from 'react';
import { possibleCombinationSum, Stars, Button, Answer, Numbers, Timer, DoneFrame } from './GameFunctions';
import './css/bootstrap.css';
import './css/fontawesome-all.css';

var _ = require('lodash');


class Game extends React.Component {
    static randomNumber = () => Math.floor(Math.random() * 9) + 1;
    static initialState = () => ({
        gameStart: false,
        selectedNumbers: [],
        randomNumberOfStars: Game.randomNumber(),
        usedNumbers: [],
        answerIsCorrect: null,
        redraws: 5,
        doneStatus: null,
        seconds: 30
    });
    constructor() {
        super();
        this.state = Game.initialState();
        this.timer = 0;
        Numbers.list = _.range(1, 10);
    }
    resetGame = () => { this.setState(Game.initialState()) };
    stopTimer = () => {
        clearInterval(this.timer);
        this.timer = 0;
    };
    startTimer = () => {
        if (this.timer === 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    };
    countDown = () => {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds - 1;
        this.setState({
            seconds: seconds,
        });
        if (this.state.seconds === 0) {
            this.stopTimer();
            this.timeUp();
        }
        if (this.state.doneStatus) {
            this.stopTimer();
        }
    };
    timeUp = () => {
        this.setState({
            doneStatus: "Time's Up!",
        });
    }
    selectNumber = (clickedNumber) => {
        if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) {
            return;
        }
        if (!this.state.gameStart) {
            this.setState(prevState => ({
                gameStart: true
            }));
            this.startTimer();
        }
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
        }));
    };
    unselectNumber = (clickedNumber) => {
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber)
        }));
    };
    checkAnswer = () => {
        this.setState(prevState => ({
            answerIsCorrect: prevState.randomNumberOfStars ===
            prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
        }))
    };
    acceptAnswer = () => {
        if (this.state.answerIsCorrect) {
            this.setState(prevState => ({
                usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
                selectedNumbers: [],
                answerIsCorrect: null,
                randomNumberOfStars: Game.randomNumber(),
            }), this.updateDoneStatus);
        }
    };
    redraw = () => {
        if (this.state.redraws === 0) {
            return;
        }
        this.setState(prevState => ({
            selectedNumbers: [],
            answerIsCorrect: null,
            randomNumberOfStars: Game.randomNumber(),
            redraws: prevState.redraws - 1,
        }), this.updateDoneStatus)
    };
    possibleSolutionsExist = ({ randomNumberOfStars, usedNumbers }) => {
        const possibleNumbers = _.range(1, 10).filter(
            number => usedNumbers.indexOf(number) === -1);
        return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
    };
    updateDoneStatus = () => {
        this.setState(prevState => {
            if (prevState.usedNumbers.length === 9) {
                return { doneStatus: 'You Win! Awesome! :)' };
            }
            if (prevState.redraws === 0 && !this.possibleSolutionsExist(prevState)) {
                return { doneStatus: 'Game Over! :(' };
            }
        });
    };
    render() {
        const {
    	selectedNumbers,
            randomNumberOfStars,
            usedNumbers,
            answerIsCorrect,
            redraws,
            doneStatus,
            gameStart,
            seconds
    } = this.state;
        return (
            <div className="container">
                <h3>Play Nine</h3>
                <hr />
                <div className="row">
                    <Stars numberOfStars={randomNumberOfStars} />
                    <Button selectedNumbers={selectedNumbers}
                        checkAnswer={this.checkAnswer}
                        answerIsCorrect={answerIsCorrect}
                        acceptAnswer={this.acceptAnswer}
                        redraw={this.redraw}
                        redraws={redraws}
                        doneStatus={doneStatus} />
                    <Answer selectedNumbers={selectedNumbers}
                        unselectNumber={this.unselectNumber} />
                </div>
                <br />
                {doneStatus ?
                    <DoneFrame doneStatus={doneStatus}
                        resetGame={this.resetGame}
                        stopTimer={this.stopTimer} /> :
                    <Numbers selectedNumbers={selectedNumbers}
                        selectNumber={this.selectNumber}
                        usedNumbers={usedNumbers}
                        gameStart={gameStart} />
                }
                {gameStart ?
                    (doneStatus ?
                        <div></div> :
                        <Timer seconds={seconds} />) :
                    <div></div>}
            </div>
        );
    }
}

export default Game;
