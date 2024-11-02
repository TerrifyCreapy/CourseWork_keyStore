import React from 'react';
import Tags from "./Tags";
import Platforms from "./Platforms";
import Games from "./Games";
import Keys from "./Keys";

interface IAdd {
    children: React.ReactNode
}

const Add: React.FC<IAdd> = ({children}) => {


    return (
        <div style={{
            width: "100%",
            margin: "0 auto",
            flex: "1 1 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            {children}
        </div>
    );
};

export default Add;