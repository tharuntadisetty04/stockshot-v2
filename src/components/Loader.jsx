import React from "react";

const Loader = () => {
    return (
        <div className="flex items-center justify-center h-96 w-fit bg-slate-50 mt-10">
            <div className="flex flex-col gap-6 w-full items-center justify-center">
                <div className="w-20 h-20 border-4 border-transparent animate-spin flex items-center justify-center border-t-purple-600 rounded-full">
                    <div className="w-16 h-16 border-4 border-transparent animate-spin border-t-purple-400 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
