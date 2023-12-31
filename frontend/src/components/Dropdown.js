// Author: Joshua Barbee
//
// This is based on my SelectInput file from my Quiz 3 submission.

import { useEffect } from "react";

const Dropdown = ({ id, setData, options, optionValues, defaultValue }) => {
    // eslint-disable-next-line
    useEffect(() => setData(defaultValue == null ? "" : defaultValue), []);

    return (
        <>
            <select className="form-select" aria-label={id} id={id} name={id}
                    onChange={e => setData(e.target.value)} defaultValue={defaultValue} >
                {defaultValue == null && <option value="" key={0}></option>}
                {createOptions(options, optionValues)}
            </select>
        </>
    );
}

// Create an option for each specified choice.
const createOptions = (options, optionValues) => options.map(
    (option, i) =>
        <option value={optionValues[i]} key={i + 1}>{option}</option>
);

export default Dropdown;
