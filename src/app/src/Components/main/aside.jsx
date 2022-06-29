import React from 'react'

function Aside() {
  return (
    <div id="aside">
        <div id="aside-pos">
            <div id="search-div">
                <span className="material-icons">search</span>
                <input id="search-input" type="text" placeholder="Buscar"/>
            </div>
            <div id="chats">
                Chats (pendiente)
            </div>
        </div>
    </div>
  )
}

export default Aside