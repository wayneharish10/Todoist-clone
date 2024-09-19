import dayjs from 'dayjs';
import React from 'react';
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';

export default function Today() {

    const todate = dayjs(new Date());
    const [ cards, setCards ] = useState([]);
    const [ hasChecked, setHasChecked ] = useState(false);

    useEffect(() => {
        hasChecked && localStorage.setItem("cards" , JSON.
            stringify(cards));
    }, [cards]);

    useEffect(() => {
        const cardData = localStorage.getItem("cards");

        setCards(cardData ? JSON.parse(cardData) : []); 

        setHasChecked(true);

    }, []);

    return (
        <div className="flex flex-col">
            <Header todate={todate}/>
            <Board column= {"240917"} cards={cards} setCards={setCards}/>
        </div>
    )
}

const Header = ({todate}) => {
    return (
        <div className='p-5'>
            <h1 className='font-bold text-3xl p-9'>Today</h1>
            {/* <h3 className={`font-bold text-black mr-2`}>
                    {todate.format("D")} {todate.format("MMM")} • {todate.format("dddd")}
                </h3> */}
        </div>
    )
}

const DropIndicator = ({ beforeId, column}) =>{
    return (
        <div 
            data-before={beforeId || -1}
            data-column={column}
            className={`h-1 w-full bg-gray-200 opacity-0
            }`}>
        </div>
    )
};


const Board = ({column,cards, setCards}) => {

    const today = dayjs(new Date()).format('YYMMDD').toString();
    const filteredCards = cards.filter((c)=> c.column === today);

    const handleDragStart = (e, card) => {
        e.dataTransfer.setData("cardId", card.id);
        
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        highlightIndicator(e);           
    }
   
    const handleDragLeave = () => {
        clearHighlights();
    }

    const clearHighlights = (els)=>{
        const indicators = els || getIndicators();

        indicators.forEach(element => {
            element.style.opacity = "0";
        });
    }

    const handleDragEnd = (e) => {
        const cardId = e.dataTransfer.getData("cardId");
        clearHighlights();
        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);
        const before = element.dataset.before || "-1";

        if (before !== cardId) {
        let copy = [...cards];

        let cardToTransfer = copy.find((c) => c.id === cardId);
        if (!cardToTransfer) return;
        cardToTransfer = { ...cardToTransfer/*, column*/ };
        copy = copy.filter((c) => c.id !== cardId);

        const moveToBack = before === "-1";

        if (moveToBack) {
            copy.push(cardToTransfer);
        } else {
            const insertAtIndex = copy.findIndex((el) => el.id === before);
            if (insertAtIndex === undefined) return;

            copy.splice(insertAtIndex, 0, cardToTransfer);
        }
        setCards(copy);
        }
    }

    const getNearestIndicator = (e, indicators) => {
        const DISTANCE_OFFSET = 50;
        const el = indicators.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = e.clientY - (box.top + DISTANCE_OFFSET);
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            {offset: Number.NEGATIVE_INFINITY,
                element: indicators[indicators.length - 1],
            }
        );
        return el;
    }

    const highlightIndicator = (e)=>{
        const indicators = getIndicators();
        clearHighlights(indicators);
        const el = getNearestIndicator(e, indicators);
        el.element.style.opacity = "1";
    }
    
    const getIndicators = () => {
        return Array.from(document.querySelectorAll(`
            [data-column="${column}"]
            `));
    };
    

    return (
        <div className='h-screen flex flex-col px-5 py-1'
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}>
             {filteredCards.map((item) => 
                {return <Card key={item.id}{...item}handleDragStart={handleDragStart} setCards={setCards}/>})}
                <AddCard column={"240917"} setCards={setCards} />
        </div>
    )
}

const Card = ({title, id, column, handleDragStart, setCards})=>{
    const handleChange = (e) => {
        const cardId = id;

        setCards((pv) => pv.filter((c) => c.id !== cardId));
}  

    return (
        <>  
                <DropIndicator beforeId={id} column={column} />
                <div className="flex flex-row gap-3 px-9" draggable="true"
                 onDragStart={(e) => handleDragStart(e, { title, id, column })}>
                <input type="radio" onChange={handleChange} className='h-5 w-5'></input>
                <p className='text-base align-text-top font-normal text-black'>
                    {title}
                </p>
            </div>
        </>
    )
}


const AddCard = ({column, setCards}) => {
    const [adding, setAdding] = useState(false);
    const [text, setText] = useState("");

    const auto_grow = (e) => {

        const element = e.currentTarget;
        element.style.height = (element.scrollHeight) + "px";
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!text.trim().length) return;

        const newCard = {
            column,
            title: text.trim(),
            id: Math.random().toString(),
        };

        setCards((pv) => [...pv, newCard]);
    }

    return <>
        { adding ? <form className="w-full h-32 border border-gray-500 rounded relative"
                    onSubmit={handleSubmit}
                    >
                    <textarea onChange={(e) => setText(e.target.value)} className="resize-none w-full h-5 focus:outline-none font-bold" placeholder='Title' onInput={auto_grow}></textarea>
                    <textarea className="resize-none w-full h-5 focus:outline-none" placeholder='description' onInput={auto_grow}></textarea>
                    <button className="absolute right-10 bottom-1 p-1 rounded  text-gray-300 bg-gray-200 hover:text-gray-400 hover:bg-gray-300"
                        onClick={() => setAdding(false)}
                    >
                        <CloseIcon className='font-light'></CloseIcon>
                    </button>
                    <button type="submit" className="absolute right-1 bottom-1 p-1 rounded bg-orange-500 text-white hover:bg-orange-700">
                        <SendIcon></SendIcon>
                    </button>
                   </form> : <motion.button layout onClick={() => setAdding(true)} 
            className='flex w-full items-center gap-1.5 border-t
            px-8 py-1.5 text-xs text-gray-400 transition-colors 
            hover:text-gray-500 hover:text-orange-600 group hover:rounded-xl
            '><AddIcon className="h-5 w-5 text-orange-600 group-hover:bg-orange-600 group-hover:text-white group-hover:rounded-xl"></AddIcon>Add task
            </motion.button>
    }
        </>
    
}
const DEFAULT_CARDS = [{title: "Complete this todo", id: "1", column: "240916" },
    {title: "Implement drag and drop feature", id: "2", column: "240916" },
    {title: "Something to fill", id: "3", column: "240914" }
]