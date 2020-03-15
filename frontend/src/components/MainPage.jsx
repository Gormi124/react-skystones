import React from "react";
import {Link} from "react-router-dom";

import "../App.css";

class MainPage extends React.Component {


    render() {
        return(
            <div className="centered">
                <h3><u>Welcome to Skystones!</u></h3>
                <br/>
                <div>
                    <Link to={`/create`}><button className="cGame"><b className="symbol">&oplus;</b><br/>Create game</button></Link><br/>
                    <Link to={`/join`}><button className="jGame"><b className="symbol">&#10162;</b><br/>Join game</button></Link>
                    <Link to={`/tutorial`}><button className="h2p"><b className="symbol">?</b><br/>How to play</button></Link>
                </div>
            </div>
        );
    }
}

export default MainPage;