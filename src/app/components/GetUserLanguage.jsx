"use client"

import getUserLocale from "get-user-locale";

export default function getUserLanguage() {

    const userLocale = getUserLocale();

    return userLocale.slice(0, 2);
}