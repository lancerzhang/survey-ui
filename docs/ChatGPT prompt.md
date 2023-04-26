# prompts

1. I want to build a survey tool front end project, name is "survey-ui", please create a React project with function component and ant design ui library.
2. User have 2 roles in this system, as publisher, they can create/view/update a survey, list all surveys, view survey result and download report. as participant, they can reply survey and see their history, there should be menu. please give me the pages.
3. Give me package.json
4. Give me index.tsx
5. There should be a user icon on right of top menu bar, click the icon, will show more menus, e.g. my profile, settinigs. Also, the layout should be responsive, so that adopt different screen size, mobile, iPad, laptop and wide screen monitor.
6. When change from mobile view to desktop view, the menus are disappear
7. In PublisherSurveyList I want to call a http url and get list of surveys, and then render on the screen, the response of http is a json like below  ``paste survey list json``
8. Please use list component and vertical layout with pagination for this survey list, there should be an avatar beside username. The pagaination format is using spring data Page.java, example data json is, ``paste pagination survey list json``
9. When go to page 2, it still highlight page 1, and I can't go back to page 1.
10. Update the code, when click a survey item, will go to the PublisherSurveyEditor page along with survey.id
11. When PublisherSurveyEditor is open, call a http url go get survey detail, prefill the edit page with response body, example survey json is, ``paste survey detail json``
12. There should be a "question" section and a "Add Question" button at the bottom of the form, when click the "Add Question" button, popup a window to select question type, there are 3 types of questions, 'TEXT', 'RADIO' and 'CHECKBOX', when click the "Add Question" button, will add a question item to the "question" section.
13. What is the id in this path? if it's survey id, that means the survey-editor page will load the survey with id, and allow user to edit the survey. But how about if user want to create a new survey? what value should pass to this id param?
14. PublisherSurveyList and PublisherSurveyEditor hardcoded the server domain, how can I manage it well? So that I can switch local, development, and production easily?
15.  Write a Survey editor page, such as input boxes, radio boxes, check boxes, etc. Then, connect these UI elements to the Survey editor's state object and implement methods to add, remove, and update them.
16. There should be a label for each question, we should allow user to input question and add/remove option.
17. Update the placeholder from "Question label" to "Type your question here.". Add a question to the left of the label, make sure Add option button and Remove button remains on the same line after that. 
18. Add some vertical space between two Space element
19. Add some vertical space above Add Input, Add Radio, Add CheckBox buttons. Enable the options, When addelement, by default options should be input box and allow user to input, add placeholder so that it make sense to user, when user update option input box, update the state in the component
20. How can another page include this SurveyEditor.jsx as component? The parent page can pass the elements to this SurveyEditor, when SurveyEditor change, parent page will get the updates.
21. Put options under question , and put answer under question for input type
22. here is my PublisherSurveyEditor.jsx, pls add title and description placeholder, when submit button is click validate if all fields are inputted. if no error, when there is no path param "id",  send a POST request to `${serverDomain}/api/surveys/`, when there is path param "id", send a PUT request to `${serverDomain}/api/surveys/${id}`, ``paste your code here``
23. Add 5 buttons to survey list item in PublisherSurveyList.jsx, ”Edit”, “Share”, “Result”, “Clone”, “Delete”. When click ”Edit” button, will go to `/publisher/survey-editor/${surveyId}` page. When click “Share” button, copy the string “/participant/survey-reply/${surveyId}” to clipboard and display a success message “Survey url was copied to clipboard, please send to others”. When click “Clone” button, prompt a confirm dialog, if confirm, display a success message “Survey was cloned”. When click “Delete” button, prompt a confirm dialog, if confirm, display a success message “Survey was deleted”., ``paste your PublisherSurveyList.jsx here``

# Notes
1. Please note it may generate different answer each time.
2. You may try to limit the response words, otherwise the result may be break. You can achieve this by reducing the requirement in one question. If it exceed words limit, type "give me rest of the code" or "go on". (Do NOT type "continue", it doesn't work.)
3. The result may be not correct, please verify the result. It can help you to debug, just paste the error to it.
4. GPT will use different implementation even in the same context, e.g. it will call another service B in service A, but if you ask it again, it will use repository directly... sometimes it will use Integer type, but sometimes it use int type...
5. After modify it partially few times, you can ask it to verify the full db schema again.
6. The end date of GPT training data is September 2021. You should use an old version of dependency, e.g. React 17.0.2

# Tips
* FE code is long, try to finish logic function first, and then optimize the look and feel.