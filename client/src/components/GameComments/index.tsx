import React, {ChangeEvent} from 'react';
import {IComment} from "../../interfaces/entities/IComment";
import CommentItem from "../CommentItem";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router";
import {auth_route} from "../../utils/constats";

interface IGameComments {
    comments: IComment[],
    onSubmit: (id: number, email: string, input: string) => void;
    email: string;
    gameId: number;
    deleteComment: (id: number) => void;
    roles: string[]
}

const countN = (str: string): number => {
    return (str.match(/\n/g) || []).length;
}

const GameComments:React.FC<IGameComments> = ({comments, onSubmit, email, gameId,deleteComment, roles}) => {

    const navigate = useNavigate();

    const [input, setInput] = React.useState<string>("");

    const onChangeInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if(countN(event.target.value) > 5 || event.target.value.length > 144) return;
        setInput(event.target.value);
    }

    return (
        <div
            style={{
                position: "relative",
                top: 50,
                width: "50%",
                minHeight: 500,
                margin: "0 auto",
                textAlign: "center"
            }}
            className="comments__main">
            <div>Комментарии</div>
            <div
                className="comments__container"

            >
                <div className="comments__input" style={{display: "flex", flexDirection: "column", alignItems: "flex-end", marginTop: 12}}>
                    <textarea value={input} name="input__commnet" id="input__comment" style={{alignSelf: "center" ,marginBottom: 10,width: "80%", height: 150, border: "1px solid black", resize: "none"}} onChange={onChangeInput} cols={10} rows={1}></textarea>
                    <button onClick={() => {
                        if(email) onSubmit(gameId, email, input);
                        else navigate(auth_route);
                        setInput("");
                    }} disabled={input?.length === 0} style={{marginRight: 51,width: 100, height: 30, borderRadius: 5, border: "1px solid black", backgroundColor: "inherit", cursor: "pointer"}}>Отправить</button>
                </div>
                <div className="comments" style={{
                    fontSize: 16,
                    marginBottom: 20
                }}>
                    {comments.length?comments.map((e: IComment) => <CommentItem key={e.id} {...e} email={email} deleteComment={deleteComment} roles={roles}/>):<div>No comments</div>}
                </div>
            </div>
        </div>



    );
};

export default GameComments;