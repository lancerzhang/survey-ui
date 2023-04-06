import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LayoutWrapper from './components/LayoutWrapper';
import PublisherSurveyList from './pages/PublisherSurveyList';
import PublisherTemplates from './pages/PublisherTemplates';
import PublisherSurveyEditor from './pages/PublisherSurveyEditor';
import SurveyEditor from './pages/SurveyEditor';
import PublisherSurveyResults from './pages/PublisherSurveyResults';
import PublisherReportDownload from './pages/PublisherReportDownload';
import ParticipantSurveyReplyList from './pages/ParticipantSurveyReplyList';

const App = () => {
    return (
        <Router>
            <LayoutWrapper>
                <Switch>
                    <Route path="/publisher/surveys" component={PublisherSurveyList} />
                    <Route path="/SurveyEditor" component={SurveyEditor} />
                    <Route path="/publisher/survey-editor/:id" component={PublisherSurveyEditor} />
                    <Route path="/publisher/templates" component={PublisherTemplates} />
                    <Route path="/publisher/survey-results/:id" component={PublisherSurveyResults} />
                    <Route path="/publisher/report-download/:id" component={PublisherReportDownload} />
                    <Route path="/participant/survey-replies" component={ParticipantSurveyReplyList} />
                </Switch>
            </LayoutWrapper>
        </Router>
    );
};

export default App;

