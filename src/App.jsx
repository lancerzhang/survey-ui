import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import LayoutWrapper from './components/LayoutWrapper';
import ParticipantReplies from './pages/ParticipantReplies';
import ParticipantReplyEditor from './pages/ParticipantReplyEditor';
import PublisherDelegates from './pages/PublisherDelegates';
import PublisherReportDownload from './pages/PublisherReportDownload';
import PublisherSurveyEditor from './pages/PublisherSurveyEditor';
import PublisherSurveyResults from './pages/PublisherSurveyResults';
import PublisherSurveys from './pages/PublisherSurveys';
import PublisherTemplates from './pages/PublisherTemplates';

const App = () => {
    return (
        <Router>
            <LayoutWrapper>
                <Switch>
                    <Route exact path="/" component={PublisherSurveys} />
                    <Route path="/publisher/survey-editor/:id" component={PublisherSurveyEditor} />
                    <Route path="/publisher/surveys" component={PublisherSurveys} />
                    <Route path="/publisher/templates" component={PublisherTemplates} />
                    <Route path="/publisher/survey-results/:id" component={PublisherSurveyResults} />
                    <Route path="/publisher/report-download/:id" component={PublisherReportDownload} />
                    <Route path="/publisher/delegates" component={PublisherDelegates} />
                    <Route path="/participant/reply-editor/:id" component={ParticipantReplyEditor} />
                    <Route path="/participant/replies" component={ParticipantReplies} />
                </Switch>
            </LayoutWrapper>
        </Router>
    );
};

export default App;

