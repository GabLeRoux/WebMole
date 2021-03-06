/*
    WebMole, an automated explorer and tester for Web 2.0 applications
    Copyright (C) 2012-2013 Gabriel Le Breton, Fabien Maronnaud,
    Sylvain Hallé et al.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

$(document).ready(function ()
{
	// editors and code viewers of the application
	initAceEditors();

	// Initialize the tab :)
    $('#tab-web-explorer').tab('show');

	// Handlers for buttons and actions
	attachHandlers();

	// Client Side Options and Settings
	manageSessionStorage();
});

function initAceEditors()
{
	// Load Ace editor on specified inputs
	editorTest = ace.edit("test-oracle-editor");
	editorTest.setTheme("ace/theme/monokai");
	editorTest.getSession().setMode("ace/mode/javascript");
	editorTest.setHighlightActiveLine(false);

	editorStop = ace.edit("stop-oracle-editor");
	editorStop.setTheme("ace/theme/monokai");
	editorStop.getSession().setMode("ace/mode/javascript");

	editorStop.setHighlightActiveLine(false);

	editorReadOnly = ace.edit("json-example");
	editorReadOnly.setTheme("ace/theme/monokai");
	editorReadOnly.getSession().setMode("ace/mode/javascript");
	editorReadOnly.setReadOnly(true);
	editorReadOnly.setHighlightActiveLine(false);

	mapViewerInput = ace.edit("map-viewer-input");
	mapViewerInput.setTheme("ace/theme/monokai");
	mapViewerInput.getSession().setMode("ace/mode/javascript");
	mapViewerInput.setHighlightActiveLine(false);
}

// Note: LocalStorage quotas cannot be made bigger than 5MB
function manageSessionStorage()
{
	if(typeof(Storage) !== "undefined")
	{
		// Yes! localStorage and sessionStorage support!
		if (localStorage.getItem("testOracleCode") === null)
		{
			saveTestOracle();
		}
		if (localStorage.getItem("stopOracleCode") === null)
		{
			saveStopOracle();
		}
	}
	else
	{
		// Sorry! No web storage support..
	}
}

function attachHandlers()
{
	$('#saveTestOracle').click(saveTestOracle());
	$('#saveStopOracle').click(saveStopOracle());


	//Color picker for manual exploration
	$('.web-explorer-manual-color').each(function (index, element)
	{
		var colorPickerelement = $(this);
		$(colorPickerelement).ColorPicker(
		{
			color: get_random_color(),
			onShow: function (colpkr)
			{
				$(colpkr).fadeIn('fast');
				return false;
			},
			onHide: function (colpkr)
			{
				$(colpkr).fadeOut('fast');
				return false;
			},
			onChange: function (hsb, hex, rgb)
			{
				$(colorPickerelement).css('background-color', '#' + hex);
				webExplorer_manualSetActiveColor();
			}
		});
	});

  // Init tooltip for btn with 'btn-tooltip' class
  $('.btn-tooltip').tooltip();

  // Map Viewer compute button
  mapViewerComputeHandler();  

  // Temp action for loading ajax file
  $('.drop-over').click(function ()
  {
  	var json = handle_json_file("data-map-example.json");
  	create_graph(json);
  	$('#upload_modal').modal('hide');
  });

  // Editor Clear button
  $('.action_clear').click(function ()
  {
  	$('.source_input').html('');
  	$('.source_input').val('');
  });
}

function saveTestOracle()
{
	if(typeof(Storage) !== "undefined")
	{
		localStorage.testOracleCode = JSON.stringify(editorTest.getSession().getValue())
		evalTestOracle();
	}
}

function saveStopOracle()
{
	if(typeof(Storage) !== "undefined")
	{
		localStorage.stopOracleCode = JSON.stringify(editorStop.getSession().getValue())
		evalStopOracle();
	}
}

function evalTestOracle()
{
	if (webExplorer_useTestOracle)
	{
		try {
			eval(JSON.parse(localStorage.testOracleCode));
		} catch(err) {
			alert("Error caught in TestOracle");
		}
	}
}

function evalStopOracle()
{
	if (webExplorer_useStopOracle)
	{
		try {
			eval(JSON.parse(localStorage.stopOracleCode));
		} catch(err) {
			alert("Error caught in StopOracle");
		}
	}
}

function get_random_color() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.round(Math.random() * 15)];
	}
	return color;
}

function mapViewerComputeHandler()
{
	$('.action_compute').click(function (event)
	{
	// If input empty, use default graph
	if (mapViewerInput.getSession().getValue() == '')
	{
		$('#source_modal').modal('hide');
	}
	else
	{
		try
		{
			var json = JSON.parse(mapViewerInput.getSession().getValue());
			create_graph(json);
			$('#source_modal').modal('hide');
		}
		catch (err)
		{
			txt = "There was an with your json data.\n";
			txt += "Error description: " + err.message + "\n\n";
			txt += "You can try to validate it with JSONLint. You may also leave the textarea blank for default behaviour";
			alert(txt);
		}
	}
});
}