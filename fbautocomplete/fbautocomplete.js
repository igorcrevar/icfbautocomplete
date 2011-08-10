/**
 * fbautocomplete jQuery plugin
 * version 1.1 
 *
 * Copyright (c) 2010 Igor Crevar <crewce@hotmail.com>
 *
 * Licensed under the MIT (MIT-LICENSE.txt) 
 *
 * Requires: jquery UI autocomplete plugin, jquery offcourse
 * Based on Dan Wellman tutorial 
 * http://net.tutsplus.com/tutorials/javascript-ajax/how-to-use-the-jquery-ui-autocomplete-widget/
 * 
 **/
 
(function($) {
  $.fn.fbautocomplete = function (options) {
	  var defaultOptions = {
			  minLength: 1,
			  url: 'friends.php',
			  title: 'Remove %s',
	  		  useCache: true,
	  		  formName: 'send_message[user]',
	  		  sendTitles: true,
	  		  onChangeFunc: function($obj){ //$obj.css("top", 2); 
	  		  },
	  		  onRemoveFunc: function($obj){ 	
	  			  //correct field position
	  			  if( $obj.parent().find('span').length === 0 ) {
	  				  //$obj.css("top", 0);
	  			  }
	  		  },	
	  		  onAlreadySelected: function($obj){},
	  		  maxUsers: 0,
	  		  onMaxSelectedFunc: function($obj){},
	  		  selected: [],
	  		  cache: {}
			  //new you can override this function if you want custom url generation 
	  		  ,generateUrl: function(url) {
	  			  return url;
	  		  }
			  ,focusWhenClickOnParent: true
			  ,staticRetrieve: false //must have one argument function(term)
			  ,highlight: false
			  
	  };			
	  options = $.extend( true, defaultOptions, options);
	  this.each(function(i){			 	  
		  $(this).fbautocomplete = new $.fbautocomplete($(this), options );
	  });
	
      return this;
  };
  
  $.fbautocomplete = function ($obj, options) { //constructor
	  var $idObj = '#'+$obj.attr('id');
	  var $parent = $obj.parent(); 
	  $parent.addClass('fbautocomplete-main-div').addClass('ui-helper-clearfix');
	  var selected = [];
	  var lastXhr;
	  var lastTerm;
	  
	  for (var i in options.selected){
		  //be sure to use this only if sendTitles is true
		  if ( typeof options.selected[i].title == 'undefined' ) continue;
		  addNewSelected(options.selected[i].id, options.selected[i].title );
	  }
	  $obj.blur(function(){
		 $obj.val('');		 
	  });
	  
	  //helper for setting response
	  function setResponse(response, data){
			response( $.map( data, function( item ) { 
				return {
					value: item.title
					,label: item.title
					,id: item.id
					,src: typeof(item.src) == 'undefined' ? false: item.src
				};
			}));	
	  }
	  $obj.autocomplete({
			minLength: options.minLength,
			//
			source: function(request, response){
				var term = request.term;
				lastTerm = term; //this should be only one variable
				if ( options.staticRetrieve)
				{
					//call to static method
					data = options.staticRetrieve(term);
					setResponse( response, data );
					return;
				}
				
				if ( options.useCache )
				{
					if ( term in options.cache ) {
						setResponse( response, options.cache[ term ] );
						return;
					}
				}
				//generateUrl method can be used to add some add hoc parameters to url
				var url = options.generateUrl(options.url);
				url += url.indexOf('?') == -1 ? '?' : '&';
				url += 'no_cache_value_FBA='+new Date().getTime();

				//pass request to server				
				lastXhr = $.get( url, request, function(data,status, xhr){
					data = eval('('+data+')' );
					if ( options.useCache )
					{
						options.cache[ term ] = data;
					}
					
					if ( lastXhr == xhr )
					{
						setResponse( response, data );
					}
				});
			},

			//define select handler
			select: function(e, ui) {
				addNewSelected(ui.item.id, ui.item.label);
				$obj.val("");
				//prevent ui updater to set input
				e.preventDefault();
				options.onChangeFunc($obj);
			},

			//define change handler
			change: function(event, ui) {
				$obj.val("");
				options.onChangeFunc($obj);
			}
	})
	.data( "autocomplete" )._renderItem = function( ul, item ) {
		var el = $( "<li></li>" ).data( "item.autocomplete", item );
		
		var img = '';
		if ( item.src )
		{
			img = '<img src="'+item.src+'" alt="" />';
		}
		var title = item.label;
		if ( options.highlight )
		{
			var term = lastTerm + "";
			//must escape first http://xregexp.com/xregexp.js
			term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
			var re = new RegExp("(" + term + ")", "gi") ;
			title = item.label.replace(re, "<strong>$1</strong>");
		}
		el.append( "<a>" + img + title + "</a>" ).appendTo( ul );	
		return el;		
	};
	  
	//add live handler for clicks on remove links
	$(".remove-fbautocomplete", $parent.get(0) ).live("click", function(){

		//show input if it was max
		if ( isMaxSelected() )
		{
			$obj.show();
		}
		
	    //remove current friend
	    $(this).parent().remove();
	    var $input = $(this).parent().find('input.ids-fbautocomplete');
	    if ($input.length) removeSelected($input.val()); 
	    		
	    options.onRemoveFunc($obj);
	    return false;
	});
	
	//if user clicks on parent div input is selected  
	$parent.click(function(){  
		if (options.focusWhenClickOnParent){
			$obj.focus();  
		}
	}); 
	
	function addNewSelected(fId, fTitle)
	{
		if ( isInSelected(fId) ){
			options.onAlreadySelected($obj);
			return false;
		}
		if ( isMaxSelected() )
		{
			options.onMaxSelectedFunc($obj);
			return false;
		}
		addToSelected(fId);
		var __title = options.title.replace( /%s/, fTitle );
		
		var $id_hidden = $('<input type="hidden" />').addClass("ids-fbautocomplete").attr('value', fId);
		var $span = $("<span>").text(fTitle).append($id_hidden);
		if ( options.sendTitles ){
			$span.append(
				$('<input type="hidden" />').attr('value', fTitle).attr('name', options.formName+'[title][]') 
			);
			$id_hidden.attr('name', options.formName+'[id][]');
		}
		else{
			$id_hidden.attr('name', options.formName+'[]');
		}
		
		var $a = $("<a></a>").addClass("remove-fbautocomplete").attr({
					href: "#",
					title: __title
				}).text("x").appendTo($span);

		$span.insertBefore( $idObj );
		
		//hidde input if max
		if ( isMaxSelected() )
		{
			$obj.hide();
		}
		
		return true;
	}
	
	function posOfSelected(id)
	{
		for (var i in selected){
			if ( selected[i] == id ){
				return i;
			}
		}
		return -1;
	}
	function isMaxSelected()
	{
		return options.maxUsers > 0  && selected.length >= options.maxUsers;
	}
	function removeSelected(id)
	{
		var pos = posOfSelected(id);
		if (pos != -1) selected.splice(pos,1);
	}
	function isInSelected(id)
	{
		return posOfSelected(id) != -1;
	}
	function addToSelected(id)
	{
		selected[selected.length] = id;
	}
	
	
	
  };
  
})(jQuery);

