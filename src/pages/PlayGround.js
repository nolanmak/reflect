import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Calendar, dateFnsLocalizer, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import format from "date-fns/format";
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay'
import DatePicker from "react-datepicker"

// const localizer = momentLocalizer(moment);
// const locales = {
//     "en-US": require("date-fns/locale/en-US")
// }
// const localizer = dateFnsLocalizer({
//     format,
//     parse,
//     startOfWeek,
//     getDay,
//     locales
// })

const events = [
    {
        title: "HELLO",
        allDay: true,
        start: new Date(2023, 6, 3),
        end: new Date(2023, 7, 3)
    },
    {
        title: "Vacation",
        start: new Date(2023, 10, 3),
        end: new Date(2023, 15, 3)
    }
]
const localizer = momentLocalizer(moment);
export default function Playground() {
    // const [content, setContent] = useState('');

    // const handleEditorChange = (e) => {
    //     setContent(e.target.getContent());
    // };

    // const handleClick = () => {
    //     const editor = window.tinymce.get('my-editor');
    //     editor.setContent('Hello World');
    // };

    return (
        <>
            <Calendar
                localizer={localizer}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: "50px" }}
            />
            {/* <button onClick={handleClick}>Set Content</button> */}
            {/* <Editor
                apiKey="YOUR_API_KEY"
                initialValue="<p>This is the initial content of the editor</p>"
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help'
                }}
                onEditorChange={handleEditorChange}
                id="my-editor"
            /> */}
        </>
    );
}


