import { useState, useEffect } from 'react';
import { classNames } from '@/app/utils';

import { useSelector, useDispatch, userSettingsSlice } from "@/lib/redux";
import {selectUserSettingsState} from "@/lib/redux/slices/userSettingsSlice/selectors";

export default function CardSettings ({showStyle, showDisplay, setDisplay, display}: {showStyle?: boolean, showDisplay?: boolean, setDisplay?: any, display?: string}) {
    const userSettingsState = useSelector(selectUserSettingsState);
    const dispatch = useDispatch();

    return (
        <>
            <div className="flex items-center justify-end mt-5 gap-5">
                {showStyle && (
                    <>
                        <div className="flex items-center px-3">
                            {/* <div className="flex items-center bg-zinc-800 rounded-lg px-3 py-2"> */}
                            <span className="text-zinc-400 text-xs mr-2 uppercase">Card style</span>

                            {/* Active */}
                            <button
                                onClick={() => dispatch(userSettingsSlice.actions.setCardStyle(1))}
                                type="button"
                                className={classNames("py-2 px-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300 focus:outline-none focus:ring-0", userSettingsState.userSettings.style === 1 && "bg-zinc-700")}
                            >
                                <svg
                                    className={`h-4 w-4 ${userSettingsState.userSettings.style === 1 ? "fill-zinc-100 stroke-zinc-100" : "fill-zinc-500 stroke-zinc-500"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="512"
                                    height="579"
                                    viewBox="0 0 512 579"
                                >
                                    <path d="M448 48C456.8 48 464 55.2 464 64V383.8L459 377.3L323 201.3C318.5 195.4 311.4 192 304 192C296.6 192 289.6 195.4 285 201.3L202 308.7L171.5 266C167 259.7 159.8 256 152 256C144.2 256 137 259.7 132.5 266.1L52.5 378.1L48 384.3V384V64C48 55.2 55.2 48 64 48H448ZM64 0C28.7 0 0 28.7 0 64V384C0 419.3 28.7 448 64 448H448C483.3 448 512 419.3 512 384V64C512 28.7 483.3 0 448 0H64ZM144 192C150.303 192 156.545 190.758 162.369 188.346C168.192 185.934 173.484 182.398 177.941 177.941C182.398 173.484 185.934 168.192 188.346 162.369C190.758 156.545 192 150.303 192 144C192 137.697 190.758 131.455 188.346 125.631C185.934 119.808 182.398 114.516 177.941 110.059C173.484 105.602 168.192 102.066 162.369 99.6538C156.545 97.2416 150.303 96 144 96C137.697 96 131.455 97.2416 125.631 99.6538C119.808 102.066 114.516 105.602 110.059 110.059C105.602 114.516 102.066 119.808 99.6538 125.631C97.2416 131.455 96 137.697 96 144C96 150.303 97.2416 156.545 99.6538 162.369C102.066 168.192 105.602 173.484 110.059 177.941C114.516 182.398 119.808 185.934 125.631 188.346C131.455 190.758 137.697 192 144 192Z" />
                                    <path d="M22 416H490V529C490 544.464 477.464 557 462 557H50C34.536 557 22 544.464 22 529V416Z" fill="transparent" strokeWidth="44" />
                                    <path d="M98 491H414" strokeWidth="37" strokeLinecap="round" />
                                </svg>
                            </button>
                            <button
                                onClick={() => dispatch(userSettingsSlice.actions.setCardStyle(2))}
                                type="button"
                                className={classNames("py-2 px-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300 focus:outline-none focus:ring-0", userSettingsState.userSettings.style === 2 && "bg-zinc-700")}
                            >
                                <svg
                                    className={`h-4 w-4 ${userSettingsState.userSettings.style === 2 ? "fill-zinc-100 stroke-zinc-100" : "fill-zinc-500 stroke-zinc-500"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="512"
                                    height="584"
                                    viewBox="0 0 512 584"
                                >
                                    <path d="M448 48C456.8 48 464 55.2 464 64V519.8L459 513.3L323 337.3C318.5 331.4 311.4 328 304 328C296.6 328 289.6 331.4 285 337.3L202 444.7L171.5 402C167 395.7 159.8 392 152 392C144.2 392 137 395.7 132.5 402.1L52.5 514.1L48 520.3V520V64C48 55.2 55.2 48 64 48H448ZM64 0C28.7 0 0 28.7 0 64V520C0 555.3 28.7 584 64 584H448C483.3 584 512 555.3 512 520V64C512 28.7 483.3 0 448 0H64ZM144 328C150.303 328 156.545 326.758 162.369 324.346C168.192 321.934 173.484 318.398 177.941 313.941C182.398 309.484 185.934 304.192 188.346 298.369C190.758 292.545 192 286.303 192 280C192 273.697 190.758 267.455 188.346 261.631C185.934 255.808 182.398 250.516 177.941 246.059C173.484 241.602 168.192 237.066 162.369 234.654C156.545 232.242 150.303 231 144 231C137.697 231 131.455 232.242 125.631 234.654C119.808 237.066 114.516 241.602 110.059 246.059C105.602 250.516 102.066 255.808 99.6538 261.631C97.2416 267.455 96 273.697 96 280C96 286.303 97.2416 292.545 99.6538 298.369C102.066 304.192 105.602 309.484 110.059 313.941C114.516 318.398 119.808 321.934 125.631 324.346C131.455 326.758 137.697 328 144 328Z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => dispatch(userSettingsSlice.actions.setCardStyle(3))}
                                type="button"
                                className={classNames("py-2 px-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300 focus:outline-none focus:ring-0", userSettingsState.userSettings.style === 3 && "bg-zinc-700")}
                            >
                                <svg
                                    className={`h-4 w-4 ${userSettingsState.userSettings.style === 3 ? "fill-zinc-100 stroke-zinc-100" : "fill-zinc-500 stroke-zinc-500"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="512"
                                    height="579"
                                    viewBox="0 0 512 579"
                                >
                                    <path d="M448 48C456.8 48 464 55.2 464 64V294.8L459 288.3L323 112.3C318.5 106.4 311.4 103 304 103C296.6 103 289.6 106.4 285 112.3L202 219.7L171.5 177C167 170.7 159.8 167 152 167C144.2 167 137 170.7 132.5 177.1L52.5 289.1L48 295.3V295V64C48 55.2 55.2 48 64 48H448ZM64 0C28.7 0 0 28.7 0 64V295C0 330.3 28.7 359 64 359H448C483.3 359 512 330.3 512 295V64C512 28.7 483.3 0 448 0H64Z" />
                                    <path d="M22 318H490V529C490 544.464 477.464 557 462 557H50C34.536 557 22 544.464 22 529V318Z" fill="transparent" strokeWidth="44" />
                                    <path d="M98 419H414" strokeWidth="37" strokeLinecap="round" />
                                    <path d="M98 483H414" strokeWidth="37" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    </>
                )}
                {showDisplay && (
                    <>
                        <div className="flex items-center px-3">
                            {/* <div className="flex items-center bg-zinc-800 rounded-lg px-3 py-2"> */}
                            <span className="text-zinc-400 text-xs mr-2 uppercase">Display type</span>
                            <button
                                onClick={() => typeof setDisplay === 'function' ? setDisplay('carousel') : dispatch(userSettingsSlice.actions.setCardDisplay("carousel"))}
                                type="button"
                                className={classNames("py-1.5 px-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300 focus:outline-none focus:ring-0", (display ? display === 'carousel' : userSettingsState.userSettings.display === "carousel") && "bg-zinc-700")}
                            >
                                <svg
                                    className={`${(display ? display === 'carousel' : userSettingsState.userSettings.display === "carousel") ? "fill-zinc-100 stroke-zinc-100" : "fill-zinc-500 stroke-zinc-500"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    viewBox="0 -960 960 960"
                                    width="24"
                                >
                                    <path d="M80-360v-240q0-33 23.5-56.5T160-680q33 0 56.5 23.5T240-600v240q0 33-23.5 56.5T160-280q-33 0-56.5-23.5T80-360Zm280 160q-33 0-56.5-23.5T280-280v-400q0-33 23.5-56.5T360-760h240q33 0 56.5 23.5T680-680v400q0 33-23.5 56.5T600-200H360Zm360-160v-240q0-33 23.5-56.5T800-680q33 0 56.5 23.5T880-600v240q0 33-23.5 56.5T800-280q-33 0-56.5-23.5T720-360Zm-360 80h240v-400H360v400Zm120-200Z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => typeof setDisplay === 'function' ? setDisplay('grid') : dispatch(userSettingsSlice.actions.setCardDisplay("grid"))}
                                type="button"
                                className={classNames("py-1.5 px-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300 focus:outline-none focus:ring-0", (display ? display === 'grid' : userSettingsState.userSettings.display === "grid") && "bg-zinc-700")}
                            >
                                <svg
                                    className={`${(display ? display === 'grid' : userSettingsState.userSettings.display === "grid") ? "fill-zinc-100 stroke-zinc-100" : "fill-zinc-500 stroke-zinc-500"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    viewBox="0 -960 960 960"
                                    width="24"
                                >
                                    <path d="M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z" />
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}