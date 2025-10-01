import { Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/main/Index.jsx';
import Index2 from './pages/main/Index2.jsx';
import Main1 from './pages/main/Main1.jsx';
import AIPortal from './pages/main/AIPortal.jsx';
import Menu from './pages/menu/Menu.jsx';
import Chat from './pages/chat/Chat.jsx';
import Code from './pages/code/Code.jsx';
import Auth from './pages/auth/Auth.jsx';
import Authaprove from './pages/auth/Authaprove.jsx';
import Authproposal from './pages/auth/Authproposal.jsx';
import Datacollector from './pages/data/Datacollector.jsx';
import Datacollectorchain from './pages/data/Datacollectorchain.jsx';
import Datacollector_Back from './pages/data/Datacollector_Back.jsx';
import Memberjoint from './pages/members/Memberjoint.jsx';
import Modelmanage from './pages/models/Modelmanage.jsx';
import Apimanage from './pages/models/Apimanage.jsx';
import StatSession from './pages/stats/StatSession.jsx';
import StatResponse from './pages/stats/StatResponse.jsx';
import StatToken from './pages/stats/StatToken.jsx';
import StatServer from './pages/stats/StatServer.jsx';
import StatSLLMModel from './pages/stats/StatSLLMModel.jsx';
import StatDataCollector from './pages/stats/StatDataCollector.jsx';
import StatNode from './pages/stats/StatNode.jsx';
import StatTotalMonitor from './pages/stats/StatTotalMonitor.jsx';
import StatAlarm from './pages/stats/StatAlarm.jsx';
import StatAPIs from './pages/stats/StatAPIs.jsx';
import StatSatisfaction from './pages/stats/StatSatisfaction.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/index2" element={<Index2 />} />
      <Route path="/main1" element={<Main1 />} />
      <Route path="/aiportal" element={<AIPortal />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/code" element={<Code />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/authaprove" element={<Authaprove />} />
      <Route path="/authproposal" element={<Authproposal />} />
      <Route path="/datacollector" element={<Datacollector />} />
      <Route path="/datacollectorchain" element={<Datacollectorchain />} />
      <Route path="/datacollector_back" element={<Datacollector_Back />} />
      <Route path="/memberjoint" element={<Memberjoint />} />
      <Route path="/modelmanage" element={<Modelmanage />} />
      <Route path="/Apimanage" element={<Apimanage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/statsession" element={<StatSession />} />
      <Route path="/statresponse" element={<StatResponse />} />
      <Route path="/stattoken" element={<StatToken />} />
      <Route path="/statserver" element={<StatServer />} />
      <Route path="/statsllmmodel" element={<StatSLLMModel />} />
      <Route path="/statdatacollector" element={<StatDataCollector />} />
      <Route path="/statnode" element={<StatNode />} />
      <Route path="/stattotalmonitor" element={<StatTotalMonitor />} />
      <Route path="/statalarm" element={<StatAlarm />} />
      <Route path="/statapis" element={<StatAPIs />} />
      <Route path="/statsatisfaction" element={<StatSatisfaction />} />
    </Routes>
  );
}
