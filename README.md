# ParseUtil

用于解释html,xml,json字符串

## 引入ParseUtil

    <script type="text/javascript" src="../src/ParseUtil.js"></script>

## ParseUtil.parseHTML(String)方法
	
	<div id="box1"></div>
	<script type="text/javascript">
    //解释HTML
	var dom=ParseUtil.parseHTML('<div class="username">user</div><div class="age">18</div>');
	document.getElementById('box1').appendChild(dom);
	</script>

## ParseUtil.parseXML(String)方法

    <script type="text/javascript">
    //解释XML
	var xml=ParseUtil.parseXML('<?xml version="1.0" encoding="UTF-8"?><root><username>user</username><age>18</age></root>');
	console.log(xml.getElementsByTagName('username')[0].innerHTML+':'+
				xml.getElementsByTagName('age')[0].innerHTML);
	</script>

## ParseUtil.parseJSON(String)方法

	<script type="text/javascript">
    //解释JSON
	var json=ParseUtil.parseJSON('{"username":"user","age":18}');
	console.log(json.username+':'+json.age);
	</script>

## License

Released under the MIT license, http://github.com/requirejs/requirejs/LICENSE

## 更多项目

[www.idea00.com](http://www.idea00.com/)
