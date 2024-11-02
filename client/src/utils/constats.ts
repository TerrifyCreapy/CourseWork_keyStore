import {ILink} from "../interfaces/common/ILinks";

export const main_route:string = "/";
export const game_route:string = "/:id";
export const basket_route:string = "/basket";
export const profile_route: string = "/profile";
export const profile_history_route:string = profile_route + "/history";
export const auth_route:string = "/login";
export const profile_settingsRoute: string = profile_route + "/settings";
export const registration_route:string = "/registration";
export const aboutUs_route:string = "/aboutUs";

export const admin_route:string = "/admin";
export const adminTags_route: string = admin_route + "/tags";
export const adminPlatforms_route: string = admin_route + "/platforms";
export const adminGames_route: string = admin_route + "/games";
export const adminKeys_route: string = admin_route + "/keys";

export const NavlinksPublic: ILink[] = [{to:aboutUs_route, name: "О нас"},{to:basket_route, name: "Корзина"}];
export const auth: ILink[] = [{to: auth_route, name: "Войти"}];
export const profile: ILink[] = [{to: profile_settingsRoute, name: "Профиль"}];
export const adminLinks: ILink[] = [{to:adminPlatforms_route, name: "Админ-панель"}];
