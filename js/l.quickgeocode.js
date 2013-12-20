L.QuickGeocode = {};

L.QuickGeocode.Result = function (x, y, label) {
    this.X = x;
    this.Y = y;
    this.Label = label;
};



L.Control.QuickGeocode = L.Control.extend({
    agsServerGeocode:'gis.ashevillenc.gov', //ArcGIS  server name for geocoding
    agsServerInstanceNameGeocode:'COA_ArcGIS_Server', //ArcGIS  server instance for geocoding
    geocdingLayerName:'Buncombe_Street_Address', //geocoding service to use.        
    mySRID:2264, //your projection id	
    options: {
        position: 'topcenter'
    },

    initialize: function (options) {
        this._config = {};
        L.Util.extend(this.options, options);
        this.setConfig(options);
    },

    setConfig: function (options) {
        this._config = {
            'searchLabel': options.searchLabel || 'search your address here',
            'notFoundMessage' : options.notFoundMessage || 'Sorry, that address could not be found.',
            'messageHideDelay': options.messageHideDelay || 3000,
            'zoomLevel': options.zoomLevel || 16
        };
    },

    onAdd: function (map) {
        var $controlContainer = $(map._controlContainer);

        if ($controlContainer.children('.leaflet-top.leaflet-center').length == 0) {
            $controlContainer.append('<div class="leaflet-top leaflet-center"></div>');
            map._controlCorners.topcenter = $controlContainer.children('.leaflet-top.leaflet-center').first()[0];
        }

        this._map = map;
        this._container = L.DomUtil.create('div', 'leaflet-control-quickgeocode');

        var searchbox = document.createElement('input');
        searchbox.id = 'leaflet-control-quickgeocode-qry';
        searchbox.type = 'text';
        searchbox.placeholder = this._config.searchLabel;
        this._searchbox = searchbox;

        var msgbox = document.createElement('div');
        msgbox.id = 'leaflet-control-quickgeocode-msg';
        msgbox.className = 'leaflet-control-quickgeocode-msg';
        this._msgbox = msgbox;

        var resultslist = document.createElement('ul');
        resultslist.id = 'leaflet-control-quickgeocode-results';
        this._resultslist = resultslist;

        $(this._msgbox).append(this._resultslist);
        $(this._container).append(this._searchbox, this._msgbox);

        L.DomEvent
          .addListener(this._container, 'click', L.DomEvent.stop)
          .addListener(this._container, 'keypress', this._onKeyUp, this);

        L.DomEvent.disableClickPropagation(this._container);

        return this._container;
    },

    geocode: function (qry) {
		addressStr = qry;
		var urlStr = 'http://'+this.agsServerGeocode+'/'+this.agsServerInstanceNameGeocode+'/rest/services/'+this.geocdingLayerName+'/GeocodeServer/findAddressCandidates';
		var sData={f:"json",Street:addressStr};

		$.ajax({
		url: urlStr,
		dataType: "jsonp",
		data: sData,
		success: $.proxy(function(data) {
			if (data.candidates) {
			  it = data.candidates[0];
			  this.getLatLong({ label: it.address, value: it.address, x:it.location.x,y:it.location.y } );
			}
		},this)
		});
    },
	getLatLong:function (someData){
		xStr=someData.x;
		yStr=someData.y;

		var urlStr = 'http://'+this.agsServerGeocode+'/'+this.agsServerInstanceNameGeocode+'/rest/services/Geometry/GeometryServer/project';
		var aPt=JSON.stringify({geometryType:"esriGeometryPoint",geometries : [{"x":xStr,"y":yStr}]});

		var sData={f:"json",inSR:this.mySRID,outSR:4326,geometries:aPt};

		 $.ajax({
		    url: urlStr,
		    dataType: "jsonp",
		    data: sData,
		     crossDomain: true,
		     success:$.proxy(function(data){this.zoomMap(data,17,true);},this),
		     error:function(x,t,m){console.log('fail');}//updateResultsFail(t,'Error with transforming to WGS84!')
		 });
	},
	zoomMap :function(data,zlevel,isDrawPts){
		if(typeof(data) =='string'){var obj = JSON.parse(data);}else{var obj = data}

		xStr=obj.geometries[0].x;
		yStr=obj.geometries[0].y;
		map.setView(new L.LatLng(yStr, xStr), zlevel);
		var startPt = '[{"type": "Point","coordinates":['+xStr+','+yStr+']}]';
		
		if(isDrawPts){this.drawPoints(startPt);}
		return '';
	},	
	drawPoints:function(GJfeat){

		//this.clearMap();
		GJfeatObject=JSON.parse(GJfeat);

		L.geoJson(GJfeatObject, {
		    style: function (feature) {
		    	alert('here')
		        return {color: feature.properties.color};
		    }
		}).addTo(map);


		var geojsonMarkerOptions = {
		  radius: 10,
		  fillColor: "#468847",
		  color: "#468847",
		  weight: 100,
		  opacity: 1,
		  //fillOpacity: 0.8
		};

		var gjPT = L.geoJson(GJfeatObject, {
		  pointToLayer: function (feature, latlng) {
		    return L.circleMarker(latlng, geojsonMarkerOptions);
		  }
		});
		L.geoJson(GJfeatObject).addTo(map);
		gjPT.addTo(map);
	},
	clearMap:function() {
		for(i in map._layers) {
		    if(map._layers[i]._path != undefined) {
		        try {
		            map.removeLayer(map._layers[i]);
		        }
		        catch(e) {
		            //do nothing....
		        }
		    }
		};
	},
   _onKeyUp: function (e) {
        var escapeKey = 27;
        var enterKey = 13;

        if (e.keyCode === escapeKey) {
            $('#leaflet-control-quickgeocode-qry').val('');
            $(this._map._container).focus();
        }
        else if (e.keyCode === enterKey) {
            this.geocode($('#leaflet-control-quickgeocode-qry').val());
        }
    }

});