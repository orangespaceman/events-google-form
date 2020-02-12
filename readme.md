# Events with Google Forms

A custom HTML form that stores data in a Google Form, and uses this information to generate an event map using [Leaflet](https://leafletjs.com/).


## Set-up

Create a config file by duplicating the file `config.sample.js` and calling it `config.js`.

Customise the three blocks of values:


### Map

 - `lat`, `lon` and `zoom`: These are the default position for the map.


### Form

Create a new Google Form.

The `id` field in the config should come from the URL of the form.

The form should have the following fields - all defined as text fields (Short answer or long answer):

 - Name
 - URL
 - Event type
 - Date
 - Start time
 - End time
 - Address
 - Postcode
 - Latitude (optional)
 - Longitude (optional)
 - Visible

Lat and Lon fields must be optional. They won't be filled in by any users. Instead, [Postcodes.io](https://postcodes.io/) is used to geocode the postcode and retrieve a latitude and longitude.

The inputs *must* be in the order specified above.

Find out the IDs for these input fields to add to the config. The easiest way to do this is to use the browser's webdev inspector. See [this link](https://github.com/jsdevel/google-form) for detail. They will probably be named `entry.xxxxx`.


### Spreadsheet

Create a Google Spreadsheet from the Google Form responses.

Make the spreadsheet visible publicly - read only.

The `id` field in the config should come from the URL of the spreadsheet.

Sign up for a new Google Spreadsheet API key - see [their documentation](https://developers.google.com/sheets/api/quickstart/js) for detail. You don't need a Client ID, just the [API key](https://console.developers.google.com/apis/credentials).

While setting this up, it's worth restricting its use to specific domains, and only the _Google Sheets API_.

The `sheet` field in the config should come from the name of the spreadsheet tab - this will be created automatically by the Google Form. Replace any spaces with _%20_, for example the value may be `Form%20Responses%201`.

The `range` field in the config should include the fields that are populated by the form, for example `A2:L10000`.


---

## Maintenance and support

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

---

## License

This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.

```
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.

```