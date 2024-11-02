import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal";
import {observer} from "mobx-react-lite";

interface ICommentComp {
    id: number;
    userEmail: string;
    email: string;
    value: string;
    deleteComment: (id: number) => void;
    roles: string[];
}

const Comment: React.FC<ICommentComp> = ({id ,userEmail, value, deleteComment, roles,email}) => {
    const [isOpened, setisOpened] = React.useState<boolean>(false);
    return (
        <div className="comment__item" style={{
            width: "80%",
            padding: "10px 30px",
            border: "1px solid black",
            margin: "0 auto",
            marginTop: 15,
            position: "relative"
        }}>
            <div className="user_email" style={{fontWeight: "bold", position: "relative", top: 0, left: 0, width: "20%", marginBottom: 16}}>{userEmail}</div>
            <div className="comment__body" style={{overflowWrap: "break-word"}}>{value}</div>
            {userEmail && (email===userEmail || roles.indexOf("ADMIN") > -1 || roles.indexOf("MODER") > -1) && <>
                <div className="remove__comment">
                <button
                onClick={() => {
                    setisOpened(true);
                }}
                style={{
                fontSize: 24,
                backgroundColor: "inherit",
                cursor: "pointer",
                position: "absolute",
                right: 10,
                top: 5
            }}>
                <FontAwesomeIcon icon={faXmark}/>
                </button>
                </div>
                <Modal active={isOpened} setActive={setisOpened}>
                    <div>Вы уверены?</div>
                    <button onClick={() => {
                        setisOpened(false);
                        deleteComment(id);
                        }}
                    >
                        Да
                    </button>
                    <button onClick={() => setisOpened(false)}>
                        Нет
                    </button>
                </Modal>
            </>}
        </div>
    );
};

export default observer(Comment);