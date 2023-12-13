// Author: Joshua Barbee
//
// This is based on my Card file from my Quiz 3 submission.

export const Card = ({ header, children }) =>
    <div className="card bg-secondary mb-3 mx-1">
        {header !== undefined &&
            <div className="card-header mt-1"><h4>{header}</h4></div>}
        <div className="card-body">
            {children}
        </div>
    </div>;