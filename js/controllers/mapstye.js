function initialize() {

  // Create an array of styles.
  var styles = [
    {
      stylers: [
        { hue: "#4d4b4b" },
        { saturation: -20 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [ hue: '#ffff00' },
      { gamma: 1.4 },
      { saturation: 82 },
      { lightness: 96 }

      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});

  // Create a map object, and include the MapTypeId to add
  // to the map type control.
  var mapOptions = {
    zoom: 11,
    center: new google.maps.LatLng(21.0226966,105.8369637),
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  };
  var map = new google.maps.Map(document.getElementById('map'),
    mapOptions);

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');
}