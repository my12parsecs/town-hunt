

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPlus } from "@fortawesome/free-solid-svg-icons";

import "../stylesheets/map.css";
import CitySelect from "../components/CitySelect";





export default function Loading() {


    return (
        <div className="map-page">
            <a href="/" className="home-button">
                <FontAwesomeIcon icon={faHome} className="home-icon" />
            </a>

            <div className="map-add-city-row" style={{ position: "absolute", bottom: "15px", left: "50%", transform: "translateX(-50%)" }}>
                <div style={{ display: "flex" }}>
                    <CitySelect isMapPage={true} />
                </div>
                <div className="map-city-add-button">
                    <FontAwesomeIcon icon={faPlus} className="map-add-icon" />
                </div>
            </div>
        </div>
    )
}