window.addEventListener("load", function(){
	var textarea_URLs=document.getElementById("textarea_URLs");
	var button_openURLs=document.getElementById("button_openURLs");
	button_openURLs.addEventListener("click", function(){
		textarea_URLs.value.trim().split("\n").forEach(function(url){
			url=url.trim();
			if(url!==""&&!url.startsWith("#")){
				if(!/^[^:\.]*:[^\.]*\./.test(url)){
					url="http:"+url;
				}
				chrome.tabs.create({active:false,url:url});
			}
		});
	});
	chrome.tabs.query({},function(tabs){
		var urls="";
		tabs.forEach(function(tab){
			urls+=tab.url+"\n";
		});
		textarea_URLs.value=urls;
	});
});
