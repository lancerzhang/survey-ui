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
