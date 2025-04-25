



export default function Header() {
    return (
        <div className="header">
            <div className="func-row">
                <div className="func-left">
                    <input type="text" className="search-input" placeholder="Search List" style={isSearching ? { display: "flex" } : { display: "none" }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} ref={searchInputRef} />
                </div>
                <div className="func-right">
                    <div className="func-each">
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="func-each-icon"
                        ref={searchInputButtonRef}
                        onClick={() => {
                        // !setIsSearching(!isSearching);
                        setIsSearching((prev) => !prev);
                        setSearchQuery("");
                        }}
                    />
                    </div>
                    {/* <div className="func-each">
                    <FontAwesomeIcon icon={faFilter} className="func-each-icon" />
                    </div> */}
                    <div className="func-each" ref={sortMenuRef}>
                    <FontAwesomeIcon
                        icon={faSort}
                        className="func-each-icon"
                        onClick={() => setSortMenu(!sortMenu)}
                        // onClick={() => setSortType((prev) => (prev === "name" ? null : "name"))}
                    />
                    <div className="dropdown-menu" style={sortMenu ? { display: "block" } : { display: "none" }}>
                        <div className="dropdown-each" onClick={() => setSortType({ type: "name", nameOrder: !sortType.nameOrder, countryOrder: sortType.countryOrder })}>
                        {sortType.nameOrder ? <FontAwesomeIcon icon={faAngleDown} className="sort-menu-each-icon" /> : <FontAwesomeIcon icon={faAngleUp} className="sort-menu-each-icon" />}Name
                        </div>
                        <div className="dropdown-each" onClick={() => setSortType({ type: "country", nameOrder: sortType.nameOrder, countryOrder: !sortType.countryOrder })}>
                        {sortType.countryOrder ? <FontAwesomeIcon icon={faAngleDown} className="sort-menu-each-icon" /> : <FontAwesomeIcon icon={faAngleUp} className="sort-menu-each-icon" />}Country
                        </div>
                    </div>
                    </div>
                    <div className="func-each">
                    <Link href="/map" className="func-each-icon">
                        <FontAwesomeIcon icon={faMap} className="func-each-icon" />
                    </Link>
                    </div>
                    {!sessionData?.googleId && (<Link href={`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/google`} className="func-each" style={{marginLeft: "10px"}}>Login</Link>)}
                    {/* {data?.googleId && (<Link href={`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/logout`} className="func-each" style={{marginLeft: "10px"}}>Logout</Link>)} */}
                    {sessionData?.googleId && (<div onClick={()=>logout()} className="func-each" style={{marginLeft: "10px", cursor: "pointer"}}>Logout</div>)}

                    {/* <div className="func-each" ref={dropdownRef}>
                    <FontAwesomeIcon icon={faBars} className="func-each-icon" onClick={() => setDropdown(!dropdown)} />
                    <div className="dropdown-menu" style={dropdown ? { display: "block" } : { display: "none" }}>
                        <div className="dropdown-each" onClick={() => router.push("/about")}>
                        <FontAwesomeIcon icon={faCircleInfo} className="dropdown-each-icon" />
                        About
                        </div>
                        <div className="dropdown-each" onClick={() => router.push("/trips")}>
                        <FontAwesomeIcon icon={faPlane} className="dropdown-each-icon" />
                        Trips
                        </div>
                        <div className="dropdown-each" onClick={() => window.open("https://github.com/my12parsecs/town-hunt", "_blank")}>
                        <FontAwesomeIcon icon={faGithub} className="dropdown-each-icon" />
                        GitHub
                        </div>
                    </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}