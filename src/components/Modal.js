import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from "react";
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import awsExports from "../aws-exports";
import '@aws-amplify/ui-react/styles.css';
import { createGoal, createFocus, deleteFocus } from '../graphql/mutations.js';
import { listEntries, listGoals, listFoci } from '../graphql/queries.js';
import { Calendar, momentLocalizer, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import format from "date-fns/format";
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay'
import DatePicker from "react-datepicker"
// const localizer = momentLocalizer(moment);

const events = [
    {
        title: "Entry",
        allDay: true,
        start: new Date(2023, 2, 10, 0, 0),
        end: new Date(2023, 2, 10, 0, 0)
    },
    {
        title: "Entry",
        start: new Date(2023, 2, 3, 0, 0),
        end: new Date(2023, 2, 3, 0, 0)
    }
]

const locales = {
    "en-US": require("date-fns/locale/en-US")
}
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
})


const views = { month: true };

Amplify.configure(awsExports);

function Modal({ closeModal }) {
    const [topicArray, setTopicArray] = useState([])
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [goalArray, setGoalArray] = useState([])
    const [focusArray, setFocusArray] = useState([])
    const [eventObj, setEventObj] = useState([])

    useEffect(() => {
        fetch()
    }, [])

    async function fetch() {
        try {
            const entryData = await API.graphql(graphqlOperation(listEntries))
            const goalData = await API.graphql(graphqlOperation(listGoals))
            const focusData = await API.graphql(graphqlOperation(listFoci))
            if (entryData) {
                const entryVar = entryData.data.listEntries.items  /// Turn to array of objects
                // Use Set to get unique topics
                const topics = [...new Set(entryVar.map(entry => entry.topic))];
                const dates = [...new Set(entryVar.map(entry => entry.createdAt))]
                const events = reformatDatesAndCreateEventsArray(dates)
                setEventObj(events)
                console.log("events", events)
                setTopicArray(topics)
            }
            if (goalData) {
                const goalVar = goalData.data.listGoals.items
                setGoalArray(goalVar)
            }
            if (focusData) {
                const focusVar = focusData.data.listFoci.items
                setFocusArray(focusVar)
                console.log("focus", focusVar)
            }
        } catch (err) { console.log(err) }
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

    const [frequency, setFrequency] = useState("");
    function handleFrequencyChange(event) {
        setFrequency(event.target.value)
        console.log(event.target.value)
    }
    const [focus, setFocus] = useState([]);
    const [clickCounts, setClickCounts] = useState([]);
    const [currentClickCounts, setCurrentClickCounts] = useState([]); //onClick

    useEffect(() => {
        setCurrentClickCounts(Array.from({ length: topicArray.length }, () => 0));
    }, [topicArray.length]);

    useEffect(() => {
        setClickCounts(Array.from({ length: topicArray.length }, () => 0));
    }, [topicArray.length]);

    const handleFocusChange = (topic) => {
        const newFocus = focus.includes(topic)
            ? focus.filter((t) => t !== topic)
            : [...focus, topic];
        setFocus(newFocus);
        const index = topicArray.indexOf(topic);
        const newClickCounts = [...clickCounts];
        if (typeof newClickCounts[index] === "undefined") {
            newClickCounts[index] = 0;
        }
        newClickCounts[index] += 1;
        console.log("focusArray", focusArray)
        setClickCounts(newClickCounts);
    }


    // async function goalSave() {
    //     try {

    //         const goalData = {
    //             frequency: frequency // Using the frequency state variable directly
    //         };
    //         const focusData = focus.map(topic => ({
    //             FocusTopics: topic
    //         }));
    //         const newGoal = await API.graphql(graphqlOperation(createGoal, { input: goalData }));
    //         console.log('New Goal:', newGoal.data.createGoal);

    //         const newFocus = await Promise.all(focusData.map(data => (   ////// ad if above
    //             API.graphql(graphqlOperation(createFocus, { input: data }))
    //         )));
    //         console.log('New Focus:', newFocus);
    //         closeModal(false)
    //         return [newGoal.data.createGoal, ...newFocus.map(result => result.data.createFocus)];
    //     } catch (error) {
    //         console.log('Error saving goal:', error);
    //     }
    // }
    ///////////////////////////////////////////////////////////////////////////////
    async function goalSave() {
        try {

            let count1 = 0
            let count2 = 0
            // Step 1: Get the indexes of focus in topicArray
            const focusIndexes = focus.map((topic) => topicArray.indexOf(topic));

            // Step 2: Get the corresponding click counts for the focus indexes
            const clickCount = focusIndexes.map((index) => clickCounts[index]);

            // Step 3 and 4: Loop through the focus indexes and check their click counts
            for (let i = 0; i < focusIndexes.length; i++) {
                const index = focusIndexes[i];
                const count = clickCount[i];
                const topic = topicArray[index];
                console.log("topic", topic)
                // const input = { id: topic[index] }
                const topics = [...new Set(focusArray.map(entry => entry.FocusTopics))];
                // Check if the topic exists in focusArray
                const existsInFocus = topics.includes(topic);
                //const existsInFocus = focusArray.some(focus => focus.FocusTopics.trim().toLowerCase() === topic.trim().toLowerCase());

                if (topics.includes(topic)) {
                    if (count % 2 === 1) {
                        const focusEntry = focusArray.find((entry) => entry.FocusTopics === topic);
                        if (focusEntry) {
                            const input = { id: focusEntry.id };
                            const deleteFocusTopics = await API.graphql(graphqlOperation(deleteFocus, { input }))
                            console.log("delete", count1++)
                        }
                    }
                } else {


                    if (!existsInFocus) {
                        // Add the topic to the database
                        const newFocus = await API.graphql(graphqlOperation(createFocus, { input: { FocusTopics: topic } }));
                        console.log("ADD", count2++)
                        console.log('New Focus:', newFocus);
                    }
                }
            }

            const goalData = {
                frequency: frequency // Using the frequency state variable directly
            };

            const newGoal = await API.graphql(graphqlOperation(createGoal, { input: goalData }));
            // console.log('New Goal:', newGoal.data.createGoal);

            closeModal(false)
            return [newGoal.data.createGoal];
        } catch (error) {
            console.log('Error saving goal:', error);
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////
    const [updateButtonColor, setUpdateButtonColor] = useState("");
    return (
        <div>
            {/* TO COVER ENTIRE BACKGROUND backgroundColor: "rgba(200, 200, 200)",  "rgba(0, 0, 0, 0.5)"*/}
            <div style={{ height: "100%", width: "100%", zIndex: 9999, position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", overflow: "auto" }}>
                <div style={{ backgroundColor: "grey", border: "0.5vh solid black", padding: "20px", boxShadow: "0px 50px 15px rgba(0, 0, 0, 0.35)", borderRadius: "5px", maxWidth: "500px", maxHeight: "80vh" }}>
                    <h3>Journal Goals</h3>
                    <label style={{ display: "block", marginBottom: "10px" }}>
                        Frequency:
                        <select
                            onChange={handleFrequencyChange}
                            value={frequency}
                            style={{ display: 'inline-block', margin: '0', width: '15ch' }}>
                            <option value="">Choose Option</option>
                            <option >Daily</option>
                            <option >3 days</option>
                            <option >Weekly</option>
                            <option >BiWeekly</option>
                            <option >Monthly</option>
                        </select></label>
                    <Calendar
                        views={views}
                        events={eventObj}
                        localizer={localizer}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 250, margin: "50px" }}
                    />
                    {/* <div style={{ border: "0.5vh solid black" }}> */}
                    {/* <label style={{ display: "block", marginBottom: "10px", marginLeft: "32px" }}>
                            Focus:
                            {topicArray.map((topic, index) => {
                                const isTopicSelected = focus.includes(topic);
                                const isTopicInFocusArray = focusArray.some(focusTopic => focusTopic.FocusTopics === topic);
                                // console.log("topicArray.map", isTopicInFocusArray)
                                let backgroundColor = isTopicInFocusArray ? "RGBA(0, 0, 255, 0.5)" : isTopicSelected ? "RGBA(0, 0, 255, 0.5)" : "rgba(128, 128, 128, 0.5)";
                                // const buttonColor = isTopicSelected || isTopicInFocusArray ? "blue" : "rgba(128, 128, 128, 0.5)";
                                return (
                                    <button
                                        key={index}
                                        onMouseEnter={() => setHoverIndex(index)}
                                        onMouseLeave={() => setHoverIndex(-1)}
                                        style={{
                                            borderRadius: "14px",
                                            height: `75px`,
                                            width: "75px",
                                            margin: 0,
                                            padding: 0,
                                            background: clickCounts[index] < 1 ? backgroundColor : (clickCounts[index] > 1 ? updateButtonColor : null),
                                            border: "0.5vh solid white",
                                            opacity: hoverIndex === index ? '0.75' : '1',
                                        }}
                                        onClick={() => {
                                            handleFocusChange(topic);
                                            const index = topicArray.indexOf(topic);
                                            const button = document.getElementsByTagName("button")[index];
                                            console.log("topic", topic)
                                            console.log("Focus Array? Already in DB", isTopicInFocusArray)
                                            console.log("click count", clickCounts[index])
                                            console.log("WHOLE CLICK COUNT", clickCounts)
                                            console.log("current CLICK COUNT", currentClickCounts)
                                            setCurrentClickCounts((prevClickCounts) => {
                                                const newClickCounts = [...prevClickCounts];
                                                newClickCounts[index] += 1;
                                                if (newClickCounts[index] === 1 && !isTopicInFocusArray) {
                                                    console.log("1st layer")
                                                    setUpdateButtonColor("RGBA(0, 0, 255, 0.5)")
                                                } else if (isTopicInFocusArray) {
                                                    console.log("2nd layer loop")
                                                    if (newClickCounts[index] % 2 === 1) {
                                                        console.log("3rd layer loop")
                                                        setUpdateButtonColor("rgba(128, 128, 128, 0.5)");
                                                    } else {
                                                        console.log("4th layer loop")
                                                        setUpdateButtonColor("RGBA(0, 0, 255, 0.5)") //button.style.background
                                                    }
                                                } else {
                                                    console.log("ELSE")
                                                    setUpdateButtonColor("RGBA(0, 0, 255, 0.5)")
                                                    // backgroundColor = "rgba(128, 128, 128, 0.5)";
                                                }
                                                return newClickCounts;
                                            });
                                        }}
                                    >
                                        <a
                                            href="#"
                                            style={{
                                                color: "white",
                                                fontSize: `calc(15vw / ${topicArray.length + 1})`,
                                                textDecoration: 'none',
                                            }}
                                        >
                                            {topic}
                                        </a>
                                    </button>
                                );
                            })}
                        </label> */}
                    {/* </div> */}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <FontAwesomeIcon icon={faXmark}
                            onClick={() => closeModal(false)}
                            onMouseEnter={adjacentHandleMouseEnter}
                            onMouseLeave={adjacentHandleMouseLeave}
                            style={{
                                marginRight: "10px", padding: 0, width: "50px",
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', lineHeight: '50px', height: "50px",
                                opacity: adjacentHoover ? '0.60' : '1',
                            }} />
                        <FontAwesomeIcon icon={faFloppyDisk}
                            onClick={() => goalSave()}
                            onMouseEnter={adjacentHandleMouseEnter2}
                            onMouseLeave={adjacentHandleMouseLeave2}
                            style={{
                                padding: 0, width: "50px",
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', lineHeight: '50px', height: "50px",
                                opacity: adjacentHoover2 ? '0.6' : '1',
                            }} />
                    </div>
                    <div>{focus}</div>
                </div>
            </div>
        </div>
    )
}

function reformatDatesAndCreateEventsArray(dates) {
    const events = [];

    for (let i = 0; i < dates.length; i++) {
        const date = new Date(dates[i]);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        events.push({
            title: "",
            allDay: true,
            start: new Date(year, month, day, 0, 0),
            end: new Date(year, month, day, 0, 0)
        },);
    }

    return events;
}

export default Modal 