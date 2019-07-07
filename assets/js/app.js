// default array to hold giphy buttons
var topics = ['Pokemon', 'Spongebob', 'GoT', 'LOL', 'Wow', 'Mhmm'];

// when page loads, get and parse items from local storage
var storedArray = JSON.parse(localStorage.getItem('topics'));

// get items from localstorage
function getSavedOptions() {

  // get and parse items from localstorage
  var storedArray = JSON.parse(localStorage.getItem('topics'));

  // if localstorage is empty, push default options into array
  if (storedArray === null) {
    localStorage.setItem('topics', JSON.stringify(topics));
  } else {
    console.log(`getSavedOptions(): got items from storedArray ${storedArray}`);
  }
  console.log(`storedArray: ${storedArray}`);
};

// display gifs when button is clicked
function displayGiphy() {
  $('#content').empty();
  $('#title').text('Loading Gifs...');

  // when user presses a giphy button, search and display giphy
  event.preventDefault();
  var searchQuery = $(this).attr('data-name'); 
  console.log(`Search Query: ${searchQuery}`);

  var apiKey = 'FYvzSNBBiaOqf3rAD8ALeaoV0S69Qi29';
  var imgRating = 'PG-13';
  var apiRoute = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchQuery}&limit=30&offset=0&rating=${imgRating}&lang=en`;

  // async get method; call giphy api
  $.get({
    url: apiRoute
  }).done(function(response) {

    // if no reponse, let user know nothing was found
    if (response.data.length === 0) {
      $('#title').text('No Gifs Found :(');
    } else {

      // if response, loop through array of gifs and create rows to contain gifs
      for (var i = 0; i < response.data.length; i++) {
        if (i % 3 == 0) {
          var createRow = $('<div>');
          createRow.addClass('row');
          $('#content').append(createRow);
        }
        var div = $('<div>');
        div.addClass('col-sm-4');

        // create images
        var tempImg = $('<img>');
        tempImg.addClass(`gif gif-${i} m-2 border`);
        tempImg.attr('src', response.data[i].images.fixed_width_still.url);
        tempImg.attr('data-still', response.data[i].images.fixed_width_still.url);
        tempImg.attr('data-animate', response.data[i].images.fixed_width.url);
        tempImg.attr('data-state', 'still');
        div.append(tempImg);

        // create ratings
        // var tempText = $('<div>');
        // tempText.addClass('gif-text');
        // tempText.text(`Rating: ${response.data[i].rating.toUpperCase()}`);
        // div.append(tempText);

        // add divs to rows
        $(createRow).append(div);
      }

      // let user know that gifs can be animated by clicking on them; when gif is clicked, toggle between still and animated sources
      $('#title').text('Click Gifs to Animate!');
      $('.gif').on('click', function () {
        var state = $(this).attr('data-state');

        if (state === 'still') {
          var animate = $(this).attr('data-animate');
          $(this).attr('src', animate);
          var ani = $(this).attr('data-state', 'animate');
        } else if (state === 'animate') {
          var still = $(this).attr('data-still');
          $(this).attr('src', still);
          $(this).attr('data-state', 'still');
        }
        console.log(`Img state: ${state}`);
      });
    }

    // if response failed, let user know
  }).fail(function(response){
    $('#title').text('Sorry, unable to search for that :(');
  });
};

// dynamically create and display buttons from localstorage
function displayButtons() {
  $('#buttons-view').empty();

  // get, parse, loop, and display items in local storage as buttons
  var storedArray = JSON.parse(localStorage.getItem('topics'));

  for (var i = 0; i < storedArray.length; i++) {
    var createButton = $('<button>');
    createButton.addClass('giphy btn btn-danger');
    createButton.attr('data-name', storedArray[i]);
    createButton.text(storedArray[i]);
    $('#buttons-view').append(createButton);
  }
};

// when user adds a new giphy button
$('#add-giphy').on('click', function (event) {
  event.preventDefault();
  var storedArray = JSON.parse(localStorage.getItem('topics'));

  // get user input
  var userInput = $('#giphy-input').val().trim();
  var userInputToLower = userInput.toLowerCase();
  console.log(`userInput: ${userInput}`);
  
  // make check case insensitive
  var isItemInArray = false;
  storedArray.forEach(topicToLower);
  function topicToLower(item) {
    item = item.toLowerCase();
    if (userInputToLower === item) {
      isItemInArray = true;
    }
  }

  // prevent user from adding blank or same string
  if (userInput === '') {
    $('#title').text('Nothing to add! Type something in!');
  } else if (isItemInArray === true) {
    $('#title').text(`That topic already exists!`);
  } else {

    // push userInput into array and save to localstorage
    storedArray.push(userInput);
    localStorage.setItem('topics', JSON.stringify(storedArray));
    console.log(`localstorage setItem: ${storedArray}`);

    // let user know that a button has been added
    $('#title').text(`${userInput} has been added!`);
  }

  // display buttons and clear input field
  displayButtons();
  $('#giphy-input').val('');
});

// when user presses reset, clear out localstorage and show default items
$('#reset-button').on('click', function() {
  localStorage.clear();
  getSavedOptions();
});

// Generic function for displaying the giphy images
$(document).on('click', '.giphy', displayGiphy);

// when page loads, check localstorage for saved items and display them
getSavedOptions();
displayButtons();