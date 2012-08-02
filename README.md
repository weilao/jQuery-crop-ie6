Description
===========
Easy to use jQuery plugin for zoom & pan image cropping.

Demo
====
Visit: http://www.tmatthew.net/jwindowcrop

Usage
=====
	// minimum
	$( 'img.crop' ).crop();

	// typical
	$( 'img.crop' )
		.crop( {
			width    : 300
			, height : 300
		} )
		.on ( 'crop', function( event ) {
				console.log( $( this ).attr( 'id' ), 'x: '+ event.cropX );
		} );

Options
=======
<table>
	<tr>
		<th>Option</th>
		<th>Type</th>
		<th>Default</th>
		<th>Required</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>width</td><td>integer</td><td>320</td><td>no</td>
		<td>Width in pixels of the cropping window</td>
	</tr>
	<tr>
		<td>height</td><td>integer</td><td>180</td><td>no</td>
		<td>Height in pixels of the cropping window</td>
	</tr>
	<tr>
		<td>zoom</td><td>integer</td><td>10</td><td>no</td>
		<td>Number of incremental zoom steps. With the default of 10, you have to click the zoom-in button 9 times to reach 100%.</td>
	</tr>
	<tr>
		<td>loading</td><td>string/dom</td><td>"Loading..."</td><td>no</td>
		<td>Text (can be HTML or dom) to display within frame until image is loaded.</td>
	</tr>
	<tr>
		<td>controls</td><td>boolean/text</td><td>Click to drag</td><td>no</td>
		<td>If false, no controls will appears. Otherwise controls and text appears mouse hover (using css).</td>
	</tr>
</table>

Event
========
To get crop results, bind a function on crop event.
cropX, cropY, cropW, cropH, stretch (boolean) values are added to the event passed to this function.

Advanced
========
This plugin is a complete rewrite of https://github.com/blackbiron/jWindowCrop 
A reference to the crop object can be accessed like so:
	var crop = $( 'img.crop' ).data( 'crop' );
You then have access to all the properties and methods used for that specific element.