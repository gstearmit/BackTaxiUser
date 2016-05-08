
App.controller('myTripCtrl', function($scope,$rootScope, $ionicLoading, $compile, $ionicModal,$window,$timeout,$ionicPopup,serv ) {
	
	/* JAVASCRIPT
	===========================*/
	function animate_Trip_item(){
			$('#content-tab-area').addClass('hidden');
			
			$timeout(function (){
				$('#content-tab-area').removeClass('hidden');
			}, 300);
	 }	
	
	
	
	$scope.myTrip_menu = [
												{'name':'TẤT CẢ CÁC CHUYẾN'}, // ALL RIDES
												{'name':'HOÀN THÀNH'},
												{'name':'ĐĂ ĐẶT'},
												
											 ];
 
	//$scope.myTrip_menu_selected = 0;
	
	$scope.Trip_menu_click = function (index){
		if( $rootScope.myTrip_menu_selected != index ){
			
			$rootScope.myTrip_menu_selected = index;
			if( index == 0 ){
				$rootScope.active_trip = $rootScope.Trips.all;
			}else if( index ==  1 ){
				$rootScope.active_trip = $rootScope.Trips.success;
			}else if( index ==  2){
				$rootScope.active_trip = $rootScope.Trips.booking;
			}
			animate_Trip_item();
		}
	}
	
	$scope.show_details = function( index ){
		$rootScope.details = $rootScope.active_trip[index];
		
	}

});