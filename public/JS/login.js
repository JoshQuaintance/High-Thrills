function incorrectInput(element) {
	const Parent = $(`.textbox.${element}`);
	let elementIcon = Parent.find('.im');
	let elementUnderline = Parent.find('.underline');
	let elementInput = Parent.find('input');
  let inputLabel = Parent.find('label');
  let titleCased = element.toString().slice(0,1).toUpperCase() + element.toString().slice(1);

	if ($('#title-incorrect').length) {
		$('#title-incorrect').text(`${titleCased} Incorrect`);
	} else {
    
    let incorrectEl = $(`<h3> ${titleCased} Incorrect </h3>`).attr('id', 'title-incorrect')
    $('.input-container').prepend(incorrectEl);
	}

	elementUnderline.addClass('incorrect');
	inputLabel.addClass('incorrect');
	elementIcon.addClass('incorrect');

	setTimeout(() => {
		elementUnderline.removeClass('incorrect');
		inputLabel.removeClass('incorrect');
		elementIcon.removeClass('incorrect');
		elementInput.removeClass('incorrect').removeAttr('style');
	}, 820);
	elementInput.css({
		borderColor : 'red',
		animation   : 'shake .82s'
	});
}

// When an enter key is pressed in the password,
// it will click the sign in button
$('#user-pass').on('keypress', function(e) {
	if (e.key == 'Enter') {
		$('#signin-btn').click();
  }
  
});

$('#back-btn').click(() => {
  window.location.href = window.location.origin;
})

$('form').submit((e) => {
  e.preventDefault();
})
