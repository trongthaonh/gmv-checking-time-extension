$( document ).ready(function() {
  chrome.storage.sync.get("settings", function (obj) {
    if(!obj.isEmpty()){
      $("#full_name").val(obj.settings.full_name);
      $("#checkin_room_id").val(obj.settings.checkin_room_id);
      $("#checkout_room_id").val(obj.settings.checkout_room_id);
      $("#loa_room_id").val(obj.settings.loa_room_id);

      //if(obj.settings.full_name && obj.settings.checkin_room_id && obj.settings.checkout_room_id){
      //  $settingForm = $('.setting-form');
      //  $settingForm.data('old-state', $settingForm.html());
      //  $settingForm.html("<p class='extension-title'>You have not yet checked in today!</p><label><span>&nbsp;</span><input id='btn_edit_settings' type='submit' value='Edit Settings' /> </label>");
      //}
    }
  });

  $("#btn_submit").click(function(e){
    e.preventDefault();

    var settings = {
      full_name: $("#full_name").val(),
      checkin_room_id: $("#checkin_room_id").val(),
      checkout_room_id: $("#checkout_room_id").val(),
      loa_room_id: $("#loa_room_id").val()
    };

    chrome.storage.sync.set({'settings': settings}, function(_obj) {
      console.log(_obj);
      console.log("Settings updated");

      //if(_obj.settings.full_name && _obj.settings.checkin_room_id && _obj.settings.checkout_room_id){
      //  $settingForm = $('.setting-form');
      //  $settingForm.data('old-state', $settingForm.html());
      //  $settingForm.html("<p class='extension-title'>You have not yet checked in today!</p><label><span>&nbsp;</span><input id='btn_edit_settings' type='submit' value='Edit Settings' /> </label>");
      //}
    });
  });


  $(document).on("click","#btn_edit_setting", function(){
    $settingForm = $('.setting-form');
    $settingForm.html($settingForm.data('old-state'));
  });
});

Object.prototype.isEmpty = function() {
  for(var key in this) {
    if(this.hasOwnProperty(key))
      return false;
  }
  return true;
};


