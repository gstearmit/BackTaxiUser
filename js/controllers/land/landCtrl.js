
App.controller('landCtrl', function($scope,$rootScope,$q, $ionicLoading, $compile, $ionicModal,$window,$timeout,$ionicPopup, landInit, WebService) {
	
	
	
	/* Funtion For set Map
	=========================================================== */
	
	function set_map() {
	    // Create an array of styles.
			var styles = landInit.mapStyles();
	  	
		// Create a new StyledMapType object, passing it the array of styles, 
			var styledMap = new google.maps.StyledMapType(styles,
			{name: "Styled Map"});
	
			var myLatlng = new google.maps.LatLng(21.0226966,105.8369637);
        
			var mapOptions = {
			  center: myLatlng,
			  zoom: 16,
			  
			  disableDefaultUI: true,
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
			var map = new google.maps.Map(document.getElementById("map"),
				mapOptions);
			
			 map.mapTypes.set('map_style', styledMap);
			 map.setMapTypeId('map_style');
			
			
			$scope.map = map;
			
			$scope.init_status = true;
		
      }
	 
	 
	 /* Function For Get place from LatLng
	 ==================================================*/
	 function codeLatLng(lat, lng) {
		    $scope.loading = $ionicLoading.show({
          content: 'Đang lấy vị trí hiện tại...',
          showBackdrop: false
        });
		geocoder = new google.maps.Geocoder();
		
		var latlng = new google.maps.LatLng(lat, lng);
		geocoder.geocode({'latLng': latlng}, function(results, status) {
		  if (status == google.maps.GeocoderStatus.OK) {
		  // console.log(results)
			if (results[1]) {
			
				$scope.$apply(function(){
					$scope.Location = results[0].formatted_address ;
					$scope.start_box.location = results[0].formatted_address ;
				});
				
				$scope.start_box_copy = angular.copy( $scope.start_box );
				$scope.current_box = angular.copy( $scope.start_box );
				
			} else {
			  //alert("No results found");
			  // $scope.Location = "You are here";
			  
			}
		  } else {
			  // $scope.Location = "You are here";
			  
			//alert("Geocoder failed due to: " + status);
		  }
		});
	  }
	 
	 $scope.getCurrentLocation = function() {
        if(!$scope.map) {
          return;
        }
			
        
		/**/
		var contentString = "<div style='width: 200px'><a  ng-click='clickTest()'>{{Location}}</a></div>";
        var compiled = $compile(contentString)($scope);

		var image = 'img/icons/google_marker.png';
			
        $scope.infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });
		
		/**/
        navigator.geolocation.getCurrentPosition(function(pos) {
			//console.log(pos);
			
			//alert(JSON.stringify(pos));
		   var myLatlng	= new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
			
			$scope.start_box.lat = pos.coords.latitude;
			$scope.start_box.lng = pos.coords.longitude;
			
			
			codeLatLng( pos.coords.latitude, pos.coords.longitude );
			
			var marker = new google.maps.Marker({
			  position: myLatlng,
			  map: $scope.map,
			  title: '',
			  icon: image
			});		
			
			$scope.infowindow.open($scope.map,marker);
			
			google.maps.event.addListener(marker, 'click', function() {
				$scope.infowindow.open($scope.map,marker);
			}); 
			
			
			
            $scope.map.setCenter(myLatlng);
            $ionicLoading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      //google.maps.event.addDomListener(window, 'load', initialize);
	  
	  /* Auto comlplete boxes
	  =====================================*/
	 function setAutocompleteBoxes( data ) {
		 var options = {
			// componentRestrictions: {country: "in"}
				componentRestrictions: {country: data.country}
      };
		 var from_el = document.getElementById('autocompletefrom') ;
		
		 var places = new google.maps.places.Autocomplete(from_el,options);
            google.maps.event.addListener(places, 'place_changed', function () {
              var place = places.getPlace();
              $scope.$apply(function(){  
								$scope.start_box.location = place.formatted_address;
                $scope.start_box.lat = place.geometry.location.lat();
								$scope.start_box.lng = place.geometry.location.lng();
							});
							
							$scope.start_box_copy = angular.copy( $scope.start_box );
						
			});  
			
		var to_el = document.getElementById('autocompleteto') ;
		
		 var Tplaces = new google.maps.places.Autocomplete(to_el,options);
            google.maps.event.addListener(Tplaces, 'place_changed', function () {
                
								var Tplace = Tplaces.getPlace();
								$scope.$apply(function(){
									$scope.end_box.location = Tplace.formatted_address;
									$scope.end_box.lat = Tplace.geometry.location.lat();
									$scope.end_box.lng = Tplace.geometry.location.lng();
								})      
								
								$scope.end_box_copy = angular.copy( $scope.end_box );
								
            });  
			
			
	 }
	  
	  var directionsService = new google.maps.DirectionsService();

		function calcRoute(	) {
			// var start = document.getElementById("start").value;
			// var end = document.getElementById("end").value;
			
			var deferred = $q.defer();
			
			
			var request = {
				origin: new google.maps.LatLng( $scope.start_box.lat, $scope.start_box.lng),
				destination: new google.maps.LatLng( $scope.end_box.lat, $scope.end_box.lng),
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			};
			
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					//directionsDisplay.setDirections(response);
					$scope.trip_distance = response.routes[0].legs[0].distance.value / 1000;
					 
					$scope.trip_distance = round_num($scope.trip_distance);
   				
					deferred.resolve( $scope.trip_distance );		
				
					
				}
			});
			return deferred.promise;
		}  
       	// 
		function round_num(num){
			return Math.ceil(num * 10) / 10;
		}
	  function animate_tab(){
				$('#tab-hide').addClass('hidden');
				
				$timeout(function (){
					$('#tab-hide').removeClass('hidden');
				}, 300);
		 }	
/* ##################################################################################  */
	
	 //$scope.user_data = user_data;	 
	 
	 
	 // alert( $scope.user_data.Name )
	 $scope.Location= 'You are here';
	 $scope.start_box = { 'location' : null, 'lat': null, 'lng' : null };
	 $scope.end_box = {  'location' : null, 'lat': null, 'lng' : null };
	 $scope.start_box_copy, $scope.end_box_copy ,current_box = {}
	 
	 $scope.my_model;
	 $scope.pop_status =  false;
	 
	 /* STARTING Point
	 ================================================================*/
	 if( $scope.init_status === undefined ){
			
			set_map();	
			$scope.getCurrentLocation();	
					
				 var link = 'settings';
				 var post_data = {  
									//'user_name' : "Point to Point Transfer" ,
								  
								 }
				
				 WebService.show_loading();	
				 
				 var promise = WebService.send_data( link,post_data);
				 
				 promise.then(function(data){  
					 //alert(JSON.stringify(data,null,4));
						setAutocompleteBoxes(data); 
						
				 });
		}
   
  	$scope.$on( "$ionicView.enter", function( scopes, states ) {
			 google.maps.event.trigger( $scope.map, 'resize' );
		});  
	 
	 function animateMyPop () {
		  $('#my-pop').toggleClass('my-active');
			$scope.pop_status = !$scope.pop_status;
			$scope.Trip_Date = null;
	  }
	  
		/* RIDE NOW 
		======================================*/
	  $scope.ride = function(time){
			
			
			if(  $scope.start_box.lat == null ){
				var alertPopup = $ionicPopup.alert({
					 title: '<p class="text-center color-yellow">Không Thành Công</p>',
					 template: '<p class="text-center color-gery">Bạn Chưa "Nhập vị trí bắt đầu"</p>'
				 });
				 alertPopup.then(function(res) {
					 console.log('');
				 });
			}else if($scope.end_box.lat == null){
				 alertPopup = $ionicPopup.alert({
					 title: '<p class="text-center color-yellow">Không Thành Công</p>',
					 template: '<p class="text-center color-gery">Bạn Chưa "Nhập vị trí muốn đến"</p>'
				 });
				 alertPopup.then(function(res) {
					 
				 });
			}else{
				
				$scope.infowindow.close();
				angular.copy( $scope.start_box_copy, $scope.start_box );
				angular.copy( $scope.end_box_copy, $scope.end_box );
				
				
				if( time == 'later' ){ 
						$scope.Trip_now = false; 
						$scope.past_date = false;
						//$scope.book_date = $scope.Trip_Date;
						$scope.date_data = {};
						min_date = new Date().toISOString();
						var myPopup = $ionicPopup.show({
							template: '<input   class="color-yellow" placeholder="Date:" style=" background-color: #3e3e3e; padding-left:20px;width:100%; line-Height: 20px" ng-model="date_data.Trip_Date" min='+min_date+' type="datetime-local">'+
												'<div class="error  text-center" ng-show="past_date==true">Ngày và thời gian không hợp lệ </div>',
							title: '<p class="color-yellow">Nhập ngày tháng và thời gian </p>',
							scope: $scope,
							buttons: [
								{ text: 'Cancel', 
									onTap: function(e) {
										return false;
									}
								},
								{
									text: 'Save',
								  onTap: function(e) {
									  //alert($scope.date_data.Trip_Date);
										if ($scope.date_data.Trip_Date == null) {
											//don't allow the user to close unless he enters wifi password
											$scope.past_date = true;
											e.preventDefault();
										} else {
											
											return $scope.date_data.Trip_Date;
										}
									}
								}
							]
						});
						
						myPopup.then(function(res) {
							if(res != false){
								$scope.book_date = res;
								$scope.fetch_cabs();	
							}
							
						});
						
				}
				else{ 
							$scope.Trip_now = true;
							$scope.book_date = new Date();	
							$scope.fetch_cabs(); 
				}
				 
			}
		 
	  };
	  
		$scope.cancel = function(){ animateMyPop(); }
		
		$scope.fetch_cabs = function(){
			 
				 /* LOAD CAB DETAILS
				 =================================*/
				 /* Point to Point Transfer : Trỏ đến điểm chuyển giao */
				 var link = 'fetch_cab_details';
				 var post_data = {  
									'transfertype' : "Point to Point Transfer" ,
								  'book_date'    : $scope.book_date ,
								 }
				
				 WebService.show_loading();	
				 
				 var promise = WebService.send_data( link,post_data);
				 
				 promise.then(function(data){  
					 
					 $ionicLoading.hide();
					 //alert(JSON.stringify(data,null,4));
					 
					 if( data.cabs.length == 0 ){
						alert('no cabs')
					 }else{
						 
							$scope.cabs = data.cabs;
							$scope.active_cab = 0;
						  $scope.selected_cab = $scope.cabs[0];
							
							
							/* FIND DISTANCE 
							==============================*/
							
							var dist_promise =  calcRoute();
							
							dist_promise.then(function(dist){  
							  animateMyPop();
							});
							
							
					 }
				 });
					
		}
		
		$scope.book = function(){
			 
			if( $scope.cabs[$scope.active_cab].intialkm >= $scope.trip_distance) {
				$scope.trip_rate = $scope.cabs[$scope.active_cab].intailrate ;
			}else{
				var init_rate =  $scope.cabs[$scope.active_cab].intailrate ;
				
			  var std_rate  =  ( $scope.trip_distance - $scope.cabs[$scope.active_cab].intialkm ) * $scope.cabs[$scope.active_cab].standardrate ;
				
				$scope.trip_rate = round_num( parseFloat(init_rate) + parseFloat(std_rate) );
			}
			
			$rootScope.user_data = JSON.parse( localStorage.getItem('user_data') );			
			
			var link = 'book_cab';
			var post_data = {  
							'user_name'    : $rootScope.user_data.User_name,
							'token'   		 : $rootScope.user_data.token,
							'transfertype' : "Point to Point Transfer" ,
							'book_date'    : $scope.book_date ,
							'pickup_area'  : $scope.start_box.location,
							'drop_area'    : $scope.end_box.location,
							'taxi_type'    : $scope.selected_cab.cartype,
							'km'					 : $scope.trip_distance,
							'amount'			 : $scope.trip_rate	
						 }
	
			WebService.show_loading();	

			var promise = WebService.send_data( link,post_data);

			promise.then(function(data){  
			 
				$ionicLoading.hide();
				if( data.status = 'success'){
					alertPopup = $ionicPopup.alert({
						title: '<p class="text-center color-yellow">Thành Công</p>',
						template: '<p class="text-center color-gery">'+$scope.trip_distance+' KM</p>'+
											'<p class="text-center color-gery"> '+$scope.trip_rate+' VNĐ </p>'
					});
					animateMyPop();
				}else{
					alertPopup = $ionicPopup.alert({
						title: '<p class="text-center color-yellow">Sai</p>',
						template: '<p class="text-center color-gery">Xử lí không thành công!</p>'+
											'<p class="text-center color-gery">Thử Lại! </p>'
					});
				}
			});
		}
		
   
      	
	
  
				
     $scope.clicked_item = function(index){
			 // $window.alert(item); 
			 $scope.active_cab = index;
			 animate_tab();
			 $scope.selected_cab = $scope.cabs[index];
			 
		 }
	   
		$scope.disableTapTo = function(){
			container = document.getElementsByClassName('pac-container');
			// disable ionic data tab
			angular.element(container).attr('data-tap-disabled', 'true');
			// leave input field if google-address-entry is selected
			angular.element(container).on("click", function(){
					document.getElementById('autocompleteto').blur();
			});
		}
		
  	$scope.disableTapFrom = function(){
			container = document.getElementsByClassName('pac-container');
			// disable ionic data tab
			angular.element(container).attr('data-tap-disabled', 'true');
			// leave input field if google-address-entry is selected
			angular.element(container).on("click", function(){
					document.getElementById('autocompletefrom').blur();
			});
		}
  	
});

App.service('serv', function($rootScope) {
  
    this.set_trip_tab = function(){
		  
			$rootScope.myTrip_menu_selected = 0;
			
		};

  
});