$(document).ready(function() {
	$('#createTable_form').bootstrapValidator({
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields: {
			login_name: {
				validators: {
					stringLength: {
						max: 20,
						message: 'At most 20 characters are allowed.'
					},
					regexp: {
						regexp: /^[A-z0-9_]+$/i,
						message: 'Please use alphabets, digits or underscore only.'
					},
					notEmpty: {
						message: 'Please provide a user name.'
					}
				}
			},
			major: {
				validators: {
					notEmpty: {
						message: 'Please select your major.'
					}
				}
			},
			graduation_year: {
				validators: {
					notEmpty: {
						message: 'Please select your graduation year.'
					}
				}
			},
			input_password: {
				validators: {
					stringLength: {
						min: 6,
						message: 'Minimum of 6 characters is required.'
					},
					regexp: {
						regexp: /^[A-z0-9_]+$/i,
						message: 'Please use alphabets, digits or underscore only.'
					},
					notEmpty: {
						message: 'Please enter a password.'
					}
				}
			},
			confirm_password: {
				validators: {
					identical: {
						field: 'input_password',
						message: 'Passwords do not match.'
					},
					notEmpty: {
						message: 'Please re-enter the password.'
					}
				}
			}
		}
	});

        // Yes Input
        $("#access_public").on("click", function () {
            $("#input_password").prop('disabled', true);
            $("#confirm_password").prop('disabled', true);
        });

        // No Input
        $("#access_private").on("click", function () {
            $("#input_password").prop('disabled', false);
            $("#confirm_password").prop('disabled', false);
        });

});
