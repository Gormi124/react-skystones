import React from "react";
import { connect } from "react-redux";
import {Link} from "react-router-dom";

import "../App.css";
import Stone from "./Stone.jsx";
import { selectStone, placeStone, startTutorial, handleTutorial } from "../actions";

class Game extends React.Component {

    async componentDidMount() {
        this.props.startTutorial();
    }

    renderField() {
        if ( this.props.state.tutorialStep < 7 ) {
            return(
                <table style={{width:"100%"}}>
                    <tbody>
                        {this.props.state.stones.rows.map((row) => {
    
                            var r = row.map((slot) => {
                                if ( slot.disabled || slot.owner !== "noOwner" ) {
                                    return <Stone id={slot.id} data={slot} name="Field"/>
                                }
                                return (
                                    <Stone style={{borderStyle:"solid",borderColor:"lightgreen"}} id={slot.id} data={slot} onClick={this.props.placeStone} name="Field"/>
                                )
                            });
    
                            return (
                                <tr>
                                    {r}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            );
        } else return(
            <table style={{width:"100%"}}>
                <tbody>
                    {this.props.state.stones.rows.map((row) => {

                        var r = row.map((slot) => {
                            return <Stone id={slot.id} data={slot} name="Field"/>
                        });

                        return (
                            <tr>
                                {r}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
    }

    renderHand() {
        if ( this.props.state.tutorialStep === 1 || this.props.state.tutorialStep === 4 || this.props.state.tutorialStep === 5 || this.props.state.tutorialStep === 7 ) {
            return(
                <table style={{position:"fixed", bottom:"20px", width:"100%"}}>
                    <tbody>
                        {this.props.state.stones.hands[0].map((slot) => {
                            return (
                                <Stone id={slot.id} data={slot} name="Hand" disabled={true}/>
                            )
                        })}
                        
                        <button className="Tutorial" onClick={this.props.handleTutorial}>Continue</button>
                    </tbody>
                </table>
            );
        } else if ( this.props.state.tutorialStep === 2 ) {
            return(
                <table style={{position:"fixed", bottom:"20px", width:"100%"}}>
                    <h2 style={{marginLeft:"120px"}} className="TutorialHeader">&#8659;This is your hand.&#8659;</h2>
                    <tbody>
                        {this.props.state.stones.hands[0].map((slot) => {
                            return (
                                <Stone id={slot.id} data={slot} name="Hand" disabled={true}/>
                            )
                        })}
                        
                        <button className="Tutorial" onClick={this.props.handleTutorial}>Continue</button>
                    </tbody>
                </table>
            );
        } else if ( this.props.state.tutorialStep === 8 ) {
            return(
                <table style={{position:"fixed", bottom:"20px", width:"100%"}}>
                    <tbody>
                        {this.props.state.stones.hands[0].map((slot) => {
                            return (
                                <Stone id={slot.id} data={slot} name="Hand" disabled={true}/>
                            )
                        })}
                        
                        <Link to={`/`}><button style={{fontSize:"25px"}} className="Tutorial">Return to<br/>main menu</button></Link>
                    </tbody>
                </table>
            );
        }
        return(
            <table style={{position:"fixed", bottom:"20px", width:"100%"}}>
                <tbody>
                    {this.props.state.stones.hands[0].map((slot) => {
                        if ( slot.disabled ) {
                            return (
                                <Stone id={slot.id} data={slot} name="Hand" disabled={true}/>
                            )
                        }
                        return (
                            <Stone id={slot.id} data={slot} onClick={this.props.selectStone} name="Hand"/>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    render() {
        if ( this.props.state.tutorialStep === 1 ) {
            return (
                <div>
                    <div className="PlayingField">
                        <h1 className="TutorialHeader">Welcome to the Skystones-Tutorial!</h1>
                        {this.renderField()}
                        {this.renderHand()}
                    </div>
                </div>
            );
        } else if ( this.props.state.tutorialStep === 2 ) {
            return (
                <div>
                    <div className="PlayingField">
                        {this.renderField()}
                        <h2 style={{float:"right", marginRight:"138px"}} className="TutorialHeader">&#8657;This is the matchfield.&#8657;</h2>
                        {this.renderHand()}
                    </div>
                </div>
            );
        } else if ( this.props.state.tutorialStep === 3 ) {
            return (
                <div>
                    <div className="PlayingField">
                      <h2 className="TutorialHeader">Click on the blue stone to select it.
                      <br/> Then click on the green slot to place the selected stone.</h2>
                        {this.renderField()}
                        {this.renderHand()}
                    </div>
                </div>
            );
        } else if ( this.props.state.tutorialStep === 4 ) {
            return (
                <div>
                    <div className="PlayingField">
                      <h2 className="TutorialHeader">Now it's your opponent's turn.</h2>
                        {this.renderField()}
                        {this.renderHand()}
                    </div>
                </div>
            );
        } else if ( this.props.state.tutorialStep === 5 ) {
            return (
                <div>
                    <div className="PlayingField">
                      <h2 className="TutorialHeader">Oh no! They've captured your stone!</h2>
                        {this.renderField()}
                        {this.renderHand()}
                    </div>
                </div>
            );
        } else if ( this.props.state.tutorialStep === 6 ) {
            return (
                <div>
                    <div className="PlayingField">
                      <h2 className="TutorialHeader">Time to get revenge! Capture one of their stones.</h2>
                        {this.renderField()}
                        {this.renderHand()}
                    </div>
                </div>
            );
        } else if ( this.props.state.tutorialStep === 7 ) {
            return (
                <div>
                    <div className="PlayingField">
                      <h2 className="TutorialHeader">Great job!
                      <br/>The game ends as soon as all slots on the matchfield are filled.
                      <br/>The player who owns the most stones in the end wins.</h2>
                        {this.renderField()}
                        {this.renderHand()}
                    </div>
                </div>
            );
        } else if ( this.props.state.tutorialStep === 8 ) {
            return (
                <div>
                    <div className="PlayingField">
                      <h1 className="TutorialHeader">Now you know how to play the game.
                      <br/>Have fun!</h1>
                        {this.renderField()}
                        {this.renderHand()}
                    </div>
                </div>
            );
        }
        return (
            <div>
                <div className="PlayingField">
                    {this.renderField()}
                    {this.renderHand()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { state: state };
}

const mapDispatchToProps = {
    selectStone: selectStone,
    placeStone: placeStone,
    startTutorial: startTutorial,
    handleTutorial: handleTutorial
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);