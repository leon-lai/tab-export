window.addEventListener("load", () => {
	const textarea_URLs = document.getElementById("textarea_URLs");
	const button_openURLs = document.getElementById("button_openURLs");
	button_openURLs.addEventListener("click", () => {
		textarea_URLs.value.trim().split("\n").forEach(url => {
			url=url.trim();
			if(url!==""&&!url.startsWith("#")){
				if(!/^[^:\.]*:[^\.]*\./.test(url)){
					url="http:"+url;
				}
				chrome.tabs.create({active:false,url:url});
			}
		});
	});
	chrome.tabs.query({}, tabs => {
		var urls="";
		tabs.forEach(function(tab){
			urls+=tab.url+"\n";
		});
		textarea_URLs.value=urls;
	});
});
