document.addEventListener("DOMContentLoaded", function() {

/* url of song api --- https versions hopefully a little later this semester */	
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';
	
	//retrieve api and stores in localStorage
	let getFile = [];

	if(localStorage.length != 0){
    getFile = localStorage.getItem('key');

	} else {


	file = fetch(api)
		.then((response => response.json()))
		.then((data) => {
      		const json = JSON.stringify(data);
      		localStorage.setItem('key', json);
      		getFile = json;
		});

	}
	
	//parse json data into arrays.
	artists = JSON.parse(content); 
	genres = JSON.parse(genreContent); 
	songs = JSON.parse(getFile); 
	playlist = [];
	
	//display credits when user hovers over div with mouse and disappears after 5 seconds.
	const credits = document.querySelector("#credits");

	credits.onmouseover = function() {mouseOver()};
	credits.onmouseout = function() {setTimeout(mouseOut, 5000)};

	//display name and github link
	function mouseOver() {
  		//credits.innerHTML='<p>Author: Danvy Nguyen</p><a href="https://github.com/danvynguyen/danvynguyen.github.io">Github Link</a>';
		showCredits();
	}

	//when user stops hovering over credits, div will return to defualt credit label
	function mouseOut() {
  		credits.innerHTML="Credits";
	}

	//buttons to be displayed on right hand corner.
	
	//displays playlist when button is pressed.
	document.querySelector('#playlistButton').onclick = function(){outputPlaylist()};
	
	//closes playlist when button is pressed.
	const buttons = document.querySelectorAll('#closeViewButton');
	for (let btn of buttons){
		btn.onclick = function(){outputSearch()};
	}
	
	//display artist dropdown menu
	const aSelect = document.querySelector("#artistInput");
	for (let a of artists){
		const aOption = document.createElement("option");
		aOption.setAttribute("value", a.name);	
		aOption.innerHTML = a.name;
		aSelect.appendChild(aOption);
	}
	
	//display genre dropdown menu
	const gSelect = document.querySelector("#genreInput");
	for (let g of genres){
		const gOption = document.createElement("option");
		gOption.setAttribute("value", g.name);	
		gOption.innerHTML = g.name;
		gSelect.appendChild(gOption);
	}
	
	//displays all songs by default
	const songTable = document.querySelector("#songResults");
	outputSongList(songTable, songs);
	
	//outputs filter results when filter button is pressed.
	const filter = document.querySelector("#filterButton");
	filter.onclick = function(){outputResults()};
	
	//clears search form
	const clear = document.querySelector("#clearButton");
	clear.addEventListener("click", clearResults);

	//<-----all output functions---->
	
	//creates and outputs a list of all songs in list param and appends to table param.
	function outputSongList(table, list){
		
		const headerRow = document.createElement("tr");
		
		const titleHeader = document.createElement("th");
		titleHeader.textContent="Title";
		titleHeader.addEventListener("click", function(){sortTable(0)});
		headerRow.appendChild(titleHeader);
		
		const artistHeader = document.createElement("th");
		artistHeader.textContent="Artist";
		artistHeader.addEventListener("click", function(){sortTable(1)});
		headerRow.appendChild(artistHeader);
		
		const yearHeader = document.createElement("th");
		yearHeader.textContent="Year";
		yearHeader.addEventListener("click", function(){sortTable(2)});
		headerRow.appendChild(yearHeader);
		
		const genreHeader = document.createElement("th");
		genreHeader.textContent="Genre";
		genreHeader.addEventListener("click",function(){sortTable(3)});
		headerRow.appendChild(genreHeader);
		
		const popHeader = document.createElement("th");
		popHeader.textContent="Popularity";
		popHeader.addEventListener("click",function(){sortTable(4)});
		headerRow.appendChild(popHeader);
		
		//style so all headers are centered.
		const ths = document.querySelectorAll("th");
		for (let th of ths) {
			th.style.textAlign="center";
		}
		
		table.appendChild(headerRow);
		
		for (let r of list) {
			let tr2 = document.createElement('tr');
			tr2.setAttribute("class", "song");
			
			const title = document.createElement("td");
			title.textContent = r.title;
			title.addEventListener("click", function() {viewSingleSong(r)});
			title.onmouseover=function(){title.style.textDecoration = "underline"};
			title.onmouseout=function(){title.style.textDecoration = "none"};
			title.style.cursor="pointer";
			tr2.appendChild(title);
		
			const artist = document.createElement("td");
			artist.textContent = r.artist.name;
			tr2.appendChild(artist);
		
			const year = document.createElement("td");
			year.textContent = r.year;
			tr2.appendChild(year);
		
			const genre = document.createElement("td");
			genre.textContent = r.genre.name;
			tr2.appendChild(genre);
		
			const popularity = document.createElement("td");
			popularity.textContent = r.details.popularity;
			tr2.appendChild(popularity);
			
			const addButton = document.createElement("button");
			addButton.textContent = "Add";
			addButton.onclick = function() {
				add(r);
			};
		
			tr2.appendChild(addButton);
			table.appendChild(tr2);
		}
		
	}
	
	//hides all elements except for search and results.
	function outputSearch(){
		if (document.querySelector("#song-search").getAttribute('class')=='hidden'){
			document.querySelector("#song-search").classList.remove('hidden');
		}
		if (document.querySelector("#song-results").getAttribute('class')=='hidden'){
			document.querySelector("#song-results").classList.remove('hidden');
		}
		if (document.querySelector("#playlist").getAttribute('class')!='hidden') {
			document.querySelector("#playlist").classList.toggle('hidden');
		}
		if (document.querySelector("#song-data").getAttribute('class')!='hidden'){
			document.querySelector("#song-data").classList.toggle('hidden');
		}
		
		//resets table
		while (table.hasChildNodes()) {
    		table.removeChild(table.firstChild);
  		}
		
		//displays all songs by default
		const songTable = document.querySelector("#songResults");
		outputSongList(songTable, songs);
	}
	
	//outputs results based on user specified filters.
	function outputResults(){
		
		//displays search results, if previously hidden.
		if (document.querySelector("#song-results").getAttribute('class')=='hidden'){
			document.querySelector("#song-results").classList.remove('hidden');
		}
		
		const table = document.querySelector('#songResults');
		
		//resets table: gets rid of existing results before outputiing new results.
		while (table.hasChildNodes()) {
    		table.removeChild(table.firstChild);
  		}
		
		//checks which radio buttons are pressed and filters based on user specifications.
		let results = [];	
		if (document.querySelector('#titleButton').checked==true){
			results = songs.filter(s=>s.title.toLowerCase().includes(document.getElementById('titleInput').value.toLowerCase()));
			console.log(document.getElementById('titleInput').value);
		}
		else if (document.querySelector("#artistButton").checked==true){
			results = songs.filter(s=>s.artist.name==document.getElementById('artistInput').value);
			console.log(document.getElementById('artistInput').value);
		}
		else if (document.querySelector('#genreButton').checked==true){
			results = songs.filter(s=>s.genre.name==document.getElementById("genreInput").value);
			console.log(document.getElementById('genreInput').value);
		}
		
		//output song list of the results
		outputSongList(table, results);

	}
	
	//outputs playlist
	function outputPlaylist() {
		
		//hides all other views except playlist view
		if (document.querySelector("#song-search").getAttribute('class')!='hidden'){
			document.querySelector("#song-search").classList.toggle('hidden');
		}
		if (document.querySelector("#song-results").getAttribute('class')!='hidden'){
			document.querySelector("#song-results").classList.toggle('hidden');
		}
		if (document.querySelector("#playlist").getAttribute('class')=='hidden') {
			document.querySelector("#playlist").classList.remove('hidden');
		}
		if (document.querySelector("#song-data").getAttribute('class')!='hidden'){
			document.querySelector("#song-data").classList.toggle('hidden');
		}
		
		//displays number of songs in playlist
		document.querySelector("#numSongs").innerHTML=playlist.length+" songs:";
		
		//clears all songs in playlist when clicked.
		document.querySelector("#clearPlaylistButton").addEventListener('click',function(){
			playlist=[];
			table.remove();
			outputPlaylist();
		});
		
		const table = document.querySelector('#playlistDetails');

		const headerRow = document.createElement("tr");
		
		const titleHeader = document.createElement("th");
		titleHeader.textContent="Title";
		titleHeader.addEventListener("click", function(){sortTable(0)});
		headerRow.appendChild(titleHeader);
		
		const artistHeader = document.createElement("th");
		artistHeader.textContent="Artist";
		artistHeader.addEventListener("click", function(){sortTable(1)});
		headerRow.appendChild(artistHeader);
		
		const yearHeader = document.createElement("th");
		yearHeader.textContent="Year";
		yearHeader.addEventListener("click", function(){sortTable(2)});
		headerRow.appendChild(yearHeader);
		
		const genreHeader = document.createElement("th");
		genreHeader.textContent="Genre";
		genreHeader.addEventListener("click",function(){sortTable(3)});
		headerRow.appendChild(genreHeader);
		
		const popHeader = document.createElement("th");
		popHeader.textContent="Popularity";
		popHeader.addEventListener("click",function(){sortTable(4)});
		headerRow.appendChild(popHeader);
		
		//style so all headers are centered.
		const ths = document.querySelectorAll("th");
		for (let th of ths) {
			th.style.textAlign="center";
		}
		
		table.appendChild(headerRow);
		
		if (document.querySelectorAll(".song").length>0){
			for (let i=0; i<=document.querySelectorAll(".song").length;i++){
				console.log(document.querySelectorAll(".song").length);
				table.deleteRow(-1);
			}
		}
		for (let r of playlist) {
			let tr2 = document.createElement('tr');
			const title = document.createElement("td");
			title.textContent = r.title;
			title.addEventListener("click", function() {viewSingleSong(r)});
			title.onmouseover=function(){title.style.textDecoration = "underline"};
			title.onmouseout=function(){title.style.textDecoration = "none"};
			title.style.cursor="pointer";
			tr2.appendChild(title);
		
			const artist = document.createElement("td");
			artist.textContent = r.artist.name;
			tr2.appendChild(artist);
		
			const year = document.createElement("td");
			year.textContent = r.year;
			tr2.appendChild(year);
		
			const genre = document.createElement("td");
			genre.textContent = r.genre.name;
			tr2.appendChild(genre);
		
			const popularity = document.createElement("td");
			popularity.textContent = r.details.popularity;
			tr2.appendChild(popularity);
		
			const removeButton = document.createElement("button");
			removeButton.textContent = "Remove";
			removeButton.onclick = function() {				
				playlist.splice(playlist.indexOf(r),1);
				console.log(playlist.length);
				console.log(playlist.indexOf(r));
				outputPlaylist();
			};
			
			tr2.appendChild(removeButton);
			table.appendChild(tr2);
		} 
	}

	//<------all helper functions------>
	
function addbutton(tr2,table) {
	const addButton = document.createElement("button");
		addButton.textContent = "Add";
		addButton.onclick = function() {
			if (playlist.includes(r)!=true){
				playlist.push(r);	
				showSnackBar(`${r.title} was added to playlist`);
			}
		};
		
		tr2.appendChild(addButton);
		table.appendChild(tr2);
}
	
function add(r){
	if (playlist.includes(r)!=true){
		playlist.push(r);	
		showSnackBar(`${r.title} was added to playlist`);
	}
}		

function clearResults(){  
   	document.getElementById("form").reset();  
}  


// code adpated from: https://www.w3schools.com/howto/howto_js_sort_table.asp 
function sortTable(n) {
	let switchcount = 0;
  	const table = document.querySelector("#songResults");
  	let switching = true;
  	let direction = "ascending";
  	while (switching) {
    	switching = false;
    	let rows = table.rows;
    	for (i = 1; i < (rows.length - 1); i++) {
     		let shouldSwitch = false;
      		let currentRow = rows[i].getElementsByTagName("td")[n];
      		let nextRow = rows[i + 1].getElementsByTagName("td")[n];
      		if (direction == "ascending") {
        		if (currentRow.innerHTML.toLowerCase() > nextRow.innerHTML.toLowerCase()) {
          			shouldSwitch = true;
          			break;
        		}
      		} else if (direction == "descending") {
        		if (currentRow.innerHTML.toLowerCase() < nextRow.innerHTML.toLowerCase()) {
          			shouldSwitch = true;
          			break;
        	}
      	}
    }
    if (shouldSwitch) {
      	table.insertBefore(rows[i + 1], rows[i]);
      	switching = true;
      	switchcount ++;
    } else {
		if (switchcount == 0 && direction == "ascending") {
        	direction = "descending";
			switching = true;
      	}
    }
  }
}
	//displays song info and radarchart when user clicks on title
	function viewSingleSong(song) {
		//document.querySelector(".song-search").innerHTML="<h2>"+ title +", " +artist+", "+type+", "+genre+", "+year+", "+duration+"</h2>";
		if (document.querySelector("#song-search").getAttribute('class')!='hidden'){
			document.querySelector("#song-search").classList.toggle('hidden');
		}
		if (document.querySelector("#song-results").getAttribute('class')!='hidden'){
			document.querySelector("#song-results").classList.toggle('hidden');
		}
		if (document.querySelector("#playlist").getAttribute('class')!='hidden') {
			document.querySelector("#playlist").classList.toggle('hidden');
		}
		if (document.querySelector("#song-data").getAttribute('class')=='hidden'){
			document.querySelector("#song-data").classList.remove('hidden');
		}
		
		//find artist type
		let type = "";
		for (let artist of artists){
			if (song.artist.name==artist.name) {
				type = artist.type;
			}
		}
		
		//find song duration by minutes and seconds
		const minutes = Math.floor(song.details.duration / 60);
		const seconds = song.details.duration % 60;
		let duration = "";
		
		//if second less than 10 add 0 in front of seconds, else display as it.
		if (seconds < 10) {
			duration=minutes+":0"+seconds;
		}
		else {
			duration=minutes+":"+seconds;
		}
		
		// header details
		document.querySelector("#song-header").textContent=song.title +", " +song.artist.name+" ("+type+"), "+song.genre.name+", "+song.year+", "+duration+" minutes";
		
		//song details/analytics
		document.querySelector("#bpm").textContent="BPM:  "+song.details.bpm;
		document.querySelector("#energy").textContent="Energy:  "+song.analytics.energy;
		document.querySelector("#danceability").textContent="Danceability:  "+song.analytics.danceability;
		document.querySelector("#liveness").textContent="Liveness:  "+song.analytics.liveness;
		document.querySelector("#valence").textContent="Valence:  "+song.analytics.valence;
		document.querySelector("#acoustics").textContent="Acoustics:  "+song.analytics.acousticness;
		document.querySelector("#speechiness").textContent="Speechiness:  "+song.analytics.speechiness;
		document.querySelector("#popularity").textContent="Popularity:  "+song.details.popularity;
		
		//radarchart
		var infoCanvas = document.getElementById("infoChart");

		//insert data into radarchart
		var songData = {
  			labels: ["Danceability", "Energy", "Speechiness", "Acousticness", "Liveness", "Valence"],
  			datasets: [{
    			label: song.title,
				color: "black",
    			backgroundColor: "rgba(200,0,0,0.2)",
    			data: [song.analytics.danceability, song.analytics.energy, song.analytics.speechiness, song.analytics.acousticness, song.analytics.liveness, song.analytics.valence]
  			}],
			options: {
				scale: {
      				gridLines: {
        			color: 'black'
      				},
      				angleLines: {
        			color: 'black'
      				}
    			},
			},
		};
		
		//creates radar chart
		var radarChart = new Chart(infoCanvas, {
  			type: 'radar',
  			data: songData
		});
		
	}
	
	//display snackbar
	function showSnackBar(message) {
      const snack = document.querySelector("#snackbar");
      snack.textContent = message;
      snack.classList.add("show");
      setTimeout( () => {
         snack.classList.remove("show");
      }, 3000);
   }
	
	function showCredits() {
      const credits = document.querySelector("#snackbar");
      credits.innerHTML = '<p>Author: Danvy Nguyen</p><a href="https://github.com/danvynguyen/danvynguyen.github.io">Github Link</a>';
      credits.classList.add("show");
      setTimeout( () => {
         credits.classList.remove("show");
      }, 5000);
   }
	
	
});