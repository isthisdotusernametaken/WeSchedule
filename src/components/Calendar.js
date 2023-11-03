import React from "react";

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
            <div className="awesome" style={{ border: "1px solid red" }}>
            </div>
                <div className="calendar">
                <th rowSpan="7">Calendar</th>
                <table>
                    <tbody>
                    <tr/>
                    <tr>
                        <td class="dateCell">Day 1:</td>
                        <td>Day 2:</td>
                        <td>Day 3:</td>
                        <td>Day 4:</td>
                        <td>Day 5:</td>
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
