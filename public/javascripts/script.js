
$(function(){

  // Add a listener for input text; listen for Enter key.
  // Send POST request to create new place

  $("#new_place").keypress(function(event){
    var placename = $(this).val();
    if (event.which == 13 && placename ) {   //if user presses Enter and $(this).val has a value
      addNewPlace(placename);
    }
  });


  // Add listener to input checkboxes. As input checkboxes are checked and unchecked,
  // send PUT request to update the visited value of the place with the corresponding ID
  $('.visited').click(addCheckListener);


  // Add listener to delete buttons. Send DELETE request to delete place when clicked.
  $('.delete').click(addDeleteListener);


});

// Listener functions, added to the existing elements ar the



function addDeleteListener() {
    var elem_id = $(this).attr('id');
    var id = elem_id.replace('_delete', '');
    deletePlace(id);
}


function addCheckListener() {
  var visited = $(this).is(':checked');
  var elem_id = $(this).attr('id');
  var id = elem_id.replace('_is_visited', '');
  updateVisited(id, visited);
}

// These functions make AJAX calls

function addNewPlace(placename){

  $.ajax({
    method:"POST",
    url:"/",
    data: { "name" : placename }
  }).done(function(data){

    console.log('POST complete');

    var html = '<div id="'+ data.id + '"><span class="placename">'+ placename +'</span> <label class="visited_label" for="' + data.id + '_is_visited">Visited?</label>' +
    ' <input id="' + data.id + '_is_visited" class="visited" type="checkbox"> ' +
      '<button id="'+ data.id + '_delete" class="delete">Delete?</button></div>';

    $('#place_list').append(html);
    $('#new_place').val('');        // Clear input text box

    // Update listeners
    var new_checkbox_id = '#' +data.id + '_is_visited';
    var new_delete_id = '#' +data.id + '_delete';

    $(new_checkbox_id).click(addCheckListener);
    $(new_delete_id).click(addDeleteListener);

    //Alternative - remove all listeners with $('button').off() then reattach to all with $('button').click(function);


  }).fail(function(error){
    console.log('POST Error');
    console.log(error);
  });

}


function updateVisited(id, visited) {

  $.ajax({
    method:"PUT",
    url:"/",
    data:{ "id":id, "visited":visited }
  }).done(function(){
    console.log('PUT complete');  // Could update the page here, if needed
  }).fail(function(error){
    console.log('PUT error');
    console.log(error)
  });
}


function deletePlace(id) {

  $.ajax({
    method: "DELETE",
    url: "/",
    data: { 'id': id }
  }).done(function (data) {
    console.log('DELETE complete');
    // Select div containing this item, and remove from page
    var selector_id = '#' + data.id + "";
    $(selector_id).fadeOut(function(){
      $(this).remove();
    });
  }).fail(function (error) {
    console.log('DELETE error');
    console.log(error);
  });
}

