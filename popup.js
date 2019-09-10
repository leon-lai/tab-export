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
	chrome.tabs.query({}, async tabs => {
		textarea_URLs.value = (await Promise.all(tabs
		.map(tab => Object.assign(tab, {
			url: decodeURI(tab.url),
		}))
		.map(tab => Object.assign(tab, {
			url: (url => {
				const u = new URL(url);
				// replaces first occurrence
				return url.replace(u.hostname, punycode.toUnicode(u.hostname));
			})(tab.url),
		}))
		.map(async tab => {
			const { hostname: h, pathname: p } = new URL(tab.url);
			if (h === "news.ycombinator.com" && p === "/item") {
				return `${tab.url}##${await new Promise(resolve => {
					chrome.tabs.executeScript(tab.id, {
						code: 'document.querySelectorAll(".athing")[0].textContent.trim()',
					}, resolve);
				})}`
			} else {
				return tab.url;
			}
		})))
		.join("\n");
	});
});
