
import Link from "next/link"

import "../stylesheets/trips.css"

export default function Trips() {

    return (
        <div className="trips-page">
            <div className="trips-nav"></div>

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