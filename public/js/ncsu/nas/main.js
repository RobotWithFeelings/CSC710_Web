var Main = (function() {
	"use strict";

	var transition_time = 500;
	var loader_time = 0;
	var loader_rand = 5000;
	var current_fact = 0;
	var current_question = 0;
	var current_review_question =0;
	var current_interview_question = 0;
	var facts = [];
	var questions = [];
	var interview_tutor_questions = [];
	var interview_researcher_questions = [];
	
	function init(){		
		logger.log( "main initializer");		
		init_facts();
		init_questions();
		init_tutor_questions();
		init_researcher_questions();
		
		$("#welcomeBtn").button();
		$("#welcomeBtn").click(onWelcomeHandler);	
		
		$("#demographicsBtn").button();
		$("#demographicsBtn").click(onDemographicsHandler);	
		
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
		
		$("#transitionInterviewBtn").button();
		$("#transitionInterviewBtn").click(onTransitionInterviewHandler);
		
		$("#interviewBtn").button();
		$("#interviewBtn").click(onInterviewHandler);
		
		$("#interviewBtn2").button();
		$("#interviewBtn2").click(onInterviewHandler);
		
		$("#completeBtn").button();
		$("#completeBtn").click(onResetHandler);
		
		$("#welcome").show();
		$("#demographics").hide();
		$("#loader_facts").hide();
		$("#loader_questions").hide();		
		$("#facts").hide();	
		$("#transition").hide();	
		$("#questions").hide();
		$("#transition_scoring").hide();
		$("#scoring").hide();
		$("#transition_interview").hide();	
		$("#tutor_interview").hide();	
		$("#researcher_interview").hide();	
		$("#complete").hide();
	}
	
	function showWelcome() {
		$("#welcome").css( "opacity", "0");
		$("#welcome").show();
		$("#welcome").animate( { opacity: '1' }, transition_time );		
	}
	
	function onWelcomeHandler() {
		$("#welcome").animate( { opacity: '0' }, ( transition_time / 2 ), function()
		{
			$("#welcome").hide();
				showDemographics();
		} );
	}	
	
	function showDemographics() {
		$("#demographics").css( "opacity", "0");
		$("#demographics").show();
		$("#demographics").animate( { opacity: '1' }, transition_time );			
	}
	
	function onDemographicsHandler() {		
		var age;
		var experience;
		var checked = $('input[name=demo_group1]').is(":checked") && $('input[name=demo_group2]').is(":checked") && $('input[name=demo_group3]').is(":checked") && $('input[name=demo_group4]').is(":checked");		
		
		age = $('input[id=demo_text_age]').val();
		experience = $('input[id=demo_text_experience]').val();
		
		if( ( age == "" ) || ( experience == "" )  ) return;		
		if( age < 0 || age > 100 ) return;
		if( experience < 0 || experience > 100 ) return;
		
		if( checked ) {
			$("#demographics").animate( { opacity: '0' }, ( transition_time / 2 ), function()
			{
				$("#demographics").hide();
				
				var gender;
				var isCS;
				var international;
				var ownMachine;
				
				if( $('input[id=radio_gender_male]').is(":checked") ) gender = "m";
				else if ( $('input[id=radio_gender_female]').is(":checked") )  gender = "f";

				if( $('input[id=radio_cs_yes]').is(":checked") ) isCS = 1;
				else if ( $('input[id=radio_cs_no]').is(":checked") )  isCS = 0;

				if( $('input[id=radio_international_yes]').is(":checked") ) international = 1;
				else if ( $('input[id=radio_international_no]').is(":checked") )  international = 0;

				if( $('input[id=radio_computer_yes]').is(":checked") ) ownMachine = 1;
				else if ( $('input[id=radio_computer_no]').is(":checked") )  ownMachine = 0;
				
				// post data to backend
				var blob = { 
					"ownMachine": ownMachine, 
					"cs": isCS, 
					"gender": gender, 
					"progExp": experience, 
					"age": age, 
					"international": international 
				}
				logger.log( blob );
				
				$.ajax({ 
					headers:{
						"content-Type": "application/json",
						"Authorization": "Basic " + btoa(env.API_USERNAME + ":" + env.API_PASSWORD)
					},
					url: "http://nassdb.herokuapp.com/api/v1/surveys/",
					type: "POST",
					crossDomain: true,
					async: true, 
					data: JSON.stringify( blob ),
					dataType: 'json',
					success: function( res ) {
						logger.log( res );
						showFactLoader();
					},
					error: function( err ){
						logger.log( err );
					}  
				});							
				
			} );
		}
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
		loader_time = 250 + ( Math.random() * loader_rand );
		logger.log( "loader time: " + loader_time );
		
		setTimeout( function() {
			$("#loader_facts").animate( { opacity: '0' }, transition_time, function() {
				$("#loader_facts").hide();
				showFact();
			} );					
		}, loader_time );
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
		loader_time = 250 + ( Math.random() * loader_rand );
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
					$('input[name=question_radio]').prop ('checked', false);
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
		var str = "Question " + ( current_review_question + 1 ) + ":";
		$("#questionNumberA").text( str );		
		$("#questionA").html( questions[current_review_question].text );
		$("#questionReviewA").html( questions[current_review_question].feedback  );		
		$("#questionReviewA").removeClass( "questionReviewFeedbackCorrect" );
		$("#questionReviewA").removeClass( "questionReviewFeedbackIncorrect" );
		if( questions[current_review_question].icon == "1" ) $("#questionReviewA").addClass( "questionReviewFeedbackCorrect" );			
		else $("#questionReviewA").addClass( "questionReviewFeedbackIncorrect" );
		current_review_question++;
		
		str = "Question " + ( current_review_question + 1 ) + ":";
		$("#questionNumberB").text( str );		
		$("#questionB").html( questions[current_review_question].text );
		$("#questionReviewB").html( questions[current_review_question].feedback );
		$("#questionReviewB").removeClass( "questionReviewFeedbackCorrect" );
		$("#questionReviewB").removeClass( "questionReviewFeedbackIncorrect" );
		if( questions[current_review_question].icon == "1" ) $("#questionReviewB").addClass( "questionReviewFeedbackCorrect" );			
		else $("#questionReviewB").addClass( "questionReviewFeedbackIncorrect" );
		current_review_question++;
		
		$("#scoring").css( "opacity", "0");
		$("#scoring").show();
		$("#scoring").animate( { opacity: '1' }, transition_time );			
	}	
	
	function onReviewHandler(){
		if( current_review_question == questions.length ){
			$("#scoring").animate( { opacity: '0' }, ( transition_time / 2 ), function()
			{
				$("#scoring").hide();
					showTransitionInterview();
			} );				
		}else {
			showScoring();			
		}		
	}
	
	function showTransitionInterview() {		
		$("#transition_interview").css( "opacity", "0");
		$("#transition_interview").show();
		$("#transition_interview").animate( { opacity: '1' }, transition_time );		
	}
	
	function onTransitionInterviewHandler(){
		$("#transition_interview").animate( { opacity: '0' }, ( transition_time / 2 ), function()
		{
			$("#transition_interview").hide();
				showTutorInterview();
		} );
	}
	
	function showTutorInterview() {
		$("#interview_tutor_adjective1").html( interview_tutor_questions[0].text );
		$("#interview_tutor_adjective2").html( interview_tutor_questions[1].text );
		$("#interview_tutor_adjective3").html( interview_tutor_questions[2].text );
		$("#interview_tutor_adjective4").html( interview_tutor_questions[3].text );
		$("#interview_tutor_adjective5").html( interview_tutor_questions[4].text );
		$("#interview_tutor_adjective6").html( interview_tutor_questions[5].text );
		$("#interview_tutor_adjective7").html( interview_tutor_questions[6].text );
		$("#interview_tutor_adjective8").html( interview_tutor_questions[7].text );
		$("#interview_tutor_adjective9").html( interview_tutor_questions[8].text );
	
		$("#tutor_interview").css( "opacity", "0");
		$("#tutor_interview").show();
		$("#tutor_interview").animate( { opacity: '1' }, transition_time );			
	}

	function showResearcherInterview() {
		$("#interview_researcher_adjective1").html( interview_researcher_questions[0].text );
		$("#interview_researcher_adjective2").html( interview_researcher_questions[1].text );
		$("#interview_researcher_adjective3").html( interview_researcher_questions[2].text );
		$("#interview_researcher_adjective4").html( interview_researcher_questions[3].text );
		$("#interview_researcher_adjective5").html( interview_researcher_questions[4].text );
		$("#interview_researcher_adjective6").html( interview_researcher_questions[5].text );
		$("#interview_researcher_adjective7").html( interview_researcher_questions[6].text );
		$("#interview_researcher_adjective8").html( interview_researcher_questions[7].text );
		$("#interview_researcher_adjective9").html( interview_researcher_questions[8].text );
	
		$("#researcher_interview").css( "opacity", "0");
		$("#researcher_interview").show();
		$("#researcher_interview").animate( { opacity: '1' }, transition_time );			
	}	
	
	function onInterviewHandler() {
		
		// check if each of the questions is answered
		var answered = true;
		for( var i = 0; i < 9; i++ ) {
			var name = "input[name=group" + ( i + 1 ) + "]";
			answered = ( answered && $( name ).is(":checked") );
		}	
		
		if( answered && current_interview_question == 0 ) {
			current_interview_question++;

			// post answers to first batch of questions
			$("#tutor_interview").animate( { opacity: '0' }, ( transition_time / 2 ), function()
			{
				$("#tutor_interview").hide();
				
				
			
				// update UI				
				for( var i = 0; i < 9; i++ ) {
					var name = "input[name=group" + ( i + 1 ) + "]";
					$( name ).prop ('checked', false);				
				}
				showResearcherInterview();	
			} );
		}else if( answered && current_interview_question == 1 ) {
			current_interview_question++;
			
			// post answers to second batch of questions
			$("#researcher_interview").animate( { opacity: '0' }, ( transition_time / 2 ), function()
			{
				$("#researcher_interview").hide();
				
				// post data to backend				
							
				
				showComplete();
			} );
		}		
	}
	
	function showComplete() {		
		$("#complete").css( "opacity", "0");
		$("#complete").show();
		$("#complete").animate( { opacity: '1' }, transition_time );			
	}
	
	function onResetHandler() {
		current_fact = 0;
		current_question = 0;
		current_review_question = 0;
		current_interview_question = 0;
		
		$("#complete").animate( { opacity: '0' }, ( transition_time / 2 ), function()
			{
				$("#complete").hide();
					showWelcome();
			} );		
	}
	
	//----------------------
	
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
		questions[0] = { "text" : "Which state most international students apply to for college?", "answer_0" : "Texas", "answer_1" : "Maine", "answer_2" : "Illinois", "answer_3" : "California", "answer_4" : "New York", "feedback" : "Feedback: correct!", "icon" : "1" };
		questions[1] = { "text" : "What percentage of the school's financial aid fund goes to affluent students?", "answer_0" : "10%", "answer_1" : "20%", "answer_2" : "30%", "answer_3" : "40%", "answer_4" : "50%", "feedback" : "Feedback: correct again!", "icon" : "1"  };
		questions[2] = { "text" : "What percentage of entering class is international?", "answer_0" : "5%", "answer_1" : "10%", "answer_2" : "15%", "answer_3" : "20%", "answer_4" : "25%", "feedback" : "Feedback: incorrect", "icon" : "0"  };
		questions[3] = { "text" : "Most students attend college no more than how many away from their home town?", "answer_0" : "100 miles", "answer_1" : "500 miles", "answer_2" : "1,000 miles", "answer_3" : "1,500 miles", "answer_4" : "2,000 miles", "feedback" : "Feedback: correct!", "icon" : "1" };
		/*questions[4] = { "text" : "How many hours a week do high school students spend studying?", "answer_0" : "1 hour", "answer_1" : "3 hours", "answer_2" : "6 hours", "answer_3" : "12 hours", "answer_4" : "18 hours", "feedback" : "Feedback: correct!" };
		questions[5] = { "text" : "What fraction of students report that they felt overwhelmed at college?", "answer_0" : "A quarter", "answer_1" : "A third", "answer_2" : "Half", "answer_3" : "Two thirds", "answer_4" : "Three quarters", "feedback" : "Feedback: correct!" };
		questions[6] = { "text" : "A quarter of college freshmen said they would need tutoring in which subject?", "answer_0" : "Biology", "answer_1" : "English", "answer_2" : "American History", "answer_3" : "Psychology", "answer_4" : "Math", "feedback" : "Feedback: correct!" };
		questions[7] = { "text" : "What percentage of high school seniors did not read a book for fun?", "answer_0" : "30%", "answer_1" : "40%", "answer_2" : "50%", "answer_3" : "60%", "answer_4" : "70%", "feedback" : "Feedback: correct!" };
		questions[8] = { "text" : "What percentage of students live on campus?", "answer_0" : "40%", "answer_1" : "50%", "answer_2" : "65%", "answer_3" : "75%", "answer_4" : "90%", "feedback" : "Feedback: correct!" };
		questions[9] = { "text" : "What percentage of students rated themselves as being in the top 10 percent of students or above-average in their academic ability?", "answer_0" : "25%", "answer_1" : "50%", "answer_2" : "60%", "answer_3" : "70%", "answer_4" : "80%", "feedback" : "Feedback: correct!" };
		questions[10] = { "text" : "How much of a concern is paying back student loans for a college freshman?", "answer_0" : "Not a concern", "answer_1" : "A minor concern", "answer_2" : "Somewhat a concern", "answer_3" : "A major concern", "answer_4" : "Undecided", "feedback" : "Feedback: correct!" };
		questions[11] = { "text" : "How much money can a family make and still be considered for needs based financial aid?", "answer_0" : "50k", "answer_1" : "100k", "answer_2" : "125k", "answer_3" : "150k", "answer_4" : "200k", "feedback" : "Feedback: correct!" };	*/
	}
	
	function init_tutor_questions() {
		interview_tutor_questions[0] = { "text" : "Enjoyable" };
		interview_tutor_questions[1] = { "text" : "Useful" };
		interview_tutor_questions[2] = { "text" : "Informative" };
		interview_tutor_questions[3] = { "text" : "Accurate" };
		interview_tutor_questions[4] = { "text" : "Analytical" };
		interview_tutor_questions[5] = { "text" : "Fun" };
		interview_tutor_questions[6] = { "text" : "Fair" };
		interview_tutor_questions[7] = { "text" : "Efficient" };
		interview_tutor_questions[8] = { "text" : "Reliable" };		
	}
	
	function init_researcher_questions() {
		interview_researcher_questions[0] = { "text" : "Helpful" };
		interview_researcher_questions[1] = { "text" : "Polite" };
		interview_researcher_questions[2] = { "text" : "Friendly" };
		interview_researcher_questions[3] = { "text" : "Knowledgable" };
		interview_researcher_questions[4] = { "text" : "Competent" };
		interview_researcher_questions[5] = { "text" : "Likeable" };
		interview_researcher_questions[6] = { "text" : "Approachable" };
		interview_researcher_questions[7] = { "text" : "Passionate" };
		interview_researcher_questions[8] = { "text" : "Focused" };		
	}
		
	return {
		init: init,
	};	
})();