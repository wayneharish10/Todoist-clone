import React from 'react'

const GlobalContext = React.createContext({
    dayIndex: 0,
    setDayIndex: (index) => {},
    cards: [],
    setCards: () => {},
    
});


export default GlobalContext