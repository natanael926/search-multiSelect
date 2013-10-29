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
	"dojo/data/ObjectStore",
	"dojo/store/Memory"
], function(dom, domConstruct, on, query, lang, arrayUtil, DateTextBox, Select, CheckBox, ObjectStore, Memory) {
	 return{

		 id: 1,
		 prueba: null,
		 parametrosFormulario: null, // todos los parametros del formularios
		 labelObj: new Memory({data: [], idProperty: "id"}),

		 /**
		 * @param parametros ; los parametros de todos los input del formulario
		 */
		 init: function(parametros) {
		 	this.parametrosFormulario = parametros;
		 	this.createDom();
		 },

		// Creamos los label a mostrar en el div del buscador
		createLabel: function(label, id) {
			var domUl = dom.byId('ul-label-search'); //obtenemos el nodo de ul
			var domLi = domConstruct.create('li', {'class': 'label-search', id:  id}, domUl); // creamos el li
			domConstruct.create('span', {innerHTML: label}, domLi);

			query(domConstruct.create('a', {href: '#', 'class': 'search-close', rel: id }, domLi))
				.on("click", function(e){ 
					var objCheck = dijit.byId('check-' + e.target.rel);
					objCheck.setChecked(false);
			});
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
						
						this.prueba = item; // creamos una variable de entorno global 
						console.log(item);
						new CheckBox({
							name: 'check-' + item.id,
							value: 'check-' + item.id,
							id: 'check-' + item.id,
							checked: false,
							onChange:  lang.hitch(this, function(d){ 
								console.log(this.prueba);
								if(d){
									this.createLabel(this.prueba.label, this.prueba.id);
								}else{
									var domEliminar = dom.byId(this.prueba.id);
									domConstruct.destroy(domEliminar);
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
						var divInput = domConstruct.create('div', {}, liForm);
						domConstruct.create('input', { id: item.id + 'check'}, divInput);
						domConstruct.create('div', {id: item.id}, divInput);

						this.prueba  = item; // creamos una variable de entorno global 
						console.log(item);
						new CheckBox({
							name: 'check-' + item.id,
							value: 'check-' + item.id,
							id: 'check-' + item.id,
							checked: false,
							onChange:  lang.hitch(this, function(evt){ 
								
								console.log(this.prueba);

								if(evt){
									this.createLabel( 'asasasa',  this.prueba.id);
								}else{
									var domEliminar = dom.byId(this.prueba.id);
									domConstruct.destroy(domEliminar);
								}
							})
						}, item.id + 'check');	
						
						var select = new ObjectStore({ objectStore: item.date });
						new Select({ store: select }, item.id).startup();
					break;
				}

				this.id++;
			}));
		}
	};
});