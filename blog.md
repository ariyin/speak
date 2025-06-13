# Introduction

Public speaking is a skill that is universal: people of all professions, ages, and backgrounds all need a way to communicate their ideas effectively to audiences of various sizes. However, public speaking is also something that people struggle with. In fact, according to most studies, public speaking is ranked as people’s number one fear, the second being death. 

Our team aims to address this anxiety that can come from public speaking through our product, Speak. **In particular, through our user research, we believe that anxiety from public speaking stems from two potential sources: content and delivery. Speak tackles these issues by providing a second set of eyes to deliver personalized content assessments and real-time feedback on delivery, empowering users to clearly address their points and be more confident in their abilities.**

# Problem Statement

Anxiety from public speaking can stem from two potential sources–content and delivery. Not only may content may be difficult for users to devise, but they may also have trouble ensuring the end result is appropriate in terms of depth, length, and tone. When time comes to rehearse, a second opinion may not be available, causing mistakes during practice to be carried over to the actual speech. Our product tackles these issues by providing a second set of eyes to deliver personalized content assessments and real-time rehearsal feedback, empowering users to sharpen their message and clearly deliver it with impact.

# User Research
Our team set out to explore the following questions when it comes to public speaking:

1. What do people consider to be the most important traits of a good public speaker? What is their ideal public speaking experience?
2. How does the delivery and content of a speech differ based on the size and familiarity of an audience?
3. Are users conscious of body movement and filler words when using a speech? 
4. How do people usually practice for a speech, and are there any pain points or things they feel like they could streamline in the process? 

We had two main ways of conducting user research: semi-structured interviews and a survey. 


### Interviews

We decided to employ a semi-structured interview for our user interviews in order to get the most information about the user's public speaking experiences while also having room to explore specific aspects in more depth. Our questions asked about a variety of aspects in the public speaking process including: General Perceptions and Challenges, Speaking Context, Confidence and Mindset, Habits and Self Awareness, and Practice and Improvement. 

Our team reached out to multiple organizations that focused on public speaking, namely Toastmasters as well as the UCLA Quiet Club. Toastmasters is one of the leading movements in helping people learn about the art of speaking and helping people have effective oral communication. Through structured meetings, speeches, and evaluations, they provide a supportive environment for individuals to practice and develop their public speaking and leadership skills. The UCLA Quiet Club is dedicated to help more introverted people with their public speaking skills and becoming more effective communicators.

Two of our team members went to the Santa Monica Toastmasters location to observe a meeting and ask members and officers about their experiences. The meeting followed a strict agenda, in which members would be introduced with their accompanying roles, such as the Filler Word Counter, Grammarian, Joke Master, and Table Topics Master. The club would continue on with the impromptu portion of the meeting, in which the Table Topics Master would come up with a topic and randomly assign a member to speak on it for roughly two minutes. This would be followed by the last opportunity to speak, in which two members deliver a 5-7 minute prepared speech. The meeting would finally be wrapped with an evaluation phase. It starts off with the Filler Word Counter and Grammarian, who each would go over every person’s violations such as usages of filler words and grammatical stumbles, respectively. After another round of evaluation in which two individuals review the prepared speeches, votes for best speakers in each category are revealed and given a prize!  

Additionally, we had the opportunity to interview Michael Yan, the founder of Simplify, an up and coming startup focused on making the job application process more streamlined. As a startup founder, Michael has a lot of experience with public speaking to various audiences, and we thought he would be a good person to ask about his experiences and his take on the process.

Besides these, we also interviewed fellow students at UCLA as well as various family members to get a wider range of perspectives. We interviewed a total of 23 people, 2 expert interviews, and 50+ survey responses. 

### Surveys

In addition to user interviews, we made a Google Form survey that asked questions in the same categories as were asked in our interviews. Some questions asked users to rate certain aspects of the process on a scale of 1-10 (ex. confidence at speaking, how effective they thought formal training was, etc), as well as some multi-select and short response questions asking about details of recent public speaking experiences, and things they felt like they can improve on. To better fit the survey format, we adjusted our original interview questions by incorporating multiple choice checkboxes, short answer fields, and single-select options, and we made certain follow-up questions optional so that the form would feel less overwhelming and more manageable for users.

