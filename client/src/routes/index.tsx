import {IBrowserRouter} from "../interfaces/common/IBrowserRouter";
import {
    aboutUs_route,
    admin_route,
    auth_route,
    basket_route,
    game_route,
    main_route, profile_history_route, profile_route, profile_settingsRoute, registration_route
} from "../utils/constats";
import ShopPage from "../pages/ShopPage";
import GamePage from "../pages/GamePage";
import AboutPage from "../pages/AboutPage";
import AuthPage from "../pages/AuthPage";
import BasketPage from "../pages/BasketPage";
import AdminPage from "../pages/AdminPage";
import ProfilePage from "../pages/ProfilePage";
import ProfileSettings from "../components/Profile/ProfileSettings";
import Add from "../components/Add";
import History from "../components/History";
import Tags from "../components/Add/Tags";
import Platforms from "../components/Add/Platforms";
import Games from "../components/Add/Games";
import Keys from "../components/Add/Keys";
import Users from "../components/Users";

export const publicRoutes:IBrowserRouter[] = [
    {
        path: main_route,
        exact: true,
        component: <ShopPage/>
    },
    {
      path: game_route,
      exact: false,
      component: <GamePage/>
    },
    {
        path: aboutUs_route,
        exact: true,
        component: <AboutPage/>
    },
    {
        path: basket_route,
        exact: true,
        component: <BasketPage/>
    },
    {
        path: auth_route,
        exact: false,
        component: <AuthPage/>
    },
    {
        path: registration_route,
        exact: false,
        component: <AuthPage/>
    }
];

export const privateRoutes:IBrowserRouter[] = [
    {
        path: profile_route + "/*",
        exact: true,
        component: <ProfilePage/>,
        outlet: [
            {
                path: "settings",
                exact: true,
                component: <ProfileSettings/>
            },
            {
                path: "history",
                exact: true,
                component: <History/>
            },
        ]
    }
];

export const adminRoutes:IBrowserRouter[] = [
    {
        path: admin_route,
        exact: true,
        component: <AdminPage/>,
        outlet: [
            {
                path: "tags",
                exact: true,
                component: <Add><Tags/></Add>
            },
            {
                path: "platforms",
                exact: true,
                component: <Add><Platforms/></Add>
            },
            {
                path: "games",
                exact: true,
                component: <Add><Games/></Add>
            },
            {
                path: "keys",
                exact: true,
                component: <Add><Keys/></Add>
            },
            {
                path: "users",
                exact: true,
                component: <Add><Users/></Add>
            }
        ]
    },

];