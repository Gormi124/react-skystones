const initialState = {
    stones: {
        rows: [],
        hands: [ [], [] ],
        selected: null,
        placed: 0,
        placedBy: [ 0, 0 ]
    },
    turn: 0,
    winner: "",
    options: {
        onCapture: "",
        levelField: "",
        onStart: "keep",
        height: 3,
        width: 3,
        handSize: 5
    },
    playerID: 2,
    playerCount: 1,
    matchID: "localhost",
    error: null,
    edited: false
};

function randomizeStone(id, index) {
    let max;
    let sides;
    do {
        max = 9;
        sides = [null,null,null,null];
        for ( let i = 0; i < 4; i++ ) {
            let side;
            do {
                side = parseInt(Math.random()*4);
            } while (sides[side] !== null);
            
            if ( max >= 6 ) {
                sides[side] = parseInt(Math.random()*5.25);
            } else {
                sides[side] = parseInt(Math.random()*max);
            }
            max -= sides[side];
        }
    } while ((sides[0]+sides[1]+sides[2]+sides[3]) < 3);
    
    return { id: id, top: sides[0], right: sides[1], bottom: sides[2], left: sides[3], owner: "player"+(index+1), inHand: "inHand" };
}

export function randomizeHand(index, size) {
    size--;
    let hand = [];
        for ( let i = 0; i <= size; i++ ) {
            let id = "h"+(i+1);
            hand[i] = randomizeStone(id, index);
        }
    return hand;
}

function captureStone(stone, turn, onCapture) {
    if ( stone.owner === "noOwner" ) {
        return stone;
    }
    stone.owner = "player"+(turn+1);
    if ( onCapture === "rotate" ) {
        const top = stone.bottom;
        stone.bottom = stone.top;
        stone.top = top;

        const left = stone.right;
        stone.right = stone.left;
        stone.left = left;
    }
    return stone;
}

