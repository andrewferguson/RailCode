var currentLessonNum = 0;
var indexToPick = 1;
var arrivedAtStationCallback = false;

var trainStations = [];
var trainLines = [];
var closedStationList = [];

// THESE FUNCTIONS ARE FOR THE COMPILER
function replaceAll(text, strA, strB)
{
	while ( text.indexOf(strA) != -1)
	{
		text = text.replace(strA,strB);
	}
	return text;
}
var http = new XMLHttpRequest();
function compileAndRun()
{
	var codeToCompile = document.getElementById("railcodeCode").value;
	http.open('get', '/compiler/compiler.php?script=' + encode64( codeToCompile ), false);
	http.send( null );
	var javascriptCode = replaceAll( http.responseText, "\\\"", "\"" );
	eval(javascriptCode);
}
// END OF THE COMPILER FUNCTIONS

// THESE FUNCTION ARE FOR THE LANGUAGE

function currentstation()
{
	return currentStationName;
}

function canmoveforwards()
{
	var stationAndBranchNumber = getStationNumberAndBranchNumberFromStationName( currentStationName );
	var stepNumber = stationAndBranchNumber.stationNumber;
	var newStepNumber = stepNumber + 1;
	var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
	if( theStation == undefined )
	{
		return false;
	}
	else
	{
		var oldTheStation;
		for( var x = 0; x < stationAndBranchNumber.branchNumber.length; x++ )
		{
			oldTheStation = theStation;
			theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			if( theStation == undefined )
			{
				theStation = oldTheStation;
			}
		}
		if( theStation == undefined )
		{
			var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
		}
		var stationName = theStation.name;
		if( stationName == undefined )
		{
			theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
			if( theStation.length == 2 )
			{
				theStation = theStation[indexToPick][0];
				testStation = theStation;
				stationName = theStation.name;
			}
			else if( theStation.length == 1 && theStation[0] == 0 )
			{
				return false;
			}
			else
			{
				return false;
			}
		}
		if( stationName != undefined )
		{
			return true;
		}
	}
}

function canmovebackwards()
{
	var stationAndBranchNumber = getStationNumberAndBranchNumberFromStationName( currentStationName );
	var stepNumber = stationAndBranchNumber.stationNumber;
	var newStepNumber = stepNumber - 1;
	var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
	if( theStation == undefined )
	{
		return false;
	}
	else
	{
		var oldTheStation;
		for( var x = 0; x < stationAndBranchNumber.branchNumber.length; x++ )
		{
			oldTheStation = theStation;
			theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			if( theStation == undefined )
			{
				theStation = oldTheStation;
			}
		}
		if( theStation == undefined )
		{
			var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
		}
		var stationName = theStation.name;
		if( stationName == undefined )
		{
			theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
			if( theStation.length == 2 )
			{
				theStation = theStation[indexToPick][0];
				testStation = theStation;
				stationName = theStation.name;
			}
			else if( theStation.length == 1 && theStation[0] == 0 )
			{
				return false;
			}
			else
			{
				return false;
			}
		}
		if( stationName != undefined )
		{
			return true;
		}
	}
}

function switchlines()
{
	var oldCurrentLine = currentLine;
	var stationLineStradles = [];
	for( var x = 0; x < currentLesson.lines.length; x++ )
	{
		currentLine = x;
		var stationAndBranchNumber = getStationNumberAndBranchNumberFromStationName( currentStationName );
		if( stationAndBranchNumber )
		{
			stationLineStradles.push(currentLesson.lines[x].name);
		}
	}
	currentLine = oldCurrentLine;
	return stationLineStradles;
}

