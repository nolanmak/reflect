import React from "react";
import ReactDOM from "react-dom";

const GoalPortal = ({ isOpen, handleClose, handleSave, frequency, handleFrequencyChange, focus, handleFocusChange, adjacentHoover, adjacentHoover2, adjacentHandleMouseEnter, adjacentHandleMouseEnter2, adjacentHandleMouseLeave, adjacentHandleMouseLeave2 }) => {
    if (!isOpen) return null;
    return ReactDOM.createPortal(
        <div style={{ zIndex: 9999, position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ backgroundColor: "grey", border: "0.5vh solid black", padding: "20px", borderRadius: "5px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)", maxWidth: "500px", width: "100%" }}>
                <h3>Journal Goals</h3>
                <label style={{ display: "block", marginBottom: "10px" }}>
                    Frequency:
                    <input type="text" style={{ marginLeft: "10px" }} onChange={handleFrequencyChange}
                        value={frequency}
                    />
                </label>
                <label style={{ display: "block", marginBottom: "10px", marginLeft: "32px" }}>
                    Focus:
                    <input type="text" style={{ marginLeft: "10px" }} onChange={handleFocusChange} value={focus} />
                </label>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                        onMouseEnter={adjacentHandleMouseEnter}
                        onMouseLeave={adjacentHandleMouseLeave}
                        style={{
                            marginRight: "10px", padding: 0, width: "100px",
                            background: "linear-gradient(to bottom, grey, black)",
                            border: "0.5vh solid black", display: 'flex', alignItems: 'center',
                            justifyContent: 'center', lineHeight: '50px', height: "60px",
                            opacity: adjacentHoover ? '0.80' : '1',
                        }} onClick={handleSave}>Save</button>
                    <button
                        onMouseEnter={adjacentHandleMouseEnter2}
                        onMouseLeave={adjacentHandleMouseLeave2}
                        onClick={handleClose} style={{
                            padding: 0, width: "100px",
                            background: "linear-gradient(to bottom, grey, black)",
                            border: "0.5vh solid black", display: 'flex', alignItems: 'center',
                            justifyContent: 'center', lineHeight: '50px', height: "60px",
                            opacity: adjacentHoover2 ? '0.80' : '1',
                        }}>Cancel</button>
                </div>
            </div>
        </div>,
        document.getElementById("portal-root")
    );
};

export default GoalPortal;