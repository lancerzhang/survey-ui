import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LayoutWrapper from './components/LayoutWrapper';
import PublisherSurveys from './pages/PublisherSurveys';
import PublisherTemplates from './pages/PublisherTemplates';
import PublisherSurveyEditor from './pages/PublisherSurveyEditor';
import QuestionEditor from './pages/QuestionEditor';
import PublisherSurveyResults from './pages/PublisherSurveyResults';
import PublisherReportDownload from './pages/PublisherReportDownload';
import ParticipantReplies from './pages/ParticipantReplies';
import ParticipantReplyEditor from './pages/ParticipantReplyEditor';

const App = () => {
    return (
        <Router>
            <LayoutWrapper>
                <Switch>
                    <Route exact path="/" component={PublisherSurveys} />
                    <Route path="/QuestionEditor" component={QuestionEditor} />
                    <Route path="/publisher/survey-editor/:id" component={PublisherSurveyEditor} />
                    <Route path="/publisher/surveys" component={PublisherSurveys} />
                    <Route path="/participant/reply-editor/:id" component={ParticipantReplyEditor} />
                    <Route path="/participant/replies" component={ParticipantReplies} />
                    <Route path="/publisher/templates" component={PublisherTemplates} />
                    <Route path="/publisher/survey-results/:id" component={PublisherSurveyResults} />
                    <Route path="/publisher/report-download/:id" component={PublisherReportDownload} />
                </Switch>
            </LayoutWrapper>
        </Router>
    );
};

export default App;

