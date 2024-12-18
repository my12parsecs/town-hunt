import GeoNames from "geonames.js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cityName = searchParams.get("name");
  console.log("API engaged");
  console.log(cityName);

  if (cityName !== "") {
    const geonames = GeoNames({
      username: process.env.GEONAMES_USERNAME,
      lan: "en",
      encoding: "JSON",
    });

    try {
      // featureClass is for the type of object (P for cities, T for mountains, etc.)
      // maxRows limits the number of results, fuzzy allows for misspellings
      const result = await geonames.search({
        q: cityName,
        featureClass: "P",
        maxRows: "7",
        fuzzy: "0.5",
      });

      console.log("API finished");
      return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  } else {
    return new Response(JSON.stringify({ error: "City name is required" }), { status: 400 });
  }
}
