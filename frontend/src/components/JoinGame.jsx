import React from "react";
import { connect } from "react-redux";
import {Link} from "react-router-dom";

import "../App.css";
import { joinGame } from "../actions";

class JoinGame extends React.Component {
    constructor() {
        super();
        this.state = { matchID: "", valid: false, statusHeader: "Please enter the ID of the game you want to join." };
    }

    validate(id) {
        if ( id >= 10000 ) {
            this.setState({ valid: true, statusHeader: "" })
        } else {
            this.setState({ valid: false, statusHeader: "Please enter a valid ID." })
        }
    }

    onChange = (event) => {
        event.preventDefault();
        const oldID = this.state.matchID;
        let newID = parseInt(event.target.value);
        if (newID >= 0 && newID <= 99999) {
            this.setState({ matchID: newID });
        } else if (event.target.value === "") {
            this.setState({ matchID: "" });
        } else {
            this.setState({ matchID: oldID });
        }
        this.validate(newID);
    }

    handleJoin = () => {
        this.props.joinGame(this.state.matchID);
    }

    render() {
        if ( !this.state.valid ) {
            return(
                <div className="centered">
                    <input className="jInput" type="search" onChange={this.onChange} value={this.state.matchID}/>
                    <br/>
                    <Link to={`/`}><button className="goBack">Go back</button></Link>
                    <button disabled={true} className="confirm">Join game</button>
                    <h3>{this.state.statusHeader}</h3>
                </div>
            );
        } else {
            return(
                <div className="centered">
                    <input className="jInput" type="search" onChange={this.onChange} value={this.state.matchID}/>
                    <br/>
                    <Link to={`/`}><button className="goBack">Go back</button></Link>
                    <Link to={`/play/${this.state.matchID}`} onClick={this.handleJoin}><button className="confirm">Join game</button></Link>
                    <h3>{this.state.statusHeader}</h3>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return { error: state.error};
}

const mapDispatchToProps = {
    joinGame: joinGame
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinGame);