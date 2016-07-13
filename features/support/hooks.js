module.exports = function(){
	var executionID = null;

	//Set timeout for all events to 60sec. All hooks here are sync except AfterFeatures()
	//The correct way to do this is to pass {timeout:60*1000} to AfterFeatures as a first parameter, but cucumber does not handle this well and the hook doesn't get called at all
    this.setDefaultTimeout(60*10000); //

	try{
		//Before any feature - this is a good place for executionStart
		this.BeforeFeatures(function(features, next){
			if (!global.$$SeaLights$$) return next();
			console.log('SL: '+global.$$SeaLights$$)
			executionID = new Date().valueOf();
			console.log('ExecutionID started: '+executionID);
			global.$$SeaLights$$.pushEvent({ type: 'executionIdStarted', executionId: executionID, framework: 'cucumber' });
			next();
		});

		//After all features - this is a good place for executionEnd and shutdown (empty queues)
		//Timeout here is 60 seconds to allow for retries and slow network
		this.AfterFeatures(function(features, next){
			if (!global.$$SeaLights$$) return next();
			console.log('ExecutionID ended: '+executionID);
			global.$$SeaLights$$.pushEvent({ type: 'executionIdEnded', executionId: executionID, meta:{} });
			executionID = null;
			global.$$SeaLights$$.shutDown(function(){
				console.log('shutdown');
				next(); //Wait for shutdown to complete before calling next(), which may terminate the process.
			});
		});

		this.BeforeStep(function(step, next){
			if (step.isHidden()) return next();
			if (!global.$$SeaLights$$) return next();
			var stepDesc = step.getKeyword()+' '+step.getName();

			var fullPath = [step.getScenario().getFeature().getName(), step.getScenario().getName(), stepDesc];
			global.$$SeaLights$$.setCurrentTestIdentifier(executionID+'/'+fullPath.join(' '));

			console.log('START: '+fullPath.join(' '));
			global.$$SeaLights$$.pushEvent({ type: 'testStart', testName: step.getName(), executionId: executionID, testSuitePath: fullPath, meta:{} });

			next();
		});

		//Test end. This occurs after StepResult, so there is nothing much to do, maybe clear current test identifier
		this.AfterStep(function(step, next){
			if (step.isHidden()) return next();
			if (!global.$$SeaLights$$) return next();
			global.$$SeaLights$$.setCurrentTestIdentifier();
			//console.log('END: '+step.getKeyword()+' '+step.getName());
			next();
		});

		//Test result (Step result)
		this.StepResult(function(stepResult, next){
			var step = stepResult.getStep();
			if (step.isHidden()) return next();
			if (!global.$$SeaLights$$) return next();

			var stepDesc = step.getKeyword()+' '+step.getName();
			var fullPath = [step.getScenario().getFeature().getName(), step.getScenario().getName(), stepDesc];
			var duration = stepResult.getDuration();
			var status = stepResult.getStatus();
			//console.log(fullPath.join(' '));
			console.log('END duration='+duration+', status='+status);
			global.$$SeaLights$$.pushEvent({ type: 'testEnd', testName: step.getName(), executionId: executionID, result: status, duration: duration, meta:{} });
			next();
		})
		
	} catch(e){
		console.log(e);
	}
}

