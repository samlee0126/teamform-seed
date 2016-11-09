$(document).ready(function() {
	$('#createTable_form').bootstrapValidator({
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields: {
			table_name: {
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
						message: 'Please provide a table name.'
					}
				}
			},
			input_password: {
				validators: {
					stringLength: {
						min: 4,
						message: 'Minimum of 4 characters is required.'
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
						$("#input_password").val("");
						$("#createTable_form").data('bootstrapValidator').updateStatus('input_password', 'NOT_VALIDATED', null);
            $("#confirm_password").prop('disabled', true);
						$("#confirm_password").val("");
						$("#createTable_form").data('bootstrapValidator').updateStatus('confirm_password', 'NOT_VALIDATED', null);
        });

        // No Input
        $("#access_private").on("click", function () {
            $("#input_password").prop('disabled', false);
            $("#confirm_password").prop('disabled', false);
        });

});
