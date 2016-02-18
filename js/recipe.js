/**
 * Created by Andrew on 10/22/2015.
 */

$(document).ready(function () {

//    Direction List Item Finished Click
    $('.list-group-item.selectable').click(function () {
        $(this).toggleClass('list-group-item-success')
    });

    //Ingredient List Notes
    $('.list-group-item').popover();

    //
    //Recipe Note Section
    //
    // Add Note
    $('.new-note-btn').click(function () {
        // Get Note
        var note = $(this).prev('input').val();
        // Clear Input
        $(this).prev('input').val('');
        // Check that Note is not empty
        if ($.trim(note) != "") {
            var addNote = $(this).closest('li');
            $(addNote).before('<li class="list-group-item notes-list-item clearfix"><p>' + note + '</p><span class="pull-right remove-note-btn"><button class="btn btn-sm btn-danger"><span class="glyphicon glyphicon-trash"></span></button></span></li>');
            // Submit JSON to Add Note to Student
            var json_data = {
                purpose: 'add',
                studentID: $(addNote).closest('ul').attr('data-studentID'),
                recipeID: $(addNote).closest('ul').attr('data-recipeID'),
                note: note
            };
            $.post('/update_recipe_notes', {data: JSON.stringify(json_data)}, 'json');
        }
    });

    // Remove Note
    //$('.remove-note-btn').click(function () {
    $(document).on('click', '.remove-note-btn', function () {
        // Get Note
        var note = $(this).prev('p').text();
        // Submit JSON to Remove Note from Student
        var json_data = {
            purpose: 'delete',
            studentID: $(this).closest('ul').attr('data-studentID'),
            recipeID: $(this).closest('ul').attr('data-recipeID'),
            note: note
        };
        $.post('/update_recipe_notes', {data: JSON.stringify(json_data)}, 'json');
        $(this).closest('li').remove();
    });


    // Favorite Recipe
    $('.fav-recipe').click(function() {
        // Update Favorite Recipes
        var json_data = {
            studentID: $(this).attr('data-studentID'),
            recipeID: $(this).attr('data-recipeID')
        };
        $.post('/update_fav_recipe', {data: JSON.stringify(json_data)}, 'json');
        $(this).toggleClass('fav-select');
    });

});
