import React from "react";
import './style.css'

const Day = (props) => {
    console.log(props)
    return <td className="dateCell">
        <p>Day: {props.day}</p>
        </td>
}


class Calendar extends React.Component {
    constructor() {
        super()
        this.state = {
            //days of the month
            days : '30'
        }
    }

  render() {
    return (
        //loop for each day
        //for every 7 days jump a line
        //list the day number
        //use css for each
        <div>
            <link rel="stylesheet" href="./Calendar.css" />
            <div className="calendar">
                <th rowSpan="7">Calendar</th>
                <table>
                    <tbody>
                    <tr/>
                    <tr>
                        <Day day="1"></Day>
                        <Day day="2"></Day>
                        <Day day="3"></Day>
                        <Day day="4"></Day>
                        <Day day="5"></Day>
                        <Day day="6"></Day>
                        <Day day="7"></Day>
                    </tr>
                    <tr>
                        <Day day="8"></Day>
                    </tr>
                    </tbody>
                </table>
                <p />
            </div>
        </div>
    );
  }
}

//import stuff that let's us use a representation of the real time calendar
//each day can contain a list of items like pictures, files, and notes
    //day is a reusable object that can have files added to it

export default Calendar;
