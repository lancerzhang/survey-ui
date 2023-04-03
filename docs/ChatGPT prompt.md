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
12. There should be a "question" section and a "Add Question" button at the bottom of the form, when click the "Add Question" button, popup a window to select question type, there are 3 types of questions, 'TEXT', 'RADIO' and 'CHECKBOX', when click the "Add Question" button, will add a question item to the "question" section

# Notes
1. Please note it may generate different answer each time.
2. You may try to limit the response words, otherwise the result may be break. You can achieve this by reducing the requirement in one question. If it exceed words limit, type "give me rest of the code".
3. The result may be not correct, please verify the result. It can help you to debug, just paste the error to it.
4. GPT will use different implementation even in the same context, e.g. it will call another service B in service A, but if you ask it again, it will use repository directly... sometimes it will use Integer type, but sometimes it use int type...
5. After modify it partially few times, you can ask it to verify the full db schema again.
6. The end date of GPT training data is September 2021. You should use an old version of dependency, e.g. React 17.0.2

# Tips
* FE code is long, try to finish logic function first, and then optimize the look and feel.