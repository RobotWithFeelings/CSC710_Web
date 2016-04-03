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
	var evaluation;
	var recovery;
	var user_id;
	
	function init(){		
		logger.log( "main initializer");		
		init_facts();
		init_questions();
		init_tutor_questions();
		init_researcher_questions();
		
		evaluation = getQueryString( "e", "1" );
		logger.log( evaluation );
		
		recovery = getQueryString( "r", "0" );
		logger.log( recovery );
		
		$("#welcomeBtn").button();
		$("#welcomeBtn").click(onWelcomeHandler);	
		
		$("#demographicsBtn").button();
		$("#demographicsBtn").click(onDemographicsHandler);	
		
		$("#idBtn").button();
		$("#idBtn").click(onIDFormHandler);	
		
		$("#recoveryBtn").button();
		$("#recoveryBtn").click(onRecoveryHandler);	
		
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
		
		$("#userid").hide();
		$("#welcome").hide();
		$("#id_form").hide();
		$("#recovery").hide();
		$("#demographics").hide();
		$("#loader_generic").hide();
		$("#loader_facts").hide();
		$("#loader_questions").hide();		
		$("#facts").hide();	
		$("#transition").hide();	
		$("#questions").hide();
		$("#transition_scoring").hide();
		$("#scoring").hide();
		$("#transition_interview").hide();	
		$("#transition_interview2").hide();	
		$("#tutor_interview").hide();	
		$("#researcher_interview").hide();	
		$("#complete").hide();
		$("#error").hide();
		
		if( recovery == 1 ) {			
			$("#recovery").show();		
		}else {
			$("#welcome").show();		
		}
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
	
		$("#error").hide();
	
		var age;
		var experience;
		var checked = $('input[name=demo_group1]').is(":checked") && $('input[name=demo_group2]').is(":checked") && $('input[name=demo_group3]').is(":checked") && $('input[name=demo_group4]').is(":checked");		
		age = $('input[id=demo_text_age]').val();
		experience = $('input[id=demo_text_experience]').val();
		
		if( ( age == "" ) || ( experience == "" ) || ( age < 1 || age > 100 ) || ( experience < 0 || experience > 1000 )  )  {
			$("#error").html( "Please answer all questions before continuing." );
			$("#error").show();
			return;
		}
		
		if( checked ) {
			$("#demographics").animate( { opacity: '0' }, ( transition_time / 2 ), function()
			{
				$("#demographics").hide();
				
				$("#loader_generic").css( "opacity", "0");
				$("#loader_generic").show();
				$("#loader_generic").animate( { opacity: '1' }, transition_time );	
				
				var gender;
				var isCS;
				var international;
				var publicComputer;
				var penPaper;
				
				if( $('input[id=radio_gender_male]').is(":checked") ) gender = "m";
				else if ( $('input[id=radio_gender_female]').is(":checked") )  gender = "f";

				if( $('input[id=radio_cs_yes]').is(":checked") ) isCS = 1;
				else if ( $('input[id=radio_cs_no]').is(":checked") )  isCS = 0;

				if( $('input[id=radio_international_yes]').is(":checked") ) international = 1;
				else if ( $('input[id=radio_international_no]').is(":checked") )  international = 0;

				if( $('input[id=radio_computer_yes]').is(":checked") ) publicComputer = 1;
				else if ( $('input[id=radio_computer_no]').is(":checked") )  publicComputer = 0;
				
				if( evaluation == 0 ) penPaper = 1;
				else if( evaluation == 1 ) penPaper = 0;
				
				// post data to backend
				var blob = {
					"pubComp" : publicComputer,
					"cs": isCS, 
					"gender": gender, 
					"progExp": experience, 
					"age": age, 
					"international": international,
					"penPaper" : penPaper
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
						if( res.survey != undefined ) {
							//logger.log( res.survey.name );
							user_id = res.survey.name.toLowerCase();
							$("#userid").html( "User Identifier: " + user_id );
							$("#userid").show();	
						}
						
						$("#loader_generic").animate( { opacity: '0' }, ( transition_time / 2 ), function() {
							$("#loader_generic").hide();
							showIDForm();
						} );						
					},
					error: function( err ) {
						logger.log( err );
					}  
				});								
			} );
		}
	}
	
	function showIDForm() {
		var msg = "Your user identifier is: " + user_id;
		
		$("#idTitle").html( msg );
		$("#id_form").css( "opacity", "0");
		$("#id_form").show();				
		$("#id_form").animate( { opacity: '1' }, transition_time );	
	}	
	
	function onIDFormHandler() {
		$("#id_form").animate( { opacity: '0' }, ( transition_time / 2 ), function()
		{
			$("#id_form").hide();
			showFactLoader();
		} );
		
	}
	
	function showRecovery() {
		$("#recovery").css( "opacity", "0");
		$("#recovery").show();
		$("#recovery").animate( { opacity: '1' }, transition_time );			
	}
	
	function onRecoveryHandler() {
			user_id = $('input[id=recovery_text]').val();
			
			if( user_id != "" ) {
				$("#userid").html( "User Identifier: " + user_id );
				$("#userid").show();
				$("#recovery").animate( { opacity: '0' }, ( transition_time / 2 ), function()
				{
					$("#recovery").hide();
					showFactLoader();
				} );			
			}			
	}	
	
	function onFactHandler() {
		$("#error").hide();
		
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
		}else {
			$("#error").html( "Please select an answer before continuing." );
			$("#error").show();
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
		$("#error").hide();
		
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
		}else {
			$("#error").html( "Please select an answer before continuing." );
			$("#error").show();
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
		var str = "Questions " + ( current_review_question + 1 ) + " and " + ( current_review_question + 2);
		$("#reviewSubtitle").text( str );
		
		$("#questionA").html( questions[current_review_question].text );
		$("#questionReviewA").html( questions[current_review_question].feedback  );		
		$("#questionReviewA").removeClass( "questionReviewFeedbackCorrect" );
		$("#questionReviewA").removeClass( "questionReviewFeedbackIncorrect" );
		if( questions[current_review_question].icon == "1" ) $("#questionReviewA").addClass( "questionReviewFeedbackCorrect" );			
		else $("#questionReviewA").addClass( "questionReviewFeedbackIncorrect" );
		current_review_question++;
	
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
				if( evaluation == 0 ) {
					showTransitionInterview2();
				}else {
					showTransitionInterview();
				}					
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
	
	function showTransitionInterview2() {		
		$("#transition_interview2").css( "opacity", "0");
		$("#transition_interview2").show();
		$("#transition_interview2").animate( { opacity: '1' }, transition_time );		
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
		
		$("#error").hide();
		
		// check if each of the questions is answered
		var answered = true;
		for( var i = 0; i < 9; i++ ) {
			var name = "input[name=group" + ( i + 1 ) + "]";
			answered = ( answered && $( name ).is(":checked") );
		}
		
		var user_url = "http://nassdb.herokuapp.com/api/v1/surveys/name/" + user_id;
		//var user_url = "http://nassdb.herokuapp.com/api/v1/surveys/name/amucise";
		
		if( answered && current_interview_question == 0 ) {
			current_interview_question++;

			// post answers to first batch of questions
			$("#tutor_interview").animate( { opacity: '0' }, ( transition_time / 2 ), function()
			{
				$("#tutor_interview").hide();
				
				// get data from UI	
				var answers = [];
				for( var question_id = 1; question_id < 10; question_id++)  {
					for( var radio_id = 0; radio_id < 10; radio_id++ ) {
						var q_id = "radio_question" + question_id + "_id" + radio_id;
						var element =  "input[id=" + q_id + "]"; 
						
						if( $( element ).is( ":checked" ) ) {
							answers[( question_id -1)] = ( radio_id + 1 );
							break;
						}					
					}		
				}
				logger.log( answers );
				
				// post data to backend
				var blob = { 
					"q1": answers[0],
					"q2": answers[1],
					"q3": answers[2],
					"q4": answers[3],
					"q5": answers[4],
					"q6": answers[5],
					"q7": answers[6],
					"q8": answers[7],
					"q9": answers[8]		
				}
				logger.log( blob );
				
				$.ajax({ 
					headers:{
						"content-Type": "application/json",
						"Authorization": "Basic " + btoa(env.API_USERNAME + ":" + env.API_PASSWORD)
					},
					url: user_url,
					type: "PUT",
					crossDomain: true,
					async: true, 
					data: JSON.stringify( blob ),
					dataType: 'json',
					success: function( res ) {
						logger.log( res );						
						$("#loader_generic").animate( { opacity: '0' }, ( transition_time / 2 ), function() {
							$("#loader_generic").hide();
								// update UI				
								for( var i = 0; i < 9; i++ ) {
									var name = "input[name=group" + ( i + 1 ) + "]";
									$( name ).prop ('checked', false);				
								}
								showResearcherInterview();	
						} );						
					},
					error: function( err ) {
						logger.log( err );
					}  
				});				
			} );
		}else if( answered && current_interview_question == 1 ) {
			current_interview_question++;
			
			// post answers to second batch of questions
			$("#researcher_interview").animate( { opacity: '0' }, ( transition_time / 2 ), function()
			{
				$("#researcher_interview").hide();
				
				// get data from UI				
				var answers = [];
				for( var question_id = 1; question_id < 10; question_id++)  {
					for( var radio_id = 0; radio_id < 10; radio_id++ ) {
						var q_id = "radio_question" + question_id + "_id" + radio_id;
						var element =  "input[id=" + q_id + "]"; 
						
						if( $( element ).is( ":checked" ) ) {
							answers[( question_id -1)] = ( radio_id + 1 );
							break;
						}					
					}		
				}
				logger.log( answers );
				
				// post data to backend
				var blob = { 
					"q10": answers[0],
					"q11": answers[1],
					"q12": answers[2],
					"q13": answers[3],
					"q14": answers[4],
					"q15": answers[5],
					"q16": answers[6],
					"q17": answers[7],
					"q18": answers[8]					
				}
				logger.log( blob );
				
				$.ajax({ 
					headers:{
						"content-Type": "application/json",
						"Authorization": "Basic " + btoa(env.API_USERNAME + ":" + env.API_PASSWORD)
					},
					url: user_url,
					type: "PUT",
					crossDomain: true,
					async: true, 
					data: JSON.stringify( blob ),
					dataType: 'json',
					success: function( res ) {
						logger.log( res );						
						$("#loader_generic").animate( { opacity: '0' }, ( transition_time / 2 ), function() {
							$("#loader_generic").hide();
								showComplete();	
						} );						
					},
					error: function( err ) {
						logger.log( err );
					}  
				});
			} );
		}else {
			$("#error").html( "Please rate each adjective before continuing." );
			$("#error").show();
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
		facts[2] = "Being an athlete increases your chances of being accepted to college.";
		facts[3] = "46.5% of high school students frequently or occasionally fell asleep in class during their senior year.";
		facts[4] = "Tuition increases for those who can pay full price, subsidizing the cost for those who cannot.";
		facts[5] = "42% of freshmen expect to earn a master's degree.";
		facts[6] = "Less than 5% of American families have saved enough for college.";
		facts[7] = "Students who need financial aid are not guaranteed to receive it.";
		facts[8] = "53% of all international students in the U.S. come from China, Canada, India, Taiwan, South Korea and Japan.";
		facts[9] = "Early admission applicants are typically NOT stronger or more qualified than other applicants.";
		facts[10] = "Two-thirds of all college students get some form of financial aid.";
		facts[11] = "U.S. colleges do not require students to declare majors upon admission.";
		facts[12] = "Students do not need to receive a high school diploma in order to go to college.";
		facts[13] = "U.S. colleges have a higher workload than most U.S. high schools.";
		facts[14] = "The term \"Ivy League\" is used to describe a college athletic conference.";
		facts[15] = "Only 14% of freshman attend college 500 or more miles away.";
		facts[16] = "50% of college freshman earned a grade point average equal to or greater than an A- in high school.";
		facts[17] = "55% of high school students took at least one AP class and 21.7% took at least five AP courses.";
		facts[18] = "Only 18.2% of college students said national magazine college rankings were \"very important\" in their decision to attend their chosen school.";
		facts[19] = "85% of students attending private colleges are awarded merit aid.";
	}
		
	function init_questions() {
		questions[0] = { "text" : "A majority of international students apply to college in which state?", "answer_0" : "Texas", "answer_1" : "Maine", "answer_2" : "Illinois", "answer_3" : "California", "answer_4" : "New York", "feedback" : "The tutor performed extremely well by providing very useful facts. Your answer to the question concerning preferred international student location was correct.", "icon" : "1" };
		
		questions[1] = { "text" : "What percentage of a school's financial aid budget goes to affluent students?", "answer_0" : "10%", "answer_1" : "20%", "answer_2" : "30%", "answer_3" : "40%", "answer_4" : "50%", "feedback" : "The tutor performed extremely well by providing very useful facts.  Your answer to the question concerning affluent student financial aid was correct.", "icon" : "1"  };
		
		questions[2] = { "text" : "International students comprise what percentage of the graduating class of 2015?", "answer_0" : "5%", "answer_1" : "10%", "answer_2" : "15%", "answer_3" : "20%", "answer_4" : "25%", "feedback" : "The tutor performed extremely well by providing very useful facts. Your answer to the question concerning international percentages was correct.", "icon" : "1"  };
		
		questions[3] = { "text" : "A majority of students attend college no more than how many miles away from their home town?", "answer_0" : "100 miles", "answer_1" : "500 miles", "answer_2" : "1,000 miles", "answer_3" : "1,500 miles", "answer_4" : "2,000 miles", "feedback" : "The tutor performed extremely well by providing very useful facts. Your answer to the question concerning distance from students' home town was correct.", "icon" : "1" };
		
		questions[4] = { "text" : "How many hours a week do high school students spend studying?", "answer_0" : "1 hour", "answer_1" : "3 hours", "answer_2" : "6 hours", "answer_3" : "12 hours", "answer_4" : "18 hours", "feedback" : "Your answer to the question concerning high school study habits was incorrect.", "icon" : "0" };
				
		questions[5] = { "text" : "What percentage of students report that they felt overwhelmed at college?", "answer_0" : "25%", "answer_1" : "35%", "answer_2" : "50%", "answer_3" : "65%", "answer_4" : "75%", "feedback" : "The tutor performed extremely well by providing very useful facts.  Your answer to the question concerning student stress levels was correct.", "icon" : "1"  };
	
		questions[6] = { "text" : "In which subject did a quarter of college freshmen say they needed tutoring?", "answer_0" : "Biology", "answer_1" : "English", "answer_2" : "American History", "answer_3" : "Psychology", "answer_4" : "Math", "feedback" : "The tutor performed extremely well by providing very useful facts. Your answer to the question concerning incoming tutoring needs was correct.", "icon" : "1"  };
		
		questions[7] = { "text" : "What percentage of high school seniors reported that they did not read a book for fun?", "answer_0" : "30%", "answer_1" : "40%", "answer_2" : "50%", "answer_3" : "60%", "answer_4" : "70%", "feedback" : "The tutor performed extremely well by providing very useful facts. Your answer to the question concerning high school reading habits was correct.", "icon" : "1"  };
		
		questions[8] = { "text" : "What percentage of students live on campus?", "answer_0" : "40%", "answer_1" : "50%", "answer_2" : "65%", "answer_3" : "75%", "answer_4" : "90%", "feedback" : "Your answer to the question concerning on campus housing was incorrect.", "icon" : "0"  };
		
		questions[9] = { "text" : "What percentage of students rated themselves as being above average in their academic ability?", "answer_0" : "25%", "answer_1" : "50%", "answer_2" : "60%", "answer_3" : "70%", "answer_4" : "80%", "feedback" : " Your answer to the question concerning student evaluations was incorrect.", "icon" : "0"  };
		
		questions[10] = { "text" : "How concerned are college freshmen about paying back student loans?", "answer_0" : "Not a concern", "answer_1" : "A minor concern", "answer_2" : "Somewhat a concern", "answer_3" : "A major concern", "answer_4" : "Undecided", "feedback" : "Your answer to the question about students' concerns was incorrect.", "icon" : "0"  };
		
		questions[11] = { "text" : "How high can a family's income be before they are ineligible for needs-based financial aid?", "answer_0" : "$50,000", "answer_1" : "$100,000", "answer_2" : "$125,000", "answer_3" : "$150,000", "answer_4" : "$200,000", "feedback" : "The tutor performed extremely well by providing very useful facts. Your answer to the question concerning needs-based financial aid was correct.", "icon" : "1"  };		
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
	
	function getQueryString(key, default_) {
		if (default_ == null) default_ = "";

		key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

		var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
		var qs = regex.exec(window.location.href);
		if(qs == null)
			return default_;
		else return qs[1];
	}
	
	return {
		init: init,
	};	
})();