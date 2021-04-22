var Piechart = function (options) {
    this.options = options;
    //this.canvas = document.getElementById('mycanvas');
    this.canvas = document.createElement('canvas');
    this.canvas.width = "400";
    this.canvas.height = "400";
    this.canvas.style.position = "absolute";
    this.canvas.style.left = "498px";
    this.canvas.style.top = "212px";

    var body = document.getElementsByClassName("mycontainer")[0];

    $(body).html('');

    var header = $('<h1 style="position: absolute;left: 323px;top: 52px;">Current works</h1>');
    $(body).append(header);

    body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;

    this.draw = function () {
        var total_value = 0;
        var color_index = 0;

        for (var i = 0 ; i < this.options.data.length; i++) {
            total_value += parseInt(this.options.data[i].NumberOfVisits, 10);
        }

        //for (var categ in this.options.data) {
        //    var val = this.options.data[categ];
        //    total_value += val;
        //}

        var start_angle = 0;
        for (var i = 0; i < this.options.data.length; i++) {
            val = this.options.data[i].NumberOfVisits;
            var slice_angle = 2 * Math.PI * val / total_value;

            //////////////////////////put labels///////////////////////////
            var pieRadius = Math.min(this.canvas.width / 2, this.canvas.height / 2);
            var labelX = this.canvas.width / 2 + (pieRadius / 2) * Math.cos(start_angle + slice_angle / 2);
            var labelY = this.canvas.height / 2 + (pieRadius / 2) * Math.sin(start_angle + slice_angle / 2);
            //////////////////////////////////////////////////////////////

            drawPieSlice(
            this.ctx,
            this.canvas.width / 2,
            this.canvas.height / 2,
            Math.min(this.canvas.width / 2, this.canvas.height / 2),
            start_angle,
            start_angle + slice_angle,
            this.colors[color_index % this.colors.length]
            );

            ////////////////////////put labels////////////////////////////
            var labelText = Math.round(100 * val / total_value);
            this.ctx.fillStyle = "white";
            this.ctx.font = "bold 20px Arial";
            this.ctx.fillText(this.options.data[i].Name , labelX, labelY - 25);
            this.ctx.fillText(labelText + "%", labelX, labelY);
            //////////////////////////////////////////////////////////////

            start_angle += slice_angle;
            color_index++;
        }

    };

    var drawPieSlice = function (ctx, centerX, centerY, radius, startAngle, endAngle, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
    };
}



function SetupAddNewUserFrm() {

    var frm = $('.form-container .AddNewUSerFrm');

    frm.find('.role-selecter').find('input[name=role][type=radio]').change(function () {
        if (this.value == '2') {
            frm.find('.form-group').eq(4).css({
                "display": "block"
            });
        } else {
            frm.find('.form-group').eq(4).css({
                "display": "none"
            });
        }
    });

    frm.find('input[type=image][class=generateBtn]').on('click', function (event) {
        event.preventDefault();
        var new_string = generate(8);
        frm.find('input[class=form-control][name=password]').val(new_string);
    });


    frm.find('.btn.btn-primary.btn-lg.btn-block.login-button').on('click', function (event) {

        event.preventDefault();

        $('#LoadingImage').css({
            "display": "block"
        });

        //var frm = $("#create-new-patient-frm")[0];
        var formData = new FormData(frm[0]);
        ////////////////////////UPLOAD NEW USER DATA//////////////////////
        $.ajax({
            type: "POST",
            url: "/Admin/CreateNewUser",
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {

                $('#LoadingImage').css({
                    "display": "none"
                });

                //MapCreationConfirmMsg
                if (data == "1") {
                    $('.mycontainer').html('');
                    $("#deactivateBackground").toggleClass('active');
                    $(".MessageContainer").css('display', 'block');
                    $(".MessageContainer input[type=button]").off().on('click', function () {
                        //alert('Handle the click event');
                        $(".MessageContainer").css('display', 'none');
                        $("#deactivateBackground").toggleClass('active');

                    });
                } else {
                    alert("Something error occured!");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('sent url= ' + this.url);
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError);
                document.getElementById("ForTestingIssues").innerHTML = xhr.responseText;
            }
        });

    });

    var generate = function (length) {
        var chars = "abcdefghijklmnopqrstuvwxyz!@ABCDEFGHIJKLMNOP1234567890";
        var pass = "";
        for (var x = 0; x < length; x++) {
            var i = Math.floor(Math.random() * chars.length);
            pass += chars.charAt(i);
        }
        return pass;
    };
}

function Pie(labels, NumberOfVisists) {

    var getRandomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    $('.mycontainer').html("");

    var canvasParent = $("<div></div>");
    canvasParent.css({
        "position": "absolute",
        "width": "700px",
        "left": "300px",
        "top":"80px"
    });

    canvasParent.appendTo('.mycontainer');

    var BackGroundColors = [];

    for (var i = 0; i < labels.length; i++) {
        BackGroundColors.push(getRandomColor());
    }

    $("<canvas id='myChart' style='position:absolute;'></canvas>").appendTo(canvasParent);

    var ctx = document.getElementById('myChart').getContext('2d');

    data = {
        datasets: [{
            data: NumberOfVisists,
            backgroundColor: BackGroundColors
        }],
        labels: labels
    };

    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {}
    });
}