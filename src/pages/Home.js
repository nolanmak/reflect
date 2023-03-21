
import React, { useState, useEffect } from "react";
import awsExports from "../aws-exports";
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createEntry } from '../graphql/mutations.js';
import { listEntries } from '../graphql/queries.js';
import config from '../aws-exports';
import { Editor } from '@tinymce/tinymce-react';
import logo from '../images/greyLogo.jpg'
import GoalPortal from "../components/GoalPortal.js"
import Modal from "../components/Modal.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faGear } from '@fortawesome/free-solid-svg-icons';
// import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'
// <script src="https://kit.fontawesome.com/07a5ef383a.js" crossorigin="anonymous"></script>
Amplify.configure(awsExports);

export default function Home() {
  const [entries, setEntries] = useState([]); // AWS AMP
  const [totalEntrys, setTotalEntrys] = useState()
  const [topEntries, setTopEntries] = useState()
  const [topDatez, setTopDatez] = useState()
  const [bookmarks, setBookmarks] = useState()
  const [bookmarkDate, setBookmarkDate] = useState()
  const [journaldata, setJournalData] = useState()
  const [fetchCount, setFetchCount] = useState(0);
  const [entryPerTopic, setEntryPerTopic] = useState({})

  useEffect(() => {
    if (fetchCount < 2) {
      fetch();
      console.log("useEffect", setFetchCount(fetchCount + 1));

    }
  }, [topEntries])

  async function fetch() {
    try {
      const entryData = await API.graphql(graphqlOperation(listEntries))
      if (entryData) {
        const entryVar = entryData.data.listEntries.items
        let arrayObj = [entryVar]
        const entryObject = entryVar.reduce((count, entry) => {
          count[entry.topic] = (count[entry.topic] || 0) + 1;
          return count;
        }, {});
        setEntryPerTopic(entryObject)
        console.log("ENTRY Object", entryObject)
        let totalEntries = entryVar.length
        setTotalEntrys(totalEntries)
        setEntries(entryVar)  //////////////////////////////////////////////////May Need to break this fetch function up After setEntries(entryVar)
        const bookmarkedEntries = entries.filter(entry => entry.bookmarked);
        setBookmarks(bookmarkedEntries)
        const mostRecentEntries = Array.from(entries).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        setTopEntries(mostRecentEntries)
        console.log("TOP ENTRIES SET !!!")
        const latestDatez = [...new Set(mostRecentEntries ///date array
          .map(item => item.createdAt))];
        const bookmarkedDatez = [...new Set(bookmarkedEntries.map(item => item.createdAt))]
        ///////////////////////////////////////////////////////////format dates
        const latestSlicedDatez = latestDatez.map(date => date.slice(0, -14));
        const latestFormattedDatez = latestSlicedDatez.map(date => {
          const [year, month, day] = date.split("-");
          return `${month}/${day}/${year}`;
        });
        const bookmarkFormattedDatez = bookmarkedDatez.map(date => {
          const d = new Date(date);
          const year = d.getFullYear();
          const month = (d.getMonth() + 1).toString().padStart(2, '0');
          const day = d.getDate().toString().padStart(2, '0');
          return `${month}/${day}/${year}`;
        })
        setBookmarkDate(bookmarkFormattedDatez)
        ///////////////////////////////////////////////////////////////////order dates
        let latestOrderedDatez = latestFormattedDatez.sort((a, b) => {
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
        setTopDatez(latestOrderedDatez)
      }

    } catch (err) { console.log(err) }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///Hover
  const [hoover, setHoover] = useState(false)
  const handleMouseEnter = () => {
    setHoover(true)
  }
  const handleMouseLeave = () => {
    setHoover(false)
  }

  //HOVER Adjacent button
  const [adjacentHoover, setAdjacentHoover] = useState(false)
  const adjacentHandleMouseEnter = () => {
    setAdjacentHoover(true)
  }
  const adjacentHandleMouseLeave = () => {
    setAdjacentHoover(false)
  }

  //HOVER Adjacent button #2
  const [adjacentHoover2, setAdjacentHoover2] = useState(false)
  const adjacentHandleMouseEnter2 = () => {
    setAdjacentHoover2(true)
  }
  const adjacentHandleMouseLeave2 = () => {
    setAdjacentHoover2(false)
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Goal Streak Pop up
  const [openModal, setOpenModal] = useState(false);
  /////////Entry per Topic Banner
  function TopicHeadings({ object }) {
    const [topics, setTopics] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
      // Get the list of topics sorted by count
      const sortedTopics = Object.keys(object)
        .filter(topic => topic !== 'Topic')
        .sort((a, b) => object[b] - object[a]);

      // Set the initial list of topics to display
      setTopics(sortedTopics.slice(index, index + 2));

      // Rotate the list of topics every 3 seconds
      const interval = setInterval(() => {
        const newIndex = (index + 2) % sortedTopics.length;
        setTopics(sortedTopics.slice(newIndex, newIndex + 2));
        setIndex(newIndex);
      }, 3000);

      // Clean up the interval when the component unmounts
      return () => clearInterval(interval);
    }, [object, index]);

    const headings = topics.map(topic => {
      const count = object[topic];
      return <h6 style={{
        margin: '0',
      }} key={topic}>{`${topic} (${count}) `}</h6>;
    });
    const containerStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'left', // Add this line to align the banner to the left
      height: '30px',
      overflow: 'hidden',
    };

    return <div style={containerStyle}>{headings}</div>;
  }

  return (
    <div>
      <div style={{
        backgroundColor: "grey",
        borderRadius: "2px",
        border: "2px solid black",
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <h3 style={{ margin: '0' }}>Total Entries: {totalEntrys}  </h3>
        <TopicHeadings object={entryPerTopic} />
        <div style={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <FontAwesomeIcon icon={faGear}
            style={{
              margin: '0', padding: 0, width: "25px",
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', lineHeight: '50px', height: "25px",
              opacity: hoover ? '0.75' : '1'
            }} />
          <FontAwesomeIcon icon={faBullseye} onClick={() => {
            setOpenModal(true)
          }}
            style={{
              margin: '0', padding: 0, width: "25px",
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', lineHeight: '50px', height: "25px",
              opacity: hoover ? '0.75' : '1'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave} />
          {openModal && <Modal closeModal={setOpenModal} />}
        </div>
      </div>

      {/* <div style={{ backgroundColor: "grey", borderRadius: "2px", border: "2px solid black" }}>
        <h3 style={{ margin: '0' }}>Total Entries: {totalEntrys}  </h3>
        <FontAwesomeIcon icon={faGear} />
        <FontAwesomeIcon icon={faBullseye} onClick={() => {
          setOpenModal(true)
        }}
          style={{
            margin: '0', padding: 0, width: "25px",
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', lineHeight: '50px', height: "25px",
            opacity: hoover ? '0.75' : '1'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave} />
        {openModal && <Modal closeModal={setOpenModal} />}
      </div> */}

      <div style={{ left: "50%", textAlign: "center" }}>
        <img src={logo} alt="Grey Logo" style={{
          display: "block",
          margin: "0 auto",
          width: "150px",
          height: "150px",
          // position: "absolute",
          top: "0",
          left: "50%",
          //transform: "translateX(-50%)",
          zIndex: "10000"
        }} />
        <h1 style={{ margin: '0', fontFamily: 'fantasy' }}>Journal Stats</h1>
      </div>

      <div style={{ backgroundColor: "silver", borderRadius: "2px", border: "2px solid black" }}>
        <h2 style={{ margin: '0' }}>
          {topEntries && topEntries.length > 0 ? "Most Recent" : " "}
        </h2>
        {topEntries ? topEntries.map((entry, index) => (
          <div key={index} className="topEntries">
            <h3 style={{ margin: '0' }} >  Date: {topDatez[index]}</h3>
            {entry.title && <h3 style={{ margin: '0' }}> Title: {entry.title} </h3>}
            <h3 style={{ margin: '0' }}> Topic: {entry.topic} </h3>
            <Editor
              apiKey='2qndeo03c25ouw6zbygzsk310xifzv7i8042ie3u1zq00iev' //// Protect your API key!!!!!!
              disabled={true}
              inline={false}
              init={{
                resize: false,
                skin: 'oxide-dark',
                content_css: 'dark',
                selector: "#storyEdi",
                height: 250,
                menubar: false,
                placeholder: "Whats on your mind?",
                init_instance_callback: function (editor) {
                  editor.setContent(entry.content);
                },
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: false,
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>
        )) : null}
      </div>
      <div style={{ backgroundColor: "silver", borderRadius: "2px", border: "2px solid black" }}>
        <h2 style={{ margin: '0' }}>
          {bookmarks && bookmarks.length > 0 ? "Bookmarks" : " "}
        </h2>
        {bookmarks ? bookmarks.map((entry, index) => (
          <div key={index} className="bookmarks">
            <h3 style={{ margin: '0' }} >  Date: {bookmarkDate[index]}</h3>
            {entry.title && <h3 style={{ margin: '0' }}> Title: {entry.title} </h3>}
            <h3 style={{ margin: '0' }}> Topic: {entry.topic} </h3>
            <Editor
              apiKey='2qndeo03c25ouw6zbygzsk310xifzv7i8042ie3u1zq00iev' //// Protect your API key!!!!!!
              disabled={true}
              inline={false}
              init={{
                resize: false,
                skin: 'oxide-dark',
                content_css: 'dark',
                selector: "#storyEdi",
                height: 250,
                menubar: false,
                placeholder: "Whats on your mind?",
                init_instance_callback: function (editor) {
                  editor.setContent(entry.content);
                },
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: false,
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>
        )) : null}
      </div>
    </div>
  )
}



