import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { div } from 'framer-motion/client';
import GlobalContext from '../context/globalcontext';

export default function Layout() {
    const [ cards, setCards ] = useState([])
    const [ hasChecked, setHasChecked ] = useState(false);
    const todate = dayjs(new Date()).format('YYMMDD').toString();

    useEffect(() => {
        hasChecked && localStorage.setItem("cards" , JSON.
            stringify(cards));
    }, [cards]);

    useEffect(() => {
        const cardData = localStorage.getItem("cards");
        setCards(cardData ? JSON.parse(cardData) : []); 

        setHasChecked(true);

    }, []);

    const Button = ({column, setCards})=>{
        const [ adding, setAdding ] = useState(false);
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

            console.log(cards);
            setCards((pv) => [...pv, newCard]);
        }

        return (
            <>
                {adding ? 
                <form className="w-1/4 h-32 border border-black rounded absolute"
                    onSubmit={handleSubmit}>
                    <textarea onChange={(e) => setText(e.target.value)} 
                    className="resize-none w-full h-5 focus:outline-none font-bold" 
                    placeholder='Title' onInput={auto_grow}></textarea>
                    <button className="absolute right-10 bottom-1 p-2
                    rounded  text-gray-300 bg-gray-200 hover:text-gray-400 hover:bg-gray-300"
                    onClick={() => setAdding(false)}>
                    Cancel
                    </button>

                    <button type="submit" className="absolute right-1 
                    bottom-1 p-2 rounded bg-orange-500 text-white hover:bg-orange-700">
                    Add Task                            
                    </button>
                </form> :                
                <button onClick={() => {setAdding(true)}}>
                <AddIcon></AddIcon> Add Task
                </button>
                }   
            </>
        )
    }

    return ( 
        <div className="h-screen flex flex-col flex-wrap">
            <div className = "flex flex-1 overflow-hidden">
                <ul className="border p-3 px-1.5 w-1/4 flex flex-col items-left">
                    <li className="py-2.5 px-1.5 hover:bg-gray-200">
                    <Button column={"240917"} setCards={setCards}/>
                    </li>
                    <li className="py-2.5 px-1.5 hover:bg-gray-200"><Link to="/">
                        <CalendarTodayIcon className="text-gray-600 active:text-orange-600 mr-1"></CalendarTodayIcon>Today</Link>
                    </li>
                    <li className="py-2.5 px-1.5 hover:bg-gray-200"><Link className="active:text-orange-600"to="/upcoming">
                        <CalendarMonthIcon className="text-gray-600 mr-1">
                        </CalendarMonthIcon>Upcoming</Link></li>
                </ul>
                <div className='flex flex-col basis-full'>
                    <Outlet/>
                </div>
            </div>
        </div>
        )

}
