var stories = document.getElementById('stories');
var back = '<a class="fetched" onclick="flipPage(\'back\');">back</a>';
var next = '| <a class="fetched" onclick="flipPage(\'next\');">next</a>';

//Factory for dynamic elements on the fly
function elementFactory(el, _attr, _attrValue){
	return function(text, _class){
		element = document.createElement(el, _class);
		if (_attr && _attrValue) element.setAttribute(_attr, _attrValue);
		element.setAttribute("class", "fetched");
		if (_class) element.className += ' ' + _class;
		element.innerHTML = text;
		stories.appendChild(element);
	}
}

//Factory for building params
function paramFactory(key) {
	param = "&" + key + "=";
	return function(value){
		return param + value;
	}
}

var baseURL;
var route = '/wp/v2/posts?_embed';
var setPage = paramFactory('page');

var pageNum = window.pageNum = 1;
function flipPage(direction){
	switch(direction){
		case 'back':
			pageNum++;
			requestContent();
			break;
		case 'next':
			pageNum--;
			requestContent();
	}
}

function setWebsite(){
	baseURL = document.getElementById('website').value;
	if (baseURL.substring(0, 7) != 'http://') baseURL = 'http://' + baseURL;
	if (baseURL[baseURL.length - 1] == '/') baseURL = baseURL.substring(0, baseURL.length - 1);
	console.log(baseURL.substring(0, baseURL.length - 1));
	baseURL += '/wp-json';
	
	requestContent();
	requestTitle();
}

//Instantiate factories as closures
createH1 = elementFactory('H1');
createH3 = elementFactory('H3');
createDiv = elementFactory('DIV');
createHr = elementFactory('HR');
createBack = elementFactory('A', 'onclick', "flipPage('back')");
createNext = elementFactory('A', 'onclick', "flipPage('next')");
createPage = elementFactory('SPAN');

const requestContent = async () => {
		console.log('Requested page ' + pageNum);
		console.log(baseURL + route + setPage(pageNum));
    const response = await fetch(baseURL + route + setPage(pageNum));
    const json = await response.json();
    stories.innerHTML = '';
    for (let post of json) {
			createH1(post.title.rendered);
			createH3('by ' + post._embedded.author[0].name);
			createDiv(post.excerpt.rendered);
			createDiv(post._embedded['wp:term'][0][0].slug);
			createHr('');
		}
		pageNum != 1 ? createNext('newer', 'third left') : createDiv('', 'third left');
		createPage(pageNum, 'third center');
		createBack('older', 'third right');
		
}

const requestTitle = async () => {
    const response = await fetch(baseURL);
    const json = await response.json();
    document.getElementById('title').innerHTML = json.name;
}


