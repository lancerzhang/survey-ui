export const BASE_NUM_NEW_ID = 1000 * 1000

export const removeIdsFromSurvey = (survey) => {
    const modifiedSurvey = { ...survey };
    delete modifiedSurvey.id;

    modifiedSurvey.questions.forEach((question) => {
        delete question.id;
        question.options.forEach((option) => {
            delete option.id;
        });
    });

    return modifiedSurvey;
};

export const removeNewIdsFromSurvey = (survey) => {
    const modifiedSurvey = { ...survey };

    modifiedSurvey.questions.forEach((question) => {
        if (question.id >= BASE_NUM_NEW_ID) {
            delete question.id;
        }
        question.options.forEach((option) => {
            if (option.id >= BASE_NUM_NEW_ID) {
                delete option.id;
            }
        });
    });

    return modifiedSurvey;
};
