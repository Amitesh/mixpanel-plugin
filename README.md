# mixpanel-plugin.js

Makes Mixpanel javascript api integration simple

A plugin to add Mixpanel tracking api calls with respective elements 
and also call the associated event.

## Requirement

Add [jQuery.js](http://jquery.com/) plugin

## Usage

Load the `mixpanel-plugin.js` file with page after **jQuery** plugin js.

```html
<script type="text/javascript" src="mixpanel-plugin/mixpanel-plugin.js" ></script>
```

Add respective data attributes with elements and it will call the 
approperiate Mixpanel api for it.

### List of data attributes

`data-mixp-event`
`data-mixp-attrs`
`data-mixp-track-link`
`data-mixp-track-form`

### Methods

`MixpanelPlugin.send(elem)`


## Track page event

```html
<div data-mixp-event="event name" 
    data-mixp-attrs='{"prop1": "val1", "prop2": "val1"}' >
</div>
```
Event name example : Page.home, Page.login

## Track user identity and add his/her profile

```html
<div data-mixp-person-identity="user unique id" 
      data-mixp-attrs='{"$first_name": "val1", "$last_name": "val1", 
          "$email": "", "other_property":""}' >
</div>
```

Check Mixpanel `mixpanel.person.set` documentation for more information about properties associated woith person.

## Track link click

It will add href as url property with the click event.

```html
<a data-mixp-track-link="event name" href="some/url"
    data-mixp-attrs='{}'>
</a>
````

Example
```html
<a href="#" data-mixp-track-link="Click.login" data-mixp-attrs='{}'>
</a>
```

## Track form submit

It will add action path as url property with submit event.

```html
<form action="/payment" data-mixp-track-form="event name" data-mixp-attrs='{}'>
</form> 
```
## Call track event on a element through JavaScript

A custom function to send events by calling from javascript. It will take all properties from the given element and end with event. Although we can use mixpanel.track() as well but `send()` will collect all attributes (`data-mixp-attrs`) from element

```javascript
MixpanelPlugin.send(elem)
````


## References

- [Mixpanel.com](https://mixpanel.com)
- [Mixpanel Documentation](https://mixpanel.com/help/reference)
- [Blog](http://blog.qhashtech.com/2014/10/04/plugin-for-mixpanel-javascript-api-integration)

## Screenshots

Activity feeds
![Activity feeds](http://blog.qhashtech.com/content/uploads/2014/10/mixpanel-activity-feeds.png "Activity feeds")

Successful payment funnel
![Successful payment funnel](http://blog.qhashtech.com/content/uploads/2014/10/Checkout-succesfull-funnel.png "Funnel")

## Todo

- Add test for all scenarios
- Integrate more api from Mixpanel

I love to get your feedback and improvements for this plugin. Ask me if you want any other feature with this plugin.

Thank you to read about it.


## License

Absolutely Free :)