# mixpanel-plugin.js

Makes mixpanel javascript api integration simple

A plugin to add Mixpanel tracking api calls with respective elements 
and also call the associated event.
 
## Usage
 
Add respective data attributes with elemets and it will call the 
approperiate Mixpanel api for it.

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

## Todo

- Add test for all scenarios
- Integrate more api from Mixpanel

I love to get your feedback and improvements for this plugin. Ask me if you want any other feature with this plugin.

Thank you to read about it.


## License

Absolutely Free :)