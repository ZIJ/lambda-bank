$(document).ready(function() {
//	DATEPICKERS
$('.datepicker').pikaday({
	format: 'DD.MM.YYYY',
	setDefaultDate : true
});

//  TABS
$('.cards-n-accounts .nav-tabs a:first').tab('show');
$('.cards-n-accounts .nav-tabs a').click(function(e) {
	e.preventDefault();
	$(this).tab('show');
});

//  CLICKABLE ROWS
$('table tbody .expander').click(function() {
	var row = $(this);
	var relevant = row.next('.expandable').find('td').children(":first");
	var padding;
	if (relevant.length === 0) {
		return;
	}
	if (relevant.is(':visible')) {
		padding = relevant.parent().css('padding');
		relevant.parent().stop(true).animate({'padding': 0}, function(){
			relevant.parent().css('padding', padding);
		});
		relevant.stop(true).slideUp(function() {
			$(this).parent().parent().hide();
			row.prop('title', 'Expand');
		});
		return;
	}
	relevant.parent().parent().show();
	padding = relevant.parent().css('padding');
	relevant.parent().css('padding', 0);
	relevant.parent().stop(true).animate({'padding': padding});
	relevant.stop(true).slideDown(function() {
		row.prop('title', 'Collapse');
	});
}).prop('title', 'Expand');

$('table .check').click(function(e){
	e.stopPropagation();
});

$('th.check input[type=checkbox]').click(function(e){
	var checked = $(this).prop('checked');
	$(this).parents('table').find('td.check input[type=checkbox]').prop('checked', checked);
});

$('td.check input[type=checkbox]').click(function(e){
	var checked = true;
	$(this).parents('table').find('td.check input[type=checkbox]').each(function(){
		if ( !$(this).prop('checked') ) {
			checked = false;
		}
	});
	$('th.check input[type=checkbox]').prop('checked', checked);
});

//  EDIT BUTTON
// $('button.edit').click(function() {
// 	$('.data-fields dd').each(function() {
// 		$(this).html('<input type="text" placeholder="' + $(this).html() + '">');
// 	});
// 	$(this).hide();
// 	$('.form-actions').stop(true, true).slideDown();
// });

// $('.form-actions .save').click(function(e) {
// 	e.preventDefault();
// 	showAlert('', 'Предупреждение!', 'Вы действительно хотите сохранить внесённые изменения?', 'Сохранить', function() {
// 		showAlert('success', 'Успех!', 'Внесённые изменения сохранены!');
// 	});
// });
// $('.form-actions .cancel').click(function(e) {
// 	e.preventDefault();
// 	$('.data-fields dd').each(function() {
// 		$(this).html($(this).find('input').prop('placeholder'));
// 	});
// 	$(this).closest('.form-actions').stop(true, true).slideUp();
// 	$('button.edit').show();
// });

//  ALERT
showAlert = function(type, title, text, action, actionCallback, cancelCallback) {

	var fader = $('.fader');
	title = title || 'Предупреждение!';


	if (fader.length === 0) {
		$(document.body).append('<div class="fader"></div>');
		fader = $('.fader');
	}
	var alertBox = fader.find('.alert');
	if (alertBox.length === 0) {
		fader.append(	'<div class="alert alert-block' + (type ? ' alert-' + type : '') + ' fade in">' +
						'<button class="close cancel" data-dismiss="alert">×</button>' +
						'<h4 class="alert-heading">' + title + '</h4>' +
						'<p>' + text + '</p>' +
						(action ? '<p>'+
						'<a class="btn btn-danger action" href="#">' + action + '</a>'+
						' <a class="btn cancel" href="#">Отмена</a></p>' : '') + '</div>');
		alertBox = fader.find('.alert');
	}

	function close() {
		alertBox.remove();
		fader.stop().fadeOut();
	}

	function callback(func) {
		($.isFunction(func) ? func : $.noop)();
	}
	var actionButton = fader.find('.action');
	actionButton.click(function(e) {
		e.stopPropagation();
		e.preventDefault();
		close();
		callback(actionCallback);
	});
	var cancelButton = fader.find('.cancel');
	cancelButton.click(function(e) {
		e.stopPropagation();
		e.preventDefault();
		close();
		callback(cancelCallback);
	});
	fader.stop().fadeIn();
	if (type === 'success' || !action) {
		fader.click(function() {
			close();
		});
	} else {
		fader.off('click');
	}
};
$('button.delete').click(function() {
	showAlert('error', 'Предупреждение!', 'Вы действительно хотите удалить пользователя <strong>username</strong>? Это действие нельзя отменить!', 'Удалить', function() {
		showAlert('success', 'Успех!', 'Вы успешно удалили пользователя <strong>username</strong>');
	});
});
});
