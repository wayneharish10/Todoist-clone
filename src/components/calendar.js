import React from 'react';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';


export default function Calendar({daylist}) {
    const today = "Today"; 
    const todate = dayjs(new Date()).format('YYMMDD').toString();

    
    return (
        <div className="w-full flex flex-row items-top align-center text-xs h-svh">
             <Board dayList={daylist} />
        </div>

        
    )

}
    const Board = ({dayList}) =>{
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
            <div className = 'w-full flex flex-row gap-3'>
                {dayList.map((item)=> <Column title = {item} headingColor="text-black"
                 column= {`${item.format('YYMMDD').toString()}`}
                 cards={cards}
                 setCards={setCards}/>)}
            </div> 

        )
    };

    const DropIndicator = ({ beforeId, column }) =>{
        return (
            
            <div 
                data-before={beforeId || -1}
                data-column={column}
                className={`h-1 w-full bg-gray-200 opacity-0
                }`}>

                </div>
        )
    }

    
    const Column = ({title, headingColor, column, cards, setCards}) => {

        const handleDragStart = (e, card) => {
            e.dataTransfer.setData("cardId", card.id);
            
        };

       
        const handleDragLeave = () => {
            clearHighlights();
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
      cardToTransfer = { ...cardToTransfer, column };
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

        const highlightIndicator = (e)=>{
            const indicators = getIndicators();
            clearHighlights(indicators);
            const el = getNearestIndicator(e, indicators);
            el.element.style.opacity = "1";
        }

        const clearHighlights = (els)=>{
            const indicators = els || getIndicators();

            indicators.forEach(element => {
                element.style.opacity = "0";
            });
        }

        const handleDragOver = (e) => {
            e.preventDefault();
            highlightIndicator(e);           
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

        
        const getIndicators = () => {
            return Array.from(document.querySelectorAll(`
                [data-column="${column}"]
                `));
        };

        const filteredCards = cards.filter((c)=> c.column === column);

        return (
        
        <div className='w-56 shrink-0'>
            <div className="mb-3 flex items-center justify-start p-2.5">
                <h3 className={`font-bold ${headingColor} mr-2`}>
                    {title.format("D")} {title.format("MMM")} - {title.format("dddd")}
                </h3>
                <span className="rounded text-sm text-neutral-400">{filteredCards.length}</span>
            </div>
            <div 
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`h-full w-full transition-colors} pl-5 overflow-y`}>
                {filteredCards.map((c) => {
                    return <Card key={c.id} {...c} setCards={setCards} handleDragStart={handleDragStart}/>;
                })}
                <DropIndicator beforeId={null} column={column} />
                <AddCard column={column} setCards={setCards} />
            </div>
        </div>
        )
    }

    const Card = ({title, id, column, handleDragStart, setCards}) => {

        const handleChange = (e) => {
                const cardId = id;

                setCards((pv) => pv.filter((c) => c.id !== cardId));
        }   

        return (
            <>
                <DropIndicator beforeId={id} column={column} />
                <motion.div 
                layout
                layoutId={id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, { title, id, column })}
                className= "flex gap-1 cursor-grab rounded border border-gray-500 p-3 active:cursor-grabbing">
                    <input type="radio" className="h-5 w-5" onChange={handleChange}></input>
                    <p className='text-xs shrink break-all hyphens-auto align-text-top font-normal text-black'>
                        {title}
                    </p>
                </motion.div>
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
            { adding ? <form className="w-full h-32 border border-gray-500   rounded relative"
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
                className='flex w-full items-center gap-1.5
                px-3 py-1.5 text-xs text-gray-400 transition-colors 
                hover:text-gray-500 hover:text-orange-600 group hover:rounded-xl
                '><AddIcon className="text-orange-600 group-hover:bg-orange-600 group-hover:text-white group-hover:rounded-xl"></AddIcon>Add task
                </motion.button>
        }
            </>
        
    }


const DEFAULT_CARDS = [{title: "Complete this todo", id: "1", column: "240915" },
    {title: "Implement drag and drop feature", id: "2", column: "240915" },
    {title: "Something to fill", id: "3", column: "240914" }


]
