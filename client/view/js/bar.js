(function () {

  $("#passsword").keypress(function (e) {
  if(e.keyCode=='13') //Keycode for "Return"
     $('#login').click();
  });

  $("#username").keypress(function (e) {
  if(e.keyCode=='13') //Keycode for "Return"
     $('#login').click();
  });

  function tog(v){return v?'addClass':'removeClass';} 
$(document).on('input', '.clearable', function(){
    $(this)[tog(this.value)]('x');
}).on('mousemove', '.x', function( e ){
    $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
}).on('touchstart click', '.onX', function( ev ){
    ev.preventDefault();
    $(this).removeClass('x onX').val('').change();
});

  const remote = require('electron').remote;
  
  function init() {
    document.getElementById("min-btn").addEventListener("click", function (e) {
      const window = remote.getCurrentWindow();
      window.minimize();
    });
    document.getElementById("max-btn").addEventListener("click", function (e) {
      const window = remote.getCurrentWindow();
      if (!window.isMaximized()) {
        window.maximize();
        document.getElementById("max-btn").title = 'Restore Down';
        var view = "view";
        if (document.URL.includes(view)){
        $('#max-btn').css('background-image', 'url("../view/img/restore.png")');
        }else{
        $('#max-btn').css('background-image', 'url("view/img/restore.png")');
        }
      } else {
        window.unmaximize();
        document.getElementById("max-btn").title = 'Maximize';
                var view = "view";
        if (document.URL.includes(view)){
        $('#max-btn').css('background-image', 'url("../view/img/maximize.png")');
        }else{
        $('#max-btn').css('background-image', 'url("view/img/maximize.png")');
        }
        }
      });
      
      document.getElementById("close-btn").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        window.close();
      });
    };
    
    document.onreadystatechange = function () {
      if (document.readyState == "complete") {
        $( ".content-loading" ).fadeOut( "slow" );
        init();
      }
    };
          
})();