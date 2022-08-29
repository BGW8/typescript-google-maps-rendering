import axios from "axios";
const form = document.querySelector("form")!;
const addressInput = document.querySelector("#adress")! as HTMLInputElement;

//TODO: Create an environment variable to store the key in.
const GOOGLE_API_KEY = "INSERT_YOUR_API_KEY_HERE";

type GoogleGeocodingResponse = {
	results: { geometry: { location: { lat: number; lng: number } } }[];
	status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
	event.preventDefault();
	const enteredAddress = addressInput.value;
	axios
		.get<GoogleGeocodingResponse>(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
				enteredAddress
			)}&key=${GOOGLE_API_KEY}`
		)
		.then((response) => {
			if (response.data.status !== "OK") {
				throw new Error("could not fetch location");
			}
			const coordinates = response.data.results[0].geometry.location;

			const map = new google.maps.Map(
				document.getElementById("map") as HTMLElement,
				{
					center: coordinates,
					zoom: 12,
				}
			);

			new google.maps.Marker({ position: coordinates, map: map });
		})
		.catch((err) => {
			alert(err.message);
			console.log(err);
		});
}

form.addEventListener("submit", searchAddressHandler);
