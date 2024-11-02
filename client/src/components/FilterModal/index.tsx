import React, {SetStateAction} from 'react';

interface IFilterModal {
    value: string;
    setModal: React.Dispatch<SetStateAction<boolean>>;

}

const FilterModal: React.FC<IFilterModal> = ({value,setModal}) => {
    console.log(value);
    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
            <button onClick={() => setModal(false)}>exit</button>
            <input type="text" value={value} style={{border: "1px solid black"}}/>
        </div>
    );
};

export default FilterModal;