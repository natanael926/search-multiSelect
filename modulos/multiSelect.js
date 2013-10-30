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
	"dojo/fx"
], function(dom, registry, domStyle, domConstruct, on, query, lang, arrayUtil, DateTextBox, Select, CheckBox, ObjectStore, Memory, fx) {
	 return{

		 parametrosFormulario: null, // todos los parametros del formularios
		 datosRequert: new Memory({data: [], idProperty: "id"}),

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

			var valor = registry.byId(itemInput.id);
			console.log('-----------');
			console.log(valor.getValue());

			if(itemInput.type == 'multiDate') {
				this.datosRequert.add({id: itemInput.id, values: {valor1: 1, valor2: 2}});
			} else {
				this.datosRequert.add({id: itemInput.id, values: {valor1: 1}});
			}

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

					console.log(this.objectClass.datosRequert);

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
			var divSearch = dom.byId("div-search");

			// Creacion del div de label
			var divInputSearch = domConstruct.create('div', {'class' : 'div-input-search', 'id': 'div-input-search'}, divSearch);
			domConstruct.create('ul', {'id': 'ul-label-search'}, divInputSearch);

			// Efecto 
			on(dom.byId('div-input-search'), 'click', function(evt){
				console.log(dom.byId('div-body-search'));
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

						new DateTextBox({}, item.id + 'a').startup();
						new DateTextBox({}, item.id + 'b').startup();
					break;
					case 'select':
						var liForm  = domConstruct.create('li', {}, ulFromSearch);
						domConstruct.create('div', {'class': 'label-form-search', innerHTML: item.label}, liForm);
						var divInput = domConstruct.create('div', {}, liForm);
						domConstruct.create('input', { id: item.id + 'check'}, divInput);
						domConstruct.create('div', {id: item.id}, divInput);

						this.createCheck('check-' + item.id, item.id + 'check', item); //creacion del check
						
						var select = new ObjectStore({ objectStore: item.date });
						new Select({ store: select }, item.id).startup();
					break;
				}
			}));
		},

		prepararDatosRequest: function() {
			var node = dom.byId('div-input-search');

			console.log(node);
		}
	};
});