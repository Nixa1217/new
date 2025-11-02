import Layout from "./Layout.jsx";

import Compass from "./Compass";

import EveningAlignment from "./EveningAlignment";

import CoreIdentity from "./CoreIdentity";

import WeeklyRecalibration from "./WeeklyRecalibration";

import Vault from "./Vault";

import Frequencies from "./Frequencies";

import Profile from "./Profile";

import MorningEmbodiment from "./MorningEmbodiment";

import EmbodimentMirror from "./EmbodimentMirror";

import IdentityPortal from "./IdentityPortal";

import VisionBoard from "./VisionBoard";

import FitnessGallery from "./FitnessGallery";

import FinancesGallery from "./FinancesGallery";

import TravelGallery from "./TravelGallery";

import LifestyleGallery from "./LifestyleGallery";

import PartnerGallery from "./PartnerGallery";

import SocialGallery from "./SocialGallery";

import DailyJournal from "./DailyJournal";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Compass: Compass,
    
    EveningAlignment: EveningAlignment,
    
    CoreIdentity: CoreIdentity,
    
    WeeklyRecalibration: WeeklyRecalibration,
    
    Vault: Vault,
    
    Frequencies: Frequencies,
    
    Profile: Profile,
    
    MorningEmbodiment: MorningEmbodiment,
    
    EmbodimentMirror: EmbodimentMirror,
    
    IdentityPortal: IdentityPortal,
    
    VisionBoard: VisionBoard,
    
    FitnessGallery: FitnessGallery,
    
    FinancesGallery: FinancesGallery,
    
    TravelGallery: TravelGallery,
    
    LifestyleGallery: LifestyleGallery,
    
    PartnerGallery: PartnerGallery,
    
    SocialGallery: SocialGallery,
    
    DailyJournal: DailyJournal,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Compass />} />
                
                
                <Route path="/Compass" element={<Compass />} />
                
                <Route path="/EveningAlignment" element={<EveningAlignment />} />
                
                <Route path="/CoreIdentity" element={<CoreIdentity />} />
                
                <Route path="/WeeklyRecalibration" element={<WeeklyRecalibration />} />
                
                <Route path="/Vault" element={<Vault />} />
                
                <Route path="/Frequencies" element={<Frequencies />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/MorningEmbodiment" element={<MorningEmbodiment />} />
                
                <Route path="/EmbodimentMirror" element={<EmbodimentMirror />} />
                
                <Route path="/IdentityPortal" element={<IdentityPortal />} />
                
                <Route path="/VisionBoard" element={<VisionBoard />} />
                
                <Route path="/FitnessGallery" element={<FitnessGallery />} />
                
                <Route path="/FinancesGallery" element={<FinancesGallery />} />
                
                <Route path="/TravelGallery" element={<TravelGallery />} />
                
                <Route path="/LifestyleGallery" element={<LifestyleGallery />} />
                
                <Route path="/PartnerGallery" element={<PartnerGallery />} />
                
                <Route path="/SocialGallery" element={<SocialGallery />} />
                
                <Route path="/DailyJournal" element={<DailyJournal />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}