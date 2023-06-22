import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from "./PrivateRoute";
import UsersContext from './UsersContext';
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
        <UsersContext.Provider value={{ users: me, setUsers: setMe }}>
            <HashRouter>
                <LayoutWrapper>
                    <Routes>
                        <Route exact path="/" element={<PrivateRoute component={PublisherSurveys} />} />
                        <Route path="/publisher/survey-editor/:id" element={<PrivateRoute component={SurveyEditor} />} />
                        <Route path="/publisher/surveys" element={<PrivateRoute component={PublisherSurveys} />} />
                        <Route path="/publisher/templates" element={<PrivateRoute component={PublisherTemplates} />} />
                        <Route path="/publisher/survey/:id/summary" element={<PrivateRoute component={PublisherReplySummary} />} />
                        <Route path="/publisher/survey/:id/prizes" element={<PrivateRoute component={PublisherPrizes} />} />
                        <Route path="/publisher/delegates" element={<PrivateRoute component={PublisherDelegates} />} />
                        <Route path="/participant/reply-editor/:id" element={<PrivateRoute component={ParticipantReplyEditor} />} />
                        <Route path="/participant/replies" element={<PrivateRoute component={ParticipantReplies} />} />
                        <Route path="/me" element={<PrivateRoute component={Me} />} />
                    </Routes>
                </LayoutWrapper>
            </HashRouter>
        </UsersContext.Provider>
    );
};

export default App;

