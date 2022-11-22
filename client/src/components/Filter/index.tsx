import React from 'react';

interface IFilter {
    children: React.ReactNode
}

const Filter: React.FC<IFilter> = ({children}) => {
    return (
        <div style={{backgroundColor: "white", marginRight: 30, width: 200, display: "flex", flexDirection: "column", alignItems: "center", padding: "15px 5px"}}>
            {children}
        </div>
    );
};

export default Filter;