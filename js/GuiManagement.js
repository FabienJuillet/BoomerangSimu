function setupGui(){
	
	effectController = {

		NewAngleHor: 10,
		NewAngleVer: 20,
		NewSimulationTimeRatio: 40,
		Test: function() {console.log("bouton actif")},
		NewArrowVisible: false,   // Valeur intiale
		NewGrass: false,
		NewBoomerangName: "Challenger",
		StartStop: function() { //gui.__controllers[0].updateDisplay();
								//gui.__controllers[0].remove();
								running = !running;
								InitialState=false;
								RefreshGui();
								SetArrowsVisible((effectController !== undefined)? effectController.NewArrowVisible&&(!InitialState) : false)
								setDisabledFolderGUI("Conditions Initiales", !InitialState);						
		},
								
		reStart: function() { 
							running = false;
							InitialState=true;
							RefreshGui();
							
							setDisabledFolderGUI("Conditions Initiales", !InitialState);	
							//gui.__folders["Conditions Initiales"].closed=true;
							
							UpdateBoomerangInitialConditions();
							physicalTime=0;
							InitializeT0=true;
							
							// Tire une couleur aleatoire (la valeur 30 assure une  couleur pas trop sombre)
							var RandomColor= getRandomIntInclusive(30, 255)*256*256 +getRandomIntInclusive(30, 255)*256+ getRandomIntInclusive(30, 255)
							CreateNewTrajectories(RandomColor);							
							UpdateCurrentTrajectories();
							
							distCameraBoomerang=distInitialeCameraBoomerang;
							camera.position.addVectors(positionInitialeBoomerang,distCameraBoomerang);
							cameraControls.target.copy(positionInitialeBoomerang);						
		}
	};

	gui = new dat.GUI();
	gui.add( effectController, "StartStop")
	//.name(running?"<LEFT><font size=4 color=red>STOP</font></LEFT>":"<LEFT><font size=4 color=white>START</font></LEFT>");
	
	var CI = gui.addFolder("Conditions Initiales");
	
	var BoomerangNameController = CI.add( effectController, "NewBoomerangName",['Equerre','Challenger','MTA']).name("Sélection du boomerang");
	BoomerangNameController.onChange(function(){
		scene.remove(scene.getObjectByName("boomerang"));
		
		var material = new THREE.MeshLambertMaterial( { color: 0xff6000, wireframe: false} );
			//Load a boomerang from file
		xmlDoc= new readFile("boomerang/" + effectController.NewBoomerangName + ".xml");

		//Create boomerang
		var boomerang= new CreateBoomerang( material, xmlDoc);
		boomerang.name="boomerang";
		scene.add(boomerang);
		
		UpdateBoomerangInitialConditions()
	});
	
	var AngleVerController = gui.add( effectController, "NewAngleVer",-90 ,90.0).name("Inclinaison");
	AngleVerController.onChange(UpdateBoomerangInitialConditions);
	
	var AngleHorController = CI.add( effectController, "NewAngleHor",-10.0 ,90.0 ).name("Hauteur du lancé");
	AngleHorController.onChange(UpdateBoomerangInitialConditions);

	var TestController = CI.add( effectController, "Test").name("Test button");
	
	setDisabledFolderGUI("Conditions Initiales", false);
	
	var OptionGraph = gui.addFolder("Options Graphiques");
	
	var SimulationTimeRatioController = OptionGraph.add( effectController, "NewSimulationTimeRatio",1,100 ).name("Ratio de vitesses");
		SimulationTimeRatioController.onChange(function(){
		InitializeT0=true;
	});

	var ArrowController= OptionGraph.add( effectController, "NewArrowVisible").name("Forces aérodynamiques");
		ArrowController.onChange(function(){
		SetArrowsVisible((effectController !== undefined)? effectController.NewArrowVisible&&(!InitialState) : false);
	});
	
	var GrassController= OptionGraph.add( effectController, "NewGrass").name("Pelouse");
		GrassController.onChange(function(){
		scene.remove(scene.getObjectByName("ground"));
		drawGround(effectController.NewGrass);
	});
	
	gui.add( effectController, "reStart").name("<LEFT><font size=4 color=white>REINITIALSER</font></LEFT>");

	RefreshGui();
	
	
}

function setDisabledFolderGUI(name, disabled){
	for (var i in gui.__folders[name].__controllers){
		var c = gui.__folders[name].__controllers[i];
		c.disabled=disabled;
		console.log("setDisablesFolder");
		
	}
}

function RefreshGui(){
gui.__controllers[0].name(running?"<LEFT><font size=4 color=red>STOP</font></LEFT>":"<LEFT><font size=4 color=white>START</font></LEFT>");
}

