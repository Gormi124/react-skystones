import React from "react";

import "../App.css";
import "../images/spikes_noOwner_0.png";

// ToDo: Seitenanzeige verbessern
const Stone = (params) => (
    <div>
        <input disabled={params.disabled} id={params.id} type="radio" onClick={params.onClick} name={params.name} hidden/>
        <label htmlFor={params.id} style={params.style}  className={`Slot ${params.data.owner} ${params.data.inHand} ${params.data.selected}`}>
           <img src={require(`../images/spikes_${params.data.owner}_${params.data.top}.png`)} alt="" className={`topSide ${params.data.inHand}`}/>
           <img src={require(`../images/spikes_${params.data.owner}_${params.data.right}.png`)} alt="" className={`rightSide ${params.data.inHand}`}/>
           <img src={require(`../images/spikes_${params.data.owner}_${params.data.bottom}.png`)} alt="" className={`bottomSide ${params.data.inHand}`}/>
           <img src={require(`../images/spikes_${params.data.owner}_${params.data.left}.png`)} alt="" className={`leftSide ${params.data.inHand}`}/>
        </label>
    </div>
)

export default Stone;