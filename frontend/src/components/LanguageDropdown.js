// Author: Joshua Barbee

import Dropdown from "./Dropdown";

const LanguageDropdown = ({ id, languages, setLang }) =>
<>
    <h5><label htmlFor={id}>Preferred Language</label></h5>
    <Dropdown id={id} setData={setLang}
        options={Object.values(languages)} optionValues={Object.keys(languages)} />
</>

export default LanguageDropdown;
