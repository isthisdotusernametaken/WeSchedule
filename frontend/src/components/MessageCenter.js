import React from "react";
import { THEMES, setTheme } from "../theme.js";
function MessageCenter() {
    return (
        <msgFrame className="border border-success p-2 mb-2" data-bs-theme="dark">
            <div className="container">
                <div className="row inner-frame">
                    {/* 12 avaliable col */}
                    <div className="col-sm-4 col-md-6 justifiy-content-center order-1">
                        <div className="p-0.5 border bg-dark">Hey</div>
                    </div>
                    <div className="col-sm-4 col-md-6 justifiy-content-center order-2">
                        <div className="p-0.5 border bg-dark">Hey</div>
                    </div>
                </div>

            </div>
            
        </msgFrame>
    );
}


export default MessageCenter;
