/**
 * Created by Andrew on 1/26/2016.
 */

$(document).ready(function () {

    // run test on initial page load
    checkSize();

    // run test on resize of the window
    $(window).resize(checkSize);

    // Recipe Sizing
    function checkSize() {
        //Variables
        var grid = $('.isotope-grid');
        var favGrid = $('.isotope-grid-fav');

        var recipes = $(grid).children('.grid-item').each(function () {
            var recipeName = $(this).find('p').text();
            if (recipeName.length < 8) {
                $(this).addClass('grid-item-5')
            } else if (recipeName.length <= 8 && recipeName.length < 14) {
                $(this).addClass('grid-item-4')
            } else if (recipeName.length <= 14 && recipeName.length < 18) {
                $(this).addClass('grid-item-3')
            } else if (recipeName.length <= 18 && recipeName.length < 22) {
                $(this).addClass('grid-item-2')
            } else if (recipeName.length <= 22) {
                $(this).addClass('grid-item-1')
            } else {

            }
        });
    }

    //
    //Theme Chooser
    //
    $('.btn.btn-toggle').click(function () {
        // Get Button Container
        var btnGroup = $(this).closest('.btn-group');
        if ($(this).hasClass('active')) {

        }
        else {
            var themeSelect = $('#theme-options'),
                themeSelected = $(themeSelect).find(":selected").text(),
                themeCSSSheet = $('#theme-stylesheet');

            // Set Clicked Button as Active
            $(btnGroup).find('.btn').toggleClass('active');
            //Set Clicked Button as Primary
            $(btnGroup).find('.btn').toggleClass('btn-primary');
            //Get Theme ID
            var theme = $(this).attr('data-id');

            //Select Other Theme
            $(themeSelect).val(theme);

            //Get New Selected Option
            $(themeCSSSheet).attr({href: $(themeSelect).find(":selected").val()});

            var json_data = {
                studentID: $(this).closest('.theme-chooser').attr('data-id'),
                theme: $(this).attr('data-name')
            };
            $.post('/update_theme', {data: JSON.stringify(json_data)}, 'json');
        }
    });

    //After Window has Loaded
    $(window).load(function () {

        var grid = $('.isotope-grid');
        var favGrid = $('.isotope-grid-fav');

        //Making the Favorited Recipes appear in the favGrid Isotope
        $(grid).imagesLoaded(function () {
            moveFavorites();

            $(grid).isotope({
                itemSelector: '.grid-item',
                fitWidth: true,
                easyClose: true,
                percentPosition: true,
                layoutMode: 'packery'
            });

            $(favGrid).isotope({
                itemSelector: '.grid-item',
                fitWidth: true,
                percentPosition: true,
                layoutMode: 'packery'
            });

            // Shuffle Grid to remove staleness
            $(grid).isotope('shuffle');

            // Check if the Favorite Recipe List is Empty
            checkFavorites();
        });

        //
        //
        // Isotope Filtering
        //
        //

        var filterValue;
        var filterFunction;

        var filterFunctions = {
            // Show if Recipe has Category
            category: function () {
                if (categoryRegex)
                    return ($(this).find('.filter-classes').attr('class').match(categoryRegex));
                else return true
            },
            // Show if Recipe has Name
            name: function () {
                if (nameRegex)
                    return ($(this).find('.recipe-name-label').text().match(nameRegex));
                else return true
            }
        };

        //Quick-Filter Recipes Based on Title Search
        var nameRegex;
        var nameSearch = $('.name-search').keyup(debounce(function () {
            filterValue = "name";
            filterFunction = filterFunctions[filterValue] || filterValue;
            nameRegex = new RegExp(nameSearch.val(), 'gi');
            $(grid).isotope({filter: filterFunction});
            $(favGrid).isotope({filter: filterFunction});
            // Check if the Favorite Recipe List is Empty
            checkFavorites();
        }, 200));

        // Quick-Filter Recipes Based on Category Search
        var categoryRegex;
        var categorySearch = $('.category-search').keyup(debounce(function () {
            filterValue = "category";
            filterFunction = filterFunctions[filterValue] || filterValue;
            categoryRegex = new RegExp(categorySearch.val(), 'gi');
            nameRegex = new RegExp(nameSearch.val(), 'gi');
            $(grid).isotope({filter: filterFunction});
            $(favGrid).isotope({filter: filterFunction});
            // Check if the Favorite Recipe List is Empty
            checkFavorites();
        }, 200));


        //
        //
        // Always-Active Section
        //
        //

        //Display Recipe Cooking/Prepping/Serving Details on Hover
        var setRecipeDetailDelayTimeout;
        $('.grid-item').hover(function () {
            var gridItem = $(this);
            setRecipeDetailDelayTimeout = setTimeout(function () {
                $(gridItem).find('.overlay-recipe-details').slideDown();
            }, 600);
        }, function () {
            clearTimeout(setRecipeDetailDelayTimeout);
            $(this).find('.overlay-recipe-details').slideUp();
        });

        //
        //
        // Form Submission for Updating Profile
        //
        //

        // Nickname Change Form
        $('#nickname-save').click(function () {
            var nicknameModal = $('#nickname-modal');
            if (validate("nickname-form", "nickname-input")) {
                // AJAX Submit Nickname Change
                var nnValue = document.forms.namedItem("nickname-form").elements["nickname-input"].value;
                var json_data = {
                    studentID: $(nicknameModal).attr('data-id'),
                    nickname: nnValue
                };
                $.post('/update_nickname', {data: JSON.stringify(json_data)}, 'json');

                // Change Text to Represent Change of Nickname
                $(nicknameModal).parent().find('.nickname-text').find("strong").text(nnValue);
                $(nicknameModal).modal("hide");
                document.forms.namedItem('nickname-form').reset();
            }
            else {
                // Inform User Nickname is Not Acceptable
                $(nicknameModal).find('.modal-body').toggleClass('has-error', setTimeout(function () {
                    $(nicknameModal).find('.modal-body').toggleClass('has-error');
                }, 1500));
            }
        });


        // Phone Change Form
        $('.phone-save').click(function () {
            var phoneID = $(this).attr("id").substr(6, 1),
                phoneModal = $('#phone-' + phoneID + '-modal');
            if (validate('phone-' + phoneID + '-form', 'phone-' + phoneID + '-number')) {
                // AJAX Submit Nickname Change
                var pValue = document.forms.namedItem('phone-' + phoneID + '-form').elements['phone-' + phoneID + '-number'].value;
                var json_data = {
                    studentID: $(phoneModal).attr('data-id'),
                    type: $(phoneModal).find('input').attr('data-type'),
                    number: pValue,
                    command: 'append'
                };
                $.post('/update_phone', {data: JSON.stringify(json_data)}, 'json');
                // Change Text to Represent Change of Nickname
                try {
                    $(phoneModal).parent().find('.phone-text').empty().html('<strong>' + pValue + '</strong>');
                    var phoneCol = $(phoneModal).closest('.phone-col');
                    $(phoneCol).removeClass('col-lg-2').removeClass('col-md-4').addClass('col-lg-4').addClass('col-md-3');

                    var glyphType = $(phoneCol).find('div:first').find('div:first').attr('data-glyphType');
                    if (glyphType.startsWith('h'))
                        $(phoneCol).find('div:first').find('div:first').empty().html('<p class="text-shadow-sm">Home Phone</p>');
                    else if (glyphType.startsWith('w'))
                        $(phoneCol).find('div:first').find('div:first').empty().html('<p class="text-shadow-sm">Work Phone</p');
                    else
                        $(phoneCol).find('div:first').find('div:first').empty().html('<p class="text-shadow-sm">Cell Phone</p>');
                }
                catch (err) {

                }

                $(phoneModal).modal("hide");
                document.forms.namedItem('phone-' + phoneID + '-form').reset();
            }
            else {
                // Inform User Nickname is Not Acceptable
                $(phoneModal).find('.modal-body').toggleClass('has-error', setTimeout(function () {
                    $(phoneModal).find('.modal-body').toggleClass('has-error');
                }, 1500));
            }
        });

        // Phone Delete Form
        $('.phone-delete').click(function () {
            var phoneID = $(this).attr("id").substr(6, 1),
                phoneModal = $('#phone-' + phoneID + '-modal');
            var json_data = {
                studentID: $(phoneModal).attr('data-id'),
                type: $(phoneModal).find('input').attr('data-type'),
                number: $(phoneModal).prevAll('.phone-text').text(),
                command: 'delete'
            };
            $.post('/update_phone', {data: JSON.stringify(json_data)}, 'json');

            // Remove Phone from DOM
            var phoneCol = $(this).closest('.phone-col');
            $(phoneCol).removeClass('col-lg-4').removeClass('col-md-3').addClass('col-lg-2').removeClass('col-md-4');
            $(phoneCol).find('div:first').find('div:first').find('p').text('Phone');
            var glyphType = $(phoneCol).find('div:first').find('div:first').attr('data-glyphType');
            if (glyphType.startsWith('h'))
                glyphType = 'home';
            else if (glyphType.startsWith('w'))
                glyphType = 'briefcase';
            else
                glyphType = 'phone';
            $(phoneCol).find('.phone-text').empty().append('<span data-toggle="modal" data-target="#phone-' + phoneID + '-modal" class="btn btn-xs glyphicon glyphicon-' + glyphType + '"></span>');
            $(phoneModal).modal('hide');
        });


        // Address Form
        $('.address-save').click(function () {
            var addressID = $(this).attr("id").substr(8, 1),
                addressModal = $('#address-' + addressID + '-modal'),
                addressParts = [], goodToGo = true;

            //Validate Portions of Address
            addressParts.push({
                v: validate('address-' + addressID + '-form', 'address-' + addressID + '-street'),
                w: "street"
            });
            addressParts.push({
                v: validate('address-' + addressID + '-form', 'address-' + addressID + '-city'),
                w: "city"
            });
            addressParts.push({
                v: validate('address-' + addressID + '-form', 'address-' + addressID + '-state'),
                w: "state"
            });
            addressParts.push({
                v: validate('address-' + addressID + '-form', 'address-' + addressID + '-zip'),
                w: "zip"
            });


            function assessTimeout(classname, element, timing) {
                setTimeout(function () {
                    $(element).toggleClass(classname, timing)
                }, 1000)
            }

            //Loop Through to Check Status
            for (i = 0; i < addressParts.length; i++) {
                if (!addressParts[i].v) {
                    // Inform User Address is Not Acceptable
                    var inputLabel = $(addressModal).find('#address-' + addressID + '-' + addressParts[i].w).closest('div');
                    $(inputLabel).toggleClass('has-error', 0, assessTimeout('has-error', inputLabel, 0));
                    goodToGo = false;
                }
            }

            // Check if goodToGo on Submitting Changes
            if (goodToGo) {
                // Do AJAX Submission of Address Update
                var json_data = {
                    studentID: $(addressModal).attr('data-id'),
                    type: $(addressModal).attr('data-type'),
                    street: document.forms.namedItem('address-' + addressID + '-form').elements['address-' + addressID + '-street'].value,
                    street2: document.forms.namedItem('address-' + addressID + '-form').elements['address-' + addressID + '-apt'].value,
                    city: document.forms.namedItem('address-' + addressID + '-form').elements['address-' + addressID + '-city'].value,
                    state: document.forms.namedItem('address-' + addressID + '-form').elements['address-' + addressID + '-state'].value,
                    zip: document.forms.namedItem('address-' + addressID + '-form').elements['address-' + addressID + '-zip'].value,
                    command: 'append'
                };
                $.post('/update_address', {data: JSON.stringify(json_data)}, 'json');

                var addressCol = $(addressModal).closest('.address-col');
                $(addressCol).removeClass('col-lg-2').removeClass('col-md-4').addClass('col-lg-4').addClass('col-md-6');

                var glyphType = $(addressModal).attr('data-type');
                if (glyphType.startsWith('h'))
                    $(addressCol).find('.accent-theme-sm-header').find('p').text('Home Address');
                else
                    $(addressCol).find('.accent-theme-sm-header').find('p').text('Work Address');

                //Change Text to Represent Change of Address
                $(addressModal).parent().find('.address-text').empty().html('<strong class="">' + document.forms.namedItem('address-' + addressID + '-form').elements['address-' + addressID + '-street'].value + ", " + document.forms.namedItem('address-' + addressID + '-form').elements['address-' + addressID + '-apt'].value + "<br>" + document.forms.namedItem('address-' + addressID + '-form').elements['address-' + addressID + '-city'].value + ", " + document.forms.namedItem('address-' + addressID + '-form').elements['address-' + addressID + '-state'].value + " " + document.forms.namedItem('address-' + addressID + '-form').elements['address-' + addressID + '-zip'].value + '</strong>');
                $(addressModal).modal("hide");
                document.forms.namedItem('address-' + addressID + '-form').reset();
            }
        });

        // Address Delete Form
        $('.address-delete').click(function () {
            var addressID = $(this).attr("id").substr(8, 1),
                addressModal = $('#address-' + addressID + '-modal');
            var json_data = {
                studentID: $(addressModal).attr('data-id'),
                type: $(addressModal).attr('data-type'),
                command: 'delete'
            };
            $.post('/update_address', {data: JSON.stringify(json_data)}, 'json');

            // Remove Phone from DOM
            var addressCol = $(this).closest('.address-col');
            $(addressCol).removeClass('col-lg-4').removeClass('col-md-6').addClass('col-lg-2').removeClass('col-md-4');
            $(addressCol).find('.accent-theme-sm-header').find('p').text('Address');
            var glyphType = $(addressModal).attr('data-type');
            if (glyphType.startsWith('h'))
                glyphType = 'home';
            else if (glyphType.startsWith('w'))
                glyphType = 'briefcase';
            else
                glyphType = 'phone';
            $(addressCol).find('.address-text').empty().append('<span data-toggle="modal" data-target="#address-' + addressID + '-modal" class="btn btn-xs glyphicon glyphicon-' + glyphType + '"></span>');
            $(addressModal).modal('hide');
        });

        //Avatar Form
        $('#avatar-save').click(function () {
            var avatarModal = $('#avatar-modal'),
                avatarInput = $(avatarModal).find('#avatar-input')[0],
                avatarImg = $(avatarModal).prev('img');

            readURL(avatarInput);

            function readURL(input) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    //Display New Image on Profile
                    reader.onload = function (e) {
                        $('#avatar-img')
                            .attr('src', e.target.result).attr('alt', input.files[0].name);
                    };
                    //Check file for Validity
                    var result = checkImgFile(input.files[0]);
                    //Valid File
                    if (result == 1) {
                        reader.readAsDataURL(input.files[0]);

                        // Submit File to Blobstore
                        $(avatarInput).closest('form').submit();

                    }
                    //Invalid File, Display Info on Modal
                    else {
                        $(avatarModal).find('.modal-body').toggleClass('bg-theme-error', setTimeout(function () {
                            $(avatarModal).find('.modal-body').toggleClass('bg-theme-error');
                        }, 1500));
                        $(avatarModal).find('.modal-body').find('.avatar-form-info').text(result);
                        setTimeout(function () {
                            $(avatarModal).find('.modal-body').find('.avatar-form-info').empty();
                        }, 1500);
                    }
                }
            }

        });
        //Avatar Form Text
        $(document).on('change', '.btn-file :file', function () {
            var input = $(this),
                numFiles = input.get(0).files ? input.get(0).files.length : 1,
                label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
            input.trigger('fileselect', [numFiles, label]);
        });
        //Avatar Form Label
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


        //
        //
        // User Interaction Section
        //
        //

        //User Selects Recipe for Favorites
        var favorite = $('.stampable');
        $(favorite).on('click', favorites);

        //User Hides or Shows Profile
        var showHideBtn = $('.profile-btn');
        $(showHideBtn).on('click', hideProfile);

        //User Scroll to Top of Recipes
        var recipeScrollBtn = $('.recipe-scroll-btn'),
            recipeHeader = $('#recipe-header');
        $(recipeScrollBtn).on('click', function () {
            //Get Total Number of Recipes
            var favRecipeCount = favGrid.isotope('getItemElements').length,
                regRecipeCount = grid.isotope('getItemElements').length,
                numberRecipes = (favRecipeCount + regRecipeCount);
            //Get Milliseconds Needed to Traverse Recipe List
            scrollToElement(recipeHeader, (numberRecipes * 50), -12);
        });

        //User Clicks Recipe to View
        $('.recipe-img.rounded').click(function () {
            // Find recipeURLID
            var recipeID = $(this).closest('.grid-item').find('p').attr('data-id');
            // Find studentID
            var studentID = $(this).attr('data-id');
            // Send Post Request to Display Recipe
            $('<form action="/recipe" method="POST" target="">' +
                '<input type="hidden" name="recipeID" value="' + recipeID + '">' +
                '<input type="hidden" name="studentID" value="' + studentID + '">' +
                '</form>').submit();
        });

        //
        //Show/Hide the Recipe Filter Bar
        //
        var recipeFilterHideTimeoutTimer, recipeFilterShowTimeoutTimer;
        var recipeFilterRow = $('.recipe-filter-row');
        $('.recipe-filter-bg').hover(function () {
            recipeFilterShowTimeoutTimer = setTimeout(function () {
                extendRecipeFilterShowTimer();
            }, 400);
        }, function () {
            recipeFilterHideTimeoutTimer = setTimeout(function () {
                extendRecipeFilterHideTimer();
            }, 2000);
        });

        //Extend Timeout for Recipe Filter
        function extendRecipeFilterHideTimer() {
            if ($('#recipe-name-search').is(':focus') || $('#recipe-cat-search').is(':focus') || $('.recipe-filter-bg').is(':hover'))
                setTimeout(extendRecipeFilterHideTimer, 10000);
            else {
                clearTimeout(recipeFilterHideTimeoutTimer);
                $(recipeFilterRow).slideUp();
            }
        }

        //Delay Timein for Recipe Filter
        function extendRecipeFilterShowTimer() {
            if ($('.recipe-filter-bg').is(':hover')) {
                clearTimeout(recipeFilterShowTimeoutTimer);
                $(recipeFilterRow).slideDown();
            }
        }


        //
        //
        // Function Section
        //
        //

        //Process Change in Favorite Recipes
        function favorites() {
            //Get Parent .grid-item
            var favElement = $(this).closest('.grid-item');
            //Get Favorited Status
            var isFaved = $(this).hasClass('fav-select');
            //Indicate Favorited Status
            $(this).toggleClass('fav-select');
            $(favElement).toggleClass('grid-item-fav').find('.recipe-name-label').toggleClass('fav-overlay').toggleClass('light-theme-sm-header').toggleClass('dark-theme-sm-header');
            //Do Favorite Layout Arranging
            if (isFaved) {
                moveToBottom(favElement);
            } else {
                moveToTop(favElement);
            }

            // Update Student Favorite Recipes
            saveFavoriteRecipes();

            // Trigger layout
            $(grid).isotope('layout');
            $(favGrid).isotope('layout');

            // Check if the Favorite Recipe List is Empty
            checkFavorites();
        }

        //Move Favorite Recipes to Favorite Recipe Grid
        function moveFavorites() {
            $(grid).children('div').each(function () {
                if ($(this).hasClass('grid-item-fav')) {
                    var recipeCopy = $(this).clone(true);
                    $(favGrid).append(recipeCopy);
                    $(this).remove();
                }
            });
        }

        //Move Recipe to the Favorites Function
        function moveToTop(recipe) {
            //Copy Element
            var recipeCopy = recipe.clone(true);

            //Hide Recipe Details Overlay
            $(recipeCopy).find('.overlay-recipe-details').hide();

            //Add Element to Favorite Recipes
            $(favGrid).prepend(recipeCopy).isotope('prepended', recipeCopy);

            ////Remove Element from Main recipes
            $(grid).isotope('remove', recipe);

            return recipeCopy;
        }

        //Move Recipe to the All Recipes Function
        function moveToBottom(recipe) {
            //Copy Element
            var recipeCopy = recipe.clone(true);

            //Hide Recipe Details Overlay
            $(recipeCopy).find('.overlay-recipe-details').hide();

            //Append Element to All Recipes
            $(grid).prepend(recipeCopy).isotope('prepended', recipeCopy);

            ////Remove Element from Favorites
            $(favGrid).isotope('remove', recipe);

            return recipeCopy;
        }

        //Save Favorited Recipes
        function saveFavoriteRecipes() {
            var favorites = favGrid.isotope('getItemElements');
            var studentID = $('.recipe-row').attr('data-id');

            var recipes = {};
            recipes['studentID'] = studentID;
            recipes['recipes'] = [];

            $(favorites).each(function (index, recipe) {
                recipes['recipes'][index] = ($(recipe).find('p').attr('data-id'));
            });

            var json_data = JSON.stringify(recipes);
            //alert(json_data);
            $.post('/update_fav_recipes', {data: json_data}, 'json');

            return true;
        }

        //Show/Hide Profile Info
        function hideProfile() {
            var profile = $('.profile');
            if ($(showHideBtn).hasClass('label-default')) {
                $(profile).slideUp({
                    duration: 200,
                    complete: profileButton(true)
                })
            } else {
                $(profile).slideDown({
                    duration: 200,
                    complete: profileButton(false)
                })
            }

            function profileButton(value) {
                if (value)
                    $(showHideBtn).removeClass('label-default').addClass('label-warning').html('<span class="glyphicon glyphicon-menu-down"></span>').parent().parent().toggleClass('hide-row');
                else
                    $(showHideBtn).removeClass('label-warning').addClass('label-default').html('<span class="glyphicon glyphicon-menu-up"></span>').parent().parent().toggleClass('hide-row');
            }
        }

        // Check if the Favorite Recipe List is Empty
        function checkFavorites() {
            var favBG = $(favGrid).parent('div');
            if ($(favBG).height() < 1) {
                $(favBG).toggleClass('bg-theme-highlight').removeClass('isotope-grid-bg');
            } else
                $(favBG).addClass('bg-theme-highlight').addClass('isotope-grid-bg');
        }

        //Scroll to Element
        function scrollToElement(element, timing, offset) {
            $('html, body').animate({
                scrollTop: $(element).offset().top + offset
            }, timing);
        }

        // De-Bounce For Filtering Control of Timing
        function debounce(fn, threshold) {
            var timeout;
            return function debounced() {
                if (timeout) {
                    clearTimeout(timeout);
                }
                function delayed() {
                    fn();
                    timeout = null;
                }

                timeout = setTimeout(delayed, threshold || 100);
            }
        }

        // Validating Basic Form Input for NULL Values
        function validate(form, name) {
            var x = document.forms.namedItem(form).elements[name].value;
            return !($.trim(x) == "");
        }

        //Validating File Input Based on File Type
        function checkImgFile(file) {
            //Check File Size
            if (file.size > 0 && file.size < 1000000) {
                //Check File Name
                var extension = file.name.substr(file.name.lastIndexOf('.') + 1).toUpperCase();
                if (extension == "PNG" || extension == "JPG" || extension == "JPEG" || extension == "GIF")
                    return 1;
                else
                    return "Supported File Types: PNG, JPG, GIF";
            }
            else
                return "Supported File Size: 1MB Maximum";
        }


    });

});