import React from "react";
import { connect } from "react-redux";
import {Link} from "react-router-dom";

import "../App.css";
import Stone from "./Stone.jsx";
import { selectStone, placeStone, syncGame, getGame } from "../actions";

class Game extends React.Component {

    alerted = false;
    async componentDidMount() {
        if ( this.props.match.params.id !== "localhost" ) {
            await this.props.getGame(this.props.match.params.id);
        }
    }

    renderField() {
        return(
            <table style={{width:"100%"}}>
                <tbody>
                    {this.props.state.stones.rows.map((row) => {

                        var r = row.map((slot) => {
                            if ( this.props.match.params.id === "localhost" || this.props.state.playerID === this.props.state.turn ) {
                                return (
                                    <Stone id={slot.id} data={slot} onClick={this.props.placeStone} name="Field"/>
                                )
                            } else {
                                return (
                                    <Stone id={slot.id} data={slot} name="Field"/>
                                )
                            }
                            
                        });

                        return (
                            <tr>
                                {r}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    renderHand() {
        if ( this.props.match.params.id === "localhost" ) {
            return(
                <table style={{position:"fixed", bottom:"20px", width:"100%"}}>
                    <tbody>
                        {this.props.state.stones.hands[this.props.state.turn].map((slot) => {
                            return (
                                <Stone id={slot.id} data={slot} onClick={this.props.selectStone} name="Hand"/>
                            )
                        })}
                    </tbody>
                </table>
            )
        } else if ( this.props.state.playerID === 2 ) {
            return <div/>;
        } else if ( this.props.state.playerID === this.props.state.turn ) {
            return(
                <table style={{position:"fixed", bottom:"20px", width:"100%"}}>
                    <tbody>
                        {this.props.state.stones.hands[this.props.state.playerID].map((slot) => {
                            return (
                                <Stone id={slot.id} data={slot} onClick={this.props.selectStone} name="Hand"/>
                            )
                        })}
                    </tbody>
                </table>
            )
        } else if ( this.props.state.playerID != null ) {
            return(
                <table style={{position:"fixed", bottom:"20px", width:"100%"}}>
                    <tbody>
                        {this.props.state.stones.hands[this.props.state.playerID].map((slot) => {
                            return (
                                <Stone id={slot.id} data={slot} name="Hand" disabled={true}/>
                            )
                        })}
                    </tbody>
                </table>
            )
        }
    }

    announceWinner() {
        if ( !this.alerted ) {
            alert(this.props.state.winner);
            this.alerted = true;
        }
    }

    render() {
        if ( this.props.match.params.id === "localhost" ) { // lokales Spiel
            if ( this.props.state.stones.rows.length === 0 ) {
                return <div>
                    <div className="PlayingField centered">
                        <h1>There is no local game running.</h1>
                        <Link to={`/`}><button className="goBack">Return to Main Menu</button></Link>
                    </div>
                </div>
            }
            
            if ( this.props.state.winner !== '' ) {
                return <div>
                    <div className="PlayingField centered">
                        <div className="end">
                            <b style={{color:"rgb(0, 163, 163)"}}>{this.props.state.stones.placedBy[0]}</b> : <b style={{color:"red"}}>{this.props.state.stones.placedBy[1]}</b>
                        </div>
                        {this.renderField()}
                        <Link to={`/`}><button className="goBack">Return to Main Menu</button></Link>
                    </div>
                    {alert(this.props.state.winner)}
                </div>
            }
            // default
            return <div>
                    <div className="PlayingField">
                       {this.renderField()}
                       {this.renderHand()}
                    </div>
                </div>
        
        } else { // Onlinespiel
            if ( this.props.state.error != null ) {
                return <div>
                        <div className="PlayingField centered">
                            <div className="currentID"><b>Game-ID: {this.props.match.params.id}</b></div>
                            <h1>{this.props.state.error}</h1>
                            <Link to={`/`}><button className="goBack">Return to Main Menu</button></Link>
                        </div>
                    </div>
            }

            if ( this.props.state.stones.rows == null ) {
                return <div>
                    <div className="PlayingField centered">
                        <div className="currentID"><b>Game-ID: {this.props.match.params.id}</b></div>
                        <h1>Could not find a game with the ID {this.props.match.params.id}.</h1>
                        <Link to={`/`}><button className="goBack">Return to Main Menu</button></Link>
                    </div>
                </div>
            }
            
            if ( this.props.state.edited ) {
                this.props.syncGame(this.props.state);
            } else if ( this.props.state.stones.rows != null ) {
                this.props.getGame(this.props.match.params.id);
            }

            if ( this.props.state.winner !== '' ) {
                return <div>
                    <div className="PlayingField centered">
                        <div className="currentID"><b>Game-ID: {this.props.match.params.id}</b></div>
                        <div className="end">
                            <b style={{color:"rgb(0, 163, 163)"}}>{this.props.state.stones.placedBy[0]}</b> : <b style={{color:"brown"}}>{this.props.state.stones.placedBy[1]}</b>
                        </div>
                        {this.renderField()}
                        <Link to={`/`}><button className="goBack">Return to Main Menu</button></Link>
                    </div>
                    {this.announceWinner()}
                </div>
            }
            // default
            return <div>
                    <div className="PlayingField">
                        <div className="currentID"><b>Game-ID: {this.props.match.params.id}</b></div>
                        {this.renderField()}
                        {this.renderHand()}
                    </div>
                </div>
        }
    }
}

const mapStateToProps = (state) => {
    return { state: state };
}

const mapDispatchToProps = {
    selectStone: selectStone,
    placeStone: placeStone,
    getGame: getGame,
    syncGame: syncGame
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);