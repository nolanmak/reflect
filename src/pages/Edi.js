import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import awsExports from "../aws-exports";
import '@aws-amplify/ui-react/styles.css';
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createEntry } from '../graphql/mutations.js';
import { listEntries } from '../graphql/queries.js';
import config from '../aws-exports';
import Select from 'react-select';
import { motion, AnimatePresence } from "framer-motion";
import journal from '../images/journal.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
//import { tinymce } from 'tinymce'
//import {tinymce, selection, activeEditor } from '@tinymce/tinymce-react' //"https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js"  //// selection, activeEditor, get
// old link 'https://cdn.tiny.cloud/1/qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc/tinymce/6/tinymce.min.js'
Amplify.configure(awsExports);
const initialState = { content: '', title: '', topic: '' }


export default function App() {
  const [formState, setFormState] = useState(initialState) // AWS AMP
  const [entryContent, setEntryContent] = useState([]); // AWS AMP
  const [listAppSynch, setListAppSynch] = useState([]); // AWS AMP
  const [topicArray, setTopicArray] = useState([])
  const [optionArray, setOptionArray] = useState([])
  const [value, setValue] = useState([])
  const [formattedDates, setFormattedDates] = useState([])

  useEffect(() => {
    fetch()
  }, [])

  async function fetch() {
    try {
      const entryData = await API.graphql(graphqlOperation(listEntries))
      const entryVar = entryData.data.listEntries.items
      setListAppSynch(entryVar)
      console.log("entryVar", entryData)
      // Use Set to get unique topics
      const topics = [...new Set(entryVar.map(entry => entry.topic))];
      console.log("Array of Uniqe topics:", topics)
      setTopicArray(topics)
      const options = topics.map(topic => ({ value: topic, label: topic }));
      setOptionArray(options)
      console.log("opt", options)
      const formatDate = [...new Set(entryVar.map(item => item.createdAt))]
      console.log("formatDate", formatDate)
      // ///////////////////////////////////////////////////////////format dates
      // const FormattedDatez = formatDate.map(date => {
      //   const [year, month, day] = date.split("-");
      //   return `${month}/${day}/${year}`;
      // });
      const FormattedDatez = formatDate.map(date => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${month}/${day}/${year}`;
      })
      setFormattedDates(FormattedDatez)

    } catch (err) { console.log(err) }
  }

  const [mostRecent, setMostRecent] = useState([])
  useEffect(() => {
    console.log("useEffectformState", formState.topic);
    // console.log("topicRef!", topicRef)
    if (formState.topic !== " ") {


    }
  }, [formState.topic]);

  function setInput(key, value) {
    const filteredEntries = listAppSynch.filter(entry => entry.topic === value)
    const sortedEntries = filteredEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const mostRecentEntry = Array.from(sortedEntries).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 1);


    setFormState({ ...formState, [key]: value })
    console.log("setInput-formState", formState.topic)
  }
  const [checked, setChecked] = useState(false) ///Bookmarks
  const [isBookmarked, setIsBookmarked] = useState(false);


  const handleToggleChange = (event) => {
    setChecked(event.target.checked);
    setIsBookmarked(!isBookmarked)
  };
  async function addEntry(data) {
    try {
      const entry = { ...formState }
      setEntryContent([...entryContent, entry])   //// CAN Prob delete
      setFormState(initialState)
      await API.graphql(graphqlOperation(createEntry, {
        input: {
          ...data,
          title: formState.title,//`State of ${data.topic} - ${formattedDate}`,
          bookmarked: isBookmarked ? true : false
        }
      }))
    } catch (err) {
      console.log(err)
    }
  }


  ////////////////////////////////////////////////////////////////////////////////////////

  const editorRef = useRef();
  const editor2Ref = useRef();
  const [entryArray, setEntryArray] = useState();
  const [isVisible, setIsVisible] = useState(false);


  const copyNPaste = (event) => {
    if (editor2Ref && editor2Ref.current) {
      let copy = editor2Ref.current.getContent()
      console.log("COPY", copy)
      const editor = window.tinymce.get("main-editor");
      editor.setContent(copy);

    }
  }
  const log = (url) => {
    setIsVisible(true);
    setEntryArray(editorRef.current.getContent());
    // setInput('content', entryArray)
    // const sush = { ...formState, content: editorRef.current.getContent(), bookmarked: false }
    // addEntry(sush)
    const content = editorRef.current.getContent()
    setInput('content', content)
    const data = { ...formState, content, bookmarked: false };
    addEntry(data);
    var my_editor_id = 'entryEdi';
    setTimeout(() => {
      redirect(url);
    }, 1000); // set a delay for 1s before redirecting to next page
  };
  let RunWay = 'http://localhost:3000/RunWay'
  let edi = "http://localhost:3000/edi"
  const redirect = (url) => {
    // Redirect the user to the URL corresponding to the topic
    window.location.href = url
  }


  useEffect(() => {
    setValue({ value: formState.topic, label: formState.topic });
  }, [formState.topic]);

  ///////////////////////////////////////////////////////////////////////////
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
  //////////////////////////////////////////////////////////////////////////// current date
  const date = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  ///////////////////////////////////////////////////////////////////////////////
  //Latest Entries
  const topicRef = useRef(" ");
  const counter = useTopicRefCounter(topicRef);

  function useTopicRefCounter(topicRef) {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
      setCounter(prevCounter => prevCounter + 1);
      console.log("counter", counter)
    }, [topicRef.current]);
    return counter;
  }

  useEffect(() => {
    console.log("listAppSynch", listAppSynch)
    console.log("counter", counter)
    if (counter > 1) {
      listAppSynch
        .filter(entry => entry.topic === topicRef.current)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 1)
        .map((entry, index) => {
          const editor = window.tinymce.get('my-editor');
          editor.setContent(entry.content);
        });
    }
  }, [topicRef.current]);
  return (
    <div >
      <div style={{ left: "50%", textAlign: "center" }}>
        <img src={journal} alt="journal" style={{
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
        {/* <button onClick={copyNPaste()}> Copy/Paste </button> */}
        <h1 style={{ margin: '0', fontFamily: 'fantasy' }}> Reflection </h1>
      </div>
      <form style={{ width: "100vw", height: "100vh", margin: "0", backgroundColor: "grey", borderRadius: "2px", border: "2px solid black" }}
        onSubmit={event => { event.preventDefault(); log(RunWay); }}>
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
        <select
          id="topic"
          onChange={event => {
            setInput('topic', event.target.value)
            topicRef.current = event.target.value;
          }}
          value={formState.topic}
          style={{ display: 'inline-block', margin: '0', width: '15ch' }}
        >
          <option value="">Choose Option</option>
          {topicArray.map(topic => (

            <option value={topic} key={topic}>{topic}</option>
          ))}
        </select>
        <input
          required
          onChange={event => {
            setInput('topic', event.target.value.
              toLowerCase().replace(/\b\w/g, l => l.toUpperCase()))// converts input to lower case and than changes it to title casing
            topicRef.current = event.target.value;
          }}
          value={formState.topic}
          placeholder="Topic"
          style={{ display: 'inline-block', margin: '0', width: '25ch' }} //15ch
          maxLength={17}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>

          <input
            id="title"
            className="inputClass"
            onChange={event => setInput('title', event.target.value)}
            value={formState.title}
            // value={"State of " + topicRef.current + " - " + formattedDate}  // formState.title
            placeholder="Title"
            style={{ width: '40ch' }}
          />
          <label style={{ display: "flex", alignItems: "center" }}>
            Bookmark
            <FontAwesomeIcon
              icon={isBookmarked ? faToggleOn : faToggleOff}
              style={{ width: "25px", height: "25px" }}
              onClick={handleToggleChange}
            /></label>




        </div>
        <div style={{ width: "100vw", height: "100vh" }}>
          <Editor
            required
            style={{ width: "100vw", height: "100vh" }}
            onInit={(evt, editor) => editorRef.current = editor}
            disabled={false}
            apiKey='2qndeo03c25ouw6zbygzsk310xifzv7i8042ie3u1zq00iev'
            inline={false}
            id="main-editor"
            init={{
              resize: false,
              skin: 'oxide-dark',
              content_css: 'dark',
              /* enable automatic uploads of images represented by blob or data URIs*/
              automatic_uploads: true,
              /*
             URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
             images_upload_url: 'postAcceptor.php',
             here we add custom filepicker only to Image dialog
             */
              file_picker_types: 'image video',
              file_picker_callback: function (cb, value, meta) {
                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*,video/*');

                input.onchange = function () {
                  var file = this.files[0];

                  if (file.type.includes('image')) {
                    var reader = new FileReader();
                    reader.onload = function () {
                      /*
                        Note: Now we need to register the blob in TinyMCEs image blob
                        registry. In the next release this part hopefully won't be
                        necessary, as we are looking to handle it internally.
                      */
                      var id = 'blobid' + (new Date()).getTime();
                      var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                      var base64 = reader.result.split(',')[1];
                      var blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);

                      /* call the callback and populate the Title field with the file name */
                      cb(blobInfo.blobUri(), { title: file.name });
                    };
                    reader.readAsDataURL(file);
                  } else if (file.type.includes('video')) {
                    var blobUrl = URL.createObjectURL(file);
                    cb(blobUrl, { title: file.name });
                  }
                };

                input.click();
              },
              selector: "#entryEdi",
              media_live_embeds: true,
              height: 500,
              menubar: false,
              placeholder: "Whats on your mind?",
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'table', 'code', 'help', 'wordcount', 'media', 'emoticons'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor image emoticons | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help' + 'link  code ',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
          <button
            onClick={event => { event.preventDefault(); log(edi); }}
            onMouseEnter={adjacentHandleMouseEnter}
            onMouseLeave={adjacentHandleMouseLeave}
            style={{
              background: "linear-gradient(to bottom, grey, black)",
              border: "0.5vh  solid black", width: "100vw", height: `50px`,
              opacity: adjacentHoover ? '0.80' : '1', display: 'flex',
              alignItems: 'center', justifyContent: 'center', lineHeight: '50px'
            }}>
            SUBMIT & New Entry <a href="#" style={{
              color: "white", textDecoration: 'none',
            }}> </a> </button>
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              background: "linear-gradient(to bottom, grey, black)",
              border: "0.5vh  solid black", width: "100vw", height: `50px`,
              opacity: hoover ? '0.80' : '1', display: 'flex',
              alignItems: 'center', justifyContent: 'center', lineHeight: '50px'
            }}>
            SUBMIT & Enter Journal <a href="#" style={{
              color: "white", textDecoration: 'none',
            }}> </a> </button>
          {listAppSynch
            .filter(entry => entry.topic === topicRef.current)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 1)
            .map((entry, index) => (
              <div key={index} style={{ margin: '0' }}>
                <h3 style={{ margin: '0' }}> Most Recent Entry for {entry.topic}: </h3>
                <h3 style={{ margin: "0" }}> Date: {formattedDates[index]} </h3>
                <Editor
                  onInit={(evt, editor) => editor2Ref.current = editor}
                  apiKey='2qndeo03c25ouw6zbygzsk310xifzv7i8042ie3u1zq00iev'
                  disabled={true}
                  inline={false}
                  id="my-editor"
                  init={{
                    resize: false,
                    skin: 'oxide-dark',
                    height: 250,
                    menubar: false,
                    placeholder: "Whats on your mind?",
                    init_instance_callback: function (editor) {
                      editor.setContent(entry.content)
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
            ))
          }
        </div>
      </form>

      <div style={{ margin: '0' }}>
        {/* {listAppSynch
          .filter(entry => entry.topic === topicRef.current)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 1)
          .map((entry, index) => (
            <div key={index} style={{ margin: '0' }}>
              <h3 style={{ margin: '0' }}> Most Recent Entry for {entry.topic}: </h3>
              <h3 style={{ margin: "0" }}> Date:{entry.date} </h3>
              <Editor
                apiKey='2qndeo03c25ouw6zbygzsk310xifzv7i8042ie3u1zq00iev'
                disabled={true}
                inline={false}
                id="my-editor"
                init={{
                  resize: false,
                  skin: 'oxide-dark',
                  height: 250,
                  menubar: false,
                  placeholder: "Whats on your mind?",
                  init_instance_callback: function (editor) {
                    editor.setContent(entry.content)
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
          ))
        } */}
      </div>

    </div>
  );
}