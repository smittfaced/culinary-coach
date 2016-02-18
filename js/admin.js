/**
 * Created by Andrew on 10/22/2015.
 */
$(document).ready(function () {

    $(window).load(function () {

        //General JS
        $('.responsive-headline').fitText(2.0);
        $('.grow-textarea').autogrow({
            vertical: true,
            horizontal: false
        });

        //Add Recipe Toggle
        $('.header-div').click(function () {
            $(this).parents('.admin-command-row:first').siblings().children('.command-div').fadeOut();
            $(this).siblings('.command-div').fadeToggle();
        });

        $(".add-directions").sortable();
        $(".add-ingredients").sortable();
        $(".add-utilities").sortable();
        //Draggable Categories
        $(".category-sortable").sortable().droppable({greedy: true});
        $('#delete-category-btn').droppable({
            drop: function (event, ui) {
                ui.draggable.remove();
            }
        });
        //.........................
        //Add Recipe Form
        //.........................

        $(document).on('click', '.add-btn-image-add', addNewImageRow);
        $(document).on('click', '.add-btn-remove', removeAddImageRow);
        $(document).on('click', '.edit-btn-image-add', editNewImageRow);
        $(document).on('click', '.edit-btn-remove', removeEditImageRow);
        $(document).on('click', '.edit-add-image-overlay', removeEditImage);
        function addNewImageRow(e) {

            var controlForm = $('.add-images'),
                currentImage = $(controlForm).children('.add-image:first'),
                newImage = $(currentImage.clone()).appendTo(controlForm);

            newImage.find('input').val('');
            //controlForm.find('.add_image:not(:last) .add-btn-file-add')
            controlForm.find('.add-image:last .add-btn-image-add')
                .removeClass('add-btn-image-add').addClass('add-btn-remove')
                .removeClass('btn-success').addClass('btn-danger')
                .html('<span class="glyphicon glyphicon-minus"></span>');

            e.preventDefault();
        }

        function removeAddImageRow(e) {
            $(this).parents('.add-image:first').remove();

            e.preventDefault();
        }

        function editNewImageRow(e) {

            var controlForm = $('.edit-images'),
                currentImage = $(controlForm).children('.edit-image:first'),
                newImage = $(currentImage.clone()).appendTo(controlForm);

            newImage.find('input').val('');
            controlForm.find('.edit-image:last .edit-btn-image-add')
                .removeClass('edit-btn-image-add').addClass('edit-btn-remove')
                .removeClass('btn-success').addClass('btn-danger')
                .html('<span class="glyphicon glyphicon-minus"></span>');

            e.preventDefault();
        }

        function removeEditImageRow(e) {
            $(this).parents('.edit-image:first').remove();

            e.preventDefault();
        }

        function removeEditImage(e) {
            $(this).parents('.col-xs-6:first').remove();

            e.preventDefault();

        }

        //..........................

        $(document).on('click', '.add-btn-direction-add', addNewDirectionRow);
        $(document).on('click', '.add-btn-remove', removeAddDirectionRow);
        $(document).on('click', '.edit-btn-direction-add', editNewDirectionRow);
        $(document).on('click', '.edit-btn-remove', removeEditDirectionRow);
        function addNewDirectionRow(e) {
            e.preventDefault();

            var controlForm = $('.add-directions'),
                currentEntry = $(controlForm).children('.add-direction:first'),
                newEntry = $(currentEntry.clone()).appendTo(controlForm);

            newEntry.find('.direction').val('');
            newEntry.find('.input-group-addon').text($('.add-directions > .add-direction').length);
            controlForm.find('.add-direction:last .add-btn-direction-add')
                .removeClass('add-btn-direction-add').addClass('add-btn-remove')
                .removeClass('btn-success').addClass('btn-danger')
                .html('<span class="glyphicon glyphicon-minus"></span>');
        }

        function removeAddDirectionRow(e) {
            var selectedDirection = $(this).parents('.add-direction:first'),
                selectedDirectionVal = parseInt($(selectedDirection).find('.input-group-addon').text()),
                directions = $(selectedDirection).nextAll();
            $(directions).each(function () {
                var curr = parseInt($(this).find('.input-group-addon').text());
                if (curr > selectedDirectionVal)
                    $(this).find('.input-group-addon').text(curr - 1);

            });
            var oldEntry = $(selectedDirection).remove();

            e.preventDefault();
        }

        function editNewDirectionRow(e) {
            e.preventDefault();

            var controlForm = $('.edit-directions'),
                currentEntry = $(controlForm).children('.edit-direction:first'),
                newEntry = $(currentEntry.clone()).appendTo(controlForm);

            newEntry.find('.direction').val('');
            newEntry.find('.input-group-addon').text($('.edit-directions > .edit-direction').length);
            controlForm.find('.edit-direction:last .edit-btn-direction-add')
                .removeClass('edit-btn-direction-add').addClass('edit-btn-remove')
                .removeClass('btn-success').addClass('btn-danger')
                .html('<span class="glyphicon glyphicon-minus"></span>');
        }

        function removeEditDirectionRow(e) {
            var selectedDirection = $(this).parents('.edit-direction:first'),
                selectedDirectionVal = parseInt($(selectedDirection).find('.input-group-addon').text()),
                directions = $(selectedDirection).nextAll();
            $(directions).each(function () {
                var curr = parseInt($(this).find('.input-group-addon').text());
                if (curr > selectedDirectionVal)
                    $(this).find('.input-group-addon').text(curr - 1);

            });
            var oldEntry = $(selectedDirection).remove();

            e.preventDefault();
        }

        function editAddNewDirectionRow(direction, index) {

            var controlForm = $('.edit-directions'),
                newDirection = '<div class="sortable edit-direction input-group"><div class="input-group-addon">' + index +
                    '</div><input type="text" name="direction" class="form-control direction" value="' + direction +
                    '"><div class="btn input-group-btn btn-success edit-btn-direction-add">' +
                    '<span class="glyphicon glyphicon-plus"></span></div></div>';
            $(newDirection).appendTo(controlForm);
        }

        //..........................

        $(document).on('click', '.add-btn-ingredient-add', addNewIngredientRow);
        $(document).on('click', '.add-btn-remove', removeAddIngredientRow);
        $(document).on('click', '.edit-btn-ingredient-add', editNewIngredientRow);
        $(document).on('click', '.edit-btn-remove', removeEditIngredientRow);
        function addNewIngredientRow(e) {
            e.preventDefault();

            var controlForm = $('.add-ingredients'),
                currentEntry = $(controlForm).children('.add-ingredient:first'),
                newEntry = $(currentEntry.clone()).appendTo(controlForm);

            newEntry.find('.form-control').val('');
            newEntry.find('.input-group-addon').text($('.add-ingredients > .add-ingredient').length);
            controlForm.find('.add-ingredient:last .add-btn-ingredient-add')
                .removeClass('add-btn-ingredient-add').addClass('add-btn-remove')
                .removeClass('btn-success').addClass('btn-danger')
                .html('<span class="glyphicon glyphicon-minus"></span>');
        }

        function removeAddIngredientRow(e) {
            var selectedIngredient = $(this).parents('.add-ingredient:first'),
                selectedIngredientVal = parseInt($(selectedIngredient).find('.input-group-addon').text()),
                ingredients = $(selectedIngredient).nextAll();
            $(ingredients).each(function () {
                var curr = parseInt($(this).find('.input-group-addon').text());
                if (curr > selectedIngredientVal)
                    $(this).find('.input-group-addon').text(curr - 1);

            });
            var oldEntry = $(selectedIngredient).remove();

            e.preventDefault();
        }

        function editNewIngredientRow(e) {
            e.preventDefault();

            var controlForm = $('.edit-ingredients'),
                currentEntry = $(controlForm).children('.edit-ingredient:first'),
                newEntry = $(currentEntry.clone()).appendTo(controlForm);

            newEntry.find('.form-control').val('');
            newEntry.find('.input-group-addon').text($('.edit-ingredients > .edit-ingredient').length);
            controlForm.find('.edit-ingredient:last .edit-btn-ingredient-add')
                .removeClass('edit-btn-ingredient-add').addClass('edit-btn-remove')
                .removeClass('btn-success').addClass('btn-danger')
                .html('<span class="glyphicon glyphicon-minus"></span>');
        }

        function removeEditIngredientRow(e) {
            var selectedIngredient = $(this).parents('.edit-ingredient:first'),
                selectedIngredientVal = parseInt($(selectedIngredient).find('.input-group-addon').text()),
                ingredients = $(selectedIngredient).nextAll();
            $(ingredients).each(function () {
                var curr = parseInt($(this).find('.input-group-addon').text());
                if (curr > selectedIngredientVal)
                    $(this).find('.input-group-addon').text(curr - 1);

            });
            var oldEntry = $(selectedIngredient).remove();

            e.preventDefault();
        }

        function editAddNewIngredientRow(ingredient, index) {

            var controlForm = $('.edit-ingredients'),
                newIngredient = '<div class="sortable edit-ingredient input-group"><div class="input-group-addon">' + index +
                    '</div><div class="col ingredient-col col-xs-2"><div class="form-group"><label class="btn btn-block btn-sm btn-primary" for="amount">Amt.</label><input type="number" step="0.01" min="0" class="form-control" name="amount" placeholder="1" value="' + ingredient.amount + '">' +
                    '</div></div><div class="col ingredient-col col-xs-2"><div class="form-group"><label class="btn btn-block btn-sm btn-primary" for="unit">Unit</label><input type="text" class="form-control" name="unit" placeholder="oz" value="' + ingredient.unit + '">' +
                    '</div></div><div class="col ingredient-col col-xs-4"><div class="form-group"><label class="btn btn-block btn-sm btn-primary" for="name">Name</label><input type="text" class="form-control" name="name" placeholder="Avocado" value="' + ingredient.name + '">' +
                    '</div></div><div class="col ingredient-col col-xs-4"><div class="form-group"><label class="btn btn-block btn-sm btn-primary" for="note">Note</label><input type="text" class="form-control" name="note" placeholder="Unripe Preferred" value="' + ingredient.note + '">' +
                    '</div></div><div class="btn input-group-btn btn-success edit-btn-ingredient-add"><span class="glyphicon glyphicon-plus"></span></div></div></div>';
            $(newIngredient).appendTo(controlForm);
        }


        //..........................

        $(document).on('click', '.add-btn-utility-add', addNewUtilityRow);
        $(document).on('click', '.add-btn-remove', removeAddUtilityRow);
        $(document).on('click', '.edit-btn-utility-add', editNewUtilityRow);
        $(document).on('click', '.edit-btn-remove', removeEditUtilityRow);
        function addNewUtilityRow(e) {
            e.preventDefault();

            var controlForm = $('.add-utilities'),
                currentEntry = $(controlForm).children('.add-utility:first'),
                newEntry = $(currentEntry.clone()).appendTo(controlForm);

            newEntry.find('.form-control').val('');
            newEntry.find('.input-group-addon').text($('.add-utilities > .add-utility').length);
            controlForm.find('.add-utility:last .add-btn-utility-add')
                .removeClass('add-btn-utility-add').addClass('add-btn-remove')
                .removeClass('btn-success').addClass('btn-danger')
                .html('<span class="glyphicon glyphicon-minus"></span>');
        }

        function removeAddUtilityRow(e) {
            var selectedUtility = $(this).parents('.add-utility:first'),
                selectedUtilityVal = parseInt($(selectedUtility).find('.input-group-addon').text()),
                utilities = $(selectedUtility).nextAll();
            $(utilities).each(function () {
                var curr = parseInt($(this).find('.input-group-addon').text());
                if (curr > selectedUtilityVal)
                    $(this).find('.input-group-addon').text(curr - 1);
            });
            var oldEntry = $(selectedUtility).remove();

            e.preventDefault();
        }

        function editNewUtilityRow(e) {
            e.preventDefault();

            var controlForm = $('.edit-utilities'),
                currentEntry = $(controlForm).children('.edit-utility:first'),
                newEntry = $(currentEntry.clone()).appendTo(controlForm);

            newEntry.find('.form-control').val('');
            newEntry.find('.input-group-addon').text($('.edit-utilities > .edit-utility').length);
            controlForm.find('.edit-utility:last .edit-btn-utility-add')
                .removeClass('edit-btn-utility-add').addClass('edit-btn-remove')
                .removeClass('btn-success').addClass('btn-danger')
                .html('<span class="glyphicon glyphicon-minus"></span>');
        }

        function removeEditUtilityRow(e) {
            var selectedUtility = $(this).parents('.edit-utility:first'),
                selectedUtilityVal = parseInt($(selectedUtility).find('.input-group-addon').text()),
                utilities = $(selectedUtility).nextAll();
            $(utilities).each(function () {
                var curr = parseInt($(this).find('.input-group-addon').text());
                if (curr > selectedUtilityVal)
                    $(this).find('.input-group-addon').text(curr - 1);
            });
            var oldEntry = $(selectedUtility).remove();

            e.preventDefault();
        }

        function editAddNewUtilityRow(utility, index) {

            var controlForm = $('.edit-utilities'),
                newUtility = '<div class="sortable edit-utility input-group"><div class="input-group-addon">' + index +
                    '</div><div class="col ingredient-col col-xs-4"><div class="form-group"><label class="btn btn-block btn-sm btn-primary" for="name">Name</label><input type="text" class="form-control" name="util_name" placeholder="High-Heat-Spatula" value="' + utility.name + '">' +
                    '</div></div><div class="col ingredient-col col-xs-5"><div class="form-group"><label class="btn btn-block btn-sm btn-primary" for="function">Function</label><input type="text" class="form-control" name="util_function" placeholder="Flipping objects at high temperatures" value="' + utility.function + '">' +
                    '</div></div><div class="col ingredient-col col-xs-3"><div class="form-group"><label class="btn btn-block btn-sm btn-primary" for="url">Url</label><input type="text" class="form-control" name="util_url" placeholder="http://www.webstaurantstore.com/" value="' + utility.link + '">' +
                    '</div></div><div class="btn input-group-btn btn-success edit-btn-utility-add"><span class="glyphicon glyphicon-plus"></span></div></div></div>';
            $(newUtility).appendTo(controlForm);
        }

        //..........................

        $(document).on('click', '.add-btn-category-add', addNewCategory);
        $(document).on('click', '.add-btn-category-edit', editAddNewCategory);
        function addNewCategory(e) {
            e.preventDefault();

            var controlForm = $('.category-sortable'),
                categoryInput = $(this).parent('span').siblings('input'),
                categoryHTML = ('<li class="ui-state-default"><div class="btn btn-sm btn-info"><p>' + categoryInput.val() + '</p></div></li>');
            if (categoryInput.val() != '') {
                empty = categoryInput.val('');
                newEntry = $(categoryHTML).appendTo(controlForm);
            }
        }

        function editAddNewCategory(e) {
            e.preventDefault();

            var controlForm = $('.edit-category-sortable'),
                categoryInput = $(this).parent('span').siblings('input'),
                categoryHTML = ('<li class="ui-state-default"><div class="btn btn-sm btn-info"><p>' + categoryInput.val() + '</p></div></li>');
            if (categoryInput.val() != '') {
                empty = categoryInput.val('');
                newEntry = $(categoryHTML).appendTo(controlForm);
            }
        }

        //..........................
        // JSON Submit Add-Recipe Form
        //..........................
        // Submit Button Click
        //$('#submit-btn').click(function () {
        //    //Get Form
        //    var form = $(document).find('form');
        //    //Send JSON Request for uploadURL
        //    var json_data = {
        //        url: "/new_profile"
        //    };
        //    //Get New Upload Url for Blob
        //    $.post('/blob_upload_url', {data: JSON.stringify(json_data)}, function (data) {
        //        //Set Form Action Attribute to Response
        //        form.attr('action', data.url);
        //
        //        //Submit Form
        //        form.submit();
        //
        //    }, 'json');
        //});
        $('#add-recipe-submit').click(function (e) {
            var list = $('.category-sortable').children('li'),
                catString = '';
            $(list).each(function (e) {
                catString += $(this).text() + ',';
            });
            var catInput = $('#category-name-input').val(catString);

            //Get Form
            var form = $('#add-recipe-form');
            //Send JSON Request for uploadURL
            var json_data = {
                url: "/recipe_upload"
            };
            //Get New Upload Url for Blob
            $.post('/blob_upload_url', {data: JSON.stringify(json_data)}, function (data) {
                //Set Form Action Attribute to Response
                form.attr('action', data.url);

                //Submit Form
                form.submit();

            }, 'json');
        });

        //...........................

        $(document).on('change', '.btn-file :file', function changeFileInputDisplay() {
            var filename = $(this).val().replace(/\\/g, '/').replace(/.*\//, ''),
                textarea = $(this).parents('.input-group:first').children('.form-control:last'),
                written = $(textarea).val(filename);
        });

        $('.recipe-search').chosen({
            width: '100%',
            search_contains: true
        }).change(function (event) {

            var step1 = $(this).siblings('.search-group-btn:first'),
                step2 = $(step1).children('.selected-recipe:first').val($(event.target).val());
        });

        $('.permission-recipe-search').chosen({
            width: '100%',
            search_contains: true
        }).change(function (event) {

            var step1 = $(this).siblings('.search-group-btn:first'),
                step2 = $(step1).children('.selected-recipe:first').val($(event.target).val());
        });

        $('.permission-student-search').chosen({
            width: '100%',
            search_contains: true
        }).change(function (event) {

            var step1 = $(this).siblings('.search-group-btn:first'),
                step2 = $(step1).children('.selected-student:first').val($(event.target).val());
        });

        //..........................
        // JSON Submit Search Users Form
        //..........................

        $('.edit-permission-student-search').click(function () {

            var user = $('.permission-student-search').val();
            $.post('/serve_student', {studentID: user}, displayStudentInfo, 'json');

            return false;
        });

        //..........................
        // JSON Submit Search Recipes Form
        //..........................

        $('.edit-permission-recipe-search').click(function () {

            var recipe = $('.permission-recipe-search').val();
            $.post('/serve_recipe', {recipeID: recipe}, displayRecipeInfo, 'json');

            return false;
        });

        //..........................
        // Display Recipe Search Result
        //..........................

        function displayRecipeInfo(data) {
            var name = data.name,
                description = data.description,
                avatar = data.avatar,
                recipeID = data.urlID;

            var recipePermissionArea = $('.permission-recipe-display');
            recipePermissionArea.empty();

            recipePermissionArea.append('<div class="row recipe-permission-info"><div class="col-lg-4 hidden-md hidden-sm hidden-xs"><div class="permission-display-avatar"><img class="" alt="' + avatar.filename + '" src="' + avatar.url + '"></div></div><div class="col-lg-8 col-md-12 col-sm-12 col-xs-12"><div class="row"><div class="col-xs-12"><div class="btn-group btn-group-justified"><a class="btn btn-sm btn-info" style="width: 100%"><b>' + name + '</b></a><input hidden value="' + recipeID + '"><a class="btn btn-sm btn-success" style="width: 33px" href="http://www.google.com"><span class="glyphicon glyphicon-globe"></span></a></div></div><div class="col-xs-12"><p class="recipe-label name-label"><span class="label label-default"style="white-space: normal">' + description + '</span></p></div></div></div></div>');

            //recipePermissionArea.draggable({
            $('.recipe-permission-info').draggable({
                scroll: false,
                revert: true,
                zIndex: 3
            });
        }

        //..........................
        // Display Search Users Result
        //..........................

        function displayStudentInfo(data) {
            var avatar = data.avatar,
                studentID = data.studentID,
                urlID = data.urlID,
                firstname = data.firstname,
                lastname = data.lastname,
                nickname = data.nickname,
                email = data.email,

                phones = data.phone,
                addresses = data.address,
                recipes = data.recipes;

            var userPermissionArea = $('.permission-user-display');
            userPermissionArea.empty();

            // Append Base HTML

            // Avatar + Names
            userPermissionArea.append('<div class="row top-user-area"><div class="col-xs-6"><div class="permission-display-avatar"><img class="" alt="' + avatar.filename + '" src="' + avatar.url + '"></div></div>' +
                '<div class="col-xs-6"><div class="row"><div class="col-xs-12"><h4 class="nickname-label name-label"><span class="label label-info">' + nickname + '</span></h4></div></div><div class="row"><div class="col-xs-12"><h3 class="name-label"><span class="label label-default">' + firstname + '</span></h3></div><div class="col-xs-12"><h3 class="name-label"><span class="label label-default">' + lastname + '</span></h3></div></div></div>');

            // Email + Phones + Address
            userPermissionArea.append('<div class="row"><div class="col-xs-12"><div class="horizontal-input input-group"><span class="input-group-btn"><span class="btn btn-primary"><span class="glyphicon glyphicon-envelope"></span></span></span><input readonly type="text" class="form-control readonly-color" name="email" placeholder="' + email + '"></div></div></div>');
            for (var phone in phones) {
                if (phones[phone].type == 'cell')
                    userPermissionArea.append('<div class="row"><div class="col-xs-12"><div class="horizontal-input input-group"><span class="input-group-btn"><span class="btn btn-primary"><span class="glyphicon glyphicon-earphone"></span></span></span><input readonly type="tel" class="form-control readonly-color bfh-phone" name="cell_phone_num" placeholder="' + phones[phone].number + '"></div></div></div>');
                else if (phones[phone].type == 'home')
                    userPermissionArea.append('<div class="row"><div class="col-xs-12"><div class="horizontal-input input-group"><span class="input-group-btn"><span class="btn btn-primary"><span class="glyphicon glyphicon-home"></span></span></span><input readonly type="tel" class="form-control readonly-color bfh-phone" name="phone_num" placeholder="' + phones[phone].number + '"></div></div></div>');
                else if (phones[phone].type == 'work')
                    userPermissionArea.append('<div class="row"><div class="col-xs-12"><div class="horizontal-input input-group"><span class="input-group-btn"><span class="btn btn-primary"><span class="glyphicon glyphicon-briefcase"></span></span></span><input readonly type="tel" class="form-control readonly-color bfh-phone" name="phone_num" placeholder="' + phones[phone].number + '"></div></div></div>');
            }

            for (var address in addresses) {
                if (addresses[address].type == 'home')
                    userPermissionArea.append('<div class="row"><div class="col-xs-12"><div class="horizontal-input input-group"><span class="input-group-btn btn btn-primary address-addon"><span class="glyphicon glyphicon-home"></span></span><input readonly type="text" class="form-control readonly-color" name="address" placeholder="' + addresses[address].street + ' ' + addresses[address].street2 + '" style="border-top-right-radius: 4px;"><input readonly type="text" class="form-control readonly-color" name="address2" placeholder="' + addresses[address].city + ' ' + addresses[address].state + ' ' + addresses[address].zip + '" style="border-bottom-right-radius: 4px;"><input hidden type="text"></div></div>');
                else if (addresses[address].type == 'work')
                    userPermissionArea.append('<div class="row"><div class="col-xs-12"><div class="horizontal-input input-group"><span class="input-group-btn btn btn-primary address-addon"><span class="glyphicon glyphicon-briefcase"></span></span><input readonly type="text" class="form-control readonly-color" name="address" placeholder="' + addresses[address].street + ' ' + addresses[address].street2 + '" style="border-top-right-radius: 4px;"><input readonly type="text" class="form-control readonly-color" name="address2" placeholder="' + addresses[address].city + ' ' + addresses[address].state + ' ' + addresses[address].zip + '" style="border-bottom-right-radius: 4px;"><input hidden type="text"></div></div>');
            }

            // Recipes
            userPermissionArea.append('<div class="row"><div class="col-xs-12"><h2 class="recipe-label name-label"><span class="label label-warning">Recipes</span></h2></div><div class="col-xs-10 col-xs-offset-1 recipe-droppable"><div class="add-recipe-form"><ul class="recipe-sortable"></ul></div></div><div class="col-xs-6"><span class="input-group-btn"><div id="delete-recipe-btn" class="btn btn-block btn-danger"><span class="glyphicon glyphicon-trash"></span></div></span></div><div class="col-xs-6"><span class="input-group-btn"><div id="save-user-btn" class="btn btn-block btn-success"><span class="glyphicon glyphicon-ok"></span></div></span></div></div></div></div>');
            var recipeSortable = $('.recipe-sortable');
            for (var recipe in recipes) {
                $(recipeSortable).append('<li class="ui-state-default"><div class="btn-group"><a class="btn btn-sm btn-info" type="button">' + recipes[recipe].name + '</a><input hidden type="text" value="' + recipes[recipe].id + '"><a class="btn btn-sm btn-success" type="button" href="http://www.google.com"><span class="glyphicon glyphicon-globe"></span></a></div></li>');
            }

            // Draggable Recipes
            $(recipeSortable).sortable({
                sort: function (e, ui) {
                    $(ui.item).find('a:last').hide();
                    $(ui.item).find('a:first').css("border-radius", "4px");
                },
                stop: function (e, ui) {
                    $(ui.item).find('a:last').show();
                    $(ui.item).find('a:first').css("border-radius", "");
                }
            });

            $('.recipe-droppable').droppable({
                accept: ".recipe-permission-info",
                activeClass: "recipe-drop-active",
                hoverClass: "",
                tolerance: "pointer",
                drop: function (event, ui) {
                    //Create a Recipe Label like Existing Recipes
                    var recipeName = $(ui.draggable).find('a:first').text(),
                        recipeURL = $(ui.draggable).find('a:last').attr('href'),
                        recipeID = $(ui.draggable).find('input').val();

                    var recipes = $('.recipe-sortable li'),
                        safe = true;
                    recipes.each(function (index, li) {
                        if ($(li).find('input').val() == recipeID) {
                            safe = false;
                            return false;
                        }
                    });
                    if (safe)
                        $(recipeSortable).append('<li class="ui-state-default"><div class="btn-group"><a class="btn btn-sm btn-info" type="button">' + recipeName + '</a><input hidden type="text" value="' + recipeID + '"><a class="btn btn-sm btn-success" type="button" href="' + recipeURL + '"><span class="glyphicon glyphicon-globe"></span></a></div></li>');
                    else
                        $(this).addClass("recipe-drop-failed").delay(1000).queue(function () {
                            $(this).removeClass("recipe-drop-failed").dequeue();
                        });
                    return false;
                }
            });

            // Delete Recipe Button
            $('#delete-recipe-btn').droppable({
                tolerance: "pointer",
                drop: function (event, ui) {
                    ui.draggable.remove();
                }
            });

            // Save Recipes to User Profile
            $('#save-user-btn').click(function () {

                var recipes = $('.recipe-sortable li');
                var saveRecipes = {};
                saveRecipes['studentID'] = urlID;
                saveRecipes['recipes'] = [];

                $(recipes).each(function (index, item) {
                    var recipeName = $(item).find('a:first').text(),
                        recipeID = $(item).find('input').val(),
                        recipe = {};

                    recipe['name'] = recipeName;
                    recipe['urlID'] = recipeID;
                    saveRecipes['recipes'][index] = recipe;
                });

                var json_data = JSON.stringify(saveRecipes);
                $.post('/update_student', {data: json_data}, 'json');

            });
        }


        //..........................
        // JSON Submit Search Recipe Form
        //..........................

        $('.edit-recipe-search').click(function () {

            var recipe = $('.recipe-search').val();
            $.post('/serve_recipe', {recipeID: recipe}, displayEditRecipe, 'json');

            return false;
        });


        //..........................
        // JSON Submit Edit-Recipe Form
        //..........................

        $(document).on('click', '#edit-recipe-submit', doEditSubmit);

        function doEditSubmit() {

            //Categories
            var list = $('.edit-category-sortable').children('li'),
                catString = '';
            $(list).each(function (e) {
                catString += $(this).text() + ',';
            });
            var catInput = $('#edit-category-name-input').val(catString);

            //Get Form
            var form = $('#edit-recipe-form');
            //Send JSON Request for uploadURL
            var json_data = {
                url: "/recipe_update"
            };
            //Get New Upload Url for Blob
            $.post('/blob_upload_url', {data: JSON.stringify(json_data)}, function (data) {
                //Set Form Action Attribute to Response
                form.attr('action', data.url);

                //Submit Form
                form.submit();
            }, 'json');
        }

        //...........................

        function displayEditRecipe(data) {

            var name = data.name,
                avatar = data.avatar,
                images = data.img,
                category = data.category,
                recipe_desc = data.description,
                ingredients = data.ingredients,
                utilities = data.utilities,
                directions = data.directions,
                prep_time = data.prep_time,
                cook_time = data.cook_time,
                date = data.date,
                urlID = data.urlID,
                serves = data.serves;

            try {

                var recipeForm = $('#edit-recipe-form');
                recipeForm.empty();

                // Avatar and Images Row
                recipeForm.append('<div class="row horizontal-input">' +
                    '<div class="col-xs-12 col-sm-5">' +
                    '<div class="edit-avatar input-group">' +
                    '<span class="input-group-btn">' +
                    '<span class="btn btn-default btn-file"> Avatar ' +
                    '<input name="avatar_file" type="file"></span></span>' +
                    '<input type="text" class="form-control" readonly=""></div>' +
                    '<div class="edit-images">' +
                    '<div class="edit-image input-group">' +
                    '<span class="input-group-btn">' +
                    '<span class="btn btn-default btn-file"> Image ' +
                    '<input name="sm_image" type="file"></span></span>' +
                    '<input type="text" class="form-control" readonly="">' +
                    '<span class="input-group-btn">' +
                    '<button class="btn btn-success edit-btn-image-add">' +
                    '<span class="glyphicon glyphicon-plus"></span></button></span></div></div></div>' +
                    '<div class="col-xs-10 col-sm-5">' +
                    '<ul class="edit-image-sortable"></ul>' +
                    '</div><div class="col-xs-2 cols-sm-2">' +
                    '<div><span id="avatar-btn" class="input-group-btn"><div class="btn btn-block btn-info">' +
                    '<span class="glyphicon glyphicon-user"></span></div></span></div>' +
                    '<div style="margin-top: 10px"><span id="edit-remove-img-btn" class="input-group-btn"><div class="btn btn-block btn-danger">' +
                    '<span class="glyphicon glyphicon-trash"></span></div></span></div></div>');

                // Avatar
                $('.edit-image-sortable').append('<li class="col-xs-6 ui-state-default"><div><label class="avatar-label btn btn-sm btn-info"><p>' + avatar.filename + '</p></label><label class="avatar-star btn btn-sm btn-warning"><span class="glyphicon glyphicon-star"></span></label><input class="existing-avatar"  name="existing_avatar" type="hidden" value="' + avatar.urlkey + '"><img class="existing-img-input" src="' + avatar.url + '"></div></li>');

                // For each Image in img   --> Create Row
                for (var image in images) {
                    $('.edit-image-sortable').append('<li class="col-xs-6 ui-state-default"><div><label class="btn btn-sm btn-info"><p>' + images[image].filename + '</p></label><input name="existing_img" type="hidden" value="' + images[image].urlkey + '"><img class="existing-img-input" src="' + images[image].url + '"></div></li>');
                }

                //Get Recipe Name
                $(recipeForm).append
                ('<div class="horizontal-input input-group"><span class="input-group-btn"><span class="btn btn-warning">Recipe Name</span></span><input type="text" class="form-control" readonly="" name="recipe_name" placeholder="Recipe Name" value="' + name + '"></div>');

                //Get Categories
                $(recipeForm).append('<div class="row horizontal-input input-group"><div class="category-search col-xs-12 col-sm-5"><div class="input-group"><span class="input-group-btn"><span class="btn btn-default"> Categories </span></span><input id="edit-category-name-input" type="text" class="form-control" name="add_category"><span class="input-group-btn"><button class="btn btn-success add-btn-category-edit"><span class="glyphicon glyphicon-plus"></span></button></span></div></div><div class="col-xs-8 col-sm-5"><div class="edit-category-form"><ul class="edit-category-sortable"></ul></div></div><div class="col-xs-12 col-sm-2"><span class="input-group-btn"><div  id="edit-delete-category-btn" class="btn btn-block btn-danger"><span class="glyphicon glyphicon-trash"></span></div></span></div></div>');
                var sortableCategories = $('.edit-category-sortable');
                for (var cat in category) {
                    $(sortableCategories).append('<li class="ui-state-default"><div class="btn btn-sm btn-info"><p>' + category[cat] + '</p></div></li>');
                }

                //Get Description
                $(recipeForm).append('<div class="horizontal-input input-group"><span class="input-group-btn textarea-btn-group"><span class="btn btn-default textarea-btn">Full Desc.</span></span><textarea class="form-control grow-textarea" name="full_description" rows="1" placeholder="Full Description">' + recipe_desc + '</textarea></div>');

                //Get Cooking Info
                $(recipeForm).append('<div class="row"><div class="col col-xs-4"><div class="form-group"><label class="btn btn-block btn-sm btn-warning" for="prep_time">Prep Time</label><input type="number" class="form-control" name="prep_time" placeholder="Minutes" value="' + prep_time
                    + '"></div></div><div class="col col-xs-4"><div class="form-group"><label class="btn btn-sm btn-block btn-warning" for="cook_time">Cook Time</label><input type="number" class="form-control" name="cook_time" placeholder="Minutes" value="' + cook_time
                    + '"></div></div><div class="col col-xs-4"><div class="form-group"><label class="btn btn-sm btn-block btn-warning" for="serves">Serves</label><input type="number" class="form-control" name="serves" placeholder="5" value="' + serves + '"></div></div></div>');

                //Get Directions

                $(recipeForm).append('<div class="row"><div class="col col-xs-12"><div class="form-group"><label class="btn btn-block btn-sm btn-default" for="directions">Directions</label><div class="edit-directions"></div></div></div></div>');
                var count = 1;
                for (var dir in directions) {
                    editAddNewDirectionRow(directions[dir].instruction, count);
                    count++;
                }

                //Get Ingredients
                $(recipeForm).append('<div class="row"><div class="col col-xs-12"><div class="form-group"><label class="btn btn-block btn-sm btn-default" for="ingredients">Ingredients</label><div class="edit-ingredients"></div></div></div></div>');
                var counter = 1;
                for (var ing in ingredients) {
                    editAddNewIngredientRow(ingredients[ing], counter);
                    counter++;
                }

                //Get Utilities
                $(recipeForm).append('<div class="row"><div class="col col-xs-12"><div class="form-group"><label class="btn btn-block btn-sm btn-default" for="utilities">Utilities</label><div class="edit-utilities"></div></div></div></div>');
                var counts = 1;
                for (var util in utilities) {
                    editAddNewUtilityRow(utilities[util], counts);
                    counts++;
                }

                //Append Submit Button
                $(recipeForm).append('<input hidden id="recipe-id" name="recipe_id" type="text"><input hidden id="removed-images" name="removed_images" type="text"><button id="edit-recipe-submit" type="submit" class="btn btn-lg btn-block btn-info">Submit</button>');

                //Record Recipe ID
                $('#recipe-id').val(urlID);

                //Structure Additional Entries
                //Add Remove Buttons to Ingredients
                var ingredientForm = $('.edit-ingredients');
                ingredientForm.find('.edit-ingredient:not(:first) .edit-btn-ingredient-add')
                    .removeClass('edit-btn-ingredient-add').addClass('edit-btn-remove')
                    .removeClass('btn-success').addClass('btn-danger')
                    .html('<span class="glyphicon glyphicon-minus"></span>');

                //Add Remove Buttons to Directions
                var directionForm = $('.edit-directions');
                directionForm.find('.edit-direction:not(:first) .edit-btn-direction-add')
                    .removeClass('edit-btn-direction-add').addClass('edit-btn-remove')
                    .removeClass('btn-success').addClass('btn-danger')
                    .html('<span class="glyphicon glyphicon-minus"></span>');

                //Add Remove Buttons to Utilities
                var utilityForm = $('.edit-utilities');
                utilityForm.find('.edit-utility:not(:first) .edit-btn-utility-add')
                    .removeClass('edit-btn-utility-add').addClass('edit-btn-remove')
                    .removeClass('btn-success').addClass('btn-danger')
                    .html('<span class="glyphicon glyphicon-minus"></span>');

                $('.grow-textarea').autogrow({
                    vertical: true,
                    horizontal: false
                });

                $(".edit-directions").sortable();
                $(".edit-ingredients").sortable();
                $(".edit-utilities").sortable();
                $(".edit-image-sortable").sortable().droppable({greedy: true});
                $("#edit-remove-img-btn").droppable({
                    drop: function (event, ui) {

                        var blobToDelete = $(ui.draggable).find('input:first').val(),
                            riString = $('#removed-images').val(),
                            riNewString = (riString + ',' + blobToDelete);

                        $('#removed-images').val(riNewString);

                        ui.draggable.remove();
                    }
                });
                $("#avatar-btn").droppable({
                    drop: function (event, ui) {

                        //Remove Avatar Status from Existing Avatar Draggable
                        $('.edit-image-sortable').find('.avatar-star').siblings('input:first').attr('name', 'existing_img').removeClass('existing-avatar');
                        //Remove Avatar Star Label from Existing Avatar Draggable
                        $('.edit-image-sortable').find('.avatar-star').remove();
                        //Remove Avatar Label Class from Existing Avatar Draggable
                        $('.edit-image-sortable').find('.avatar-label').removeClass('avatar-label');

                        //Add Avatar Class and Avatar Star Label to New Avatar
                        $(ui.draggable).find('label').addClass('avatar-label');
                        $(ui.draggable).find('div').prepend('<label class="avatar-star btn btn-sm btn-warning"><span class="glyphicon glyphicon-star"></span></label>');
                        $(ui.draggable).find('input:first').attr('name', 'existing_avatar');
                    }
                });

                $(".edit-category-sortable").sortable().droppable({greedy: true});
                $("#edit-delete-category-btn").droppable({
                    drop: function (event, ui) {
                        ui.draggable.remove();
                    }
                });

                $(recipeForm).addClass("transparent-bg");

            }
            catch (err) {
                alert(err)
            }

        }


    });

    //............................
    // Select Stock Image Upload
    //............................
    //Stock Image Form
    $('#stock-image-save').click(function () {
        $(this).closest('.modal-content').find('form').submit();
    });
    //Stock Image Form Text
    $(document).on('change', '.btn-file :file', function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });
    //Stock Image Form Label
    $(document).ready(function () {
        $('.btn-file :file').on('fileselect', function (event, numFiles, label) {

            var input = $(this).parents('.input-group').find(':text'),
                log = numFiles > 1 ? numFiles + ' files selected' : label;

            if (input.length) {
                input.val(log);
            } else {
                if (log) alert(log);
            }

        });
    });

});