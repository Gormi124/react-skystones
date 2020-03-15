import React from "react";
import {Route, BrowserRouter, Link} from "react-router-dom";

import "./App.css";
import MainPage from "./components/MainPage";
import CreateGame from "./components/CreateGame";
import JoinGame from "./components/JoinGame";
import Tutorial from "./components/Tutorial";
import Game from "./components/Game";

class App extends React.Component {
    render() {  
        return(
            <div>
                <BrowserRouter>
                    <Link to="/" style={{color: "rgb(137, 128, 196)"}}><h1 className="mainheader">Skystones</h1></Link>
                    <Route path="/" exact component={MainPage} />
                    <Route path="/create" exact component={CreateGame} />
                    <Route path="/join" exact component={JoinGame} />
                    <Route path="/tutorial" exact component={Tutorial} />
                    <Route path="/play/:id" exact component={Game} />
                </BrowserRouter>
            </div>
        );
    }
}

export default App;