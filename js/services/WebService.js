
 App.service('WebService', function( $http, $q, $ionicLoading){
  
	/* SIGN UP 
	===========================================*/
	 this.upload = function( link,img_el,post_data ){
		
		// $.mobile.loading('show');
		var url = base_url + link ;
		var result = null;
		
		var deferred = $q.defer();
	    
		var img = document.getElementById(img_el); 
		var imageURI = img.src;
		
			var options = new FileUploadOptions();
			options.fileKey="file";
			options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
			options.mimeType="image/jpeg";
			// var params = new Object();
			// params.value1 = "test";
			// params.value2 = "param";
			
			options.params = post_data;
			options.chunkedMode = false;
			var ft = new FileTransfer();
			
			ft.upload(imageURI, url, 
			function(r){
				deferred.resolve(r.response);	
			}, function(error){
				alert("An error has occurred: Code::: = " + error.code);
				 
				
			}, options);
		
		return deferred.promise;
	  //alert(result);
	 }

	 /* SEND DATA 
	  ===============================================*/ 
	 this.send_data = function( link , post_data ){
			var self = this;
			
			var deferred = $q.defer();
			 var result = null;
				/* WP
        --------------------------------------*/
            if( wordpress == true){
                
                var url = base_url ;                            
                    
                post_data.action = link;
               
                                
                 $.ajax({
                  type: "POST",
                  url: url,
                  data: post_data,
                  success: function(data){ 
                     // alert(JSON.stringify(data)); 
                    deferred.resolve(data);	
                  },
                  dataType: "json"
                });
                
                	
                
                
            }
			else{
				
					var url = base_url + link;					
					var req = {
						 method: 'POST',
						 url: url,
						 data: post_data
					}
					
					 
					$http(req).then( 
						function (data){
							 //alert(JSON.stringify(data.data));
							deferred.resolve(data.data);		
						},function (error){
							/*
							alert(error.status +" "+ error.statusText);
							// alert(JSON.stringify(error,null,4));
							if(error.status == 404){
								alert("Sorry! Server not responding (404)");
							}
							else{
								alert('sorry! an error occured');
							}
							*/
							// self.remove_loading();
							$ionicLoading.hide();
							deferred.reject();
						}
					);	
			}
			
			
		  
		  return deferred.promise;
		 }
		 
	this.show_loading = function(){
		
			$ionicLoading.show({
          content: 'Loading',
          showBackdrop: false
      });
			
	 } 
 })
 
 