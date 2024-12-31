import GeoNames from "geonames.js";

export async function GET(request) {
  console.log("API started");
  
  const { searchParams } = new URL(request.url);
  const cityName = searchParams.get("name");
  const lang = searchParams.get("lang");

  console.log(cityName);

  if (cityName !== "") {
    const geonames = GeoNames({
      username: process.env.GEONAMES_USERNAME,
      lan: "en",
      encoding: "JSON",
    });

    try {
      // featureClass is for the type of object (P for cities, T for mountains, etc.)
      // http://www.geonames.org/export/codes.html
      // P - city, village
      // T - mountain, hill, rock
      // H - stream, lake
      // L - parks, area
      // R - road, railroad
      // S - spot, building, farm
      // U - undersea
      // V - forest, heath
      // maxRows limits the number of results, fuzzy allows for misspellings
      const result = await geonames.search({
        q: cityName,
        featureClass: ["P", "T", "H", "L", "R", "S", "U", "V"],
        // featureClass: "P",
        maxRows: "7",
        fuzzy: "0.4",
        lang: lang
      });

      console.log("API finished");
      console.log(result);
      
      return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  } else {
    return new Response(JSON.stringify({ error: "City name is required" }), { status: 400 });
  }
}
