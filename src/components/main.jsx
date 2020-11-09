import React, { Component, Fragment } from 'react';
import Button from './button';


class Main extends Component {
    state = {
        seshLength: 25,
        brkLength: 5,
        timeLeft: '25:00',
        counting: false,
        timerState: 'Session'
    }
    increment_stateKey = key => {
        let { counting, timeLeft } = this.state
        if (!counting) {
            let keyValue = this.state[key];
            if (keyValue >= 1 && keyValue < 60) {
                let KEY = keyValue;
                if (key === "seshLength") {
                    KEY = parseInt(KEY);
                }
                KEY++;
                console.log(typeof KEY)
                if (key === "seshLength") {
                    if (KEY < 10) {
                        KEY = `0${KEY}`;
                    }
                    timeLeft = `${KEY}:00`;
                }
                this.setState({
                    [key]: KEY,
                    timeLeft
                });
            }
        }
    }
    decrement_stateKey = key => {
        let { counting, timeLeft } = this.state
        if (!counting) {
            let keyValue = this.state[key];
            if (keyValue > 1 && keyValue <= 60) {
                let KEY = keyValue - 1;
                if (key === "seshLength") {
                    if (KEY < 10) {
                        KEY = `0${KEY}`;
                    }
                    timeLeft = `${KEY}:00`;
                }
                this.setState({
                    [key]: KEY,
                    timeLeft
                });
            }
        }
    }
    // incrementSession = () => {
    //     const { counting } = this.state
    //     if (!counting) {
    //         if (this.state.seshLength >= 1 && this.state.seshLength < 60) {
    //             let seshLength = this.state.seshLength + 1;
    //             let timeLeft = `${seshLength}:00`;
    //             this.setState({
    //                 seshLength,
    //                 timeLeft
    //             });

    //         }
    //     }
    // }
    // decrementSession = () => {
    //     const { counting } = this.state
    //     if (!counting) {
    //         if (this.state.seshLength > 1 && this.state.seshLength <= 60) {
    //             let seshLength = this.state.seshLength - 1
    //             this.setState({
    //                 seshLength,
    //                 timeLeft: `${seshLength}:00`
    //             })
    //         }
    //     }
    // }
    // incrementBreakLength = () => {
    //     const { counting } = this.state
    //     if (!counting) {
    //         if (this.state.brkLength >= 1 && this.state.brkLength < 60) {
    //             let brkLength = this.state.brkLength + 1
    //             this.setState({
    //                 brkLength
    //             })
    //         }
    //     }
    // }
    // decrementBreakLength = () => {
    //     const { counting } = this.state
    //     if (!counting) {
    //         if (this.state.brkLength > 1 && this.state.brkLength <= 60) {
    //             let brkLength = this.state.brkLength - 1
    //             this.setState({
    //                 brkLength
    //             })
    //         }
    //     }

    // }
    updateTimeLeft = arg => {
        if (arg != 'uS') {
            let [minutes, seconds] = this.state.timeLeft.split(':');
            if (minutes < 10) {
                minutes = `0${minutes}`
            }
            let timeLeft = `${minutes}:${seconds}`;
            this.setState({
                timeLeft
            })
        }
    }
    mainCounting = () => {
        let { timeLeft, counting, seshLength, timerState, brkLength } = this.state;
        let [minutes, seconds] = timeLeft.split(':');
        seconds = parseInt(seconds);
        minutes = parseInt(minutes);

        if ((minutes == 0 && seconds == 0) && timerState == "Session") {
            const audio = document.getElementById("beep");

            audio.play();
            this.setState({
                timerState: "Break",
            })
        }
        if (timerState == "Break") {
            if (brkLength < 10) {
                brkLength = `0${brkLength}`
            }
            console.log('===========')
            console.log(timeLeft)
            if (timeLeft == '00:00') {
                this.setState({
                    timeLeft: `${brkLength}:00`
                })
            }

            this.breakCounting()
        } else if (timerState == "Session") {
            [minutes, seconds] = this.decrementing(minutes, seconds);
            timeLeft = `${minutes}:${seconds}`;
            this.setState({
                timeLeft
            })
        }


    }
    decrementing = (minutes, seconds) => {
        if (seconds == 0) {
            seconds = 60;
            seconds--;
            if (minutes > 0) minutes--;

        } else if (seconds > 0) {
            seconds--;
        }

        // check if second is less than 10 or not.
        if (seconds < 10) {
            seconds = `0${seconds}`
        }
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        return [minutes, seconds];
    }
    breakCounting = () => {
        let { timeLeft, counting, seshLength, timerState, brkLength } = this.state;
        let [minutes, seconds] = timeLeft.split(':');
        seconds = parseInt(seconds);
        minutes = parseInt(minutes);
        if ((minutes == 0 && seconds == 0) && timerState == "Break") {
            const audio = document.getElementById("beep");

            audio.play();
            this.setState({
                timerState: "Session",
            })
        }
        if (timerState == "Session") {
            if (seshLength < 10) {
                seshLength = `0${seshLength}`
            }
            if (timeLeft == '00:00') {
                this.setState({
                    timeLeft: `${seshLength}:00`
                })
            }

            this.mainCounting()
        } else if (timerState == "Break") {
            [minutes, seconds] = this.decrementing(minutes, seconds);
            timeLeft = `${minutes}:${seconds}`;
            this.setState({
                timeLeft
            })
        }
    }
    count = () => {
        const { counting } = this.state;
        if (!counting) {
            this.setState({
                counting: true,
                timerState: "Session"
            })
            this.interval = setInterval(this.mainCounting, 1000);
        } else {
            this.setState({
                counting: false
            })
            clearInterval(this.interval);
            this.setState({
                seshLength: 25,
                brkLength: 5,
                timeLeft: '25:00',
                counting: false,
                timerState: 'Session'
            })
        }
    }
    reset = () => {
        this.setState({
            counting: true
        })
        this.count()
    }
    render() {
        const { seshLength, brkLength, timeLeft, timerState } = this.state
        return (
            <Fragment>
                <h1 className="title">Pomodro Clock</h1>
                <div className="card">
                    <div id="timer-label">{timerState}</div>
                    <div id="time-left">{timeLeft}</div>
                    <button id="start_stop" onClick={this.count}><i className={`fas fa-${this.state.counting ? 'pause' : 'play'}`}></i></button>
                    <button id="reset" onClick={this.reset}><i className="fas fa-sync-alt"></i></button>
                </div>
                <div className="top">
                    <div className="box">
                        <div className="label" id="break-label">Break Length
</div>
                        <div className="box__">
                            <Button id="break-increment" onClick={this.increment_stateKey} keyValue="brkLength" className="fa-arrow-up" />
                            <div id="break-length">{brkLength}</div>
                            <Button id="break-decrement" onClick={this.decrement_stateKey} keyValue="brkLength" className="fa-arrow-down" />

                        </div>
                    </div>
                    <div className="box">
                        <div className="label" id="session-label">Session Length
</div>
                        <div className="box__">
                            <Button id="session-increment" onClick={this.increment_stateKey} keyValue="seshLength" className="fa-arrow-up" />
                            <div id="session-length">{seshLength}</div>
                            <Button id="session-decrement" onClick={this.decrement_stateKey} keyValue="seshLength" className="fa-arrow-down" />
                        </div>
                    </div>
                </div>
                <audio
                    id="beep"
                    preload="auto"

                    src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                />
            </Fragment>
        );
    }
}

export default Main;