Our team sent out the survey to a variety of people, friends and acquaintances alike. The Toastmasters team put our survey in their newsletter, where various people from the chapter also responded. Overall, several UCLA students, as well as friends and family from various other universities, jobs, and professions responded to our survey. So far, we have a total of 38 responses that have given us a good sense of the common pain points people feel with their process so far. 


### Key Findings

From our user research, we made a few key observations, summarized in the process map below:

![process map](https://github.com/ariyin/speak/blob/main/figures/processmap.png)

*Figure 1: Process Map*

We found that public speaking can be broken down into two main components — content and delivery — with most people placing greater emphasis on improving the delivery of their speech. Not only may content may be difficult for users to devise, but they may also have trouble ensuring the end result is appropriate in terms of depth, length, and tone. Making sure the audience is genuinely interested and being able to gauge and adjust to their level of engagement is also a crucial part of delivering an effective speech. When time comes to rehearse, a second opinion may not be available, causing mistakes during practice to be carried over to the actual speech. 

The main process we found that could be more streamlined was the process of getting feedback. Typically, this process is very iterative, where people get feedback either from an external source, or by watching themselves, and keep improving things until they are satisfied. Our team saw an opportunity here to make the process more efficient and more accessible to people who don’t have readily available access to getting feedback from others and having that improvement cycle. 

# Design Goals
We had two major design goals when starting to implement our system:

1. Ensure the interface is as intuitive, efficient, and easy to navigate for the target users.

We wanted to make sure that our product has as seamless of an UI as possible so users can focus on using our product for getting the analysis they want. Classmates who tested our initial prototype commented that the flow was pretty intuitive, and we wanted to make sure that stayed the case in our actual implementation. We did this through having very minimal options per page so users were not overwhelmed and can intuitively figure out how to navigate the site, as well as making options very clear with buttons with straightforward, readable text. Additionally, we made the workflow of our product very clear: select the type of analysis, upload/record video, receive analysis, and either rehearse again or practice a new speech. We wanted to make it very clear which phase of the process you were in the entire time when using Speak.

2. Establish a clear hierarchy of importance in which feedback is important for our users and make sure the hierarchy is clear in the design.

Based on instructor feedback, something we wanted to incorporate into our design was not having users be overwhelmed with feedback and criticism they receive on their speech. From our user interviews, many people feel pressured when it comes to rehearsing due to the fear of being judged; we wanted to make sure that this was not the case when using our product and that users are able to continue improving their skills without being unmotivated from continued criticism. We did this through having both pros and areas of improvement for each section of analysis we provided. We wanted to provide positive reinforcement to users and not have them be overwhelmed by merely a list of improvements, rather than commenting on the things they were already doing well. We wanted to emphasize this by having different highlight colors in our analysis to show the importance of each feedback given, so users know what is most important for them to work on. 

# Implementation
Our product consists of three components which include a frontend, backend, and analysis endpoint.

### Frontend
Our frontend is built using React, TypeScript, Vite, and Tailwind CSS, chosen for their developer experience, speed, and scalability. React enables us to build a modular, component-based UI that’s easy to maintain and extend. TypeScript adds static typing, making the codebase more robust and easier to work with in a team setting. Vite serves as our build tool and dev server, offering lightning-fast hot module replacement and a quick startup time, which streamlines our development workflow. And Tailwind CSS allows us to style components directly with utility classes, reducing context switching and enforcing visual consistency across pages.

We organize our codebase into clear folders: assets, components, pages, and utils. The assets folder includes custom fonts, our logo, and the loading animation. Our components folder contains both third-party components from shadcn — including Accordion, Dialog, and Tooltip — and custom ones like AnalysisContent, which is reused on both the active and past analysis pages. Other custom components include ExitButton, RecordingModal for when users want to record a video, UploadModal for when users want to upload a video, SpeechCard for the speeches on the home page, and VideoPlayer.

The pages folder includes each step of the user flow: the home page, a selection page for choosing analysis type, a page for entering speech content, a video upload/record page, an analysis results page, a summary page, a history page for past analysis, and a loading screen. Finally, the utils folder houses shared helper functions and frontend models, such as auth (for handling authentication with localStorage) and cloudinaryService (for managing video uploads to Cloudinary). This structure keeps the project modular, maintainable, and easy to scale.

For our design choices, we aimed to create a clean, bold, and approachable visual identity that aligns with the theme of public speaking. We use General Sans for body text to maintain readability and a modern, neutral tone, while Manrope is used for headings to give them weight and clarity, helping users easily scan through content.

Our primary accent color is a cherry red (#D20A2E), which we chose intentionally. Red is often associated with confidence, energy, and urgency — emotions that tie closely to public speaking. This color appears consistently across buttons, highlights, and interactive elements to guide user focus.

The triangle motif in our logo symbolizes a “peak” — representing the idea that users can reach their peak performance through our platform. This triangle is also echoed in our custom loading animation, reinforcing our visual identity with a subtle, cohesive design element that connects branding with interaction.

### Backend
Our backend is built on FastAPI, a Python web framework that allows us to build high performance APIs. Our asynchronous API server handles operations including speech/rehearsal creation and fetching, analysis caching, and video uploading. Specifically, it allows for data retrieval from a Mongo database, in which it is used in conjunction with Pydantic models for schema validation. 

Our Mongo database defines two collections; speeches and rehearsals. A speech document is used to map users to rehearsals in a specific session, which is done by having a list of rehearsal documents set as a field. Most of the information is then stored in the fields of a rehearsal document, including the document ID of the speech it belongs to, user settings, analysis, content, and video URL. Video URLs are generated from Cloudinary, a library which serves to store videos from users as Mongo does not support for doing so. 

Our backend then interacts with the frontend via various HTTP requests such as GET, POST, PATCH, etc., in order to modify or retrieve various entries in our database based on user inputs. Of course, these operations are type specific, so we leveraged FastAPI’s ability to organize endpoints by creating routers specific to a collection type, such that the server URLs are prepended by the collection type of “rehearsal” or “speech”.

### Analysis
For our analysis, we had two major components: delivery and content. For our delivery analysis, we used Gemini 2.5 Pro that just recently included multimodal capabilities, including video. We passed in the user’s inputted video with carefully crafted prompts into Gemini to give detailed analysis about a user’s body language at specific timestamps in the video, so the user could go back and refer to them.

For analysis relating to content, we used OpenAI’s Whisper model to generate a transcript from the video. From there, we used Llama to extract filler words, calculate speech rate, and in the case where a user provided a script or outline along with a video, to compare the content they provided with the content they had in the video. These tasks were all separate prompts that we carefully composed and later did some further processing on to make sure the analysis was as accurate and clear as possible. We decided to use two different AI pipelines for these components since we wanted more control over the text we were analyzing versus relying on Gemini to analyze the text in the video for us. 

### Figures

![home](https://github.com/ariyin/speak/blob/main/figures/image%2014.png)

*Figure 2: Home screen*

![analysis](https://github.com/ariyin/speak/blob/main/figures/image%2015.png)

*Figure 3: Choosing type of analysis*

![content](https://github.com/ariyin/speak/blob/main/figures/image%2016.png)

*Figure 4: Uploading a script or outline*

![record](https://github.com/ariyin/speak/blob/main/figures/image%2017.png)

*Figure 5: Uploading or recording a video*

![analysis](https://github.com/ariyin/speak/blob/main/figures/image%2019.png)

*Figure 6: Viewing content and/or delivery analysis*


# Evaluation
When presenting our product to users to assess its usability, we chose two guiding questions. The first focuses on the ease of use of our project; “How intuitive is our system to use? Does the user need additional explanation to use any of our implemented features, or is it self-explanatory?” The second aims to determine if it actually has any impact in the first place; “Does the user feel like our system is helping them with their public speaking? Is the feedback we deliver helpful to their practice?” While there is certainly quantitative data to assess as a user runs through our product such as time spent on each page/rehearsal and changes in filler words, we chose to mainly focus on qualitative data. 

Users were evaluated in–person, in which we have them go through the process of recording a speech and going through its analysis. To keep walkthroughs somewhat controlled, we followed a protocol in which users are given impromptu topics they can choose to give a speech on. Doing so allows the users to have content to fill in and to not get stuck when recording their speech. 

After being given a brief introduction as to what our product does and choosing what impromptu topic to practice on, we have them go through the process of creating a speech, filling out the content section with the impromptu topic, recording their speech, and looking through the analysis given. Do note the fact that we omitted the part in which they rehearsed again, simply because we have yet to implement the feature in which improvements are measured.  

During this process, we primarily took note of their actions, such as what they did and did not click and what they read. Some users would also walk us through what they were thinking by speaking aloud, such as points of confusion or improvement, in which we noted as well. With the notes, we would evaluate them via thematic analysis to produce the codebook in the following section.

As for choosing who to investigate in the first place, we went back to the personas we found in the user research phase. One persona was essentially a student who only sees them publicly speaking in an academic setting such as during a class or club meeting. To investigate this demographic, we asked peers around us, whether they may be in a mutual class or club. The second persona we discovered was one who is more driven by their career. Those who fit this group are typically older and have more speaking in a setting where their audience is their clientele. 

# Findings
After some initial evaluation, we did a thematic analysis to find common patterns in our users behaviors. 


| Code  | Definition | Phrase/Data | 
| ------------- |-------------|-------------|
| UI Responsiveness Issues	     | Delays or unresponsive buttons leading to repeated actions     | - “Clicking ‘next’ on the Video page is not immediately responsive, causing the user to click it multiple times” (P3) <br> - “Next button is kinda buggy” (P4) <br> - “Clicked next multiple times again” (P4) <br> - “Clicked next, no response again” (P6) | 
| Missing or Confusing Guidance | Lack of clear instructions or expectations at key points | - “Maybe should have a ‘please select one of the following’ text on the content page” (P3) <br> - “Give introductions of what to expect, what things you’re gonna analyze” (P3) <br> - “Uploading video when selecting content was confusing” (P3) <br> - “Also confused about the difference about script and outline” (P5) <br> - “Not sure he was able to select two of them for what to analyze” (P6) <br> - “Needed prompting to click on the video thumbnail to see the past analysis information” (P7) <br> - “Thinks the summary page is confusing and wouldn’t know that the thumbnail would be clickable and taking him back to the past analysis” (P7) <br> - “Filler words UI may not be immediately clear” (P4) |
| Expectations vs. System Behavior| Mismatch between what users expect and what the system does | - “She thought there would be a countdown for the recording” (P5) <br> - “Was expecting the input would show up on the side of the screen when recording” (P5) <br> - “Expected screen to continue when clicking ‘enter’, rather than clicking the button” (P6) <br> - “Didn’t know effect of what would happen with the transcript and outline” (P3) |
| Feature Suggestions | Direct or implied user suggestions for improving experience | - “Add a button that says ‘both’” (P3) <br> - ““It started already” maybe add a countdown for starting the recording?” (P5) <br> - “Maybe when clicking ‘exit’… should have the popup” (P5) <br> - “If it can keep track of fidgeting… currently mostly about where he’s looking” (P4) <br> - “follow-up questions for practicing” (P4) <br> - “content you inputted [...] on the side” (P4) <br> - “if there’s no content analysis” (P4) | 
| Positive Feedback / Intuitiveness | Moments where the interface works well or feels natural | - “Pretty intuitive” (P4) <br> - “Liked how able to keep track of where he was looking” (P4) <br> - “Liked the timestamps” (P4) |

*Figure 7: Codebook for Thematic Analysis*

Figure 7 shows the codebook we used to analyze our evaluation. We go into further detail for each of these codes below:

### UI Responsiveness
Our first code was UI responsiveness, which we defined as delays or unresponsive buttons leading to repeated actions. In particular, the most particular issue users were facing were with the Next button from after finishing uploading or recording to getting the analysis. Clicking next would lead to the video starting to be analyzed. However, since the analysis of the video does take around 30 seconds- 1 minute to complete depending on the length of the video, we did not want users to feel confused as to whether their video successfully uploaded or not. To address this issue with the next button, we added a loading page once users clicked next with a rotating version of our logo, so users can feel reassured that the analysis of their video is happening and do not click the button numerous times.

### Missing or Confusing Guidance
Our second code was missing or confusing guidance, which we defined as lack of clear instructions or expectations at key points. One point of the process that there was some confusion was the selection of getting content or delivery analysis. In particular, there was confusion about the distinction between these two kinds of analysis as well as whether they were mutually exclusive or not. In particular for content analysis, users were confused about the difference between uploading a script versus an outline, and what the effect of doing so would be for our system. Users often did not realize that content analysis still required a video analysis, and often thought it was more for quality of their writing. Even though we had text bubbles describing what these features were as well as a checkbox to indicate they can select both, we noticed this as a primary user behavior in our evaluations. Another point of confusion we observed was the summary page thumbnail and not being too clear to users that it was clickable to go back to the analysis. We aimed to make that clearer in a future revision of the system.

### Expectations vs System Behavior
Our third code was expectations vs system behavior, defined as a mismatch between what users expect and what the system does. Some notable points were users expecting a countdown when recording the video so they knew when to start. Another one was expecting the script or outline they uploaded to be displayed on the side of the screen when they were recording their video, to help guide their speech. While we did try implementing this feature, we did not feel like the UI was up to par and hence decided to scrap it for the final showcase version of the project. 

### Feature Suggestions

Our fourth code was feedback suggestions, defined as direct or implied user suggestions for improving experience. Some feedback that we got on the analysis portion was having some analysis on fidgeting - currently, our feedback mainly focuses on eye movement, hand gestures, and any other notable body movements, but something like fidgeting would require more fine-grained long-term analysis throughout the entire video. Another suggestion we received was providing users with follow-up questions that they can use to practice for their next rehearsal. 

### Positive Feedback/Intuitiveness 

Overall, users tended to find our interface very natural and easy to use, with people appreciating certain features such as clickable timestamps, and the accurate body language analysis. We hope to carry this forward in future iterations of our project.

# Discussion
Through our evaluation and the process of building Speak, there were some key findings we took away. 

### Limitations
One of the major limitations of our system is the length of the video. With the users we did evaluations on, videos were no more than 5 minutes long, most being between 30 seconds - 2 minutes. However, with longer videos approaching 20 min -1 hour, the analysis might be slow, and not as accurate. This is something we aim to improve in the future.

We also wanted to go back to Toastmasters and test out our system with them to see how their members reacted and if they found our product helpful, especially with the initial user research we got from attending their meetings and talking to their officer team. However, due to constraints with deploying and some scheduling issues, we were not able to go back to evaluate with them. 

### Future Work
There are a variety of new features we want to implement in the future:
1. Continue to improve analysis in both content and delivery through testing out new models and new frameworks
2. Add highlighting feature that shows the most important parts of feedback displayed to users
3. Improve time to analyze each video, especially for longer videos.
4. Add improvement feature, where for an additional rehearsal for a given speech, we show how they improved from their last one.
5. Add a feature where users can choose an audience to speak to when giving their speech to help with stage fright and anxiety.
6. Include support for multiple people in a video frame (ex. if there is a group giving a speech) 
7. Deploy Speak! 
### Lessons Learned/New Questions
Some new questions that have emerged from our evaluation are:

1. How effective do users find the analysis when actually giving the speech? Is there anything specific they would want to be changed about the feedback that is given or any additional feedback they want provided?
2. Do users find overwhelmed with the feedback that is provided? Do they feel empowered to improve their speaking skills or do they feel criticized?
3. Do users feel like Speak helps with anxiety or stage fright induced by public speaking? If not, is there a feature we can provide that does so?

