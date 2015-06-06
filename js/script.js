$(function () {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
    var deltaBoss = [
        1, // -15  0
        3, // -14  1
        5, // -13  2
        7, // -12  3
        15, // -11  4
        30, // -10  5
        60, // -9   6
        90, // -8   7
        91, // -7   8
        92, // -6   9
        93, // -5   10
        94, // -4   11
        95, // -3   12
        97, // -2   13
        99, // -1   14
        100, // 0    15
        105, // 1    16
        110, // 2    17
        115, // 3    18
        120, // 4    19
        125, // 5    20
        130, // 6    21
        135, // 7    22
        140, // 8    23
        145, // 9    24
        150, // 10   25
        155, // 11   26
        160, // 12   27
        165, // 13   28
        170, // 14   29
        180         // 15   30
    ];

    var deltaNormal = [
        1, //  -15 0
        5, //  -14 1
        10, //  -13 2
        20, //  -12 3
        30, //  -11 4
        50, //  -10 5
        70, //  -9  6
        80, //  -8  7
        85, //  -7  8
        90, //  -6  9
        92, //  -5  10
        94, //  -4  11
        96, //  -3  12
        98, //  -2  13
        100, //  -1  14
        100, //  0   15
        105, //  1   16
        110, //  2   17
        115, //  3   18
        120, //  4   19
        125, //  5   20
        130, //  6   21
        135, //  7   22
        140, //  8   23
        145, //  9   24
        150, //  10  25
        155, //  11  26
        160, //  12  27
        165, //  13  28
        170, //  14  29
        180, //  15  30
    ];
    var getDelta = function (delta, boss) {
        return boss ? deltaBoss[delta] : deltaNormal[delta];
    };
    var makeChance = function (form) {
        var pct = getDelta(parseInt($(form).find('[name=delta]').val()), $(form).find('[name=delta-boss]').is(':checked'));
        var itemPct = parseFloat($(form).find('[name=pct]').val());
        var sumPct = parseFloat($(form).find('[name=pct_sum]').val());
        var premium = $(form).find('[name=premium]').is(':checked');
        var double = $(form).find('[name=double]').is(':checked');
        if (premium) {
            pct *= parseInt($(form).find('[name=mob_item_buyer]').val()) / 100;
        } else {
            pct *= parseInt($(form).find('[name=mob_item]').val()) / 100;
        }
        pct = Math.floor(pct); // emulate int division
        if (premium || double) {
            pct *= 2;
        }
        var randRange = 4000000 * 100 / (100 + parseInt($(form).find('[name=priv]').val()) + (double ? 100 : 0));
        randRange = Math.floor(randRange);
        switch ($(form).find('[name=type]').val()) {
            case 'md-kill':
                pct = Math.floor(itemPct) / Math.floor(sumPct) * Math.floor(40000 * pct / parseInt($(form).find('[name=kill_drop]').val()));
                break;
            case 'md-drop':
            case 'etc':
                pct = Math.floor(itemPct * 10000) * pct / 100;
                break;
            case 'md-limit':
                randRange = 1000000;
                pct = Math.floor(itemPct * 10000);
                break;
            case 'md-gloves':
                if (premium || double) {
                    pct = Math.floor(itemPct * 10000) * pct / 100;
                } else {
                    pct = 0;
                }
                break;
            case 'common':
                pct = itemPct * pct / 100;
                break;
        }
        console.log(pct, randRange);
        return pct / randRange;
    };
    var doCalc = function (form) {
        var pct = makeChance(form);
        $('#result-pct').text(Math.round(pct*10000)/100+'%');
        $('#result-kills').text(1/pct);
    };
    $('form.drop').submit(function () {
        doCalc(this)
    });
    $('form.drop select[name=type]').change(function (e) {
        $(this).parents('form.drop').find('.types').hide();
        $(this).parents('form.drop').find('.type-' + $(this).val()).show();
        if ($(this).val() == 'md-limit') {
            $(this).parents('form.drop').find('.nonlimit').hide();
        } else {
            $(this).parents('form.drop').find('.nonlimit').show();
        }
    });
    $('form.drop select[name=type]').change(); // trigger event once to hide the crap we dont need
    $('form.drop input,  form.drop select').change(function () {
        doCalc($(this).parents('form.drop'))
    });
    $('form.drop input').keyup(function () {
        doCalc($(this).parents('form.drop'))
    });
    $('form.drop').each(function(){
        doCalc(this);
    });
});