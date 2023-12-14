// Author: Joshua Barbee
//
// This is based on my ErrorMessage file from my Quiz 3 submission.

const Message = ({ title, succ, children }) =>
    <div className={"mt-4 alert " + (succ ? " alert-success" : " alert-warning") + (title == null ? " d-none" : "")}>
        <h4 className="alert-heading">{title}</h4>
        {children}
    </div>;

export const errHandler = setMessage => (
    err => setMessage([false,
        err instanceof String ? err :
        err.response ? err.response.data.error :
        "Unable to access server."
    ])
);

export const succHandler = setMessage => (
    succ => setMessage([true, succ])
);

export const clearHandler = setMessage => (
    succ => setMessage([true, null])
);

export const clearAndCallbackHandler = (setMessage, callback) => (() => {
    setMessage([true, null]);
    callback();
})

export default Message;
