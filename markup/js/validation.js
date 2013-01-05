$(document).ready(function() {
		if(!Modernizr.input.required || !Modernizr.input.pattern) {
		$('form').h5Validate();	
	}
});
