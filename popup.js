window.addEventListener("load", () => {
	const textarea_URLs = document.getElementById("textarea_URLs");
	const button_openURLs = document.getElementById("button_openURLs");
	button_openURLs.addEventListener("click", () => {
		textarea_URLs.value.split("\n")
		.map(line => line.trim())
		.filter(line => line && ! line.startsWith("#"))
		.map(url => /^[^:\.]*:[^\.]*\./i.test(url) ? url : `http://${url}`)
		.forEach(url => {
				chrome.tabs.create({active:false,url:url});
		});
	});
	chrome.tabs.query({}, tabs => {
		textarea_URLs.value = tabs.map(tab => tab.url).join("\n");
	});
});
