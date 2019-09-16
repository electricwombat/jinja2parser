$(function(){

    var varEditor = CodeMirror.fromTextArea($('#templateVars').get(0),{
        mode:  "yaml",
        lineNumbers: true
      });
    
    var tplEditor = CodeMirror.fromTextArea($('#template').get(0),{
        mode:  "jinja2",
        lineNumbers: true
      });

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');
    
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $('#repoSelect').on('change', function(e) {
        e.preventDefault();
        console.log("get templates")
        $.ajax({
            url: '/templateList',
            type: 'GET', 
            data: { 
                repo: $(this).val(),
            },
            success: function (data) {
                console.log(data)
                $('#templateSelect').val(data.templates[0])
            },
            error: function (xhr,errmsg,err) {
                alert(xhr.status + ": " + xhr.responseText);
            }
          });
    });

    $('#clear').on('click', function(e) {
        tplEditor.setValue('');
        varEditor.setValue('')
    });

    $('#copy').on('click', function(e) {
        e.preventDefault();
        tplEditor.focus();
        tplEditor.select();
	    document.execCommand('copy')
        // copy to clipboard
    });

    $('#save').on('click', function(e) {
        e.preventDefault();
        // save template as file
    });

    $('#convert').on('click', function(e) { 
        e.preventDefault();
        console.log("convert triggered")
        $.ajax({
            url: '/convert',
            type: 'POST', 
            data: { 
                template: tplEditor.getValue(),
                templateVars: varEditor.getValue()
            },
            success: function (data) {
                tplEditor.setValue(data)
            },
            error: function (xhr,errmsg,err) {
                alert(xhr.status + ": " + xhr.responseText);
            }
          });
    });
});