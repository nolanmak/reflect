import { useState, useEffect, Image } from "react";
import awsExports from "../aws-exports";
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createEntry } from '../graphql/mutations.js';
import { listEntries } from '../graphql/queries.js';
import config from '../aws-exports';
import '../App.css'
import { motion, AnimatePresence } from "framer-motion";


Amplify.configure(awsExports);

export default function RunWay() {

  const [listAppSynch, setListAppSynch] = useState([]); // AWS AMP
  const [entryData, setEntryData] = useState([])
  const [topicArray, setTopicArray] = useState([])
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetch()
  }, [])

  async function fetch() {
    try {
      const entryData = await API.graphql(graphqlOperation(listEntries))
      if (entryData) {
        const entryVar = entryData.data.listEntries.items  /// Turn to array of objects
        setListAppSynch(entryVar)
        let arrayObj = [entryVar]
        setEntryData(arrayObj.sort((a, b) => a.topic.toLowerCase() > b.topic.toLowerCase() ? 1 : -1))
        // Use Set to get unique topics
        const topics = [...new Set(entryVar.map(entry => entry.topic))];
        console.log("Array of Uniqe topics:", topics)
        setTopicArray(topics)
        console.log("topics", topics)
        // Create an object with keys for each topic
        // const topicArrays = {};
        // topics.forEach(topic => {
        //   topicArrays[topic] = entryVar.filter(entry => entry.topic === topic);
        // });
        // console.log("WHOLE THANG:", topicArrays)
      }
    } catch (err) { console.log(err) }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////

  // Function to redirect the user to the desired URL on click
  const redirect = (topic) => {
    setIsVisible(true);
    setTimeout(() => {
      // Redirect the user to the URL corresponding to the topic
      window.location.href = `http://localhost:3000/${topic.toLowerCase()}`;
    }, 1000)
  } // 1 sec delay

  const date = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("index", index);
  }

  const handleDrop = (event, index) => {
    const draggedIndex = event.dataTransfer.getData("index");
    const newTopicArray = [...topicArray];
    newTopicArray.splice(index, 0, newTopicArray.splice(draggedIndex, 1)[0]);
    setTopicArray(newTopicArray);
  }

  const handleDragOver = (event) => {
    event.preventDefault();
  }

  ///////////////////////////////////////////////////////////////////////////
  /////TEST ON MOBILE!!!!!!!! 
  const [data, setData] = useState({});
  const handleTouchStart = (event, index) => {
    // event.dataTransfer.setData("index", index);
    // event.dataTransfer.setData("touch", true);
    setData({ index, touch: true });
  }

  const handleTouchEnd = (event, index) => {
    if (data.touch) {
      const draggedIndex = data.index;
      const newTopicArray = [...topicArray];
      newTopicArray.splice(index, 0, newTopicArray.splice(draggedIndex, 1)[0]);
      setTopicArray(newTopicArray);
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  ///Hover
  const [hoverIndex, setHoverIndex] = useState(-1);
  return (
    <div>

      <AnimatePresence initial={false} exitBeforeEnter={true}>
        {isVisible && (
          <motion.div
            key="modal"
            initial={{ background: "transparent", y: "100%" }}
            animate={{ background: "linear-gradient(to bottom, grey, teal)", y: "0%" }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut" }}
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 9999
            }}
          />
        )}
      </AnimatePresence>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          justifyContent: "left",
          flex: 1,
        }}>
        <div style={{ display: 'flex', flexWrap: "wrap", justifyContent: 'center' }}>
          <h3 style={{ margin: '0', }}>{formattedDate} </h3>
          {topicArray.map((topic, index) => (
            <button key={index}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(-1)}
              draggable
              onDragStart={(event) => handleDragStart(event, index)}
              onDrop={(event) => handleDrop(event, index)}
              onDragOver={handleDragOver}
              onTouchStart={(event) => handleTouchStart(event, index)}
              onTouchEnd={(event) => handleTouchEnd(event, index)}
              style={{
                borderRadius: "14px",
                height: `calc(100vh / ${topicArray.length + 1})`,
                width: "90vw", margin: 0, padding: 0,
                background: "linear-gradient(to bottom, grey, teal)",
                border: "0.5vh solid white",
                opacity: hoverIndex === index ? '0.75' : '1',
              }}
              onClick={() => redirect(topic)} >
              <a href="#" style={{
                color: "white", fontSize: `calc(15vw / ${topicArray.length + 1})`,
                textDecoration: 'none',
              }}
              > {topic}</a>

            </button>
          ))
          }
        </div>
      </div>
    </div>
  )
}
