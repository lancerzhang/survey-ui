import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LayoutWrapper from './components/LayoutWrapper';
import PublisherSurveyList from './pages/PublisherSurveyList';
import PublisherSurveyEditor from './pages/PublisherSurveyEditor';
import PublisherSurveyResults from './pages/PublisherSurveyResults';
import PublisherReportDownload from './pages/PublisherReportDownload';
import ParticipantSurveyList from './pages/ParticipantSurveyList';
import ParticipantSurveyHistory from './pages/ParticipantSurveyHistory';

const App: React.FC = () => {
    return (
        <Router>
            <LayoutWrapper>
                <Switch>
                    <Route path="/publisher/surveys" component={PublisherSurveyList} />
                    <Route path="/publisher/survey-editor/:id" component={PublisherSurveyEditor} />
                    <Route path="/publisher/survey-results/:id" component={PublisherSurveyResults} />
                    <Route path="/publisher/report-download/:id" component={PublisherReportDownload} />
                    <Route path="/participant/surveys" component={ParticipantSurveyList} />
                    <Route path="/participant/history" component={ParticipantSurveyHistory} />
                </Switch>
            </LayoutWrapper>
        </Router>
    );
};

export default App;

