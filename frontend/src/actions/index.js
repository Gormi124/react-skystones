import axios from "axios";
import { randomizeHand } from "../reducers/gameReducer";

export const setOnCapture = (selection) => async dispatch => {
    dispatch({ 
        type: "ON_CAPTURE_SET",
        payload: selection
    });
}
export const setLevelField = (selection) => async dispatch => {
    dispatch({ 
        type: "LEVEL_FIELD_SET",
        payload: selection
    });
}
export const setOnStart = (selection) => async dispatch => {
    dispatch({ 
        type: "ON_START_SET",
        payload: selection
    });
}

export const setFieldHeight = (selection) => async dispatch => {
    dispatch({ 
        type: "HEIGHT_SET",
        payload: selection
    });
}
export const setFieldWidth = (selection) => async dispatch => {
    dispatch({ 
        type: "WIDTH_SET",
        payload: selection
    });
}

export const setHandSize = (size) => async dispatch => {
    dispatch({ 
        type: "HANDSIZE_SET",
        payload: size
    });
}

export const setMatchID = (id) => async dispatch => {
    dispatch({ 
        type: "ID_SET",
        payload: id
    });
}

export const startTutorial = () => async dispatch => {
    dispatch({ 
        type: "TUTORIAL_START"
    });
}
export const handleTutorial = () => async dispatch => {
    dispatch({ 
        type: "TUTORIAL_HANDLE"
    });
}

export const createLocalGame = () => async dispatch => {
    dispatch({ 
        type: "LGAME_CREATE"
    });
};

export const createOnlineGame = (state) => async dispatch => {
    let field = [];
    let id;
    for ( let i = 0; i < state.options.height; i++ ) {
        field[i] = [];
        for ( let j = 0; j < state.options.width; j++ ) {
            id = (i+1)+""+(state.options.width-j);
            field[i][j] = { id: id, top: 0, right: 0, bottom: 0, left: 0, owner: "noOwner", inHand: "" }
        }
    }
    // neues Onlinespiel wird erstellt
    let newState = {
        ...state,
        stones: {
            rows: field,
            hands: [
                randomizeHand(0, state.options.handSize),
                randomizeHand(1, state.options.handSize)
            ],
            selected: "",
            placed: 0,
            placedBy: [0,0]
        },
        turn: parseInt(Math.random()*2),
        playerID: 0,
        playerCount: 1,
        winner: "",
        edited: false
    }
    if ( newState.options.levelField === "sameHands" ) {
        for ( let i = 0; i < newState.stones.hands[0].length; i++ ) {
            newState.stones.hands[1][i] = {...newState.stones.hands[0][i], owner: "player2"};
        }
    }
    try {
        await axios.post("http://localhost:5000/games/", newState);
        dispatch({
            type: "OGAME_CREATE",
            payload: newState
        });
    } catch (err) {
        console.log("postingFailure")
        dispatch(postingFailure(err));
    }
};

export const joinGame = (id) => async dispatch => {
    try {
        const data = await axios.get(`http://localhost:5000/games/${id}`);
        dispatch(joinGameSuccess(data.data));
    } catch (err) {
        console.log("fetchingFailure")
        dispatch(fetchingFailure(err));
    }
}

export const syncGame = (state) => async dispatch => {
    try {
        await axios.get(`http://localhost:5000/games/${state.matchID}`);
        dispatch(syncGameSuccess(state));
    } catch (err) {
        dispatch(fetchingFailure(err));
    }
};

export const getGames = () => async dispatch => {
    try {
        const gameData = await axios.get("http://localhost:5000/games");
        dispatch({ 
            type: "GAMES_GET",
            payload: gameData
        });
    } catch (err) {
        dispatch(fetchingFailure(err));
    }
};

export const getGame = (id) => async dispatch => {
    try {
        const gameData = await axios.get(`http://localhost:5000/games/${id}`);
        dispatch({ 
            type: "GAME_GET",
            payload: gameData.data
        });
    } catch (err) {
        console.log("fetchingFailure")
        dispatch(fetchingFailure(err));
    }
};

export const selectStone = (event) => async dispatch => {
    dispatch({
        type: "STONE_SELECT",
        payload: event.target
    })
}

export const placeStone = (event) => async dispatch => {
    dispatch({
        type: "STONE_PLACE",
        payload: event.target
    })
}

const joinGameSuccess = (data) => async dispatch => {
    if ( data.playerCount === 1 ) {
        data.playerCount++;
        data.playerID = 1;
    } else {
        data.playerID = 2;
    }
    dispatch({
        type: "GAME_JOIN",
        payload: data
    })
}
const syncGameSuccess = (state) => async dispatch => {
    await axios.patch( `http://localhost:5000/games/${state.matchID}`, state);
    dispatch({
        type: "GAME_SYNC"
    });
}
const fetchingFailure = error => ({
    type: "ERROR_FETCH",
    payload: error
})
const postingFailure = error => ({
    type: "ERROR_POST",
    payload: error
})