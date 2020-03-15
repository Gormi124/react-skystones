import React from "react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";

import "../App.css";
import Stone from "./Stone";
import { createLocalGame, createOnlineGame, setOnCapture, setOnStart, setFieldWidth, setFieldHeight, setHandSize, getGames, getGame, setMatchID, setLevelField } from "../actions";

class CreateGame extends React.Component {
    matchID;
    tooltip = "";
    
    async componentDidMount() {
        this.matchID = await this.randomizeID();
        await this.props.setMatchID(this.matchID);
    }

    randomizeID = async () => {
        let newID = 0;
        do {
            newID = Math.floor(Math.random()*89999+10000);
        } while ( await this.props.getGame(newID) != null );
        
        return newID;
    }

    checkboxHandler = (event) => {
        let selection = "";
        if ( event.target.checked ) {
            selection = event.target.value;
        }
        if ( event.target.name === "onCapture" ) this.props.setOnCapture(selection);
        else this.props.setLevelField(selection);
    }

    radioHandler = (event) => {
        const amount = parseInt(this.props.state.options.height*this.props.state.options.width/2+.5);
        if ( event.target.value === "keep" ) {
            this.props.setHandSize(amount);
        } else {
            if ( amount > 10 ) {
                this.props.setHandSize(10);
            } else if ( amount < 1 ) {
                this.props.setHandSize(1);
            }
        }
        
        this.props.setOnStart(event.target.value);
    }

    sliderHandler = (event) => {
        if ( event.target.name === "height" ) {
            this.props.setFieldHeight(8-event.target.value);

            if ( this.props.state.options.onStart === "keep" ) {
                this.props.setHandSize(parseInt((8-event.target.value)*this.props.state.options.width/2+.5));
            }
        } else {
            this.props.setFieldWidth(Number(event.target.value));

            if ( this.props.state.options.onStart === "keep" ) {
                this.props.setHandSize(parseInt(this.props.state.options.height*event.target.value/2+.5));
            }
        }
    }

    handHandler = (event) => {
        event.preventDefault();
        if ( event.target.value > 10 ) {
            event.target.value = 10;
        } else if ( event.target.value < 1 ) {
            event.target.value = 1;
        }
        this.props.setHandSize(event.target.value);
    }

    onlineGameHandler = () => {
        this.props.createOnlineGame(this.props.state);
    }

    manageTooltip = (event) => {
        this.tooltip = event.target.innerHTML;
        this.forceUpdate();
    }
    renderTooltip = () => {
        if ( this.tooltip === "" ) {
            return(
                <div/>
            );
        } else if ( this.tooltip === "Rotate stones on capture" ) {
            return(
                <div className="tooltip">
                    <h2 style={{color:"#ffd700"}}><u>Rotate Stones on Capture</u></h2>
                    <h3>Whenever a stone is captured, it is rotated by 180 degrees.</h3>
                    <table style={{width:"100%"}}>
                        <tbody>
                            <Stone data={{top: 0, right: 0, bottom: 0, left: 0, owner: "noOwner", inHand: ""}} name="Field"/>
                            <Stone data={{top: 3, right: 2, bottom: 1, left: 0, owner: "player1", inHand: ""}} name="Field"/>
                        </tbody>
                    </table>
                    <b className="symbol">&#8659;</b>
                    <table style={{width:"100%"}}>
                        <tbody>
                            <Stone data={{top: 0, right: 4, bottom: 0, left: 3, owner: "player2", inHand: ""}} name="Field"/>
                            <Stone data={{top: 1, right: 0, bottom: 3, left: 2, owner: "player2", inHand: ""}} name="Field"/>
                        </tbody>
                    </table>
                </div>
            );
        } else if ( this.tooltip === "Start the game with equal hands" ) {
            return(
                <div className="tooltip">
                    <h2 style={{color:"#ffd700"}}><u>Start with Equal Hands</u></h2>
                    <h3>Both players start the game with the same stones in their hands.</h3>
                </div>
            );
        } else if ( this.tooltip === "Keep the current hand" ) {
            return(
                <div className="tooltip">
                    <h2 style={{color:"#ffd700"}}><u>Keep the Hand</u></h2>
                    <h3>The standard setting.
                    <br/>Nothing happens to your hand
                    <br/>after you've placed a stone.
                    <br/>The size of the hands scales
                    <br/>with the size of the matchfield.
                    </h3>
                </div>
            );
        } else if ( this.tooltip === "Draw a new stone" ) {
            return(
                <div className="tooltip">
                    <h2 style={{color:"#ffd700"}}><u>Draw a New Stone</u></h2>
                    <h3>After placing a stone,
                    <br/>you gain a new one.
                    <br/>The size of the hands can be
                    <br/>set to a number between 1 and 10.
                    </h3>
                </div>
            );
        } else if ( this.tooltip === "Generate a new hand" ) {
            return(
                <div className="tooltip">
                    <h2 style={{color:"#ffd700"}}><u>Generate a New Hand</u></h2>
                    <h3>After placing a stone, your whole hand
                    <br/>is replaced by a newly generated one.
                    <br/>The size of the hands can be
                    <br/>set to a number between 1 and 10.
                    </h3>
                </div>
            );
        }
    }

