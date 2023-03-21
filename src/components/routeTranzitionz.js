import { Routes, Route, useLocation } from "react-router-dom"
import RunWay from "../pages/RunWay";
import Edi from "../pages/Edi";
import StoryBoard from "../pages/StoryBoard";
import Home from '../pages/Home';
import Main from '../pages/Main';
import Playground from '../pages/PlayGround'
import Quotes from '../pages/Quotes';
import TopicComponent from "./TopicComponent"
import React, { useState, useEffect } from 'react';
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createEntry } from '../graphql/mutations.js';
import { listEntries } from '../graphql/queries.js';
import { AnimatePresence, AnimateSharedLayout } from "framer-motion";

function RouteTranzitionz() {
  const location = useLocation();
  const [topicState, setTopicState] = useState([])
  useEffect(() => {
    fetch()
  }, [])

  async function fetch() {
    try {
      const entryData = await API.graphql(graphqlOperation(listEntries))
      const entryVar = entryData.data.listEntries.items  /// Turn to array of objects



      // Use Set to get unique topics
      const topics = [...new Set(entryVar.map(entry => entry.topic))];
      setTopicState(topics);
    } catch (err) { console.log(err) }
  }


  return (
    <AnimateSharedLayout type="crossfade">
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          {topicState.map(topic => (
            <Route
              key={topic}
              path={`/${topic}`}
              element={<TopicComponent topic={topic} />} /*  map over the topics array to create a Route component for each topic. 
                                                         provide a unique path for each Route and pass in the corresponding component
                                                         to be rendered for that route as the element prop */
            />
          ))}
          <Route path="/RunWay" element={<RunWay />} />
          <Route path="/Edi" element={<Edi />} />
          <Route path="/StoryBoard" element={<StoryBoard />} />
          <Route path="/Quotes" element={<Quotes />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Main" element={<Main />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </AnimatePresence>
    </AnimateSharedLayout>
  )
}
export default RouteTranzitionz; 