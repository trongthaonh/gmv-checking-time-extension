$( document ).ready(function() {
  chrome.storage.sync.get("settings", function (obj) {
    if(!obj.isEmpty()){
      $("#full_name").val(obj.settings.full_name);
      $("#checkin_room_id").val(obj.settings.checkin_room_id);
      $("#checkout_room_id").val(obj.settings.checkout_room_id);
      $("#loa_room_id").val(obj.settings.loa_room_id);

      if(obj.settings.full_name && obj.settings.checkin_room_id && obj.settings.checkout_room_id){
        $settingForm = $('.setting-form');
        $settingForm.data('old-state', $settingForm.html());

        // Check user status
        chrome.storage.sync.get("status", function (obj) {
          myStatus = obj.status;

          if(!myStatus || myStatus.isCheckedIn == 0){
            $settingForm.html("<p class='extension-title'>You have not yet checked in today!</p><label>");
          }
          else if(myStatus.isCheckedIn == 1 && myStatus.isCheckedOut == 0){
            $settingForm.html("<p class='extension-title'>Already checked in! Have a good working day! :)</p><label>");
          } else if(myStatus.isCheckedIn == 1 && myStatus.isCheckedOut == 1){
            $settingForm.html("<p class='extension-title'>Thank you for your hard working Today! Enjoy!!! :)</p><label>");
          }
        });


      }
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

    chrome.storage.sync.set({'settings': settings}, function() {
      console.log("Settings updated");

      if(settings.full_name && settings.checkin_room_id && settings.checkout_room_id){
        $settingForm = $('.setting-form');
        $settingForm.data('old-state', $settingForm.html());
        $settingForm.html("<p class='extension-title'>You have not yet checked in today!</p><label>");

        chrome.storage.sync.set({'status': { isCheckedIn: 0, isCheckedOut: 0 }}, function() {
          console.log("Status has been init!");
        });
      }
    });
  });


  //$("#btn_edit_setting").click(function(){
  //  $settingForm = $('.setting-form');
  //  $settingForm.html($settingForm.data('old-state'));
  //});
});

Object.prototype.isEmpty = function() {
  for(var key in this) {
    if(this.hasOwnProperty(key))
      return false;
  }
  return true;
};