export default (state = initialState, action) => {
    let id = "";
    let stone = null;
    let field = [];
    let iA = 0;
    let iB = 0;
    let newState = null;
    
    switch (action.type) {
        case "ON_CAPTURE_SET":
            return {...state, options: {...state.options, onCapture: action.payload}};
        case "LEVEL_FIELD_SET":
            return {...state, options: {...state.options, levelField: action.payload}};
        case "ON_START_SET":
            return {...state, options: {...state.options, onStart: action.payload}};
        case "HEIGHT_SET":
            return {...state, options: {...state.options, height: action.payload}};
        case "WIDTH_SET":
            return {...state, options: {...state.options, width: action.payload}};
        case "HANDSIZE_SET":
            return {...state, options: {...state.options, handSize: action.payload}};
        case "ID_SET":
            state = initialState;
            return {...state, matchID: action.payload};

        case "TUTORIAL_START":
            for ( let i = 0; i < 3; i++ ) {
                field[i] = [];
                for ( let j = 0; j < 3; j++ ) {
                    id = (i+1)+""+(3-j);
                    field[i][j] = { id: id, top: 0, right: 0, bottom: 0, left: 0, owner: "noOwner", inHand: "", disabled: true }
                }
            }
            newState = {
                ...state,
                stones: {
                    rows: field,
                    hands: [
                        [
                            { id: "h1", top: 1, right: 2, bottom: 1, left: 3, owner: "player1", inHand: "inHand", disabled: true },
                            { id: "h2", top: 3, right: 0, bottom: 4, left: 1, owner: "player1", inHand: "inHand", disabled: true },
                            { id: "h3", top: 1, right: 2, bottom: 2, left: 0, owner: "player1", inHand: "inHand", disabled: true },
                            { id: "h4", top: 2, right: 3, bottom: 0, left: 3, owner: "player1", inHand: "inHand" },
                            { id: "h5", top: 1, right: 1, bottom: 4, left: 1, owner: "player1", inHand: "inHand", disabled: true },
                        ],
                        []
                    ],
                    selected: "",
                    placed: 0,
                    placedBy: [0,0]
                },
                turn: 0,
                winner: "",
                tutorialStep: 1
            };
            return newState;
        case "TUTORIAL_HANDLE":
            state.tutorialStep++;
            if ( state.tutorialStep === 3 ) {
                state.stones.rows[2][1].disabled = false;
            } else if ( state.tutorialStep === 5 ) {
                stone = {id: "h1", top: 1, right: 1, bottom: 0, left: 4, owner: "player2", inHand: "inHand"};
                stone.id = 33;
                stone.inHand = "";
                state.stones.rows[2][0] = stone;

                state.stones.rows[2][1] = captureStone(state.stones.rows[2][1], 1, "");
                
                state.stones.placed++;
            } else if ( state.tutorialStep === 6 ) {
                state.stones.rows[1][0].disabled = false;
                state.stones.rows[1][1].disabled = false;
                state.stones.hands[0][1].disabled = false;
                state.stones.hands[0][3].disabled = false;
                state.turn = 0;
            }
            return {...state};

        case "LGAME_CREATE":
            for ( let i = 0; i < state.options.height; i++ ) {
                field[i] = [];
                for ( let j = 0; j < state.options.width; j++ ) {
                    id = (i+1)+""+(state.options.width-j);
                    field[i][j] = { id: id, top: 0, right: 0, bottom: 0, left: 0, owner: "noOwner", inHand: "" }
                }
            }
            // neues lokales Spiel wird erstellt
            newState = {
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
                winner: "",
                matchID: "localhost"
            };
            if ( newState.options.levelField === "sameHands" ) {
                for ( let i = 0; i < newState.stones.hands[0].length; i++ ) {
                    newState.stones.hands[1][i] = {...newState.stones.hands[0][i], owner: "player2"};
                }
            }
            return newState;
        case "OGAME_CREATE":
            return action.payload;

        case "GAME_JOIN":
            return {...action.payload, stones: {...action.payload.stones, selected: ""}, error: null, edited: true};
            
        case "GAME_SYNC":
            return {...state, edited: false};

        case "GAMES_GET":
            return action.payload;
        case "GAME_GET":
            return {...action.payload, stones: {...action.payload.stones, selected: state.stones.selected}, playerID: state.playerID, error: null, edited: false};

        case "STONE_SELECT":
            id = action.payload.id;
            stone = state.stones.hands[state.turn].find((s) => s.id === id);
            return {...state, stones: {...state.stones, selected: stone}};
        case "STONE_PLACE":
            if (state.stones.selected == null) {
                return state;
            }
            id = action.payload.id;

            for ( let i = 0; i < state.stones.rows.length; i++) {
                for ( let j = 0; j < state.stones.rows[i].length; j++ ) {
                    if ( state.stones.rows[i][j].id === id ) {
                        if ( state.stones.rows[i][j].owner !== "noOwner" ) {
                            return state;
                        } else {
                            iA = i;
                            iB = j;
                            break;
                        }
                    }
                }
            }
            stone = {...state.stones.selected};
            stone.id = id;
            stone.inHand = "";
            state.stones.rows[iA][iB] = stone;
            id = state.stones.selected.id;
            state.stones.hands[state.turn] = state.stones.hands[state.turn].filter((s) => s.id !== state.stones.selected.id);
            
            // oberen Stein erobern
            if ( iA > 0 ) {
                if ( state.stones.rows[iA-1][iB].bottom < stone.top && state.stones.rows[iA-1][iB].owner !== stone.owner) {
                    state.stones.rows[iA-1][iB] = captureStone(state.stones.rows[iA-1][iB], state.turn, state.options.onCapture);
                }
            }
            // unteren Stein erobern
            if ( iA < state.options.height-1 ) {
                if ( state.stones.rows[iA+1][iB].top < stone.bottom && state.stones.rows[iA+1][iB].owner !== stone.owner) {
                    state.stones.rows[iA+1][iB] = captureStone(state.stones.rows[iA+1][iB], state.turn, state.options.onCapture);
                }
            }
            // rechten Stein erobern
            if ( iB > 0 ) {
                if ( state.stones.rows[iA][iB-1].left < stone.right && state.stones.rows[iA][iB-1].owner !== stone.owner) {
                    state.stones.rows[iA][iB-1] = captureStone(state.stones.rows[iA][iB-1], state.turn, state.options.onCapture);
                }
            }
            // linken Stein erobern
            if ( iB < state.options.width-1 ) {
                if ( state.stones.rows[iA][iB+1].right < stone.left && state.stones.rows[iA][iB+1].owner !== stone.owner) {
                    state.stones.rows[iA][iB+1] = captureStone(state.stones.rows[iA][iB+1], state.turn, state.options.onCapture);
                }
            }

            // "On start of turn"-Einstellung
            if ( state.options.onStart === "randomize") {
                state.stones.hands[state.turn] = randomizeHand(state.turn, state.options.handSize);
            } else if ( state.options.onStart === "refill" ) {
                state.stones.hands[state.turn] = [...state.stones.hands[state.turn], randomizeStone(id, state.turn)];
            }
            
            state.edited = true;
            state.stones.placed++;
            if ( state.stones.placed === (state.options.width*state.options.height) ) {
                for ( let i = 0; i < state.options.height; i++ ) {
                    for ( let j = 0; j < state.options.width; j++ ) {
                        if ( state.stones.rows[i][j].owner === "player1" ) {
                            state.stones.placedBy[0]++;
                        } else state.stones.placedBy[1]++;
                    }
                }
                if ( state.stones.placedBy[0] > state.stones.placedBy[1] ) {
                    return {...state, stones: {...state.stones, selected: ""}, winner: "Blue won the game!"};
                } else if ( state.stones.placedBy[0] < state.stones.placedBy[1] ) {
                    return {...state, stones: {...state.stones, selected: ""}, winner: "Red won the game!"};
                } else return {...state, stones: {...state.stones, selected: ""}, winner: "Draw! Nobody wins!"};
            }
            
            // Spielerwechsel
            state.turn++;
            if ( state.turn === 2 ) {
                state.turn = 0;
            }
            if ( state.tutorialStep != null ) {
                state.tutorialStep++;
            }
            return {...state, stones: {...state.stones, selected: null}};
            
        case "ERROR_FETCH":
            state.error = `An Error occured whilst fetching the game data:\n ${action.payload}`;
            return state;
        case "ERROR_POST":
            state.error = `An Error occured whilst creating the game:\n ${action.payload}`;
            return state;

        default:
            return state;
    }
}
