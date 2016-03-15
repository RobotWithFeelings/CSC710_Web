var Main = (function() {
	"use strict";

	var transition_time = 500;
	var loader_time = 0;
	var current_fact = 0;
	var current_question = 0;
	var current_review_questions =0;
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
		
		$("#questionBtn").button();
		$("#questionBtn").click(onQuestionHandler);
		
		$("#transitionScoringBtn").button();
		$("#transitionScoringBtn").click(onTransitionScoringHandler);
		
		$("#reviewBtn").button();
		$("#reviewBtn").click(onReviewHandler);
		
		$("#welcome").show();
		$("#loader_facts").hide();
		$("#loader_questions").hide();		
		$("#facts").hide();	
		$("#transition").hide();	
		$("#questions").hide();
		$("#transition_scoring").hide();
		$("#scoring").hide();
		//showScoring();
		
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

	function onQuestionHandler() {
		if( $('input[name=question_radio]').is(":checked") ) {		
			current_question++;
			
			// end of questions, show eval form
			if( current_question == questions.length ){
				$("#questions").animate( { opacity: '0' }, ( transition_time / 2 ), function()
				{
					$('input[name=radio]').prop ('checked', false);
					$("#questions").hide();
					showTransitionScoring();
				} );				
			}else {
				$("#questions").animate( { opacity: '0' }, ( transition_time / 2 ), function()
				{
					$('input[name=question_radio]').prop ('checked', false);
					$("#questions").hide();
					showQuestionLoader();
				} );
			}			
		}
	}
	
	function showQuestion() {			
		var str = "Question " + ( current_question + 1 ) + " of " + questions.length;
		$("#questionNumber").text( str );		
		$("#question_text").html( questions[current_question].text );
		
		// fill in question text
		$("label[for=radio_question_id1]").html( questions[current_question].answer_0 );
		$("label[for=radio_question_id2]").html( questions[current_question].answer_1 );
		$("label[for=radio_question_id3]").html( questions[current_question].answer_2 );
		$("label[for=radio_question_id4]").html( questions[current_question].answer_3 );
		$("label[for=radio_question_id5]").html( questions[current_question].answer_4 );
		
		$("#questions").css( "opacity", "0");
		$("#questions").show();
		$("#questions").animate( { opacity: '1' }, transition_time );			
	}	
	
	function showTransitionScoring() {		
		$("#transition_scoring").css( "opacity", "0");
		$("#transition_scoring").show();
		$("#transition_scoring").animate( { opacity: '1' }, transition_time );		
	}
	
	function onTransitionScoringHandler() {
		$("#transition_scoring").animate( { opacity: '0' }, ( transition_time / 2 ), function()
		{
			$("#transition_scoring").hide();
				showScoring();
		} );
	}
	
	function showScoring() {			
		var str = "Question " + ( current_review_questions + 1 ) + ":";
		$("#questionNumberA").text( str );		
		$("#questionA").html( questions[current_review_questions].text );
		$("#questionReviewA").html( questions[current_review_questions].feedback  );		
		current_review_questions++;
		
		str = "Question " + ( current_review_questions + 1 ) + ":";
		$("#questionNumberB").text( str );		
		$("#questionB").html( questions[current_review_questions].text );
		$("#questionReviewB").html( questions[current_review_questions].feedback );
		current_review_questions++;
		
		$("#scoring").css( "opacity", "0");
		$("#scoring").show();
		$("#scoring").animate( { opacity: '1' }, transition_time );			
	}	
	
	function onReviewHandler(){
		// end of questions, show eval form
		if( current_review_questions == questions.length ){
			$("#scoring").animate( { opacity: '0' }, ( transition_time / 2 ), function()
			{
				$("#scoring").hide();
				// so interview questionnaire
			} );				
		}else {
			showScoring();			
		}		
	}
	
	//----------------------
	
	function init_facts() {
		facts[0] = "76% of students get into their first choice college.";
		/*facts[1] = "75% of the colleges and universities in the U.S. are <br>East of the Mississippi River.";
		facts[2] = "Being an athlete increases your chances of being accepted.";
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
		questions[0] = { "text" : "Which state most international students apply to for college?", "answer_0" : "Texas", "answer_1" : "Maine", "answer_2" : "Illinois", "answer_3" : "California", "answer_4" : "New York", "feedback" : "Correct!" };
		questions[1] = { "text" : "What percentage of the school's financial aid fund goes to affluent students?", "answer_0" : "10%", "answer_1" : "20%", "answer_2" : "30%", "answer_3" : "40%", "answer_4" : "50%", "feedback" : "Correct again!"  };
		/*questions[2] = { "text" : "What percentage of entering class is international?", "answer_0" : "5%", "answer_1" : "10%", "answer_2" : "15%", "answer_3" : "20%", "answer_4" : "25%" };
		questions[3] = { "text" : "Most students attend college no more than how many away from their home town?", "answer_0" : "100 miles", "answer_1" : "500 miles", "answer_2" : "1,000 miles", "answer_3" : "1,500 miles", "answer_4" : "2,000 miles" };
		questions[4] = { "text" : "How many hours a week do high school students spend studying?", "answer_0" : "1 hour", "answer_1" : "3 hours", "answer_2" : "6 hours", "answer_3" : "12 hours", "answer_4" : "18 hours" };
		questions[5] = { "text" : "What fraction of students report that they felt overwhelmed at college?", "answer_0" : "A quarter", "answer_1" : "A third", "answer_2" : "Half", "answer_3" : "Two thirds", "answer_4" : "Three quarters" };*/
		
		
	}
		
	return {
		init: init,
	};	
})();