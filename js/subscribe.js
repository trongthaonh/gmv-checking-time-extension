var settings = {}, userId;

//
// ONLOAD EXTENSION FUNCTION
//

// Check user_id in extension storage
chrome.storage.sync.get("cw_userid", function (obj) {
  if(!obj.isEmpty()){
    userId = obj.cw_userid
  }
});

// Sync settings data from extension storage
chrome.storage.sync.get("settings", function (obj) {
  if(!obj.isEmpty()){
    settings = obj.settings
  }
});



//
// CATCH REQUEST FROM CHATWORK WEBSITE
//

chrome.webRequest["onBeforeRequest"].addListener(function(info) {

  // Set user_id for the first time
  if(!userId && info.url.indexOf("cmd=get_update&myid") > -1)  {
    // Get userId from url
    myId = info.url.split("&")[1].split("=")[1];

    if (myId){
      chrome.storage.sync.set({'cw_userid': myId}, function() {
        console.log("userId already set");
      });
    }
  }

  // Get settings
  if(settings.isEmpty()){
    chrome.storage.sync.get("settings", function (obj) {
      if(!obj.isEmpty()){
        settings = obj.settings
      }
    });
  }

  chrome.storage.sync.get("status", function (obj) {
    if(!obj.isEmpty()){

      // Not yet checkin
      if(!obj.status.isCheckedIn && userId && info.url.indexOf("cmd=send_chat&myid=" + userId) > -1){

        formData = info.requestBody.formData.pdata[0];

        if(formData.indexOf('"room_id":"' + settings.checkin_room_id + '"')){
          $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/trackings.json',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              tracking: {
                chatwork_id: userId,
                name: settings.full_name,
                tracking_type: 1
              }
            }),
            success: function(json) {
              chrome.storage.sync.set({'status': { isCheckedIn: 1, isCheckedOut: 0 }}, function() {
                console.log("Check-in successful!");
              });
            }
          });
        }
      } else if(obj.status.isCheckedIn){
        console.log("Already checked-in!");
      }

      // Not yet checkout
      if(!obj.status.isCheckedOut && userId && info.url.indexOf("cmd=get_s3_post_object&myid=" + userId) > -1){

        formData = info.requestBody.formData.pdata[0];

        if(formData.indexOf('"room_id":"' + settings.checkout_room_id + '"')){
          $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/trackings.json',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
              tracking: {
                chatwork_id: userId,
                name: settings.full_name,
                tracking_type: 2
              }
            }),
            success: function(json) {
              chrome.storage.sync.set({'status': { isCheckedIn: 1, isCheckedOut: 1 }}, function() {
                console.log("Check-out successful!");
              });
            }
          });
        }
      } else if(obj.status.isCheckedOut){
        console.log("Already checked-out!");
      }
    }
  });

},{
  urls: ["https://www.chatwork.com/*"],
  types: ["xmlhttprequest"]
},
["requestBody"]);


Object.prototype.isEmpty = function() {
  for(var key in this) {
    if(this.hasOwnProperty(key))
      return false;
  }
  return true;
};

