$(document).ready(function() {
    if(!Modernizr.input.required || !Modernizr.input.pattern) {
        $('form').h5Validate(); 
    }
    var weight = [7,3,1];
    $('input[data-validate="passport"]').on('input', function(){
        var that = $(this);
        that.popover({title:function(){return '';}});
        var val = that.val();
        var re = new RegExp(that.prop('pattern'));
        var result = re.exec(val);
        if(that.is(':valid'))
        {
            var checksumm = Number(result[5]);
            var summ = 0;
            var multiplyer = 1;
            var numbers = numerize(val);
            for (var i = 0; i < numbers.length - 1; i++) {
                multiplyer = weight[i%weight.length];
                summ += numbers[i] * multiplyer;
            }
            var result = summ%10;
            if ( result !== checksumm )
            {
                
                that.popover('show');
                setTimeout(function(){
                    that.popover('hide');
                }, 3000);

            }
            else 
            {
                that.popover('hide');
            }
        }
    });
});


var digits = /^\d$/;
var letters = /^[a-z]$/;
function numerize(str) {
  chars = str.toLowerCase().split('');
  return chars.map(function(chr){
    if (letters.test(chr)) {
      return chr.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
    } else if (digits.test(chr)) {
      return chr; 
    } else {
      throw new Error('unexpected character'); 
    }
  });
}
