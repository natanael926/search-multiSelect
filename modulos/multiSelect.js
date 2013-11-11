define([
	"dojo/dom",
	"dijit/registry",
	"dojo/dom-style",
	"dojo/dom-construct",
	"dojo/on",
	"dojo/query",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dijit/form/DateTextBox",
	"dijit/form/Select",
	"dijit/form/CheckBox",
	"dojo/data/ObjectStore",
	"dojo/store/Memory",
	"dojo/request",
	"dojo/fx",
	"dojox/layout/ScrollPane"
], function(dom, registry, domStyle, domConstruct, on, query, lang, arrayUtil, DateTextBox, Select, CheckBox, ObjectStore, Memory, request, fx, ScrollPane) {
	 return{

		 parametrosFormulario: null, // todos los parametros del formularios
		 datosRequert: new Memory({data: [], idProperty: "id"}),
		 datosConsulta:  {},
		 parametrosPost: new Memory({data: [], idProperty: "columna"}), 
		 url: "http://localhost/multi-select-dojo/datos.php",

		 /**
		 * @param parametros ; los parametros de todos los input del formulario
		 */
		 init: function(parametros) {
		 	this.parametrosFormulario = parametros;
		 	this.createDom();
		 },

		// Creamos los label a mostrar en el div del buscador
		createLabel: function(itemInput) {

			// this.prepararDatosRequest();

			var domUl = dom.byId('ul-label-search'); //obtenemos el nodo de ul
			var domLi = domConstruct.create('li', {'class': 'label-search', id:  itemInput.id}, domUl); // creamos el li
			domConstruct.create('span', {innerHTML: itemInput.label}, domLi);

			this.prepararDatosRequest(itemInput);

			query(domConstruct.create('a', {href: '#', 'class': 'search-close', rel: itemInput.id }, domLi))
				.on("click", function(e){ 
					var objCheck = dijit.byId('check-' + e.target.rel);
					objCheck.setChecked(false);
			});
		},

		/**
		* @param id --- id del check
		* @param idNode --- id del div donde se creara el widget
		* @param item --- datos del input
		*
		* RA - 30/10/2013
		*/
		createCheck: function(id, idNode, item) {

			var objectCheck = new CheckBox({
				name: id,
				value:id,
				id:id,
				objectClass: this,
				itemInput: item,
				checked: false,
				onChange:  lang.hitch(objectCheck, function(evt){ 

					if(evt){
						this.objectClass.createLabel(this.itemInput);
					}else{
						var domEliminar = dom.byId(this.itemInput.id);
						domConstruct.destroy(domEliminar);

						this.objectClass.datosRequert.remove(this.itemInput.id);
					}
				})
			}, idNode);	

		},

		/**
		* Creacion del dom
		* RA -- 29/10/2013
		*/
		createDom: function() {

			 // var scrollPane = new dojox.layout.ScrollPane({
    //                  		orientation: "vertical",
    //                  		style:"width:500px; height:30px; border:1px solid; overflow:hidden;"
    //          		}, "div-body-search");

			var divSearch = dom.byId("div-search");

			// Creacion del div de label
			var divInputSearch = domConstruct.create('div', {'class' : 'div-input-search', 'id': 'div-input-search'}, divSearch);
			domConstruct.create('ul', {'id': 'ul-label-search'}, divInputSearch);

			// Efecto 
			on(dom.byId('div-input-search'), 'click', function(evt){

				if(evt.toElement.className == "div-input-search"){
					var styleDisplay = domStyle.get(dom.byId('div-body-search'), 'display');	

					if(styleDisplay == 'none'){
						fx.wipeIn({ node: dom.byId('div-body-search') }).play();
					}else{
						fx.wipeOut({ node: dom.byId('div-body-search')}).play();
					}
				}
			});

			var divBodySearch = domConstruct.create('div', {'class': 'div-body-search', 'id': 'div-body-search'}, divSearch);

			var ulFromSearch = domConstruct.create('ul', {'id': 'ul-form-search'}, divBodySearch);

			// var scrollPane = new dojox.layout.ScrollPane({
   //                  	 		orientation: "vertical",
   //                  			 style:"width:125px; height:200px; border:1px solid; overflow:hidden;"
   //          		 }, ulFromSearch);

			// Recoremos el Json para crear los input...
			arrayUtil.forEach(this.parametrosFormulario.form, lang.hitch(this, function(item, index) {

				switch(item.type) {
					case 'multiDate':
						var liForm  = domConstruct.create('li', {}, ulFromSearch);
						domConstruct.create('div', {'class': 'label-form-search', innerHTML: item.label}, liForm);
						var divInput = domConstruct.create('div', {id: item.id}, liForm);
						domConstruct.create('input', { id: item.id + 'check'}, divInput);
						
						this.createCheck('check-' + item.id, item.id + 'check', item); //creacion del check			

						domConstruct.create('span', {innerHTML: 'de'}, divInput);
						domConstruct.create('input', {id: item.id + 'a'}, divInput);
						domConstruct.create('span', {innerHTML: 'hasta'}, divInput);
						domConstruct.create('input', {id: item.id + 'b'}, divInput);

						var dateTextBox = new DateTextBox({
							itemInput: item,
							onChange: lang.hitch(dateTextBox, function(evt){
								var objCheck = dijit.byId('check-' + this.itemInput.id);
								objCheck.setChecked(true);
							})
						}, item.id + 'a').startup();

						var dateTextBox = new DateTextBox({
							itemInput: item,
							onChange: lang.hitch(dateTextBox, function(evt){
								var objCheck = dijit.byId('check-' + this.itemInput.id);
								objCheck.setChecked(true);
							})
						}, item.id + 'b').startup();

					break;
					case 'select':
						var liForm  = domConstruct.create('li', {}, ulFromSearch);
						domConstruct.create('div', {'class': 'label-form-search', innerHTML: item.label}, liForm);
						var divInput = domConstruct.create('div', {}, liForm);
						domConstruct.create('input', { id: item.id + 'check'}, divInput);
						domConstruct.create('div', {id: item.id}, divInput);

						this.createCheck('check-' + item.id, item.id + 'check', item); //creacion del check
						
						var select = new ObjectStore({ objectStore:  new Memory({  data: item.data}) });
						var selectBox = new Select({ 
							store: select,
							itemInput: item,
							onChange: lang.hitch(selectBox, function(evt){
								var objCheck = dijit.byId('check-' + this.itemInput.id);
								objCheck.setChecked(true);
							})
						}, item.id).startup();
					break;
				}
			}));
		},

		/**
		* Prepara los datos para el envio de los mismo
		*/
		prepararDatosRequest: function(itemInput) {
			if(itemInput.type == 'multiDate') {
				var valorA = registry.byId(itemInput.id + 'a');
				var valorB = registry.byId(itemInput.id + 'b');

				this.datosRequert.add({id: itemInput.id, columna: itemInput.columna, type: itemInput.type, values: {fechaInicio: valorA.value, fechaFinal: valorB.value}});
			} else {
				var valor = registry.byId(itemInput.id);
				this.datosRequert.add({id: itemInput.id, columna: itemInput.columna, type: itemInput.type, values: {valor: valor.value}});
			}

			arrayUtil.forEach(this.datosRequert.query(), lang.hitch(this, function(dato){

				if(this.parametrosPost.get(dato.columna) != true){
					this.parametrosPost.remove(dato.columna);
				}

				this.parametrosPost.add({'type': dato.type, 'columna': dato.columna, 'values': dato.values});				
			}));

			request.post(this.url, {
				data: {
					datos: JSON.stringify(this.parametrosPost.query()),
        				}, handleAs: "json",
    			}).then(lang.hitch(this, function(datos) {
    				this.datosConsulta = datos;
    				console.log('aaaa');

    			}), function(error) {
    				console.log(error.message);
    			});

    			prueba = this;
		}
	};
});