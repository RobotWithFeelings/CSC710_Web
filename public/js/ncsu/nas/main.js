var Main = (function() {
	"use strict";

	var transition_time = 500;
	var loader_time = 0;
	var current_fact = 0;
	var current_question = 0;
	var facts = [];
	var questions = [];
	
	function init(){		
		logger.log( "main initializer");		
		init_facts();
		init_questions();
		
		$("#welcomeBtn").button();
		$("#welcomeBtn").click(onWelcomeHandler);	
								
		$("#factBtn").button();
		$("#factBtn").click(onFactHandler);
		
		$("#transitionBtn").button();
		$("#transitionBtn").click(onTransitionHandler);	
		
		$("#welcome").show();
		$("#loader_facts").hide();
		$("#loader_questions").hide();		
		$("#facts").hide();	
		$("#transition").hide();	
	}
	
	function onFactHandler() {
		if( $('input[name=radio]').is(":checked") ) {		
			current_fact++;
			
			// end of facts, show testing questions
			if( current_fact == facts.length ){
				$("#facts").animate( { opacity: '0' }, ( transition_time / 2 ), function()
				{
					$('input[name=radio]').prop ('checked', false);
					$("#facts").hide();
					showTransition();
				} );				
			}else {
				$("#facts").animate( { opacity: '0' }, ( transition_time / 2 ), function()
				{
					$('input[name=radio]').prop ('checked', false);
					$("#facts").hide();
					showFactLoader();
				} );
			}			
		}
	}
	
	function showFactLoader() {
		$("#loader_facts").css( "opacity", "0");
		$("#loader_facts").show();				
		$("#loader_facts").animate( { opacity: '1' }, transition_time );	
		
		// choose a random amount of time for the loader to remain visible
		loader_time = 250 + ( Math.random() * 5000 );
		logger.log( "loader time: " + loader_time );
		
		setTimeout( function() {
			$("#loader_facts").animate( { opacity: '0' }, transition_time, function() {
				$("#loader_facts").hide();
				showFact();
			} );					
		}, loader_time );
	}
	
	function onWelcomeHandler() {
		$("#welcome").animate( { opacity: '0' }, ( transition_time / 2 ), function()
		{
			$("#welcome").hide();
			showFactLoader();
		} );
	}	
	
	function showFact() {
		var str = "Fact " + ( current_fact + 1 ) + " of " + facts.length;
		$("#factNumber").text( str );		
		$("#fact_text").html( facts[current_fact] );
		
		$("#facts").css( "opacity", "0");
		$("#facts").show();
		$("#facts").animate( { opacity: '1' }, transition_time );		
	}	
	
	function showQuestionLoader() {
		$("#loader_questions").css( "opacity", "0");
		$("#loader_questions").show();				
		$("#loader_questions").animate( { opacity: '1' }, transition_time );	
		
		// choose a random amount of time for the loader to remain visible
		loader_time = 250 + ( Math.random() * 5000 );
		logger.log( "loader time: " + loader_time );
		
		setTimeout( function() {
			$("#loader_questions").animate( { opacity: '0' }, transition_time, function() {
				$("#loader_questions").hide();
				showQuestion();
			} );					
		}, loader_time );
	}
	
	function onTransitionHandler() {
		$("#transition").animate( { opacity: '0' }, ( transition_time / 2 ), function()
		{
			$("#transition").hide();
			showQuestionLoader();
		} );
	}
	
	function showTransition() {		
		$("#transition").css( "opacity", "0");
		$("#transition").show();
		$("#transition").animate( { opacity: '1' }, transition_time );		
	}

	function showQuestion() {
			
	}	
	
	function init_facts() {
		facts[0] = "76% of students get into their first choice college.";
		facts[1] = "75% of the colleges and universities in the U.S. are <br>East of the Mississippi River.";
		/*facts[2] = "Being an athlete increases your chances of being accepted.";
		facts[3] = "In their senior year, 46.5 percent of the students frequently or occasionally fell asleep in class.";
		facts[4] = "Tuition increases so that those who can pay full price subsidize the cost for those who cannot.";
		facts[5] = "Forty-two percent of freshmen expect to earn a master's degree.";
		facts[6] = "Less than 5% of American families have saved enough for college.";
		facts[7] = "Lots of kids who don’t need financial aid get it.";
		facts[8] = "53% of all international students in the US come from China, Canada, India, Taiwan, S. Korea and Japan.";
		facts[9] = "A recent panel of Admissions Representatives said that the Early pool applicants are typically NOT stronger and more qualified.";
		facts[10] = "Two thirds of all college students get some form of financial aid.";
		facts[11] = "Us colleges do not require students to declare majors upon admission.";
		facts[12] = "It is possible to go to college without receiving a high school diploma.";
		facts[13] = "College has a higher workload than most U.S. high schools.";
		facts[14] = "Ivy League is used to describe several college football teams.";
		facts[15] = "While many students live near enough to bring their laundry home, only 14 percent of freshman attend college 500 or more miles away.";
		facts[16] = "About half of the freshman earned a grade point average no worse than an A- in high school.";
		facts[17] = "Fifty-five percent of students took at least one Advanced Placement class and 21.7 percent took at least five AP courses.";
		facts[18] = "The No. 1 reason students gave for attending their chosen schools was they have a \"very good reputation.\" Only 18.2 percent said national magazine college rankings were \"very important\" in their decision.";
		facts[19] = "85% of students attending private colleges are awarded merit aid.";*/	
	}
		
	function init_questions() {
		questions[0] = { "text" : "Which state most international students apply to for college?", "answer_0" : "Texas", "answer_1" : "Maine", "answer_2" : "Illinois", "answer_3" : "California", "answer_4" : "New York" };
		
		/*questions[1] = "75% of the colleges and universities in the U.S. are <br>East of the Mississippi River.";
		questions[2] = "Being an athlete increases your chances of being accepted.";
		questions[3] = "In their senior year, 46.5 percent of the students frequently or occasionally fell asleep in class.";
		questions[4] = "Tuition increases so that those who can pay full price subsidize the cost for those who cannot.";
		questions[5] = "Forty-two percent of freshmen expect to earn a master's degree.";
		questions[6] = "Less than 5% of American families have saved enough for college.";
		questions[7] = "Lots of kids who don’t need financial aid get it.";
		questions[8] = "53% of all international students in the US come from China, Canada, India, Taiwan, S. Korea and Japan.";
		questions[9] = "A recent panel of Admissions Representatives said that the Early pool applicants are typically NOT stronger and more qualified.";
		questions[10] = "Two thirds of all college students get some form of financial aid.";
		questions[11] = "Us colleges do not require students to declare majors upon admission.";*/
	}
		
	return {
		init: init,
	};	
})();