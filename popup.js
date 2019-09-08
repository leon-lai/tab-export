addEventListener("load", () => {
	const textarea_URLs = document.getElementById("textarea_URLs");
	const button_openURLs = document.getElementById("button_openURLs");
	button_openURLs.addEventListener("click", () => {
		textarea_URLs.value.split("\n")
		.map(line => line.trim())
		.filter(line => line && ! line.startsWith("#"))
		// scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
		// <https://doi.org/10.17487/RFC3986>
		.map(url => /^[a-z][a-z0-9+\-.]*:/i.test(url) ? url : `http://${url}`)
		.reduce(async (dependency, url) => {
			await dependency;
			await new Promise(resolve => {
				chrome.tabs.create({
					active: false,
					url: url,
				}, resolve);
			});
		}, undefined);
	});
	chrome.tabs.query({}, tabs => {
		textarea_URLs.value = tabs.map(tab => tab.url).join("\n");
	});
});
