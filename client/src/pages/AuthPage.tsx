import React from 'react';
import {Field, Form, Formik} from "formik";
import {Navigate, useLocation} from "react-router";
import * as Yup from "yup";
import {auth_route, profile_settingsRoute, registration_route} from "../utils/constats";
import {NavLink} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Store} from "../index";

interface IInitialValues {
    email: string;
    password: string;
}

interface ISubmiting {
    setSubmitting: (isSubmitting: boolean) => void;
}

const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too short!').max(32, 'Too Long').required('Required')
});

const AuthPage = observer(() => {
    const store = React.useContext(Store).userStore;
    const isAuth: boolean = React.useContext(Store).userStore.isAuth;
    const location = useLocation().pathname === auth_route;
    console.log(location, isAuth, " auth");

    function onSubmit(values:IInitialValues, {setSubmitting}:ISubmiting) {
        location? store.login(values.email, values.password): store.registration(values.email, values.password);
    }
    const initialValues: IInitialValues = {email: "", password: ""};
    return (

        <div style={{
            margin: "0 auto"
        }}>
            {store.isAuth?<Navigate to={profile_settingsRoute}/> :null}
            <div style={{color: "white", margin: "0 auto 10px auto", textAlign: "center"}}>{location?"Войти в личный кабинет":"Зарегистрироваться"}</div>
            <Formik
                initialValues={initialValues}
                validationSchema={SignupSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form style={{position: "relative" ,display: "flex", flexDirection: "column", width: 450, justifyContent: "space-between"}}>
                        <Field type="email" name="email" placeholder="Email..." maxLength="200" style={{margin: "0 0 20px 0", height: 30, borderRadius: 50, padding: "0 10px", fontSize: 18,}}/>
                        {errors.email && touched.email ? (<div style={{position: "absolute",top: 6, right: 10, color: "red", fontSize: 18}}>{errors.email}</div>): null}
                        <Field type="password" name="password" placeholder={"Password"} style={{margin: "0 0 20px 0", height: 30, borderRadius: 50, padding: "0 10px", fontSize: 18,}}/>
                        {errors.password && touched.password ? (<div style={{position: "absolute",top: 56, right: 10, color: "red", fontSize: 18}}>{errors.password}</div>): null}
                        <div className="auth_buttons" style={{display: "flex", justifyContent: "space-between"}}>
                            <div style={{
                                flex: "1 1 auto",
                            }}><NavLink style={{
                                fontSize: 18,
                                color: "white",
                                marginLeft: 3,
                            }} to={location?registration_route:auth_route}>{location?"Нет аккаунта? Зарегистрируйтесь!":"Уже есть аккаунт? Войдите!"}</NavLink></div>
                            <button type="submit" style={{
                                fontSize: 18,
                                maxWidth: 200,
                                borderRadius: 7,
                                flex: "1 1 auto"
                            }}
                            >
                                {location?"Войти":"Зарегистрироваться"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
});

export default AuthPage;