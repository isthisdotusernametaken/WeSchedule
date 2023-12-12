// Author: Joshua Barbee
//
// This is based on my ErrorMessage file from my Quiz 3 submission.

const SuccessMessage = ({ title, children }) =>
    <div className={"mt-4 alert alert-success" + (title == null ? " d-none" : "")}>
        <h4 className="alert-heading">{title}</h4>
        {children}
    </div>

export default SuccessMessage;
