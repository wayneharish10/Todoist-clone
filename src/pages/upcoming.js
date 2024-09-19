import React from 'react';
import Header from '../components/header';
import Calendar from '../components/calendar';
// import Calendar from '../components/calendarc';
import { getDays } from '../util';
import GlobalContext from '../context/globalcontext';
import { useState, useEffect, useContext } from 'react';

function Upcoming() {

    const [currentDay, setDay] = useState(getDays());
    const { dayIndex } = useContext(GlobalContext);
  
    useEffect(()=>{
      setDay(getDays(dayIndex));
    }, [dayIndex]);

    return (
        //   <div className="h-screen flex flex-col flex-wrap ">
              <div className = "flex flex-1 overflow-hidden">
                <div className='flex flex-col basis-full'>
                <Header />
                <Calendar daylist = {currentDay}/>
                </div>
              </div>     
        //   </div>
        );
}

export default Upcoming;