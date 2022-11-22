import React from 'react';
import s from "./ChangePassword.module.scss";
import {Field, Form, Formik} from "formik";
import {NavLink} from "react-router-dom";
import {auth_route, registration_route} from "../../utils/constats";
import * as Yup from "yup";
import {Store} from "../../index";

interface IInitialValues  {
    lastPass: string;
    newPass: string;
    confirmPass: string
}

const initialValues = {
    lastPass: "",
    newPass: "",
    confirmPass: "",
}

interface ISubmiting {
    setSubmitting: (isSubmitting: boolean) => void;
}


const ChangePassScheme = Yup.object().shape({
    lastPass: Yup.string(),
    password: Yup.string().min(6).max(32),
    confirmPass: Yup.string().test("match", "Password is different!", function (confirmPass){
        return confirmPass===this.parent.newPass;
    }),
});

const ChangePassword = () => {

    const store = React.useContext(Store).userStore;

    const onSubmit = (values:IInitialValues, {setSubmitting}:ISubmiting) => {
        store.editPassword(values.newPass, values.lastPass);
        setSubmitting(true);
    }

    return (
        <div className={s.changePass}>
            <Formik
                initialValues={initialValues}
                validationSchema={ChangePassScheme}
                onSubmit={onSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form style={{position: "relative" ,display: "flex", flexDirection: "column", width: 450, justifyContent: "space-between"}}>
                        <Field type="password" name="lastPass" placeholder="Старый пароль" maxLength="40" style={{margin: "0 0 20px 0", height: 30, borderRadius: 50, padding: "0 10px", fontSize: 18,}}/>
                        {errors.lastPass && touched.lastPass ? (<div>{errors.lastPass}</div>): null}
                        <Field type="password" name="newPass" placeholder="Новый пароль" maxLength="40" style={{margin: "0 0 20px 0", height: 30, borderRadius: 50, padding: "0 10px", fontSize: 18,}}/>
                        {errors.newPass && touched.newPass ? (<div>{errors.newPass}</div>): null}
                        <Field type="password" name="confirmPass" placeholder="Новый пароль" maxLength="40" style={{margin: "0 0 20px 0", height: 30, borderRadius: 50, padding: "0 10px", fontSize: 18,}}/>
                        {errors.confirmPass && touched.confirmPass ? (<div>{errors.confirmPass}</div>): null}
                        <button type={"submit"} disabled={isSubmitting}>Изменить</button>
                        <button type={"reset"}>Очистить</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ChangePassword;