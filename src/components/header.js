import React, { useContext, useRef, useEffect} from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GlobalContext from '../context/globalcontext';
import dayjs from 'dayjs';

export default function Header() {

    const left = useRef();
    const { dayIndex, setDayIndex } = useContext(GlobalContext);
    useEffect(()=>{
        if(dayIndex > dayjs().date()){
            left.current.className = "cursor-pointer text-gray-500"
        } else {
            left.current.className =  "cursor-pointer text-gray-200"
        }
    }, [dayIndex]);
    function handlePrevDay() {
        if(dayIndex > dayjs().date()) {
            setDayIndex(dayIndex - 1);
        }
    }
    function handleNextDay() {
        setDayIndex(dayIndex + 1);
    }
    function setToday(){
        setDayIndex(dayjs().date());
    }
    return ( 
        <div className='p-5'>
            <h1 className='font-bold p-2.5'>Upcoming</h1>
            {/* <button className='h-4 cursor-pointer text-gray-500' ref={left} onClick={handlePrevDay}>&#x2039;</button> */}
            <button className='cursor-pointer text-gray-500 disabled:text-gray-200' ref={left} onClick={handlePrevDay}>
                <ChevronLeftIcon></ChevronLeftIcon>
            </button>
            <button className='rounded' onClick={setToday}>Today</button>
            <ChevronRightIcon className='cursor-pointer text-gray-500' onClick={handleNextDay}></ChevronRightIcon>
        </div>
        )
}
