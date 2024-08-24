import React from "react";

const ErrorDisplay = ({ message }) => {
    return (
        <div className="grid place-items-center text-center text-4xl h-96 font-semibold m-10">
            Error: {message}
        </div>
    );
};

export default ErrorDisplay;
