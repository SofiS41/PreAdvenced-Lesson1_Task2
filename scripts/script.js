$(function(){
    let rows = 4, colums = 4;
    var pieces = '', interval, time=59;

    // creating pieces
    for(let i=0, top=0, order=0; i<rows; i++, top-=100){
        for(let j=0, left=0; j<colums; j++, left-=100, order++){
            pieces += '<div class="piece" style="background-position:'+left+'px '+top+'px" data-order="'+order+'"></div>';
        }
    }
    $('.random-puzzles').html(pieces);

    // timer
    function starttimer(){
        if (interval !== undefined) return;
        interval = setInterval(function() {
            if(time>0){
                time>9 ? $('.timer').text('00:'+time) : $('.timer').text('00:0'+time);
                time--;
            }
            else if(time === 0){
                $('.timer').text('00:00');
                $('.message-bloc').css('display', 'block');
                $('.check').css('display', 'none');
                $('.message-bloc h3').text('Час вичерпано. Ви програли :(');
                $('.check-result').prop('disabled', true);
                $('.dragPiece').draggable('disable');
                clearInterval(interval);
            }
        }, 1000);
    }
    function stoptimer(){
        clearInterval(interval);
        interval = undefined;
    }

    // elements randomizer
    function createElements() {
        $('.random-puzzles div').each(function(){
            let topPosition = Math.floor(Math.random()*290) + 'px';
            let leftPosition = Math.floor(Math.random()*290) + 'px';
            $(this).addClass('dragPiece').css({
                position: 'absolute',
                left: leftPosition,
                top: topPosition
            })
        })
        let emptyString = "";
        for(let i=0, top=0; i<rows; i++, top-=100){
            for(let j=0, left=0; j<colums; j++, left-=100){
                emptyString += `<div class="piece dropSpace" style="background-image:none;"></div>`;
            }
        }
        $('.result-puzzles').html(emptyString);
    }

    // drag && drop
    function droppedElem(){
        $('.dragPiece').draggable();
        $('.dropSpace').droppable({
            accept: '.dragPiece',
            hoverClass: 'highlighted',
            drop:function(event, ui){
                ui.draggable.addClass('dropped').css({
                    top: 0,
                    left: 0,
                    position: 'relative'
                }).appendTo($(this));
            }
        });
    }
    
    // main code 
    createElements();

    $('.start').click(function(){
        $(this).prop('disabled', true);
        $('.check-result').prop('disabled', false);
        $('new').prop('disabled', true);
        droppedElem();
        starttimer();
    });

    $('.new').click(function(){
        $('.random-puzzles').empty();
        $('.result-puzzles').empty();
        $('.random-puzzles').html(pieces);
        createElements();
        stoptimer();
        time = 59;
        $('.timer').text('01:00');
        $('.start').prop('disabled', false);
        $('.check-result').prop('disabled', true);
    })
    
    $('.check-result').click(()=>{
        stoptimer();
        $('.message-bloc').css('display', 'block');
        $('.message-bloc h3').text('Ви впевнені? У Вас є ще вдосталь часу: '+$('.timer').text());
        $('.check').css('display', 'inline-block');
        $('.message-buttons').click((e)=>{
            if($(e.target).hasClass('check')){
                $('.dragPiece').draggable('disable');
                $('.check-result').prop('disabled', true);
                $(e.target).css('display', 'none');
                for(let i=0; i<16; i++){
                    if(i != $('.result-puzzles .dropped:eq('+i+')').data('order')){
                        $('.message-bloc').css('display', 'block');
                        $('.message-bloc h3').text('Нажаль ви програли. Розпочніть нову гру!');
                        return false;
                    }
                }
                $('.message-bloc').css('display', 'block');
                $('.check').css('display', 'none');
                $('.message-bloc h3').text('Ура перемога!!!');
                return true;
            }
            else if($(e.target).hasClass('close')){
                $('.close').click(starttimer);
            }
        })
    })

    $('.close').click(function (){
        $('.message-bloc').css('display', 'none');
    })
});