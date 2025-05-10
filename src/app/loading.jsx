

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFilter, faSort, faMap, faBars, faAngleDown, faAngleUp, faArrowDown, faArrowRight, faPlane, faGripVertical, faPlus, faPen } from "@fortawesome/free-solid-svg-icons";

import "./stylesheets/home.css";

import Link from "next/link";
import CitySelect from "./components/CitySelect";

export default function Loading() {
    return (
        <div>
            {/* <div className="func-row"> */}
                {/* <div className="func-left">
                    <input type="text" className="search-input" placeholder="Search List" style={{ display: "none" }} />
                </div>
                <div className="func-right">
                    <div className="func-each">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="func-each-icon" />
                    </div>
                    <div className="func-each">
                        <FontAwesomeIcon icon={faSort} className="func-each-icon" />
                    </div>
                    <div className="func-each" style={{ marginRight: "85px" }}>
                        <Link href="/map" className="func-each-icon">
                            <FontAwesomeIcon icon={faMap} className="func-each-icon" />
                        </Link>
                    </div> */}
                    {/* <Link href="/login" className="login-button" style={{ marginLeft: "10px" }}>Login</Link> */}
                    {/* <div className="logout-button" style={{ marginLeft: "10px", cursor: "pointer" }}>Logout</div> */}
                {/* </div>
            </div> */}

            <div className={`add-city-row`}>
                <div style={{ display: "flex" }}>
                    <CitySelect isMapPage={false} />
                </div>
                <div className="city-add-button">
                    <FontAwesomeIcon icon={faPlus} className="add-icon" />
                </div>
                <div className="city-edit-button">
                    <FontAwesomeIcon icon={faPen} className="edit-icon" />
                </div>
            </div>
        </div>
    )
  }