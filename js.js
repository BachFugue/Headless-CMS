var container = document.getElementById('container');

//Factory for dynamic elements on the fly
function elementFactory(el){
	return function(text){
		element = document.createElement(el);
		element.innerHTML = text;
		container.appendChild(element);
	}
}

//Instantiate factories as closures
createH1 = elementFactory('H1');
createH3 = elementFactory('H3');
createDiv = elementFactory('DIV');
createHr = elementFactory('HR');

// AJAX call to WP-JSON REST API
fetch('http://flatheadbeacon.staging.wpengine.com/wp-json/wp/v2/posts?_embed')
.then(res => res.json())
.then(data => {
	for (let post of data) {
		console.log(post);
		createH1(post.title.rendered);
		createH3('by ' + post._embedded.author[0].name);
		createDiv(post.excerpt.rendered);
		createDiv(post._embedded['wp:term'][0][0].slug);
		createHr('');
	}
});