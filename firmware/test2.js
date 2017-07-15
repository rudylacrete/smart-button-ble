NRF.setAdvertising({},{name:"rudylacrete smart btn"});

NRF.setServices({
  0xABCD : {
    0xBCDE : {
      writable : true,
      onWrite : function(evt) {
        digitalWrite([LED3,LED2,LED1], evt.data[0]);
      }
    },
    0xBCDF : {
      readable: true,
      notify: true,
      writable : false,
      value: "",
      maxLen: 1
    }
  }
}, { advertise: [ 'ABCD' ] });

setWatch(function() {
  NRF.updateServices({
    0xABCD : {
      0xBCDF : {
        value : "p",
        notify: true
      }
    }
  });
}, BTN, { repeat:true, edge:"rising", debounce: 50 });