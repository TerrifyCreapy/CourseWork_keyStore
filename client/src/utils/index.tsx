import {IBrowserRouter} from "../interfaces/common/IBrowserRouter";
import React from "react";
import {Route} from "react-router";
import {ILink} from "../interfaces/common/ILinks";
import {NavLink} from "react-router-dom";
export const mapRoutes = (routes: IBrowserRouter[]) => {
    return routes.map((route: IBrowserRouter) => {
        const component = route.component as React.ReactNode;



        if(route.outlet) {
            const outlets = mapRoutes(route.outlet);
            return (
                <Route
                    key={route.path}
                    path={route.path}
                    element={component}
                >
                    {outlets}
                </Route>
            )
        }
        return (
            <Route
                key={route.path}
                path={route.path}
                element={component}
            />
        )

    });
}

export const navLinks = (links: ILink[], styles: ({isActive}:{isActive: boolean}) => object) => {
    return links.map((link: ILink) => {
       return (
           <NavLink
               key={link.to}
               to={link.to}
               style={styles}
           >
               {link.name}
           </NavLink>
       )
    });
}