    render() {
        if ( this.props.state.options == null || this.matchID == null ) {
            return <div>Loading...</div>;
        }

        if ( this.props.state.error != null ) {
            return (
                <div>
                <div className="cContainer">
                    <div>
                        <input id="onCapture" type="checkbox" onChange={this.checkboxHandler} name="onCapture" value="rotate"/>
                        <label htmlFor="onCapture" className="option" onMouseOver={this.manageTooltip}>Rotate stones on capture</label>
                        <br/><input id="levelField" type="checkbox" onChange={this.checkboxHandler} name="levelField" value="sameHands"/>
                        <label htmlFor="levelField" className="option" onMouseOver={this.manageTooltip}>Start the game with equal hands</label><p/>
                        
                        <u style={{color:"pink"}}>On start of turn:</u>
                        <br/><input id="onStart1" type="radio" onChange={this.radioHandler} name="onStart" value="keep" defaultChecked/>
                        <label htmlFor="onStart1" className="option" onMouseOver={this.manageTooltip}>Keep the current hand</label>
                        <br/><input id="onStart2" type="radio" onChange={this.radioHandler} name="onStart" value="refill"/>
                        <label htmlFor="onStart2" className="option" onMouseOver={this.manageTooltip}>Draw a new stone</label>
                        <br/><input id="onStart3" type="radio" onChange={this.radioHandler} name="onStart" value="randomize"/>
                        <label htmlFor="onStart3" className="option" onMouseOver={this.manageTooltip}>Generate a new hand</label><p/>

                        <u style={{color:"pink"}}>Field dimensions:</u>
                        <br/><input orient="vertical" style={{ height:"300px", width:"10px", marginTop:"30px", marginLeft:"10px" }} type="range" onChange={this.sliderHandler} name="height" min={1} max={5} defaultValue={5}/>
                        <input style={{ width:"300px", height:"10px", marginBottom:"325px" }} type="range" onChange={this.sliderHandler} name="width" min={3} max={7} defaultValue={3}/>

                        <div style={{ color:"pink", marginTop:"-324px", marginLeft:"36px" }}>3<div style={{ textAlign:"center", marginRight:"27px", marginTop:"-23px" }}>5</div><div style={{ textAlign:"right", marginRight:"27px", marginTop:"-23px" }}>7</div></div>
                        <div style={{ color:"pink", marginTop:"124px", marginLeft:"36px" }}>5</div>
                        <div style={{ color:"pink", marginTop:"122px", marginLeft:"36px" }}>7</div>

                        <br/><u style={{color:"pink", marginRight:"8px"}}>Hand size:</u>
                        <input id="handSize" type="number" inputMode="numeric" min={1} max={10} onChange={this.handHandler} value={this.props.state.options.handSize} disabled={this.props.state.options.onStart === "keep"}/>
                    </div><br/>
                    <div className="centered">
                        <Link to={`/`}><button className="goBack">Go back</button></Link>
                        <Link to={`/play/localhost`} onClick={this.props.createLocalGame}><button className="confirm">Create local game</button></Link>
                        <button className="confirm" disabled={true}>Create online game</button>
                    </div>
                </div>
                {this.renderTooltip()}
            </div>
            );
        }
        return(
            <div>
                <div className="cContainer">
                    <div>
                        <input id="onCapture" type="checkbox" onChange={this.checkboxHandler} name="onCapture" value="rotate"/>
                        <label htmlFor="onCapture" className="option" onMouseOver={this.manageTooltip}>Rotate stones on capture</label>
                        <br/><input id="levelField" type="checkbox" onChange={this.checkboxHandler} name="levelField" value="sameHands"/>
                        <label htmlFor="levelField" className="option" onMouseOver={this.manageTooltip}>Start the game with equal hands</label><p/>
                        
                        <u style={{color:"pink"}}>On start of turn:</u>
                        <br/><input id="onStart1" type="radio" onChange={this.radioHandler} name="onStart" value="keep" defaultChecked/>
                        <label htmlFor="onStart1" className="option" onMouseOver={this.manageTooltip}>Keep the current hand</label>
                        <br/><input id="onStart2" type="radio" onChange={this.radioHandler} name="onStart" value="refill"/>
                        <label htmlFor="onStart2" className="option" onMouseOver={this.manageTooltip}>Draw a new stone</label>
                        <br/><input id="onStart3" type="radio" onChange={this.radioHandler} name="onStart" value="randomize"/>
                        <label htmlFor="onStart3" className="option" onMouseOver={this.manageTooltip}>Generate a new hand</label><p/>

                        <u style={{color:"pink"}}>Field dimensions:</u>
                        <br/><input orient="vertical" style={{ height:"300px", width:"10px", marginTop:"30px", marginLeft:"10px" }} type="range" onChange={this.sliderHandler} name="height" min={1} max={5} defaultValue={5}/>
                        <input style={{ width:"300px", height:"10px", marginBottom:"325px" }} type="range" onChange={this.sliderHandler} name="width" min={3} max={7} defaultValue={3}/>

                        <div style={{ color:"pink", marginTop:"-324px", marginLeft:"36px" }}>3<div style={{ textAlign:"center", marginRight:"27px", marginTop:"-23px" }}>5</div><div style={{ textAlign:"right", marginRight:"27px", marginTop:"-23px" }}>7</div></div>
                        <div style={{ color:"pink", marginTop:"124px", marginLeft:"36px" }}>5</div>
                        <div style={{ color:"pink", marginTop:"122px", marginLeft:"36px" }}>7</div>

                        <br/><u style={{color:"pink", marginRight:"8px"}}>Hand size:</u>
                        <input id="handSize" type="number" inputMode="numeric" min={1} max={10} onChange={this.handHandler} value={this.props.state.options.handSize} disabled={this.props.state.options.onStart === "keep"}/>
                    </div><br/>
                    <div className="centered">
                        <Link to={`/`}><button className="goBack">Go back</button></Link>
                        <Link to={`/play/localhost`} onClick={this.props.createLocalGame}><button className="confirm">Create local game</button></Link>
                        <Link to={`/play/${this.matchID}`} onClick={this.onlineGameHandler}><button className="confirm">Create online game</button></Link>
                    </div>
                </div>
                {this.renderTooltip()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { state: state };
}

const mapDispatchToProps = {
    createLocalGame: createLocalGame,
    createOnlineGame: createOnlineGame,
    setOnCapture: setOnCapture,
    setOnStart: setOnStart,
    setFieldHeight: setFieldHeight,
    setFieldWidth: setFieldWidth,
    setMatchID: setMatchID,
    setHandSize: setHandSize,
    getGames: getGames,
    getGame: getGame,
    setLevelField: setLevelField
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGame);