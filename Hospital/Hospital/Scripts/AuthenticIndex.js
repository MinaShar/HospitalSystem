//$(function () {

//    $('#login-form-link').click(function (e) {
//        $("#login-form").delay(100).fadeIn(100);
//        $("#register-form").fadeOut(100);
//        $('#register-form-link').removeClass('active');
//        $(this).addClass('active');
//        e.preventDefault();
//    });
//    $('#register-form-link').click(function (e) {
//        $("#register-form").delay(100).fadeIn(100);
//        $("#login-form").fadeOut(100);
//        $('#login-form-link').removeClass('active');
//        $(this).addClass('active');
//        e.preventDefault();
//    });

//});

(function () {

    alert("The script is ready!");

    var set_up = function () {

        alert("inside set_up function!");

        var form = $('#RequiredForm');
        var input = $('#RequiredForm input[type=submit]');

        $('#RequiredForm input[type=submit]').on('click', function (event) {
            
            event.preventDefault();

            var submit_from = true;

            $(".required1").each(function (index, element) {
                if (element.val() == "") {
                    submit_from = false;
                    $("#ErrorMessage").css('display', 'block');
                }
            });
            var test = $("#RequiredForm input[name=type]:checked").val();
            if (submit_from == true) {
                if ($("#RequiredForm input[name=type]:checked").val() == null) {
                    submit_from = false;
                    $("#ErrorMessage").css('display', 'block');
                }
            }

            if (submit_from == true) {
                
                $.ajax({
                    type: "POST",
                    url: "/Authentic/TestLogin",
                    data: jQuery.param({ id: $("#inputID").val(), password: $("#inputPassword").val(), type: $("#RequiredForm input[name=type]:checked").val() }),
                    processData: false,
                    // contentType: false,
                    success: function (data) {
                        //MapCreationConfirmMsg
                        if (data == "1") {
                            $("#RequiredForm").submit();
                        } else {
                            $("#ErrorCredentials").css('display', 'block');
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

            }
        });

    };

    $(document).ready(function () {
        set_up();
    });

})();
