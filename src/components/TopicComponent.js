import React, { useState, useEffect } from 'react';
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createEntry, updateEntry } from '../graphql/mutations.js';
import { listEntries } from '../graphql/queries.js';
import { deleteEntry } from '../graphql/mutations.js';
import { StoryEdi } from "./StoryEdi"
import { Editor } from '@tinymce/tinymce-react';
import { motion, AnimatePresence } from "framer-motion";
import logo from '../images/greyLogo.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
////Note this more of page than it is a components but it's already in the commponent folder so whatever :)

export default function TopicComponent({ topic }) {
  const [entry, setEntry] = useState([])
  const [topicRender, setTopicRender] = useState([])
  const [dateRender, setDateRender] = useState([])
  const [update, setUpdate] = useState([])
  const [IDs, setIDs] = useState([])
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetch()
  }, [update])

  async function fetch() {
    try {
      const entryData = await API.graphql(graphqlOperation(listEntries))
      const entryVar = entryData.data.listEntries.items  /// Turn to array of objects 
      const entries = entryVar.filter(item => item.topic === topic);  // filter array to return only entries matchN topic prop.
      console.log("YES", entryVar)
      let orderedEntries = entries.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
      console.log("order", orderedEntries)
      setEntry(orderedEntries)    ///////////// Set Entries! 

      console.log("This is the entry array", entries)
      let renderTopic = entries[0].topic
      setTopicRender(renderTopic)

      const datez = [...new Set(entryVar.filter(item => item.topic === topic)
        .map(item => item.createdAt))];
      const slicedDatez = datez.map(date => date.slice(0, -14));
      const formattedDatez = slicedDatez.map(date => {
        const [year, month, day] = date.split("-");
        return `${month}/${day}/${year}`;
      });
      let orderedDatez = formattedDatez.sort((a, b) => {
        // Split the dates into their individual parts
        let [aMonth, aDay, aYear] = a.split("/");
        let [bMonth, bDay, bYear] = b.split("/");

        // Convert the parts to integers for comparison
        aYear = parseInt(aYear, 10);  //The 10 argument specifies that the string should be interpreted as a base-10 number.
        bYear = parseInt(bYear, 10);
        aMonth = parseInt(aMonth, 10);
        bMonth = parseInt(bMonth, 10);
        aDay = parseInt(aDay, 10);
        bDay = parseInt(bDay, 10);

        // Compare the years
        if (aYear > bYear) {
          return -1;
        } else if (aYear < bYear) {
          return 1;
        }

        // If the years are equal, compare the months
        if (aMonth > bMonth) {
          return -1;
        } else if (aMonth < bMonth) {
          return 1;
        }

        // If the months are equal, compare the days
        if (aDay > bDay) {
          return -1;                  /// Each if statement returns negative values for dates that should be placed before the second element.
        } else if (aDay < bDay) {
          return 1;
        }

        // If the dates are equal, return 0
        return 0;
      });
      setDateRender(formattedDatez)
      console.log("formattedDATEZ", formattedDatez)
      console.log("orderedDatez", orderedDatez)
      console.log("YOO", entry)
      //////////////////////////////////
      let entryIDs = entries.map(entry => entry.id);
      setIDs(entryIDs)
      console.log("IDS!", entryIDs)
    } catch (err) { console.log(err) }

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Delete
  let customHTML = document.createElement('div');
  customHTML.textContent = 'Are you sure you want to continue?';
  const handleTopicDelete = async item => { /// add alert!!!!
    try {
      const answer = window.confirm("Are you sure? This action can not be undone");
      if (answer === true) {
        setIsVisible(true);
        await item.forEach(async (id, index) => {
          const input = { id: item[index] };
          const result = await API.graphql(
            graphqlOperation(deleteEntry, { input })
          );
        })
        setTimeout(() => {
          window.location.href = `http://localhost:3000/RunWay`;
        }, 1000); // set a delay for 1s before redirecting to next page 
      }
    } catch (err) {
      console.error('Error deleting entry', err);
    }
  }

  const handleEntryDelete = async item => {
    try {
      const answer = window.confirm("Are you sure? This action can not be undone");
      if (answer === true) {
        setIsVisible(true);
        const input = { id: item.id };
        const result = await API.graphql(
          graphqlOperation(deleteEntry, { input })
        );
        console.log(`Item with id ${result.data.deleteEntry.id} was deleted`);
        // Remove the item from the entries array in the state
        const updatedEntries = entry.filter(entry => entry.id !== item.id);
        setEntry(updatedEntries);
        // setUpdate(updatedEntries);
        setUpdate(Math.random());
        console.log("set UPDATE!!!")
        if (IDs.length > 1) {
          setTimeout(() => {
            window.location.replace(`http://localhost:3000/${topic.toLowerCase()}`)
          }, 1000); // set a delay for 1s before redirecting to next page
        } else {
          setTimeout(() => {
            window.location.href = `http://localhost:3000/RunWay`;
          }, 1000); // set a delay for 1s before redirecting to next page
        }
      }
    } catch (err) {
      console.error('Error deleting entry', err);
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  /// Update and bookmark
  function handleCheckboxChange() {
    const updatedEntry = { ...entry, bookmarked: !entry.bookmarked };
    setEntry(updatedEntry)
    API.graphql(
      graphqlOperation(updateEntry, {
        input: {
          content: entry.content,
          topic: entry.topic,
          bookmarked: updatedEntry.bookmarked,
        },
        condition: { id: { eq: entry.id } }
      })
    ).then((result) => console.log(result))
      .catch((error) => console.log(error));
  }




  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  ///Hover
  const [hoover, setHoover] = useState(false)
  const [hoverIndex, setHoverIndex] = useState(-1);
  const handleMouseEnter = () => {
    setHoover(true)
  }
  const handleMouseLeave = () => {
    setHoover(false)
  }

  //////Dynamic Edi height
  // let height = entry.content.lenght + 120
  // console.log(height)
  return (
    <div>
      <div style={{ left: "50%", justifyContent: "center", textAlign: "center", backgroundColor: " rgb(30, 140, 159)", }}>
        <img src={logo} alt="Grey Logo" style={{
          display: "block",
          margin: "0 auto",
          width: "150px",
          height: "150px",
          top: "0",
          left: "50%",
          // zIndex: "10000"
        }} />
        <h1 style={{ margin: "0", fontFamily: 'fantasy', justifyContent: 'center' }}> Storyboard  </h1>
      </div>
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
      <h3 style={{ margin: '0', backgroundColor: "silver", borderRadius: "2px", border: "2px solid black" }} >Topic: {topicRender}</h3>
      <div style={{ backgroundColor: "grey", borderRadius: "2px", border: "2px solid black" }}>
        {entry.length === 0 ? (
          <p>Loading...</p>
        ) : (
          entry.map((entry, index) => {
            const handleCheckboxChange = () => {
              const updatedEntry = { ...entry, bookmarked: !entry.bookmarked };
              API.graphql(
                graphqlOperation(updateEntry, {
                  input: {
                    id: entry.id,
                    title: entry.title,
                    content: entry.content,
                    topic: entry.topic,
                    bookmarked: updatedEntry.bookmarked,
                  },
                })
              ).then((result) => console.log(result))
                .catch((error) => console.log(error));
              setEntry((entries) => {
                const updatedEntries = [...entries];
                updatedEntries[index] = updatedEntry;
                return updatedEntries;
              });
            };

            return (
              <div key={index}>
                <h3 style={{ margin: '0' }} >  Date: {dateRender[index]}</h3>
                {entry.title && <h3 style={{ margin: '0' }}> Title: {entry.title} </h3>}
                <div style={{ display: 'flex', alignItems: 'center' }}>

                  <FontAwesomeIcon
                    onClick={() => handleEntryDelete(entry)}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(-1)}
                    icon={faTrashCan}
                    style={{
                      margin: '0', display: 'inline-block',
                      padding: 0,
                      width: '25px', height: "25px",
                      opacity: hoverIndex === index ? '0.60' : '1',
                    }}
                  />
                  <label style={{ display: "flex", alignItems: "center" }}>Bookmark
                    <FontAwesomeIcon
                      icon={entry.bookmarked === true ? faToggleOn : faToggleOff}
                      style={{ width: "25px", height: "25px" }}
                      onClick={handleCheckboxChange}
                    />
                  </label>
                </div>
                <Editor
                  apiKey='2qndeo03c25ouw6zbygzsk310xifzv7i8042ie3u1zq00iev'
                  disabled={true}
                  inline={false}
                  init={{
                    resize: false,
                    selector: "#storyEdi",
                    height: 500,
                    menubar: false,
                    placeholder: "What's on your mind?",
                    init_instance_callback: function (editor) {
                      editor.setContent(entry.content);
                    },
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link',
                      'image', 'charmap', 'preview', 'anchor',
                      'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code',
                      'help', 'wordcount'
                    ],
                    toolbar: false,
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                />


              </div>
            );
          })
        )}

        <button
          onClick={() => handleTopicDelete(IDs)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            height: `50px`,
            width: "95vw", margin: 0, padding: 0,
            background: "linear-gradient(to bottom, grey, black)",
            border: "0.5vh solid black", display: 'flex',
            alignItems: 'center', justifyContent: 'center', lineHeight: '50px',
            opacity: hoover ? '0.75' : '1'
          }}
        > Delete Topic  <a href="#" style={{
          color: "white",
          textDecoration: 'none',
        }}> </a> </button>
      </div>
    </div>);

}
