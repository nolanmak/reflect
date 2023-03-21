import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import RunWay from "./pages/RunWay";
import Edi from "./pages/Edi";
import StoryBoard from "./pages/StoryBoard";
import Home from './pages/Home';
import Main from './pages/Main';
import Quotes from './pages/Quotes';
import TopicComponent from "./components/TopicComponent"
import NavBar from './components/NavBar';
import RouteTranzitionz from './components/routeTranzitionz';
import React, { useState, useEffect} from 'react';
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createEntry} from './graphql/mutations.js';
import { listEntries } from './graphql/queries.js';


function App() {


  return (
    <>
      <Router>
        <RouteTranzitionz/>
        <NavBar />
      </Router>
       </>
  );
}
export default App;
