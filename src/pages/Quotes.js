import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../App.css'

 const App = () => {
     const [quote, setQuote] = useState('');
     const [author, setAuthor] = useState('');

     const quoteAPI =  async () => {
            let arrayOfQuotes = []; // 
            try {
                const data = await axios.get('https://api.quotable.io/random');
                arrayOfQuotes = data.data
            } catch (error) {
                console.log(error);
            }

            try {
                setQuote(arrayOfQuotes.content);
                setAuthor(arrayOfQuotes.author);
            } catch (error) {
                console.log(error);
            } 
        };

                useEffect(() => {
                quoteAPI();
                },[]);


    return (
        <div className="quotePage">
        <div className= "quoteBox" >
            <div className = "buttonDiv">
            {""}
              <button className ="quoteButton" onClick={quoteAPI}>New Quote</button> 
            <div className = "quote"><h2>{quote}</h2></div>
            <div className = "author"> {author} </div> 
        </div>   
        </div>
        </div>
    )
}

export default App