/**
 * Created by Andrew on 2/2/2016.
 */
$(document).ready(function () {

    // SelectPicker Change Add Type to Input
    $(document).on('loaded.bs.select change', '.selectpicker', function (e) {
        $(this).nextAll('input').val($(this).find("option:selected").val());
    });

    //Styled Select Boxes for Input
    $('.selectpicker').selectpicker();

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

                    avatarModal.modal('hide');

                }
                //Invalid File, Display Info on Modal
                else {
                    $(avatarModal).find('.modal-body').toggleClass('bg-danger', setTimeout(function () {
                        $(avatarModal).find('.modal-body').toggleClass('bg-danger');
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

    // Add Phone Button
    $(document).on('click', '.add-phone-btn', function () {
        //$('.add-phone-btn').on('click', function () {
        // Get Phones Div
        var phones = $(this).closest('.phones');
        // Get Last SelectPicker Div
        var lastSelectPicker = phones.children("div:last");
        // Get Last SelectPicker
        var selectPicker = lastSelectPicker.find('.selectpicker');
        // Get Value of SelectPicker
        var value = $(selectPicker).find("option:selected").val();
        // Duplicate Last SelectPicker
        var newSelectPicker = $(lastSelectPicker).clone();
        // Manipulate newSelecPicker
        newSelectPicker.find('.bootstrap-select').remove();
        newSelectPicker.find('select option[value="' + value + '"]').remove();
        // Check to see if there are any Options left
        if (newSelectPicker.find("option:selected").val()) {
            //Manipulating Add/Remove Button
            newSelectPicker.find('.add-phone-btn').addClass('remove-phone-btn').removeClass('add-phone-btn').find('button').addClass('btn-danger').removeClass('btn-primary').find('span').addClass('glyphicon-minus').removeClass('glyphicon-plus');
            // Disable Previous SelectPicker
            selectPicker.attr('disabled', true);
            lastSelectPicker.find('.remove-phone-btn').prop('disabled', true).find('button').addClass('btn-default').removeClass('btn-danger');
            // Change newSelectPickers Name
            var oldNameNum = parseInt(lastSelectPicker.find('select').attr('name').replace(/[^\d.]/g, ''));
            var newName = "phone-type-" + (oldNameNum + 1).toString();
            newSelectPicker.find('select').attr('name', newName);

            // Append newSelectPicker
            $(phones).append('<div class="phone">' + newSelectPicker.html() + '</div');

            // Refresh SelectPickers
            $('.selectpicker').selectpicker('refresh');

            // Refresh BootstrapFormHelper
            $(phones).find('input[type="text"].bfh-phone').each(function () {
                var phone = $(this);
                phone.bfhphone(phone.data());
            });
        }
    });
    // Remove Phone Button
    $(document).on('click', '.remove-phone-btn', function () {
        // Get Phone Div
        var phone = $(this).closest('.phone');
        // Get Phones Div
        var phones = $(this).closest('.phones');
        //Remove phone from phones
        phones.find(phone).remove();
        //Enable Previous SelectPicker
        phones.find('.phone:last').find('.selectpicker').removeAttr('disabled');
        phones.find('.phone:last').find('.remove-phone-btn').removeAttr('disabled').find('button').addClass('btn-danger').removeClass('btn-default');

        // Refresh SelectPickers
        $('.selectpicker').selectpicker('refresh');
    });

    // Submit Button Click
    $('#submit-btn').click(function () {
        //Get Form
        var form = $(document).find('form');
        //Send JSON Request for uploadURL
        var json_data = {
            url: "/new_profile"
        };

        //Get Name Inputs
        var firstName = $('#first-name'),
            lastName = $('#last-name');

        //Get Name Inputs
        var firstNameDiv = $(firstName).closest('.input-group'),
            lastNameDiv = $(lastName).closest('.input-group'),
            checkValue = parseInt(checkFormForCompleteness(firstName, lastName));


        if (checkValue == 0) {
            $(firstNameDiv).toggleClass('has-error', setTimeout(function () {
                $(firstNameDiv).toggleClass('has-error');
            }, 1500));
            $(lastNameDiv).toggleClass('has-error', setTimeout(function () {
                $(lastNameDiv).toggleClass('has-error');
            }, 1500));

            $(firstName).val('');
            $(lastName).val('');
        }
        else if (checkValue == 1) {
            $(firstNameDiv).toggleClass('has-error', setTimeout(function () {
                $(firstNameDiv).toggleClass('has-error');
            }, 1500));

            $(firstName).val('');
        }
        else if (checkValue == 2) {
            $(lastNameDiv).toggleClass('has-error', setTimeout(function () {
                $(lastNameDiv).toggleClass('has-error');
            }, 1500));

            $(lastName).val('');
        }
        else {
            //Get New Upload Url for Blob
            $.post('/blob_upload_url', {data: JSON.stringify(json_data)}, function (data) {
                //Set Form Action Attribute to Response
                form.attr('action', data.url);
                //Submit Form
                form.submit();

            }, 'json');
        }
    });

    function checkFormForCompleteness(first, last) {
        //Get Name Inputs
        var firstName = $(first).val(),
            lastName = $(last).val();

        if ($.trim(firstName) == '' && $.trim(lastName) == '') {
            return 0;
        }
        else if ($.trim(firstName) == '') {
            return 1;
        }
        else if ($.trim(lastName) == '') {
            return 2;
        }
        else
            return 3;
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

    //After Window has Loaded
    $(window).load(function () {


    })

});