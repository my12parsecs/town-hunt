
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

import "../stylesheets/trips.css"

export default function Trips() {

    return (
        <div className="trips-page">
            {/* <div className="trips-nav"></div> */}
            <div className="trips-nav">
                <div style={{marginTop: "20px", marginBottom: "20px"}}><Link href="/"><FontAwesomeIcon icon={faAngleLeft} style={{width: "20px", height: "20px"}} /></Link></div>
            </div>

            <h1>Trips</h1>

            <div className="trips-list">
                <Link href="/trips/us-road-trip" className="trips-each">
                    <div className="trips-title">US Road Trip</div>
                    <div className="trips-date">Nov13~30</div>
                    <div className="trips-country">United States, Canada</div>
                </Link>
                <div className="trips-each">
                    <div className="trips-title"></div>
                </div>
            </div>
        </div>
    )

}