import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import Layout from './pages/layout';
import Today from './pages/today';
import Upcoming from './pages/upcoming';
import { getDays } from './util';
import GlobalContext from './context/globalcontext';


function App() {  

  // return (
  //   <div className="h-screen flex flex-col flex-wrap ">
  //       <div className = "flex flex-1 overflow-hidden">
  //         <Sidebar />
  //         <div className='flex flex-col basis-full'>
  //         <Header />
  //         <Calendar daylist = {currentDay}/>
  //         </div>
  //       </div>     
  //   </div>
  // );

  return (
      <BrowserRouter>
          <div className="h-screen flex flex-col flex-wrap">
          <Routes>
              <Route path="/" element={ <Layout/> } >
                <Route index element={ <Today/> } />
                <Route path="upcoming" element={ <Upcoming/>} />
              </Route>
            </Routes>
          </div>
       
      </BrowserRouter>
  )
}

export default App;
