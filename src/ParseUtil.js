/*
 * ParseUtil javascript Library v1.0.0
 * Released under the MIT license, http://github.com/requirejs/requirejs/LICENSE
 * Date: 2015-11-24 00:00:00
 * Author: frewen
 * Site: http://www.idea00.com/
 */

"use stract";

(function(){
	var ParseUtil={
		init:function(){
			var div = document.createElement( "div" );
			div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

			var htmlSerialize=!!div.getElementsByTagName( "link" ).length;
			this.wrapMap._default=htmlSerialize?[ 0, "", "" ]:[ 1,"X<div>","</div>"];
			this.wrapMap.optgroup = this.wrapMap.option;
			this.wrapMap.tbody = this.wrapMap.tfoot = this.wrapMap.colgroup = this.wrapMap.caption = this.wrapMap.thead;
			this.wrapMap.th = this.wrapMap.td;
			this.tbody=!div.getElementsByTagName( "tbody" ).length;
			this.leadingWhitespace=(div.firstChild.nodeType === 3);

			var input = document.createElement( "input" ),
				fragment = document.createDocumentFragment();
			input.type = "checkbox";
			input.checked = true;
			fragment.appendChild( input );
			this.appendChecked= input.checked;

			var docElem = window.document.documentElement;
			var rnative = /^[^{]+\{\s*\[native \w/;
			var hasCompare = rnative.test( docElem.compareDocumentPosition );
			this.contains = hasCompare || rnative.test( docElem.contains ) ?
				function( a, b ) {
					var adown = a.nodeType === 9 ? a.documentElement : a,
						bup = b && b.parentNode;
					return a === bup || !!( bup && bup.nodeType === 1 && (
						adown.contains ?
							adown.contains( bup ) :
							a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
					));
				}:
				function( a, b ) {
					if ( b ) {
						while ( (b = b.parentNode) ) {
							if ( b === a ) {
								return true;
							}
						}
					}
					return false;
				};
		},
		contains:null,

		appendChecked:null,
		rcheckableType : /^(?:checkbox|radio)$/i,

		/*检测是否是单Tag*/
		rsingleTag :/^<(\w+)\s*\/?>(?:<\/\1>|)$/,
		/*检查不是Tag*/
		rhtml : /<|&#?\w+;/,
		/*找出TagName*/
		rtagName : /<([\w:]+)/,
		/*XHTML Tag*/
		rxhtmlTag : /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,

		//XHTML格式
		wrapMap : {
			option: [ 1, "<select multiple='multiple'>", "</select>" ],
			legend: [ 1, "<fieldset>", "</fieldset>" ],
			area: [ 1, "<map>","</map>" ],
			param: [ 1, "<object>", "</object>" ],
			thead: [ 1, "<table>", "</table>" ],
			tr: [ 2, "<table><tbody>", "</tbody></table>" ],
			col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
			td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
			// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
			// unless wrapped in a div with non-breaking characters in front of it.
			_default: null
		},

		leadingWhitespace : null,
		rleadingWhitespace : /^\s+/,

		tbody : null,
		rtbody : /<tbody/i,

		rscriptType : /^$|\/(?:java|ecma)script/i,

		parseHTML:function(elems){
			var parsed,elem;
			if(typeof elems === "string"){
				parsed = this.rsingleTag.exec(elems);
				if(parsed){
					return document.createElement(parsed[1]);
				}else{
					elem=elems;
				}
			}else{
				return elems;
			}
			var j,i, contains,
				tmp, tag, tbody, wrap,
				safe = document.createDocumentFragment(),
				nodes = [];

			// 检测是不是Tag
			if ( !this.rhtml.test( elem ) ) {
				return document.createTextNode( elem ) ;
			// 将字符串转为DOM节点
			} else {
				tmp = safe.appendChild( document.createElement("div") );
				
				tag = (this.rtagName.exec( elem ) || [ "", "" ])[1].toLowerCase();
				wrap = this.wrapMap[tag] || this.wrapMap._default;

				tmp.innerHTML = wrap[1] + elem.replace( this.rxhtmlTag, "<$1></$2>" ) + wrap[2];
				
				j = wrap[0];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}
				// 兼容IE
				if ( !this.leadingWhitespace && this.rleadingWhitespace.test( elem ) ) {
					nodes.push( document.createTextNode( this.rleadingWhitespace.exec( elem )[0] ) );
				}
				if ( !tbody ) {

					elem = tag === "table" && !this.rtbody.test( elem ) ?
						tmp.firstChild :

						wrap[1] === "<table>" && !this.rtbody.test( elem ) ?
							tmp :
							0;

					j = elem && elem.childNodes.length;
					while ( j-- ) {
						if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
							elem.removeChild( tbody );
						}
					}
				}
				this.merge( nodes, tmp.childNodes );
				// for WebKit and IE > 9
				tmp.textContent = "";
				// for oldIE
				while ( tmp.firstChild ) {
					tmp.removeChild( tmp.firstChild );
				}
				tmp = safe.lastChild;
			}


			if ( tmp ) {
				safe.removeChild( tmp );
			}

			if ( !this.appendChecked ) {
				var _this=this;
				var fixDefaultChecked=function( elem ) {
					if ( _this.rcheckableType.test( elem.type ) ) {
						elem.defaultChecked = elem.checked;
					}
				}
				this.grep( this.getAll( nodes, "input" ), fixDefaultChecked );
			}
			i=0;
			while((elem = nodes[ i++ ])){
				safe.appendChild( elem )
			}
			tmp = null;
			return safe;
		},
		getAll:function( context, tag ) {
			var elems, elem,
				i = 0,
				found = typeof context.getElementsByTagName !== 'undefined' ? context.getElementsByTagName( tag || "*" ) :
					typeof context.querySelectorAll !== 'undefined' ? context.querySelectorAll( tag || "*" ) :
					undefined;
			if ( !found ) {
				for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
					if ( !tag || this.nodeName( elem, tag ) ) {
						found.push( elem );
					} else {
						this.merge( found, this.getAll( elem, tag ) );
					}
				}
			}
			return tag === undefined || tag && this.nodeName( context, tag ) ? this.merge( [ context ], found ) : found;
		},
		grep:function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;


			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}
			return matches;
		},
		nodeName:function(elem,name){
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},
		/*合并数组*/
		merge:function(first, second) {
			var len = +second.length,
				j = 0,
				i = first.length;
			while ( j < len ) {
				first[ i++ ] = second[ j++ ];
			}
			first.length = i;
			return first;
		},

		rvalidtokens : /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g,
		parseJSON:function( data ) {
			
			if ( window.JSON && window.JSON.parse ) {
				
				return window.JSON.parse( data + "" );
			}
			var requireNonComma,
				depth = null,
				str = (data+'').replace(/\s/g,'');
			
			return str && !str.replace( this.rvalidtokens, function( token, comma, open, close ) {
				
				if ( requireNonComma && comma ) {
					depth = 0;
				}
				
				if ( depth === 0 ) {
					return token;
				}
				
				requireNonComma = open || comma;
				
				depth += !close - !open;
				
				return "";
			}) ?
				( Function( "return " + str ) )() : console.log( "Invalid JSON: " + data );
		},
		
		parseXML:function( data ) {
			var xml, tmp;
			if ( !data || typeof data !== "string" ) {
				return null;
			}
			try {
				if ( window.DOMParser ) { 
					tmp = new DOMParser();
					xml = tmp.parseFromString( data, "text/xml" );
				} else { // IE
					xml = new ActiveXObject( "Microsoft.XMLDOM" );
					xml.async = "false";
					xml.loadXML( data );
				}
			} catch( e ) {
				xml = undefined;
			}
			if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
				console.log( "Invalid XML: " + data );
			}
			return xml;
		}
	}
	ParseUtil.init();
	window.ParseUtil=ParseUtil;
})();