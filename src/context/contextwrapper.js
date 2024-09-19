import React, { useState } from "react";
import GlobalContext from "./globalcontext";
import dayjs from "dayjs";

export default function ContextWrapper(props) {
    const [dayIndex, setDayIndex] = useState(dayjs().date());
    const [cards, setCards] = useState([]);

    return (
        <GlobalContext.Provider value={{dayIndex, setDayIndex,cards, setCards}}>
            {props.children}
        </GlobalContext.Provider>
    )
}


