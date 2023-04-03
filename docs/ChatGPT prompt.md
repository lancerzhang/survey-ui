# prompts

1. I want to build a survey tool front end project, name is "survey-ui", please create a React project with function component and ant design ui library.
2. User have 2 roles in this system, as publisher, they can create/view/update a survey, list all surveys, view survey result and download report. as participant, they can reply survey and see their history, there should be menu. please give me the pages.
3. Give me package.json
Give me index.tsx
4. There should be a user icon on right of top menu bar, click the icon, will show more menus, e.g. my profile, settinigs. Also, the layout should be responsive, so that adopt different screen size, mobile, iPad, laptop and wide screen monitor.
when change from mobile view to desktop view, the menus are disappear

# Notes
1. Please note it may generate different answer each time.
2. You may try to limit the response words, otherwise the result may be break. You can achieve this by reducing the requirement in one question. If it exceed words limit, type "give me rest of the code".
3. The result may be not correct, please verify the result. It can help you to debug, just paste the error to it.
4. GPT will use different implementation even in the same context, e.g. it will call another service B in service A, but if you ask it again, it will use repository directly... sometimes it will use Integer type, but sometimes it use int type...
5. After modify it partially few times, you can ask it to verify the full db schema again.
6. The end date of GPT training data is September 2021. You should use an old version of dependency, e.g. React 17.0.2
