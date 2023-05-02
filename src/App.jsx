import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LayoutWrapper from './components/LayoutWrapper';
import PublisherSurveyList from './pages/PublisherSurveyList';
import PublisherTemplates from './pages/PublisherTemplates';
import PublisherSurveyEditor from './pages/PublisherSurveyEditor';
import QuestionEditor from './pages/QuestionEditor';
import PublisherSurveyResults from './pages/PublisherSurveyResults';
import PublisherReportDownload from './pages/PublisherReportDownload';
import ParticipantReplyList from './pages/ParticipantReplyList';
import ParticipantReply from './pages/ParticipantReply';

const App = () => {
    return (
        <Router>
            <LayoutWrapper>
                <Switch>
                    <Route exact path="/" component={PublisherSurveyList} />
                    <Route path="/QuestionEditor" component={QuestionEditor} />
                    <Route path="/publisher/surveys" component={PublisherSurveyList} />
                    <Route path="/publisher/survey-editor/:id" component={PublisherSurveyEditor} />
                    <Route path="/publisher/templates" component={PublisherTemplates} />
                    <Route path="/publisher/survey-results/:id" component={PublisherSurveyResults} />
                    <Route path="/publisher/report-download/:id" component={PublisherReportDownload} />
                    <Route path="/participant/reply/:id" component={ParticipantReply} />
                    <Route path="/participant/reply-list" component={ParticipantReplyList} />
                </Switch>
            </LayoutWrapper>
        </Router>
    );
};

export default App;