function getStationNumberAndBranchNumberFromStationName( stationName )
{
	stationName = stationName.toLowerCase();
	var stationOptions = currentLesson.lines[currentLine].locations.length;
	for( var x = 0; x < stationOptions; x++ )
	{
		var totalBranchOptions = [];
		var branchOptions1 = currentLesson.lines[currentLine].locations[x].length;
		if( branchOptions1 == 1 )
		{
			for( var i = 0; i < branchOptions1; i++ )
			{
				if( currentLesson.lines[currentLine].locations[x][i].name == stationName )
				{
					return {stationNumber: x, branchNumber: [i]};
				}
			}
		}
		else
		{
			for( var y = 0; y < branchOptions1; y++ )
			{
				var branchOptions2 = currentLesson.lines[currentLine].locations[x][y].length;
				if( branchOptions2 == 1 )
				{
					for( var i = 0; i < branchOptions2; i++ )
					{
						if( currentLesson.lines[currentLine].locations[x][y][i].name == stationName )
						{
							return {stationNumber: x, branchNumber: [y,i]};
						}
					}
				}
				else
				{
					for( var z = 0; z < branchOptions2; z++ )
					{
						var branchOptions3 = currentLesson.lines[currentLine].locations[x][y][z].length;
						if( branchOptions3 == 1 )
						{
							for( var i = 0; i < branchOptions3; i++ )
							{
								if( currentLesson.lines[currentLine].locations[x][y][z][i].name == stationName )
								{
									return {stationNumber: x, branchNumber: [y,z,i]};
								}
							}
						}
						else
						{
							for( var a = 0; a < branchOptions3; a++ )
							{
								var branchOptions4 = currentLesson.lines[currentLine].locations[x][y][z][a].length;
								if( branchOptions4 == 1 )
								{
									for( var i = 0; i < branchOptions4; i++ )
									{
										if( currentLesson.lines[currentLine].locations[x][y][z][a][i].name == stationName )
										{
											return {stationNumber: x, branchNumber: [y,z,a,i]};
										}
									}
								}
								else
								{
									for( var b = 0; b < branchOptions4; b++ )
									{
										var branchOptions5 = currentLesson.lines[currentLine].locations[x][y][z][a][b].length;
										if( branchOptions5 == 1 )
										{
											for( var i = 0; i < branchOptions5; i++ )
											{
												if( currentLesson.lines[currentLine].locations[x][y][z][a][b][i].name == stationName )
												{
													return {stationNumber: x, branchNumber: [y,z,a,b,i]};
												}
											}
										}
										else
										{
											for( var c = 0; c < branchOptions5; c++ )
											{
												var branchOptions6 = currentLesson.lines[currentLine].locations[x][y][z][a][b][c].length;
												if( branchOptions6 == 1 )
												{
													for( var i = 0; i < branchOptions6; i++ )
													{
														if( currentLesson.lines[currentLine].locations[x][y][z][a][b][c][i].name == stationName )
														{
															return {stationNumber: x, branchNumber: [y,z,a,b,c,i]};
														}
													}
												}
												else
												{
													for( var d = 0; d < branchOptions6; d++ )
													{
														var branchOptions7 = currentLesson.lines[currentLine].locations[x][y][z][a][b][c][d].length;
														if( branchOptions7 == 1 )
														{
															for( var i = 0; i < branchOptions7; i++ )
															{
																if( currentLesson.lines[currentLine].locations[x][y][z][a][b][c][d][i].name == stationName )
																{
																	return {stationNumber: x, branchNumber: [y,z,a,b,c,d,i]};
																}
															}
														}
														else
														{
															for( var e = 0; e < branchOptions7; e++ )
															{
																var branchOptions8 = currentLesson.lines[currentLine].locations[x][y][z][a][b][c][d][e].length;
																if( branchOptions8 == 1 )
																{
																	for( var i = 0; i < branchOptions8; i++ )
																	{
																		if( currentLesson.lines[currentLine].locations[x][y][z][a][b][c][d][e][i].name == stationName )
																		{
																			return {stationNumber: x, branchNumber: [y,z,a,b,c,d,e,i]};
																		}
																	}
																}
																else
																{
																	// At this point you should be wondering why on earth you would ever need more than 8 branch splits. Although, feel free to continue if you want :)
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return false;
}

function getImageCoords(oldStationX, oldStationY)
{
	var imageWidth = document.getElementById("mapImg").clientWidth;
	var imageHeight = document.getElementById("mapImg").clientHeight;
	var containerWidth = document.getElementById("mapPanel").clientWidth;
	var containerHeight = document.getElementById("mapPanel").clientHeight;
	
	var originalImageWidth = document.getElementById("mapImg").naturalWidth;
	
	var offsetWidth = ( containerWidth - imageWidth ) / 2;
	//var offsetHeight = ( containerHeight - imageHeight ) / 2;
	//var offsetWidth = document.getElementById("mapImg").offsetLeft;
	//var offsetHeight = document.getElementById("mapImg").offsetTop;
	var offsetHeight = 40;
	
	var sf = imageWidth/originalImageWidth;
	
	var newStationX = (sf * oldStationX) + offsetWidth;
	var newStationY = (sf * oldStationY) + offsetHeight;
	return [newStationX, newStationY];
}

function oldsetup()
{
	currentLesson = lessons[currentLessonNum];
	document.getElementById("mapImg").src = currentLesson.image;
	document.getElementById("mapImg").onload = function()
	{
		currentLine = currentLesson.startLine;
		currentStationName = currentLesson.startStation;
		moveTrainToStation( currentStationName );
	}
}

function setup( activity, startLine, startStation )
{
	currentLesson = activity;
	document.getElementById("mapImg").src = currentLesson.image;
	document.getElementById("mapImg").onload = function()
	{
		currentLine = startLine;
		currentStationName = startStation;
		moveTrainToStation( currentStationName );
	}
}

function moveTrainToStation( whatStation )
{
	whatStation = whatStation.toLowerCase();
	var trainImg = document.getElementById("trainImg");
	trainImg.style.display = "none";
	
	var stationAndBranchNumber = getStationNumberAndBranchNumberFromStationName( whatStation );
	if( stationAndBranchNumber )
	{
		var theStation = currentLesson.lines[currentLine].locations[stationAndBranchNumber.stationNumber];
		for( var x = 0; x < stationAndBranchNumber.branchNumber.length; x++ )
		{
			theStation = theStation[stationAndBranchNumber.branchNumber[x]];
		}
		if( ! theStation.disabled )
		{
			var stationX = theStation.x;
			var stationY = theStation.y;
			
			var newCoords = getImageCoords(stationX, stationY);
			trainImg.style.left = newCoords[0]-4;
			trainImg.style.top = newCoords[1]-4;
			updateStationInfo();
			if( arrivedAtStationCallback )
			{
				arrivedAtStationCallback( whatStation );
			}
		}
		else
		{
			alert("Woops!\nThis station is closed! Try and find another route through.");
		}
	}
	else
	{
		alert("Woops! I couldn't find the station '" + whatStation + "'.");
	}
	trainImg.style.display = "block";
}

function forward()
{
	var stationAndBranchNumber = getStationNumberAndBranchNumberFromStationName( currentStationName );
	var stepNumber = stationAndBranchNumber.stationNumber;
	var newStepNumber = stepNumber + 1;
	var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
	if( theStation == undefined )
	{
		trainStations.push("error");
		trainLines.push("error");
		alert("Woops!\nThat's the end of the line. You can't go forwards any more.");
	}
	else
	{
		var oldTheStation;
		for( var x = 0; x < stationAndBranchNumber.branchNumber.length; x++ )
		{
			oldTheStation = theStation;
			theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			if( theStation == undefined )
			{
				theStation = oldTheStation;
			}
		}
		if( theStation == undefined )
		{
			var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
		}
		var stationName = theStation.name;
		if( stationName == undefined )
		{
			theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
			if( theStation.length == 2 )
			{
				theStation = theStation[indexToPick][0];
				stationName = theStation.name;
			}
			else if( theStation.length == 1 && theStation[0] == 0 )
			{
				trainStations.push("error");
				trainLines.push("error");
				alert("Woops!\nThat's the end of the line. You can't go forwards any more.");
			}
			else
			{
				trainStations.push("error");
				trainLines.push("error");
				alert("Woops! A branch can only have two options!");
			}
		}
		if( stationName != undefined )
		{
			//moveTrainToStation( stationName );
			currentStationName = stationName;
			trainStations.push(currentStationName);
			trainLines.push(currentLine);
		}
	}
}

function backward()
{
	var stationAndBranchNumber = getStationNumberAndBranchNumberFromStationName( currentStationName );
	var stepNumber = stationAndBranchNumber.stationNumber;
	var newStepNumber = stepNumber - 1;
	var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
	if( theStation == undefined )
	{
		trainStations.push("error");
		trainLines.push("error");
		alert("Woops!\nThat's the end of the line. You can't go backwards any more.");
	}
	else
	{
		var oldTheStation;
		for( var x = 0; x < stationAndBranchNumber.branchNumber.length; x++ )
		{
			oldTheStation = theStation;
			theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			if( theStation == undefined )
			{
				theStation = oldTheStation;
			}
		}
		if( theStation == undefined )
		{
			var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
		}
		var stationName = theStation.name;
		if( stationName == undefined )
		{
			theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
			if( theStation.length == 2 )
			{
				theStation = theStation[indexToPick][0];
				testStation = theStation;
				stationName = theStation.name;
			}
			else if( theStation.length == 1 && theStation[0] == 0 )
			{
				trainStations.push("error");
				trainLines.push("error");
				alert("Woops!\nThat's the end of the line. You can't go backwards any more.");
			}
			else
			{
				trainStations.push("error");
				trainLines.push("error");
				alert("Woops! A branch can only have two options!");
			}
		}
		if( stationName != undefined )
		{
			//moveTrainToStation( stationName );
			currentStationName = stationName;
			trainStations.push(currentStationName);
			trainLines.push(currentLine);
		}
	}
}

function switchLine( toWhatLine )
{
	var oldCurrentLine = currentLine;
	if( currentLesson.lines.length == 1 )
	{
		trainStations.push("error");
		trainLines.push("error");
		alert("This activity only has 1 line. You can not switch line.");
	}
	else
	{
		if( toWhatLine )
		{
			toWhatLine = toWhatLine.toLowerCase();
			toWhatLine = toWhatLine.replace(" line", "");
			var foundLine = false;
			for( var x = 0; x < currentLesson.lines.length; x++ )
			{
				if( currentLesson.lines[x].name == toWhatLine )
				{
					foundLine = true;
					currentLine = x;
					var stationAndBranchNumber = getStationNumberAndBranchNumberFromStationName( currentStationName );
					if( stationAndBranchNumber )
					{
						//moveTrainToStation(currentStationName);
						trainStations.push(currentStationName);
						trainLines.push(currentLine);
					}
					else
					{
						trainStations.push("error");
						trainLines.push("error");
						alert("Woops!\nI don't think you can switch to the '" + toWhatLine + "' line at this station.");
						currentLine = oldCurrentLine;
					}
				}
				else if( x == (currentLesson.lines.length-1) && foundLine == false )
				{
					trainStations.push("error");
					trainLines.push("error");
					alert("Woops!\nI couldn't switch to the '" + toWhatLine + "' line.");
				}
			}
		}
		else
		{
			var stationLineStradles = 0;
			for( var x = 0; x < currentLesson.lines.length; x++ )
			{
				currentLine = x;
				var stationAndBranchNumber = getStationNumberAndBranchNumberFromStationName( currentStationName );
				if( stationAndBranchNumber )
				{
					stationLineStradles++;
				}
			}
			currentLine = oldCurrentLine;
			if( stationLineStradles == 2 )
			{
				var foundLine = false;
				for( var x = 0; x < currentLesson.lines.length; x++ )
				{
					if( x != currentLine )
					{
						if( ! foundLine )
						{
							currentLine = x;
							var stationAndBranchNumber = getStationNumberAndBranchNumberFromStationName( currentStationName );
							if( stationAndBranchNumber )
							{
								foundLine = true;
								trainStations.push(currentStationName);
								trainLines.push(currentLine);
								//moveTrainToStation(currentStationName);
							}
						}
					}
				}
			}
			else if( stationLineStradles == 1 )
			{
				trainStations.push("error");
				trainLines.push("error");
				alert("Woops! The current station is only on one line, meaning that you can't switch lines.");
			}
			else
			{
				trainStations.push("error");
				trainLines.push("error");
				alert("Woops! The current station has more than three lines crossing it, meaning that there is more than one possibility to switch onto. You'll need to specify which one you want.");
			}
		}
	}
}

function getNextStation()
{
	var stationAndBranchNumber = getStationNumberAndBranchNumberFromStationName( currentStationName );
	var stepNumber = stationAndBranchNumber.stationNumber;
	var newStepNumber = stepNumber + 1;
	var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
	if( theStation == undefined )
	{
		return "N/A";
	}
	else
	{
		var oldTheStation;
		for( var x = 0; x < stationAndBranchNumber.branchNumber.length; x++ )
		{
			oldTheStation = theStation;
			theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			if( theStation == undefined )
			{
				theStation = oldTheStation;
			}
		}
		if( theStation == undefined )
		{
			var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
		}
		var stationName = theStation.name;
		if( stationName == undefined )
		{
			theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
			if( theStation.length == 2 )
			{
				theStation = theStation[indexToPick][0];
				testStation = theStation;
				stationName = theStation.name;
			}
			else if( theStation.length == 1 && theStation[0] == 0 )
			{
				return "N/A";
			}
			else
			{
				alert("Woops! A branch can only have two options!");
			}
		}
		if( stationName != undefined )
		{
			return stationName;
		}
	}
}

function getPrevStation()
{
	var stationAndBranchNumber = getStationNumberAndBranchNumberFromStationName( currentStationName );
	var stepNumber = stationAndBranchNumber.stationNumber;
	var newStepNumber = stepNumber - 1;
	var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
	if( theStation == undefined )
	{
		return "N/A";
	}
	else
	{
		var oldTheStation;
		for( var x = 0; x < stationAndBranchNumber.branchNumber.length; x++ )
		{
			oldTheStation = theStation;
			theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			if( theStation == undefined )
			{
				theStation = oldTheStation;
			}
		}
		if( theStation == undefined )
		{
			var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
		}
		var stationName = theStation.name;
		if( stationName == undefined )
		{
			theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
			if( theStation.length == 2 )
			{
				theStation = theStation[indexToPick][0];
				testStation = theStation;
				stationName = theStation.name;
			}
			else if( theStation.length == 1 && theStation[0] == 0 )
			{
				return "N/A";
			}
			else
			{
				alert("Woops! A branch can only have two options!");
			}
		}
		if( stationName != undefined )
		{
			return stationName;
		}
	}
}

function hasForwardBranch()
{
	var stationAndBranchNumber = getStationNumberAndBranchNumberFromStationName( currentStationName );
	var stepNumber = stationAndBranchNumber.stationNumber;
	var newStepNumber = stepNumber + 1;
	var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
	if( theStation == undefined )
	{
		return false;
	}
	else
	{
		var oldTheStation;
		for( var x = 0; x < stationAndBranchNumber.branchNumber.length; x++ )
		{
			oldTheStation = theStation;
			theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			if( theStation == undefined )
			{
				theStation = oldTheStation;
			}
		}
		if( theStation == undefined )
		{
			var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
		}
		var stationName = theStation.name;
		if( stationName == undefined )
		{
			theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
			if( theStation.length == 2 )
			{
				return true;
			}
			else if( theStation.length == 1 && theStation[0] == 0 )
			{
				return false;
			}
			else
			{
				return false;
			}
		}
	}
	return false;
}

function hasBackwardBranch()
{
	var stationAndBranchNumber = getStationNumberAndBranchNumberFromStationName( currentStationName );
	var stepNumber = stationAndBranchNumber.stationNumber;
	var newStepNumber = stepNumber - 1;
	var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
	if( theStation == undefined )
	{
		return false;
	}
	else
	{
		var oldTheStation;
		for( var x = 0; x < stationAndBranchNumber.branchNumber.length; x++ )
		{
			oldTheStation = theStation;
			theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			if( theStation == undefined )
			{
				theStation = oldTheStation;
			}
		}
		if( theStation == undefined )
		{
			var theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
		}
		var stationName = theStation.name;
		if( stationName == undefined )
		{
			theStation = currentLesson.lines[currentLine].locations[newStepNumber];
			for( var x = 0; x < stationAndBranchNumber.branchNumber.length-1; x++ )
			{
				theStation = theStation[stationAndBranchNumber.branchNumber[x]];
			}
			if( theStation.length == 2 )
			{
				return true;
			}
			else if( theStation.length == 1 && theStation[0] == 0 )
			{
				return false;
			}
			else
			{
				return false;
			}
		}
	}
	return false;
}

function executeTrain()
{
	currentLine = trainLines[0];
	currentStationName = trainStations[0];
	if( currentStationName != "error" )
	{
		moveTrainToStation( currentStationName );
		trainStations.splice(0,1);
		trainLines.splice(0,1);
		if( trainStations[0] )
		{
			setTimeout(executeTrain ,1000);
		}
	}
}

function updateStationInfo()
{
	var currentLineName = currentLesson.lines[currentLine].name;
	var backgroundColour = "";
	var textColour = "black";
	switch( currentLineName )
	{
		case "bakerloo":
			backgroundColour = "#956438";
			textColour = "white";
			break;
		case "central":
			backgroundColour = "#ED1C2F";
			textColour = "white";
			break;
		case "circle":
			backgroundColour = "#FFDE00";
			break;
		case "district":
			backgroundColour = "#009B5A";
			break;
		case "hammersmith and city":
			backgroundColour = "#F3879E";
			break;
		case "jubilee":
			backgroundColour = "#8B8D90";
			break;
		case "metropolitan":
			backgroundColour = "#79014C";
			textColour = "white";
			break;
		case "northern":
			backgroundColour = "#221E1F";
			textColour = "white";
			break;
		case "piccadilly":
			backgroundColour = "#014FA3";
			textColour = "white";
			break;
		case "victoria":
			backgroundColour = "#0095D7";
			break;
		case "waterloo and city":
			backgroundColour = "#79CBBE";
			break;
	}
	document.getElementById("infoDiv").style.backgroundColor = backgroundColour;
	document.getElementById("infoDiv").innerHTML = "<table style=\"width:100%; height:100%; font-size:18px; text-align: center;\"><tr><td>Previous Station: " + toTitleCase(getPrevStation()) + "</td><td>Current Station: " + toTitleCase(currentStationName) + "</td><td>Next Station: " + toTitleCase(getNextStation()) + "</td></tr></table>";
	document.getElementById("infoDiv").firstChild.style.color = textColour;
}

function toTitleCase(str)
{
	if( str != "N/A" )
	{
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	else
	{
		return str;
	}
}

function getClosedStations( )
{
	var prevCurrentLine = currentLine;
	var getRequest = new XMLHttpRequest();
	getRequest.open('POST', '/data/getData.php', true);
	getRequest.onload = function ()
	{
		if (getRequest.status === 200)
		{
			var closedStations = JSON.parse(getRequest.responseText);
			for( var x = 0; x < closedStations.lines.length; x++ )
			{
				var currentStationFrom = closedStations.from[x].toLowerCase();
				var currentStationTo = closedStations.to[x].toLowerCase();
				var currentStationLine = closedStations.lines[x].toLowerCase();
				
				for( var y = 0; y < currentLesson.lines.length; y++ )
				{
					if( currentLesson.lines[y].name == currentStationLine )
					{
						// We are using that line!
						var stationFromInfo = getStationNumberAndBranchNumberFromStationName( currentStationFrom );
						if( stationFromInfo )
						{
							var stationToInfo = getStationNumberAndBranchNumberFromStationName( currentStationTo );
							if( stationToInfo )
							{
								// Great! We have found both the from and the to station. Find all the stations in between them.
								closedStationList = getStationsBetweenTwoStations( currentStationFrom, currentStationTo, y );
								if( closedStationList != false )
								{
									for( var z = 0; z < closedStationList.length; z++ )
									{
										closeStation( closedStationList[z], y );
									}
								}
								else
								{
									// There was an issue getting the stations. This shouldn't happen, but lets put this code in place, just in case.
									closeStation( currentStationFrom, y );
									closeStation( currentStationTo, y );
								}
							}
							else
							{
								// We can only find the from station; the to one must be off the map. Just block the from station.
								closeStation( currentStationFrom, y );
							}
						}
						else
						{
							// Can't find that station, try the to one then.
							var stationToInfo = getStationNumberAndBranchNumberFromStationName( currentStationTo );
							if( stationToInfo )
							{
								// We can only find the to station; the from one must be off the map. Just block the to station.
								closeStation( currentStationTo, y );
							}
						}
					}
				}
			}
			currentLine = prevCurrentLine;
		}
	};
	getRequest.send();
}

function closeStation( whatStation, stationLine )
{
	whatStation = whatStation.toLowerCase();
	
	var stationAndBranchNumber = getStationNumberAndBranchNumberFromStationName( whatStation );
	if( stationAndBranchNumber )
	{
		var theStation = currentLesson.lines[stationLine].locations[stationAndBranchNumber.stationNumber];
		for( var x = 0; x < stationAndBranchNumber.branchNumber.length; x++ )
		{
			theStation = theStation[stationAndBranchNumber.branchNumber[x]];
		}
		var stationX = theStation.x;
		var stationY = theStation.y;
		
		var newCoords = getImageCoords(stationX, stationY);
		
		var backgroundColour = "";
		switch( currentLesson.lines[stationLine].name )
		{
			case "bakerloo":
				backgroundColour = "#956438";
				break;
			case "central":
				backgroundColour = "#ED1C2F";
				break;
			case "circle":
				backgroundColour = "#FFDE00";
				break;
			case "district":
				backgroundColour = "#009B5A";
				break;
			case "hammersmith and city":
				backgroundColour = "#F3879E";
				break;
			case "jubilee":
				backgroundColour = "#8B8D90";
				break;
			case "metropolitan":
				backgroundColour = "#79014C";
				break;
			case "northern":
				backgroundColour = "#221E1F";
				break;
			case "piccadilly":
				backgroundColour = "#014FA3";
				break;
			case "victoria":
				backgroundColour = "#0095D7";
				break;
			case "waterloo and city":
				backgroundColour = "#79CBBE";
				break;
		}
		crossDiv = document.createElement("DIV");
		crossDiv.className = "stationCross";
		crossDiv.innerHTML = "X";
		crossDiv.style.color = backgroundColour;
		crossDiv.style.fontSize = "32px";
		crossDiv.style.fontWeight = 900;
		crossDiv.style.left = newCoords[0]-12;
		crossDiv.style.top = newCoords[1]-23;
		crossDiv.style.position = "absolute";
		document.getElementById("mapPanel").appendChild(crossDiv); 
		
		theStation.disabled = true;
	}
	else
	{
		alert("Woops! I couldn't find the station '" + whatStation + "'.");
	}
}

function getStationsBetweenTwoStations( startStation, endStation, lineNumber, reversed )
{
	var prevCurrentStationName = currentStationName;
	var prevCurrentLine = currentLine;
	
	var nextStation;
	var prevStation;
	var forwardBranches = [];
	var notFound = true;
	var reachedEndOfLine = false;
	
	stationList = [[]];
	
	currentLine = lineNumber;
	currentStationName = startStation;
	if( canmoveforwards() )
	{
		stationList[stationList.length-1].push(startStation);
		while( notFound == true )
		{
			if( hasForwardBranch() )
			{
				if( reachedEndOfLine == true )
				{
					reachedEndOfLine = false;
				}
				else
				{
					forwardBranches.push(0);
				}
				indexToPick = forwardBranches[forwardBranches.length-1];
				nextStation = getNextStation();
				stationList.push([]); // Create new array
				stationList[stationList.length-1].push(nextStation); // Append station to the array
				if( nextStation == endStation )
				{
					notFound = false;
					currentStationName = prevCurrentStationName;
					currentLine = prevCurrentLine;
					return formatListWhenFound( stationList );
				}
				else
				{
					if( canmoveforwards() )
					{
						currentStationName = nextStation;
					}
					else
					{
						stationList.splice((stationList.length-1),1);
						reachedEndOfLine = true;
						if( forwardBranches[forwardBranches.length-1] == 1 )
						{
							// We've been through both of the branches. Go back to the prev one.
							while( forwardBranches[forwardBranches.length-1] == 1 )
							{
								forwardBranches.splice((forwardBranches.length-1), 1);
								if( forwardBranches.length == 0 )
								{
									// That's us back at the beginning. Make sure we don't loop again.
									notFound = false;
									break;
								}
							}
						}
						else
						{
							forwardBranches[forwardBranches.length-1] = 1;
							currentStationName = stationList[stationList.length-1][stationList[stationList.length-1].length-1];
						}
					}
				}
			}
			else
			{
				nextStation = getNextStation();
				stationList[stationList.length-1].push(nextStation);
				if( nextStation == endStation )
				{
					notFound = false;
					currentStationName = prevCurrentStationName;
					currentLine = prevCurrentLine;
					return formatListWhenFound( stationList );
				}
				else
				{
					if( canmoveforwards() )
					{
						currentStationName = nextStation;
					}
					else
					{
						stationList.splice((stationList.length-1),1);
						reachedEndOfLine = true;
						if( forwardBranches.length != 0 )
						{
							if( forwardBranches[forwardBranches.length-1] == 1 )
							{
								// We've been through both of the branches. Go back to the prev one.
								while( forwardBranches[forwardBranches.length-1] == 1 )
								{
									forwardBranches.splice((forwardBranches.length-1), 1);
									if( forwardBranches.length == 0 )
									{
										// That's us back at the beginning. Make sure we don't loop again.
										notFound = false;
										break;
									}
								}
							}
							else
							{
								forwardBranches[forwardBranches.length-1] = 1;
								currentStationName = stationList[stationList.length-1][stationList[stationList.length-1].length-1];
							}
						}
						else
						{
							break;
						}
					}
				}
			}		
		}
	}
	if( ! reversed )
	{
		currentStationName = prevCurrentStationName;
		currentLine = prevCurrentLine;
		return getStationsBetweenTwoStations( endStation, startStation, lineNumber, 1 );
	}
	else
	{
		currentStationName = prevCurrentStationName;
		currentLine = prevCurrentLine;
		return false;
	}
}

function formatListWhenFound( listToFormat )
{
	var totalList = [];
	if( listToFormat.length == 1 )
	{
		return listToFormat[0];
	}
	else
	{
		for( var x = 0; x < listToFormat.length; x++ )
		{
			for( var y = 0; y < listToFormat[x].length; y++ )
			{
				totalList.push(listToFormat[x][y]);
			}
		}
	}
	return totalList;
}

function generateStartStation()
{
	var startStation = "";
	while( startStation == "" && closedStationList.indexOf(startStation) == -1 )
	{
		var theIndex = currentLesson.lines[Math.floor((Math.random() * currentLesson.lines.length))].locations;
		while( theIndex.length != 1 )
		{
			theIndex = theIndex[Math.floor((Math.random() * theIndex.length))];
		}
		if( theIndex == 0 || theIndex == [0] || theIndex[0] == 0 )
		{
			theIndex = currentLesson.lines[Math.floor((Math.random() * theIndex.length))];
		}
		else
		{
			startStation = theIndex[0].name;
		}
	}
	return startStation;
}

function generateEndStation( startStation, endStation, lineNumber )
{
	var prevCurrentStationName = currentStationName;
	var prevCurrentLine = currentLine;
	
	var nextStation;
	var prevStation;
	
	var movedStations = 0;
	
	currentLine = lineNumber;
	currentStationName = startStation;
	var currentDirection = Math.floor((Math.random()*2));
	if( ( currentDirection == 0 && ! canmoveforwards() ) || ( currentDirection == 1 && ! canmovebackwards() ) )
	{
		currentDirection = ! currentDirection;
	}
	while( 1 )
	{
		movedStations++;
		if( hasForwardBranch() && currentDirection == 0 )
		{
			indexToPick = Math.floor((Math.random()*2));
			nextStation = getNextStation();
			if( canmoveforwards() )
			{
				if( closedStationList.indexOf(nextStation) == -1 )
				{
					currentStationName = nextStation;
				}
			}
			else
			{
				if( switchlines().length != 1 )
				{
					var possibleLines = [];
					for( x = 0; x < switchlines().length; x++ )
					{
						if( ! switchlines()[x] == currentLesson.lines[currentLine].name )
						{
							possibleLines.push( switchlines()[x] );
						}
					}
					var lineToSwitchTo = possibleLines[Math.floor((Math.random()*possibleLines.length))];
					if( ( lineToSwitchTo != undefined ) || ( lineToSwitchTo == undefined && switchlines().length == 2 ) )
					{
						switchLine(lineToSwitchTo);
						currentDirection = Math.floor((Math.random()*2));
						if( ( currentDirection == 0 && ! canmoveforwards() ) || ( currentDirection == 1 && ! canmovebackwards() ) )
						{
							currentDirection = ! currentDirection;
						}
					}
				}
				else
				{
					var newCurrentStationName = currentStationName;
					currentStationName = prevCurrentStationName;
					currentLine = prevCurrentLine;
					return newCurrentStationName;
				}
			}
		}
		else if( hasBackwardBranch() && currentDirection == 1 )
		{
			indexToPick = Math.floor((Math.random()*2));
			prevStation = getPrevStation();
			if( canmovebackwards() )
			{
				if( closedStationList.indexOf(prevStation) == -1 )
				{
					currentStationName = prevStation;
				}
			}
			else
			{
				if( switchlines().length != 1 )
				{
					var possibleLines = [];
					for( x = 0; x < switchlines().length; x++ )
					{
						if( ! switchlines()[x] == currentLesson.lines[currentLine].name )
						{
							possibleLines.push( switchlines()[x] );
						}
					}
					var lineToSwitchTo = possibleLines[Math.floor((Math.random()*possibleLines.length))];
					if( ( lineToSwitchTo != undefined ) || ( lineToSwitchTo == undefined && switchlines().length == 2 ) )
					{
						switchLine(lineToSwitchTo);
						currentDirection = Math.floor((Math.random()*2));
						if( ( currentDirection == 0 && ! canmoveforwards() ) || ( currentDirection == 1 && ! canmovebackwards() ) )
						{
							currentDirection = ! currentDirection;
						}
					}
				}
				else
				{
					var newCurrentStationName = currentStationName;
					currentStationName = prevCurrentStationName;
					currentLine = prevCurrentLine;
					return newCurrentStationName;
				}
			}
		}
		else
		{
			nextStation = getNextStation();
			if( canmoveforwards() && currentDirection == 0 )
			{
				if( closedStationList.indexOf(getNextStation()) == -1 )
				{
					currentStationName = getNextStation();
				}
			}
			else if( canmovebackwards() && currentDirection == 1 )
			{
				if( closedStationList.indexOf(getPrevStation()) == -1 )
				{
					currentStationName = getPrevStation();
				}
			}
			else if( switchlines().length != 1 )
			{
				var possibleLines = [];
				for( x = 0; x < switchlines().length; x++ )
				{
					if( switchlines()[x] != currentLesson.lines[currentLine].name )
					{
						possibleLines.push( switchlines()[x] );
					}
				}
				var lineToSwitchTo = possibleLines[Math.floor((Math.random()*possibleLines.length))];
				if( ( lineToSwitchTo != undefined ) || ( lineToSwitchTo == undefined && switchlines().length == 2 ) )
				{
					switchLine(lineToSwitchTo);
					currentDirection = Math.floor((Math.random()*2));
					if( ( currentDirection == 0 && ! canmoveforwards() ) || ( currentDirection == 1 && ! canmovebackwards() ) )
					{
						currentDirection = ! currentDirection;
					}
				}
			}
			else
			{
				var newCurrentStationName = currentStationName;
				currentStationName = prevCurrentStationName;
				currentLine = prevCurrentLine;
				return newCurrentStationName;
			}
		}
		if( Math.floor((Math.random()*6)) == 2 && currentStationName != startStation )
		{
			if( switchlines().length != 1 )
			{
				var possibleLines = [];
				for( x = 0; x < switchlines().length; x++ )
				{
					if( ! switchlines()[x] == currentLesson.lines[currentLine].name )
					{
						possibleLines.push( switchlines()[x] );
					}
				}
				var lineToSwitchTo = possibleLines[Math.floor((Math.random()*possibleLines.length))];
				if( ( lineToSwitchTo != undefined ) || ( lineToSwitchTo == undefined && switchlines().length == 2 ) )
				{
					switchLine(lineToSwitchTo);
					currentDirection = Math.floor((Math.random()*2));
					if( ( currentDirection == 0 && ! canmoveforwards() ) || ( currentDirection == 1 && ! canmovebackwards() ) )
					{
						currentDirection = ! currentDirection;
					}
				}
			}
		}
		if( Math.floor((Math.random()*6)) == 4 && currentStationName != startStation && movedStations > 4 )
		{
			var newCurrentStationName = currentStationName;
			currentStationName = prevCurrentStationName;
			currentLine = prevCurrentLine;
			return newCurrentStationName;
		}
	}
	currentStationName = prevCurrentStationName;
	currentLine = prevCurrentLine;
}