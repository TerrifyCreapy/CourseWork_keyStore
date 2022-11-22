import React from 'react';
import s from "./Modal.module.scss";

interface IModal {
    active: boolean,
    setActive: Function,
    children?: React.ReactNode
}

const Modal: React.FC<IModal> = ({active ,setActive, children}) => {
    return (
        <div className={`${s.modal} ${active?s.active:""}`} onClick={()=>setActive(false)}>
            <div className={`${s.content} ${active?s.activeContent:""}`} onClick={(e)=>e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;