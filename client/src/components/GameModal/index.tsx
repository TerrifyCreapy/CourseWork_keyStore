import React, {SetStateAction} from 'react';
import {Field, Form, Formik} from "formik";
import {Store} from "../../index";
import {IInitialGame} from "../../interfaces/entities/IInitialGame";



interface IAddGameModal extends IInitialGame {
    setInitial: React.Dispatch<SetStateAction<IInitialGame>>,
    setModal: React.Dispatch<SetStateAction<boolean>>
}

interface ISubmiting {
    setSubmitting: (isSubmitting: boolean) => void;
}


const AddGameModal: React.FC<IAddGameModal> = ({id,name, description= "", img = {}, price = 0, discount = 0, dateRealise = "", platforms = [], tags = [], setInitial, setModal}) => {

    const filterStore = React.useContext(Store).filterStore;
    const gamesStore = React.useContext(Store).gamesStore;

    const zeroInitial = () => {
        if(setInitial !== undefined) setInitial({id: 0, name: "", description: "", img: {} as File, price: 0, discount: 0, dateRealise: "", platforms: [], tags: []});
    }

    const initialValues: IInitialGame = {
        id,
        name,
        description,
        img: img as File,
        price,
        discount,
        dateRealise,
        platforms,
        tags
    }

    const onSubmit = async (values: IInitialGame, {setSubmitting}: ISubmiting) => {
        console.log(values);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("price", String(values.price));
        formData.append("discount", String(values.discount));
        formData.append("dateRealize", values.dateRealise);
        formData.append("platformsId", JSON.stringify(values.platforms));
        formData.append("tagsId", JSON.stringify(values.tags));
        formData.append("img", values.img);

        console.log(formData);
        zeroInitial();
        gamesStore.createGame(formData);

    }
    console.log("render", "initial");

    return (
        <>
            <button onClick={() => {
                setModal(false);
                zeroInitial();
            }}>Exit</button>
            <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
                {({isSubmitting, setFieldValue, values}) => {
                    return (

                        <Form style={{display: "flex", flexDirection: "column"}}>
                            <Field type="text" name="name" placeholder="Название игры" maxLength="200" style={{
                                margin: "0 0 20px 0",
                                height: 30,
                                borderRadius: 50,
                                padding: "0 10px",
                                fontSize: 18,
                                border: "1px solid black"
                            }}/>
                            <Field type="text" name="description" placeholder="Описание" maxLength="200" style={{
                                margin: "0 0 20px 0",
                                height: 30,
                                borderRadius: 50,
                                padding: "0 10px",
                                fontSize: 18,
                                border: "1px solid black"
                            }}/>
                            <input type="file" name="img" onChange={(e: any) => {
                                setFieldValue("img", e.target.files[0]);
                            }}/>
                            <Field type="number" name="price" placeholder="Цена" maxLength="20" style={{
                                margin: "0 0 20px 0",
                                height: 30,
                                borderRadius: 50,
                                padding: "0 10px",
                                fontSize: 18,
                                border: "1px solid black"
                            }}/>
                            <Field type="number" name="discount" placeholder="Скидка" maxLength="20" style={{
                                margin: "0 0 20px 0",
                                height: 30,
                                borderRadius: 50,
                                padding: "0 10px",
                                fontSize: 18,
                                border: "1px solid black"
                            }}/>
                            <Field type="text" name="realise" placeholder="Дата выхода" maxLength="20" style={{
                                margin: "0 0 20px 0",
                                height: 30,
                                borderRadius: 50,
                                padding: "0 10px",
                                fontSize: 18,
                                border: "1px solid black"
                            }}/>
                            <Field as="select" multiple="multiple" name="platforms" placeholder="Платформы"
                                   maxLength="20" style={{
                                width: "100%",
                                margin: "0 0 20px 0",
                                height: 60,
                                borderRadius: 50,
                                padding: "0 20px",
                                fontSize: 18,
                                border: "1px solid black"
                            }}>
                                {filterStore.platforms.map(e => <option key={e.id}
                                                                        style={{display: "block", width: "100%"}}
                                                                        value={e.id}>{e.name}</option>)}
                            </Field>
                            <Field as="select" multiple="multiple" name="tags" placeholder="Теги" maxLength="20"
                                   style={{
                                       width: "100%",
                                       margin: "0 0 20px 0",
                                       height: 60,
                                       borderRadius: 50,
                                       padding: "0 20px",
                                       fontSize: 18,
                                       border: "1px solid black"
                                   }}>
                                {filterStore.tags.map(e => <option key={e.id} style={{display: "block", width: "100%"}}
                                                                   value={e.id}>{e.name}</option>)}
                            </Field>
                            <button type="submit">
                                Подтвердить
                            </button>
                        </Form>
                    )
                }}

            </Formik>
        </>
    );
};

export default AddGameModal;