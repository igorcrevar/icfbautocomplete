# fbautocomplete - Facebook like autocompleter
First of all, this plugin is based on autocompleter from `jquery-ui`, so jquery-ui is mandatory. Ofcourse, `jquery` is also required. I have tested plugin with `1.11.1` version of jquery and it seams to work ok :)

So... These javascripts are necessary to include in your html:
```html
<script src="requirements/jquery.js" type="text/javascript"></script>
<script src="requirements/jquery-ui.min.js" type="text/javascript"></script>
<!-- actual fbautocomplete plugin -->
<script src="fbautocomplete/fbautocomplete.js" type="text/javascript"></script>
```
You also need to include `jquery-ui css`. fbautocomplete.css is not mandatory but you can you use it as base for your own
style:
```html
<link href="requirements/jquery-ui.min.css" rel="stylesheet" type="text/css" />
<link href="fbautocomplete/fbautocomplete.css" rel="stylesheet" type="text/css" />    
```
Html for autocomplete field should look something like (note that parent div IS mandatory! Actually, you can provide other container for input field, but if you forget to put container manually, then... unwanted things could happen ;)):
```html
<div><input id="fbautocomplete_id" type="text" /></div>
```
Actual js is simple as:
```js
$('#fbautocomplete_id').fbautocomplete();
```
### Options
Well, there are quite a few options for plugin. You can check some of the most used by looking at example (index.html) provided with plugin. I will provide detail list of them with explanation later. Most important one you probaly have to change is:
- `url`:       by default the value of this parameter is `'friends.php'`. Plugin will call this url (somewhere on your server) for json data
```js
$('#fbautocomplete_id').fbautocomplete({ 'url': '/path_somewhere_on_your_server' });
```

### Server side
Actual server side is quite simple. In example provided, I used PHP. Text entered in input field is passed to server through `term` parameter of `GET` http request. The task of your page/servlet/whatever is to return `json` of desired items which satisfies somehow `term` condition. Format of outputed json should be something like:
```js
[ { 'id': 1, 'title': 'First item' }, { 'id': 2, 'title': 'Second item' } ]
```
Custom properties of objects in array are also possible - try play with `src`! ;)
For detailed example look at friends.php file