import React, { useState } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import PrivateRoute from "./PrivateRoute";
import UserContext from './UserContext';
import LayoutWrapper from './components/LayoutWrapper';
import Me from './pages/Me';
import ParticipantReplies from './pages/ParticipantReplies';
import ParticipantReplyEditor from './pages/ParticipantReplyEditor';
import PublisherDelegates from './pages/PublisherDelegates';
import PublisherPrizes from './pages/PublisherPrizes';
import PublisherReplySummary from './pages/PublisherReplySummary';
import PublisherSurveys from './pages/PublisherSurveys';
import PublisherTemplates from './pages/PublisherTemplates';
import SurveyEditor from './pages/SurveyEditor';

const App = () => {
    const [me, setMe] = useState(null);
    return (
        <UserContext.Provider value={{ me, setMe }}>
            <Router>
                <LayoutWrapper>
                    <Switch>
                        <PrivateRoute exact path="/" component={PublisherSurveys} />
                        <PrivateRoute path="/publisher/survey-editor/:id" component={SurveyEditor} />
                        <PrivateRoute path="/publisher/surveys" component={PublisherSurveys} />
                        <PrivateRoute path="/publisher/templates" component={PublisherTemplates} />
                        <PrivateRoute path="/publisher/survey/:id/summary" component={PublisherReplySummary} />
                        <PrivateRoute path="/publisher/survey/:id/prizes" component={PublisherPrizes} />
                        <PrivateRoute path="/publisher/delegates" component={PublisherDelegates} />
                        <PrivateRoute path="/participant/reply-editor/:id" component={ParticipantReplyEditor} />
                        <PrivateRoute path="/participant/replies" component={ParticipantReplies} />
                        <PrivateRoute path="/me" component={Me} />
                    </Switch>
                </LayoutWrapper>
            </Router>
        </UserContext.Provider>
    );
};

export default App;

