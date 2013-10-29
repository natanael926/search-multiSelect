define([
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/on",
	"dojo/query",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dijit/form/DateTextBox",
	"dijit/form/Select",
	"dijit/form/CheckBox",
	"dojo/data/ObjectStore"
], function(dom, domConstruct, on, query, lang, arrayUtil, DateTextBox, Select, CheckBox, ObjectStore) {
	return{

		 id: 1,
		 parametrosFormulario: null, // todos los parametros del formularios

		 /**
		 * @param parametros ; los parametros de todos los input del formulario
		 */
		 init: function(parametros) {
		 	this.parametrosFormulario = parametros;
		 	this.createDom();
		 },

		// Creamos los label a mostrar en el div del buscador
		createLabel: function(label) {
			var domUl = dom.byId('ul-label-search'); //obtenemos el nodo de ul
			var domLi = domConstruct.create('li', {'class': 'label-search', id: 'label-search-' + this.id}, domUl); // creamos el li
			domConstruct.create('span', {innerHTML: label}, domLi);

			query(domConstruct.create('a', {href: '#', 'class': 'search-close', rel: this.id }, domLi))
				.on("click", function(e){ 
					var domEliminar = dom.byId('label-search-' + e.target.rel);
					domConstruct.destroy(domEliminar);
				});

			this.id++;
		},

		createDom: function(){
			var divSearch = dom.byId("div-search");

			// Creacion del div de label
			var divInputSearch = domConstruct.create('div', {'class' : 'div-input-search', 'id': 'div-input-search'}, divSearch);
			domConstruct.create('ul', {'id': 'ul-label-search'}, divInputSearch);

			var divBodySearch = domConstruct.create('div', {'class': 'div-body-search', 'id': 'div-body-search'}, divSearch);
			var ulFromSearch = domConstruct.create('ul', {'id': 'ul-form-search'}, divBodySearch);

			arrayUtil.forEach(this.parametrosFormulario.form, lang.hitch(this, function(item, index) {

				switch(item.type) {
					case 'multiDate':
						var liForm  = domConstruct.create('li', {}, ulFromSearch);
						domConstruct.create('div', {'class': 'label-form-search', innerHTML: item.label}, liForm);
						var divInput = domConstruct.create('div', {id: item.id}, liForm);
						domConstruct.create('input', { id: item.id + 'check'}, divInput);
						
						new CheckBox({
							name: 'check-' + this.id,
							value: 'check-' + this.id,
							checked: false,
							onChange:  lang.hitch(this, function(d){ 
								console.log(a);
								if(d){
									console.log(this);
									// this.createLabel('no');
								}else{

								}
							})
						}, item.id + 'check');				

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
						domConstruct.create('input', {type: "checkbox", id: item.id + 'check', 'data-dojo-type': "dijit/form/CheckBox"}, liForm);
						domConstruct.create('div', {id: item.id}, liForm);
						
						var select = new ObjectStore({ objectStore: item.date });
						new Select({ store: select }, item.id).startup();
					break;
				}
			}));
		}
	};
});